# Python 문제 은행 v1

언어: `PYTHON`

문제 구성:

```text
7목차 x 3난이도 x 3문제 = 63문제

초급: 객관식 2 + 빈칸 1
중급: 단답형 1 + 코드 2
고급: 코드 2 + 서술형 1
```

관리자 페이지에 넣을 때 `tagsJson`에는 각 목차명을 넣는다.

---

## 1. 변수와 자료형

### PY-01-01

```yaml
type: MULTIPLE_CHOICE
difficulty: 1
title: 변수 대입 방식 고르기
description: 프로필 화면에서 사용자의 나이를 `age` 변수에 저장하려고 합니다. Python 문법으로 가장 자연스러운 코드는?
optionsJson: ["age = 20", "int age = 20", "age := int 20", "var age = 20"]
answer: age = 20
hint: Python은 변수 선언 시 자료형을 앞에 쓰지 않습니다.
explanation: Python은 자료형을 앞에 쓰지 않고 `age = 20`처럼 이름에 값을 바로 대입한다.
tagsJson: ["변수와 자료형"]
```

### PY-01-02

```yaml
type: MULTIPLE_CHOICE
difficulty: 1
title: 숫자처럼 보이는 문자열 구분하기
description: 회원 코드 `123`을 계산용 숫자가 아니라 화면에 그대로 보여줄 문자열로 저장해야 합니다. 문자열 값으로 맞는 것은?
optionsJson: ["123", "\"123\"", "True", "3.14"]
answer: "\"123\""
hint: 문자열은 따옴표로 감쌉니다.
explanation: `"123"`은 숫자처럼 보이지만 따옴표로 감싸져 있으므로 계산용 정수가 아니라 문자열이다.
tagsJson: ["변수와 자료형"]
```

### PY-01-03

```yaml
type: FILL_BLANK
difficulty: 1
title: 입력값 자료형 점검하기
description: 디버깅 중 변수 `x`가 정수인지 문자열인지 확인하려고 합니다. 빈칸에 들어갈 함수는?
codeTemplate: |
  x = 10
  print(____(x))
answer: type
hint: 영어로 자료형을 뜻하는 단어입니다.
explanation: `type(x)`는 변수 `x`의 자료형을 반환한다.
tagsJson: ["변수와 자료형"]
```

### PY-01-04

```yaml
type: SHORT_ANSWER
difficulty: 2
title: 입력 문자열을 숫자로 바꾸기
description: `input()`으로 받은 값 `"42"`를 점수 계산에 쓰기 위해 정수 42로 바꿔야 합니다. 사용하는 Python 함수 이름만 쓰세요.
answer: int
hint: integer의 줄임말입니다.
explanation: `int("42")`는 문자열을 정수로 변환한다.
tagsJson: ["변수와 자료형"]
```

### PY-01-05

```yaml
type: CODE
difficulty: 2
title: 퀴즈 점수 합산
description: 오늘 푼 객관식 점수 a와 코딩 문제 점수 b를 입력받아 총점을 출력하세요.
codeTemplate: |
  a, b = map(int, input().split())
  # 총점을 출력하세요
testCasesJson: |
  [
    { "input": "2 3", "expected": "5" },
    { "input": "-1 5", "expected": "4" },
    { "input": "10 0", "expected": "10" }
  ]
hint: 두 점수를 더한 값을 출력하면 됩니다.
explanation: 입력값을 정수로 변환한 뒤 `a + b`를 출력하면 총점을 구할 수 있다.
tagsJson: ["변수와 자료형"]
```

### PY-01-06

```yaml
type: CODE
difficulty: 2
title: 가입 연차 계산
description: 사용자가 가입한 연도 y를 입력받아 2026년 기준 서비스 이용 연차를 출력하세요. 단, `2026 - y`로 계산합니다.
codeTemplate: |
  y = int(input())
  # 이용 연차를 출력하세요
testCasesJson: |
  [
    { "input": "2023", "expected": "3" },
    { "input": "2026", "expected": "0" },
    { "input": "2020", "expected": "6" }
  ]
hint: 기준 연도에서 가입 연도를 빼면 됩니다.
explanation: `2026 - y`를 출력하면 2026년 기준 이용 연차를 구할 수 있다.
tagsJson: ["변수와 자료형"]
```

### PY-01-07

```yaml
type: CODE
difficulty: 3
title: 세 문제 평균 점수
description: 세 문제의 점수를 입력받아 평균을 소수점 없이 정수 나눗셈 결과로 출력하세요.
codeTemplate: |
  a, b, c = map(int, input().split())
  # 정수 평균을 출력하세요
testCasesJson: |
  [
    { "input": "3 6 9", "expected": "6" },
    { "input": "1 2 3", "expected": "2" },
    { "input": "10 10 11", "expected": "10" }
  ]
hint: Python의 정수 나눗셈 연산자는 `//`입니다.
explanation: `(a + b + c) // 3`을 출력한다.
tagsJson: ["변수와 자료형"]
```

### PY-01-08

```yaml
type: CODE
difficulty: 3
title: 팀 편성 후 남는 인원
description: 전체 인원 a명과 한 팀 인원 b명을 입력받아 만들 수 있는 팀 수와 남는 인원을 공백으로 출력하세요.
codeTemplate: |
  a, b = map(int, input().split())
  # 팀 수와 남는 인원을 출력하세요
testCasesJson: |
  [
    { "input": "7 3", "expected": "2 1" },
    { "input": "10 5", "expected": "2 0" },
    { "input": "20 6", "expected": "3 2" }
  ]
