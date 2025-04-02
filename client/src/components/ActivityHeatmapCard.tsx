import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { CalendarIcon, GithubIcon } from "lucide-react";
import { type Activity } from "@shared/schema";
import { useTranslation } from "@/lib/LanguageContext";
import { useTheme } from "@/lib/ThemeContext";
import { Button } from "@/components/ui/button";

interface ActivityHeatmapCardProps {
  activities: Activity[];
}

// 热力图数据格式
interface HeatmapCell {
  date: string;
  formattedDate: string;
  count: number;
  color: string;
}

// GitHub贡献数据类型
interface GitHubContributions {
  activities: Activity[];
  total: number;
  username: string;
}

// 一天的毫秒数
const DAY_IN_MS = 1000 * 60 * 60 * 24;

export default function ActivityHeatmapCard({ activities: propActivities }: ActivityHeatmapCardProps) {
  const { t, language } = useTranslation();
  const { theme } = useTheme();
  const [heatmapData, setHeatmapData] = useState<HeatmapCell[][]>([]);
  const [totalContributions, setTotalContributions] = useState<number>(0);
  const [months, setMonths] = useState<string[]>([]);
  const [dataSource, setDataSource] = useState<'local' | 'github'>('local');
  const [activities, setActivities] = useState<Activity[]>(propActivities);
  const [githubUsername, setGithubUsername] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 从GitHub获取数据
  const fetchGitHubData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/github-contributions');
      if (!response.ok) {
        throw new Error('获取GitHub数据失败');
      }
      const data: GitHubContributions = await response.json();
      setActivities(data.activities);
      setGithubUsername(data.username);
      setDataSource('github');
    } catch (error) {
      console.error('获取GitHub贡献数据失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 切换回本地数据
  const useLocalData = () => {
    setActivities(propActivities);
    setDataSource('local');
  };

  // 按照星期和日期组织热力图数据
  useEffect(() => {
    if (activities.length > 0) {
      // 定义颜色方案
      const getColor = (count: number): string => {
        if (count === 0) return theme === 'dark' ? '#2d3748' : '#ebedf0';
        if (count < 3) return theme === 'dark' ? '#6b46c1' : '#9be9a8';
        if (count < 6) return theme === 'dark' ? '#805ad5' : '#40c463';
        if (count < 9) return theme === 'dark' ? '#9f7aea' : '#30a14e';
        return theme === 'dark' ? '#b794f4' : '#216e39';
      };

      // 获取最近6个月的日期范围
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(endDate.getMonth() - 6);
      startDate.setDate(1); // 从月初开始
      
      // 创建日期到活动数量的映射
      const dateMap = new Map<string, number>();
      activities.forEach(activity => {
        const dateStr = activity.date instanceof Date 
          ? activity.date.toISOString().split('T')[0] 
          : new Date(activity.date).toISOString().split('T')[0];
        
        dateMap.set(dateStr, activity.count);
      });
      
      // 计算总贡献数
      const total = Array.from(dateMap.values()).reduce((sum, count) => sum + count, 0);
      setTotalContributions(total);
      
      // 定义月份名称（根据当前语言）
      const monthNames = {
        en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        zh: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
      };
      
      // 获取当前语言的月份名称
      const currentMonthNames = language === 'en' ? monthNames.en : monthNames.zh;
      
      // 生成月份标签
      const monthLabels: string[] = [];
      
      // 创建日期数组
      const dates: Date[] = [];
      for (let d = new Date(startDate); d <= endDate; d = new Date(d.getTime() + DAY_IN_MS)) {
        dates.push(new Date(d));
        
        // 检查是否需要添加月份标签
        if (d.getDate() === 1 || d.getTime() === startDate.getTime()) {
          monthLabels.push(currentMonthNames[d.getMonth()]);
        }
      }
      
      // 按星期行组织数据 - 创建数组，每个数组代表一天：0=周日，1=周一，...，6=周六
      const heatmapGrid: HeatmapCell[][] = Array(7).fill(0).map(() => []);
      
      // 填充热力图数据
      // 首先计算需要的总列数（周数）
      const totalWeeks = Math.ceil(dates.length / 7);
      
      // 创建二维网格 - 先添加空白单元格
      for (let day = 0; day < 7; day++) {
        heatmapGrid[day] = Array(totalWeeks).fill(null).map(() => ({
          date: '',
          formattedDate: '',
          count: 0,
          color: getColor(0)
        }));
      }
      
      // 然后填充有数据的单元格
      dates.forEach((date, index) => {
        const dayOfWeek = date.getDay(); // 0=周日, 1=周一, ..., 6=周六
        const weekIndex = Math.floor(index / 7);
        const dateStr = date.toISOString().split('T')[0];
        const count = dateMap.get(dateStr) || 0;
        
        // 格式化显示日期（根据语言）
        const formattedDate = formatDate(date, language);
        
        if (weekIndex < totalWeeks && dayOfWeek < 7) {
          heatmapGrid[dayOfWeek][weekIndex] = {
            date: dateStr,
            formattedDate,
            count,
            color: getColor(count)
          };
        }
      });
      
      setMonths(monthLabels);
      setHeatmapData(heatmapGrid);
    }
  }, [activities, theme, language]);

  // 格式化日期函数
  const formatDate = (date: Date, lang: string): string => {
    if (lang === 'en') {
      return new Intl.DateTimeFormat('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }).format(date);
    } else {
      return new Intl.DateTimeFormat('zh-CN', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }).format(date);
    }
  };

  // 星期标签 - 从翻译中获取
  const weekdays = t('activity.days').split(',');

  return (
    <Card className="card bg-white dark:bg-[#2d2d2d] rounded-2xl p-6 shadow-md col-span-1 md:col-span-2 lg:col-span-2 transition-all hover:translate-y-[-5px] hover:shadow-lg dark:shadow-[#1d1d1d]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <CalendarIcon className="text-xl mr-2 dark:text-gray-300" />
          <h2 className="text-xl font-bold dark:text-white">{t('activity.title')}</h2>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {totalContributions} {t('activity.contributions')} {t('activity.subtitle')}
        </div>
      </div>
      
      {/* 数据源切换按钮 */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          variant={dataSource === 'local' ? "default" : "outline"}
          size="sm"
          onClick={useLocalData}
          disabled={isLoading}
        >
          {t('activity.localData')}
        </Button>
        <Button
          variant={dataSource === 'github' ? "default" : "outline"}
          size="sm"
          onClick={fetchGitHubData}
          disabled={isLoading}
          className="flex items-center gap-1"
        >
          <GithubIcon className="w-4 h-4" /> 
          {isLoading ? t('activity.loading') : t('activity.githubData')}
        </Button>
      </div>
      
      {/* GitHub用户名显示 */}
      {dataSource === 'github' && githubUsername && (
        <div className="flex items-center mb-3">
          <GithubIcon className="w-4 h-4 mr-1 text-gray-500 dark:text-gray-400" />
          <a 
            href={`https://github.com/${githubUsername}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-blue-500 hover:underline"
          >
            @{githubUsername}
          </a>
        </div>
      )}
      
      <div className="heatmap-wrapper overflow-x-auto pb-2">
        <div className="heatmap relative min-w-max">
          {/* 月份标签 */}
          <div className="relative h-6 mb-2 ml-14 mr-4">
            {months.map((month, i) => {
              // 计算月份标签的位置，根据月份在数据中的位置比例来定位
              const position = (i / months.length) * 100;
              return (
                <div 
                  key={i} 
                  className="text-xs text-gray-500 dark:text-gray-400 absolute"
                  style={{ 
                    left: `${position}%`,
                    transform: 'translateX(-50%)'
                  }}
                >
                  {month}
                </div>
              );
            })}
          </div>
          
          {/* 热力图表格 */}
          <div className="flex flex-col">
            {heatmapData.map((week, weekIndex) => (
              <div key={weekIndex} className="flex items-center h-5">
                <div 
                  className="text-xs text-right text-gray-500 dark:text-gray-400 pr-2 w-14 flex items-center justify-end"
                >
                  {weekIndex % 2 === 1 ? weekdays[weekIndex] : ''}
                </div>
                
                <div className="flex flex-1">
                  {week.map((day, dayIndex) => (
                    <div 
                      key={dayIndex} 
                      className="activity-cell"
                      style={{
                        width: '11px',
                        height: '11px',
                        margin: '2px',
                        borderRadius: '2px',
                        backgroundColor: day.color
                      }}
                      title={`${day.formattedDate}: ${day.count} ${t('activity.contributions')}`}
                    ></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* 图例 */}
        <div className="legend flex items-center justify-end mt-4">
          <div className="text-xs text-gray-500 dark:text-gray-400 mr-2">{t('activity.less')}</div>
          <div className="activity-cell" style={{width: '11px', height: '11px', margin: '2px', borderRadius: '2px', backgroundColor: theme === 'dark' ? '#2d3748' : '#ebedf0'}}></div>
          <div className="activity-cell" style={{width: '11px', height: '11px', margin: '2px', borderRadius: '2px', backgroundColor: theme === 'dark' ? '#6b46c1' : '#9be9a8'}}></div>
          <div className="activity-cell" style={{width: '11px', height: '11px', margin: '2px', borderRadius: '2px', backgroundColor: theme === 'dark' ? '#805ad5' : '#40c463'}}></div>
          <div className="activity-cell" style={{width: '11px', height: '11px', margin: '2px', borderRadius: '2px', backgroundColor: theme === 'dark' ? '#9f7aea' : '#30a14e'}}></div>
          <div className="activity-cell" style={{width: '11px', height: '11px', margin: '2px', borderRadius: '2px', backgroundColor: theme === 'dark' ? '#b794f4' : '#216e39'}}></div>
          <div className="text-xs text-gray-500 dark:text-gray-400 ml-2">{t('activity.more')}</div>
        </div>
      </div>
    </Card>
  );
}
