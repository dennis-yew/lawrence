import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from './CodeBlock';

interface MarkdownProps {
  content: string;
}

export const Markdown: React.FC<MarkdownProps> = ({ content }) => {
  // Using type assertions to bypass TypeScript issues with react-markdown
  type MarkdownComponentProps = any;
  
  const customRenderers = {
    code: ({ node, inline, className, children, ...props }: MarkdownComponentProps) => {
      const match = /language-(\w+)/.exec(className || '');
      
      if (inline) {
        return (
          <code className="bg-gray-100 dark:bg-gray-800 rounded px-1 py-0.5 text-sm font-mono" {...props}>
            {children}
          </code>
        );
      }

      // 处理代码内容和可能的文件名
      const rawContent = String(children).replace(/\n$/, '');
      let fileName: string | undefined = undefined;
      let code = rawContent;
      
      // 检查第一行是否包含文件名标记 (例如 "filename: example.js")
      const fileNameMatch = rawContent.match(/^filename:\s*(.+?)\n/);
      if (fileNameMatch) {
        fileName = fileNameMatch[1].trim();
        // 移除文件名行，仅保留实际代码
        code = rawContent.replace(/^filename:\s*(.+?)\n/, '');
      }

      // 不使用props传递给CodeBlock，避免将pre标签属性传递下去
      return (
        <div className="markdown-code-block-wrapper">
          <CodeBlock
            code={code}
            language={match ? match[1] : 'text'}
            fileName={fileName}
          />
        </div>
      );
    },
    // 增强链接样式
    a: ({ node, href, children, ...props }: MarkdownComponentProps) => (
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-blue-600 dark:text-blue-400 hover:underline transition-colors duration-200"
        {...props}
      >
        {children}
      </a>
    ),
    // 增强图片样式
    img: ({ node, src, alt, ...props }: MarkdownComponentProps) => (
      <img 
        src={src} 
        alt={alt || ''} 
        className="rounded-lg my-4 max-w-full h-auto shadow-sm dark:shadow-gray-800" 
        loading="lazy" 
        {...props} 
      />
    ),
    // 增强表格样式
    table: ({ node, children, ...props }: MarkdownComponentProps) => (
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse border border-gray-300 dark:border-gray-700" {...props}>
          {children}
        </table>
      </div>
    ),
    th: ({ node, children, ...props }: MarkdownComponentProps) => (
      <th className="border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 p-2 text-left" {...props}>
        {children}
      </th>
    ),
    td: ({ node, children, ...props }: MarkdownComponentProps) => (
      <td className="border border-gray-300 dark:border-gray-700 p-2" {...props}>
        {children}
      </td>
    )
  };

  return (
    <div className="prose dark:prose-invert prose-lg max-w-none prose-headings:font-semibold prose-headings:text-gray-900 dark:prose-headings:text-gray-100
                    prose-h1:text-3xl prose-h2:text-2xl prose-h2:border-b prose-h2:border-gray-200 dark:prose-h2:border-gray-800 prose-h2:pb-2 prose-h2:mt-12
                    prose-h3:text-xl prose-h4:text-lg
                    prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-7 
                    prose-a:text-blue-600 dark:prose-a:text-blue-500 prose-a:no-underline hover:prose-a:underline
                    prose-blockquote:border-l-4 prose-blockquote:border-gray-300 dark:prose-blockquote:border-gray-700 
                    prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-400
                    prose-ul:list-disc prose-ul:pl-5 prose-ol:pl-5
                    prose-li:my-2 prose-li:text-gray-700 dark:prose-li:text-gray-300
                    prose-img:rounded-md prose-img:shadow-sm dark:prose-img:shadow-none
                    prose-hr:border-gray-200 dark:prose-hr:border-gray-800 prose-hr:my-8">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={customRenderers}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};