hint: 팀 수는 몫, 남는 인원은 나머지입니다.
explanation: `a // b`는 만들 수 있는 팀 수, `a % b`는 팀에 들어가지 못하고 남는 인원이다.
tagsJson: ["변수와 자료형"]
```

### PY-01-09

```yaml
type: ESSAY
difficulty: 3
title: 동적 타이핑이 편하지만 조심해야 하는 이유
description: Python에서 같은 변수에 숫자와 문자열을 차례로 넣을 수 있습니다. 이 특징이 무엇을 의미하는지, 그리고 왜 디버깅할 때 주의해야 하는지 설명하세요.
rubric: |
  - 변수 선언 시 자료형을 명시하지 않는다는 점을 설명하면 30점
  - 실행 중 값에 따라 변수의 자료형이 결정된다는 점을 설명하면 30점
  - 같은 변수의 자료형이 바뀌면 예상하지 못한 오류가 날 수 있음을 설명하면 25점
  - 간단한 예시를 들면 15점
explanation: Python은 변수에 값을 대입할 때 자료형을 자동으로 결정한다. 편리하지만 같은 변수에 다른 종류의 값을 넣으면 이후 연산에서 오류가 생길 수 있다.
tagsJson: ["변수와 자료형"]
```

---

## 2. 조건문

### PY-02-01

```yaml
type: MULTIPLE_CHOICE
difficulty: 1
title: 통과 조건 작성하기
description: 점수 `x`가 0보다 큰 경우에만 보상을 주려고 합니다. Python 조건문의 올바른 형태는?
optionsJson: ["if x > 0:", "if (x > 0) then", "if x > 0 {", "if x > 0;"]
answer: "if x > 0:"
hint: Python 조건문은 콜론으로 끝납니다.
explanation: Python의 `if` 문은 조건 뒤에 `:`를 붙이고 들여쓰기로 블록을 구분한다.
tagsJson: ["조건문"]
```

### PY-02-02

```yaml
type: MULTIPLE_CHOICE
difficulty: 1
title: 정답 여부 비교하기
description: 사용자가 고른 답과 실제 정답이 같은지 비교하려고 합니다. 두 값이 같은지 비교하는 Python 연산자는?
optionsJson: ["=", "==", "!=", "==="]
answer: "=="
hint: 대입 연산자와 비교 연산자는 다릅니다.
explanation: `=`는 대입, `==`는 값이 같은지 비교하는 연산자다.
tagsJson: ["조건문"]
```

### PY-02-03

```yaml
type: FILL_BLANK
difficulty: 1
title: 실패 메시지 처리하기
description: 60점 이상이면 통과, 그렇지 않으면 실패 메시지를 출력하려고 합니다. 빈칸에 들어갈 키워드는?
codeTemplate: |
  if score >= 60:
      print("pass")
  ____:
      print("fail")
answer: else
hint: if가 아니면 실행되는 블록입니다.
explanation: `else`는 앞 조건이 거짓일 때 실행된다.
tagsJson: ["조건문"]
```

### PY-02-04

```yaml
type: SHORT_ANSWER
difficulty: 2
title: 여러 등급 조건 나누기
description: A, B, C처럼 여러 점수 구간을 차례로 검사할 때 Python에서 `else if` 역할을 하는 키워드를 쓰세요.
answer: elif
hint: else와 if가 합쳐진 형태입니다.
explanation: Python에서는 `else if` 대신 `elif`를 사용한다.
tagsJson: ["조건문"]
```

### PY-02-05

```yaml
type: CODE
difficulty: 2
title: XP 변화 상태 판별
description: XP 변화량 n을 입력받아 증가하면 `positive`, 감소하면 `negative`, 변화가 없으면 `zero`를 출력하세요.
codeTemplate: |
  n = int(input())
  # XP 변화 상태를 출력하세요
testCasesJson: |
  [
    { "input": "5", "expected": "positive" },
    { "input": "-2", "expected": "negative" },
    { "input": "0", "expected": "zero" }
  ]
hint: `if`, `elif`, `else`를 사용하세요.
explanation: n이 0보다 크면 증가, 0보다 작으면 감소, 그 외에는 변화 없음으로 처리한다.
tagsJson: ["조건문"]
```

### PY-02-06

```yaml
type: CODE
difficulty: 2
title: 짝수 번째 문제 표시
description: 문제 번호 n을 입력받아 짝수 번째 문제면 `even`, 홀수 번째 문제면 `odd`를 출력하세요.
codeTemplate: |
  n = int(input())
  # 문제 번호의 짝수/홀수를 출력하세요
testCasesJson: |
  [
    { "input": "4", "expected": "even" },
    { "input": "7", "expected": "odd" },
    { "input": "0", "expected": "even" }
  ]
hint: 2로 나눈 나머지를 확인하세요.
explanation: `n % 2 == 0`이면 짝수다.
tagsJson: ["조건문"]
```

### PY-02-07

```yaml
type: CODE
difficulty: 3
title: 최고 점수 찾기
description: 세 번의 연습 점수를 입력받아 가장 높은 점수를 출력하세요.
codeTemplate: |
  a, b, c = map(int, input().split())
  # 최고 점수를 출력하세요
testCasesJson: |
  [
    { "input": "3 9 2", "expected": "9" },
    { "input": "-1 -5 -3", "expected": "-1" },
    { "input": "7 7 2", "expected": "7" }
  ]
