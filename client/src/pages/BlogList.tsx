import { useQuery } from '@tanstack/react-query';
import { ApiPost } from '@/types/api';
import { Link } from 'wouter';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from '@/lib/LanguageContext';
import { format, parseISO } from 'date-fns';

export default function BlogList() {
  const { t } = useTranslation();
  
  const { data: posts, isLoading, error } = useQuery<ApiPost[]>({
    queryKey: ['/api/posts'],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md">
                <div className="h-40 bg-gray-200 dark:bg-gray-700"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="text-center">
          <h1 className="text-2xl text-red-500 dark:text-red-400 mb-4">{t('common.error')}</h1>
          <p className="mb-4">{t('common.errorLoading')}</p>
          <Link href="/" className="text-blue-500 dark:text-blue-400 hover:underline">{t('common.backToHome')}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="mb-6">
        <Link href="/" className="text-blue-500 dark:text-blue-400 hover:underline flex items-center">
          <ArrowLeft className="mr-2" size={16} />
          {t('blogPosts.backToHome')}
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-8 dark:text-white">{t('blogPosts.title')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts?.map((post) => (
          <div key={post.id} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                {post.createdAt ? format(parseISO(post.createdAt), 'MMMM d, yyyy') : ''}
              </div>
              <h2 className="text-xl font-bold mb-3 dark:text-white">{post.title}</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                {post.content.replace(/#|`|_|\*|\[.*\]|\(.*\)/g, '').substring(0, 150)}...
              </p>
              <Link href={`/posts/${post.id}`} className="text-purple-500 dark:text-purple-400 hover:underline">
                {t('blogPosts.readMore')}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}