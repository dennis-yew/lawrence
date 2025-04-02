import { 
  FaSkullCrossbones, 
  FaCode, 
  FaRobot, 
  FaRocket,
  FaGithub,
  FaExternalLinkAlt
} from "react-icons/fa";
import { type Project } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { useTranslation } from "@/lib/LanguageContext";

interface ProjectsCardProps {
  projects: Project[];
}

export default function ProjectsCard({ projects }: ProjectsCardProps) {
  const { t } = useTranslation();
  
  const getIcon = (iconName: string) => {
    // 检查是否为emoji或表情符号
    if (iconName.length <= 2 || /^[^\w\s]/.test(iconName)) {
      return <span className="text-2xl inline-flex justify-center items-center w-6">{iconName}</span>;
    }
    
    // FontAwesome 图标
    switch (iconName) {
      case 'fa-skull-crossbones':
        return <FaSkullCrossbones className="text-white" />;
      case 'fa-code':
        return <FaCode className="text-white" />;
      case 'fa-robot':
        return <FaRobot className="text-white" />;
      default:
        // 如果不是已知的FontAwesome图标，作为文本显示
        return <span className="text-lg inline-flex justify-center items-center w-6">{iconName}</span>;
    }
  };

  const getGradientBg = (hexColor: string) => {
    // 如果是hexColor格式，转换为渐变色
    if (hexColor.startsWith('#')) {
      // 使用提供的颜色作为结束色，生成一个渐变
      return `bg-gradient-to-br from-blue-500 to-[${hexColor}]`;
    }
    
    // 如果是预定义的类名
    switch (hexColor) {
      case 'bg-gray-700':
        return 'bg-gradient-to-br from-gray-500 to-gray-700';
      case 'bg-mint':
        return 'bg-gradient-to-br from-green-400 to-emerald-600';
      case 'bg-purple-light':
        return 'bg-gradient-to-br from-purple-400 to-indigo-600';
      default:
        return 'bg-gradient-to-br from-blue-500 to-indigo-600';
    }
  };

  return (
    <Card className="card bg-[#f0f0f5] dark:bg-[#2d2d2d] bg-opacity-30 rounded-2xl p-6 shadow-md col-span-1 md:col-span-2 transition-all hover:translate-y-[-5px] hover:shadow-lg dark:shadow-[#1d1d1d]">
      <div className="flex items-center mb-4">
        <FaRocket className="text-[#4f46e5] dark:text-blue-400 text-xl mr-2" />
        <h2 className="text-xl font-bold dark:text-white">{t('projects.title')}</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project) => (
          <div 
            key={project.id} 
            className={`project-item p-4 rounded-xl border-0 bg-white dark:bg-gray-800 shadow-sm transition-all ${
              project.url ? 'hover:shadow-md hover:translate-y-[-2px] cursor-pointer group' : ''
            }`}
            onClick={project.url ? () => window.open(project.url || '', '_blank', 'noopener,noreferrer') : undefined}
          >
            <div className="flex items-start">
              <div className={`project-icon w-12 h-12 rounded-xl ${getGradientBg(project.iconBackground)} flex items-center justify-center mr-4 text-white shadow-sm flex-shrink-0 ${project.url ? 'group-hover:shadow-md' : ''}`}>
                {getIcon(project.icon)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  {project.url ? (
                    <a 
                      href={project.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-medium text-lg dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {project.name}
                    </a>
                  ) : (
                    <h3 className="font-medium text-lg dark:text-white">{project.name}</h3>
                  )}
                  {project.url && (
                    <a 
                      href={project.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors p-1 rounded-full hover:bg-blue-50 dark:hover:bg-gray-700"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {project.url.includes('github') ? (
                        <FaGithub className="text-xl" />
                      ) : (
                        <FaExternalLinkAlt className="text-lg" />
                      )}
                    </a>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{project.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
