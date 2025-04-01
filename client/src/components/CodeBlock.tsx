import React, { useState } from 'react';
import copy from 'copy-to-clipboard';
import { Highlight, themes, type Language } from 'prism-react-renderer';

interface CodeBlockProps {
  code: string;
  language: string;
  fileName?: string;
}

// 这个映射表确保传入的language字符串能够匹配prism-react-renderer支持的语言
const languageMap: Record<string, Language> = {
  js: 'javascript',
  javascript: 'javascript',
  jsx: 'jsx',
  ts: 'typescript',
  typescript: 'typescript',
  tsx: 'tsx',
  css: 'css',
  scss: 'scss',
  html: 'html',
  xml: 'xml',
  bash: 'bash',
  sh: 'bash',
  shell: 'bash',
  json: 'json',
  md: 'markdown',
  markdown: 'markdown',
  py: 'python',
  python: 'python',
  java: 'java',
  rb: 'ruby',
  ruby: 'ruby',
  go: 'go',
  golang: 'go',
  php: 'php',
  sql: 'sql',
  yaml: 'yaml',
  yml: 'yaml',
  cs: 'csharp',
  csharp: 'csharp',
  c: 'c',
  cpp: 'cpp',
  diff: 'diff',
  graphql: 'graphql',
  rust: 'rust',
  swift: 'swift'
};

// 解析language为prism-react-renderer支持的语言
const getLanguage = (lang: string): Language => {
  const lowerLang = lang.toLowerCase();
  const mappedLang = languageMap[lowerLang];
  
  // 返回映射的语言，如果没有映射则尝试直接使用，最终回退到纯文本
  return mappedLang || (lowerLang as Language) || 'text';
};

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language, fileName }) => {
  const [copied, setCopied] = useState(false);
  const normalizedLanguage = getLanguage(language);
  
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
    <div className="code-block rounded-md overflow-hidden my-4 bg-gray-900 dark:bg-gray-900 relative group">
      {/* 文件名及顶部工具栏 */}
      <div className="bg-gray-800 dark:bg-gray-800 py-2 px-4 flex justify-between items-center border-b border-gray-700">
        {fileName ? (
          <div className="text-gray-200 dark:text-gray-200 text-sm font-mono">
            {fileName}
          </div>
        ) : (
          <div className="text-gray-500 dark:text-gray-400 text-sm font-mono">
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
      
      {/* 代码内容 - 使用prism-react-renderer */}
      <Highlight
        theme={themes.nightOwl}
        code={code}
        language={normalizedLanguage}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className="m-0 p-4 overflow-x-auto" style={style}>
            <div className="grid" style={{ 
              display: 'grid', 
              gridTemplateColumns: 'auto 1fr',
              width: '100%'
            }}>
              {/* 行号列 */}
              <div className="line-numbers" style={{ userSelect: 'none' }}>
                {tokens.map((_, lineIndex) => (
                  <span 
                    key={lineIndex}
                    className="block text-right opacity-50 select-none"
                    style={{ color: 'rgba(220, 220, 220, 0.5)', paddingRight: '1rem' }}
                  >
                    {lineIndex + 1}
                  </span>
                ))}
              </div>
              
              {/* 代码内容列 */}
              <div className="code-content">
                {tokens.map((line, lineIndex) => (
                  <div key={lineIndex} {...getLineProps({ line, key: lineIndex })} style={{ paddingLeft: '0.5rem' }}>
                    {line.map((token, tokenIndex) => (
                      <span key={tokenIndex} {...getTokenProps({ token, key: tokenIndex })} />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </pre>
        )}
      </Highlight>
    </div>
  );
};