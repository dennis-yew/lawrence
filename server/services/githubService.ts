import axios from 'axios';
import { type Activity, type InsertActivity } from '../../shared/schema';

interface GitHubContributionDay {
  date: string;
  contributionCount: number;
}

interface GitHubContributionWeek {
  contributionDays: GitHubContributionDay[];
}

interface GitHubUserContributions {
  weeks: GitHubContributionWeek[];
  totalContributions: number;
}

export class GitHubService {
  private username: string;

  constructor(username: string) {
    this.username = username;
  }

  async getContributions(months: number = 6): Promise<{data: Activity[], total: number}> {
    try {
      // 构建GraphQL查询
      const today = new Date();
      const startDate = new Date();
      startDate.setMonth(today.getMonth() - months);
      
      const query = `
        query {
          user(login: "${this.username}") {
            contributionsCollection(from: "${startDate.toISOString()}", to: "${today.toISOString()}") {
              contributionCalendar {
                totalContributions
                weeks {
                  contributionDays {
                    date
                    contributionCount
                  }
                }
              }
            }
          }
        }
      `;

      // 发送请求到GitHub GraphQL API
      const response = await axios.post(
        'https://api.github.com/graphql',
        { query },
        {
          headers: {
            Authorization: `bearer ${process.env.GITHUB_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.errors) {
        console.error('GitHub API错误:', response.data.errors);
        throw new Error('获取GitHub贡献数据失败');
      }

      // 解析响应数据
      const contributionCalendar = response.data.data.user.contributionsCollection.contributionCalendar;
      const total = contributionCalendar.totalContributions;
      
      // 转换为应用程序中的Activity类型
      const activities: Activity[] = [];
      
      contributionCalendar.weeks.forEach((week: GitHubContributionWeek) => {
        week.contributionDays.forEach((day: GitHubContributionDay) => {
          if (day.contributionCount > 0) {
            activities.push({
              id: 0, // 数据库会分配ID
              date: new Date(day.date),
              count: day.contributionCount,
              userId: 1 // 默认用户ID，可以修改
            });
          }
        });
      });

      return { 
        data: activities,
        total: total
      };
    } catch (error) {
      console.error('获取GitHub贡献数据失败:', error);
      throw new Error('获取GitHub贡献数据失败');
    }
  }
} 