hint: `max()`를 써도 되고 조건문으로 비교해도 됩니다.
explanation: `max(a, b, c)`는 세 점수 중 가장 큰 값을 반환한다.
tagsJson: ["조건문"]
```

### PY-02-08

```yaml
type: CODE
difficulty: 3
title: 풀이 등급 계산
description: 점수 score를 입력받아 90 이상은 A, 80 이상은 B, 70 이상은 C, 그 외는 F를 출력하세요.
codeTemplate: |
  score = int(input())
  # 풀이 등급을 출력하세요
testCasesJson: |
  [
    { "input": "95", "expected": "A" },
    { "input": "80", "expected": "B" },
    { "input": "76", "expected": "C" },
    { "input": "60", "expected": "F" }
  ]
hint: 큰 기준부터 검사하세요.
explanation: `if score >= 90`, `elif score >= 80`처럼 높은 점수부터 비교한다.
tagsJson: ["조건문"]
```

### PY-02-09

```yaml
type: ESSAY
difficulty: 3
title: 등급 조건 순서가 중요한 이유
description: 점수 등급처럼 여러 조건을 검사할 때 조건문의 순서가 중요한 이유를 설명하세요.
rubric: |
  - 위에서부터 순서대로 검사된다는 점을 설명하면 40점
  - 먼저 참이 된 블록만 실행된다는 점을 설명하면 40점
  - 점수 등급 같은 예시를 들면 20점
explanation: 조건문은 위에서 아래로 검사되며, 먼저 참이 되는 조건이 실행되면 뒤 조건은 검사하지 않을 수 있다.
tagsJson: ["조건문"]
```

---

## 3. 반복문

### PY-03-01

```yaml
type: MULTIPLE_CHOICE
difficulty: 1
title: 5문제 번호 만들기
description: 0번부터 4번까지 5개의 문제 번호를 반복 처리하려고 합니다. `range(5)`가 만드는 숫자 범위는?
optionsJson: ["0,1,2,3,4", "1,2,3,4,5", "0,1,2,3,4,5", "5만 포함"]
answer: "0,1,2,3,4"
hint: 끝 값은 포함하지 않습니다.
explanation: `range(5)`는 0부터 4까지 생성한다.
tagsJson: ["반복문"]
```

### PY-03-02

```yaml
type: MULTIPLE_CHOICE
difficulty: 1
title: 반복 블록 구분하기
description: 여러 줄의 보상 계산 코드를 반복문 안에서 실행하려고 합니다. Python 반복문에서 반복 실행할 코드를 구분하는 방법은?
optionsJson: ["들여쓰기", "중괄호", "세미콜론", "괄호"]
answer: 들여쓰기
hint: Python은 블록을 공백으로 구분합니다.
explanation: Python은 들여쓰기로 반복문의 실행 블록을 구분한다.
tagsJson: ["반복문"]
```

### PY-03-03

```yaml
type: FILL_BLANK
difficulty: 1
title: 정해진 횟수만큼 출력하기
description: 문제 번호 0부터 2까지 차례로 출력하려면 빈칸에 들어갈 키워드는?
codeTemplate: |
  ____ i in range(3):
      print(i)
answer: for
hint: 정해진 횟수만큼 반복할 때 자주 씁니다.
explanation: `for i in range(3):`은 i가 0, 1, 2일 때 반복한다.
tagsJson: ["반복문"]
```

### PY-03-04

```yaml
type: SHORT_ANSWER
difficulty: 2
title: 목표 달성 후 반복 멈추기
description: 목표 점수를 찾으면 더 확인하지 않고 반복문을 즉시 종료하려고 합니다. 사용하는 Python 키워드를 쓰세요.
answer: break
hint: 멈추다는 뜻의 영어 단어입니다.
explanation: `break`는 현재 반복문을 즉시 빠져나간다.
tagsJson: ["반복문"]
```

### PY-03-05

```yaml
type: CODE
difficulty: 2
title: 누적 출석 보상 계산
description: 연속 출석일 n을 입력받아 1일부터 n일까지 매일 1점씩 늘어나는 보상의 총합을 출력하세요.
codeTemplate: |
  n = int(input())
  total = 0
  # 1일부터 n일까지 보상을 더하세요
testCasesJson: |
  [
    { "input": "5", "expected": "15" },
    { "input": "1", "expected": "1" },
    { "input": "10", "expected": "55" }
  ]
hint: `for i in range(1, n + 1)`을 사용하세요.
explanation: 1부터 n까지 반복하며 total에 더한다.
tagsJson: ["반복문"]
```

### PY-03-06

```yaml
type: CODE
difficulty: 2
title: 짝수 번호 문제 세기
description: 첫 줄에 문제 수 n, 둘째 줄에 n개의 문제 번호가 주어집니다. 짝수 번호 문제의 개수를 출력하세요.
codeTemplate: |
  n = int(input())
  nums = list(map(int, input().split()))
  # 짝수 번호 문제 개수를 출력하세요
testCasesJson: |
  [
    { "input": "5\n1 2 3 4 5", "expected": "2" },
    { "input": "3\n2 4 6", "expected": "3" },
    { "input": "4\n1 3 5 7", "expected": "0" }
  ]
