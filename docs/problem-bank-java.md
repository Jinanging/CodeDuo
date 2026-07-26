# Java 문제 은행 v1

언어: `JAVA`

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

### JA-01-01

```yaml
type: MULTIPLE_CHOICE
difficulty: 1
title: Java 출력문
description: Java에서 문자열 `Hello`를 한 줄로 출력하는 올바른 코드는?
optionsJson: ["System.out.println(\"Hello\");", "print(\"Hello\")", "console.log(\"Hello\");", "cout << \"Hello\";"]
answer: "System.out.println(\"Hello\");"
hint: Java 표준 출력은 `System.out`을 사용합니다.
explanation: Java에서는 `System.out.println("Hello");`로 문자열을 출력하고 줄바꿈까지 한다.
tagsJson: ["기본 문법"]
```

### JA-01-02

```yaml
type: MULTIPLE_CHOICE
difficulty: 1
title: 정수 변수 선언
description: Java에서 정수 변수 `age`에 20을 저장하는 올바른 코드는?
optionsJson: ["int age = 20;", "age = 20", "let age = 20;", "Integer age := 20;"]
answer: "int age = 20;"
hint: Java는 변수 선언 시 자료형을 먼저 씁니다.
explanation: Java의 기본 정수 자료형은 `int`이며 `int age = 20;`처럼 선언한다.
tagsJson: ["기본 문법"]
```

### JA-01-03

```yaml
type: FILL_BLANK
difficulty: 1
title: 메인 메서드 빈칸
description: Java 프로그램의 시작점인 메서드 이름으로 빈칸에 들어갈 단어는?
codeTemplate: |
  public class Main {
      public static void ____(String[] args) {
          System.out.println("Hi");
      }
  }
answer: main
hint: Java 프로그램이 처음 실행하는 메서드 이름입니다.
explanation: Java 애플리케이션은 `public static void main(String[] args)`에서 실행을 시작한다.
tagsJson: ["기본 문법"]
```

### JA-01-04

```yaml
type: SHORT_ANSWER
difficulty: 2
title: 문자열 자료형 이름
description: Java에서 문자열을 저장하는 대표 클래스 이름만 쓰세요.
answer: String
hint: 첫 글자가 대문자인 참조 자료형입니다.
explanation: Java에서 문자열은 `String` 클래스로 표현한다.
tagsJson: ["기본 문법"]
```

### JA-01-05

```yaml
type: CODE
difficulty: 2
title: 두 정수의 합
description: 두 정수 a, b를 입력받아 합을 출력하세요.
codeTemplate: |
  import java.util.*;
  public class Main {
      public static void main(String[] args) {
          Scanner sc = new Scanner(System.in);
          int a = sc.nextInt();
          int b = sc.nextInt();
          // 합을 출력하세요
      }
  }
testCasesJson: |
  [
    { "input": "2 3", "expected": "5" },
    { "input": "-1 6", "expected": "5" },
    { "input": "10 0", "expected": "10" }
  ]
hint: `a + b`를 출력하면 됩니다.
explanation: `System.out.println(a + b);`로 두 정수의 합을 출력한다.
tagsJson: ["기본 문법"]
```

### JA-01-06

```yaml
type: CODE
difficulty: 2
title: 사칙연산 결과
description: 두 정수 a, b를 입력받아 합과 차를 각각 한 줄에 출력하세요.
codeTemplate: |
  import java.util.*;
  public class Main {
      public static void main(String[] args) {
          Scanner sc = new Scanner(System.in);
          int a = sc.nextInt();
          int b = sc.nextInt();
          // 첫 줄에는 합, 둘째 줄에는 차를 출력하세요
      }
  }
testCasesJson: |
  [
    { "input": "7 2", "expected": "9\n5" },
    { "input": "3 5", "expected": "8\n-2" },
    { "input": "10 10", "expected": "20\n0" }
  ]
hint: `println`을 두 번 사용하세요.
explanation: 첫 줄에 `a + b`, 둘째 줄에 `a - b`를 출력한다.
tagsJson: ["기본 문법"]
```

### JA-01-07

```yaml
type: CODE
difficulty: 3
title: 평균 구하기
description: 세 정수를 입력받아 정수 나눗셈으로 평균을 출력하세요.
codeTemplate: |
  import java.util.*;
  public class Main {
      public static void main(String[] args) {
          Scanner sc = new Scanner(System.in);
          int a = sc.nextInt();
          int b = sc.nextInt();
          int c = sc.nextInt();
          // 평균을 출력하세요
      }
  }
testCasesJson: |
  [
    { "input": "3 6 9", "expected": "6" },
    { "input": "1 2 3", "expected": "2" },
    { "input": "10 10 11", "expected": "10" }
  ]
hint: 정수끼리 나누면 소수점 아래가 버려집니다.
explanation: `(a + b + c) / 3`을 출력하면 정수 평균을 구할 수 있다.
tagsJson: ["기본 문법"]
```

### JA-01-08

```yaml
type: CODE
difficulty: 3
title: 몫과 나머지
description: 두 양의 정수 a, b를 입력받아 a를 b로 나눈 몫과 나머지를 공백으로 출력하세요.
codeTemplate: |
  import java.util.*;
  public class Main {
      public static void main(String[] args) {
          Scanner sc = new Scanner(System.in);
          int a = sc.nextInt();
          int b = sc.nextInt();
          // 몫과 나머지를 출력하세요
      }
  }
testCasesJson: |
  [
    { "input": "7 3", "expected": "2 1" },
    { "input": "10 5", "expected": "2 0" },
    { "input": "20 6", "expected": "3 2" }
  ]
hint: 몫은 `/`, 나머지는 `%`입니다.
explanation: `System.out.println((a / b) + " " + (a % b));`로 출력한다.
tagsJson: ["기본 문법"]
```

