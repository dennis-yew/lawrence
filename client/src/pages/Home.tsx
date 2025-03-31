import { useQuery } from "@tanstack/react-query";
import ProfileCard from "@/components/ProfileCard";
import TechStackCard from "@/components/TechStackCard";
import InterestsCard from "@/components/InterestsCard";
import PersonalityCard from "@/components/PersonalityCard";
import ProjectsCard from "@/components/ProjectsCard";
import ActivityHeatmapCard from "@/components/ActivityHeatmapCard";
import BlogPostsCard from "@/components/BlogPostsCard";
import Footer from "@/components/Footer";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { useTranslation } from "@/lib/LanguageContext";
import { type Profile, type TechStack, type Interest, type Project, type Post, type Activity } from "@shared/schema";

export default function Home() {
  const { t } = useTranslation();
  
  const { data: profile, isLoading: profileLoading } = useQuery<Profile>({
    queryKey: ['/api/profile']
  });

  const { data: techStacks, isLoading: techStacksLoading } = useQuery<TechStack[]>({
    queryKey: ['/api/tech-stacks']
  });

  const { data: interests, isLoading: interestsLoading } = useQuery<Interest[]>({
    queryKey: ['/api/interests']
  });

  const { data: projects, isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ['/api/projects']
  });

  const { data: activities, isLoading: activitiesLoading } = useQuery<Activity[]>({
    queryKey: ['/api/activities']
  });

  const { data: posts, isLoading: postsLoading } = useQuery<Post[]>({
    queryKey: ['/api/posts']
  });

  const isLoading = profileLoading || techStacksLoading || interestsLoading || projectsLoading || activitiesLoading || postsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f5f7f9] dark:bg-gray-900 min-h-screen transition-colors duration-200">
      <div className="container mx-auto px-4 py-8">
        {/* 主题和语言切换按钮 */}
        <div className="flex justify-end mb-4 space-x-2">
          <LanguageSwitch />
          <ThemeToggle />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <ProfileCard profile={profile} />
          <TechStackCard techStacks={techStacks || []} />
          <InterestsCard interests={interests || []} />
          <PersonalityCard profile={profile} />
          <ProjectsCard projects={projects || []} />
          <ActivityHeatmapCard activities={activities || []} />
          <BlogPostsCard posts={posts || []} />
        </div>
        <Footer />
      </div>
    </div>
  );
}
