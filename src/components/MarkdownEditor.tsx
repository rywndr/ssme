import React from 'react';

interface MarkdownEditorProps {
  markdown: string;
  handleMarkdownChange: (value: string) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  textAreaRef: React.Ref<HTMLTextAreaElement> | null; // Make the type nullable
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  markdown,
  handleMarkdownChange,
  handleKeyDown,
  textAreaRef,
}) => {
  return (
    <textarea
      ref={textAreaRef}
      value={markdown}
      onChange={(e) => handleMarkdownChange(e.target.value)}
      onKeyDown={handleKeyDown}
      className="w-full h-full resize-none bg-background text-foreground p-2 outline-none"
      placeholder="Type your markdown here..."
      spellCheck="false"
    />
  );
};

export default MarkdownEditor;
