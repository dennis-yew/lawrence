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
        <div className="text-3xl font-bold mb-2 dark:text-white">INTJ</div>
        <div className="text-gray-600 dark:text-gray-300 mb-6">Mediator</div>
        
        <div className="illustration">
          <img 
            src="https://www.16personalities.com/static/images/personality-types/avatars/intj-architect.svg" 
            alt="INTJ Personality"
            className="w-32 h-32 mx-auto rounded-full bg-purple-100 dark:bg-purple-900"
          />
        </div>
      </div>
    </Card>
  );
}
