import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import dotenv from 'dotenv';
import * as schema from '../shared/schema';
import path from 'path';
import fs from 'fs';

// 加载环境变量
dotenv.config();

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('错误: DATABASE_URL 环境变量未设置');
    process.exit(1);
  }

  console.log('🔌 连接到 Neon 数据库...');
  console.log(`🌐 使用区域: ${process.env.DATABASE_URL.includes('ap-southeast-1') ? '亚太东南1区域' : '未知区域'}`);

  try {
    // 创建 postgres 客户端，用于迁移
    const migrationClient = postgres(process.env.DATABASE_URL, { max: 1 });
    
    // 创建 drizzle 实例
    const db = drizzle(migrationClient);
    
    console.log('📦 正在检查数据库表...');
    
    // 检查是否需要初始化数据库
    try {
      const tablesQuery = await migrationClient`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `;
      
      const existingTables = tablesQuery.map((row: any) => row.table_name);
      console.log('📋 现有表:', existingTables.join(', ') || '无');
      
      if (existingTables.length === 0) {
        console.log('🏗️ 数据库为空，开始创建表...');
      }
    } catch (e) {
      console.error('❌ 检查数据库表时出错:', e);
    }
    
    // 检查表是否正确创建
    console.log('🔍 验证数据库结构...');
    const tables = Object.entries(schema)
      .filter(([_, value]) => typeof value === 'object' && value !== null && 'name' in value)
      .map(([_, table]: [string, any]) => table.name);
    
    for (const tableName of tables) {
      try {
        const result = await migrationClient`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = ${tableName}
          ) as exists
        `;
        
        if (result[0]?.exists) {
          console.log(`✅ 表 "${tableName}" 已存在`);
        } else {
          console.log(`❌ 表 "${tableName}" 不存在，将尝试创建`);
          
          // 这里我们可以添加代码来创建缺失的表
          // 但目前只是提示用户使用 drizzle-kit 工具
          console.log(`   请使用 npm run db:push 创建表 "${tableName}"`);
        }
      } catch (e) {
        console.error(`❌ 检查表 "${tableName}" 时出错:`, e);
      }
    }
    
    console.log('🎉 数据库检查完成！');
    console.log('');
    console.log('如需创建或更新数据库结构，请运行:');
    console.log('npm run db:push');
    
    // 关闭连接
    await migrationClient.end();
  } catch (error) {
    console.error('❌ 数据库初始化失败:', error);
    process.exit(1);
  }
}

main().catch((e) => {
  console.error('未捕获的错误:', e);
  process.exit(1);
}); 