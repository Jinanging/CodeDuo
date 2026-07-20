#!/usr/bin/env python3
import argparse
import json
import re
import sys
import urllib.error
import urllib.request


FENCE_RE = re.compile(r"```yaml\n(.*?)\n```", re.DOTALL)


def parse_scalar(value):
    value = value.strip()
    if not value:
        return ""
    if value[0] == value[-1:] == '"':
        try:
            return json.loads(value)
        except json.JSONDecodeError:
            return value[1:-1]
    if value[0] == value[-1:] == "'":
        return value[1:-1]
    return value


def parse_yaml_block(block):
    result = {}
    lines = block.splitlines()
    i = 0
    while i < len(lines):
        line = lines[i]
        if not line.strip():
            i += 1
            continue
        if line.startswith(" ") or ":" not in line:
            raise ValueError(f"Cannot parse line: {line}")

        key, raw_value = line.split(":", 1)
        key = key.strip()
        raw_value = raw_value.strip()

        if raw_value == "|":
            i += 1
            collected = []
            while i < len(lines):
                next_line = lines[i]
                if next_line and not next_line.startswith(" "):
                    break
                collected.append(next_line[2:] if next_line.startswith("  ") else next_line)
                i += 1
            result[key] = "\n".join(collected).rstrip("\n")
            continue

        result[key] = parse_scalar(raw_value)
        i += 1

    return result


def parse_problem_bank(path):
    text = open(path, "r", encoding="utf-8").read()
    language_match = re.search(r"언어:\s*`?([A-Z_]+)`?", text)
    default_language = language_match.group(1) if language_match else None

    problems = []
    for match in FENCE_RE.finditer(text):
        block = match.group(1)
        if "type:" not in block or "title:" not in block:
            continue
        problem = parse_yaml_block(block)
        if default_language and "language" not in problem:
            problem["language"] = default_language
        problems.append(problem)
    return problems


def api_json(base_url, path, method="GET", token=None, payload=None):
    body = None
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    if payload is not None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")

    request = urllib.request.Request(
        f"{base_url.rstrip('/')}{path}",
        data=body,
        headers=headers,
        method=method,
    )
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            text = response.read().decode("utf-8")
    except urllib.error.HTTPError as error:
        detail = error.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"HTTP {error.code} {path}: {detail}") from error

    if not text:
        return None
    parsed = json.loads(text)
    if parsed.get("success") is False:
        raise RuntimeError(parsed.get("message") or f"Request failed: {path}")
    return parsed.get("data")


def login(base_url, email, password):
    data = api_json(
        base_url,
        "/api/auth/login",
        method="POST",
        payload={"email": email, "password": password},
    )
    return data["accessToken"]


def normalize_json_field(value):
    if value is None or value == "":
        return None
    if isinstance(value, (list, dict)):
        return json.dumps(value, ensure_ascii=False)
    if isinstance(value, str):
        stripped = value.strip()
        if stripped.startswith("[") or stripped.startswith("{"):
            json.loads(stripped)
        return stripped
    return str(value)


def build_payload(problem, lesson_id):
    required = ["type", "language", "difficulty", "title", "description"]
    missing = [key for key in required if key not in problem or problem[key] in (None, "")]
    if missing:
        raise ValueError(f"{problem.get('title', 'Untitled')} missing fields: {', '.join(missing)}")

    payload = {
        "lessonId": lesson_id,
        "type": str(problem["type"]).upper(),
        "language": str(problem["language"]).upper(),
        "difficulty": int(problem["difficulty"]),
        "title": str(problem["title"]),
        "description": str(problem["description"]),
    }

    text_fields = [
        "answer",
        "codeTemplate",
        "testInput",
        "expectedOutput",
        "rubric",
        "hint",
        "explanation",
    ]
    json_fields = ["optionsJson", "tagsJson", "testCasesJson"]

    for field in text_fields:
        value = problem.get(field)
        if value not in (None, ""):
            payload[field] = str(value)

    for field in json_fields:
        value = normalize_json_field(problem.get(field))
        if value is not None:
            payload[field] = value

    return payload


def make_lesson_map(lessons):
    lesson_map = {}
    for lesson in lessons:
        lesson_map[(lesson["language"].upper(), int(lesson["orderIndex"]))] = lesson["id"]
    return lesson_map


def make_existing_map(problems):
    existing = {}
    for problem in problems:
        key = (
            problem["language"].upper(),
            int(problem["difficulty"]),
            problem["title"].strip(),
        )
        existing[key] = problem
    return existing


def main():
    parser = argparse.ArgumentParser(description="Import CodeDuo problem-bank markdown through the admin API.")
    parser.add_argument("--file", required=True, help="Problem bank markdown file, e.g. docs/problem-bank-python.md")
    parser.add_argument("--base-url", default="http://localhost:8080", help="Backend URL")
    parser.add_argument("--email", required=True, help="Admin email")
    parser.add_argument("--password", required=True, help="Admin password")
    parser.add_argument("--update-existing", action="store_true", help="Update problems with the same language/difficulty/title")
    parser.add_argument("--dry-run", action="store_true", help="Parse and validate only")
    args = parser.parse_args()

    problems = parse_problem_bank(args.file)
    if not problems:
        raise SystemExit("No problems found.")

    print(f"Parsed {len(problems)} problems from {args.file}")
    for problem in problems:
        build_payload(problem, lesson_id=1)

    if args.dry_run:
        for problem in problems[:5]:
            print(f"- {problem['language']} D{problem['difficulty']} {problem['type']}: {problem['title']}")
        print("Dry run complete.")
        return

    token = login(args.base_url, args.email, args.password)
    lessons = api_json(args.base_url, "/api/admin/lessons", token=token)
    lesson_map = make_lesson_map(lessons)
    existing = make_existing_map(api_json(args.base_url, "/api/admin/problems", token=token))

    created = 0
    updated = 0
    skipped = 0

    for problem in problems:
        language = str(problem["language"]).upper()
        difficulty = int(problem["difficulty"])
        lesson_id = lesson_map.get((language, difficulty))
        if lesson_id is None:
            raise RuntimeError(f"No lesson for {language} difficulty/orderIndex {difficulty}: {problem['title']}")

        payload = build_payload(problem, lesson_id)
        key = (language, difficulty, payload["title"].strip())
        old = existing.get(key)
        if old and args.update_existing:
            api_json(args.base_url, f"/api/admin/problems/{old['id']}", method="PUT", token=token, payload=payload)
            updated += 1
        elif old:
            skipped += 1
        else:
            created_problem = api_json(args.base_url, "/api/admin/problems", method="POST", token=token, payload=payload)
            existing[key] = created_problem
            created += 1

    print(f"Done. created={created}, updated={updated}, skipped={skipped}")


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        print(f"ERROR: {error}", file=sys.stderr)
        sys.exit(1)
