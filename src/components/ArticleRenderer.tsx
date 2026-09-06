import React, { useState } from 'react';
import { Type, BookOpen, ZoomIn, ZoomOut, Check } from 'lucide-react';

interface ArticleRendererProps {
  content: string;
  className?: string;
  showControls?: boolean;
}

export const ArticleRenderer: React.FC<ArticleRendererProps> = ({
  content,
  className = '',
  showControls = true,
}) => {
  const [fontFamily, setFontFamily] = useState<'serif' | 'sans'>('serif');
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');

  // Parses raw Vietnamese text with markdown formatting (headers, lists, bold, italics, blockquotes)
  const renderFormattedParagraphs = (raw: string) => {
    const lines = raw.split('\n');
    const elements: React.ReactNode[] = [];
    let currentList: { type: 'ul' | 'ol'; items: string[] } | null = null;

    const flushList = () => {
      if (currentList) {
        if (currentList.type === 'ul') {
          elements.push(
            <ul key={`list-${elements.length}`} className="space-y-2 my-4 pl-5">
              {currentList.items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-slate-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-2 shrink-0" />
                  <span className="flex-1 leading-relaxed">{renderInlineFormatting(item)}</span>
                </li>
              ))}
            </ul>
          );
        } else {
          elements.push(
            <ol key={`list-${elements.length}`} className="space-y-2 my-4 pl-2 list-none">
              {currentList.items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-slate-800">
                  <span className="font-semibold text-amber-900 shrink-0 min-w-[20px] text-right text-xs mt-0.5">
                    {idx + 1}.
                  </span>
                  <span className="flex-1 leading-relaxed">{renderInlineFormatting(item)}</span>
                </li>
              ))}
            </ol>
          );
        }
        currentList = null;
      }
    };

    lines.forEach((line, idx) => {
      const trimmed = line.trim();

      if (!trimmed) {
        flushList();
        return;
      }

      // Check for markdown headers
      if (trimmed.startsWith('### ')) {
        flushList();
        elements.push(
          <h3
            key={`h3-${idx}`}
            className="text-base sm:text-lg font-bold font-serif text-slate-900 mt-6 mb-3 tracking-tight border-b border-stone-200 pb-1.5 text-[#0b5394]"
          >
            {renderInlineFormatting(trimmed.replace(/^###\s+/, ''))}
          </h3>
        );
        return;
      }

      if (trimmed.startsWith('## ')) {
        flushList();
        elements.push(
          <h2
            key={`h2-${idx}`}
            className="text-lg sm:text-xl font-bold font-serif text-slate-900 mt-7 mb-3 tracking-tight border-b border-amber-200 pb-2 text-[#084175]"
          >
            {renderInlineFormatting(trimmed.replace(/^##\s+/, ''))}
          </h2>
        );
        return;
      }

      if (trimmed.startsWith('# ')) {
        flushList();
        elements.push(
          <h1
            key={`h1-${idx}`}
            className="text-xl sm:text-2xl font-bold font-serif text-slate-900 mt-8 mb-4 tracking-tight border-b-2 border-[#0b5394] pb-2"
          >
            {renderInlineFormatting(trimmed.replace(/^#\s+/, ''))}
          </h1>
        );
        return;
      }

      // Check for blockquote
      if (trimmed.startsWith('> ')) {
        flushList();
        elements.push(
          <blockquote
            key={`quote-${idx}`}
            className="p-4 my-4 rounded-xl bg-amber-50/70 border-l-4 border-amber-600 text-stone-800 italic font-serif leading-relaxed text-sm sm:text-base shadow-2xs"
          >
            {renderInlineFormatting(trimmed.replace(/^>\s+/, ''))}
          </blockquote>
        );
        return;
      }

      // Check for bullet list item (- or * )
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const itemText = trimmed.replace(/^[-*]\s+/, '');
        if (currentList && currentList.type === 'ul') {
          currentList.items.push(itemText);
        } else {
          flushList();
          currentList = { type: 'ul', items: [itemText] };
        }
        return;
      }

      // Check for numbered list item (1. , 2. )
      const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
      if (numberedMatch) {
        const itemText = numberedMatch[2];
        if (currentList && currentList.type === 'ol') {
          currentList.items.push(itemText);
        } else {
          flushList();
          currentList = { type: 'ol', items: [itemText] };
        }
        return;
      }

      // Standard paragraph
      flushList();
      elements.push(
        <p key={`p-${idx}`} className="my-3.5 leading-relaxed text-slate-800">
          {renderInlineFormatting(trimmed)}
        </p>
      );
    });

    flushList();
    return elements;
  };

  // Parses inline bold (**text**), italics (*text*), and code (`text`)
  const renderInlineFormatting = (text: string): React.ReactNode => {
    // Regex matches **bold**, *italic*, or plain text segments
    const parts: React.ReactNode[] = [];
    const regex = /(\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`)/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      // Text before match
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }

      if (match[2]) {
        // Bold (**text**)
        parts.push(
          <strong key={`b-${match.index}`} className="font-bold text-slate-900">
            {match[2]}
          </strong>
        );
      } else if (match[3]) {
        // Italic (*text*)
        parts.push(
          <em key={`i-${match.index}`} className="italic text-stone-800">
            {match[3]}
          </em>
        );
      } else if (match[4]) {
        // Inline code (`text`)
        parts.push(
          <code
            key={`c-${match.index}`}
            className="px-1.5 py-0.5 rounded-md bg-stone-100 text-stone-800 text-xs font-mono border border-stone-200"
          >
            {match[4]}
          </code>
        );
      }

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  return (
    <div className={`article-content-container ${className}`}>
      {/* Reader Typography Toolbar */}
      {showControls && (
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-stone-50 border border-stone-200/90 rounded-xl mb-6 text-xs text-stone-600">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-700 flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-[#0b5394]" />
              <span>Kiểu chữ Tiếng Việt:</span>
            </span>
            <div className="inline-flex rounded-lg border border-stone-300 bg-white p-0.5">
              <button
                type="button"
                onClick={() => setFontFamily('serif')}
                className={`px-2.5 py-1 rounded-md transition font-serif ${
                  fontFamily === 'serif'
                    ? 'bg-[#0b5394] text-white font-bold shadow-2xs'
                    : 'text-stone-700 hover:text-stone-900'
                }`}
                title="Phông chữ Lora - Chuẩn mực thư tịch, báo chí văn hóa"
              >
                Chữ Có Chân (Lora)
              </button>
              <button
                type="button"
                onClick={() => setFontFamily('sans')}
                className={`px-2.5 py-1 rounded-md transition font-sans ${
                  fontFamily === 'sans'
                    ? 'bg-[#0b5394] text-white font-semibold shadow-2xs'
                    : 'text-stone-700 hover:text-stone-900'
                }`}
                title="Phông chữ Be Vietnam Pro - Chuẩn mực hiện đại"
              >
                Chân Phương (Be Vietnam Pro)
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-stone-500">Cỡ chữ:</span>
            <div className="inline-flex rounded-lg border border-stone-300 bg-white p-0.5">
              <button
                type="button"
                onClick={() => setFontSize('normal')}
                className={`px-2.5 py-1 rounded-md transition ${
                  fontSize === 'normal'
                    ? 'bg-amber-100 text-amber-900 font-bold'
                    : 'text-stone-700 hover:text-stone-900'
                }`}
                title="Cỡ chữ tiêu chuẩn"
              >
                Tiêu chuẩn (15px)
              </button>
              <button
                type="button"
                onClick={() => setFontSize('large')}
                className={`px-2.5 py-1 rounded-md transition ${
                  fontSize === 'large'
                    ? 'bg-amber-100 text-amber-900 font-bold'
                    : 'text-stone-700 hover:text-stone-900'
                }`}
                title="Cỡ chữ lớn - Dễ đọc hơn"
              >
                Lớn (17px)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Article Body */}
      <div
        className={`vn-article-body ${
          fontFamily === 'serif' ? 'font-serif' : 'font-sans'
        } ${fontSize === 'large' ? 'text-[17px] leading-[1.9]' : 'text-[15px] leading-[1.8]'}`}
      >
        {renderFormattedParagraphs(content)}
      </div>
    </div>
  );
};
