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
hint: 가장 기본 개념을 고르세요.
explanation: 정답은 `void`이다.
tagsJson: ["함수"]
```

### CP-04-02

```yaml
type: MULTIPLE_CHOICE
difficulty: 1
title: 함수 기본 문법
description: 함수 학습에서 가장 관련 있는 C++ 키워드나 기능은?
optionsJson: ["return", "try", "printf", "scanf"]
answer: return
hint: 목차와 가장 직접 연결된 보기를 고르세요.
explanation: 목차의 핵심 문법과 관련된 선택지가 정답이다.
tagsJson: ["함수"]
```

### CP-04-03

```yaml
type: FILL_BLANK
difficulty: 1
title: 함수 빈칸
description: 함수와 관련된 기본 코드를 완성하세요.
answer: return
codeTemplate: |
  int add(int a, int b) {
      ____ a + b;
  }
hint: 문맥에 맞는 핵심 단어를 넣으세요.
explanation: 빈칸에는 해당 문법의 핵심 키워드가 들어간다.
tagsJson: ["함수"]
```

### CP-04-04

```yaml
type: SHORT_ANSWER
difficulty: 2
title: 함수 단답
description: 함수에서 자주 쓰는 핵심 용어 하나를 쓰세요.
answer: return
hint: 이 목차의 대표 단어입니다.
explanation: 해당 목차에서 자주 사용하는 핵심 용어다.
tagsJson: ["함수"]
```

### CP-04-05

```yaml
type: CODE
difficulty: 2
title: 함수 연습 1
description: 입력 조건에 맞게 간단한 결과를 출력하세요.
codeTemplate: |
  #include <iostream>
  using namespace std;
  int main() {
      int a, b;
      cin >> a >> b;
      // 두 수 중 큰 값을 출력하세요
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
hint: 조건문 또는 max를 사용할 수 있습니다.
explanation: 두 값을 비교해 큰 값을 출력한다.
tagsJson: ["함수"]
```

### CP-04-06

```yaml
type: CODE
difficulty: 2
title: 함수 연습 2
description: 정수 n과 n개의 정수를 입력받아 합계를 출력하세요.
codeTemplate: |
  #include <iostream>
  #include <vector>
  using namespace std;
  int main() {
      int n, sum = 0;
      cin >> n;
      // n개의 정수를 더하세요
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
hint: 반복문으로 입력받으며 더하세요.
explanation: n번 반복하며 sum에 누적한다.
tagsJson: ["함수"]
```

### CP-04-07

```yaml
type: CODE
difficulty: 3
title: 함수 심화 1
description: 정수 n과 n개의 정수를 입력받아 짝수 개수를 출력하세요.
codeTemplate: |
  #include <iostream>
  using namespace std;
  int main() {
      int n, x, count = 0;
      cin >> n;
      // 짝수 개수를 세세요
      cout << count;
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
hint: 2로 나눈 나머지를 확인하세요.
explanation: 각 수가 짝수이면 count를 증가시킨다.
tagsJson: ["함수"]
```

### CP-04-08

```yaml
type: CODE
difficulty: 3
title: 함수 심화 2
description: 정수 n과 n개의 정수를 입력받아 오름차순이면 `yes`, 아니면 `no`를 출력하세요.
codeTemplate: |
  #include <iostream>
  #include <vector>
  using namespace std;
  int main() {
      int n;
      cin >> n;
      vector<int> v(n);
      for (int i = 0; i < n; i++) cin >> v[i];
      bool ok = true;
      // 오름차순인지 확인하세요
      cout << (ok ? "yes" : "no");
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
hint: 인접한 값을 비교하세요.
explanation: 앞 값이 뒤 값보다 크면 오름차순이 아니다.
tagsJson: ["함수"]
```

### CP-04-09

```yaml
type: ESSAY
difficulty: 3
title: 함수 재사용 장점
description: 함수를 사용하면 좋은 점을 설명하세요.
rubric: |
  - 핵심 개념을 정확히 설명하면 40점
  - 코드 관리나 문제 해결에 주는 장점을 설명하면 40점
  - 예시를 들면 20점
explanation: 함수는 C++ 학습에서 중요한 개념이며 문제 해결 방식을 더 체계적으로 만들어준다.
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
title: 클래스와 객체 기본 문법
description: 클래스와 객체 학습에서 가장 관련 있는 C++ 키워드나 기능은?
optionsJson: ["class", "try", "printf", "scanf"]
answer: class
hint: 목차와 가장 직접 연결된 보기를 고르세요.
explanation: 목차의 핵심 문법과 관련된 선택지가 정답이다.
tagsJson: ["클래스와 객체"]
```

### CP-05-03

```yaml
type: FILL_BLANK
difficulty: 1
title: 클래스와 객체 빈칸
description: 클래스와 객체와 관련된 기본 코드를 완성하세요.
answer: public
codeTemplate: |
  class Person {
  ____:
      int age;
  };
hint: 문맥에 맞는 핵심 단어를 넣으세요.
explanation: 빈칸에는 해당 문법의 핵심 키워드가 들어간다.
tagsJson: ["클래스와 객체"]
```

### CP-05-04

```yaml
type: SHORT_ANSWER
difficulty: 2
title: 클래스와 객체 단답
description: 클래스와 객체에서 자주 쓰는 핵심 용어 하나를 쓰세요.
answer: class
hint: 이 목차의 대표 단어입니다.
explanation: 해당 목차에서 자주 사용하는 핵심 용어다.
tagsJson: ["클래스와 객체"]
```

### CP-05-05

```yaml
type: CODE
difficulty: 2
title: 클래스와 객체 연습 1
description: 입력 조건에 맞게 간단한 결과를 출력하세요.
codeTemplate: |
  #include <iostream>
  using namespace std;
  int main() {
      int a, b;
      cin >> a >> b;
      // 두 수 중 큰 값을 출력하세요
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
hint: 조건문 또는 max를 사용할 수 있습니다.
explanation: 두 값을 비교해 큰 값을 출력한다.
tagsJson: ["클래스와 객체"]
```

### CP-05-06

```yaml
type: CODE
difficulty: 2
title: 클래스와 객체 연습 2
description: 정수 n과 n개의 정수를 입력받아 합계를 출력하세요.
codeTemplate: |
  #include <iostream>
  #include <vector>
  using namespace std;
  int main() {
      int n, sum = 0;
      cin >> n;
      // n개의 정수를 더하세요
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
hint: 반복문으로 입력받으며 더하세요.
explanation: n번 반복하며 sum에 누적한다.
tagsJson: ["클래스와 객체"]
```

### CP-05-07

```yaml
type: CODE
difficulty: 3
title: 클래스와 객체 심화 1
description: 정수 n과 n개의 정수를 입력받아 짝수 개수를 출력하세요.
codeTemplate: |
  #include <iostream>
  using namespace std;
  int main() {
      int n, x, count = 0;
      cin >> n;
      // 짝수 개수를 세세요
      cout << count;
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
hint: 2로 나눈 나머지를 확인하세요.
explanation: 각 수가 짝수이면 count를 증가시킨다.
tagsJson: ["클래스와 객체"]
```

### CP-05-08

```yaml
type: CODE
difficulty: 3
title: 클래스와 객체 심화 2
description: 정수 n과 n개의 정수를 입력받아 오름차순이면 `yes`, 아니면 `no`를 출력하세요.
codeTemplate: |
  #include <iostream>
  #include <vector>
  using namespace std;
  int main() {
      int n;
      cin >> n;
      vector<int> v(n);
      for (int i = 0; i < n; i++) cin >> v[i];
      bool ok = true;
      // 오름차순인지 확인하세요
      cout << (ok ? "yes" : "no");
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
hint: 인접한 값을 비교하세요.
explanation: 앞 값이 뒤 값보다 크면 오름차순이 아니다.
tagsJson: ["클래스와 객체"]
```

### CP-05-09

```yaml
type: ESSAY
difficulty: 3
title: 객체지향 장점
description: 클래스와 객체를 사용하면 좋은 점을 설명하세요.
rubric: |
  - 핵심 개념을 정확히 설명하면 40점
  - 코드 관리나 문제 해결에 주는 장점을 설명하면 40점
  - 예시를 들면 20점
explanation: 클래스와 객체는 C++ 학습에서 중요한 개념이며 문제 해결 방식을 더 체계적으로 만들어준다.
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
title: STL 기본 문법
description: STL 학습에서 가장 관련 있는 C++ 키워드나 기능은?
optionsJson: ["vector", "try", "printf", "scanf"]
answer: vector
hint: 목차와 가장 직접 연결된 보기를 고르세요.
explanation: 목차의 핵심 문법과 관련된 선택지가 정답이다.
tagsJson: ["STL"]
```

### CP-06-03

```yaml
type: FILL_BLANK
difficulty: 1
title: STL 빈칸
description: STL와 관련된 기본 코드를 완성하세요.
answer: push_back
codeTemplate: |
  vector<int> v;
  v.____(3);
hint: 문맥에 맞는 핵심 단어를 넣으세요.
explanation: 빈칸에는 해당 문법의 핵심 키워드가 들어간다.
tagsJson: ["STL"]
```

### CP-06-04

```yaml
type: SHORT_ANSWER
difficulty: 2
title: STL 단답
description: STL에서 자주 쓰는 핵심 용어 하나를 쓰세요.
answer: vector
hint: 이 목차의 대표 단어입니다.
explanation: 해당 목차에서 자주 사용하는 핵심 용어다.
tagsJson: ["STL"]
```

### CP-06-05

```yaml
type: CODE
difficulty: 2
title: STL 연습 1
description: 입력 조건에 맞게 간단한 결과를 출력하세요.
codeTemplate: |
  #include <iostream>
  using namespace std;
  int main() {
      int a, b;
      cin >> a >> b;
      // 두 수 중 큰 값을 출력하세요
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
hint: 조건문 또는 max를 사용할 수 있습니다.
explanation: 두 값을 비교해 큰 값을 출력한다.
tagsJson: ["STL"]
```

### CP-06-06

```yaml
type: CODE
difficulty: 2
title: STL 연습 2
description: 정수 n과 n개의 정수를 입력받아 합계를 출력하세요.
codeTemplate: |
  #include <iostream>
  #include <vector>
  using namespace std;
  int main() {
      int n, sum = 0;
      cin >> n;
      // n개의 정수를 더하세요
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
hint: 반복문으로 입력받으며 더하세요.
explanation: n번 반복하며 sum에 누적한다.
tagsJson: ["STL"]
```

### CP-06-07

```yaml
type: CODE
difficulty: 3
title: STL 심화 1
description: 정수 n과 n개의 정수를 입력받아 짝수 개수를 출력하세요.
codeTemplate: |
  #include <iostream>
  using namespace std;
  int main() {
      int n, x, count = 0;
      cin >> n;
      // 짝수 개수를 세세요
      cout << count;
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
hint: 2로 나눈 나머지를 확인하세요.
explanation: 각 수가 짝수이면 count를 증가시킨다.
tagsJson: ["STL"]
```

### CP-06-08

```yaml
type: CODE
difficulty: 3
title: STL 심화 2
description: 정수 n과 n개의 정수를 입력받아 오름차순이면 `yes`, 아니면 `no`를 출력하세요.
codeTemplate: |
  #include <iostream>
  #include <vector>
  using namespace std;
  int main() {
      int n;
      cin >> n;
      vector<int> v(n);
      for (int i = 0; i < n; i++) cin >> v[i];
      bool ok = true;
      // 오름차순인지 확인하세요
      cout << (ok ? "yes" : "no");
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
hint: 인접한 값을 비교하세요.
explanation: 앞 값이 뒤 값보다 크면 오름차순이 아니다.
tagsJson: ["STL"]
```

### CP-06-09

```yaml
type: ESSAY
difficulty: 3
title: STL 사용 장점
description: STL를 사용하면 좋은 점을 설명하세요.
rubric: |
  - 핵심 개념을 정확히 설명하면 40점
  - 코드 관리나 문제 해결에 주는 장점을 설명하면 40점
  - 예시를 들면 20점
explanation: STL는 C++ 학습에서 중요한 개념이며 문제 해결 방식을 더 체계적으로 만들어준다.
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
title: 알고리즘 기초 기본 문법
description: 알고리즘 기초 학습에서 가장 관련 있는 C++ 키워드나 기능은?
optionsJson: ["for", "try", "printf", "scanf"]
answer: for
hint: 목차와 가장 직접 연결된 보기를 고르세요.
explanation: 목차의 핵심 문법과 관련된 선택지가 정답이다.
tagsJson: ["알고리즘 기초"]
```

### CP-07-03

```yaml
type: FILL_BLANK
difficulty: 1
title: 알고리즘 기초 빈칸
description: 알고리즘 기초와 관련된 기본 코드를 완성하세요.
answer: found
codeTemplate: |
  for (int i = 0; i < n; i++) {
      if (arr[i] == target) ____ = true;
  }
hint: 문맥에 맞는 핵심 단어를 넣으세요.
explanation: 빈칸에는 해당 문법의 핵심 키워드가 들어간다.
tagsJson: ["알고리즘 기초"]
```

### CP-07-04

```yaml
type: SHORT_ANSWER
difficulty: 2
title: 알고리즘 기초 단답
description: 알고리즘 기초에서 자주 쓰는 핵심 용어 하나를 쓰세요.
answer: 정렬
hint: 이 목차의 대표 단어입니다.
explanation: 해당 목차에서 자주 사용하는 핵심 용어다.
tagsJson: ["알고리즘 기초"]
```

### CP-07-05

```yaml
type: CODE
difficulty: 2
title: 알고리즘 기초 연습 1
description: 입력 조건에 맞게 간단한 결과를 출력하세요.
codeTemplate: |
  #include <iostream>
  using namespace std;
  int main() {
      int a, b;
      cin >> a >> b;
      // 두 수 중 큰 값을 출력하세요
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
hint: 조건문 또는 max를 사용할 수 있습니다.
explanation: 두 값을 비교해 큰 값을 출력한다.
tagsJson: ["알고리즘 기초"]
```

### CP-07-06

```yaml
type: CODE
difficulty: 2
title: 알고리즘 기초 연습 2
description: 정수 n과 n개의 정수를 입력받아 합계를 출력하세요.
codeTemplate: |
  #include <iostream>
  #include <vector>
  using namespace std;
  int main() {
      int n, sum = 0;
      cin >> n;
      // n개의 정수를 더하세요
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
hint: 반복문으로 입력받으며 더하세요.
explanation: n번 반복하며 sum에 누적한다.
tagsJson: ["알고리즘 기초"]
```

### CP-07-07

```yaml
type: CODE
difficulty: 3
title: 알고리즘 기초 심화 1
description: 정수 n과 n개의 정수를 입력받아 짝수 개수를 출력하세요.
codeTemplate: |
  #include <iostream>
  using namespace std;
  int main() {
      int n, x, count = 0;
      cin >> n;
      // 짝수 개수를 세세요
      cout << count;
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
hint: 2로 나눈 나머지를 확인하세요.
explanation: 각 수가 짝수이면 count를 증가시킨다.
tagsJson: ["알고리즘 기초"]
```

### CP-07-08

```yaml
type: CODE
difficulty: 3
title: 알고리즘 기초 심화 2
description: 정수 n과 n개의 정수를 입력받아 오름차순이면 `yes`, 아니면 `no`를 출력하세요.
codeTemplate: |
  #include <iostream>
  #include <vector>
  using namespace std;
  int main() {
      int n;
      cin >> n;
      vector<int> v(n);
      for (int i = 0; i < n; i++) cin >> v[i];
      bool ok = true;
      // 오름차순인지 확인하세요
      cout << (ok ? "yes" : "no");
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
hint: 인접한 값을 비교하세요.
explanation: 앞 값이 뒤 값보다 크면 오름차순이 아니다.
tagsJson: ["알고리즘 기초"]
```

### CP-07-09

```yaml
type: ESSAY
difficulty: 3
title: 알고리즘 복잡도
description: 알고리즘 기초를 사용하면 좋은 점을 설명하세요.
rubric: |
  - 핵심 개념을 정확히 설명하면 40점
  - 코드 관리나 문제 해결에 주는 장점을 설명하면 40점
  - 예시를 들면 20점
explanation: 알고리즘 기초는 C++ 학습에서 중요한 개념이며 문제 해결 방식을 더 체계적으로 만들어준다.
tagsJson: ["알고리즘 기초"]
```

---
