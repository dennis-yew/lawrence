-- 插入用户数据
INSERT INTO users (username, password)
VALUES ('lawrence', '$2b$10$6jM7.1RckGn7.YX5QA6z8O8K2dJ9RQWqxBVGz1U.WTQwGZbX1RjTi');

-- 获取用户ID
DO $$
DECLARE
    user_id integer;
BEGIN
    SELECT id INTO user_id FROM users WHERE username = 'lawrence';

    -- 插入博客文章
    INSERT INTO posts (title, content, image_url, user_id)
    VALUES 
    ('构建个人博客的心路历程', '在这篇文章中，我将分享我是如何使用现代Web技术栈构建这个个人博客的。从技术选型到具体实现，从前端到后端，我都会详细介绍...', 'https://picsum.photos/800/400', user_id),
    ('TypeScript 开发实践总结', '作为一个TypeScript爱好者，我想分享一些在实际项目中使用TypeScript的经验和最佳实践。包括类型定义、接口设计、泛型使用等方面...', 'https://picsum.photos/800/400', user_id),
    ('全栈开发者的日常工作流', '作为一名全栈开发者，如何平衡前后端开发工作？如何提高开发效率？本文将分享我的一些心得体会...', 'https://picsum.photos/800/400', user_id);

    -- 插入项目经历
    INSERT INTO projects (name, description, icon, icon_background, user_id)
    VALUES 
    ('个人博客系统', '使用React、TypeScript和Node.js构建的现代化个人博客系统', '🚀', '#4F46E5', user_id),
    ('在线协作平台', '基于WebSocket的实时协作平台，支持多人同时编辑', '👥', '#059669', user_id),
    ('AI助手应用', '集成OpenAI API的智能助手应用，提供智能对话和内容生成功能', '🤖', '#7C3AED', user_id);

    -- 插入技术栈
    INSERT INTO tech_stacks (name, icon, background, user_id)
    VALUES 
    ('TypeScript', '⚡', '#3178C6', user_id),
    ('React', '⚛️', '#61DAFB', user_id),
    ('Node.js', '🟢', '#339933', user_id),
    ('PostgreSQL', '🐘', '#336791', user_id),
    ('Docker', '🐳', '#2496ED', user_id);

    -- 插入兴趣爱好
    INSERT INTO interests (name, description, icon, user_id)
    VALUES 
    ('编程', '热爱探索新技术，享受编程带来的成就感', '💻', user_id),
    ('阅读', '喜欢阅读技术书籍和科幻小说', '📚', user_id),
    ('写作', '通过博客分享技术经验和思考', '✍️', user_id),
    ('音乐', '听音乐能让我在编程时保持专注', '🎵', user_id);

    -- 插入活动数据
    INSERT INTO activities (date, count, user_id)
    VALUES 
    (CURRENT_DATE - INTERVAL '6 days', 5, user_id),
    (CURRENT_DATE - INTERVAL '5 days', 3, user_id),
    (CURRENT_DATE - INTERVAL '4 days', 7, user_id),
    (CURRENT_DATE - INTERVAL '3 days', 4, user_id),
    (CURRENT_DATE - INTERVAL '2 days', 6, user_id),
    (CURRENT_DATE - INTERVAL '1 day', 8, user_id),
    (CURRENT_DATE, 5, user_id);

END $$;