import React, { useState, useEffect } from 'react';
import MDEditor from '@uiw/react-md-editor';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import 'highlight.js/styles/github.css'; // Light theme for Highlight.js
import 'highlight.js/styles/github-dark.css'; // Dark theme for Highlight.js
import hljs from 'highlight.js';
import 'katex/dist/katex.min.css';
import { useTheme } from 'next-themes';

// Import languages directly instead of using dynamic imports
import javascript from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';
import bash from 'highlight.js/lib/languages/bash';
import typescript from 'highlight.js/lib/languages/typescript';
import java from 'highlight.js/lib/languages/java';
import c from 'highlight.js/lib/languages/c';
import cpp from 'highlight.js/lib/languages/cpp';
import go from 'highlight.js/lib/languages/go';
import rust from 'highlight.js/lib/languages/rust';
import ruby from 'highlight.js/lib/languages/ruby';
import php from 'highlight.js/lib/languages/php';
import sql from 'highlight.js/lib/languages/sql';
import json from 'highlight.js/lib/languages/json';
import yaml from 'highlight.js/lib/languages/yaml';
import xml from 'highlight.js/lib/languages/xml';
import markdown from 'highlight.js/lib/languages/markdown';
import plaintext from 'highlight.js/lib/languages/plaintext';

interface MarkdownPreviewProps {
  markdown: string;
}

const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ markdown }) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Wait for the client to mount
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Apply syntax highlighting after rendering
    hljs.highlightAll();
  }, [markdown, theme]);

  if (!mounted) {
    return <div className="w-1/2 p-4 overflow-auto" />;
  }

  return (
    <div
      className={`w-1/2 p-4 overflow-auto ${
        theme === 'dark' ? 'dark' : 'light'
      }`}
    >
      <MDEditor.Markdown
        className="markdown-preview"
        source={markdown}
        remarkPlugins={[
          [remarkGfm, { singleTilde: false, table: true, strikethrough: true }],
          remarkMath,
        ]}
        rehypePlugins={[rehypeSanitize, rehypeKatex]}
      />
    </div>
  );
};

// Register languages for highlighting
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('java', java);
hljs.registerLanguage('c', c);
hljs.registerLanguage('cpp', cpp);
hljs.registerLanguage('go', go);
hljs.registerLanguage('rust', rust);
hljs.registerLanguage('ruby', ruby);
hljs.registerLanguage('php', php);
hljs.registerLanguage('sql', sql);
hljs.registerLanguage('json', json);
hljs.registerLanguage('yaml', yaml);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('markdown', markdown);
hljs.registerLanguage('plaintext', plaintext);

export default MarkdownPreview;
