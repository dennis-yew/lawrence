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

      return (
        <CodeBlock
          code={String(children).replace(/\n$/, '')}
          language={match ? match[1] : 'text'}
        />
      );
    }
  };

  return (
    <div className="prose dark:prose-invert max-w-none">
      <ReactMarkdown 
        // @ts-ignore - The type definitions for ReactMarkdown don't match the actual implementation
        remarkPlugins={[remarkGfm]}
        components={customRenderers}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};