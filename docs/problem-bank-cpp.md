# C++ 문제 은행 v1

언어: `CPP`

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

### CP-01-01

```yaml
type: MULTIPLE_CHOICE
difficulty: 1
title: C++ 출력 객체
description: C++에서 화면 출력에 주로 사용하는 객체는?
optionsJson: ["cout", "printf", "System.out", "print"]
answer: cout
hint: iostream에 포함됩니다.
explanation: C++에서는 `cout`과 `<<` 연산자로 출력한다.
tagsJson: ["기본 문법"]
```

### CP-01-02

```yaml
type: MULTIPLE_CHOICE
difficulty: 1
title: 네임스페이스
description: `cout`을 `std::cout` 없이 쓰기 위해 자주 작성하는 문장은?
optionsJson: ["using namespace std;", "include std;", "namespace using std;", "use std;"]
answer: using namespace std;
hint: using으로 시작합니다.
explanation: `using namespace std;`를 쓰면 std 네임스페이스 이름을 생략할 수 있다.
tagsJson: ["기본 문법"]
```

### CP-01-03

```yaml
type: FILL_BLANK
difficulty: 1
title: iostream 포함
description: `cout`, `cin`을 사용하기 위해 빈칸에 들어갈 헤더는?
answer: iostream
codeTemplate: |
  #include <____>
  using namespace std;
hint: input/output stream입니다.
explanation: C++ 표준 입출력 스트림은 `iostream` 헤더에 있다.
tagsJson: ["기본 문법"]
```

### CP-01-04

```yaml
type: SHORT_ANSWER
difficulty: 2
title: 입력 객체
description: C++에서 표준 입력을 받을 때 사용하는 객체 이름만 쓰세요.
answer: cin
hint: cout과 짝입니다.
explanation: `cin`은 키보드 입력을 읽는 표준 입력 스트림이다.
tagsJson: ["기본 문법"]
```

### CP-01-05

```yaml
type: CODE
difficulty: 2
title: 두 수의 합
description: 두 정수 a, b를 입력받아 합을 출력하세요.
codeTemplate: |
  #include <iostream>
  using namespace std;
  int main() {
      int a, b;
      cin >> a >> b;
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
hint: `cout << a + b;`를 사용하세요.
explanation: 입력받은 두 정수의 합을 출력한다.
tagsJson: ["기본 문법"]
```

### CP-01-06

```yaml
type: CODE
difficulty: 2
title: 두 줄 출력
description: 정수 n을 입력받아 n과 n의 제곱을 각각 한 줄에 출력하세요.
codeTemplate: |
  #include <iostream>
  using namespace std;
  int main() {
      int n;
      cin >> n;
      // n과 n의 제곱을 출력하세요
      return 0;
  }
testCasesJson: |
  [
    {
      "input": "3",
      "expected": "3\n9"
    },
    {
      "input": "0",
      "expected": "0\n0"
    },
    {
      "input": "-2",
      "expected": "-2\n4"
    }
  ]
hint: 줄바꿈 문자 또는 endl을 사용하세요.
explanation: 첫 줄에 n, 둘째 줄에 `n * n`을 출력한다.
tagsJson: ["기본 문법"]
```

### CP-01-07

```yaml
type: CODE
difficulty: 3
title: 평균 계산
description: 세 정수를 입력받아 정수 나눗셈으로 평균을 출력하세요.
codeTemplate: |
  #include <iostream>
  using namespace std;
  int main() {
      int a, b, c;
      cin >> a >> b >> c;
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
hint: 정수 나눗셈을 사용하세요.
explanation: `(a + b + c) / 3`을 출력한다.
tagsJson: ["기본 문법"]
```

### CP-01-08

```yaml
type: CODE
difficulty: 3
title: 몫과 나머지
description: 두 양의 정수 a, b를 입력받아 몫과 나머지를 공백으로 출력하세요.
codeTemplate: |
  #include <iostream>
  using namespace std;
  int main() {
      int a, b;
      cin >> a >> b;
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
hint: `/`와 `%`를 사용하세요.
explanation: 몫은 `/`, 나머지는 `%`로 구한다.
tagsJson: ["기본 문법"]
```

### CP-01-09

```yaml
type: ESSAY
difficulty: 3
title: C와 C++ 차이
description: C++이 C에 비해 추가로 제공하는 주요 특징을 설명하세요.
rubric: |
  - 객체지향 문법을 설명하면 40점
  - STL 같은 표준 라이브러리를 설명하면 30점
  - C 문법과 호환되는 부분을 언급하면 30점
explanation: C++은 C 기반 문법에 클래스, 객체, 템플릿, STL 등 고수준 기능을 더한 언어다.
tagsJson: ["기본 문법"]
```

---

## 2. 조건문과 반복문

### CP-02-01

```yaml
type: MULTIPLE_CHOICE
difficulty: 1
title: if 조건식
description: C++에서 `x`가 10보다 큰지 검사하는 올바른 코드는?
optionsJson: ["if (x > 10)", "if x > 10:", "when x > 10", "if [x > 10]"]
answer: if (x > 10)
hint: C++ 조건식은 괄호 안에 씁니다.
explanation: C++ if문은 `if (조건식)` 형태다.
tagsJson: ["조건문과 반복문"]
```

### CP-02-02

