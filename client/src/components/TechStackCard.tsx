import { FaJs, FaReact, FaNodeJs, FaDatabase, FaCode } from "react-icons/fa";
import { type TechStack } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Laptop } from "lucide-react";
import { useTranslation } from "@/lib/LanguageContext";

interface TechStackCardProps {
  techStacks: TechStack[];
}

export default function TechStackCard({ techStacks }: TechStackCardProps) {
  const { t } = useTranslation();
  
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'fa-js':
        return <FaJs className="text-yellow-500" />;
      case 'fa-react':
        return <FaReact className="text-blue-400" />;
      case 'fa-node-js':
        return <FaNodeJs className="text-green-600" />;
      case 'fa-database':
        return <FaDatabase className="text-gray-300 dark:text-gray-400" />;
      case 'fa-code':
        return <FaCode className="text-gray-700 dark:text-gray-300" />;
      default:
        return <span className="text-white font-bold text-sm">{iconName}</span>;
    }
  };

  return (
    <Card className="card bg-white dark:bg-[#2d2d2d] rounded-2xl p-4 shadow-md col-span-1 transition-all hover:translate-y-[-3px] hover:shadow-lg dark:shadow-[#1d1d1d]">
      <div className="flex items-center mb-3">
        <Laptop className="text-lg mr-2 dark:text-gray-300" />
        <h2 className="text-lg font-bold dark:text-white">{t('techStack.title')}</h2>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        {techStacks.map((tech) => (
          <div key={tech.id} className="tech-item flex flex-col items-center">
            <div className={`icon-wrapper w-10 h-10 rounded-full ${tech.background} flex items-center justify-center mb-1.5`}>
              {getIcon(tech.icon)}
            </div>
            <span className="text-xs dark:text-gray-300">{tech.name}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
