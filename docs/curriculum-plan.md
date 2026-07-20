# CodeDuo 문제 확장 계획

최종 업데이트: 2026-07-20

## 1. 목표 문제 수

최종 목표는 4개 언어, 언어별 7개 목차, 목차별 3개 난이도, 난이도별 3문제다.

```text
Python  7목차 x 3난이도 x 3문제 = 63문제
Java    7목차 x 3난이도 x 3문제 = 63문제
C       7목차 x 3난이도 x 3문제 = 63문제
C++     7목차 x 3난이도 x 3문제 = 63문제

총 252문제
```

## 2. 난이도별 문제 유형

각 목차마다 아래 구성을 기본으로 한다.

```text
초급 3문제
- 객관식 2문제
- 빈칸 1문제

중급 3문제
- 단답형 1문제
- 코드 2문제

고급 3문제
- 코드 2문제
- 서술형 1문제
```

언어 1개 기준 문제 유형 수:

```text
객관식 14문제
빈칸 7문제
단답형 7문제
코드 28문제
서술형 7문제

총 63문제
```

전체 4개 언어 기준 문제 유형 수:

```text
객관식 56문제
빈칸 28문제
단답형 28문제
코드 112문제
서술형 28문제

총 252문제
```

## 3. 목차 구조

### Python

```text
1. 변수와 자료형
2. 조건문
3. 반복문
4. 리스트와 딕셔너리
5. 함수
6. 문자열 처리
7. 알고리즘 기초
```

### Java

```text
1. 기본 문법
2. 조건문과 반복문
3. 배열
4. 메서드
5. 클래스와 객체
6. 컬렉션
7. 예외 처리
```

### C

```text
1. 기본 문법
2. 조건문과 반복문
3. 배열
4. 함수
5. 포인터
6. 문자열 처리
7. 구조체와 알고리즘 기초
```

### C++

```text
1. 기본 문법
2. 조건문과 반복문
3. 배열과 문자열
4. 함수
5. 클래스와 객체
6. STL
7. 알고리즘 기초
```

## 4. 현재 DB 구조에 넣는 방식

현재 DB는 `언어 -> 난이도 -> 문제` 구조다.

목차는 별도 테이블이 없으므로 우선 `tagsJson`에 목차명을 넣는다.

예시:

```json
["변수와 자료형"]
```

나중에 프론트에서 목차 선택 UI를 만들 때 이 값을 기준으로 필터링할 수 있다.

## 5. 관리자 페이지 입력 기준

관리자 페이지에서 문제를 추가할 때 필드는 아래 기준으로 채운다.

### 객관식

```text
type: MULTIPLE_CHOICE
answer: 정답 보기 텍스트
optionsJson: ["보기1", "보기2", "보기3", "보기4"]
tagsJson: ["목차명"]
explanation: 해설
```

### 빈칸

```text
type: FILL_BLANK
answer: 빈칸 정답
codeTemplate: 빈칸이 있는 코드
tagsJson: ["목차명"]
explanation: 해설
```

### 단답형

```text
type: SHORT_ANSWER
answer: 정답 문자열
tagsJson: ["목차명"]
explanation: 해설
```

### 코드

```text
type: CODE
codeTemplate: 시작 코드
testCasesJson: 숨김 테스트케이스 배열
tagsJson: ["목차명"]
explanation: 풀이 설명
```

코드 문제의 `testCasesJson` 예시:

```json
[
  { "input": "2 3", "expected": "5" },
  { "input": "10 4", "expected": "14" }
]
```

### 서술형

```text
type: ESSAY
rubric: 채점 기준
tagsJson: ["목차명"]
explanation: 예시 답안 또는 해설
```

현재 AI 채점이 Mock 기반이면 서술형은 데모용으로 먼저 넣고, 실제 LLM 연결 후 본격 사용한다.

## 6. 제작 순서

한 번에 252문제를 넣지 않고 언어별로 검수하면서 진행한다.

```text
1. Python 63문제 제작
2. Python 관리자 페이지 등록/채점 확인
3. Java 63문제 제작
4. Java 등록/채점 확인
5. C 63문제 제작
6. C 등록/채점 확인
7. C++ 63문제 제작
8. C++ 등록/채점 확인
```

각 언어별로 먼저 1개 목차 9문제를 샘플 등록해보고, 화면/채점/오답노트가 괜찮으면 나머지 목차를 채운다.

## 7. 품질 기준

문제는 아래 기준을 만족해야 한다.

```text
- 설명이 한 화면에서 이해 가능해야 함
- 객관식 보기는 정답 하나만 명확해야 함
- 빈칸 정답은 공백 차이로 오답이 나지 않도록 짧게 설계
- 코드 문제는 최소 2개 이상의 테스트케이스 보유
- 고급 코드 문제는 예외 입력이나 경계값 포함
- 서술형은 rubric이 구체적이어야 함
```

## 8. 다음 작업

다음 파일부터 만든다.

```text
docs/problem-bank-python.md
```

이 파일에는 Python 63문제를 관리자 페이지에 옮겨 넣을 수 있는 형태로 작성한다.

## 9. 문제 자동 등록

문제은행 파일을 관리자 API로 자동 등록할 수 있다.

먼저 파싱 검사를 한다.

```bash
python3 scripts/import_problem_bank.py \
  --file docs/problem-bank-python.md \
  --email admin@codeduo.dev \
  --password admin \
  --dry-run
```

로컬 백엔드에 등록한다.

```bash
python3 scripts/import_problem_bank.py \
  --file docs/problem-bank-python.md \
  --base-url http://localhost:8080 \
  --email admin@codeduo.dev \
  --password admin
```

AWS B 서버 터미널에서 등록한다.

```bash
python3 scripts/import_problem_bank.py \
  --file docs/problem-bank-python.md \
  --base-url http://localhost:8080 \
  --email admin@codeduo.dev \
  --password admin
```

내 Mac에서 원격 서버로 직접 등록할 때는 공개 주소를 사용한다.

```bash
python3 scripts/import_problem_bank.py \
  --file docs/problem-bank-python.md \
  --base-url http://13.61.198.219 \
  --email admin@codeduo.dev \
  --password admin
```

이미 같은 `언어 + 난이도 + 제목` 문제가 있으면 기본적으로 건너뛴다.
기존 문제를 덮어써서 수정하려면 `--update-existing` 옵션을 붙인다.
