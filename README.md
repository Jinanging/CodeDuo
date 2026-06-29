# CodeDuo

CodeDuo is a contest MVP coding learning service: real code practice like Baekjoon, approachable flow like Duolingo.

## Structure

- `backend`: Spring Boot 3, Java 17, Gradle, JPA, JWT, Swagger, Judge0 boundary, AI mock boundary
- `frontend`: Vite, React, TypeScript

## IntelliJ

Open this repository root as a Gradle project. The backend Gradle module is `backend`.

Use JDK 17 for Gradle/Spring Boot. On this Mac:

```bash
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-17.jdk/Contents/Home
```

## Backend

Swagger:

```text
http://localhost:8082/swagger-ui/index.html
```

Demo accounts:

```text
demo@codeduo.dev / password
premium@codeduo.dev / password
```

Local profile uses H2 by default. Docker compose uses MySQL.

Local IntelliJ run configuration uses port `8082` to avoid conflicts with other Spring Boot projects.

CLI run:

```bash
JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-17.jdk/Contents/Home ./gradlew :backend:bootRun --args='--server.port=8082'
```

If you use another backend port, update `frontend/vite.config.ts` proxy target too.

## Frontend

```bash
cd frontend
npm install
npm run dev
```
