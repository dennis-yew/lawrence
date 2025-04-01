import React, { useState, useRef } from 'react';
import copy from 'copy-to-clipboard';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
// 导入基础语言
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-scss';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markdown';
// 导入更多语言支持
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-php';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-ruby';
// 添加终端高亮支持
import 'prismjs/components/prism-shell-session';

interface CodeBlockProps {
  code: string;
  language: string;
  fileName?: string;
}

// 使用一个安全的方式处理Prism高亮
const highlight = (code: string, language: string): string => {
  try {
    const grammar = Prism.languages[language] || Prism.languages.text;
    return Prism.highlight(code, grammar, language);
  } catch (error) {
    console.error('Failed to highlight:', error);
    return code;
  }
};

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language, fileName }) => {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLPreElement>(null);
  const highlightedCode = highlight(code, language);
  
  // 复制代码到剪贴板
  const handleCopy = () => {
    copy(code);
    setCopied(true);
    
    // 2秒后重置状态
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="code-block rounded-md overflow-hidden my-4 bg-gray-900 relative group">
      {/* 文件名及顶部工具栏 */}
      <div className="bg-gray-800 py-2 px-4 flex justify-between items-center border-b border-gray-700">
        {fileName ? (
          <div className="text-gray-200 text-sm font-mono">
            {fileName}
          </div>
        ) : (
          <div className="text-gray-500 text-sm font-mono">
            {language}
          </div>
        )}
        <button
          onClick={handleCopy}
          className="copy-button text-xs bg-gray-700 hover:bg-gray-600 text-gray-200 py-1 px-2 rounded 
                    transition-colors duration-200 opacity-0 group-hover:opacity-100"
        >
          {copied ? '已复制！' : '复制代码'}
        </button>
      </div>
      
      {/* 代码内容 */}
      <pre className="m-0 p-4 overflow-x-auto relative" ref={codeRef}>
        <code 
          className={`language-${language} text-gray-200 font-mono text-sm`}
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
      </pre>
    </div>
  );
};