hint: 각 수를 2로 나눈 나머지를 확인하세요.
explanation: 리스트를 반복하면서 `num % 2 == 0`인 값을 센다.
tagsJson: ["반복문"]
```

### PY-03-07

```yaml
type: CODE
difficulty: 3
title: 반복 출력 형식 맞추기
description: 정수 n을 입력받아 n단을 1부터 9까지 한 줄씩 출력하세요. 형식은 `n x i = 값`입니다.
codeTemplate: |
  n = int(input())
  # 구구단을 출력하세요
testCasesJson: |
  [
    { "input": "2", "expected": "2 x 1 = 2\n2 x 2 = 4\n2 x 3 = 6\n2 x 4 = 8\n2 x 5 = 10\n2 x 6 = 12\n2 x 7 = 14\n2 x 8 = 16\n2 x 9 = 18" },
    { "input": "3", "expected": "3 x 1 = 3\n3 x 2 = 6\n3 x 3 = 9\n3 x 4 = 12\n3 x 5 = 15\n3 x 6 = 18\n3 x 7 = 21\n3 x 8 = 24\n3 x 9 = 27" },
    { "input": "1", "expected": "1 x 1 = 1\n1 x 2 = 2\n1 x 3 = 3\n1 x 4 = 4\n1 x 5 = 5\n1 x 6 = 6\n1 x 7 = 7\n1 x 8 = 8\n1 x 9 = 9" }
  ]
hint: f-string을 사용하면 출력 형식을 맞추기 쉽습니다.
explanation: 1부터 9까지 반복하며 `n * i`를 출력한다.
tagsJson: ["반복문"]
```

### PY-03-08

```yaml
type: CODE
difficulty: 3
title: 단계별 완료 배지 출력
description: 완료 단계 n을 입력받아 첫 줄 1개부터 n번째 줄 n개까지 완료 배지 `*`을 출력하세요.
codeTemplate: |
  n = int(input())
  # 단계별 완료 배지를 출력하세요
testCasesJson: |
  [
    { "input": "3", "expected": "*\n**\n***" },
    { "input": "5", "expected": "*\n**\n***\n****\n*****" },
    { "input": "1", "expected": "*" }
  ]
hint: 문자열도 곱셈이 가능합니다.
explanation: i번째 줄에 `"*" * i`를 출력한다.
tagsJson: ["반복문"]
```

### PY-03-09

```yaml
type: ESSAY
difficulty: 3
title: 반복문 선택 기준 설명하기
description: Python에서 반복 대상이 정해진 경우와 특정 조건이 될 때까지 반복하는 경우에 `for` 문과 `while` 문을 어떻게 선택하면 좋은지 설명하세요.
rubric: |
  - for는 정해진 범위나 iterable 반복에 적합하다고 설명하면 40점
  - while은 조건이 참인 동안 반복한다고 설명하면 40점
  - 사용 예시를 들면 20점
explanation: `for`는 리스트나 range처럼 반복 대상이 명확할 때, `while`은 조건 중심 반복에 적합하다.
tagsJson: ["반복문"]
```

---

## 4. 리스트와 딕셔너리

### PY-04-01

```yaml
type: MULTIPLE_CHOICE
difficulty: 1
title: 두 번째 점수 꺼내기
description: 점수 리스트 `arr = [10, 20, 30]`에서 두 번째 점수인 `arr[1]`의 값은?
optionsJson: ["10", "20", "30", "오류"]
answer: "20"
hint: Python 인덱스는 0부터 시작합니다.
explanation: `arr[0]`은 10, `arr[1]`은 20이다.
tagsJson: ["리스트와 딕셔너리"]
```

### PY-04-02

```yaml
type: MULTIPLE_CHOICE
difficulty: 1
title: 사용자 정보 저장 방식
description: 사용자 이름과 점수처럼 이름표가 붙은 데이터를 저장할 때 Python 딕셔너리는 어떤 쌍으로 데이터를 저장하나요?
optionsJson: ["키와 값", "인덱스와 순서", "함수와 변수", "조건과 반복"]
answer: 키와 값
hint: 영어로 key-value라고 부릅니다.
explanation: 딕셔너리는 key-value 쌍으로 데이터를 저장한다.
tagsJson: ["리스트와 딕셔너리"]
```

### PY-04-03

```yaml
type: FILL_BLANK
difficulty: 1
title: 새 점수 추가하기
description: 풀이 점수 리스트의 끝에 새 점수를 추가할 때 사용하는 메서드는?
codeTemplate: |
  nums = [1, 2]
  nums.____(3)
  print(nums)
answer: append
hint: 리스트 끝에 덧붙이는 메서드입니다.
explanation: `append()`는 리스트의 마지막에 값을 추가한다.
tagsJson: ["리스트와 딕셔너리"]
```

### PY-04-04

```yaml
type: SHORT_ANSWER
difficulty: 2
title: 저장된 문제 수 확인하기
description: 풀이한 문제 번호 리스트 `nums`의 길이를 구하는 함수 이름만 쓰세요.
answer: len
hint: length의 줄임말처럼 보입니다.
explanation: `len(nums)`는 리스트의 원소 개수를 반환한다.
tagsJson: ["리스트와 딕셔너리"]
```

### PY-04-05

```yaml
type: CODE
difficulty: 2
title: 최고 점수 찾기
description: 첫 줄에 점수 개수 n, 둘째 줄에 n개의 점수가 주어집니다. 리스트에서 가장 큰 점수를 출력하세요.
codeTemplate: |
  n = int(input())
  nums = list(map(int, input().split()))
  # 최댓값을 출력하세요
