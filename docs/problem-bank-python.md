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
title: Python 변수 선언
description: Python에서 변수 `age`에 정수 20을 저장하는 올바른 코드는?
optionsJson: ["age = 20", "int age = 20", "age := int 20", "var age = 20"]
answer: age = 20
hint: Python은 변수 선언 시 자료형을 앞에 쓰지 않습니다.
explanation: Python은 `age = 20`처럼 대입 연산자 `=`로 변수를 만든다.
tagsJson: ["변수와 자료형"]
```

### PY-01-02

```yaml
type: MULTIPLE_CHOICE
difficulty: 1
title: 문자열 자료형
description: 다음 중 Python 문자열 값은?
optionsJson: ["123", "\"123\"", "True", "3.14"]
answer: "\"123\""
hint: 문자열은 따옴표로 감쌉니다.
explanation: `"123"`은 숫자처럼 보이지만 따옴표로 감싸져 있으므로 문자열이다.
tagsJson: ["변수와 자료형"]
```

### PY-01-03

```yaml
type: FILL_BLANK
difficulty: 1
title: 자료형 확인 함수
description: 변수 `x`의 자료형을 확인하려면 빈칸에 들어갈 함수는?
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
title: 정수 변환 함수
description: 문자열 `"42"`를 정수 42로 바꿀 때 사용하는 Python 함수 이름만 쓰세요.
answer: int
hint: integer의 줄임말입니다.
explanation: `int("42")`는 문자열을 정수로 변환한다.
tagsJson: ["변수와 자료형"]
```

### PY-01-05

```yaml
type: CODE
difficulty: 2
title: 두 수의 합
description: 두 정수 a, b를 입력받아 합을 출력하세요.
codeTemplate: |
  a, b = map(int, input().split())
  # 합을 출력하세요
testCasesJson: |
  [
    { "input": "2 3", "expected": "5" },
    { "input": "-1 5", "expected": "4" },
    { "input": "10 0", "expected": "10" }
  ]
hint: `a + b`를 출력하면 됩니다.
explanation: 입력값을 정수로 변환한 뒤 `a + b`를 출력한다.
tagsJson: ["변수와 자료형"]
```

### PY-01-06

```yaml
type: CODE
difficulty: 2
title: 나이 계산
description: 태어난 연도 y를 입력받아 2026년 기준 나이를 출력하세요. 단, 한국식 나이가 아니라 단순히 `2026 - y`로 계산합니다.
codeTemplate: |
  y = int(input())
  # 나이를 출력하세요
testCasesJson: |
  [
    { "input": "2000", "expected": "26" },
    { "input": "2010", "expected": "16" },
    { "input": "1999", "expected": "27" }
  ]
hint: 기준 연도에서 태어난 연도를 빼면 됩니다.
explanation: `2026 - y`를 출력하면 된다.
tagsJson: ["변수와 자료형"]
```

### PY-01-07

```yaml
type: CODE
difficulty: 3
title: 평균 계산
description: 세 정수를 입력받아 평균을 소수점 없이 정수 나눗셈 결과로 출력하세요.
codeTemplate: |
  a, b, c = map(int, input().split())
  # 평균을 출력하세요
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
title: 몫과 나머지
description: 두 양의 정수 a, b를 입력받아 a를 b로 나눈 몫과 나머지를 공백으로 출력하세요.
codeTemplate: |
  a, b = map(int, input().split())
  # 몫과 나머지를 출력하세요
testCasesJson: |
  [
    { "input": "7 3", "expected": "2 1" },
    { "input": "10 5", "expected": "2 0" },
    { "input": "20 6", "expected": "3 2" }
  ]
hint: 몫은 `//`, 나머지는 `%`입니다.
explanation: `print(a // b, a % b)`로 몫과 나머지를 함께 출력한다.
tagsJson: ["변수와 자료형"]
```

### PY-01-09

```yaml
type: ESSAY
difficulty: 3
title: 동적 타이핑 설명
description: Python이 동적 타이핑 언어라는 말의 의미를 간단히 설명하세요.
rubric: |
  - 변수 선언 시 자료형을 명시하지 않는다는 점을 설명하면 40점
  - 실행 중 값에 따라 변수의 자료형이 결정된다는 점을 설명하면 40점
  - 예시를 들면 20점