### JA-01-09

```yaml
type: ESSAY
difficulty: 3
title: Java의 정적 타입 설명
description: Java가 정적 타입 언어라는 말의 의미를 간단히 설명하세요.
rubric: |
  - 변수 선언 시 자료형을 명시해야 한다는 점을 설명하면 40점
  - 컴파일 단계에서 타입 오류를 찾을 수 있다는 점을 설명하면 40점
  - `int`, `String` 같은 예시를 들면 20점
explanation: Java는 변수와 메서드의 타입을 코드에 명시하며, 컴파일러가 타입이 맞는지 검사한다.
tagsJson: ["기본 문법"]
```

---

## 2. 조건문과 반복문

### JA-02-01

```yaml
type: MULTIPLE_CHOICE
difficulty: 1
title: if 조건식
description: Java에서 `x`가 10보다 큰지 검사하는 올바른 조건식은?
optionsJson: ["if (x > 10)", "if x > 10:", "when x > 10", "if [x > 10]"]
answer: "if (x > 10)"
hint: Java의 조건식은 괄호 안에 씁니다.
explanation: Java의 `if`문은 `if (조건식) { ... }` 형태로 작성한다.
tagsJson: ["조건문과 반복문"]
```

### JA-02-02

```yaml
type: MULTIPLE_CHOICE
difficulty: 1
title: for 반복문
description: Java에서 0부터 4까지 반복하는 올바른 코드는?
optionsJson: ["for (int i = 0; i < 5; i++)", "for i in range(5):", "repeat i 5", "loop (i < 5)"]
answer: "for (int i = 0; i < 5; i++)"
hint: Java for문은 초기식, 조건식, 증감식을 세미콜론으로 구분합니다.
explanation: `for (int i = 0; i < 5; i++)`는 i가 0,1,2,3,4일 때 반복한다.
tagsJson: ["조건문과 반복문"]
```

### JA-02-03

```yaml
type: FILL_BLANK
difficulty: 1
title: else 빈칸
description: 조건이 거짓일 때 실행되는 블록을 만들기 위해 빈칸에 들어갈 키워드는?
codeTemplate: |
  if (score >= 60) {
      System.out.println("pass");
  } ____ {
      System.out.println("fail");
  }
answer: else
hint: if와 짝을 이루는 키워드입니다.
explanation: `else`는 `if` 조건이 거짓일 때 실행된다.
tagsJson: ["조건문과 반복문"]
```

### JA-02-04

```yaml
type: SHORT_ANSWER
difficulty: 2
title: 반복 중단 키워드
description: Java 반복문을 즉시 종료할 때 사용하는 키워드만 쓰세요.
answer: break
hint: switch문에서도 사용할 수 있습니다.
explanation: `break`는 현재 반복문이나 switch문을 빠져나간다.
tagsJson: ["조건문과 반복문"]
```

### JA-02-05

```yaml
type: CODE
difficulty: 2
title: 짝수 홀수 판별
description: 정수 n을 입력받아 짝수면 `even`, 홀수면 `odd`를 출력하세요.
codeTemplate: |
  import java.util.*;
  public class Main {
      public static void main(String[] args) {
          Scanner sc = new Scanner(System.in);
          int n = sc.nextInt();
          // 짝수면 even, 홀수면 odd
      }
  }
testCasesJson: |
  [
    { "input": "4", "expected": "even" },
    { "input": "7", "expected": "odd" },
    { "input": "0", "expected": "even" }
  ]
hint: 나머지 연산자 `%`를 사용하세요.
explanation: `n % 2 == 0`이면 짝수이고, 아니면 홀수다.
tagsJson: ["조건문과 반복문"]
```

### JA-02-06

```yaml
type: CODE
difficulty: 2
title: 1부터 n까지 합
description: 정수 n을 입력받아 1부터 n까지의 합을 출력하세요.
codeTemplate: |
  import java.util.*;
  public class Main {
      public static void main(String[] args) {
          Scanner sc = new Scanner(System.in);
          int n = sc.nextInt();
          int sum = 0;
          // 1부터 n까지 더하세요
          System.out.println(sum);
      }
  }
testCasesJson: |
  [
    { "input": "5", "expected": "15" },
    { "input": "1", "expected": "1" },
    { "input": "10", "expected": "55" }
  ]
hint: `for`문으로 1부터 n까지 반복하세요.
explanation: `for (int i = 1; i <= n; i++) sum += i;`로 누적합을 구한다.
tagsJson: ["조건문과 반복문"]
```

### JA-02-07

```yaml
type: CODE
difficulty: 3
title: 배수 개수 세기
description: 두 정수 n, k를 입력받아 1부터 n까지의 정수 중 k의 배수 개수를 출력하세요.
codeTemplate: |
  import java.util.*;
  public class Main {
      public static void main(String[] args) {
          Scanner sc = new Scanner(System.in);
          int n = sc.nextInt();
          int k = sc.nextInt();
          // 배수 개수를 출력하세요
      }
  }
testCasesJson: |
  [
    { "input": "10 3", "expected": "3" },
    { "input": "20 5", "expected": "4" },
    { "input": "7 8", "expected": "0" }
  ]
hint: `i % k == 0`인지 확인하세요.
explanation: 1부터 n까지 반복하면서 k로 나누어떨어지는 수를 세면 된다.
tagsJson: ["조건문과 반복문"]
```

### JA-02-08