```yaml
type: MULTIPLE_CHOICE
difficulty: 1
title: for 반복문
description: C++에서 0부터 4까지 반복하는 올바른 코드는?
optionsJson: ["for (int i = 0; i < 5; i++)", "for i in range(5):", "repeat i 5", "loop i in 5"]
answer: for (int i = 0; i < 5; i++)
hint: 초기식, 조건식, 증감식이 있습니다.
explanation: i가 0부터 4까지 변하며 반복된다.
tagsJson: ["조건문과 반복문"]
```

### CP-02-03

```yaml
type: FILL_BLANK
difficulty: 1
title: else 빈칸
description: 조건이 거짓일 때 실행되는 블록의 키워드는?
answer: else
codeTemplate: |
  if (score >= 60) {
      cout << "pass";
  } ____ {
      cout << "fail";
  }
hint: if와 짝입니다.
explanation: `else`는 if 조건이 거짓일 때 실행된다.
tagsJson: ["조건문과 반복문"]
```

### CP-02-04

```yaml
type: SHORT_ANSWER
difficulty: 2
title: 반복 건너뛰기
description: 반복문의 현재 회차만 건너뛰고 다음 반복으로 넘어가는 키워드는?
answer: continue
hint: 계속한다는 뜻입니다.
explanation: `continue`는 현재 반복의 남은 코드를 건너뛰고 다음 반복으로 간다.
tagsJson: ["조건문과 반복문"]
```

### CP-02-05

```yaml
type: CODE
difficulty: 2
title: 짝수 홀수 판별
description: 정수 n을 입력받아 짝수면 `even`, 홀수면 `odd`를 출력하세요.
codeTemplate: |
  #include <iostream>
  using namespace std;
  int main() {
      int n;
      cin >> n;
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
hint: `n % 2 == 0`을 사용하세요.
explanation: 2로 나눈 나머지가 0이면 짝수다.
tagsJson: ["조건문과 반복문"]
```

### CP-02-06

```yaml
type: CODE
difficulty: 2
title: 1부터 n까지 합
description: 정수 n을 입력받아 1부터 n까지의 합을 출력하세요.
codeTemplate: |
  #include <iostream>
  using namespace std;
  int main() {
      int n, sum = 0;
      cin >> n;
      // 1부터 n까지 더하세요
      cout << sum;
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
hint: for문으로 누적하세요.
explanation: 반복문에서 sum에 i를 더한다.
tagsJson: ["조건문과 반복문"]
```

### CP-02-07

```yaml
type: CODE
difficulty: 3
title: 배수 개수
description: n과 k를 입력받아 1부터 n까지 k의 배수 개수를 출력하세요.
codeTemplate: |
  #include <iostream>
  using namespace std;
  int main() {
      int n, k, count = 0;
      cin >> n >> k;
      // 배수 개수를 세세요
      cout << count;
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
hint: `i % k == 0`을 확인하세요.
explanation: 1부터 n까지 확인하며 배수를 센다.
tagsJson: ["조건문과 반복문"]
```

### CP-02-08

```yaml
type: CODE
difficulty: 3
title: 별 출력
description: 정수 n을 입력받아 별을 n개 출력하세요.
codeTemplate: |
  #include <iostream>
  using namespace std;
  int main() {
      int n;
      cin >> n;
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
hint: "반복문 안에서 `cout << \"*\";`를 실행하세요."
explanation: n번 반복하며 별을 출력한다.
tagsJson: ["조건문과 반복문"]
```

### CP-02-09

```yaml
type: ESSAY
difficulty: 3
title: 반복문 선택
description: for문과 while문을 각각 어떤 상황에서 쓰면 좋은지 설명하세요.
rubric: |
  - 횟수가 명확하면 for문이 적합하다고 설명하면 40점
  - 조건 중심 반복이면 while문이 적합하다고 설명하면 40점
  - 예시를 들면 20점
explanation: for문은 횟수 반복, while문은 조건 반복에 자주 사용된다.
tagsJson: ["조건문과 반복문"]
```

---

## 3. 배열과 문자열

### CP-03-01

```yaml
type: MULTIPLE_CHOICE
difficulty: 1
title: vector 추가
description: C++ vector에 원소를 뒤에 추가하는 함수는?
optionsJson: ["push_back", "add", "append", "insertLast"]
answer: push_back
hint: 뒤에 밀어 넣는다는 뜻입니다.
explanation: `push_back`은 vector 끝에 원소를 추가한다.
tagsJson: ["배열과 문자열"]
```

### CP-03-02

```yaml
type: MULTIPLE_CHOICE
difficulty: 1
title: string 길이
description: C++ string `s`의 길이를 구하는 올바른 코드는?
optionsJson: ["s.size()", "len(s)", "s.length", "strlen(s) only"]
answer: s.size()
hint: vector 크기도 같은 함수로 구합니다.
explanation: `string`은 `size()` 또는 `length()`로 길이를 구할 수 있다.
tagsJson: ["배열과 문자열"]
```

### CP-03-03

```yaml
type: FILL_BLANK
difficulty: 1
title: vector 헤더
description: vector를 사용하기 위해 포함하는 헤더는?
answer: vector
codeTemplate: |
  #include <____>