explanation: Python은 변수에 값을 대입할 때 자료형을 자동으로 결정하며, 같은 변수에 다른 자료형의 값을 다시 넣을 수도 있다.
tagsJson: ["변수와 자료형"]
```

---

## 2. 조건문

### PY-02-01

```yaml
type: MULTIPLE_CHOICE
difficulty: 1
title: if 문 기본 형태
description: Python 조건문의 올바른 형태는?
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
title: 비교 연산자
description: 두 값이 같은지 비교하는 Python 연산자는?
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
title: else 키워드
description: 조건이 거짓일 때 실행되는 블록을 만들려면 빈칸에 들어갈 키워드는?
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
title: 다중 조건 키워드
description: Python에서 `else if` 역할을 하는 키워드를 쓰세요.
answer: elif
hint: else와 if가 합쳐진 형태입니다.
explanation: Python에서는 `else if` 대신 `elif`를 사용한다.
tagsJson: ["조건문"]
```

### PY-02-05

```yaml
type: CODE
difficulty: 2
title: 양수 음수 판별
description: 정수 n을 입력받아 양수면 `positive`, 음수면 `negative`, 0이면 `zero`를 출력하세요.
codeTemplate: |
  n = int(input())
  # 조건에 따라 출력하세요
testCasesJson: |
  [
    { "input": "5", "expected": "positive" },
    { "input": "-2", "expected": "negative" },
    { "input": "0", "expected": "zero" }
  ]
hint: `if`, `elif`, `else`를 사용하세요.
explanation: n이 0보다 큰지, 작은지, 그 외인지 순서대로 확인한다.
tagsJson: ["조건문"]
```

### PY-02-06

```yaml
type: CODE
difficulty: 2
title: 짝수 홀수 판별
description: 정수 n을 입력받아 짝수면 `even`, 홀수면 `odd`를 출력하세요.
codeTemplate: |
  n = int(input())
  # 짝수/홀수를 출력하세요
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
title: 세 수의 최댓값
description: 세 정수를 입력받아 가장 큰 값을 출력하세요.
codeTemplate: |
  a, b, c = map(int, input().split())
  # 최댓값을 출력하세요
testCasesJson: |
  [
    { "input": "3 9 2", "expected": "9" },
    { "input": "-1 -5 -3", "expected": "-1" },
    { "input": "7 7 2", "expected": "7" }
  ]
hint: `max()`를 써도 되고 조건문으로 비교해도 됩니다.
explanation: `max(a, b, c)`는 세 값 중 가장 큰 값을 반환한다.
tagsJson: ["조건문"]
```

### PY-02-08

```yaml
type: CODE
difficulty: 3
title: 학점 계산
description: 점수 score를 입력받아 90 이상은 A, 80 이상은 B, 70 이상은 C, 그 외는 F를 출력하세요.
codeTemplate: |
  score = int(input())
  # 학점을 출력하세요
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
title: 조건문 순서의 중요성
description: 여러 조건을 검사할 때 조건문의 순서가 중요한 이유를 설명하세요.
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
title: range 기본
description: `range(5)`가 만드는 숫자 범위는?
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
title: 반복문 들여쓰기
description: Python 반복문에서 반복 실행할 코드를 구분하는 방법은?
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
title: for 키워드
description: 0부터 2까지 출력하려면 빈칸에 들어갈 키워드는?
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
title: 반복 중단 키워드
description: 반복문을 즉시 종료할 때 사용하는 Python 키워드를 쓰세요.
answer: break
hint: 멈추다는 뜻의 영어 단어입니다.
explanation: `break`는 현재 반복문을 즉시 빠져나간다.
tagsJson: ["반복문"]
```

### PY-03-05

```yaml
type: CODE
difficulty: 2
title: 1부터 n까지 합
description: 정수 n을 입력받아 1부터 n까지의 합을 출력하세요.
codeTemplate: |
  n = int(input())
  total = 0
  # 합을 구하세요
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
title: 짝수 개수 세기
description: 첫 줄에 n, 둘째 줄에 n개의 정수가 주어집니다. 짝수의 개수를 출력하세요.
codeTemplate: |
  n = int(input())
  nums = list(map(int, input().split()))
  # 짝수 개수를 출력하세요
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
title: 구구단 출력
description: 정수 n을 입력받아 n단을 1부터 9까지 한 줄씩 출력하세요. 형식은 `n x i = 값`입니다.
codeTemplate: |
  n = int(input())
  # 구구단을 출력하세요
