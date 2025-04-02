import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

async function migrateProjectUrl() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  
  try {
    console.log('正在连接数据库...');
    const client = await pool.connect();
    
    try {
      console.log('开始执行迁移...');
      
      // 添加URL字段
      await client.query(`
        ALTER TABLE projects 
        ADD COLUMN IF NOT EXISTS url TEXT;
      `);
      console.log('✅ 成功添加URL字段');
      
      // 更新现有项目
      await client.query(`
        UPDATE projects 
        SET url = 'https://github.com/yourusername/personal-blog' 
        WHERE name = '个人博客系统' AND url IS NULL;
      `);
      
      await client.query(`
        UPDATE projects 
        SET url = 'https://github.com/yourusername/collab-platform' 
        WHERE name = '在线协作平台' AND url IS NULL;
      `);
      
      await client.query(`
        UPDATE projects 
        SET url = 'https://github.com/yourusername/ai-assistant' 
        WHERE name = 'AI助手应用' AND url IS NULL;
      `);
      
      console.log('✅ 成功更新项目数据');
      console.log('迁移完成！');
    } catch (err) {
      console.error('❌ 迁移失败:', err);
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('❌ 无法连接到数据库:', err);
  } finally {
    await pool.end();
  }
}

migrateProjectUrl().catch(err => {
  console.error('未处理的错误:', err);
  process.exit(1);
}); 