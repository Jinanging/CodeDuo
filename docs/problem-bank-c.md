# C 문제 은행 v1

언어: `C`

문제 구성:

```text
7목차 x 3난이도 x 3문제 = 63문제

초급: 객관식 2 + 빈칸 1
중급: 단답형 1 + 코드 2
고급: 코드 2 + 서술형 1
```

관리자 페이지에 넣을 때 `tagsJson`에는 각 목차명을 넣는다.

---

## 1. 기본 문법

### C-01-01

```yaml
type: MULTIPLE_CHOICE
difficulty: 1
title: C 출력 함수
description: C에서 문자열을 화면에 출력할 때 주로 사용하는 함수는?
optionsJson: ["printf", "println", "cout", "print"]
answer: printf
hint: stdio.h에 선언된 함수입니다.
explanation: C에서는 `printf` 함수로 형식에 맞춰 값을 출력한다.
tagsJson: ["기본 문법"]
```

### C-01-02

```yaml
type: MULTIPLE_CHOICE
difficulty: 1
title: 정수 변수 선언
description: C에서 정수 변수 `age`를 선언하는 올바른 코드는?
optionsJson: ["int age;", "age int;", "var age;", "integer age"]
answer: int age;
hint: 자료형을 변수 이름 앞에 씁니다.
explanation: C의 기본 정수 자료형은 `int`이며 `int age;`처럼 선언한다.
tagsJson: ["기본 문법"]
```

### C-01-03

```yaml
type: FILL_BLANK
difficulty: 1
title: 헤더 포함
description: 표준 입출력 함수를 쓰기 위해 빈칸에 들어갈 헤더 이름은?
answer: stdio.h
codeTemplate: |
  #include <____>
  int main() {
      return 0;
  }
hint: standard input/output header의 줄임말입니다.
explanation: "`printf`, `scanf`를 사용하려면 보통 `#include <stdio.h>`를 작성한다."
tagsJson: ["기본 문법"]
```

### C-01-04

```yaml
type: SHORT_ANSWER
difficulty: 2
title: 프로그램 종료 코드
description: C의 `main` 함수에서 정상 종료를 나타낼 때 흔히 반환하는 숫자 하나를 쓰세요.
answer: 0
hint: 성공을 뜻하는 대표 종료 코드입니다.
explanation: `return 0;`은 프로그램이 정상 종료되었음을 의미한다.
tagsJson: ["기본 문법"]
```

### C-01-05

```yaml
type: CODE
difficulty: 2
title: 두 수의 합
description: 두 정수 a, b를 입력받아 합을 출력하세요.
codeTemplate: |
  #include <stdio.h>
  int main() {
      int a, b;
      scanf("%d %d", &a, &b);
      // 합을 출력하세요
      return 0;
  }
testCasesJson: |
  [
    {
      "input": "2 3",
      "expected": "5"
    },
    {
      "input": "-1 6",
      "expected": "5"
    },
    {
      "input": "10 0",
      "expected": "10"
    }
  ]
hint: `a + b`를 `%d`로 출력하세요.
explanation: "`printf(\"%d\", a + b);`로 합을 출력한다."
tagsJson: ["기본 문법"]
```

### C-01-06

```yaml
type: CODE
difficulty: 2
title: 두 줄 출력
description: 정수 n을 입력받아 n과 n의 두 배를 각각 한 줄에 출력하세요.
codeTemplate: |
  #include <stdio.h>
  int main() {
      int n;
      scanf("%d", &n);
      // n과 n의 두 배를 출력하세요
      return 0;
  }
testCasesJson: |
  [
    {
      "input": "3",
      "expected": "3\n6"
    },
    {
      "input": "0",
      "expected": "0\n0"
    },
    {
      "input": "-2",
      "expected": "-2\n-4"
    }
  ]
hint: printf를 두 번 쓰거나 줄바꿈 문자를 사용하세요.
explanation: 첫 줄에 n, 둘째 줄에 `n * 2`를 출력한다.
tagsJson: ["기본 문법"]
```

### C-01-07

```yaml
type: CODE
difficulty: 3
title: 평균 계산
description: 세 정수를 입력받아 정수 나눗셈으로 평균을 출력하세요.
codeTemplate: |
  #include <stdio.h>
  int main() {
      int a, b, c;
      scanf("%d %d %d", &a, &b, &c);
      // 평균을 출력하세요
      return 0;
  }
testCasesJson: |
  [
    {
      "input": "3 6 9",
      "expected": "6"
    },
    {
      "input": "1 2 3",
      "expected": "2"
    },
    {
      "input": "10 10 11",
      "expected": "10"
    }
  ]
hint: 정수끼리 나누면 소수점 아래가 버려집니다.
explanation: `(a + b + c) / 3`을 출력한다.
tagsJson: ["기본 문법"]
```

### C-01-08

```yaml
type: CODE
difficulty: 3
title: 몫과 나머지
description: 두 양의 정수 a, b를 입력받아 몫과 나머지를 공백으로 출력하세요.
codeTemplate: |
  #include <stdio.h>
  int main() {
      int a, b;
      scanf("%d %d", &a, &b);
      // 몫과 나머지를 출력하세요
      return 0;
  }
