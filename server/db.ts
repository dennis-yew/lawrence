import { Pool } from 'pg';
import { drizzle } from "drizzle-orm/node-postgres";
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables from .env file
dotenv.config();

let pool: Pool;

try {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('数据库连接字符串未设置');
  }
  
  pool = new Pool({
    connectionString,
  });
  
  console.log('数据库连接初始化中...');
} catch (error) {
  console.error('初始化数据库连接池时出错:', error);
  throw error;
}

export const db = drizzle(pool);

export async function testConnection() {
  try {
    console.log('正在测试数据库连接...');
    const client = await pool.connect();
    const res = await client.query('SELECT version()');
    console.log(`数据库连接成功！${res.rows[0].version}`);
    client.release();
    return true;
  } catch (error) {
    console.error('数据库连接测试失败:', error);
    return false;
  }
}

export async function runMigration(migrationFilePath: string) {
  try {
    const fullPath = path.join(process.cwd(), migrationFilePath);
    
    if (!fs.existsSync(fullPath)) {
      console.warn(`迁移文件不存在: ${fullPath}`);
      return false;
    }
    
    const sql = fs.readFileSync(fullPath, 'utf8');
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      await client.query(sql);
      await client.query('COMMIT');
      console.log(`✅ 成功执行迁移: ${migrationFilePath}`);
      return true;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error(`❌ 迁移执行失败: ${migrationFilePath}`, error);
      return false;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error(`❌ 无法执行迁移: ${migrationFilePath}`, error);
    return false;
  }
}
