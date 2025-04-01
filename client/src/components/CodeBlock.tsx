import React from 'react';
import 'prismjs/themes/prism-tomorrow.css';

interface CodeBlockProps {
  code: string;
  language: string;
  fileName?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language, fileName }) => {
  // 不使用 Prism.highlightAll() 避免错误，使用手动添加类名的方式代替
  return (
    <div className="code-block rounded-md overflow-hidden my-4 bg-gray-900">
      {fileName && (
        <div className="bg-gray-800 text-gray-200 px-4 py-2 text-sm font-mono border-b border-gray-700">
          {fileName}
        </div>
      )}
      <pre className="m-0 p-0">
        <code className={`language-${language} block p-4 overflow-x-auto text-gray-200 font-mono`}>
          {code}
        </code>
      </pre>
    </div>
  );
};