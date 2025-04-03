import { Card } from "@/components/ui/card";
import { CalendarIcon, GithubIcon } from "lucide-react";
import { useTranslation } from "@/lib/LanguageContext";
import { useTheme } from "@/lib/ThemeContext";

export default function ActivityHeatmapCard() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const githubUsername = 'dennis-yew';

  return (
    <Card className="card bg-white dark:bg-[#2d2d2d] rounded-2xl p-6 shadow-md col-span-1 md:col-span-2 lg:col-span-2 transition-all hover:translate-y-[-5px] hover:shadow-lg dark:shadow-[#1d1d1d]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <CalendarIcon className="text-xl mr-2 dark:text-gray-300" />
          <h2 className="text-xl font-bold dark:text-white">{t('activity.title')}</h2>
        </div>
      </div>
      
      {/* GitHub用户名显示 */}
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
      
      {/* GitHub贡献图表 */}
      <div className="github-contributions-wrapper overflow-hidden rounded-xl bg-white dark:bg-[#1d1d1d] p-4">
        <img
          src={`https://ghchart.rshah.org/${githubUsername}`}
          alt="GitHub Contributions Graph"
          className="w-full h-auto rounded-lg"
          style={{
            filter: theme === 'dark' ? 'invert(0.8) hue-rotate(180deg) brightness(1.2) saturate(1.2)' : 'none',
            maxHeight: '140px',
            objectFit: 'cover',
            transform: 'scale(1.02)',  // 稍微放大一点以避免边缘空白
          }}
        />
      </div>
    </Card>
  );
}
