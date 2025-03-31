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
    <Card className="card bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md col-span-1 transition-all hover:translate-y-[-5px] hover:shadow-lg">
      <div className="flex items-center mb-4">
        <Laptop className="text-xl mr-2 dark:text-gray-300" />
        <h2 className="text-xl font-bold dark:text-white">{t('techStack.title')}</h2>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        {techStacks.map((tech) => (
          <div key={tech.id} className="tech-item flex flex-col items-center">
            <div className={`icon-wrapper w-12 h-12 rounded-full ${tech.background} flex items-center justify-center mb-2`}>
              {getIcon(tech.icon)}
            </div>
            <span className="text-sm dark:text-gray-300">{tech.name}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