testCasesJson: |
  [
    {
      "input": "7 3",
      "expected": "2 1"
    },
    {
      "input": "10 5",
      "expected": "2 0"
    },
    {
      "input": "20 6",
      "expected": "3 2"
    }
  ]
hint: 몫은 `/`, 나머지는 `%`입니다.
explanation: "`printf(\"%d %d\", a / b, a % b);`로 출력한다."
tagsJson: ["기본 문법"]
```

### C-01-09

```yaml
type: ESSAY
difficulty: 3
title: 컴파일 언어 설명
description: C가 컴파일 언어라는 말의 의미를 간단히 설명하세요.
rubric: |
  - 소스 코드를 컴파일러가 기계어에 가까운 실행 파일로 바꾼다는 점을 설명하면 50점
  - 실행 전에 문법 오류를 찾을 수 있다는 점을 설명하면 30점
  - 예시를 들면 20점
explanation: C 코드는 실행 전에 컴파일 과정을 거쳐 실행 파일로 변환된다.
tagsJson: ["기본 문법"]
```

---

## 2. 조건문과 반복문

### C-02-01

```yaml
type: MULTIPLE_CHOICE
difficulty: 1
title: if 조건식
description: C에서 `x`가 0보다 큰지 검사하는 올바른 코드는?
optionsJson: ["if (x > 0)", "if x > 0:", "when (x > 0)", "if [x > 0]"]
answer: if (x > 0)
hint: 조건은 괄호 안에 씁니다.
explanation: "C의 if문은 `if (조건식) { ... }` 형태다."
tagsJson: ["조건문과 반복문"]
```

### C-02-02

```yaml
type: MULTIPLE_CHOICE
difficulty: 1
title: for 반복문
description: C에서 0부터 4까지 반복하는 올바른 for문은?
optionsJson: ["for (int i = 0; i < 5; i++)", "for i in range(5):", "repeat 5", "loop i < 5"]
answer: for (int i = 0; i < 5; i++)
hint: 초기식, 조건식, 증감식을 세미콜론으로 구분합니다.
explanation: `i < 5` 조건으로 i가 0부터 4까지 반복된다.
tagsJson: ["조건문과 반복문"]
```

### C-02-03

```yaml
type: FILL_BLANK
difficulty: 1
title: else 키워드
description: 조건이 거짓일 때 실행할 블록을 만들기 위해 빈칸에 들어갈 키워드는?
answer: else
codeTemplate: |
  if (score >= 60) {
      printf("pass");
  } ____ {
      printf("fail");
  }
hint: if와 짝을 이룹니다.
explanation: `else`는 if 조건이 거짓일 때 실행된다.
tagsJson: ["조건문과 반복문"]
```

### C-02-04

```yaml
type: SHORT_ANSWER
difficulty: 2
title: 반복 중단
description: C 반복문을 즉시 종료할 때 사용하는 키워드만 쓰세요.
answer: break
hint: switch문에서도 사용합니다.
explanation: `break`는 현재 반복문이나 switch문을 빠져나간다.
tagsJson: ["조건문과 반복문"]
```

### C-02-05

```yaml
type: CODE
difficulty: 2
title: 짝수 홀수 판별
description: 정수 n을 입력받아 짝수면 `even`, 홀수면 `odd`를 출력하세요.
codeTemplate: |
  #include <stdio.h>
  int main() {
      int n;
      scanf("%d", &n);
      // 짝수면 even, 홀수면 odd
      return 0;
  }
testCasesJson: |
  [
    {
      "input": "4",
      "expected": "even"
    },
    {
      "input": "7",
      "expected": "odd"
    },
    {
      "input": "0",
      "expected": "even"
    }
  ]
hint: `n % 2 == 0`을 확인하세요.
explanation: 2로 나눈 나머지가 0이면 짝수다.
tagsJson: ["조건문과 반복문"]
```

### C-02-06

```yaml
type: CODE
difficulty: 2
title: 1부터 n까지 합
description: 정수 n을 입력받아 1부터 n까지의 합을 출력하세요.
codeTemplate: |
  #include <stdio.h>
  int main() {
      int n, sum = 0;
      scanf("%d", &n);
      // 1부터 n까지 더하세요
      printf("%d", sum);
      return 0;
  }
testCasesJson: |
  [
    {
      "input": "5",
      "expected": "15"
    },
    {
      "input": "1",
      "expected": "1"
    },
    {
      "input": "10",
      "expected": "55"
    }
  ]
hint: for문으로 1부터 n까지 반복하세요.
explanation: 반복문에서 `sum += i`로 누적한다.
tagsJson: ["조건문과 반복문"]
```

### C-02-07

```yaml
type: CODE
difficulty: 3
title: 배수 개수 세기
description: 두 정수 n, k를 입력받아 1부터 n까지 k의 배수 개수를 출력하세요.
codeTemplate: |
  #include <stdio.h>
  int main() {
      int n, k, count = 0;
      scanf("%d %d", &n, &k);
      // 배수 개수를 세세요
      printf("%d", count);
      return 0;
  }
testCasesJson: |
  [
    {
      "input": "10 3",
      "expected": "3"
    },
    {
      "input": "20 5",
      "expected": "4"
    },
    {
      "input": "7 8",
      "expected": "0"
    }
  ]
