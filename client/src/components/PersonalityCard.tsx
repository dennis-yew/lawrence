import { Card } from "@/components/ui/card";
import { User } from "lucide-react";
import { type Profile } from "@shared/schema";
import { useTranslation } from "@/lib/LanguageContext";

interface PersonalityCardProps {
  profile?: Profile;
}

export default function PersonalityCard({ profile }: PersonalityCardProps) {
  const { t } = useTranslation();
  
  if (!profile) return null;

  return (
    <Card className="card bg-[#bde0fe] dark:bg-gray-800 bg-opacity-30 rounded-2xl p-6 shadow-md col-span-1 transition-all hover:translate-y-[-5px] hover:shadow-lg">
      <div className="flex items-center mb-4">
        <User className="text-xl mr-2 dark:text-gray-300" />
        <h2 className="text-xl font-bold dark:text-white">{t('personality.title')}</h2>
      </div>
      
      <div className="personality-content text-center py-4">
        <div className="text-3xl font-bold mb-2 dark:text-white">{profile.personalityType}</div>
        <div className="text-gray-600 dark:text-gray-300 mb-6">{profile.personalityTitle}</div>
        
        <div className="illustration">
          <svg className="w-32 h-32 mx-auto rounded-full text-blue-400 dark:text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
            <path d="M7 15s2 2 5 2 5-2 5-2" />
            <circle cx="9" cy="9" r="1" />
            <circle cx="15" cy="9" r="1" />
          </svg>
        </div>
      </div>
    </Card>
  );
}
