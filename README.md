# CodeDuo

CodeDuo is a contest MVP coding learning service: real code practice like Baekjoon, approachable flow like Duolingo.

## Structure

- `backend`: Spring Boot 4, Java 17, Gradle, JPA, JWT, Swagger, Judge0 boundary, AI mock boundary
- `frontend`: Vite, React, TypeScript

## IntelliJ

Open this repository root as a Gradle project. The backend Gradle module is `backend`.

Use JDK 17 for Gradle/Spring Boot. On this Mac:

```bash
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-17.jdk/Contents/Home
```

## Backend

There are no shared demo accounts or committed passwords. Create an account through the signup screen.

JWT signing keys and grading answers are required runtime secrets. The grading file is
`config/grading-secrets.json`, which is ignored by Git. The committed
`config/grading-secrets.example.json` contains placeholders only and documents the required format.
Share the real file only through a private channel or secret manager.

CLI run:

```bash
export JWT_SECRET="$(openssl rand -base64 48)"
export GRADING_SECRETS_PATH="$PWD/config/grading-secrets.json"
export GRADING_REQUIRE_SECRETS=true
JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-17.jdk/Contents/Home ./gradlew :backend:bootRun
```

For an H2-only local run, add `SPRING_PROFILES_ACTIVE=h2`. The H2 console and Swagger are disabled
by default. Enable Swagger only for trusted local development with `SWAGGER_ENABLED=true`.

Docker Compose reads secrets from an ignored `.env` file:

```bash
cp .env.example .env
# Replace every placeholder in .env with a unique random value, then:
docker compose up --build
```

MySQL and the backend bind to `127.0.0.1` by default. Put an HTTPS reverse proxy in front of the
backend for external access and set `CORS_ALLOWED_ORIGINS` to the exact frontend origin.

If you use another backend port, update `frontend/vite.config.ts` proxy target too.

## AWS Judge0

Judge0 CE v1.13.1 runs on the private local port of the AWS EC2 instance. Keep
the SSH tunnel open in a separate terminal:

```bash
export CODEDUO_JUDGE0_HOST="YOUR_EC2_PUBLIC_IP"
export CODEDUO_JUDGE0_KEY="/absolute/path/to/your-private-key.pem"
./scripts/judge0-tunnel.sh
```

Then run the backend with the real Judge0 client instead of the mock:

```bash
export JWT_SECRET="$(openssl rand -base64 48)"
./scripts/run-backend-with-judge0.sh
```

Never put the EC2 address, key path, private key, JWT key, database password, or real grading file
in this repository. Verify and add the EC2 SSH host key before the first tunnel connection; the
script refuses unknown or changed host keys. Judge0 port `2358` does not need to be opened in the
EC2 security group.

## Frontend

```bash
cd frontend
npm install
npm run dev
```
