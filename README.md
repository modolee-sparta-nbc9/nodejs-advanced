# 환경변수

.env 파일 생성 후 아래 내용 추가

## 설명

- SERVER_PORT: 서버 포트 번호
- PASSWORD_HASH_SALT_ROUNDS: bcrypt salt 보안 강도 (숫자가 높으면 보안은 강화되지만 시간이 오래 걸림)
- JWT_ACCESS_TOKEN_SECRET: JWT AccessToken 비밀번호
- DATABASE_URL: 데이터베이스 URL

## 예시

```bash
SERVER_PORT=3000
PASSWORD_HASH_SALT_ROUNDS=10
JWT_ACCESS_TOKEN_SECRET="jwt-serect-key"
DATABASE_URL="mysql://user:password@host:3306/mydb"
```

# 실행 방법

```bash
npm install
npm run dev
```