```yaml
type: CODE
difficulty: 3
title: 구구단 출력
description: 정수 n을 입력받아 n단의 결과를 1부터 9까지 한 줄씩 출력하세요. 형식은 `n x i = 값`입니다.
codeTemplate: |
  import java.util.*;
  public class Main {
      public static void main(String[] args) {
          Scanner sc = new Scanner(System.in);
          int n = sc.nextInt();
          // 구구단을 출력하세요
      }
  }
testCasesJson: |
  [
    { "input": "2", "expected": "2 x 1 = 2\n2 x 2 = 4\n2 x 3 = 6\n2 x 4 = 8\n2 x 5 = 10\n2 x 6 = 12\n2 x 7 = 14\n2 x 8 = 16\n2 x 9 = 18" },
    { "input": "3", "expected": "3 x 1 = 3\n3 x 2 = 6\n3 x 3 = 9\n3 x 4 = 12\n3 x 5 = 15\n3 x 6 = 18\n3 x 7 = 21\n3 x 8 = 24\n3 x 9 = 27" },
    { "input": "1", "expected": "1 x 1 = 1\n1 x 2 = 2\n1 x 3 = 3\n1 x 4 = 4\n1 x 5 = 5\n1 x 6 = 6\n1 x 7 = 7\n1 x 8 = 8\n1 x 9 = 9" }
  ]
hint: 문자열과 숫자는 `+`로 이어 붙일 수 있습니다.
explanation: 1부터 9까지 반복하며 `n + " x " + i + " = " + (n * i)`를 출력한다.
tagsJson: ["조건문과 반복문"]
```

### JA-02-09

```yaml
type: ESSAY
difficulty: 3
title: while과 for 비교
description: Java에서 `for`문과 `while`문을 각각 어떤 상황에서 쓰면 좋은지 설명하세요.
rubric: |
  - 반복 횟수가 명확할 때 for문이 적합하다고 설명하면 40점
  - 조건이 만족되는 동안 반복할 때 while문이 적합하다고 설명하면 40점
  - 간단한 예시를 들면 20점
explanation: `for`문은 횟수 기반 반복에, `while`문은 조건 기반 반복에 자주 사용된다.
tagsJson: ["조건문과 반복문"]
```

---

## 3. 배열

### JA-03-01

```yaml
type: MULTIPLE_CHOICE
difficulty: 1
title: 배열 선언
description: Java에서 정수 배열 `arr`을 길이 5로 생성하는 올바른 코드는?
optionsJson: ["int[] arr = new int[5];", "int arr = new int[5];", "arr = [5]int", "int[] arr = 5;"]
answer: "int[] arr = new int[5];"
hint: 배열은 `new`로 생성합니다.
explanation: `int[] arr = new int[5];`는 길이 5의 정수 배열을 만든다.
tagsJson: ["배열"]
```

### JA-03-02

```yaml
type: MULTIPLE_CHOICE
difficulty: 1
title: 배열 인덱스
description: Java 배열의 첫 번째 원소 인덱스는?
optionsJson: ["0", "1", "-1", "배열마다 다름"]
answer: "0"
hint: 대부분의 프로그래밍 언어 배열은 0부터 시작합니다.
explanation: Java 배열의 인덱스는 0부터 시작한다.
tagsJson: ["배열"]
```

### JA-03-03

```yaml
type: FILL_BLANK
difficulty: 1
title: 배열 길이
description: Java 배열 `arr`의 길이를 구하려면 빈칸에 들어갈 속성은?
codeTemplate: |
  int[] arr = {1, 2, 3};
  System.out.println(arr.____);
answer: length
hint: 문자열의 `length()`와 달리 배열은 괄호를 붙이지 않습니다.
explanation: 배열 길이는 `arr.length`로 확인한다.
tagsJson: ["배열"]
```

### JA-03-04

```yaml
type: SHORT_ANSWER
difficulty: 2
title: 마지막 인덱스
description: 길이가 `n`인 Java 배열의 마지막 인덱스를 식으로 쓰세요.
answer: n - 1
hint: 첫 인덱스가 0입니다.
explanation: 길이가 n이면 인덱스 범위는 0부터 n-1까지다.
tagsJson: ["배열"]
```

### JA-03-05

```yaml
type: CODE
difficulty: 2
title: 배열 합계
description: 정수 n과 n개의 정수를 입력받아 모든 원소의 합을 출력하세요.
codeTemplate: |
  import java.util.*;
  public class Main {
      public static void main(String[] args) {
          Scanner sc = new Scanner(System.in);
          int n = sc.nextInt();
          int sum = 0;
          // n개의 정수를 읽고 더하세요
          System.out.println(sum);
      }
  }
testCasesJson: |
  [
    { "input": "5\n1 2 3 4 5", "expected": "15" },
    { "input": "3\n10 -2 5", "expected": "13" },
    { "input": "1\n7", "expected": "7" }
  ]
hint: 반복문 안에서 `sc.nextInt()`를 읽으며 더할 수 있습니다.
explanation: n번 반복하며 입력값을 `sum`에 누적한다.
tagsJson: ["배열"]
```

### JA-03-06

```yaml
type: CODE
difficulty: 2
title: 최댓값 찾기
description: 정수 n과 n개의 정수를 입력받아 가장 큰 값을 출력하세요.
codeTemplate: |
  import java.util.*;
  public class Main {
      public static void main(String[] args) {
          Scanner sc = new Scanner(System.in);
          int n = sc.nextInt();
          // 최댓값을 출력하세요
      }
  }
testCasesJson: |
  [
    { "input": "5\n1 9 3 7 2", "expected": "9" },
    { "input": "4\n-5 -2 -9 -1", "expected": "-1" },
    { "input": "1\n42", "expected": "42" }
  ]
hint: 첫 번째 값을 최댓값으로 두고 비교하세요.
explanation: 입력값을 하나씩 비교하며 현재 최댓값을 갱신한다.
tagsJson: ["배열"]
```

### JA-03-07

