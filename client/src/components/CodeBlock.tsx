import React, { useState } from 'react';
import copy from 'copy-to-clipboard';
import { Highlight, themes, type Language } from 'prism-react-renderer';
import { useTheme } from '../lib/ThemeContext';

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
  const { theme } = useTheme();
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
    <div className="code-block rounded-lg overflow-hidden my-6 bg-[#f2f1ed] dark:bg-[#151718] relative group">
      {/* 文件名及顶部工具栏 - Notion风格 */}
      <div className="bg-[#ebe9e5] dark:bg-[#2d2d2d] py-2 px-4 flex justify-between items-center border-b border-[#e0e0e0] dark:border-[#3a3a3a]">
        {fileName ? (
          <div className="text-[#37352f] dark:text-[#e6e6e6] text-xs font-medium">
            {fileName}
          </div>
        ) : (
          <div className="text-[#787774] dark:text-[#aaa] text-xs font-medium">
            {language.toUpperCase()}
          </div>
        )}
        <button
          onClick={handleCopy}
          className="copy-button text-xs bg-[#e0ddd8] hover:bg-[#d5d2cc] dark:bg-[#383838] dark:hover:bg-[#444] 
                   text-[#37352f] dark:text-[#ddd] py-1 px-3 rounded 
                   transition-colors duration-200 opacity-0 group-hover:opacity-100"
        >
          {copied ? '已复制！' : '复制代码'}
        </button>
      </div>
      
      {/* 代码内容 - 使用prism-react-renderer */}
      <Highlight
        theme={theme === 'light' ? {
          ...themes.nightOwl,
          styles: themes.nightOwl.styles.map(style => {
            // 修改主要文本颜色
            if (style.style.color === '#d6deeb') {
              return { ...style, style: { ...style.style, color: '#364f6b' } };
            }
            // 修改注释颜色
            if (style.style.color === '#637777' || style.style.color === '#aaaaaa') {
              return { ...style, style: { ...style.style, color: '#72818a' } };
            }
            // 修改关键字颜色
            if (style.style.color === '#c792ea' || style.style.color === '#7fdbca') {
              return { ...style, style: { ...style.style, color: '#0366d6' } };
            }
            // 修改字符串颜色
            if (style.style.color === '#ecc48d' || style.style.color === '#addb67') {
              return { ...style, style: { ...style.style, color: '#24936e' } };
            }
            // 其他颜色保持不变
            return style;
          })
        } : themes.nightOwl}
        code={code}
        language={normalizedLanguage}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className="m-0 p-3 overflow-x-auto" style={{ ...style, margin: 0, padding: '0.75rem', background: 'transparent' }}>
            <div className="grid" style={{ 
              display: 'grid', 
              gridTemplateColumns: '3rem 1fr',
              width: '100%'
            }}>
              {/* 行号列 */}
              <div className="line-numbers pr-2" style={{ userSelect: 'none', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                {tokens.map((_, lineIndex) => (
                  <span 
                    key={lineIndex}
                    className="text-right opacity-50 select-none w-full"
                    style={{ 
                      color: theme === 'dark' ? 'rgba(220, 220, 220, 0.5)' : 'rgba(50, 50, 50, 0.4)', 
                      paddingRight: '1rem', 
                      textAlign: 'right' 
                    }}
                  >
                    {lineIndex + 1}
                  </span>
                ))}
              </div>
              
              {/* 代码内容列 */}
              <div className="code-content pl-3 border-l border-[#d0cfcb] dark:border-[#263b50]">
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