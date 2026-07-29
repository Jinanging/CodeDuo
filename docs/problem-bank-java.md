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
title: 안내 문구 출력하기
description: 콘솔 프로그램에서 사용자에게 `Hello`를 한 줄로 보여주려고 합니다. Java에서 올바른 출력 코드는?
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
title: 점수 변수 선언하기
description: 퀴즈 점수 20점을 `score` 변수에 저장하려고 합니다. Java의 정적 타입 문법에 맞는 코드는?
optionsJson: ["int score = 20;", "score = 20", "let score = 20;", "Integer score := 20;"]
answer: "int score = 20;"
hint: Java는 변수 선언 시 자료형을 먼저 씁니다.
explanation: Java의 기본 정수 자료형은 `int`이며 `int score = 20;`처럼 선언한다.
tagsJson: ["기본 문법"]
```

### JA-01-03

```yaml
type: FILL_BLANK
difficulty: 1
title: 프로그램 시작점 찾기
description: Java 프로그램이 실행될 때 가장 먼저 호출되는 메서드 이름으로 빈칸에 들어갈 단어는?
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
title: 닉네임 자료형 고르기
description: 사용자 닉네임처럼 여러 글자로 된 텍스트를 저장할 때 사용하는 Java의 대표 클래스 이름만 쓰세요.
answer: String
hint: 첫 글자가 대문자인 참조 자료형입니다.
explanation: Java에서 문자열은 `String` 클래스로 표현한다.
tagsJson: ["기본 문법"]
```

### JA-01-05

```yaml
type: CODE
difficulty: 2
title: 두 라운드 점수 합산
description: 두 라운드에서 얻은 정수 점수 a, b를 입력받아 총점을 출력하세요.
codeTemplate: |
  import java.util.*;
  public class Main {
      public static void main(String[] args) {
          Scanner sc = new Scanner(System.in);
          int a = sc.nextInt();
          int b = sc.nextInt();
          // 총점을 출력하세요
      }
  }
testCasesJson: |
  [
    { "input": "2 3", "expected": "5" },
    { "input": "-1 6", "expected": "5" },
    { "input": "10 0", "expected": "10" }
  ]
hint: 두 점수를 더해 출력하면 됩니다.
explanation: `System.out.println(a + b);`로 두 라운드 점수의 합을 출력한다.
tagsJson: ["기본 문법"]
```

### JA-01-06

```yaml
type: CODE
difficulty: 2
title: 점수 변화 출력
description: 이전 점수 a와 이번에 얻은 점수 b를 입력받아 총점과 점수 차이를 각각 한 줄에 출력하세요.
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
title: 세 과제 평균 점수
description: 세 과제 점수를 입력받아 정수 나눗셈으로 평균을 출력하세요.
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
title: 스터디 그룹 나누기
description: 전체 인원 a명과 한 그룹 인원 b명을 입력받아 만들 수 있는 그룹 수와 남는 인원을 공백으로 출력하세요.
codeTemplate: |
  import java.util.*;
  public class Main {
      public static void main(String[] args) {
          Scanner sc = new Scanner(System.in);
          int a = sc.nextInt();
          int b = sc.nextInt();
          // 그룹 수와 남는 인원을 출력하세요
      }
  }
testCasesJson: |
  [
    { "input": "7 3", "expected": "2 1" },
    { "input": "10 5", "expected": "2 0" },
    { "input": "20 6", "expected": "3 2" }
  ]
hint: 그룹 수는 몫, 남는 인원은 나머지입니다.
explanation: `a / b`는 만들 수 있는 그룹 수, `a % b`는 남는 인원이다.
tagsJson: ["기본 문법"]
```

### JA-01-09

```yaml
type: ESSAY
difficulty: 3
title: 정적 타입이 오류를 줄이는 방식
description: Java가 정적 타입 언어라는 말의 의미와, 변수에 맞지 않는 자료형을 넣으려 할 때 어떤 장점이 있는지 설명하세요.
rubric: |
  - 변수 선언 시 자료형을 명시해야 한다는 점을 설명하면 30점
  - 컴파일 단계에서 타입 오류를 찾을 수 있다는 점을 설명하면 35점
  - 코드가 커질수록 타입 정보가 협업과 유지보수에 도움이 된다는 점을 설명하면 20점
  - `int`, `String` 같은 예시를 들면 15점