testCasesJson: |
  [
    { "input": "5\n1 9 3 2 7", "expected": "9" },
    { "input": "3\n-5 -2 -8", "expected": "-2" },
    { "input": "1\n42", "expected": "42" }
  ]
hint: `max()` 함수를 사용할 수 있습니다.
explanation: `max(nums)`는 리스트에서 가장 큰 값을 반환한다.
tagsJson: ["리스트와 딕셔너리"]
```

### PY-04-06

```yaml
type: CODE
difficulty: 2
title: 푼 문제인지 확인하기
description: 첫 줄에 n, 둘째 줄에 푼 문제 번호 n개, 셋째 줄에 찾을 문제 번호 x가 주어집니다. x가 리스트에 있으면 `YES`, 없으면 `NO`를 출력하세요.
codeTemplate: |
  n = int(input())
  nums = list(map(int, input().split()))
  x = int(input())
  # 존재 여부를 출력하세요
testCasesJson: |
  [
    { "input": "5\n1 2 3 4 5\n3", "expected": "YES" },
    { "input": "4\n10 20 30 40\n25", "expected": "NO" },
    { "input": "1\n7\n7", "expected": "YES" }
  ]
hint: `in` 연산자를 사용하세요.
explanation: `x in nums`로 값의 존재 여부를 확인할 수 있다.
tagsJson: ["리스트와 딕셔너리"]
```

### PY-04-07

```yaml
type: CODE
difficulty: 3
title: 자주 틀린 유형 세기
description: 한 줄에 공백으로 구분된 오답 유형들이 주어집니다. 딕셔너리로 등장 횟수를 세고, 가장 많이 나온 유형의 횟수를 출력하세요.
codeTemplate: |
  words = input().split()
  # 가장 많이 나온 단어의 횟수를 출력하세요
testCasesJson: |
  [
    { "input": "apple banana apple", "expected": "2" },
    { "input": "a b c a b a", "expected": "3" },
    { "input": "one", "expected": "1" }
  ]
hint: 딕셔너리에서 `counts[word]`를 증가시키세요.
explanation: 단어별 횟수를 저장한 뒤 `max(counts.values())`를 출력한다.
tagsJson: ["리스트와 딕셔너리"]
```

### PY-04-08

```yaml
type: CODE
difficulty: 3
title: 중복 문제 번호 정리하기
description: 첫 줄에 n, 둘째 줄에 n개의 문제 번호가 주어집니다. 중복을 제거하고 오름차순으로 출력하세요.
codeTemplate: |
  n = int(input())
  nums = list(map(int, input().split()))
  # 중복 제거 후 정렬해 출력하세요
testCasesJson: |
  [
    { "input": "6\n3 1 2 3 2 1", "expected": "1 2 3" },
    { "input": "5\n5 5 5 5 5", "expected": "5" },
    { "input": "4\n-1 2 -1 0", "expected": "-1 0 2" }
  ]
hint: `set()`과 `sorted()`를 함께 사용할 수 있습니다.
explanation: `sorted(set(nums))`로 중복 제거와 정렬을 한 번에 처리한다.
tagsJson: ["리스트와 딕셔너리"]
```

### PY-04-09

```yaml
type: ESSAY
difficulty: 3
title: 리스트와 딕셔너리 선택 기준
description: 문제 풀이 순서를 저장할 때와 사용자별 점수를 저장할 때, 리스트와 딕셔너리 중 무엇을 선택하면 좋은지 설명하세요.
rubric: |
  - 순서가 중요하거나 인덱스로 접근할 때 리스트가 적합하다고 설명하면 35점
  - 키로 값을 빠르게 찾을 때 딕셔너리가 적합하다고 설명하면 35점
  - 예시를 들면 30점
explanation: 순서 있는 여러 값을 다룰 때는 리스트, 이름이나 ID 같은 키로 값을 찾을 때는 딕셔너리가 적합하다.
tagsJson: ["리스트와 딕셔너리"]
```

---

## 5. 함수

### PY-05-01

```yaml
type: MULTIPLE_CHOICE
difficulty: 1
title: 재사용할 계산 만들기
description: 같은 점수 계산 로직을 여러 번 쓰기 위해 함수를 정의하려고 합니다. Python에서 함수를 정의할 때 사용하는 키워드는?
optionsJson: ["def", "func", "function", "method"]
answer: def
hint: define의 줄임말입니다.
explanation: Python은 `def 함수명():` 형태로 함수를 정의한다.
tagsJson: ["함수"]
```

### PY-05-02

```yaml
type: MULTIPLE_CHOICE
difficulty: 1
title: 계산 결과 돌려주기
description: 함수가 계산한 점수를 호출한 곳으로 돌려줄 때 사용하는 키워드는?
optionsJson: ["return", "print", "break", "yielding"]
answer: return
hint: 함수 밖으로 값을 돌려보냅니다.
explanation: `return`은 함수의 결과값을 호출한 곳으로 반환한다.
tagsJson: ["함수"]
```

### PY-05-03

```yaml
type: FILL_BLANK
difficulty: 1
title: 만든 함수 실행하기
description: 미리 정의한 함수 `hello`를 실행하려면 빈칸에 들어갈 코드는?
codeTemplate: |
  def hello():
      print("hi")
  
  ____
