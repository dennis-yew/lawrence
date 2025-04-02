-- 添加url字段到projects表
ALTER TABLE projects ADD COLUMN IF NOT EXISTS url TEXT;

-- 更新已有项目的url字段
UPDATE projects SET url = 'https://github.com/yourusername/personal-blog' WHERE name = '个人博客系统';
UPDATE projects SET url = 'https://github.com/yourusername/collab-platform' WHERE name = '在线协作平台';
UPDATE projects SET url = 'https://github.com/yourusername/ai-assistant' WHERE name = 'AI助手应用'; 