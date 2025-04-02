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
    <Card className="card bg-[#bde0fe] dark:bg-[#2d2d2d] bg-opacity-20 rounded-2xl p-5 shadow-sm col-span-1 transition-all hover:translate-y-[-3px] hover:shadow-md dark:shadow-[#1d1d1d]">
      <div className="flex items-center mb-3">
        <User className="text-lg mr-2 dark:text-gray-300" />
        <h2 className="text-lg font-semibold dark:text-white">{t('personality.title')}</h2>
      </div>
      
      <div className="personality-content text-center py-2">
        <div className="text-2xl font-bold mb-1 dark:text-white">INTJ</div>
        <div className="text-gray-600 dark:text-gray-300 text-sm mb-4">Mediator</div>
        
        <div className="illustration">
          <img 
            src="/INTJ_gandalf.svg" 
            alt="INTJ Personality"
            className="w-28 h-28 mx-auto"
          />
        </div>
      </div>
    </Card>
  );
}