hint: `i % k == 0`인지 확인하세요.
explanation: 1부터 n까지 순회하며 k로 나누어떨어지는 수를 센다.
tagsJson: ["조건문과 반복문"]
```

### C-02-08

```yaml
type: CODE
difficulty: 3
title: 별 출력
description: 정수 n을 입력받아 별 `*`을 n개 출력하세요.
codeTemplate: |
  #include <stdio.h>
  int main() {
      int n;
      scanf("%d", &n);
      // 별을 n개 출력하세요
      return 0;
  }
testCasesJson: |
  [
    {
      "input": "3",
      "expected": "***"
    },
    {
      "input": "1",
      "expected": "*"
    },
    {
      "input": "5",
      "expected": "*****"
    }
  ]
hint: "반복문 안에서 `printf(\"*\")`를 실행하세요."
explanation: n번 반복하며 별을 출력한다.
tagsJson: ["조건문과 반복문"]
```

### C-02-09

```yaml
type: ESSAY
difficulty: 3
title: while과 for 비교
description: C에서 for문과 while문을 각각 어떤 상황에서 쓰면 좋은지 설명하세요.
rubric: |
  - 반복 횟수가 명확할 때 for문이 적합하다고 설명하면 40점
  - 조건이 만족되는 동안 반복할 때 while문이 적합하다고 설명하면 40점
  - 예시를 들면 20점
explanation: for문은 횟수 기반 반복에, while문은 조건 기반 반복에 자주 사용된다.
tagsJson: ["조건문과 반복문"]
```

---

## 3. 배열

### C-03-01

```yaml
type: MULTIPLE_CHOICE
difficulty: 1
title: 배열 첫 인덱스
description: C 배열의 첫 번째 원소 인덱스는?
optionsJson: ["0", "1", "-1", "배열마다 다름"]
answer: 0
hint: C 배열은 0부터 시작합니다.
explanation: C 배열 인덱스는 0부터 시작한다.
tagsJson: ["배열"]
```

### C-03-02

```yaml
type: MULTIPLE_CHOICE
difficulty: 1
title: 정수 배열 선언
description: 정수 5개를 저장할 배열 선언으로 올바른 것은?
optionsJson: ["int arr[5];", "int arr = 5;", "array int arr[5];", "arr[5] int;"]
answer: "int arr[5];"
hint: 자료형, 이름, 대괄호 순서입니다.
explanation: "`int arr[5];`는 정수 5개를 저장할 배열이다."
tagsJson: ["배열"]
```

### C-03-03

```yaml
type: FILL_BLANK
difficulty: 1
title: 배열 원소 접근
description: 배열 `arr`의 세 번째 원소에 접근하려면 빈칸에 들어갈 인덱스는?
answer: 2
codeTemplate: |
  int arr[5];
  printf("%d", arr[____]);
hint: 첫 번째 인덱스는 0입니다.
explanation: 세 번째 원소의 인덱스는 2다.
tagsJson: ["배열"]
```

### C-03-04

```yaml
type: SHORT_ANSWER
difficulty: 2
title: 마지막 인덱스
description: 길이가 n인 C 배열의 마지막 인덱스를 식으로 쓰세요.
answer: n - 1
hint: 0부터 시작합니다.
explanation: 인덱스 범위는 0부터 n-1까지다.
tagsJson: ["배열"]
```

### C-03-05

```yaml
type: CODE
difficulty: 2
title: 배열 합계
description: 정수 n과 n개의 정수를 입력받아 합계를 출력하세요.
codeTemplate: |
  #include <stdio.h>
  int main() {
      int n, arr[100], sum = 0;
      scanf("%d", &n);
      // 배열을 읽고 합계를 구하세요
      printf("%d", sum);
      return 0;
  }
testCasesJson: |
  [
    {
      "input": "5\n1 2 3 4 5",
      "expected": "15"
    },
    {
      "input": "3\n10 -2 5",
      "expected": "13"
    },
    {
      "input": "1\n7",
      "expected": "7"
    }
  ]
hint: 입력받은 값을 배열에 저장하고 더하세요.
explanation: 반복문으로 원소를 읽으며 sum에 누적한다.
tagsJson: ["배열"]
```

### C-03-06

```yaml
type: CODE
difficulty: 2
title: 최댓값 찾기
description: 정수 n과 n개의 정수를 입력받아 가장 큰 값을 출력하세요.
codeTemplate: |
  #include <stdio.h>
  int main() {
      int n, x, max;
      scanf("%d", &n);
      // 최댓값을 구하세요
      printf("%d", max);
      return 0;
  }
testCasesJson: |
  [
    {
      "input": "5\n1 9 3 7 2",
      "expected": "9"
    },
    {
      "input": "4\n-5 -2 -9 -1",
      "expected": "-1"
    },
    {
      "input": "1\n42",
      "expected": "42"
    }
  ]
hint: 첫 값을 max로 두고 비교하세요.
explanation: 입력값을 하나씩 비교하며 max를 갱신한다.
tagsJson: ["배열"]
```

### C-03-07

```yaml
type: CODE
difficulty: 3
title: 짝수 개수
description: 정수 n과 n개의 정수를 입력받아 짝수의 개수를 출력하세요.
codeTemplate: |
  #include <stdio.h>
  int main() {
      int n, x, count = 0;
      scanf("%d", &n);
      // 짝수 개수를 세세요
      printf("%d", count);
      return 0;
  }
