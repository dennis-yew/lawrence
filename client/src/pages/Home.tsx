import { useState, useEffect } from 'react';
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
import { type Profile, type TechStack, type Interest, type Project } from "@shared/schema";
import { type ApiPost, type ApiActivity } from "@/types/api";

// 示例数据，避免API依赖
const mockProfile: Profile = {
  id: 1,
  name: 'Dennis Yew',
  alias: null,
  avatar: 'https://via.placeholder.com/150',
  github: 'https://github.com/dennis-yew',
  website: null,
  personalityType: '创新者',
  personalityTitle: '全栈开发者',
  userId: 1
};

const mockTechStacks: TechStack[] = [
  { id: 1, name: 'React', icon: 'react', background: '#61dafb', userId: 1 },
  { id: 2, name: 'TypeScript', icon: 'typescript', background: '#3178c6', userId: 1 },
  { id: 3, name: 'Node.js', icon: 'node', background: '#339933', userId: 1 }
];

const mockInterests: Interest[] = [
  { id: 1, name: '编程', description: '热爱编写代码', icon: 'code', userId: 1 },
  { id: 2, name: '阅读', description: '喜欢阅读技术书籍', icon: 'book', userId: 1 },
  { id: 3, name: '音乐', description: '听音乐放松心情', icon: 'music', userId: 1 }
];

const mockProjects: Project[] = [
  { 
    id: 1, 
    name: '个人博客', 
    description: '使用React和Node.js构建的个人博客', 
    icon: 'fa-code',
    iconBackground: '#4f46e5',
    url: 'https://github.com/dennis-yew/lawrence',
    userId: 1
  }
];

const mockActivities: ApiActivity[] = [
  { 
    id: 1,
    date: new Date().toISOString(),
    count: 5,
    userId: 1
  }
];

const mockPosts: ApiPost[] = [
  { 
    id: 1, 
    title: '欢迎来到我的博客', 
    content: '这是我的第一篇博客文章', 
    imageUrl: 'https://via.placeholder.com/300x200', 
    createdAt: new Date().toISOString(),
    userId: 1
  }
];

export default function Home() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  
  // 模拟加载
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#191919] flex items-center justify-center transition-colors duration-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f5f7f9] dark:bg-[#191919] min-h-screen transition-colors duration-200">
      <div className="container mx-auto px-4 py-8">
        {/* 主题和语言切换按钮 */}
        <div className="flex justify-end mb-4 space-x-2">
          <LanguageSwitch />
          <ThemeToggle />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <ProfileCard profile={mockProfile} propActivities={mockActivities} />
          <TechStackCard techStacks={mockTechStacks} />
          <InterestsCard interests={mockInterests} />
          <PersonalityCard profile={mockProfile} />
          <ProjectsCard projects={mockProjects} />
          <ActivityHeatmapCard />
          <BlogPostsCard posts={mockPosts} />
        </div>
        <Footer />
      </div>
    </div>
  );
}