hint: 컨테이너 이름과 같습니다.
explanation: `vector` 컨테이너는 `<vector>` 헤더에 있다.
tagsJson: ["배열과 문자열"]
```

### CP-03-04

```yaml
type: SHORT_ANSWER
difficulty: 2
title: 문자열 자료형
description: C++에서 문자열을 편하게 다루는 표준 클래스 이름만 쓰세요.
answer: string
hint: "`#include <string>`으로 사용할 수 있습니다."
explanation: C++의 `string`은 문자열을 객체로 다룬다.
tagsJson: ["배열과 문자열"]
```

### CP-03-05

```yaml
type: CODE
difficulty: 2
title: vector 합계
description: 정수 n과 n개의 정수를 입력받아 vector에 저장한 뒤 합계를 출력하세요.
codeTemplate: |
  #include <iostream>
  #include <vector>
  using namespace std;
  int main() {
      int n, sum = 0;
      cin >> n;
      vector<int> v(n);
      // 값을 읽고 합계를 출력하세요
      cout << sum;
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
hint: "반복문으로 v[i]에 입력받으세요."
explanation: vector에 값을 저장하며 합계를 구한다.
tagsJson: ["배열과 문자열"]
```

### CP-03-06

```yaml
type: CODE
difficulty: 2
title: 문자열 길이
description: 문자열 s를 입력받아 길이를 출력하세요.
codeTemplate: |
  #include <iostream>
  #include <string>
  using namespace std;
  int main() {
      string s;
      cin >> s;
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
hint: `s.size()`를 사용하세요.
explanation: string의 길이는 `size()`로 구한다.
tagsJson: ["배열과 문자열"]
```

### CP-03-07

```yaml
type: CODE
difficulty: 3
title: 최댓값 찾기
description: 정수 n과 n개의 정수를 입력받아 가장 큰 값을 출력하세요.
codeTemplate: |
  #include <iostream>
  #include <vector>
  using namespace std;
  int main() {
      int n;
      cin >> n;
      vector<int> v(n);
      // 최댓값을 구하세요
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
hint: 첫 원소를 최댓값으로 두세요.
explanation: 모든 원소를 비교하며 최댓값을 갱신한다.
tagsJson: ["배열과 문자열"]
```

### CP-03-08

```yaml
type: CODE
difficulty: 3
title: 문자열 뒤집기
description: 문자열 s를 입력받아 거꾸로 출력하세요.
codeTemplate: |
  #include <iostream>
  #include <string>
  using namespace std;
  int main() {
      string s;
      cin >> s;
      // 거꾸로 출력하세요
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
hint: 마지막 인덱스부터 출력하세요.
explanation: 인덱스를 뒤에서 앞으로 이동하며 출력한다.
tagsJson: ["배열과 문자열"]
```

### CP-03-09

```yaml
type: ESSAY
difficulty: 3
title: 배열과 vector 비교
description: C++ 배열과 vector의 차이를 설명하세요.
rubric: |
  - 배열은 크기가 고정적이라는 점을 설명하면 35점
  - vector는 동적으로 크기를 바꿀 수 있다는 점을 설명하면 35점
  - size, push_back 같은 예시를 들면 30점
explanation: vector는 배열보다 크기 조절과 원소 추가가 편한 표준 컨테이너다.
tagsJson: ["배열과 문자열"]
```

---

## 4. 함수

### CP-04-01

```yaml
type: MULTIPLE_CHOICE
difficulty: 1
title: 함수 반환형
description: 값을 반환하지 않는 함수의 반환형은?
optionsJson: ["void", "null", "none", "empty"]
answer: void
hint: 반환값이 없다는 뜻의 C++ 키워드입니다.
explanation: `void`는 함수가 값을 반환하지 않음을 나타내는 반환형이다.
tagsJson: ["함수"]
```

### CP-04-02

```yaml
type: MULTIPLE_CHOICE
difficulty: 1
title: 함수 선언
description: 두 정수를 받아 정수를 반환하는 `add` 함수의 올바른 선언은?
optionsJson: ["int add(int a, int b);", "add int(a, b);", "void add = int a, int b;", "function add(int, int);"]
answer: int add(int a, int b);
hint: 반환형, 함수 이름, 매개변수 목록 순서로 작성합니다.
explanation: 함수 선언은 `반환형 함수이름(매개변수);` 형식으로 작성한다.
tagsJson: ["함수"]
```

### CP-04-03

```yaml
type: FILL_BLANK
difficulty: 1
title: 함수 결과 반환
description: 두 수의 합을 호출한 곳으로 돌려주도록 빈칸을 완성하세요.
answer: return
codeTemplate: |
  int add(int a, int b) {
      ____ a + b;
  }
hint: 함수의 계산 결과를 돌려주는 키워드입니다.
explanation: `return a + b;`는 두 수의 합을 함수 호출 결과로 반환한다.
tagsJson: ["함수"]
```

### CP-04-04

```yaml
type: SHORT_ANSWER
difficulty: 2
title: 참조 매개변수 기호
description: 함수에서 인수를 복사하지 않고 원본을 참조하도록 매개변수 자료형 뒤에 붙이는 기호 하나를 쓰세요.
answer: "&"
hint: 주소 연산자와 같은 모양의 기호입니다.
explanation: `int& value`처럼 `&`를 붙이면 원본 객체를 참조하는 매개변수가 된다.
tagsJson: ["함수"]
```

### CP-04-05

```yaml
type: CODE
difficulty: 2
title: 절댓값 함수
description: 정수 n의 절댓값을 반환하는 `absoluteValue` 함수를 완성하고 결과를 출력하세요.
codeTemplate: |
  #include <iostream>
  using namespace std;
  int absoluteValue(int n) {
      // n의 절댓값을 반환하세요
  }
  int main() {
      int n;
      cin >> n;
      cout << absoluteValue(n);
      return 0;
  }
testCasesJson: |
  [
    {
      "input": "-7",
      "expected": "7"
    },
    {
      "input": "0",
      "expected": "0"
    },
    {
      "input": "12",
      "expected": "12"
    }
  ]
hint: n이 음수이면 `-n`, 아니면 n을 반환하세요.
explanation: 함수 안에서 부호를 확인해 0 이상인 값을 반환한다.
tagsJson: ["함수"]
```

### CP-04-06

```yaml
type: CODE
difficulty: 2
title: 벡터 합계 함수
description: 정수 벡터를 참조로 받아 모든 원소의 합을 반환하는 `sumValues` 함수를 완성하세요.
codeTemplate: |
  #include <iostream>
  #include <vector>
  using namespace std;
  int sumValues(const vector<int>& values) {
      int total = 0;
      // 모든 원소를 total에 더하세요
      return total;
  }
  int main() {
      int n;
      cin >> n;
      vector<int> values(n);
      for (int& value : values) cin >> value;
      cout << sumValues(values);
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
hint: 범위 기반 for문으로 values의 각 원소를 순회하세요.
explanation: 벡터를 `const` 참조로 전달하면 복사 없이 읽고 합계를 반환할 수 있다.
tagsJson: ["함수"]
```

### CP-04-07

```yaml
type: CODE
difficulty: 3
title: 재귀 팩토리얼 함수
description: 0 이상 10 이하의 정수 n을 입력받아 재귀 함수 `factorial`로 n!을 출력하세요.
codeTemplate: |
  #include <iostream>
  using namespace std;
  long long factorial(int n) {
      if (n <= 1) return 1;
      // 재귀 호출로 n!을 반환하세요
  }
  int main() {
      int n;
      cin >> n;
      cout << factorial(n);
      return 0;
  }
testCasesJson: |
  [
    {
      "input": "0",
      "expected": "1"
    },
    {
      "input": "5",
      "expected": "120"
    },
    {
      "input": "10",
      "expected": "3628800"
    }
  ]
hint: `n! = n * (n - 1)!` 관계를 이용하세요.
explanation: n이 1 이하이면 1을 반환하고, 그 외에는 `n * factorial(n - 1)`을 반환한다.
tagsJson: ["함수"]
```

### CP-04-08

```yaml
type: CODE
difficulty: 3
title: 참조 매개변수로 최솟값과 최댓값 구하기
description: 1 이상인 정수 n과 정수 벡터를 입력받아 최솟값과 최댓값을 참조 매개변수에 저장하는 `findMinMax` 함수를 완성하세요.
codeTemplate: |
  #include <iostream>
  #include <vector>
  using namespace std;
  void findMinMax(const vector<int>& values, int& minValue, int& maxValue) {
      minValue = maxValue = values[0];
      // 모든 원소를 비교해 minValue와 maxValue를 갱신하세요
  }
  int main() {
      int n;
      cin >> n;
      vector<int> values(n);
      for (int& value : values) cin >> value;
      int minValue, maxValue;
      findMinMax(values, minValue, maxValue);
      cout << minValue << ' ' << maxValue;
      return 0;
  }
testCasesJson: |
  [
    {
      "input": "5\n3 1 9 -2 7",
      "expected": "-2 9"
    },
    {
      "input": "4\n-5 -1 -9 -3",
      "expected": "-9 -1"
    },
    {
      "input": "1\n42",
      "expected": "42 42"
    }
  ]
hint: 각 value가 현재 최솟값보다 작거나 최댓값보다 큰지 확인하세요.
explanation: 참조 매개변수를 사용하면 함수가 두 결과 값을 호출한 곳의 변수에 직접 저장할 수 있다.
tagsJson: ["함수"]
```

### CP-04-09

```yaml
type: ESSAY
difficulty: 3
title: 함수 재사용 장점
description: 함수를 사용하면 좋은 점을 설명하세요.
rubric: |
  - 중복 코드를 줄여 재사용할 수 있다는 점을 설명하면 35점
  - 기능별로 분리해 가독성이 좋아진다는 점을 설명하면 35점
  - 테스트나 유지보수가 쉬워지는 예시를 들면 30점
explanation: 함수는 하나의 기능을 이름 있는 단위로 분리해 재사용성, 가독성, 테스트 편의성을 높인다.
tagsJson: ["함수"]
```

---

## 5. 클래스와 객체

### CP-05-01

```yaml
type: MULTIPLE_CHOICE
difficulty: 1
title: 객체 생성
description: `Person` 클래스 객체 생성으로 올바른 것은?
optionsJson: ["Person p;", "new p Person;", "class Person p;", "make Person p"]
answer: Person p;
hint: 가장 기본 개념을 고르세요.
explanation: 정답은 `Person p;`이다.
tagsJson: ["클래스와 객체"]
```

### CP-05-02

```yaml
type: MULTIPLE_CHOICE
difficulty: 1
title: class의 기본 접근 수준
description: C++에서 `class` 내부 멤버의 기본 접근 수준은?
optionsJson: ["private", "public", "protected", "package"]
answer: private
hint: `struct`의 기본 접근 수준과 다릅니다.
explanation: C++의 `class` 멤버는 접근 지정자를 생략하면 기본적으로 `private`이다.
tagsJson: ["클래스와 객체"]
```

### CP-05-03

```yaml
type: FILL_BLANK
difficulty: 1
title: public 접근 지정자
description: 클래스 외부에서 `age`에 접근할 수 있도록 빈칸을 완성하세요.
answer: public
codeTemplate: |
  class Person {
  ____:
      int age;
  };
hint: 외부에 공개한다는 뜻의 접근 지정자입니다.
explanation: `public:` 아래에 선언한 멤버는 클래스 외부에서도 접근할 수 있다.
tagsJson: ["클래스와 객체"]
```

### CP-05-04

```yaml
type: SHORT_ANSWER
difficulty: 2
title: 객체 초기화 함수
description: 객체가 생성될 때 자동으로 호출되며 클래스와 같은 이름을 갖는 특별한 멤버 함수를 무엇이라고 하나요?
answer: 생성자
hint: 영어로 constructor입니다.
explanation: 생성자는 객체가 만들어질 때 필드의 초기값을 설정하는 특별한 멤버 함수다.
tagsJson: ["클래스와 객체"]
```

### CP-05-05

```yaml
type: CODE
difficulty: 2
title: Rectangle 클래스 넓이
description: 0 이상의 가로와 세로를 저장하는 `Rectangle` 클래스의 `area` 메서드를 완성해 넓이를 출력하세요.
codeTemplate: |
  #include <iostream>
  using namespace std;
  class Rectangle {
  private:
      int width;
      int height;
  public:
      Rectangle(int width, int height) : width(width), height(height) {}
      int area() const {
          // 넓이를 반환하세요
      }
  };
  int main() {
      int width, height;
      cin >> width >> height;
      Rectangle rectangle(width, height);
      cout << rectangle.area();
      return 0;
  }
testCasesJson: |
  [
    {
      "input": "3 4",
      "expected": "12"
    },
    {
      "input": "0 7",
      "expected": "0"
    },
    {
      "input": "9 2",
      "expected": "18"
    }
  ]
hint: 가로와 세로를 곱한 값을 반환하세요.
explanation: 생성자로 필드를 초기화하고 `area` 메서드에서 `width * height`를 반환한다.
tagsJson: ["클래스와 객체"]
```

### CP-05-06

```yaml
type: CODE
difficulty: 2
title: Counter 클래스
description: 초기값과 증가 횟수 n을 입력받아 `Counter` 객체의 값을 n번 증가시킨 뒤 출력하세요.
codeTemplate: |
  #include <iostream>
  using namespace std;
  class Counter {
  private:
      int value;
  public:
      Counter(int initial) : value(initial) {}
      void increase() {
          // value를 1 증가시키세요
      }
      int getValue() const {
          return value;
      }
  };
  int main() {
      int initial, n;
      cin >> initial >> n;
      Counter counter(initial);
      for (int i = 0; i < n; i++) counter.increase();
      cout << counter.getValue();
      return 0;
  }
testCasesJson: |
  [
    {
      "input": "10 3",
      "expected": "13"
    },
    {
      "input": "-2 2",
      "expected": "0"
    },
    {
      "input": "5 0",
      "expected": "5"
    }
  ]
hint: `increase` 메서드 안에서 `value++`를 실행하세요.
explanation: 객체의 private 필드는 public 메서드를 통해 안전하게 변경하고 조회할 수 있다.
tagsJson: ["클래스와 객체"]
```

### CP-05-07

```yaml
type: CODE
difficulty: 3
title: BankAccount 입출금
description: 0 이상의 초기 잔액, 입금액, 출금액을 입력받아 `BankAccount` 객체로 처리하세요. 잔액이 부족하면 `error`, 아니면 최종 잔액을 출력하세요.
codeTemplate: |
  #include <iostream>
  using namespace std;
  class BankAccount {
  private:
      int balance;
  public:
      BankAccount(int initialBalance) : balance(initialBalance) {}
      void deposit(int amount) {
          balance += amount;
      }
      bool withdraw(int amount) {
          // 잔액이 부족하면 false, 출금에 성공하면 true를 반환하세요
      }
      int getBalance() const {
          return balance;
      }
  };
  int main() {
      int initial, depositAmount, withdrawAmount;
      cin >> initial >> depositAmount >> withdrawAmount;
      BankAccount account(initial);
      account.deposit(depositAmount);
      if (account.withdraw(withdrawAmount)) cout << account.getBalance();
      else cout << "error";
      return 0;
  }
testCasesJson: |
  [
    {
      "input": "1000 500 300",
      "expected": "1200"
    },
    {
      "input": "100 0 150",
      "expected": "error"
    },
    {
      "input": "0 100 100",
      "expected": "0"
    }
  ]
hint: 출금액이 balance보다 크면 잔액을 바꾸지 말고 false를 반환하세요.
explanation: 잔액을 private으로 숨기고 메서드에서 출금 가능 여부를 검사해 객체 상태를 보호한다.
tagsJson: ["클래스와 객체"]
```

### CP-05-08

```yaml
type: CODE
difficulty: 3
title: 가상 함수 오버라이딩
description: `Shape`를 상속한 `Rectangle` 클래스의 `area` 가상 함수를 재정의해 사각형 넓이를 출력하세요.
codeTemplate: |
  #include <iostream>
  using namespace std;
  class Shape {
  public:
      virtual int area() const = 0;
      virtual ~Shape() = default;
  };
  class Rectangle : public Shape {
  private:
      int width;
      int height;
  public:
      Rectangle(int width, int height) : width(width), height(height) {}
      int area() const override {
          // 넓이를 반환하세요
      }
  };
  int main() {
      int width, height;
      cin >> width >> height;
      Rectangle rectangle(width, height);
      Shape& shape = rectangle;
      cout << shape.area();
      return 0;
  }
testCasesJson: |
  [
    {
      "input": "5 6",
      "expected": "30"
    },
    {
      "input": "1 9",
      "expected": "9"
    },
    {
      "input": "0 4",
      "expected": "0"
    }
  ]
hint: `width * height`를 반환하세요.
explanation: 파생 클래스가 가상 함수를 `override`하면 기본 클래스 참조로 호출해도 재정의한 메서드가 실행된다.
tagsJson: ["클래스와 객체"]
```

### CP-05-09

```yaml
type: ESSAY
difficulty: 3
title: 객체지향 장점
description: 클래스와 객체를 사용하면 좋은 점을 설명하세요.
rubric: |
  - 데이터와 관련 동작을 하나로 묶는 캡슐화를 설명하면 35점
  - 상속이나 다형성을 통한 확장과 재사용을 설명하면 35점
  - 실제 클래스와 객체 예시를 들면 30점
explanation: 클래스는 상태와 동작을 묶고 접근을 제어하며, 상속과 다형성으로 코드를 재사용하고 확장하게 한다.
tagsJson: ["클래스와 객체"]
```

---

## 6. STL

### CP-06-01

```yaml
type: MULTIPLE_CHOICE
difficulty: 1
title: STL 의미
description: C++ STL이 제공하는 것은?
optionsJson: ["컨테이너와 알고리즘", "운영체제", "컴파일러만", "네트워크 장비"]
answer: 컨테이너와 알고리즘
hint: 가장 기본 개념을 고르세요.
explanation: 정답은 `컨테이너와 알고리즘`이다.
tagsJson: ["STL"]
```

### CP-06-02

```yaml
type: MULTIPLE_CHOICE
difficulty: 1
title: vector 원소 개수
description: `vector<int> values`에 저장된 원소 개수를 구하는 올바른 표현은?
optionsJson: ["values.size()", "values.length", "size(values)", "values.count"]
answer: values.size()
hint: vector가 제공하는 멤버 함수를 호출합니다.
explanation: `vector`의 `size()` 멤버 함수는 현재 저장된 원소 개수를 반환한다.
tagsJson: ["STL"]
```

### CP-06-03

```yaml
type: FILL_BLANK
difficulty: 1
title: vector 원소 추가
description: vector의 맨 뒤에 정수 3을 추가하도록 빈칸을 완성하세요.
answer: push_back
codeTemplate: |
  vector<int> v;
  v.____(3);
hint: 뒤에 밀어 넣는다는 뜻의 멤버 함수입니다.
explanation: `push_back`은 vector의 마지막 위치에 새 원소를 추가한다.
tagsJson: ["STL"]
```

### CP-06-04

```yaml
type: SHORT_ANSWER
difficulty: 2
title: 중복 없는 정렬 컨테이너
description: 원소를 자동으로 정렬하며 중복 값을 저장하지 않는 STL 컨테이너 이름만 쓰세요.
answer: set
hint: 수학의 집합과 같은 이름입니다.
explanation: `set`은 원소를 정렬된 상태로 저장하며 같은 값을 한 번만 보관한다.
tagsJson: ["STL"]
```

### CP-06-05

```yaml
type: CODE
difficulty: 2
title: set으로 중복 제거
description: 정수 n과 n개의 정수를 입력받아 `set`에 저장한 서로 다른 값의 개수를 출력하세요.
codeTemplate: |
  #include <iostream>
  #include <set>
  using namespace std;
  int main() {
      int n;
      cin >> n;
      set<int> uniqueValues;
      // n개의 정수를 set에 삽입하세요
      cout << uniqueValues.size();
      return 0;
  }
testCasesJson: |
  [
    {
      "input": "5\n1 1 2 3 3",
      "expected": "3"
    },
    {
      "input": "4\n7 7 7 7",
      "expected": "1"
    },
    {
      "input": "6\n-1 0 -1 2 0 2",
      "expected": "3"
    }
  ]
hint: 입력할 때마다 `uniqueValues.insert(value)`를 호출하세요.
explanation: set은 중복 삽입을 무시하므로 모든 값을 넣은 뒤 크기가 서로 다른 값의 개수다.
tagsJson: ["STL"]
```

### CP-06-06

```yaml
type: CODE
difficulty: 2
title: map으로 단어 빈도 세기
description: 정수 n, n개의 단어, 찾을 단어 target을 입력받아 `map`으로 target의 등장 횟수를 출력하세요.
codeTemplate: |
  #include <iostream>
  #include <map>
  #include <string>
  using namespace std;
  int main() {
      int n;
      cin >> n;
      map<string, int> frequency;
      // n개의 단어 빈도수를 저장하세요
      string target;
      cin >> target;
      cout << frequency[target];
      return 0;
  }
testCasesJson: |
  [
    {
      "input": "5\napple banana apple kiwi apple\napple",
      "expected": "3"
    },
    {
      "input": "4\na b c d\nz",
      "expected": "0"
    },
    {
      "input": "6\nred blue red green blue blue\nblue",
      "expected": "3"
    }
  ]
hint: 단어를 읽을 때 `frequency[word]++`를 실행하세요.
explanation: map의 키에 단어를, 값에 등장 횟수를 저장하면 특정 단어의 빈도를 바로 조회할 수 있다.
tagsJson: ["STL"]
```

### CP-06-07

```yaml
type: CODE
difficulty: 3
title: sort로 내림차순 정렬
description: 정수 n과 n개의 정수를 입력받아 STL `sort`로 내림차순 정렬해 공백으로 출력하세요.
codeTemplate: |
  #include <iostream>
  #include <vector>
  #include <algorithm>
  #include <functional>
  using namespace std;
  int main() {
      int n;
      cin >> n;
      vector<int> values(n);
      for (int& value : values) cin >> value;
      // values를 내림차순으로 정렬하세요
      for (int i = 0; i < n; i++) {
          if (i > 0) cout << ' ';
          cout << values[i];
      }
      return 0;
  }
testCasesJson: |
  [
    {
      "input": "5\n3 1 5 2 4",
      "expected": "5 4 3 2 1"
    },
    {
      "input": "4\n-1 7 0 7",
      "expected": "7 7 0 -1"
    },
    {
      "input": "1\n9",
      "expected": "9"
    }
  ]
hint: 비교 함수로 `greater<int>()`를 전달하세요.
explanation: `sort(values.begin(), values.end(), greater<int>())`는 큰 값부터 정렬한다.
tagsJson: ["STL"]
```

### CP-06-08

```yaml
type: CODE
difficulty: 3
title: priority_queue로 k번째 큰 수
description: 정수 n, k와 n개의 정수를 입력받아 `priority_queue`를 사용해 k번째로 큰 값을 출력하세요.
codeTemplate: |
  #include <iostream>
  #include <queue>
  using namespace std;
  int main() {
      int n, k;
      cin >> n >> k;
      priority_queue<int> values;
      // n개의 정수를 우선순위 큐에 넣고 k번째 큰 값을 구하세요
      return 0;
  }
testCasesJson: |
  [
    {
      "input": "5 2\n3 1 5 2 4",
      "expected": "4"
    },
    {
      "input": "6 3\n7 7 2 9 1 5",
      "expected": "7"
    },
    {
      "input": "4 4\n-1 -5 0 3",
      "expected": "-5"
    }
  ]
hint: 모든 값을 push한 뒤 k-1번 pop하고 top을 출력하세요.
explanation: 기본 priority_queue의 top에는 가장 큰 값이 있으므로 k-1개를 제거하면 k번째 큰 값이 남는다.
tagsJson: ["STL"]
```

### CP-06-09

```yaml
type: ESSAY
difficulty: 3
title: STL 사용 장점
description: STL을 사용하면 좋은 점을 설명하세요.
rubric: |
  - 검증된 컨테이너와 알고리즘을 재사용할 수 있다는 점을 설명하면 35점
  - 구현 시간과 오류 가능성을 줄인다는 점을 설명하면 35점
  - vector, map, sort 등의 적절한 예시를 들면 30점
explanation: STL은 표준화되고 검증된 자료구조와 알고리즘을 제공해 코드를 간결하고 안정적으로 만든다.
tagsJson: ["STL"]
```

---

## 7. 알고리즘 기초

### CP-07-01

```yaml
type: MULTIPLE_CHOICE
difficulty: 1
title: 선형 탐색
description: 처음부터 끝까지 차례로 찾는 알고리즘은?
optionsJson: ["선형 탐색", "이진 탐색", "퀵 정렬", "해시"]
answer: 선형 탐색
hint: 가장 기본 개념을 고르세요.
explanation: 정답은 `선형 탐색`이다.
tagsJson: ["알고리즘 기초"]
```

### CP-07-02

```yaml
type: MULTIPLE_CHOICE
difficulty: 1
title: 이진 탐색 조건
description: 일반적인 이진 탐색을 적용하기 전에 데이터가 만족해야 하는 조건은?
optionsJson: ["정렬되어 있어야 한다", "모두 양수여야 한다", "중복이 없어야 한다", "배열 길이가 짝수여야 한다"]
answer: 정렬되어 있어야 한다
hint: 탐색 범위를 절반씩 줄이려면 값의 순서를 알아야 합니다.
explanation: 이진 탐색은 정렬된 데이터에서 중간값과 비교하며 탐색 범위를 절반으로 줄인다.
tagsJson: ["알고리즘 기초"]
```

### CP-07-03

```yaml
type: FILL_BLANK
difficulty: 1
title: 이진 탐색 중간 인덱스
description: 이진 탐색에서 구간의 중간 인덱스를 계산하도록 빈칸을 완성하세요.
answer: 2
codeTemplate: |
  int mid = left + (right - left) / ____;
hint: 구간 길이를 절반으로 나눕니다.
explanation: `left + (right - left) / 2`는 오버플로 위험을 줄이면서 중간 인덱스를 계산한다.
tagsJson: ["알고리즘 기초"]
```

### CP-07-04

```yaml
type: SHORT_ANSWER
difficulty: 2
title: 선형 탐색 시간 복잡도
description: 길이가 n인 배열에서 선형 탐색의 최악 시간 복잡도를 Big-O 표기법으로 쓰세요.
answer: O(n)
hint: 최악의 경우 모든 원소를 한 번씩 확인합니다.
explanation: 선형 탐색은 최악의 경우 n개 원소 전체를 확인하므로 시간 복잡도는 O(n)이다.
tagsJson: ["알고리즘 기초"]
```

### CP-07-05

```yaml
type: CODE
difficulty: 2
title: 선형 탐색 첫 위치
description: 정수 n, n개의 정수, target을 입력받아 target이 처음 나타나는 인덱스를 출력하세요. 없으면 -1을 출력하세요.
codeTemplate: |
  #include <iostream>
  #include <vector>
  using namespace std;
  int main() {
      int n;
      cin >> n;
      vector<int> values(n);
      for (int& value : values) cin >> value;
      int target;
      cin >> target;
      int index = -1;
      // 앞에서부터 target을 찾아 index를 갱신하세요
      cout << index;
      return 0;
  }
testCasesJson: |
  [
    {
      "input": "5\n4 2 7 2 9\n2",
      "expected": "1"
    },
    {
      "input": "4\n1 3 5 7\n6",
      "expected": "-1"
    },
    {
      "input": "1\n8\n8",
      "expected": "0"
    }
  ]
hint: 찾은 즉시 index를 저장하고 반복을 종료하세요.
explanation: 배열을 앞에서부터 확인하고 처음 일치한 위치를 저장하면 선형 탐색의 첫 결과를 구할 수 있다.
tagsJson: ["알고리즘 기초"]
```

### CP-07-06

```yaml
type: CODE
difficulty: 2
title: 선택 정렬
description: 정수 n과 n개의 정수를 입력받아 선택 정렬로 오름차순 정렬한 결과를 공백으로 출력하세요.
codeTemplate: |
  #include <iostream>
  #include <vector>
  #include <utility>
  using namespace std;
  int main() {
      int n;
      cin >> n;
      vector<int> values(n);
      for (int& value : values) cin >> value;
      for (int i = 0; i < n - 1; i++) {
          int minIndex = i;
          // i 이후에서 가장 작은 값의 위치를 찾아 i와 교환하세요
      }
      for (int i = 0; i < n; i++) {
          if (i > 0) cout << ' ';
          cout << values[i];
      }
      return 0;
  }
testCasesJson: |
  [
    {
      "input": "5\n4 1 3 5 2",
      "expected": "1 2 3 4 5"
    },
    {
      "input": "4\n3 3 -1 0",
      "expected": "-1 0 3 3"
    },
    {
      "input": "1\n8",
      "expected": "8"
    }
  ]
hint: 안쪽 반복문에서 minIndex를 갱신한 뒤 `swap(values[i], values[minIndex])`를 실행하세요.
explanation: 선택 정렬은 정렬되지 않은 구간의 최솟값을 찾아 현재 위치와 교환하는 과정을 반복한다.
tagsJson: ["알고리즘 기초"]
```

### CP-07-07

```yaml
type: CODE
difficulty: 3
title: 이진 탐색
description: 오름차순으로 정렬된 n개의 정수와 target을 입력받아 이진 탐색으로 찾으면 `found`, 없으면 `not found`를 출력하세요.
codeTemplate: |
  #include <iostream>
  #include <vector>
  using namespace std;
  int main() {
      int n;
      cin >> n;
      vector<int> values(n);
      for (int& value : values) cin >> value;
      int target;
      cin >> target;
      int left = 0, right = n - 1;
      bool found = false;
      // 이진 탐색으로 target을 찾으세요
      cout << (found ? "found" : "not found");
      return 0;
  }
testCasesJson: |
  [
    {
      "input": "6\n1 3 5 7 9 11\n7",
      "expected": "found"
    },
    {
      "input": "5\n2 4 6 8 10\n3",
      "expected": "not found"
    },
    {
      "input": "1\n-5\n-5",
      "expected": "found"
    }
  ]
hint: 중간값과 target을 비교해 left 또는 right를 갱신하세요.
explanation: 이진 탐색은 중간값과 비교할 때마다 탐색 구간을 절반으로 줄인다.
tagsJson: ["알고리즘 기초"]
```

### CP-07-08

```yaml
type: CODE
difficulty: 3
title: 투 포인터로 두 수의 합 찾기
description: 오름차순으로 정렬된 n개의 정수와 target을 입력받아 서로 다른 두 원소의 합이 target이면 `YES`, 없으면 `NO`를 출력하세요.
codeTemplate: |
  #include <iostream>
  #include <vector>
  using namespace std;
  int main() {
      int n, target;
      cin >> n >> target;
      vector<int> values(n);
      for (int& value : values) cin >> value;
      int left = 0, right = n - 1;
      bool found = false;
      // 두 포인터를 이동하며 합이 target인 두 원소를 찾으세요
      cout << (found ? "YES" : "NO");
      return 0;
  }
testCasesJson: |
  [
    {
      "input": "5 9\n1 2 4 5 8",
      "expected": "YES"
    },
    {
      "input": "4 20\n2 4 7 9",
      "expected": "NO"
    },
    {
      "input": "6 0\n-5 -2 -1 1 3 8",
      "expected": "YES"
    }
  ]
hint: 합이 target보다 작으면 left를, 크면 right를 이동하세요.
explanation: 정렬된 배열에서 양 끝 포인터를 이동하면 O(n)에 두 수의 합을 찾을 수 있다.
tagsJson: ["알고리즘 기초"]
```

### CP-07-09

```yaml
type: ESSAY
difficulty: 3
title: 알고리즘 복잡도
description: 같은 문제를 해결하는 O(n) 알고리즘과 O(n²) 알고리즘이 있을 때 입력 크기가 커질수록 성능 차이가 커지는 이유를 설명하세요.
rubric: |
  - O(n)은 입력 크기에 비례하고 O(n²)은 입력 크기의 제곱에 비례해 연산량이 증가한다고 설명하면 40점
  - 입력이 커질수록 증가율 차이가 커진다고 설명하면 35점
  - 구체적인 입력 크기나 탐색·반복문 예시를 들면 25점
explanation: 입력 크기 n이 커질 때 O(n²)의 연산량은 O(n)보다 훨씬 빠르게 증가하므로 시간 복잡도 선택이 중요하다.
tagsJson: ["알고리즘 기초"]
```

---