```yaml
type: CODE
difficulty: 3
title: 짝수만 세기
description: 정수 n과 n개의 정수를 입력받아 짝수의 개수를 출력하세요.
codeTemplate: |
  import java.util.*;
  public class Main {
      public static void main(String[] args) {
          Scanner sc = new Scanner(System.in);
          int n = sc.nextInt();
          int count = 0;
          // 짝수 개수를 세세요
          System.out.println(count);
      }
  }
testCasesJson: |
  [
    { "input": "5\n1 2 3 4 6", "expected": "3" },
    { "input": "4\n1 3 5 7", "expected": "0" },
    { "input": "3\n0 -2 9", "expected": "2" }
  ]
hint: `x % 2 == 0`이면 짝수입니다.
explanation: n개의 정수를 순회하며 짝수 조건을 만족하면 count를 증가시킨다.
tagsJson: ["배열"]
```

### JA-03-08

```yaml
type: CODE
difficulty: 3
title: 배열 뒤집기 출력
description: 정수 n과 n개의 정수를 입력받아 입력된 순서의 반대로 출력하세요.
codeTemplate: |
  import java.util.*;
  public class Main {
      public static void main(String[] args) {
          Scanner sc = new Scanner(System.in);
          int n = sc.nextInt();
          int[] arr = new int[n];
          // 배열을 읽고 거꾸로 출력하세요
      }
  }
testCasesJson: |
  [
    { "input": "5\n1 2 3 4 5", "expected": "5 4 3 2 1" },
    { "input": "3\n10 20 30", "expected": "30 20 10" },
    { "input": "1\n7", "expected": "7" }
  ]
hint: 마지막 인덱스부터 0까지 감소시키며 출력하세요.
explanation: 배열에 값을 저장한 뒤 `n - 1`부터 0까지 순회한다.
tagsJson: ["배열"]
```

### JA-03-09

```yaml
type: ESSAY
difficulty: 3
title: 배열과 반복문
description: 배열을 사용할 때 반복문이 자주 함께 쓰이는 이유를 설명하세요.
rubric: |
  - 배열은 여러 값을 인덱스로 관리한다는 점을 설명하면 40점
  - 반복문으로 모든 원소를 순회할 수 있다는 점을 설명하면 40점
  - 합계, 최댓값 같은 예시를 들면 20점
explanation: 배열은 같은 자료형의 여러 값을 저장하고, 반복문은 인덱스를 바꾸며 원소를 차례대로 처리할 수 있다.
tagsJson: ["배열"]
```

---

## 4. 메서드

### JA-04-01

```yaml
type: MULTIPLE_CHOICE
difficulty: 1
title: 메서드 반환 타입
description: 값을 반환하지 않는 Java 메서드의 반환 타입은?
optionsJson: ["void", "null", "none", "empty"]
answer: void
hint: `main` 메서드에도 들어가는 단어입니다.
explanation: `void`는 메서드가 값을 반환하지 않는다는 뜻이다.
tagsJson: ["메서드"]
```

### JA-04-02

```yaml
type: MULTIPLE_CHOICE
difficulty: 1
title: 메서드 호출
description: `hello()` 메서드를 호출하는 올바른 코드는?
optionsJson: ["hello();", "call hello;", "hello:", "run hello()"]
answer: "hello();"
hint: Java 문장은 세미콜론으로 끝납니다.
explanation: 매개변수가 없는 메서드는 `hello();`처럼 호출한다.
tagsJson: ["메서드"]
```

### JA-04-03

```yaml
type: FILL_BLANK
difficulty: 1
title: 값 반환 키워드
description: 메서드에서 값을 돌려줄 때 빈칸에 들어갈 키워드는?
codeTemplate: |
  static int add(int a, int b) {
      ____ a + b;
  }
answer: return
hint: 영어로 되돌려준다는 뜻입니다.
explanation: `return`은 메서드의 실행 결과를 호출한 곳으로 돌려준다.
tagsJson: ["메서드"]
```

### JA-04-04

```yaml
type: SHORT_ANSWER
difficulty: 2
title: main의 static
description: 객체 생성 없이 호출할 수 있는 메서드에 붙이는 Java 키워드만 쓰세요.
answer: static
hint: `public static void main`에 포함됩니다.
explanation: `static` 메서드는 클래스에 속하며 객체 생성 없이 호출할 수 있다.
tagsJson: ["메서드"]
```

### JA-04-05

```yaml
type: CODE
difficulty: 2
title: add 메서드 만들기
description: 두 정수를 더해 반환하는 `add` 메서드를 작성하고, 입력받은 두 수의 합을 출력하세요.
codeTemplate: |
  import java.util.*;
  public class Main {
      static int add(int a, int b) {
          // 합을 반환하세요
      }
      public static void main(String[] args) {
          Scanner sc = new Scanner(System.in);
          int a = sc.nextInt();
          int b = sc.nextInt();
          System.out.println(add(a, b));
      }
  }
testCasesJson: |
  [
    { "input": "2 8", "expected": "10" },
    { "input": "-3 5", "expected": "2" },
    { "input": "0 0", "expected": "0" }
  ]
hint: `return a + b;`를 사용하세요.
explanation: `add` 메서드에서 두 매개변수의 합을 반환한다.
tagsJson: ["메서드"]
```

### JA-04-06

```yaml
type: CODE
difficulty: 2
title: 큰 수 반환 메서드
description: 두 정수 중 더 큰 값을 반환하는 `max` 메서드를 작성하고 결과를 출력하세요.
codeTemplate: |
  import java.util.*;
  public class Main {
      static int max(int a, int b) {
          // 더 큰 값을 반환하세요
      }
      public static void main(String[] args) {
          Scanner sc = new Scanner(System.in);
          int a = sc.nextInt();
          int b = sc.nextInt();
          System.out.println(max(a, b));
      }
  }
testCasesJson: |
  [
    { "input": "3 5", "expected": "5" },
    { "input": "10 2", "expected": "10" },
    { "input": "-1 -4", "expected": "-1" }
  ]
hint: `if`문이나 `Math.max`를 사용할 수 있습니다.
explanation: 조건문으로 두 값을 비교하여 더 큰 값을 반환한다.
tagsJson: ["메서드"]
```

