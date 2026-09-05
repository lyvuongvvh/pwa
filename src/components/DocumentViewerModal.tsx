import React, { useState } from 'react';
import { DocumentItem } from '../types';
import {
  X,
  Download,
  Search,
  FileCode,
  FileText,
  Calendar,
  User,
  Tag,
  Folder,
  Eye,
  Code,
  Copy,
  Check,
  Building
} from 'lucide-react';

interface DocumentViewerModalProps {
  document: DocumentItem | null;
  onClose: () => void;
  initialHighlightQuery?: string;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  document,
  onClose,
  initialHighlightQuery = '',
}) => {
  const [activeView, setActiveView] = useState<'preview' | 'text' | 'raw'>(
    document?.fileType === 'html' ? 'preview' : 'text'
  );
  const [inDocSearch, setInDocSearch] = useState(initialHighlightQuery);
  const [copied, setCopied] = useState(false);

  if (!document) return null;

  const handleCopyText = () => {
    navigator.clipboard.writeText(document.textContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    let blob: Blob;
    if (document.fileType === 'html' && document.htmlContent) {
      blob = new Blob([document.htmlContent], { type: 'text/html' });
    } else {
      blob = new Blob([document.textContent], { type: 'text/plain' });
    }
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = document.fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Highlight search terms in document text
  const renderHighlightedText = (content: string, query: string) => {
    if (!query.trim()) return content;

    const terms = query
      .trim()
      .split(/\s+/)
      .filter((t) => t.length > 1);

    if (terms.length === 0) return content;

    const regex = new RegExp(`(${terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
    const parts = content.split(regex);

    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-amber-300 text-amber-950 font-semibold px-0.5 rounded-2xs">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div
      id="document-viewer-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-2 sm:p-4 md:p-6 overflow-hidden"
    >
      <div
        id="document-viewer-container"
        className="flex flex-col w-full max-w-5xl h-[92vh] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#1e2024] text-white border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <span
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase shrink-0 ${
                document.fileType === 'pdf'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}
            >
              {document.fileType.toUpperCase()}
            </span>
            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-white truncate font-serif">{document.title}</h2>
              <p className="text-[11px] text-stone-400 truncate">{document.fileName} &bull; {formatFileSize(document.fileSize)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-doc-download"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-xs font-medium text-stone-200 border border-stone-700 transition"
              title="Tải về tập tin gốc"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Tải Về</span>
            </button>
            <button
              id="btn-close-viewer-modal"
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar: Views & In-Document Search */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-2.5 bg-stone-50 border-b border-stone-200 shrink-0 text-xs">
          {/* View Mode Switches */}
          <div className="flex items-center gap-1 bg-stone-200/80 p-0.5 rounded-lg">
            {document.fileType === 'html' && (
              <button
                onClick={() => setActiveView('preview')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition ${
                  activeView === 'preview'
                    ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Eye className="w-3.5 h-3.5 text-amber-700" />
                <span>Bản Trình Bày HTML</span>
              </button>
            )}
            <button
              onClick={() => setActiveView('text')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition ${
                activeView === 'text'
                  ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-[#800020]" />
              <span>Toàn Văn Trích Xuất</span>
            </button>
            {document.fileType === 'html' && (
              <button
                onClick={() => setActiveView('raw')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition ${
                  activeView === 'raw'
                    ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Code className="w-3.5 h-3.5 text-emerald-700" />
                <span>Mã Nguồn HTML</span>
              </button>
            )}
          </div>

          {/* In-Document Search Filter */}
          <div className="flex items-center gap-2 flex-1 max-w-xs">
            <div className="relative w-full">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm trong tài liệu này..."
                value={inDocSearch}
                onChange={(e) => setInDocSearch(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-lg pl-8 pr-3 py-1 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              {inDocSearch && (
                <button
                  onClick={() => setInDocSearch('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
            <button
              onClick={handleCopyText}
              className="p-1.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-100 text-stone-600 transition shrink-0"
              title="Sao chép nội dung vào bộ nhớ tạm"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Content Area & Metadata Sidebar */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
          {/* Main Viewer Body */}
          <div className="flex-1 overflow-y-auto p-6 bg-white">
            {activeView === 'preview' && document.htmlContent ? (
              <div
                className="prose max-w-none text-stone-800 leading-relaxed font-serif"
                dangerouslySetInnerHTML={{ __html: document.htmlContent }}
              />
            ) : activeView === 'raw' && document.htmlContent ? (
              <pre className="text-xs font-mono bg-stone-900 text-emerald-400 p-4 rounded-xl overflow-x-auto whitespace-pre-wrap leading-relaxed">
                {document.htmlContent}
              </pre>
            ) : (
              <div className="font-serif text-sm text-stone-800 leading-relaxed whitespace-pre-wrap">
                {renderHighlightedText(document.textContent, inDocSearch)}
              </div>
            )}
          </div>

          {/* Right Info Sidebar */}
          <aside className="w-full md:w-72 bg-stone-50 border-t md:border-t-0 md:border-l border-stone-200 p-5 overflow-y-auto shrink-0 text-xs">
            <h3 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] mb-3 font-serif">
              Thông Tin Văn Kiện
            </h3>

            <div className="space-y-3.5 text-stone-600">
              <div>
                <span className="text-[11px] text-stone-400 block mb-0.5">Chuyên Mục</span>
                <span className="inline-flex items-center gap-1.5 font-semibold text-stone-800 bg-white px-2.5 py-1 rounded-md border border-stone-200">
                  <Folder className="w-3.5 h-3.5 text-amber-700" />
                  {document.category}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-stone-400 block mb-0.5">Tóm Tắt / Trích Yếu</span>
                <p className="text-stone-700 bg-white p-2.5 rounded-lg border border-stone-200 leading-normal italic">
                  {document.summary || 'Chưa có bản tóm tắt trích yếu.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="bg-white p-2 rounded-lg border border-stone-200">
                  <span className="text-[10px] text-stone-400 block">Số Từ Lập Chỉ Mục</span>
                  <span className="font-bold text-stone-800">
                    {document.wordCount ? document.wordCount.toLocaleString() : 'N/A'}
                  </span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-stone-200">
                  <span className="text-[10px] text-stone-400 block">Số Trang</span>
                  <span className="font-bold text-stone-800">
                    {document.pageCount || 1}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[11px] text-stone-400 block mb-1">Từ Khóa & Nhãn</span>
                <div className="flex flex-wrap gap-1">
                  {document.tags?.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-stone-200/80 text-stone-700 rounded-md text-[10px] font-medium"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-stone-200 space-y-1 text-[11px]">
                <div className="flex items-center gap-1.5 text-stone-500">
                  <User className="w-3.5 h-3.5" />
                  <span>Người số hóa: {document.authorName || document.authorEmail}</span>
                </div>
                <div className="flex items-center gap-1.5 text-stone-500">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Lưu trữ: {new Date(document.createdAt).toLocaleDateString('vi-VN')}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
