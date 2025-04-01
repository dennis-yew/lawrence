import { useRoute, Link } from 'wouter';
import { format, parseISO } from 'date-fns';
import { useTranslation } from '@/lib/LanguageContext';
import { ArrowLeft } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { ApiPost } from '@/types/api';

export default function PostDetail() {
  const [, params] = useRoute('/posts/:id');
  const postId = params?.id;
  const { t } = useTranslation();
  
  const { data: post, isLoading, error } = useQuery<ApiPost>({
    queryKey: [`/api/posts/${postId}`],
    enabled: !!postId
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="text-center">
          <h1 className="text-2xl text-red-500 dark:text-red-400 mb-4">Error loading post</h1>
          <p className="mb-4">There was an error loading this post.</p>
          <div className="flex items-center justify-center">
            <Link href="/" className="text-blue-500 dark:text-blue-400 hover:underline flex items-center">
              <ArrowLeft className="mr-2" size={16} />
              Return to home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="text-center">
          <h1 className="text-2xl mb-4 dark:text-white">Post not found</h1>
          <p className="mb-4 dark:text-gray-300">The post you're looking for doesn't exist or has been removed.</p>
          <div className="flex items-center justify-center">
            <Link href="/" className="text-blue-500 dark:text-blue-400 hover:underline flex items-center">
              <ArrowLeft className="mr-2" size={16} />
              Return to home
            </Link>
          </div>
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
      
      <article className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 lg:p-10">
        <h1 className="text-3xl font-bold mb-4 dark:text-white">{post.title}</h1>
        <div className="text-gray-500 dark:text-gray-400 mb-8">
          {post.createdAt ? format(parseISO(post.createdAt), 'MMMM d, yyyy') : ''}
        </div>
        
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{post.content}</p>
        </div>
      </article>
    </div>
  );
}