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
    <div className="prose dark:prose-invert max-w-none">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={customRenderers}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};