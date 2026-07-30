# CodeDuo

CodeDuo는 Duolingo처럼 가볍게 학습하고, 온라인 저지처럼 실제 코드를 실행해보는 코딩 학습 플랫폼입니다.  
Python, Java, C, C++ 학습을 목차와 난이도에 따라 진행하고, 오답노트와 AI 학습 리포트로 복습 흐름까지 이어갈 수 있도록 설계했습니다.

## 주요 기능

- 언어별 학습: Python, Java, C, C++ 지원
- 목차 기반 문제은행: 언어별 7개 목차, 초급/중급/고급 난이도 구성
- 다양한 문제 유형: 객관식, 빈칸, 단답, 코드 실행, 서술형
- 코드 채점: Judge0 기반 코드 실행 및 테스트케이스 채점
- AI 학습 지원: AI 힌트, 코드 리뷰, 프리미엄 AI 학습 리포트
- 복습 기능: 오답노트, 추천 문제, 다음 난이도 이어 풀기
- 성적 분석: 최근 학습 흐름, 언어별 풀이 흐름, AI 기반 학습 요약
- 친구/그룹: 친구 추가, 그룹 검색, 그룹 생성, 가입 신청
- 관리자 기능: 문제 등록/수정/삭제, 문제은행 문서 import

## 기술 스택

### Frontend

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Recharts
- lucide-react

### Backend

- Java 17
- Spring Boot 4
- Spring Security + JWT
- Spring Data JPA
- MySQL 8.4
- H2
- Springdoc OpenAPI

### Infra / External

- Docker Compose
- Nginx
- Judge0
- Gemini API

## 시스템 아키텍처

CodeDuo는 AWS EC2 기반으로 배포되어 있습니다. 애플리케이션 서버와 코드 채점 서버를 분리해, 웹 서비스와 코드 실행 환경이 서로 독립적으로 동작하도록 구성했습니다.

```text
사용자 브라우저
    ↓
Nginx
    ├── React 정적 파일 제공
    └── /api 요청을 Spring Boot 백엔드로 프록시
            ↓
        Spring Boot Backend
            ├── MySQL
            ├── Gemini API
            └── Judge0 Server
```

### App Server EC2

- Nginx로 프론트엔드 정적 파일을 서빙합니다.
- Spring Boot 백엔드를 Docker Compose로 실행합니다.
- MySQL을 Docker 컨테이너로 실행합니다.
- `/api` 요청은 Nginx reverse proxy를 통해 백엔드로 전달됩니다.

### Judge Server EC2

- Judge0를 별도 EC2 인스턴스에서 실행합니다.
- 백엔드는 코드 제출 요청이 들어오면 Judge0 API를 호출해 코드를 실행하고 테스트케이스 결과를 받아옵니다.
- 코드 실행 환경을 애플리케이션 서버와 분리해 운영 안정성을 높입니다.

## 프로젝트 구조

```text
CodeDuo
├── backend/                  # Spring Boot API 서버
│   └── src/main/java/com/codeduo
│       ├── admin/             # 관리자 문제 관리
│       ├── ai/                # AI 힌트, AI 리포트, 면접 기능
│       ├── auth/              # 로그인, 회원가입, JWT 인증
│       ├── friend/            # 친구/그룹 기능
│       ├── problem/           # 문제 도메인
│       ├── progress/          # 학습 진도, 연속 학습
│       ├── submission/        # 답안 제출, 채점
│       ├── user/              # 사용자 정보
│       └── wronganswer/       # 오답노트
├── frontend/                 # React + Vite 프론트엔드
│   └── src
│       ├── app/               # 주요 화면과 API 클라이언트
│       ├── assets/            # 로고, 언어 아이콘, 마스코트 이미지
│       └── components/        # UI 컴포넌트
├── docs/                     # 문제은행, 운영 문서
├── scripts/                  # 문제은행 import, Judge0 터널 스크립트
├── config/                   # 로컬 설정 예시
└── docker-compose.yml
```

## 로컬 실행

### 1. 사전 준비

- JDK 17
- Node.js / npm
- Docker Desktop