testCasesJson: |
  [
    {
      "input": "5\n1 2 3 4 6",
      "expected": "3"
    },
    {
      "input": "4\n1 3 5 7",
      "expected": "0"
    },
    {
      "input": "3\n0 -2 9",
      "expected": "2"
    }
  ]
hint: `x % 2 == 0`이면 짝수입니다.
explanation: 각 원소가 짝수이면 count를 증가시킨다.
tagsJson: ["배열"]
```

### C-03-08

```yaml
type: CODE
difficulty: 3
title: 배열 뒤집기
description: 정수 n과 n개의 정수를 입력받아 거꾸로 출력하세요.
codeTemplate: |
  #include <stdio.h>
  int main() {
      int n, arr[100];
      scanf("%d", &n);
      // 배열을 읽고 거꾸로 출력하세요
      return 0;
  }
testCasesJson: |
  [
    {
      "input": "5\n1 2 3 4 5",
      "expected": "5 4 3 2 1"
    },
    {
      "input": "3\n10 20 30",
      "expected": "30 20 10"
    },
    {
      "input": "1\n7",
      "expected": "7"
    }
  ]
hint: 마지막 인덱스부터 0까지 감소시키세요.
explanation: 배열에 저장한 뒤 역순으로 순회한다.
tagsJson: ["배열"]
```

### C-03-09

```yaml
type: ESSAY
difficulty: 3
title: 배열과 반복문
description: 배열을 사용할 때 반복문이 자주 함께 쓰이는 이유를 설명하세요.
rubric: |
  - 배열은 여러 값을 인덱스로 저장한다는 점을 설명하면 40점
  - 반복문으로 모든 원소를 순회할 수 있다는 점을 설명하면 40점
  - 합계나 최댓값 예시를 들면 20점
explanation: 배열의 각 원소는 인덱스로 접근하므로 반복문으로 순차 처리하기 좋다.
tagsJson: ["배열"]
```

---

## 4. 함수

### C-04-01

```yaml
type: MULTIPLE_CHOICE
difficulty: 1
title: 반환 없는 함수
description: C에서 값을 반환하지 않는 함수의 반환형은?
optionsJson: ["void", "null", "none", "empty"]
answer: void
hint: Java에서도 같은 단어를 씁니다.
explanation: `void`는 반환값이 없다는 뜻이다.
tagsJson: ["함수"]
```

### C-04-02

```yaml
type: MULTIPLE_CHOICE
difficulty: 1
title: 함수 호출
description: `hello` 함수를 호출하는 올바른 코드는?
optionsJson: ["hello();", "call hello;", "hello:", "run hello()"]
answer: hello();
hint: C 문장은 세미콜론으로 끝납니다.
explanation: 매개변수가 없는 함수는 `hello();`처럼 호출한다.
tagsJson: ["함수"]
```

### C-04-03

```yaml
type: FILL_BLANK
difficulty: 1
title: 값 반환
description: 함수에서 값을 돌려줄 때 빈칸에 들어갈 키워드는?
answer: return
codeTemplate: |
  int add(int a, int b) {
      ____ a + b;
  }
hint: 되돌려준다는 뜻입니다.
explanation: `return`은 함수 결과를 호출한 곳으로 돌려준다.
tagsJson: ["함수"]
```

### C-04-04

```yaml
type: SHORT_ANSWER
difficulty: 2
title: 함수 원형
description: 함수를 사용하기 전에 반환형, 이름, 매개변수를 미리 알려주는 선언을 무엇이라고 하나요?
answer: 함수 원형
hint: prototype이라고도 합니다.
explanation: 함수 원형은 컴파일러에게 함수의 형태를 미리 알려준다.
tagsJson: ["함수"]
```

### C-04-05

```yaml
type: CODE
difficulty: 2
title: add 함수
description: 두 정수를 더해 반환하는 `add` 함수를 작성하고 결과를 출력하세요.
codeTemplate: |
  #include <stdio.h>
  int add(int a, int b) {
      // 합을 반환하세요
  }
  int main() {
      int a, b;
      scanf("%d %d", &a, &b);
      printf("%d", add(a, b));
      return 0;
  }
testCasesJson: |
  [
    {
      "input": "2 8",
      "expected": "10"
    },
    {
      "input": "-3 5",
      "expected": "2"
    },
    {
      "input": "0 0",
      "expected": "0"
    }
  ]
hint: `return a + b;`를 사용하세요.
explanation: 함수에서 두 매개변수의 합을 반환한다.
tagsJson: ["함수"]
```

### C-04-06

```yaml
type: CODE
difficulty: 2
title: 큰 수 함수
description: 두 정수 중 더 큰 값을 반환하는 `maxValue` 함수를 작성하세요.
codeTemplate: |
  #include <stdio.h>
  int maxValue(int a, int b) {
      // 더 큰 값을 반환하세요
  }
  int main() {
      int a, b;
      scanf("%d %d", &a, &b);
      printf("%d", maxValue(a, b));
      return 0;
  }
