import { Card } from "@/components/ui/card";
import { PenTool } from "lucide-react";
import { type Post } from "@shared/schema";
import { format } from "date-fns";
import { useTranslation } from "@/lib/LanguageContext";

interface BlogPostsCardProps {
  posts: Post[];
}

export default function BlogPostsCard({ posts }: BlogPostsCardProps) {
  const { t, language } = useTranslation();
  
  return (
    <Card className="card bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md col-span-1 md:col-span-3 lg:col-span-4 transition-all hover:translate-y-[-5px] hover:shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <PenTool className="text-xl mr-2 dark:text-gray-300" />
          <h2 className="text-xl font-bold dark:text-white">{t('blogPosts.title')}</h2>
        </div>
        <a href="#" className="text-purple-500 dark:text-purple-400 hover:underline text-sm">{t('blogPosts.viewAll')}</a>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div key={post.id} className="blog-card border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
            <div className="blog-image h-40 bg-gray-100 dark:bg-gray-800">
              <div className="w-full h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                <svg className="text-gray-400 dark:text-gray-500 w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div className="p-4">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                {format(new Date(post.createdAt), 'MMMM d, yyyy')}
              </div>
              <h3 className="font-bold mb-2 dark:text-white">{post.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">{post.content}</p>
              <a href={`/posts/${post.id}`} className="text-purple-500 dark:text-purple-400 text-sm hover:underline">{t('blogPosts.readMore')}</a>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