### 2. 환경 변수 설정

```bash
cp .env.example .env
```

`.env`에는 JWT 키, DB 계정, 관리자 계정, Gemini API Key, Judge0 설정 등을 넣습니다.  
실제 비밀번호, API Key, private key는 Git에 올리지 않습니다.

주요 환경 변수 예시는 다음과 같습니다.

```bash
JWT_SECRET=<random-secret>
CORS_ALLOWED_ORIGINS=http://localhost:5173

DB_URL=jdbc:mysql://localhost:3306/codeduo
DB_USERNAME=<db-user>
DB_PASSWORD=<db-password>

ADMIN_BOOTSTRAP_EMAIL=<admin-email>
ADMIN_BOOTSTRAP_PASSWORD=<admin-password>
ADMIN_EMAILS=<admin-email>

AI_PROVIDER=gemini
GEMINI_API_KEY=<gemini-api-key>

JUDGE0_MOCK=false
JUDGE0_BASE_URL=<judge0-url>
```

### 3. 백엔드 실행

Docker Compose로 MySQL과 백엔드를 함께 실행합니다.

```bash
docker compose up -d --build
```

로컬에서 직접 Spring Boot를 실행할 수도 있습니다.

```bash
./gradlew :backend:bootRun
```

### 4. 프론트엔드 실행

```bash
cd frontend
npm install
npm run dev
```

로컬 개발 서버는 기본적으로 Vite의 `http://localhost:5173`에서 실행됩니다.

## 문제은행 관리

문제은행 문서는 `docs/problem-bank-*.md`에 있습니다.

- `docs/problem-bank-python.md`
- `docs/problem-bank-java.md`
- `docs/problem-bank-c.md`
- `docs/problem-bank-cpp.md`

관리자 계정으로 문제은행을 서버에 import할 수 있습니다.

```bash
python3 scripts/import_problem_bank.py \
  --file docs/problem-bank-python.md \
  --base-url http://localhost:8080 \
  --email <admin-email> \
  --password <admin-password> \
  --dry-run
```

실제 반영 시에는 `--dry-run`을 빼고, 기존 문제를 갱신하려면 `--update-existing`을 사용합니다.

```bash
python3 scripts/import_problem_bank.py \
  --file docs/problem-bank-python.md \
  --base-url http://localhost:8080 \
  --email <admin-email> \
  --password <admin-password> \
  --update-existing
```

## 테스트

백엔드 테스트:

```bash
./gradlew :backend:test
```

프론트엔드 빌드:

```bash
npm --prefix frontend run build
```

## 배포

운영 서버에서는 최신 코드를 받은 뒤 백엔드 컨테이너를 다시 빌드하고, 프론트엔드 정적 파일을 Nginx 경로에 반영합니다.

```bash
cd ~/CodeDuo
git fetch origin
git switch main
git pull --ff-only origin main

docker compose up -d --build --force-recreate spring-app

cd ~/CodeDuo/frontend
VITE_API_BASE=https://<server-domain-or-ip> npm run build
sudo rsync -a --delete dist/ /var/www/codeduo/

docker compose ps
```

`VITE_API_BASE`는 프론트엔드가 호출할 백엔드 API 주소입니다.  
로컬 개발에서는 Vite dev server와 백엔드 CORS 설정을 사용하고, 배포 시에는 실제 서버 주소를 지정합니다.

## 보안 주의사항

- `.env`, private key, DB 비밀번호, JWT secret, Gemini API Key는 Git에 커밋하지 않습니다.
- 관리자 초기 계정은 환경 변수로만 주입합니다.
- Judge0 서버는 외부에 직접 공개하지 않고, 필요한 경우 reverse proxy 또는 private network로 연결합니다.
- 운영 환경에서는 HTTPS와 정확한 CORS origin 설정이 필요합니다.

## 관련 문서

- `docs/problem-quality-guide.md`: 문제 품질 기준
- `docs/curriculum-plan.md`: 커리큘럼 설계
- `docs/operation-notes.md`: 운영 메모
- `config/grading-secrets.example.json`: 코드 채점 secret 예시
