import React, { useState, useEffect, useRef } from 'react';
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
  const { theme } = useTheme(); // 获取主题以便设置强制样式
  const normalizedLanguage = getLanguage(language);
  const codeBlockRef = useRef<HTMLDivElement>(null);
  
  // 使用useEffect来确保代码块元素及其内部元素的样式始终为深色
  useEffect(() => {
    if (codeBlockRef.current) {
      // 选择所有内部代码元素和子元素
      const allElements = codeBlockRef.current.querySelectorAll('*');
      
      // 设置固定的深色背景和文本颜色
      allElements.forEach(el => {
        if (el instanceof HTMLElement) {
          el.style.color = '#d4d4d4';
          
          // 只对特定元素应用背景色，避免影响布局
          if (el.tagName === 'PRE' || el.tagName === 'SPAN' || el.tagName === 'DIV') {
            el.style.backgroundColor = '#151718';
          }
        }
      });
    }
  }, [code, theme]); // 当代码或主题变化时重新应用样式
  
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
    <div 
      ref={codeBlockRef}
      className="code-block rounded-lg overflow-hidden my-6 bg-[#151718] relative group"
      style={{ backgroundColor: '#151718' }} // 强制设置为深色背景
    >
      {/* 文件名及顶部工具栏 - Notion风格 */}
      <div className="bg-[#2d2d2d] py-2 px-4 flex justify-between items-center border-b border-[#3a3a3a]">
        {fileName ? (
          <div className="text-[#e6e6e6] text-xs font-medium">
            {fileName}
          </div>
        ) : (
          <div className="text-[#aaa] text-xs font-medium">
            {language.toUpperCase()}
          </div>
        )}
        <button
          onClick={handleCopy}
          className="copy-button text-xs bg-[#383838] hover:bg-[#444] 
                   text-[#ddd] py-1 px-3 rounded 
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
          <pre className="m-0 p-3 overflow-x-auto" style={{ ...style, margin: 0, padding: '0.75rem', background: '#151718', color: '#d4d4d4' }}>
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
                      color: 'rgba(220, 220, 220, 0.5)', 
                      paddingRight: '1rem', 
                      textAlign: 'right' 
                    }}
                  >
                    {lineIndex + 1}
                  </span>
                ))}
              </div>
              
              {/* 代码内容列 */}
              <div className="code-content pl-3 border-l border-[#263b50]">
                {tokens.map((line, lineIndex) => (
                  <div key={lineIndex} {...getLineProps({ line, key: lineIndex })} style={{ paddingLeft: '0.5rem', backgroundColor: '#151718', color: '#d4d4d4' }}>
                    {line.map((token, tokenIndex) => (
                      <span 
                        key={tokenIndex} 
                        {...getTokenProps({ token, key: tokenIndex })} 
                        style={{ backgroundColor: '#151718' }} 
                      />
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