answer: hello()
hint: 함수 이름 뒤에 괄호를 붙입니다.
explanation: 함수를 실행하려면 `hello()`처럼 호출해야 한다.
tagsJson: ["함수"]
```

### PY-05-04

```yaml
type: SHORT_ANSWER
difficulty: 2
title: 함수 입력값 이름
description: 함수가 점수나 문제 번호 같은 입력값을 받기 위해 괄호 안에 정의하는 이름을 무엇이라고 하나요?
answer: 매개변수
hint: 영어로 parameter입니다.
explanation: 매개변수는 함수가 호출될 때 전달받는 값을 담는 변수다.
tagsJson: ["함수"]
```

### PY-05-05

```yaml
type: CODE
difficulty: 2
title: 보정 점수 함수
description: 정수 n을 입력받아 난이도 보정 점수인 n의 제곱을 출력하세요. 함수 `square(n)`을 정의해서 사용하세요.
codeTemplate: |
  def square(n):
      # 제곱을 반환하세요
      pass
  
  n = int(input())
  print(square(n))
testCasesJson: |
  [
    { "input": "3", "expected": "9" },
    { "input": "-4", "expected": "16" },
    { "input": "0", "expected": "0" }
  ]
hint: `return n * n`을 사용하세요.
explanation: 함수가 `n * n`을 반환하도록 작성한다.
tagsJson: ["함수"]
```

### PY-05-06

```yaml
type: CODE
difficulty: 2
title: 높은 점수 반환 함수
description: 두 라운드 점수 a, b를 입력받아 더 높은 점수를 출력하세요. 함수 `bigger(a, b)`를 정의해서 사용하세요.
codeTemplate: |
  def bigger(a, b):
      # 더 큰 값을 반환하세요
      pass
  
  a, b = map(int, input().split())
  print(bigger(a, b))
testCasesJson: |
  [
    { "input": "3 5", "expected": "5" },
    { "input": "10 2", "expected": "10" },
    { "input": "7 7", "expected": "7" }
  ]
hint: `max(a, b)`를 사용할 수 있습니다.
explanation: 함수 안에서 두 값을 비교하거나 `max`로 큰 값을 반환한다.
tagsJson: ["함수"]
```

### PY-05-07

```yaml
type: CODE
difficulty: 3
title: 단계별 경우의 수 계산
description: 단계 수 n을 입력받아 n!을 출력하세요. 함수 `factorial(n)`을 정의해서 사용하세요.
codeTemplate: |
  def factorial(n):
      result = 1
      # 팩토리얼을 계산하세요
      return result
  
  n = int(input())
  print(factorial(n))
testCasesJson: |
  [
    { "input": "5", "expected": "120" },
    { "input": "1", "expected": "1" },
    { "input": "0", "expected": "1" }
  ]
hint: 1부터 n까지 곱하세요. 0!은 1입니다.
explanation: 반복문으로 1부터 n까지 result에 곱한다.
tagsJson: ["함수"]
```

### PY-05-08

```yaml
type: CODE
difficulty: 3
title: 특별 문제 번호 판별
description: 문제 번호 n을 입력받아 소수면 `prime`, 아니면 `not prime`을 출력하세요. 함수 `is_prime(n)`을 정의해서 사용하세요.
codeTemplate: |
  def is_prime(n):
      # 소수 여부를 반환하세요
      pass
  
  n = int(input())
  print("prime" if is_prime(n) else "not prime")
testCasesJson: |
  [
    { "input": "2", "expected": "prime" },
    { "input": "9", "expected": "not prime" },
    { "input": "17", "expected": "prime" },
    { "input": "1", "expected": "not prime" }
  ]
hint: 2보다 작은 수는 소수가 아닙니다.
explanation: 2부터 n의 제곱근까지 나누어 떨어지는 수가 있는지 검사한다.
tagsJson: ["함수"]
```

### PY-05-09

```yaml
type: ESSAY
difficulty: 3
title: 함수로 코드를 나누는 이유
description: 점수 계산, 등급 판정처럼 반복되는 로직을 함수로 분리하면 좋은 이유를 설명하세요.
rubric: |
  - 코드 재사용성을 설명하면 35점
  - 코드 구조화와 가독성을 설명하면 35점
  - 유지보수 또는 테스트가 쉬워진다는 점을 설명하면 30점
explanation: 함수는 반복되는 코드를 묶고, 프로그램을 작은 단위로 나누어 읽고 수정하기 쉽게 만든다.
tagsJson: ["함수"]
```

---

## 6. 문자열 처리

### PY-06-01

```yaml
type: MULTIPLE_CHOICE
difficulty: 1
title: 닉네임 길이 확인하기
description: 문자열 `s`에 저장된 닉네임의 길이를 구하는 코드는?
optionsJson: ["len(s)", "s.len()", "length(s)", "s.length"]
answer: len(s)
hint: 리스트 길이를 구할 때도 같은 함수를 씁니다.
explanation: Python은 `len(s)`로 문자열 길이를 구한다.
tagsJson: ["문자열 처리"]
```

### PY-06-02

```yaml
type: MULTIPLE_CHOICE
difficulty: 1
title: 첫 글자 확인하기
description: `s = "code"`일 때 첫 글자인 `s[0]`의 값은?
optionsJson: ["c", "o", "code", "오류"]
answer: c
hint: 인덱스는 0부터 시작합니다.
explanation: 문자열도 리스트처럼 인덱스로 문자에 접근할 수 있다.
tagsJson: ["문자열 처리"]
```

### PY-06-03

```yaml
type: FILL_BLANK
difficulty: 1
title: 코드 이름 대문자로 통일하기
description: 문자열 `s`에 저장된 코드 이름을 모두 대문자로 바꾸려면 빈칸에 들어갈 메서드는?
codeTemplate: |
  s = "hello"
  print(s.____())