### JA-04-07

```yaml
type: CODE
difficulty: 3
title: 팩토리얼 메서드
description: 정수 n을 입력받아 n!을 출력하세요. `factorial` 메서드를 작성해 사용하세요.
codeTemplate: |
  import java.util.*;
  public class Main {
      static int factorial(int n) {
          // n!을 반환하세요
      }
      public static void main(String[] args) {
          Scanner sc = new Scanner(System.in);
          int n = sc.nextInt();
          System.out.println(factorial(n));
      }
  }
testCasesJson: |
  [
    { "input": "5", "expected": "120" },
    { "input": "1", "expected": "1" },
    { "input": "0", "expected": "1" }
  ]
hint: 0!은 1입니다.
explanation: 1부터 n까지 곱한 값을 반환하면 된다.
tagsJson: ["메서드"]
```

### JA-04-08

```yaml
type: CODE
difficulty: 3
title: 소수 판별 메서드
description: 정수 n을 입력받아 소수면 `prime`, 아니면 `not prime`을 출력하세요. `isPrime` 메서드를 작성하세요.
codeTemplate: |
  import java.util.*;
  public class Main {
      static boolean isPrime(int n) {
          // 소수 여부를 반환하세요
      }
      public static void main(String[] args) {
          Scanner sc = new Scanner(System.in);
          int n = sc.nextInt();
          System.out.println(isPrime(n) ? "prime" : "not prime");
      }
  }
testCasesJson: |
  [
    { "input": "7", "expected": "prime" },
    { "input": "1", "expected": "not prime" },
    { "input": "12", "expected": "not prime" },
    { "input": "2", "expected": "prime" }
  ]
hint: 2부터 n-1까지 나누어떨어지는 수가 있는지 확인하세요.
explanation: 1 이하는 소수가 아니며, 약수가 있으면 소수가 아니다.
tagsJson: ["메서드"]
```

### JA-04-09

```yaml
type: ESSAY
difficulty: 3
title: 메서드 분리의 장점
description: 프로그램에서 코드를 메서드로 분리하면 좋은 점을 설명하세요.
rubric: |
  - 같은 코드를 재사용할 수 있다는 점을 설명하면 35점
  - 기능 단위로 읽기 쉬워진다는 점을 설명하면 35점
  - 테스트나 수정이 쉬워진다는 점을 설명하면 30점
explanation: 메서드는 기능을 이름 붙여 분리하므로 코드 재사용성, 가독성, 유지보수성을 높인다.
tagsJson: ["메서드"]
```

---

## 5. 클래스와 객체

### JA-05-01

```yaml
type: MULTIPLE_CHOICE
difficulty: 1
title: 객체 생성
description: `Person` 클래스의 객체를 생성하는 올바른 코드는?
optionsJson: ["Person p = new Person();", "Person p = Person();", "new p Person;", "p = class Person"]
answer: "Person p = new Person();"
hint: Java 객체 생성에는 `new` 키워드를 사용합니다.
explanation: `new Person()`은 Person 클래스의 새 객체를 생성한다.
tagsJson: ["클래스와 객체"]
```

### JA-05-02

```yaml
type: MULTIPLE_CHOICE
difficulty: 1
title: 필드 의미
description: 클래스 안에서 객체의 상태를 저장하는 변수는 보통 무엇이라고 부르나요?
optionsJson: ["필드", "패키지", "컴파일러", "예외"]
answer: 필드
hint: 멤버 변수라고도 부릅니다.
explanation: 필드는 객체가 가지는 데이터를 저장하는 클래스 내부 변수다.
tagsJson: ["클래스와 객체"]
```

### JA-05-03

```yaml
type: FILL_BLANK
difficulty: 1
title: 생성자 이름
description: `Student` 클래스의 생성자가 되도록 빈칸에 들어갈 이름을 쓰세요.
codeTemplate: |
  class Student {
      ____() {
      }
  }
answer: Student
hint: 생성자의 이름은 클래스 이름과 같아야 합니다.
explanation: 생성자는 반환 타입이 없고 클래스 이름과 같은 `Student`라는 이름을 가진다.
tagsJson: ["클래스와 객체"]
```

### JA-05-04

```yaml
type: SHORT_ANSWER
difficulty: 2
title: 현재 객체 키워드
description: Java에서 현재 객체 자신을 가리키는 키워드만 쓰세요.
answer: this
hint: 필드와 매개변수 이름이 같을 때 자주 사용합니다.
explanation: `this`는 현재 객체를 참조하는 키워드다.
tagsJson: ["클래스와 객체"]
```

### JA-05-05

```yaml
type: CODE
difficulty: 2
title: Student 클래스
description: 이름을 저장하는 `Student` 클래스를 완성하고 입력받은 이름을 출력하세요.
codeTemplate: |
  import java.util.*;
  class Student {
      String name;
      Student(String name) {
          // 필드를 초기화하세요
      }
  }
  public class Main {
      public static void main(String[] args) {
          Scanner sc = new Scanner(System.in);
          String name = sc.next();
          Student s = new Student(name);
          System.out.println(s.name);
      }
  }
testCasesJson: |
  [
    { "input": "Mina", "expected": "Mina" },
    { "input": "CodeDuo", "expected": "CodeDuo" },
    { "input": "Alice", "expected": "Alice" }
  ]
hint: `this.name = name;`을 사용하세요.
explanation: 생성자에서 매개변수 값을 객체 필드에 저장한다.
tagsJson: ["클래스와 객체"]
```

