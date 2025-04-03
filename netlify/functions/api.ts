import { Handler } from '@netlify/functions';

// 处理函数
const handler: Handler = async (event, context) => {
  const path = event.path.replace('/.netlify/functions/api', '');
  
  try {
    // 根据路径处理不同的API请求
    if (path === '/profile') {
      // 模拟返回个人资料数据
      return {
        statusCode: 200,
        body: JSON.stringify({
          id: 1,
          name: '丹尼斯',
          title: '前端开发工程师',
          description: '热爱编程和新技术，专注于Web开发和用户体验',
          avatarUrl: '/assets/avatar.jpg',
          location: '上海',
          email: 'example@example.com',
          github: 'https://github.com/dennis-yew',
          linkedin: 'https://linkedin.com/in/dennis-yew'
        })
      };
    } 
    else if (path === '/tech-stacks') {
      // 模拟返回技术栈数据
      return {
        statusCode: 200,
        body: JSON.stringify([
          { id: 1, name: 'React', icon: 'react', level: 90 },
          { id: 2, name: 'TypeScript', icon: 'typescript', level: 85 },
          { id: 3, name: 'Node.js', icon: 'nodejs', level: 80 },
          { id: 4, name: 'Next.js', icon: 'nextjs', level: 75 }
        ])
      };
    }
    else if (path === '/interests') {
      // 模拟返回兴趣爱好数据
      return {
        statusCode: 200,
        body: JSON.stringify([
          { id: 1, name: '编程', icon: 'code' },
          { id: 2, name: '阅读', icon: 'book' },
          { id: 3, name: '摄影', icon: 'camera' }
        ])
      };
    }
    else if (path === '/projects') {
      // 模拟返回项目数据
      return {
        statusCode: 200,
        body: JSON.stringify([
          { id: 1, name: '个人博客', description: '使用React和Node.js构建的个人博客系统', url: 'https://github.com/dennis-yew/blog' },
          { id: 2, name: '任务管理工具', description: '一个简单的任务管理Web应用', url: 'https://github.com/dennis-yew/task-manager' }
        ])
      };
    }
    else if (path === '/activities') {
      // 模拟返回活动数据
      return {
        statusCode: 200,
        body: JSON.stringify([
          { id: 1, date: '2023-12-01', count: 5 },
          { id: 2, date: '2023-12-02', count: 3 },
          { id: 3, date: '2023-12-03', count: 7 }
        ])
      };
    }
    else if (path === '/posts') {
      // 模拟返回博客文章数据
      return {
        statusCode: 200,
        body: JSON.stringify([
          { id: 1, title: 'React 18新特性解析', summary: '深入分析React 18带来的新功能和改进', date: '2023-10-15' },
          { id: 2, title: 'TypeScript高级类型技巧', summary: '探索TypeScript中的高级类型用法', date: '2023-09-20' }
        ])
      };
    }
    else {
      // 处理未找到的API路径
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'API路径不存在' })
      };
    }
  } catch (error) {
    // 处理错误
    console.error('API错误:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: '服务器内部错误' })
    };
  }
};

export { handler }; 