testCasesJson: |
  [
    {
      "input": "3 5",
      "expected": "5"
    },
    {
      "input": "10 2",
      "expected": "10"
    },
    {
      "input": "-1 -4",
      "expected": "-1"
    }
  ]
hint: 조건문을 사용하세요.
explanation: 두 값을 비교해 더 큰 값을 반환한다.
tagsJson: ["함수"]
```

### C-04-07

```yaml
type: CODE
difficulty: 3
title: 팩토리얼 함수
description: 정수 n을 입력받아 n!을 반환하는 함수를 작성하세요.
codeTemplate: |
  #include <stdio.h>
  int factorial(int n) {
      // n!을 반환하세요
  }
  int main() {
      int n;
      scanf("%d", &n);
      printf("%d", factorial(n));
      return 0;
  }
testCasesJson: |
  [
    {
      "input": "5",
      "expected": "120"
    },
    {
      "input": "1",
      "expected": "1"
    },
    {
      "input": "0",
      "expected": "1"
    }
  ]
hint: 0!은 1입니다.
explanation: 1부터 n까지 곱한 값을 반환한다.
tagsJson: ["함수"]
```

### C-04-08

```yaml
type: CODE
difficulty: 3
title: 소수 판별 함수
description: 정수 n을 입력받아 소수면 `prime`, 아니면 `not prime`을 출력하세요.
codeTemplate: |
  #include <stdio.h>
  int isPrime(int n) {
      // 소수이면 1, 아니면 0을 반환하세요
  }
  int main() {
      int n;
      scanf("%d", &n);
      printf("%s", isPrime(n) ? "prime" : "not prime");
      return 0;
  }
testCasesJson: |
  [
    {
      "input": "7",
      "expected": "prime"
    },
    {
      "input": "1",
      "expected": "not prime"
    },
    {
      "input": "12",
      "expected": "not prime"
    },
    {
      "input": "2",
      "expected": "prime"
    }
  ]
hint: 2부터 n-1까지 나누어보세요.
explanation: 약수가 있으면 소수가 아니다.
tagsJson: ["함수"]
```

### C-04-09

```yaml
type: ESSAY
difficulty: 3
title: 함수 분리의 장점
description: 프로그램에서 코드를 함수로 분리하면 좋은 점을 설명하세요.
rubric: |
  - 코드 재사용성을 설명하면 35점
  - 가독성이 좋아진다는 점을 설명하면 35점
  - 유지보수나 테스트가 쉬워진다는 점을 설명하면 30점
explanation: 함수는 기능을 이름 붙여 분리하므로 재사용성과 유지보수성을 높인다.
tagsJson: ["함수"]
```

---

## 5. 포인터

### C-05-01

```yaml
type: MULTIPLE_CHOICE
difficulty: 1
title: 주소 연산자
description: C에서 변수의 주소를 구하는 연산자는?
optionsJson: ["&", "*", "%", "#"]
answer: "&"
hint: scanf에서 변수 앞에 자주 붙습니다.
explanation: "`&x`는 변수 x의 메모리 주소를 뜻한다."
tagsJson: ["포인터"]
```

### C-05-02

```yaml
type: MULTIPLE_CHOICE
difficulty: 1
title: 간접 참조 연산자
description: 포인터가 가리키는 값을 읽거나 바꿀 때 사용하는 연산자는?
optionsJson: ["*", "&", "->", "::"]
answer: "*"
hint: 포인터 선언에도 쓰이는 기호입니다.
explanation: "`*p`는 p가 가리키는 위치의 값을 의미한다."
tagsJson: ["포인터"]
```

### C-05-03

```yaml
type: FILL_BLANK
difficulty: 1
title: 포인터 선언
description: 정수형 포인터 p를 선언하려면 빈칸에 들어갈 기호는?
answer: "*"
codeTemplate: |
  int ____p;
hint: 간접 참조 연산자와 같은 기호입니다.
explanation: `int *p;`는 정수형 포인터 p를 선언한다.
tagsJson: ["포인터"]
```

### C-05-04

```yaml
type: SHORT_ANSWER
difficulty: 2
title: NULL 포인터
description: 아무 유효한 주소도 가리키지 않는 포인터 값으로 흔히 쓰는 매크로 이름을 쓰세요.
answer: "NULL"
hint: 대문자로 씁니다.
explanation: `NULL`은 포인터가 유효한 대상을 가리키지 않음을 나타낸다.
tagsJson: ["포인터"]
```

### C-05-05

```yaml
type: CODE
difficulty: 2
title: 포인터로 값 출력
description: "정수 n을 입력받고 포인터 p가 n을 가리키게 한 뒤 `*p`를 출력하세요."
codeTemplate: |
  #include <stdio.h>
  int main() {
      int n;
      scanf("%d", &n);
      int *p = &n;
      // p가 가리키는 값을 출력하세요
      return 0;
  }
testCasesJson: |
  [
    {
      "input": "7",
      "expected": "7"
    },
    {
      "input": "-3",
      "expected": "-3"
    },
    {
      "input": "0",
      "expected": "0"
    }
  ]