testCasesJson: |
  [
    { "input": "2", "expected": "2 x 1 = 2\n2 x 2 = 4\n2 x 3 = 6\n2 x 4 = 8\n2 x 5 = 10\n2 x 6 = 12\n2 x 7 = 14\n2 x 8 = 16\n2 x 9 = 18" },
    { "input": "3", "expected": "3 x 1 = 3\n3 x 2 = 6\n3 x 3 = 9\n3 x 4 = 12\n3 x 5 = 15\n3 x 6 = 18\n3 x 7 = 21\n3 x 8 = 24\n3 x 9 = 27" }
  ]
hint: f-string을 사용하면 출력 형식을 맞추기 쉽습니다.
explanation: 1부터 9까지 반복하며 `n * i`를 출력한다.
tagsJson: ["반복문"]
```

### PY-03-08

```yaml
type: CODE
difficulty: 3
title: 별 삼각형
description: 정수 n을 입력받아 첫 줄 1개부터 n번째 줄 n개까지 `*`을 출력하세요.
codeTemplate: |
  n = int(input())
  # 별 삼각형을 출력하세요
testCasesJson: |
  [
    { "input": "3", "expected": "*\n**\n***" },
    { "input": "5", "expected": "*\n**\n***\n****\n*****" }
  ]
hint: 문자열도 곱셈이 가능합니다.
explanation: i번째 줄에 `"*" * i`를 출력한다.
tagsJson: ["반복문"]
```

### PY-03-09

```yaml
type: ESSAY
difficulty: 3
title: for와 while 비교
description: Python에서 `for` 문과 `while` 문의 차이를 설명하세요.
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
title: 리스트 인덱스
description: 리스트 `arr = [10, 20, 30]`에서 `arr[1]`의 값은?
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
title: 딕셔너리 구조
description: Python 딕셔너리는 어떤 쌍으로 데이터를 저장하나요?
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
title: 리스트 추가
description: 리스트 끝에 값을 추가하는 메서드는?
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
title: 리스트 길이 함수
description: 리스트 `nums`의 길이를 구하는 함수 이름만 쓰세요.
answer: len
hint: length의 줄임말처럼 보입니다.
explanation: `len(nums)`는 리스트의 원소 개수를 반환한다.
tagsJson: ["리스트와 딕셔너리"]
```

### PY-04-05

```yaml
type: CODE
difficulty: 2
title: 리스트 최댓값
description: 첫 줄에 n, 둘째 줄에 n개의 정수가 주어집니다. 가장 큰 값을 출력하세요.
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
title: 값 존재 여부
description: 첫 줄에 n, 둘째 줄에 n개의 정수, 셋째 줄에 찾을 값 x가 주어집니다. x가 리스트에 있으면 `YES`, 없으면 `NO`를 출력하세요.
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
title: 빈도 세기
description: 한 줄에 공백으로 구분된 단어들이 주어집니다. 각 단어의 등장 횟수를 딕셔너리로 세고, 가장 많이 나온 단어의 횟수를 출력하세요.
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
title: 중복 제거 후 정렬
description: 첫 줄에 n, 둘째 줄에 n개의 정수가 주어집니다. 중복을 제거하고 오름차순으로 출력하세요.
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
title: 리스트와 딕셔너리 선택
description: 리스트와 딕셔너리 중 어떤 상황에서 어떤 자료구조를 선택해야 하는지 설명하세요.
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
title: 함수 정의 키워드
description: Python에서 함수를 정의할 때 사용하는 키워드는?
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
title: 반환 키워드
description: 함수에서 값을 돌려줄 때 사용하는 키워드는?
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
title: 함수 호출
description: 함수 `hello`를 호출하려면 빈칸에 들어갈 코드는?
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
title: 매개변수 의미
description: 함수가 입력값을 받기 위해 괄호 안에 정의하는 이름을 무엇이라고 하나요?
answer: 매개변수
hint: 영어로 parameter입니다.
explanation: 매개변수는 함수가 호출될 때 전달받는 값을 담는 변수다.
tagsJson: ["함수"]
```

### PY-05-05

```yaml
type: CODE
difficulty: 2
title: 제곱 함수
description: 정수 n을 입력받아 n의 제곱을 출력하세요. 함수 `square(n)`을 정의해서 사용하세요.
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
title: 큰 수 반환 함수
description: 두 정수 a, b를 입력받아 더 큰 값을 출력하세요. 함수 `bigger(a, b)`를 정의해서 사용하세요.
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
title: 팩토리얼 함수
description: 정수 n을 입력받아 n!을 출력하세요. 함수 `factorial(n)`을 정의해서 사용하세요.
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
title: 소수 판별 함수
description: 정수 n을 입력받아 소수면 `prime`, 아니면 `not prime`을 출력하세요. 함수 `is_prime(n)`을 정의해서 사용하세요.
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
title: 함수 사용 이유
description: 프로그램에서 함수를 사용하는 이유를 설명하세요.
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
title: 문자열 길이
description: 문자열 `s`의 길이를 구하는 코드는?
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
title: 문자열 인덱싱
description: `s = "code"`일 때 `s[0]`의 값은?
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
title: 대문자 변환
description: 문자열 `s`를 모두 대문자로 바꾸려면 빈칸에 들어갈 메서드는?
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
title: 문자열 분리 메서드
description: 문자열을 공백 기준으로 나누어 리스트로 만드는 메서드 이름만 쓰세요.
answer: split
hint: 쪼갠다는 뜻의 영어 단어입니다.
explanation: `split()`은 문자열을 나누어 리스트로 반환한다.
tagsJson: ["문자열 처리"]
```

### PY-06-05

```yaml
type: CODE
difficulty: 2
title: 문자 개수 세기
description: 문자열 s와 문자 ch가 주어집니다. s 안에 ch가 몇 번 등장하는지 출력하세요.
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
title: 문자열 뒤집기
description: 문자열 s를 입력받아 뒤집어서 출력하세요.
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
title: 팰린드롬 판별
description: 문자열 s를 입력받아 앞뒤가 같으면 `YES`, 아니면 `NO`를 출력하세요.
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
title: 단어 첫 글자 모으기
description: 한 줄에 여러 단어가 주어집니다. 각 단어의 첫 글자를 이어 붙여 출력하세요.
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
title: 문자열 불변성
description: Python 문자열이 불변 객체라는 말의 의미를 설명하세요.
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
title: 선형 탐색
description: 리스트의 처음부터 끝까지 차례대로 값을 찾는 방법은?
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
title: 오름차순 정렬
description: 다음 중 오름차순으로 정렬된 것은?
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
title: 정렬 함수
description: 리스트 `nums`를 정렬한 새 리스트를 만들려면 빈칸에 들어갈 함수는?
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
title: 시간 복잡도 표기
description: 알고리즘의 실행 시간 증가 정도를 표현할 때 사용하는 Big-O 표기에서, 상수 시간은 어떻게 쓰나요?
answer: O(1)
hint: 입력 크기와 관계없이 일정한 시간입니다.
explanation: 상수 시간 복잡도는 `O(1)`로 표현한다.
tagsJson: ["알고리즘 기초"]
```

### PY-07-05

```yaml
type: CODE
difficulty: 2
title: 최솟값 찾기
description: 첫 줄에 n, 둘째 줄에 n개의 정수가 주어집니다. 가장 작은 값을 출력하세요.
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
title: 배열 합과 평균
description: 첫 줄에 n, 둘째 줄에 n개의 정수가 주어집니다. 합과 정수 평균을 공백으로 출력하세요.
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
title: 두 수 합 찾기
description: 첫 줄에 n과 target, 둘째 줄에 n개의 정수가 주어집니다. 서로 다른 두 수의 합이 target이 되면 `YES`, 없으면 `NO`를 출력하세요.
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
title: 연속 증가 길이
description: 첫 줄에 n, 둘째 줄에 n개의 정수가 주어집니다. 연속으로 증가하는 가장 긴 구간의 길이를 출력하세요.
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
title: 알고리즘 효율성
description: 같은 문제를 해결하는 여러 알고리즘 중 시간 복잡도가 더 낮은 알고리즘이 중요한 이유를 설명하세요.
rubric: |
  - 입력 크기가 커질수록 실행 시간 차이가 커진다는 점을 설명하면 40점
  - 시간 제한 또는 사용자 경험과 연결하면 30점
  - O(n), O(n^2) 같은 예시를 들면 30점
explanation: 입력이 작을 때는 차이가 작아도, 입력이 커지면 시간 복잡도가 낮은 알고리즘이 훨씬 빠르게 동작한다.
tagsJson: ["알고리즘 기초"]
```