### JA-05-06

```yaml
type: CODE
difficulty: 2
title: Rectangle 넓이
description: 가로와 세로를 저장하는 `Rectangle` 클래스를 완성하고 넓이를 출력하세요.
codeTemplate: |
  import java.util.*;
  class Rectangle {
      int width;
      int height;
      Rectangle(int width, int height) {
          this.width = width;
          this.height = height;
      }
      int area() {
          // 넓이를 반환하세요
      }
  }
  public class Main {
      public static void main(String[] args) {
          Scanner sc = new Scanner(System.in);
          Rectangle r = new Rectangle(sc.nextInt(), sc.nextInt());
          System.out.println(r.area());
      }
  }
testCasesJson: |
  [
    { "input": "3 4", "expected": "12" },
    { "input": "5 5", "expected": "25" },
    { "input": "10 2", "expected": "20" }
  ]
hint: 넓이는 가로 곱하기 세로입니다.
explanation: `area` 메서드에서 `width * height`를 반환한다.
tagsJson: ["클래스와 객체"]
```

### JA-05-07

```yaml
type: CODE
difficulty: 3
title: Counter 클래스
description: `Counter` 클래스의 `increase` 메서드를 완성하고 n번 증가시킨 값을 출력하세요.
codeTemplate: |
  import java.util.*;
  class Counter {
      int value = 0;
      void increase() {
          // value를 1 증가시키세요
      }
  }
  public class Main {
      public static void main(String[] args) {
          Scanner sc = new Scanner(System.in);
          int n = sc.nextInt();
          Counter c = new Counter();
          for (int i = 0; i < n; i++) {
              c.increase();
          }
          System.out.println(c.value);
      }
  }
testCasesJson: |
  [
    { "input": "3", "expected": "3" },
    { "input": "0", "expected": "0" },
    { "input": "10", "expected": "10" }
  ]
hint: 필드 `value`를 증가시키면 됩니다.
explanation: `increase`가 호출될 때마다 `value++`를 수행한다.
tagsJson: ["클래스와 객체"]
```

### JA-05-08

```yaml
type: CODE
difficulty: 3
title: BankAccount 입금
description: 계좌 잔액을 저장하는 `BankAccount` 클래스를 완성하세요. 초기 잔액과 입금액을 입력받아 입금 후 잔액을 출력하세요.
codeTemplate: |
  import java.util.*;
  class BankAccount {
      int balance;
      BankAccount(int balance) {
          this.balance = balance;
      }
      void deposit(int amount) {
          // 입금 처리
      }
  }
  public class Main {
      public static void main(String[] args) {
          Scanner sc = new Scanner(System.in);
          BankAccount account = new BankAccount(sc.nextInt());
          account.deposit(sc.nextInt());
          System.out.println(account.balance);
      }
  }
testCasesJson: |
  [
    { "input": "1000 500", "expected": "1500" },
    { "input": "0 300", "expected": "300" },
    { "input": "700 0", "expected": "700" }
  ]
hint: 잔액에 입금액을 더하세요.
explanation: `balance += amount;`로 잔액을 갱신한다.
tagsJson: ["클래스와 객체"]
```

### JA-05-09

```yaml
type: ESSAY
difficulty: 3
title: 클래스와 객체 차이
description: Java에서 클래스와 객체의 차이를 설명하세요.
rubric: |
  - 클래스가 객체를 만들기 위한 설계도라는 점을 설명하면 40점
  - 객체가 클래스로부터 생성된 실제 데이터라는 점을 설명하면 40점
  - 필드나 메서드 예시를 들면 20점
explanation: 클래스는 필드와 메서드를 정의하는 설계도이고, 객체는 그 클래스를 바탕으로 메모리에 만들어진 실체다.
tagsJson: ["클래스와 객체"]
```

---

## 6. 컬렉션

### JA-06-01

```yaml
type: MULTIPLE_CHOICE
difficulty: 1
title: ArrayList 추가
description: Java `ArrayList`에 값을 추가할 때 사용하는 메서드는?
optionsJson: ["add", "push", "append", "insertLast"]
answer: add
hint: `list.add(value)` 형태입니다.
explanation: `ArrayList`는 `add` 메서드로 원소를 추가한다.
tagsJson: ["컬렉션"]
```

### JA-06-02

```yaml
type: MULTIPLE_CHOICE
difficulty: 1
title: HashMap 역할
description: Java `HashMap`은 주로 어떤 형태의 데이터를 저장하나요?
optionsJson: ["키-값 쌍", "한 글자", "고정 길이 숫자 배열", "예외 메시지"]
answer: 키-값 쌍
hint: 사전처럼 값을 찾을 수 있습니다.
explanation: `HashMap`은 key로 value를 찾는 자료구조다.
tagsJson: ["컬렉션"]
```

### JA-06-03

```yaml
type: FILL_BLANK
difficulty: 1
title: ArrayList 크기
description: `ArrayList`의 원소 개수를 구하려면 빈칸에 들어갈 메서드는?
codeTemplate: |
  ArrayList<Integer> list = new ArrayList<>();
  System.out.println(list.____());
answer: size
hint: 배열의 `length`와 달리 메서드입니다.
explanation: 컬렉션의 원소 개수는 보통 `size()`로 확인한다.
tagsJson: ["컬렉션"]
```

### JA-06-04

```yaml
type: SHORT_ANSWER
difficulty: 2
title: 컬렉션 import 패키지
description: `ArrayList`, `HashMap`, `Scanner` 등이 들어 있는 대표 패키지를 `java.`까지 포함해 쓰세요.
answer: java.util
hint: `import java.util.*;`에서 별표 앞 부분입니다.
explanation: Java의 기본 자료구조와 유틸리티 클래스는 주로 `java.util` 패키지에 있다.
tagsJson: ["컬렉션"]
```