answer: upper
hint: upper case를 떠올려보세요.
explanation: `upper()`는 문자열을 대문자로 변환한다.
tagsJson: ["문자열 처리"]
```

### PY-06-04

```yaml
type: SHORT_ANSWER
difficulty: 2
title: 입력 문장을 단어로 나누기
description: 공백으로 구분된 오답 유형 문자열을 리스트로 나누는 메서드 이름만 쓰세요.
answer: split
hint: 쪼갠다는 뜻의 영어 단어입니다.
explanation: `split()`은 문자열을 나누어 리스트로 반환한다.
tagsJson: ["문자열 처리"]
```

### PY-06-05

```yaml
type: CODE
difficulty: 2
title: 특정 문자 개수 세기
description: 문자열 s와 문자 ch가 주어집니다. 닉네임이나 코드 안에 ch가 몇 번 등장하는지 출력하세요.
codeTemplate: |
  s = input()
  ch = input()
  # 등장 횟수를 출력하세요
testCasesJson: |
  [
    { "input": "banana\na", "expected": "3" },
    { "input": "hello\nl", "expected": "2" },
    { "input": "code\nz", "expected": "0" }
  ]
hint: `count()` 메서드를 사용할 수 있습니다.
explanation: `s.count(ch)`는 문자열 안의 특정 문자 등장 횟수를 반환한다.
tagsJson: ["문자열 처리"]
```

### PY-06-06

```yaml
type: CODE
difficulty: 2
title: 코드 문자열 역순 출력
description: 문자열 s를 입력받아 마지막 문자부터 거꾸로 출력하세요.
codeTemplate: |
  s = input()
  # 뒤집은 문자열을 출력하세요
testCasesJson: |
  [
    { "input": "abc", "expected": "cba" },
    { "input": "level", "expected": "level" },
    { "input": "python", "expected": "nohtyp" }
  ]
hint: 슬라이싱 `[::-1]`을 사용할 수 있습니다.
explanation: `s[::-1]`은 문자열을 역순으로 만든다.
tagsJson: ["문자열 처리"]
```

### PY-06-07

```yaml
type: CODE
difficulty: 3
title: 대칭 코드 판별
description: 문자열 s를 입력받아 앞뒤가 같은 대칭 코드이면 `YES`, 아니면 `NO`를 출력하세요.
codeTemplate: |
  s = input()
  # 팰린드롬 여부를 출력하세요
testCasesJson: |
  [
    { "input": "level", "expected": "YES" },
    { "input": "python", "expected": "NO" },
    { "input": "abba", "expected": "YES" }
  ]
hint: 원래 문자열과 뒤집은 문자열을 비교하세요.
explanation: `s == s[::-1]`이면 팰린드롬이다.
tagsJson: ["문자열 처리"]
```

### PY-06-08

```yaml
type: CODE
difficulty: 3
title: 학습 문구 약어 만들기
description: 한 줄에 여러 단어가 주어집니다. 각 단어의 첫 글자를 이어 붙여 약어를 출력하세요.
codeTemplate: |
  words = input().split()
  # 첫 글자를 이어 붙여 출력하세요
testCasesJson: |
  [
    { "input": "code duo project", "expected": "cdp" },
    { "input": "hello world", "expected": "hw" },
    { "input": "a bb ccc", "expected": "abc" }
  ]
hint: 각 단어의 0번 인덱스를 사용하세요.
explanation: 반복문으로 각 단어의 첫 문자를 모아 문자열을 만든다.
tagsJson: ["문자열 처리"]
```

### PY-06-09

```yaml
type: ESSAY
difficulty: 3
title: 문자열을 직접 바꿀 수 없는 이유
description: Python 문자열이 불변 객체라는 말의 의미와, 일부 글자를 바꾸려면 새 문자열을 만들어야 하는 이유를 설명하세요.
rubric: |
  - 문자열의 일부 문자를 직접 바꿀 수 없다는 점을 설명하면 40점
  - 수정처럼 보이는 연산은 새 문자열을 만든다는 점을 설명하면 40점
  - 예시를 들면 20점
explanation: Python 문자열은 생성 후 내부 문자를 직접 바꿀 수 없고, 변경 연산은 새로운 문자열을 만든다.
tagsJson: ["문자열 처리"]
```

---

## 7. 알고리즘 기초

### PY-07-01

```yaml
type: MULTIPLE_CHOICE
difficulty: 1
title: 문제 번호 차례대로 찾기
description: 풀이 기록 리스트의 처음부터 끝까지 차례대로 문제 번호를 찾는 방법은?
optionsJson: ["선형 탐색", "이진 탐색", "해시", "정렬"]
answer: 선형 탐색
hint: 순서대로 하나씩 확인합니다.
explanation: 선형 탐색은 모든 원소를 앞에서부터 차례대로 확인한다.
tagsJson: ["알고리즘 기초"]
```

### PY-07-02

```yaml
type: MULTIPLE_CHOICE
difficulty: 1
title: 낮은 점수부터 정렬하기
description: 다음 중 낮은 점수부터 높은 점수 순서로 오름차순 정렬된 것은?
optionsJson: ["1 2 3 4", "4 3 2 1", "1 3 2 4", "2 1 4 3"]
answer: "1 2 3 4"
hint: 작은 값에서 큰 값 순서입니다.
explanation: 오름차순은 값이 작은 것부터 큰 것 순서로 나열하는 것이다.
tagsJson: ["알고리즘 기초"]
```

### PY-07-03

```yaml
type: FILL_BLANK
difficulty: 1
title: 정렬된 복사본 만들기
description: 원본 점수 리스트 `nums`는 유지하고 정렬된 새 리스트를 만들려면 빈칸에 들어갈 함수는?
codeTemplate: |
  nums = [3, 1, 2]
  result = ____(nums)
  print(result)
