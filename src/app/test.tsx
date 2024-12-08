'use client'
import React, { useState, useCallback, useMemo, useRef } from 'react'
import MDEditor from '@uiw/react-md-editor'
import rehypeSanitize from 'rehype-sanitize'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math';
import 'katex/dist/katex.min.css';
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { MarkdownToolbar } from '@/components/markdown-toolbar'

export default function Home() {
  const [markdown, setMarkdown] = useState('')
  const [wordCount, setWordCount] = useState(0)
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  const updateWordCount = useCallback((text: string) => {
    const words = text.trim().split(/\s+/)
    setWordCount(text.trim() ? words.length : 0)
  }, [])

  const addToHistory = useCallback((text: string) => {
    setHistory(prevHistory => {
      // Slice the array to remove any future states if we're not at the latest state
      const newHistory = prevHistory.slice(0, historyIndex + 1)
      return [...newHistory, text]
    })
    setHistoryIndex(prev => prev + 1)
  }, [historyIndex])

  const handleMarkdownChange = useCallback((value?: string) => {
    const newValue = value || ''
    setMarkdown(newValue)
    updateWordCount(newValue)
    addToHistory(newValue)
  }, [updateWordCount, addToHistory])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!textAreaRef.current) return

    // Tab key for indentation
    if (e.key === 'Tab') {
      e.preventDefault()
      const textarea = textAreaRef.current
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const selectedText = markdown.substring(start, end)

      // If text is selected, indent the entire selection
      if (selectedText) {
        const lines = selectedText.split('\n')
        const indentedLines = lines.map(line => `    ${line}`)
        const indentedText = indentedLines.join('\n')

        const textBeforeSelection = markdown.substring(0, start)
        const textAfterSelection = markdown.substring(end)
        
        const newMarkdown = textBeforeSelection + indentedText + textAfterSelection
        
        setMarkdown(newMarkdown)
        updateWordCount(newMarkdown)
        addToHistory(newMarkdown)

        // Set cursor position after indentation
        setTimeout(() => {
          if (textAreaRef.current) {
            const newCursorPosition = start + indentedText.length
            textAreaRef.current.setSelectionRange(newCursorPosition, newCursorPosition)
            textAreaRef.current.focus()
          }
        }, 0)
      } else {
        // If no text is selected, insert 4 spaces
        const textBeforeCursor = markdown.substring(0, start)
        const textAfterCursor = markdown.substring(end)
        
        const newMarkdown = textBeforeCursor + '    ' + textAfterCursor
        
        setMarkdown(newMarkdown)
        updateWordCount(newMarkdown)
        addToHistory(newMarkdown)

        // Set cursor position after spaces
        setTimeout(() => {
          if (textAreaRef.current) {
            const newCursorPosition = start + 4
            textAreaRef.current.setSelectionRange(newCursorPosition, newCursorPosition)
            textAreaRef.current.focus()
          }
        }, 0)
      }
    }

    // Undo (Ctrl+Z)
    if (e.ctrlKey && e.key === 'z') {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setMarkdown(history[newIndex])
        updateWordCount(history[newIndex])
        setHistoryIndex(newIndex)
      }
    }

    // Redo Ctrl+Y
    if (e.ctrlKey && e.key === 'y') {
      e.preventDefault()
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1
        setMarkdown(history[newIndex])
        updateWordCount(history[newIndex])
        setHistoryIndex(newIndex)
      }
    }
  }, [markdown, updateWordCount, addToHistory, history, historyIndex])

const handleFormat = useCallback((formatType: string) => {
  if (!textAreaRef.current) return;

  const textarea = textAreaRef.current;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const textBeforeCursor = markdown.substring(0, start);
  const textAfterCursor = markdown.substring(end);
  const selectedText = markdown.substring(start, end);

  const lines = textBeforeCursor.split("\n");
  const currentLineStart = lines.slice(0, -1).join("\n").length + (lines.length > 1 ? 1 : 0);
  const currentLineEnd = textBeforeCursor.length + selectedText.length;

  const currentLine = markdown.substring(currentLineStart, currentLineEnd);

  const formatMap: { [key: string]: (text: string) => { formatted: string; cursorOffset: number } } = {
    bold: (text) => ({
      formatted: `**${text}**`,
      cursorOffset: text ? 0 : 2,
    }),
    italic: (text) => ({
      formatted: `*${text}*`,
      cursorOffset: text ? 0 : 1,
    }),
    code: (text) => ({
      formatted: `\`${text}\``,
      cursorOffset: text ? 0 : 1,
    }),
    "unordered-list": (text) => ({
      formatted: `- ${text}`,
      cursorOffset: 0,
    }),
    "ordered-list": (text) => ({
      formatted: `1. ${text}`,
      cursorOffset: 0,
    }),
    heading: (text) => ({
      formatted: `# ${text}`,
      cursorOffset: 0,
    }),
    link: (text) => ({
      formatted: `[${text}](url)`,
      cursorOffset: text ? 0 : 6,
    }),
    quote: (text) => ({
      formatted: `> ${text || currentLine}`,
      cursorOffset: text ? 0 : 0,
    }),
    formula: (text) => ({
      formatted: `$$${text || "formula"}$$`,
      cursorOffset: text ? 0 : 7,
    }),
  };

  const { formatted, cursorOffset } = formatMap[formatType](selectedText);

  const textBeforeLine = markdown.substring(0, currentLineStart);
  const textAfterLine = markdown.substring(currentLineEnd);

  let newMarkdown;
  if (formatType === "quote") {
    newMarkdown = textBeforeLine + formatted + textAfterLine;
  } else {
    newMarkdown = textBeforeCursor + formatted + textAfterCursor;
  }

  setMarkdown(newMarkdown);
  updateWordCount(newMarkdown);
  addToHistory(newMarkdown);

  // Set cursor position
  setTimeout(() => {
    if (textAreaRef.current) {
      const newCursorPosition =
        formatType === "quote"
          ? currentLineStart + formatted.length
          : start + formatted.length - cursorOffset;
      textAreaRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
      textAreaRef.current.focus();
    }
  }, 0);
}, [markdown, updateWordCount, addToHistory]);

  const renderedMarkdown = useMemo(() => markdown, [markdown])

  return (
    <div className="flex flex-col h-screen">
      <header className="flex justify-between items-center p-4 border-b">
        <h1 className="text-xl font-bold">SSME</h1>
        <ThemeToggle />
      </header>
      
      <MarkdownToolbar onFormat={handleFormat} />
      
      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/2 p-4 border-r">
          <textarea 
            ref={textAreaRef}
            value={markdown} 
            onChange={(e) => handleMarkdownChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full h-full resize-none bg-background text-foreground p-2 outline-none"
            placeholder="Type your markdown here..."
          />
        </div>
        
        <div className="w-1/2 p-4 overflow-auto">
          <MDEditor.Markdown 
            source={renderedMarkdown} 
            remarkPlugins={[remarkMath]} // Add remark-math
            rehypePlugins={[rehypeSanitize, rehypeKatex, ]} // Add rehype-katex here
          />
        </div>
      </div>
      
      <footer className="p-2 border-t text-center">
        Word Count: {wordCount}
      </footer>
    </div>
  );
}