### JA-06-05

```yaml
type: CODE
difficulty: 2
title: ArrayList 합계
description: 정수 n과 n개의 정수를 입력받아 `ArrayList`에 저장한 뒤 합계를 출력하세요.
codeTemplate: |
  import java.util.*;
  public class Main {
      public static void main(String[] args) {
          Scanner sc = new Scanner(System.in);
          int n = sc.nextInt();
          ArrayList<Integer> list = new ArrayList<>();
          // 값을 저장하고 합계를 출력하세요
      }
  }
testCasesJson: |
  [
    { "input": "4\n1 2 3 4", "expected": "10" },
    { "input": "3\n10 -1 5", "expected": "14" },
    { "input": "1\n8", "expected": "8" }
  ]
hint: `list.add(sc.nextInt())`로 저장할 수 있습니다.
explanation: 입력값을 리스트에 넣고 향상된 for문으로 합계를 구한다.
tagsJson: ["컬렉션"]
```

### JA-06-06

```yaml
type: CODE
difficulty: 2
title: 이름 존재 여부
description: 정수 n, n개의 이름, 찾을 이름 target을 입력받아 리스트에 target이 있으면 `yes`, 없으면 `no`를 출력하세요.
codeTemplate: |
  import java.util.*;
  public class Main {
      public static void main(String[] args) {
          Scanner sc = new Scanner(System.in);
          int n = sc.nextInt();
          ArrayList<String> names = new ArrayList<>();
          // 이름들을 저장하고 target 포함 여부를 출력하세요
      }
  }
testCasesJson: |
  [
    { "input": "3\nMina Jisu Hana\nJisu", "expected": "yes" },
    { "input": "2\nTom Bob\nAlice", "expected": "no" },
    { "input": "1\nCodeDuo\nCodeDuo", "expected": "yes" }
  ]
hint: `contains` 메서드를 사용할 수 있습니다.
explanation: 리스트에 값을 저장한 뒤 `names.contains(target)`으로 존재 여부를 확인한다.
tagsJson: ["컬렉션"]
```

### JA-06-07

```yaml
type: CODE
difficulty: 3
title: 단어 빈도수
description: 정수 n과 n개의 단어를 입력받아 마지막으로 입력된 단어가 전체에서 몇 번 등장했는지 출력하세요.
codeTemplate: |
  import java.util.*;
  public class Main {
      public static void main(String[] args) {
          Scanner sc = new Scanner(System.in);
          int n = sc.nextInt();
          HashMap<String, Integer> count = new HashMap<>();
          String last = "";
          // 단어 빈도수를 세고 마지막 단어의 빈도수를 출력하세요
      }
  }
testCasesJson: |
  [
    { "input": "5\napple banana apple kiwi apple", "expected": "3" },
    { "input": "4\na b a b", "expected": "2" },
    { "input": "1\nsolo", "expected": "1" }
  ]
hint: `getOrDefault`를 사용하면 편합니다.
explanation: 단어를 key로, 등장 횟수를 value로 저장한다.
tagsJson: ["컬렉션"]
```

### JA-06-08

```yaml
type: CODE
difficulty: 3
title: 중복 제거 개수
description: 정수 n과 n개의 정수를 입력받아 서로 다른 숫자의 개수를 출력하세요.
codeTemplate: |
  import java.util.*;
  public class Main {
      public static void main(String[] args) {
          Scanner sc = new Scanner(System.in);
          int n = sc.nextInt();
          HashSet<Integer> set = new HashSet<>();
          // 서로 다른 숫자의 개수를 출력하세요
      }
  }
testCasesJson: |
  [
    { "input": "5\n1 2 2 3 1", "expected": "3" },
    { "input": "4\n7 7 7 7", "expected": "1" },
    { "input": "6\n1 2 3 4 5 6", "expected": "6" }
  ]
hint: `HashSet`은 중복을 저장하지 않습니다.
explanation: 모든 수를 `HashSet`에 넣고 `set.size()`를 출력한다.
tagsJson: ["컬렉션"]
```

### JA-06-09

```yaml
type: ESSAY
difficulty: 3
title: 배열과 ArrayList 비교
description: Java 배열과 `ArrayList`의 차이를 설명하세요.
rubric: |
  - 배열은 길이가 고정된다는 점을 설명하면 35점
  - ArrayList는 크기를 동적으로 늘릴 수 있다는 점을 설명하면 35점
  - 기본형/제네릭 또는 사용 예시를 들면 30점
explanation: 배열은 생성 후 길이가 고정되고, `ArrayList`는 원소 추가와 삭제에 따라 크기가 바뀔 수 있는 컬렉션이다.
tagsJson: ["컬렉션"]
```

---

## 7. 예외 처리

### JA-07-01

```yaml
type: MULTIPLE_CHOICE
difficulty: 1
title: 예외 처리 키워드
description: Java에서 예외가 발생할 수 있는 코드를 감싸는 키워드는?
optionsJson: ["try", "catch", "error", "throwing"]
answer: try
hint: `catch`와 함께 자주 사용됩니다.
explanation: `try` 블록에는 예외가 발생할 수 있는 코드를 넣는다.
tagsJson: ["예외 처리"]
```

### JA-07-02

```yaml
type: MULTIPLE_CHOICE
difficulty: 1
title: 예외 잡기
description: Java에서 발생한 예외를 처리하는 블록에 쓰는 키워드는?
optionsJson: ["catch", "grab", "except", "rescue"]
answer: catch
hint: Python의 `except`와 비슷한 역할입니다.
explanation: `catch` 블록은 `try`에서 발생한 예외를 받아 처리한다.
tagsJson: ["예외 처리"]
```