explanation: Java는 변수와 메서드의 타입을 코드에 명시한다. 컴파일러가 타입을 검사하므로 실행 전에 많은 실수를 찾을 수 있다.
tagsJson: ["기본 문법"]
```

---

## 2. 조건문과 반복문

### JA-02-01

```yaml
type: MULTIPLE_CHOICE
difficulty: 1
title: 보상 지급 조건 작성하기
description: 풀이 점수 `x`가 10보다 큰 경우에만 보상을 주려고 합니다. Java에서 올바른 조건식은?
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
title: 5문제 반복 처리하기
description: 오늘의 미션 5문제를 0번부터 4번까지 차례로 처리하려고 합니다. 올바른 Java 반복문은?
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
title: 실패 메시지 처리하기
description: 60점 이상이면 통과, 그렇지 않으면 실패 메시지를 출력하려고 합니다. 빈칸에 들어갈 키워드는?
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
title: 목표 달성 후 반복 멈추기
description: 목표 점수를 찾으면 더 확인하지 않고 Java 반복문을 즉시 종료하려고 합니다. 사용하는 키워드만 쓰세요.
answer: break
hint: switch문에서도 사용할 수 있습니다.
explanation: `break`는 현재 반복문이나 switch문을 빠져나간다.
tagsJson: ["조건문과 반복문"]
```

### JA-02-05

```yaml
type: CODE
difficulty: 2
title: 짝수 번째 문제 표시
description: 문제 번호 n을 입력받아 짝수 번째 문제면 `even`, 홀수 번째 문제면 `odd`를 출력하세요.
codeTemplate: |
  import java.util.*;
  public class Main {
      public static void main(String[] args) {
          Scanner sc = new Scanner(System.in);
          int n = sc.nextInt();
          // 문제 번호가 짝수면 even, 홀수면 odd
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
title: 누적 출석 보상 계산
description: 연속 출석일 n을 입력받아 1일부터 n일까지 매일 1점씩 늘어나는 보상의 총합을 출력하세요.
codeTemplate: |
  import java.util.*;
  public class Main {
      public static void main(String[] args) {
          Scanner sc = new Scanner(System.in);
          int n = sc.nextInt();
          int sum = 0;
          // 1일부터 n일까지 보상을 더하세요
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
title: 이벤트 문제 개수 세기
description: 1번부터 n번 문제 중 k의 배수 번호마다 이벤트 보상을 준다고 할 때, 보상 대상 문제 수를 출력하세요.
codeTemplate: |
  import java.util.*;
  public class Main {
      public static void main(String[] args) {
          Scanner sc = new Scanner(System.in);
          int n = sc.nextInt();
          int k = sc.nextInt();
          // 이벤트 대상 문제 수를 출력하세요
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
title: 반복 출력 형식 맞추기
description: 정수 n을 입력받아 n단 결과를 1부터 9까지 한 줄씩 출력하세요. 형식은 `n x i = 값`입니다.
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
title: 반복문 선택 기준 설명하기
description: Java에서 문제 수가 정해진 경우와 목표를 찾을 때까지 반복하는 경우에 `for`문과 `while`문을 각각 어떻게 선택하면 좋은지 설명하세요.
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
title: 점수 배열 만들기
description: 5개의 퀴즈 점수를 저장할 정수 배열 `arr`을 만들려고 합니다. Java에서 올바른 코드는?
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
title: 첫 번째 점수 위치 찾기
description: 점수 배열에서 첫 번째 원소에 접근하려고 합니다. Java 배열의 첫 번째 원소 인덱스는?
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
title: 저장된 점수 개수 확인하기
description: Java 배열 `arr`에 저장할 수 있는 원소 개수를 구하려면 빈칸에 들어갈 속성은?
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
title: 마지막 점수 인덱스
description: 길이가 `n`인 Java 배열에서 마지막 점수의 인덱스를 식으로 쓰세요.
answer: n - 1
hint: 첫 인덱스가 0입니다.
explanation: 길이가 n이면 인덱스 범위는 0부터 n-1까지다.
tagsJson: ["배열"]
```

### JA-03-05

```yaml
type: CODE
difficulty: 2
title: 점수 배열 합계
description: 정수 n과 n개의 점수를 입력받아 배열에 저장한 뒤 모든 점수의 합을 출력하세요.
codeTemplate: |
  import java.util.*;
  public class Main {
      public static void main(String[] args) {
          Scanner sc = new Scanner(System.in);
          int n = sc.nextInt();
          int[] scores = new int[n];
          int sum = 0;
          // 점수를 배열에 저장하고 합계를 구하세요
          System.out.println(sum);
      }
  }
testCasesJson: |
  [
    { "input": "5\n1 2 3 4 5", "expected": "15" },
    { "input": "3\n10 -2 5", "expected": "13" },
    { "input": "1\n7", "expected": "7" }
  ]
hint: 먼저 `scores[i]`에 저장한 뒤 `sum`에 더하세요.
explanation: n번 반복하며 점수를 배열에 저장하고, 같은 반복 안에서 sum에 누적할 수 있다.
tagsJson: ["배열"]
```

### JA-03-06

```yaml
type: CODE
difficulty: 2
title: 최고 점수 찾기
description: 정수 n과 n개의 점수를 입력받아 배열에 저장한 뒤 가장 높은 점수를 출력하세요.
codeTemplate: |
  import java.util.*;
  public class Main {
      public static void main(String[] args) {
          Scanner sc = new Scanner(System.in);
          int n = sc.nextInt();
          int[] scores = new int[n];
          // 점수를 배열에 저장하고 최고 점수를 출력하세요
      }
  }
testCasesJson: |
  [
    { "input": "5\n1 9 3 7 2", "expected": "9" },
    { "input": "4\n-5 -2 -9 -1", "expected": "-1" },
    { "input": "1\n42", "expected": "42" }
  ]
hint: 첫 번째 원소를 최댓값으로 두고 나머지 원소와 비교하세요.
explanation: 배열에 점수를 저장한 뒤 모든 원소를 순회하며 현재 최댓값을 갱신한다.
tagsJson: ["배열"]
```

### JA-03-07

```yaml
type: CODE
difficulty: 3
title: 짝수 번호 문제 세기
description: 정수 n과 n개의 문제 번호를 입력받아 배열에 저장한 뒤 짝수 번호 문제의 개수를 출력하세요.
codeTemplate: |
  import java.util.*;
  public class Main {
      public static void main(String[] args) {
          Scanner sc = new Scanner(System.in);
          int n = sc.nextInt();
          int[] numbers = new int[n];
          int count = 0;
          // 문제 번호를 배열에 저장하고 짝수 개수를 세세요
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
title: 최근 풀이 순서로 출력
description: 정수 n과 n개의 문제 번호를 입력받아 배열에 저장한 뒤 최근에 푼 순서가 되도록 거꾸로 출력하세요.
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
title: 배열과 반복문을 함께 쓰는 이유
description: 여러 문제 점수를 배열에 저장할 때 반복문이 자주 함께 쓰이는 이유를 설명하세요.
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
title: 출력만 하는 메서드 만들기
description: 안내 문구를 출력만 하고 값을 돌려주지 않는 Java 메서드의 반환 타입은?
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
title: 만든 메서드 실행하기
description: 미리 정의한 `hello()` 메서드를 실행하는 올바른 코드는?
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
title: 계산 결과 돌려주기
description: 메서드에서 계산한 점수를 호출한 곳으로 돌려줄 때 빈칸에 들어갈 키워드는?
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
title: 객체 없이 호출하는 메서드
description: 객체 생성 없이 호출할 수 있는 Java 메서드에 붙이는 키워드만 쓰세요.
answer: static
hint: `public static void main`에 포함됩니다.
explanation: `static` 메서드는 클래스에 속하며 객체 생성 없이 호출할 수 있다.
tagsJson: ["메서드"]
```

### JA-04-05

```yaml
type: CODE
difficulty: 2
title: 점수 합산 메서드
description: 두 라운드 점수를 더해 반환하는 `add` 메서드를 작성하고, 입력받은 두 점수의 합을 출력하세요.
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
title: 높은 점수 반환 메서드
description: 두 라운드 점수 중 더 높은 값을 반환하는 `max` 메서드를 작성하고 결과를 출력하세요.
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
title: 단계별 경우의 수 메서드
description: 단계 수 n을 입력받아 n!을 출력하세요. `factorial` 메서드를 작성해 사용하세요.
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
title: 특별 문제 번호 판별 메서드
description: 문제 번호 n을 입력받아 소수면 `prime`, 아니면 `not prime`을 출력하세요. `isPrime` 메서드를 작성하세요.
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
title: 메서드로 코드를 나누는 이유
description: 점수 계산, 등급 판정처럼 반복되는 로직을 메서드로 분리하면 좋은 점을 설명하세요.
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
title: 사용자 객체 만들기
description: `Person` 클래스의 사용자 객체를 생성하는 올바른 코드는?
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
title: 객체 상태 저장하기
description: 클래스 안에서 사용자 이름이나 점수처럼 객체의 상태를 저장하는 변수는 보통 무엇이라고 부르나요?
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
title: 생성자 이름 맞추기
description: `Student` 클래스 객체가 만들어질 때 호출되는 생성자가 되도록 빈칸에 들어갈 이름을 쓰세요.
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
title: 현재 사용자 객체 가리키기
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
title: 학습자 이름 저장 클래스
description: 이름을 저장하는 `Student` 클래스를 완성하고 입력받은 학습자 이름을 출력하세요.
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
title: 카드 영역 계산 클래스
description: 가로와 세로를 저장하는 `Rectangle` 클래스를 완성하고 카드 영역의 넓이를 출력하세요.
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
title: 풀이 횟수 카운터 클래스
description: `Counter` 클래스의 `increase` 메서드를 완성하고 n번 문제를 푼 뒤의 값을 출력하세요.
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
title: XP 지갑 입금 처리
description: XP 잔액을 저장하는 `BankAccount` 클래스를 완성하세요. 초기 XP와 추가 XP를 입력받아 입금 후 잔액을 출력하세요.
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
title: 클래스와 객체 차이 설명하기
description: Java에서 `User` 설계도와 실제 사용자 객체의 차이를 예로 들어 클래스와 객체의 차이를 설명하세요.
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
title: 풀이 기록 추가하기
description: Java `ArrayList`에 새 풀이 기록을 추가할 때 사용하는 메서드는?
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
title: 사용자별 점수 저장하기
description: Java `HashMap`은 사용자 이름과 점수처럼 주로 어떤 형태의 데이터를 저장하나요?
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
title: 풀이 기록 개수 확인하기
description: `ArrayList`에 저장된 풀이 기록 개수를 구하려면 빈칸에 들어갈 메서드는?
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
title: 컬렉션 패키지 쓰기
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
title: ArrayList 점수 합계
description: 정수 n과 n개의 점수를 입력받아 `ArrayList`에 저장한 뒤 합계를 출력하세요.
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
title: 친구 이름 찾기
description: 정수 n, n개의 친구 이름, 찾을 이름 target을 입력받아 리스트에 target이 있으면 `yes`, 없으면 `no`를 출력하세요.
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
title: 오답 유형 빈도수
description: 정수 n과 n개의 오답 유형을 입력받아 마지막으로 입력된 유형이 전체에서 몇 번 등장했는지 출력하세요.
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
title: 서로 다른 문제 수 세기
description: 정수 n과 n개의 문제 번호를 입력받아 서로 다른 문제 번호의 개수를 출력하세요.
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
title: 배열과 ArrayList 선택 기준
description: Java에서 문제 수가 고정된 경우와 계속 추가되는 풀이 기록을 저장하는 경우에 배열과 `ArrayList`를 어떻게 선택하면 좋은지 설명하세요.
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
title: 위험한 코드 감싸기
description: 나눗셈이나 숫자 변환처럼 예외가 발생할 수 있는 Java 코드를 감싸는 키워드는?
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
title: 예외 상황 처리하기
description: Java에서 발생한 예외를 받아서 처리하는 블록에 쓰는 키워드는?
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
title: 항상 실행되는 정리 코드
description: 예외 발생 여부와 관계없이 실행되는 정리 블록의 키워드는?
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
title: 0점 기준 나눗셈 예외
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
title: 안전한 평균 계산
description: 총점 a와 문제 수 b를 입력받아 a / b를 출력하세요. b가 0이면 `error`를 출력하세요.
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
title: try-catch 평균 계산
description: 총점 a와 문제 수 b를 입력받아 a / b를 출력하세요. 예외가 발생하면 `error`를 출력하세요.
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
title: 점수 문자열 변환 예외
description: 문자열 s를 입력받아 정수 점수로 바꿔 출력하세요. 정수로 바꿀 수 없으면 `invalid`를 출력하세요.
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
title: 풀이 기록 안전 접근
description: 정수 n, n개의 점수, 인덱스 idx를 입력받아 해당 점수를 출력하세요. 범위를 벗어나면 `out`을 출력하세요.
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
title: 예외 처리가 필요한 이유
description: 사용자 입력이나 배열 접근에서 예상하지 못한 값이 들어올 때 예외 처리가 필요한 이유를 설명하세요.
rubric: |
  - 예상 가능한 오류 상황을 다룰 수 있다는 점을 설명하면 35점
  - 프로그램이 비정상 종료되는 것을 줄인다는 점을 설명하면 35점
  - 사용자에게 적절한 메시지나 대체 동작을 제공할 수 있다는 점을 설명하면 30점
explanation: 예외 처리는 실행 중 발생할 수 있는 오류를 제어하여 프로그램의 안정성과 사용자 경험을 높인다.
tagsJson: ["예외 처리"]
```
