import React, { useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
// Import languages
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-scss';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-php';
import 'prismjs/components/prism-ruby';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-swift';

interface CodeBlockProps {
  code: string;
  language: string;
  fileName?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language, fileName }) => {
  useEffect(() => {
    Prism.highlightAll();
  }, [code, language]);

  return (
    <div className="code-block rounded-md overflow-hidden my-4">
      {fileName && (
        <div className="bg-gray-800 text-gray-200 px-4 py-2 text-sm font-mono border-b border-gray-700">
          {fileName}
        </div>
      )}
      <pre className="m-0 p-0">
        <code className={`language-${language} block p-4 overflow-x-auto`}>
          {code}
        </code>
      </pre>
    </div>
  );
};