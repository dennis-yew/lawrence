import { neon } from '@neondatabase/serverless';
import { drizzle } from "drizzle-orm/neon-http";
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const sql = neon(process.env.DATABASE_URL || '');
export const db = drizzle(sql);

export async function testConnection() {
  try {
    console.log('正在测试数据库连接...');
    const result = await sql`SELECT version()`;
    console.log(`数据库连接成功！${result[0].version}`);
    return true;
  } catch (error) {
    console.error('数据库连接测试失败:', error);
    return false;
  }
}

// 由于我们使用drizzle-kit处理迁移，这里不需要runMigration函数