hint: "`*p`를 출력하세요."
explanation: "포인터 p는 n의 주소를 저장하므로 `*p`는 n의 값이다."
tagsJson: ["포인터"]
```

### C-05-06

```yaml
type: CODE
difficulty: 2
title: 포인터로 값 변경
description: 정수 n을 입력받고 포인터를 이용해 n에 10을 더한 값을 출력하세요.
codeTemplate: |
  #include <stdio.h>
  int main() {
      int n;
      scanf("%d", &n);
      int *p = &n;
      // 포인터를 이용해 n에 10을 더하세요
      printf("%d", n);
      return 0;
  }
testCasesJson: |
  [
    {
      "input": "5",
      "expected": "15"
    },
    {
      "input": "0",
      "expected": "10"
    },
    {
      "input": "-2",
      "expected": "8"
    }
  ]
hint: "`*p += 10;`처럼 값을 바꿀 수 있습니다."
explanation: 포인터로 원본 변수의 값을 직접 수정한다.
tagsJson: ["포인터"]
```

### C-05-07

```yaml
type: CODE
difficulty: 3
title: swap 함수
description: 포인터를 사용해 두 정수의 값을 바꾸는 `swap` 함수를 완성하세요.
codeTemplate: |
  #include <stdio.h>
  void swap(int *a, int *b) {
      // 두 값을 교환하세요
  }
  int main() {
      int x, y;
      scanf("%d %d", &x, &y);
      swap(&x, &y);
      printf("%d %d", x, y);
      return 0;
  }
testCasesJson: |
  [
    {
      "input": "3 5",
      "expected": "5 3"
    },
    {
      "input": "1 1",
      "expected": "1 1"
    },
    {
      "input": "-2 7",
      "expected": "7 -2"
    }
  ]
hint: 임시 변수를 사용하세요.
explanation: 포인터를 매개변수로 받으면 함수 안에서 원본 값을 바꿀 수 있다.
tagsJson: ["포인터"]
```

### C-05-08

```yaml
type: CODE
difficulty: 3
title: 포인터 배열 합
description: 배열과 포인터를 사용해 n개의 정수 합을 출력하세요.
codeTemplate: |
  #include <stdio.h>
  int main() {
      int n, arr[100], sum = 0;
      scanf("%d", &n);
      for (int i = 0; i < n; i++) scanf("%d", &arr[i]);
      int *p = arr;
      // 포인터 p로 배열 합을 구하세요
      printf("%d", sum);
      return 0;
  }
testCasesJson: |
  [
    {
      "input": "4\n1 2 3 4",
      "expected": "10"
    },
    {
      "input": "3\n10 -1 5",
      "expected": "14"
    },
    {
      "input": "1\n8",
      "expected": "8"
    }
  ]
hint: "`*(p + i)`로 i번째 원소에 접근할 수 있습니다."
explanation: 배열 이름은 첫 원소 주소처럼 사용할 수 있다.
tagsJson: ["포인터"]
```

### C-05-09

```yaml
type: ESSAY
difficulty: 3
title: 포인터가 필요한 이유
description: C에서 포인터가 필요한 이유를 설명하세요.
rubric: |
  - 메모리 주소를 다룰 수 있다는 점을 설명하면 35점
  - 함수에서 원본 값을 수정할 수 있다는 점을 설명하면 35점
  - 배열, 문자열, 동적 메모리 예시를 들면 30점
explanation: 포인터는 주소를 저장해 원본 데이터 접근, 배열 처리, 동적 메모리 관리에 사용된다.
tagsJson: ["포인터"]
```

---

## 6. 문자열 처리

### C-06-01

```yaml
type: MULTIPLE_CHOICE
difficulty: 1
title: 문자열 끝
description: C 문자열의 끝을 나타내는 문자는?
optionsJson: ["\\0", "\\n", "end", "NULL 문자 없음"]
answer: \0
hint: 널 문자라고 부릅니다.
explanation: C 문자열은 마지막에 널 문자 `\0`이 있어야 한다.
tagsJson: ["문자열 처리"]
```

### C-06-02

```yaml
type: MULTIPLE_CHOICE
difficulty: 1
title: 문자열 길이 함수
description: C에서 문자열 길이를 구하는 대표 함수는?
optionsJson: ["strlen", "length", "size", "len"]
answer: strlen
hint: string length의 줄임말입니다.
explanation: `strlen`은 널 문자를 제외한 문자열 길이를 반환한다.
tagsJson: ["문자열 처리"]
```

### C-06-03

```yaml
type: FILL_BLANK
difficulty: 1
title: 문자열 헤더
description: `strlen`, `strcmp`를 쓰기 위해 포함하는 헤더는?
answer: string.h
codeTemplate: |
  #include <____>
hint: 문자열 관련 표준 헤더입니다.
explanation: 문자열 처리 함수는 보통 `string.h`에 선언되어 있다.
tagsJson: ["문자열 처리"]
```

### C-06-04

```yaml
type: SHORT_ANSWER
difficulty: 2
title: 문자열 비교 함수
description: C에서 두 문자열을 비교하는 대표 함수 이름만 쓰세요.
answer: strcmp
hint: string compare의 줄임말입니다.
explanation: `strcmp`는 두 문자열의 사전식 순서를 비교한다.
tagsJson: ["문자열 처리"]
```

### C-06-05

```yaml
type: CODE
difficulty: 2
title: 문자열 길이 출력
description: 공백 없는 문자열 s를 입력받아 길이를 출력하세요.
codeTemplate: |
  #include <stdio.h>
  #include <string.h>
  int main() {
      char s[101];
      scanf("%s", s);
      // 길이를 출력하세요
      return 0;
  }
