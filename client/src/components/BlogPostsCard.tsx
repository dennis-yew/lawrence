import { Card } from "@/components/ui/card";
import { PenTool, Upload, Image as ImageIcon } from "lucide-react";
import { format, parseISO } from "date-fns";
import { useTranslation } from "@/lib/LanguageContext";
import { Link } from "wouter";
import { ApiPost } from "@/types/api";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface BlogPostsCardProps {
  posts: ApiPost[];
}

export default function BlogPostsCard({ posts }: BlogPostsCardProps) {
  const { t, language } = useTranslation();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const uploadMutation = useMutation({
    mutationFn: async (data: { mdFile: File; imageFile: File | null }) => {
      const formData = new FormData();
      formData.append('md', data.mdFile);
      if (data.imageFile) {
        formData.append('image', data.imageFile);
      }

      const response = await fetch('/api/posts', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '上传失败');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
      setSelectedFile(null);
      setSelectedImage(null);
      setShowImageDialog(false);
      toast({
        title: "上传成功",
        description: "文章已成功发布",
      });
    },
    onError: (error: Error) => {
      console.error('Upload error:', error);
      toast({
        title: "上传失败",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const file = files[0];
    if (file && file.name.endsWith('.md')) {
      setSelectedFile(file);
      setShowImageDialog(true);
    } else {
      toast({
        title: "文件类型错误",
        description: "请选择 .md 格式的文件",
        variant: "destructive",
      });
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const file = files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
    } else {
      toast({
        title: "文件类型错误",
        description: "请选择图片文件",
        variant: "destructive",
      });
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      toast({
        title: "错误",
        description: "请先选择 Markdown 文件",
        variant: "destructive",
      });
      return;
    }
    uploadMutation.mutate({ mdFile: selectedFile, imageFile: selectedImage });
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setSelectedImage(null);
    setShowImageDialog(false);
  };
  
  return (
    <>
      <Card className="card bg-white dark:bg-[#2d2d2d] rounded-2xl p-6 shadow-md col-span-1 md:col-span-3 lg:col-span-4 transition-all hover:translate-y-[-5px] hover:shadow-lg dark:shadow-[#1d1d1d]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <PenTool className="text-xl mr-2 dark:text-gray-300" />
            <h2 className="text-xl font-bold dark:text-white">{t('blogPosts.title')}</h2>
          </div>
          <div className="flex items-center gap-4">
            <label className="cursor-pointer flex items-center gap-2 text-purple-500 dark:text-purple-400 hover:underline text-sm">
              <Upload size={16} />
              <input
                type="file"
                accept=".md"
                className="hidden"
                onChange={handleFileChange}
                disabled={uploadMutation.isPending}
              />
              {uploadMutation.isPending ? t('blogPosts.uploading') : t('blogPosts.upload')}
            </label>
            <Link href="/blog" className="text-purple-500 dark:text-purple-400 hover:underline text-sm">{t('blogPosts.viewAll')}</Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts?.map((post) => (
            <Link key={post.id} href={`/posts/${post.id}`}>
              <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                {post.imageUrl && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    {post.createdAt ? format(parseISO(post.createdAt), 'MMMM d, yyyy') : ''}
                  </div>
                  <h2 className="text-xl font-bold mb-3 dark:text-white">{post.title}</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                    {post.content.replace(/#|`|_|\*|\[.*\]|\(.*\)/g, '').substring(0, 150)}...
                  </p>
                  <span className="text-purple-500 dark:text-purple-400 hover:underline">
                    {t('blogPosts.readMore')}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Card>

      <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>选择文章首图</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              请选择一张图片作为文章的封面图片。支持 JPG、PNG、GIF 和 WebP 格式。
              {selectedFile && (
                <span className="block mt-2">
                  已选择文章：<strong>{selectedFile.name}</strong>
                </span>
              )}
            </p>
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
              <ImageIcon className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-2" />
              <label className="cursor-pointer text-center">
                <span className="text-purple-500 dark:text-purple-400 hover:underline">点击选择图片</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
              {selectedImage && (
                <p className="mt-2 text-sm text-gray-500">已选择图片: {selectedImage.name}</p>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleCancel}>
              取消
            </Button>
            <Button 
              onClick={handleUpload} 
              disabled={uploadMutation.isPending || !selectedFile}
            >
              {uploadMutation.isPending ? '上传中...' : '确认上传'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
