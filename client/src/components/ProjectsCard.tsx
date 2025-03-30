import { 
  FaSkullCrossbones, 
  FaCode, 
  FaRobot, 
  FaRocket 
} from "react-icons/fa";
import { type Project } from "@shared/schema";
import { Card } from "@/components/ui/card";

interface ProjectsCardProps {
  projects: Project[];
}

export default function ProjectsCard({ projects }: ProjectsCardProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'fa-skull-crossbones':
        return <FaSkullCrossbones className="text-gray-700" />;
      case 'fa-code':
        return <FaCode className="text-green-800" />;
      case 'fa-robot':
        return <FaRobot className="text-purple-500" />;
      default:
        return null;
    }
  };

  const getBgClass = (bgName: string) => {
    switch (bgName) {
      case 'bg-gray-700':
        return 'bg-gray-100';
      case 'bg-mint':
        return 'bg-[#a8e6cf]';
      case 'bg-purple-light':
        return 'bg-[#d1c1e0]';
      default:
        return 'bg-gray-100';
    }
  };

  return (
    <Card className="card bg-white rounded-2xl p-6 shadow-md col-span-1 md:col-span-2 transition-all hover:translate-y-[-5px] hover:shadow-lg">
      <div className="flex items-center mb-4">
        <FaRocket className="text-xl mr-2" />
        <h2 className="text-xl font-bold">Projects</h2>
      </div>
      
      <div className="space-y-4">
        {projects.map((project) => (
          <div key={project.id} className="project-item p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
            <div className="flex items-center">
              <div className={`project-icon w-10 h-10 rounded-full ${getBgClass(project.iconBackground)} flex items-center justify-center mr-3`}>
                {getIcon(project.icon)}
              </div>
              <div>
                <h3 className="font-medium">{project.name}</h3>
                <p className="text-sm text-gray-600">{project.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
