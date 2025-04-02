import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

const client = postgres(process.env.DATABASE_URL);

async function seed() {
  try {
    // 删除所有表
    await client`DROP TABLE IF EXISTS activities CASCADE`;
    await client`DROP TABLE IF EXISTS interests CASCADE`;
    await client`DROP TABLE IF EXISTS tech_stacks CASCADE`;
    await client`DROP TABLE IF EXISTS projects CASCADE`;
    await client`DROP TABLE IF EXISTS posts CASCADE`;
    await client`DROP TABLE IF EXISTS profiles CASCADE`;
    await client`DROP TABLE IF EXISTS users CASCADE`;

    // 创建表
    await client`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      )
    `;

    await client`
      CREATE TABLE posts (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        image_url TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        user_id INTEGER NOT NULL REFERENCES users(id)
      )
    `;

    await client`
      CREATE TABLE projects (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        icon TEXT NOT NULL,
        icon_background TEXT NOT NULL,
        user_id INTEGER NOT NULL REFERENCES users(id)
      )
    `;

    await client`
      CREATE TABLE tech_stacks (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        icon TEXT NOT NULL,
        background TEXT NOT NULL,
        user_id INTEGER NOT NULL REFERENCES users(id)
      )
    `;

    await client`
      CREATE TABLE interests (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        icon TEXT NOT NULL,
        user_id INTEGER NOT NULL REFERENCES users(id)
      )
    `;

    await client`
      CREATE TABLE activities (
        id SERIAL PRIMARY KEY,
        date TIMESTAMP NOT NULL DEFAULT NOW(),
        count INTEGER NOT NULL,
        user_id INTEGER NOT NULL REFERENCES users(id)
      )
    `;

    await client`
      CREATE TABLE profiles (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        alias TEXT,
        avatar TEXT,
        github TEXT,
        website TEXT,
        personality_type TEXT,
        personality_title TEXT,
        user_id INTEGER NOT NULL REFERENCES users(id)
      )
    `;

    // 插入用户数据
    await client`
      INSERT INTO users (username, password)
      VALUES ('lawrence', '$2b$10$6jM7.1RckGn7.YX5QA6z8O8K2dJ9RQWqxBVGz1U.WTQwGZbX1RjTi')
      RETURNING id
    `.then(async ([user]) => {
      const userId = user.id;

      // 插入个人资料
      await client`
        INSERT INTO profiles (name, alias, avatar, github, website, personality_type, personality_title, user_id)
        VALUES (
          'Lawrence',
          'Full Stack Developer',
          'https://avatars.githubusercontent.com/u/1234567',
          'https://github.com/lawrence',
          'https://lawrence.dev',
          'INTJ',
          'The Architect',
          ${userId}
        )
      `;

      // 插入博客文章
      await client`
        INSERT INTO posts (title, content, image_url, user_id)
        VALUES 
        ('构建个人博客的心路历程', '在这篇文章中，我将分享我是如何使用现代Web技术栈构建这个个人博客的。从技术选型到具体实现，从前端到后端，我都会详细介绍...', 'https://picsum.photos/800/400', ${userId}),
        ('TypeScript 开发实践总结', '作为一个TypeScript爱好者，我想分享一些在实际项目中使用TypeScript的经验和最佳实践。包括类型定义、接口设计、泛型使用等方面...', 'https://picsum.photos/800/400', ${userId}),
        ('全栈开发者的日常工作流', '作为一名全栈开发者，如何平衡前后端开发工作？如何提高开发效率？本文将分享我的一些心得体会...', 'https://picsum.photos/800/400', ${userId})
      `;

      // 插入项目经历
      await client`
        INSERT INTO projects (name, description, icon, icon_background, user_id)
        VALUES 
        ('个人博客系统', '使用React、TypeScript和Node.js构建的现代化个人博客系统', '🚀', '#4F46E5', ${userId}),
        ('在线协作平台', '基于WebSocket的实时协作平台，支持多人同时编辑', '👥', '#059669', ${userId}),
        ('AI助手应用', '集成OpenAI API的智能助手应用，提供智能对话和内容生成功能', '🤖', '#7C3AED', ${userId})
      `;

      // 插入技术栈
      await client`
        INSERT INTO tech_stacks (name, icon, background, user_id)
        VALUES 
        ('TypeScript', '⚡', '#3178C6', ${userId}),
        ('React', '⚛️', '#61DAFB', ${userId}),
        ('Node.js', '🟢', '#339933', ${userId}),
        ('PostgreSQL', '🐘', '#336791', ${userId}),
        ('Docker', '🐳', '#2496ED', ${userId})
      `;

      // 插入兴趣爱好
      await client`
        INSERT INTO interests (name, description, icon, user_id)
        VALUES 
        ('编程', '热爱探索新技术，享受编程带来的成就感', '💻', ${userId}),
        ('阅读', '喜欢阅读技术书籍和科幻小说', '📚', ${userId}),
        ('写作', '通过博客分享技术经验和思考', '✍️', ${userId}),
        ('音乐', '听音乐能让我在编程时保持专注', '🎵', ${userId})
      `;

      // 插入活动数据
      await client`
        INSERT INTO activities (date, count, user_id)
        VALUES 
        (CURRENT_DATE - INTERVAL '6 days', 5, ${userId}),
        (CURRENT_DATE - INTERVAL '5 days', 3, ${userId}),
        (CURRENT_DATE - INTERVAL '4 days', 7, ${userId}),
        (CURRENT_DATE - INTERVAL '3 days', 4, ${userId}),
        (CURRENT_DATE - INTERVAL '2 days', 6, ${userId}),
        (CURRENT_DATE - INTERVAL '1 day', 8, ${userId}),
        (CURRENT_DATE, 5, ${userId})
      `;
    });

    console.log('Successfully seeded database');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await client.end();
  }
}

seed();