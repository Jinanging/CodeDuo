# CodeDuo 운영 노트

최종 업데이트: 2026-07-20

## 1. 전체 구조

CodeDuo는 개발용 코드, 서버 배포 파일, 실제 데이터가 분리되어 있다.

```text
로컬 맥 CodeDuo
- 코드 수정
- commit / push / PR
- GitHub에 올릴 소스 관리

GitHub main
- 팀원이 공유하는 코드 기준점
- .env, 실제 DB 데이터, 비밀 채점 파일은 올리지 않음

AWS B 서버 ~/CodeDuo
- 실제 서비스 실행용 폴더
- MySQL, Spring Backend 실행
- .env와 config/grading-secrets.json 보관

AWS A 서버 ~/judge0
- Judge0 실행 전용
- B 서버가 내부 IP로 Judge0 API 호출
```

현재 서버 역할은 다음과 같다.

```text
A 서버: codeduo-judge0-server
- Judge0
- B 서버에서 http://172.31.3.169:2358 로 호출

B 서버: codeduo-app-server
- MySQL Docker
- Spring Backend Docker
- React build + Nginx
- 공개 접속 주소: http://13.61.198.219
```

## 2. GitHub에 올리면 안 되는 파일

다음 파일은 서버 실행에 필요하지만 GitHub에 올리면 안 된다.

```text
.env
config/grading-secrets.json
*.pem
```

이 파일들에는 DB 비밀번호, JWT secret, 관리자 초기 비밀번호, 채점용 숨김 테스트케이스 등이 들어갈 수 있다.

## 3. 계정 저장 구조

회원가입하면 `users` 테이블에 계정이 저장된다.

저장되는 주요 값:

```text
id
email
password
nickname
premium
xp
streak_count
hearts
avatar
created_at
updated_at
```

기본값:

```text
premium = false
xp = 0
streak_count = 0
hearts = 5
```

`password`는 원문이 아니라 BCrypt 해시로 저장된다.

로그인할 때는 이메일과 비밀번호를 확인하고 JWT 토큰을 발급한다. 현재 별도 로그인 기록 테이블은 없다.

## 4. 학습 데이터 저장 구조

문제를 제출하면 `submission` 테이블에 제출 기록이 저장된다.

```text
user_id
problem_id
submitted_answer
correct
score
runtime_ms
memory_kb
ai_review
result_message
test_results_json
created_at
```

틀린 문제는 `wrong_answer` 테이블에도 저장된다.

```text
user_id
problem_id
last_answer
reason_summary
created_at
updated_at
```

같은 사용자가 같은 문제를 여러 번 틀리면 오답노트 행이 계속 늘어나는 것이 아니라 기존 행이 업데이트된다.

정답이면 `progress`와 `users`가 갱신된다.

```text
users.xp += 10
users.streak_count = 최소 1 이상
progress.completed_problem_count += 1
progress.last_studied_at 업데이트
```

언어별 XP는 별도 컬럼으로 저장하지 않고, `submission`에서 언어별 정답 제출 수를 세어 계산한다.

```text
언어별 XP = 해당 언어 정답 제출 수 * 10
```

## 5. 문제 저장 구조

문제는 `problem` 테이블에 저장된다.

주요 값:

```text
lesson_id
type
language
difficulty
title
description
answer
code_template
test_input
expected_output
rubric
options_json
hint
explanation
tags_json
test_cases_json
order_index
```

일반 사용자 API는 정답, 해설, 숨김 테스트케이스를 노출하지 않아야 한다.

관리자 API는 관리자 계정만 접근할 수 있고, 문제 추가/수정/삭제를 위해 정답과 테스트케이스를 다룬다.

## 6. 관리자 계정과 문제 관리

관리자 계정은 서버 `.env`에서 설정한다.

```text
ADMIN_BOOTSTRAP_EMAIL=admin@codeduo.dev
ADMIN_BOOTSTRAP_PASSWORD=admin
ADMIN_BOOTSTRAP_NICKNAME=관리자
```

서버 시작 시 해당 이메일 계정이 없으면 자동 생성된다.

관리자 화면:

```text
http://13.61.198.219/admin
```

관리자 계정에서만 왼쪽 메뉴에 `문제 관리`가 보인다. 일반 계정은 메뉴가 보이지 않고, `/admin`에 직접 접근해도 관리자 화면을 볼 수 없다.

문제 삭제 시에는 연결된 제출 기록과 오답노트 기록을 먼저 삭제한 뒤 문제를 삭제한다.

## 7. 문제 추가 흐름

현재 추천 흐름:

```text
1. 관리자 계정 로그인
2. 문제 관리 페이지 접속
3. 문제 추가
4. 일반 레슨 화면에서 노출 확인
5. 제출/채점 확인
```

객관식, 빈칸, 단답형 문제는 `answer`가 필요하다.

코딩 문제는 `test_cases_json`이 필요하다.

예시:

```json
[
  { "input": "2 3", "expected": "5" },
  { "input": "10 4", "expected": "14" }
]
```

## 8. 서버 재배포 흐름

GitHub main에 머지한 뒤 B 서버에서 실행한다.

```bash
cd ~/CodeDuo
git pull --ff-only origin main
docker compose up -d --build --force-recreate spring-app
```

프론트 변경이 있으면 Nginx 배포도 다시 한다.

```bash
cd ~/CodeDuo/frontend
VITE_API_BASE=http://13.61.198.219 npm run build
sudo rsync -a --delete dist/ /var/www/codeduo/
```

## 9. 서버 상태 확인 명령

B 서버:

```bash
cd ~/CodeDuo
docker compose ps
docker logs --tail=80 codeduo-backend
curl http://localhost:8080/swagger-ui/index.html
```

Judge0 연결 확인:

```bash
docker run --rm curlimages/curl:latest http://172.31.3.169:2358/version
```

MySQL 접속:

```bash
docker exec -it codeduo-mysql mysql -ucodeduo -pcodeduo codeduo
```

최근 문제 확인:

```sql
select id, title, language, difficulty, type
from problem
order by id desc
limit 10;
```

최근 제출 확인:

```sql
select id, user_id, problem_id, correct, result_message, created_at
from submission
order by id desc
limit 10;
```

## 10. 친구 SSH 접속

친구에게는 B 서버만 열어주면 된다.

B 서버 보안그룹 SSH 규칙:

```text
Type: SSH
Port: 22
Source: 친구IP/32
```

B 서버 `~/.ssh/authorized_keys`에 친구 공개키를 추가한다.

친구 접속:

```bash
ssh ubuntu@13.61.198.219
```

개인키 `.pem`, `.env`, DB 비밀번호, JWT secret은 공유하지 않는다.
