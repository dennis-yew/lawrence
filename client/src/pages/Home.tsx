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
import { type Profile, type TechStack, type Interest, type Project, type Post } from "@shared/schema";

// 示例数据，避免API依赖
const mockProfile: Profile = {
  id: 1,
  name: 'Dennis Yew',
  avatar: 'https://via.placeholder.com/150',
  title: 'Software Developer',
  bio: '全栈开发者，热爱技术和创新',
  location: '中国',
  email: 'example@example.com',
  personality: ['创新', '专注', '持续学习']
};

const mockTechStacks: TechStack[] = [
  { id: 1, name: 'React', icon: 'react', level: 9 },
  { id: 2, name: 'TypeScript', icon: 'typescript', level: 8 },
  { id: 3, name: 'Node.js', icon: 'node', level: 8 }
];

const mockInterests: Interest[] = [
  { id: 1, name: '编程', icon: 'code' },
  { id: 2, name: '阅读', icon: 'book' },
  { id: 3, name: '音乐', icon: 'music' }
];

const mockProjects: Project[] = [
  { id: 1, name: '个人博客', description: '使用React和Node.js构建的个人博客', image: 'https://via.placeholder.com/300x200', link: '#' }
];

const mockPosts: Post[] = [
  { id: 1, title: '欢迎来到我的博客', content: '这是我的第一篇博客文章', image: 'https://via.placeholder.com/300x200', createdAt: new Date() }
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
          <ProfileCard profile={mockProfile} />
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
