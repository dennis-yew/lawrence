import { FaGithub, FaGlobe } from "react-icons/fa";
import { type Profile } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { useTranslation } from "@/lib/LanguageContext";

interface ProfileCardProps {
  profile?: Profile;
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  const { t } = useTranslation();
  
  if (!profile) return null;

  return (
    <Card className="card bg-[#a8e6cf] dark:bg-[#2d2d2d] bg-opacity-20 rounded-2xl p-4 shadow-md col-span-1 flex flex-col items-center text-center transition-all hover:translate-y-[-3px] hover:shadow-lg dark:shadow-[#1d1d1d]">
      <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3 self-start">{t('profile.title')}</h3>
      
      <div className="avatar mb-3 w-28 h-28 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
        <div className="avatar mb-3 w-28 h-28 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
          <img src="/61926916.jpeg" alt="头像" className="w-full h-full object-cover"/>
        </div>
      </div>
      <h1 className="text-xl font-bold mb-1 dark:text-white">{profile.name}</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-3">{profile.alias}</p>
      
      <div className="w-full h-px bg-gray-200 dark:bg-gray-700 my-2"></div>
      
      <div className="social-links w-full grid grid-cols-2 gap-2">
        <a href="https://github.com/dennis-yew" target="_blank" rel="noopener noreferrer" 
           className="flex items-center justify-center py-1.5 hover:bg-white hover:bg-opacity-50 dark:hover:bg-gray-700 dark:hover:bg-opacity-70 rounded-lg transition-colors">
          <FaGithub className="mr-1.5 dark:text-gray-300" />
          <span className="dark:text-gray-300 text-sm">GitHub</span>
        </a>
        <a href={`https://${profile.website}`} target="_blank" rel="noopener noreferrer"
           className="flex items-center justify-center py-1.5 hover:bg-white hover:bg-opacity-50 dark:hover:bg-gray-700 dark:hover:bg-opacity-70 rounded-lg transition-colors">
          <FaGlobe className="mr-1.5 dark:text-gray-300" />
          <span className="dark:text-gray-300 text-sm">{profile.website}</span>
        </a>
      </div>
    </Card>
  );
}