answer: sorted
hint: sort의 과거분사처럼 생겼습니다.
explanation: `sorted(nums)`는 정렬된 새 리스트를 반환한다.
tagsJson: ["알고리즘 기초"]
```

### PY-07-04

```yaml
type: SHORT_ANSWER
difficulty: 2
title: 바로 끝나는 알고리즘 표현
description: 알고리즘의 실행 시간이 입력 크기와 거의 무관할 때 Big-O 표기에서 상수 시간은 어떻게 쓰나요?
answer: O(1)
hint: 입력 크기와 관계없이 일정한 시간입니다.
explanation: 상수 시간 복잡도는 `O(1)`로 표현한다.
tagsJson: ["알고리즘 기초"]
```

### PY-07-05

```yaml
type: CODE
difficulty: 2
title: 가장 낮은 점수 찾기
description: 첫 줄에 n, 둘째 줄에 n개의 점수가 주어집니다. 가장 낮은 점수를 출력하세요.
codeTemplate: |
  n = int(input())
  nums = list(map(int, input().split()))
  # 최솟값을 출력하세요
testCasesJson: |
  [
    { "input": "5\n3 1 4 2 5", "expected": "1" },
    { "input": "3\n-1 -7 -3", "expected": "-7" },
    { "input": "1\n9", "expected": "9" }
  ]
hint: `min()`을 사용할 수 있습니다.
explanation: `min(nums)`는 리스트에서 가장 작은 값을 반환한다.
tagsJson: ["알고리즘 기초"]
```

### PY-07-06

```yaml
type: CODE
difficulty: 2
title: 점수 합과 평균 계산
description: 첫 줄에 n, 둘째 줄에 n개의 점수가 주어집니다. 합과 정수 평균을 공백으로 출력하세요.
codeTemplate: |
  n = int(input())
  nums = list(map(int, input().split()))
  # 합과 정수 평균을 출력하세요
testCasesJson: |
  [
    { "input": "3\n3 6 9", "expected": "18 6" },
    { "input": "4\n1 2 3 4", "expected": "10 2" },
    { "input": "2\n5 6", "expected": "11 5" }
  ]
hint: 평균은 합을 n으로 정수 나눗셈하세요.
explanation: `sum(nums)`와 `sum(nums) // n`을 출력한다.
tagsJson: ["알고리즘 기초"]
```

### PY-07-07

```yaml
type: CODE
difficulty: 3
title: 목표 점수 조합 찾기
description: 첫 줄에 n과 target, 둘째 줄에 n개의 점수가 주어집니다. 서로 다른 두 점수의 합이 target이 되면 `YES`, 없으면 `NO`를 출력하세요.
codeTemplate: |
  n, target = map(int, input().split())
  nums = list(map(int, input().split()))
  # 두 수 합 존재 여부를 출력하세요
testCasesJson: |
  [
    { "input": "5 9\n2 7 11 15 1", "expected": "YES" },
    { "input": "4 10\n1 2 3 4", "expected": "NO" },
    { "input": "3 6\n3 3 1", "expected": "YES" }
  ]
hint: 이미 본 수를 set에 저장하면 빠르게 찾을 수 있습니다.
explanation: 각 수 x에 대해 `target - x`가 이전에 나왔는지 set으로 확인한다.
tagsJson: ["알고리즘 기초"]
```

### PY-07-08

```yaml
type: CODE
difficulty: 3
title: 연속 성장 구간 찾기
description: 첫 줄에 n, 둘째 줄에 n일간의 풀이 수가 주어집니다. 연속으로 증가하는 가장 긴 구간의 길이를 출력하세요.
codeTemplate: |
  n = int(input())
  nums = list(map(int, input().split()))
  # 가장 긴 연속 증가 구간 길이를 출력하세요
testCasesJson: |
  [
    { "input": "6\n1 2 3 2 3 4", "expected": "3" },
    { "input": "5\n5 4 3 2 1", "expected": "1" },
    { "input": "7\n1 2 2 3 4 5 1", "expected": "4" }
  ]
hint: 현재 길이와 최대 길이를 따로 관리하세요.
explanation: 이전 값보다 크면 현재 길이를 늘리고, 아니면 1로 초기화한다.
tagsJson: ["알고리즘 기초"]
```

### PY-07-09

```yaml
type: ESSAY
difficulty: 3
title: 효율적인 알고리즘이 중요한 이유
description: 같은 추천 문제를 찾더라도 시간 복잡도가 더 낮은 알고리즘이 입력이 많아질수록 중요한 이유를 설명하세요.
rubric: |
  - 입력 크기가 커질수록 실행 시간 차이가 커진다는 점을 설명하면 40점
  - 시간 제한 또는 사용자 경험과 연결하면 30점
  - O(n), O(n^2) 같은 예시를 들면 30점
explanation: 입력이 작을 때는 차이가 작아도, 입력이 커지면 시간 복잡도가 낮은 알고리즘이 훨씬 빠르게 동작한다.
tagsJson: ["알고리즘 기초"]
```