testCasesJson: |
  [
    {
      "input": "code",
      "expected": "4"
    },
    {
      "input": "a",
      "expected": "1"
    },
    {
      "input": "CodeDuo",
      "expected": "7"
    }
  ]
hint: `strlen(s)`를 사용하세요.
explanation: `strlen`으로 문자열 길이를 구해 출력한다.
tagsJson: ["문자열 처리"]
```

### C-06-06

```yaml
type: CODE
difficulty: 2
title: 첫 글자 출력
description: 공백 없는 문자열 s를 입력받아 첫 글자를 출력하세요.
codeTemplate: |
  #include <stdio.h>
  int main() {
      char s[101];
      scanf("%s", s);
      // 첫 글자를 출력하세요
      return 0;
  }
testCasesJson: |
  [
    {
      "input": "code",
      "expected": "c"
    },
    {
      "input": "Apple",
      "expected": "A"
    },
    {
      "input": "z",
      "expected": "z"
    }
  ]
hint: "첫 글자는 `s[0]`입니다."
explanation: 문자열도 문자 배열이므로 인덱스로 접근한다.
tagsJson: ["문자열 처리"]
```

### C-06-07

```yaml
type: CODE
difficulty: 3
title: 문자 a 개수
description: 공백 없는 문자열 s를 입력받아 문자 `a`의 개수를 출력하세요.
codeTemplate: |
  #include <stdio.h>
  #include <string.h>
  int main() {
      char s[101];
      scanf("%s", s);
      int count = 0;
      // a의 개수를 세세요
      printf("%d", count);
      return 0;
  }
testCasesJson: |
  [
    {
      "input": "banana",
      "expected": "3"
    },
    {
      "input": "code",
      "expected": "0"
    },
    {
      "input": "aaa",
      "expected": "3"
    }
  ]
hint: 각 문자가 `a`인지 확인하세요.
explanation: "문자열을 순회하며 `s[i] == 'a'`이면 센다."
tagsJson: ["문자열 처리"]
```

### C-06-08

```yaml
type: CODE
difficulty: 3
title: 문자열 뒤집기
description: 공백 없는 문자열 s를 입력받아 거꾸로 출력하세요.
codeTemplate: |
  #include <stdio.h>
  #include <string.h>
  int main() {
      char s[101];
      scanf("%s", s);
      // 문자열을 거꾸로 출력하세요
      return 0;
  }
testCasesJson: |
  [
    {
      "input": "abc",
      "expected": "cba"
    },
    {
      "input": "code",
      "expected": "edoc"
    },
    {
      "input": "a",
      "expected": "a"
    }
  ]
hint: 마지막 인덱스는 `strlen(s) - 1`입니다.
explanation: 문자열 끝부터 처음까지 감소시키며 출력한다.
tagsJson: ["문자열 처리"]
```

### C-06-09

```yaml
type: ESSAY
difficulty: 3
title: C 문자열의 특징
description: C 문자열이 문자 배열과 널 문자로 표현된다는 말의 의미를 설명하세요.
rubric: |
  - 문자열이 char 배열에 저장된다는 점을 설명하면 40점
  - 마지막에 널 문자 \0이 필요하다는 점을 설명하면 40점
  - strlen 같은 함수 예시를 들면 20점
explanation: C 문자열은 연속된 char 배열이며 끝을 알기 위해 널 문자 `\0`을 사용한다.
tagsJson: ["문자열 처리"]
```

---

## 7. 구조체와 알고리즘 기초

### C-07-01

```yaml
type: MULTIPLE_CHOICE
difficulty: 1
title: 구조체 키워드
description: C에서 여러 값을 하나로 묶는 구조체를 정의할 때 쓰는 키워드는?
optionsJson: ["struct", "class", "object", "recording"]
answer: struct
hint: structure의 줄임말입니다.
explanation: C에서는 `struct`로 서로 다른 자료형의 값을 하나로 묶을 수 있다.
tagsJson: ["구조체와 알고리즘 기초"]
```

### C-07-02

```yaml
type: MULTIPLE_CHOICE
difficulty: 1
title: 선형 탐색
description: 앞에서부터 차례대로 값을 비교해 찾는 알고리즘은?
optionsJson: ["선형 탐색", "이진 탐색", "해시", "퀵 정렬"]
answer: 선형 탐색
hint: linear search입니다.
explanation: 선형 탐색은 처음부터 끝까지 순서대로 확인한다.
tagsJson: ["구조체와 알고리즘 기초"]
```

### C-07-03

```yaml
type: FILL_BLANK
difficulty: 1
title: 구조체 멤버 접근
description: 구조체 변수 `p`의 멤버 `age`에 접근할 때 빈칸에 들어갈 연산자는?
answer: .
codeTemplate: |
  printf("%d", p____age);
