import { defineConfig } from 'drizzle-kit';
import dotenv from 'dotenv';

// 加载 .env 文件
dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL 环境变量未设置');
}

export default defineConfig({
  schema: './shared/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  // 如果你使用的是 Neon 数据库的分支功能，可以添加以下配置
  verbose: true,
  strict: true,
});
