import { FaGithub, FaGlobe } from "react-icons/fa";
import { type Profile } from "@shared/schema";
import { Card } from "@/components/ui/card";

interface ProfileCardProps {
  profile?: Profile;
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  if (!profile) return null;

  return (
    <Card className="card bg-[#a8e6cf] bg-opacity-20 rounded-2xl p-6 shadow-md col-span-1 flex flex-col items-center text-center transition-all hover:translate-y-[-5px] hover:shadow-lg">
      <div className="avatar mb-4 w-40 h-40 rounded-full overflow-hidden bg-gray-200">
        <div className="w-full h-full relative bg-gray-200 flex items-center justify-center">
          <svg className="h-24 w-24 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
      </div>
      <h1 className="text-2xl font-bold mb-1">{profile.name}</h1>
      <p className="text-gray-600 mb-6">{profile.alias}</p>
      
      <div className="w-full h-px bg-gray-200 my-4"></div>
      
      <div className="social-links w-full">
        <a href={`https://github.com/${profile.github}`} target="_blank" rel="noopener noreferrer" 
           className="flex items-center justify-center py-2 hover:bg-white hover:bg-opacity-50 rounded-lg mb-2 transition-colors">
          <FaGithub className="mr-2" />
          <span>GitHub</span>
        </a>
        <a href={`https://${profile.website}`} target="_blank" rel="noopener noreferrer"
           className="flex items-center justify-center py-2 hover:bg-white hover:bg-opacity-50 rounded-lg transition-colors">
          <FaGlobe className="mr-2" />
          <span>{profile.website}</span>
        </a>
      </div>
    </Card>
  );
}