hint: 포인터가 아닌 일반 구조체 변수입니다.
explanation: 일반 구조체 변수의 멤버는 `.` 연산자로 접근한다.
tagsJson: ["구조체와 알고리즘 기초"]
```

### C-07-04

```yaml
type: SHORT_ANSWER
difficulty: 2
title: 정렬 의미
description: 데이터를 일정한 기준에 따라 순서대로 배치하는 알고리즘 작업을 무엇이라고 하나요?
answer: 정렬
hint: sorting입니다.
explanation: 정렬은 데이터를 오름차순이나 내림차순 등으로 재배치하는 작업이다.
tagsJson: ["구조체와 알고리즘 기초"]
```

### C-07-05

```yaml
type: CODE
difficulty: 2
title: 구조체 점수 출력
description: 이름과 점수를 저장하는 구조체를 사용해 입력받은 점수를 출력하세요.
codeTemplate: |
  #include <stdio.h>
  struct Student {
      char name[20];
      int score;
  };
  int main() {
      struct Student s;
      scanf("%s %d", s.name, &s.score);
      // 점수를 출력하세요
      return 0;
  }
testCasesJson: |
  [
    {
      "input": "Mina 90",
      "expected": "90"
    },
    {
      "input": "Tom 75",
      "expected": "75"
    },
    {
      "input": "Jin 0",
      "expected": "0"
    }
  ]
hint: 구조체 멤버는 `s.score`로 접근합니다.
explanation: 구조체 변수의 점수 필드를 출력한다.
tagsJson: ["구조체와 알고리즘 기초"]
```

### C-07-06

```yaml
type: CODE
difficulty: 2
title: 선형 탐색
description: 정수 n, n개의 정수, target을 입력받아 target이 있으면 `found`, 없으면 `not found`를 출력하세요.
codeTemplate: |
  #include <stdio.h>
  int main() {
      int n, arr[100], target, found = 0;
      scanf("%d", &n);
      for (int i = 0; i < n; i++) scanf("%d", &arr[i]);
      scanf("%d", &target);
      // target을 찾으세요
      printf("%s", found ? "found" : "not found");
      return 0;
  }
testCasesJson: |
  [
    {
      "input": "5\n1 2 3 4 5\n3",
      "expected": "found"
    },
    {
      "input": "3\n10 20 30\n5",
      "expected": "not found"
    },
    {
      "input": "1\n7\n7",
      "expected": "found"
    }
  ]
hint: 배열을 처음부터 끝까지 확인하세요.
explanation: 각 원소가 target과 같은지 비교한다.
tagsJson: ["구조체와 알고리즘 기초"]
```

### C-07-07

```yaml
type: CODE
difficulty: 3
title: 최솟값 찾기
description: 정수 n과 n개의 정수를 입력받아 가장 작은 값을 출력하세요.
codeTemplate: |
  #include <stdio.h>
  int main() {
      int n, x, min;
      scanf("%d", &n);
      // 최솟값을 구하세요
      printf("%d", min);
      return 0;
  }
testCasesJson: |
  [
    {
      "input": "5\n4 2 9 1 7",
      "expected": "1"
    },
    {
      "input": "3\n-1 -5 0",
      "expected": "-5"
    },
    {
      "input": "1\n8",
      "expected": "8"
    }
  ]
hint: 첫 값을 min으로 두고 갱신하세요.
explanation: 모든 값을 비교해 가장 작은 값을 찾는다.
tagsJson: ["구조체와 알고리즘 기초"]
```

### C-07-08

```yaml
type: CODE
difficulty: 3
title: 오름차순 확인
description: 정수 n과 n개의 정수를 입력받아 오름차순이면 `yes`, 아니면 `no`를 출력하세요.
codeTemplate: |
  #include <stdio.h>
  int main() {
      int n, arr[100], ok = 1;
      scanf("%d", &n);
      for (int i = 0; i < n; i++) scanf("%d", &arr[i]);
      // 오름차순인지 확인하세요
      printf("%s", ok ? "yes" : "no");
      return 0;
  }
testCasesJson: |
  [
    {
      "input": "5\n1 2 2 4 5",
      "expected": "yes"
    },
    {
      "input": "4\n1 3 2 4",
      "expected": "no"
    },
    {
      "input": "1\n9",
      "expected": "yes"
    }
  ]
hint: 앞 원소가 뒤 원소보다 크면 오름차순이 아닙니다.
explanation: 인접한 두 원소를 비교한다.
tagsJson: ["구조체와 알고리즘 기초"]
```

### C-07-09

```yaml
type: ESSAY
difficulty: 3
title: 구조체와 배열 활용
description: 구조체 배열을 사용하면 어떤 데이터를 편하게 처리할 수 있는지 설명하세요.
rubric: |
  - 구조체가 여러 필드를 하나로 묶는다는 점을 설명하면 35점
  - 배열로 여러 개의 구조체를 저장할 수 있다는 점을 설명하면 35점
  - 학생 목록, 좌표 목록 같은 예시를 들면 30점
explanation: 구조체 배열은 같은 형태의 복합 데이터를 여러 개 저장하고 반복문으로 처리할 때 유용하다.
tagsJson: ["구조체와 알고리즘 기초"]
```

---
