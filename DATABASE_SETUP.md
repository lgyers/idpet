# 数据库配置指南

## 问题
注册失败的原因是缺少 `DATABASE_URL` 环境变量。

## 必需的环境变量

创建 `.env.local` 文件，至少需要配置：

```bash
# 数据库连接（必需）
DATABASE_URL=postgresql://user:password@localhost:5432/petphoto

# NextAuth 密钥（必需）
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your-random-secret-key-here

# Stripe（用于支付，可选但build时需要）
STRIPE_SECRET_KEY=sk_test_dummy
```

## 数据库选项

### 选项 1: 使用 Docker PostgreSQL（推荐）
```bash
docker run --name petphoto-db -e POSTGRES_PASSWORD=password -e POSTGRES_DB=petphoto -p 5432:5432 -d postgres
```

然后使用：
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/petphoto
```

### 选项 2: 使用 SQLite（简单但需要修改配置）
需要修改 `prisma/schema.prisma` 中的 provider 为 sqlite

### 选项 3: 使用现有的 PostgreSQL 数据库
提供您的数据库连接字符串

## 下一步
配置好 `.env.local` 后，需要运行：
```bash
npx prisma migrate dev
npm run dev
```