### JA-07-03

```yaml
type: FILL_BLANK
difficulty: 1
title: finally 빈칸
description: 예외 발생 여부와 관계없이 실행되는 블록의 키워드는?
codeTemplate: |
  try {
      System.out.println("run");
  } ____ {
      System.out.println("always");
  }
answer: finally
hint: 마지막에 항상 실행된다는 의미입니다.
explanation: `finally` 블록은 예외가 발생하든 안 하든 실행된다.
tagsJson: ["예외 처리"]
```

### JA-07-04

```yaml
type: SHORT_ANSWER
difficulty: 2
title: 0으로 나누기 예외
description: Java에서 정수를 0으로 나눌 때 발생하는 대표 예외 클래스 이름을 쓰세요.
answer: ArithmeticException
hint: 산술 연산과 관련된 예외입니다.
explanation: 정수 나눗셈에서 0으로 나누면 `ArithmeticException`이 발생한다.
tagsJson: ["예외 처리"]
```

### JA-07-05

```yaml
type: CODE
difficulty: 2
title: 안전한 나눗셈
description: 두 정수 a, b를 입력받아 a / b를 출력하세요. b가 0이면 `error`를 출력하세요.
codeTemplate: |
  import java.util.*;
  public class Main {
      public static void main(String[] args) {
          Scanner sc = new Scanner(System.in);
          int a = sc.nextInt();
          int b = sc.nextInt();
          // b가 0이면 error, 아니면 나눗셈 결과를 출력하세요
      }
  }
testCasesJson: |
  [
    { "input": "10 2", "expected": "5" },
    { "input": "7 0", "expected": "error" },
    { "input": "9 3", "expected": "3" }
  ]
hint: 조건문으로 0인지 먼저 확인하세요.
explanation: 나누기 전에 b가 0인지 검사하면 예외를 피할 수 있다.
tagsJson: ["예외 처리"]
```

### JA-07-06

```yaml
type: CODE
difficulty: 2
title: try-catch 나눗셈
description: 두 정수 a, b를 입력받아 a / b를 출력하세요. 예외가 발생하면 `error`를 출력하세요.
codeTemplate: |
  import java.util.*;
  public class Main {
      public static void main(String[] args) {
          Scanner sc = new Scanner(System.in);
          int a = sc.nextInt();
          int b = sc.nextInt();
          try {
              // 나눗셈 결과를 출력하세요
          } catch (ArithmeticException e) {
              System.out.println("error");
          }
      }
  }
testCasesJson: |
  [
    { "input": "8 2", "expected": "4" },
    { "input": "5 0", "expected": "error" },
    { "input": "10 4", "expected": "2" }
  ]
hint: try 블록 안에서 나눗셈을 실행하세요.
explanation: 0으로 나누면 `ArithmeticException`이 발생하고 catch 블록이 실행된다.
tagsJson: ["예외 처리"]
```

### JA-07-07

```yaml
type: CODE
difficulty: 3
title: 숫자 변환 예외
description: 문자열 s를 입력받아 정수로 바꿔 출력하세요. 정수로 바꿀 수 없으면 `invalid`를 출력하세요.
codeTemplate: |
  import java.util.*;
  public class Main {
      public static void main(String[] args) {
          Scanner sc = new Scanner(System.in);
          String s = sc.next();
          // 정수 변환 예외를 처리하세요
      }
  }
testCasesJson: |
  [
    { "input": "123", "expected": "123" },
    { "input": "abc", "expected": "invalid" },
    { "input": "-7", "expected": "-7" }
  ]
hint: `Integer.parseInt`와 `NumberFormatException`을 사용하세요.
explanation: 문자열을 정수로 바꾸다 실패하면 `NumberFormatException`이 발생한다.
tagsJson: ["예외 처리"]
```

### JA-07-08

```yaml
type: CODE
difficulty: 3
title: 배열 인덱스 안전 접근
description: 정수 n, n개의 정수, 인덱스 idx를 입력받아 해당 원소를 출력하세요. 범위를 벗어나면 `out`을 출력하세요.
codeTemplate: |
  import java.util.*;
  public class Main {
      public static void main(String[] args) {
          Scanner sc = new Scanner(System.in);
          int n = sc.nextInt();
          int[] arr = new int[n];
          for (int i = 0; i < n; i++) {
              arr[i] = sc.nextInt();
          }
          int idx = sc.nextInt();
          // 안전하게 배열에 접근하세요
      }
  }
testCasesJson: |
  [
    { "input": "3\n10 20 30\n1", "expected": "20" },
    { "input": "2\n5 9\n2", "expected": "out" },
    { "input": "4\n1 2 3 4\n0", "expected": "1" }
  ]
hint: 조건문이나 `ArrayIndexOutOfBoundsException` 처리를 사용할 수 있습니다.
explanation: idx가 0 이상 n 미만일 때만 배열에 접근해야 한다.
tagsJson: ["예외 처리"]
```

### JA-07-09

```yaml
type: ESSAY
difficulty: 3
title: 예외 처리의 필요성
description: 프로그램에서 예외 처리가 필요한 이유를 설명하세요.
rubric: |
  - 예상 가능한 오류 상황을 다룰 수 있다는 점을 설명하면 35점
  - 프로그램이 비정상 종료되는 것을 줄인다는 점을 설명하면 35점
  - 사용자에게 적절한 메시지나 대체 동작을 제공할 수 있다는 점을 설명하면 30점
explanation: 예외 처리는 실행 중 발생할 수 있는 오류를 제어하여 프로그램의 안정성과 사용자 경험을 높인다.
tagsJson: ["예외 처리"]
```
