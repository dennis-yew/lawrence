import { FaMusic, FaBook, FaFilm, FaStar, FaCode, FaPen, FaLaptopCode } from "react-icons/fa";
import { type Interest } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { useTranslation } from "@/lib/LanguageContext";

interface InterestsCardProps {
  interests: Interest[];
}

export default function InterestsCard({ interests }: InterestsCardProps) {
  const { t } = useTranslation();
  
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'fa-music':
        return <FaMusic className="text-purple-500 dark:text-purple-400" />;
      case 'fa-book':
        return <FaBook className="text-purple-500 dark:text-purple-400" />;
      case 'fa-film':
        return <FaFilm className="text-purple-500 dark:text-purple-400" />;
      case 'fa-code':
        return <FaCode className="text-purple-500 dark:text-purple-400" />;
      case 'fa-pen':
        return <FaPen className="text-purple-500 dark:text-purple-400" />;
      case 'fa-laptop-code':
        return <FaLaptopCode className="text-purple-500 dark:text-purple-400" />;
      default:
        return null;
    }
  };

  return (
    <Card className="card bg-[#d1c1e0] dark:bg-[#2d2d2d] bg-opacity-30 rounded-2xl p-6 shadow-md col-span-1 transition-all hover:translate-y-[-5px] hover:shadow-lg dark:shadow-[#1d1d1d]">
      <div className="flex items-center mb-4">
        <FaStar className="text-[#9b59b6] dark:text-purple-400 text-xl mr-2" />
        <h2 className="text-xl font-bold dark:text-white">{t('interests.title')}</h2>
      </div>
      
      <div className="space-y-4">
        {interests.map((interest) => (
          <div key={interest.id} className="interest-item flex items-center">
            <div className="icon-wrapper w-10 h-10 rounded-lg bg-white dark:bg-gray-700 flex items-center justify-center mr-3">
              {getIcon(interest.icon)}
            </div>
            <div>
              <h3 className="font-medium dark:text-white">{interest.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{interest.description}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
