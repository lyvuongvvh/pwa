import React, { useState, useMemo } from 'react';
import { DocumentItem, DocumentType } from '../types';
import { findKeywordSnippets, removeVietnameseTones } from '../utils/fileParser';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  Filter,
  FileText,
  FileCode,
  Download,
  Trash2,
  Calendar,
  ExternalLink,
  BookOpen,
  ArrowUpDown,
  Layers,
  Sparkles,
  FilePlus,
  RefreshCw,
  Building,
  CheckCircle2,
  FolderOpen
} from 'lucide-react';

interface DocumentArchiveProps {
  documents: DocumentItem[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onOpenDocument: (doc: DocumentItem, highlightTerm?: string) => void;
  onDeleteDocument: (id: string) => void;
  onOpenUpload: () => void;
  onLoadSeedArchives: () => void;
}

export const DocumentArchive: React.FC<DocumentArchiveProps> = ({
  documents,
  searchQuery,
  setSearchQuery,
  onOpenDocument,
  onDeleteDocument,
  onOpenUpload,
  onLoadSeedArchives,
}) => {
  const { user, isEditor, isAdmin } = useAuth();

  const [selectedType, setSelectedType] = useState<'all' | 'pdf' | 'html'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'relevance' | 'newest' | 'title' | 'size'>('relevance');

  // Compute unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    documents.forEach((d) => {
      if (d.category) set.add(d.category);
    });
    return Array.from(set);
  }, [documents]);

  // Full-text search and filtering with Vietnamese diacritics resilience
  const filteredDocuments = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const terms = q.split(/\s+/).filter(Boolean);

    return documents
      .map((doc) => {
        let matchScore = 0;
        const lowerTitle = doc.title.toLowerCase();
        const unaccentedTitle = removeVietnameseTones(doc.title);
        const lowerText = doc.textContent.toLowerCase();
        const unaccentedText = removeVietnameseTones(doc.textContent);
        const lowerSummary = (doc.summary || '').toLowerCase();
        const unaccentedSummary = removeVietnameseTones(doc.summary || '');
        const lowerTags = (doc.tags || []).join(' ').toLowerCase();
        const unaccentedTags = removeVietnameseTones((doc.tags || []).join(' '));

        if (terms.length > 0) {
          for (const rawTerm of terms) {
            const term = rawTerm.toLowerCase();
            const unaccentedTerm = removeVietnameseTones(term);

            if (lowerTitle.includes(term)) matchScore += 30;
            else if (unaccentedTitle.includes(unaccentedTerm)) matchScore += 25;

            if (lowerTags.includes(term)) matchScore += 15;
            else if (unaccentedTags.includes(unaccentedTerm)) matchScore += 12;

            if (lowerSummary.includes(term)) matchScore += 10;
            else if (unaccentedSummary.includes(unaccentedTerm)) matchScore += 8;

            // Frequency in full text
            let count = 0;
            let idx = lowerText.indexOf(term);
            if (idx === -1 && unaccentedTerm !== term) {
              idx = unaccentedText.indexOf(unaccentedTerm);
            }
            while (idx !== -1 && count < 10) {
              count++;
              idx = lowerText.indexOf(term, idx + term.length);
              if (idx === -1 && unaccentedTerm !== term) {
                idx = unaccentedText.indexOf(unaccentedTerm, idx + unaccentedTerm.length);
              }
            }
            matchScore += count * 2;
          }
        } else {
          matchScore = 1;
        }

        // Extract snippet if searching
        const snippets = terms.length > 0 ? findKeywordSnippets(doc.textContent, q, 2) : [];

        return {
          doc,
          matchScore,
          snippets,
        };
      })
      .filter(({ doc, matchScore }) => {
        if (terms.length > 0 && matchScore === 0) return false;
        if (selectedType !== 'all' && doc.fileType !== selectedType) return false;
        if (selectedCategory !== 'all' && doc.category !== selectedCategory) return false;
        return true;
      })
      .sort((a, b) => {
        if (searchQuery.trim() && sortBy === 'relevance') {
          return b.matchScore - a.matchScore;
        }
        if (sortBy === 'newest') {
          return b.doc.createdAt - a.doc.createdAt;
        }
        if (sortBy === 'title') {
          return a.doc.title.localeCompare(b.doc.title, 'vi');
        }
        if (sortBy === 'size') {
          return b.doc.fileSize - a.doc.fileSize;
        }
        return b.doc.createdAt - a.doc.createdAt;
      });
  }, [documents, searchQuery, selectedType, selectedCategory, sortBy]);

  // Overall repository statistics
  const stats = useMemo(() => {
    const totalWords = documents.reduce((acc, d) => acc + (d.wordCount || 0), 0);
    const totalPages = documents.reduce((acc, d) => acc + (d.pageCount || 1), 0);
    const pdfCount = documents.filter((d) => d.fileType === 'pdf').length;
    const htmlCount = documents.filter((d) => d.fileType === 'html').length;

    return {
      totalDocs: documents.length,
      totalWords,
      totalPages,
      pdfCount,
      htmlCount,
    };
  }, [documents]);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const renderHighlightedSnippet = (snippet: string, query: string) => {
    if (!query.trim()) return snippet;

    const terms = query
      .trim()
      .split(/\s+/)
      .filter((t) => t.length > 1);

    if (terms.length === 0) return snippet;

    const regex = new RegExp(`(${terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
    const parts = snippet.split(regex);

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

  const handleDownload = (doc: DocumentItem, e: React.MouseEvent) => {
    e.stopPropagation();
    let blob: Blob;
    if (doc.fileType === 'html' && doc.htmlContent) {
      blob = new Blob([doc.htmlContent], { type: 'text/html' });
    } else {
      blob = new Blob([doc.textContent], { type: 'text/plain' });
    }
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = doc.fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero Overview */}
      <div className="bg-linear-to-r from-[#800020] via-[#8b1538] to-[#580d23] rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-[#9f2244] relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-200 border border-amber-400/30 text-xs font-semibold mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>Kho Lưu Trữ Tư Liệu & Thư Viện Số Hóa</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif tracking-tight text-white mb-2">
            Kho Tài Liệu Toàn Văn Viện Việt Học
          </h1>
          <p className="text-rose-100 text-xs sm:text-sm leading-relaxed mb-5">
            Tìm kiếm tức thời trong toàn bộ kho tài liệu HTML và các ấn bản sách PDF. Từng câu chữ, thi phẩm, bản khảo cứu và văn kiện lịch sử đều được lập chỉ mục và có thể tra cứu khi ngoại tuyến.
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-black/25 backdrop-blur-xs border border-white/15 rounded-xl p-3">
              <span className="text-[11px] text-rose-200 block font-medium">Tổng Số Văn Kiện</span>
              <span className="text-lg font-bold text-white">{stats.totalDocs} tài liệu</span>
            </div>
            <div className="bg-black/25 backdrop-blur-xs border border-white/15 rounded-xl p-3">
              <span className="text-[11px] text-rose-200 block font-medium">Số Từ Đã Chỉ Mục</span>
              <span className="text-lg font-bold text-amber-300">{stats.totalWords.toLocaleString()} từ</span>
            </div>
            <div className="bg-black/25 backdrop-blur-xs border border-white/15 rounded-xl p-3">
              <span className="text-[11px] text-rose-200 block font-medium">Ấn Bản PDF</span>
              <span className="text-lg font-bold text-sky-300">{stats.pdfCount} ấn bản</span>
            </div>
            <div className="bg-black/25 backdrop-blur-xs border border-white/15 rounded-xl p-3">
              <span className="text-[11px] text-rose-200 block font-medium">Tập Tin HTML</span>
              <span className="text-lg font-bold text-emerald-300">{stats.htmlCount} văn bản</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Search & Filter Control Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200 space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Main Full-Text Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="full-text-search-input"
              type="text"
              placeholder="Nhập từ khóa tìm kiếm (ví dụ: 'Nam Quốc Sơn Hà', 'Truyện Kiều', 'chữ Quốc Ngữ', 'Lý Thường Kiệt')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-300 rounded-xl pl-10 pr-16 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#800020] transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500 hover:text-slate-800 bg-slate-200 hover:bg-slate-300 px-2 py-0.5 rounded-md cursor-pointer"
              >
                Xóa
              </button>
            )}
          </div>

          {/* Sort Control */}
          <div className="flex items-center gap-2 shrink-0">
            <ArrowUpDown className="w-4 h-4 text-slate-400 hidden sm:block" />
            <select
              id="sort-selector"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#800020] cursor-pointer"
            >
              <option value="relevance">Sắp xếp: Độ liên quan</option>
              <option value="newest">Sắp xếp: Mới nhất</option>
              <option value="title">Sắp xếp: Tiêu đề (A-Z)</option>
              <option value="size">Sắp xếp: Kích thước</option>
            </select>

            {isEditor && (
              <button
                id="btn-upload-in-archive"
                onClick={onOpenUpload}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#800020] hover:bg-[#6b001a] text-white text-xs font-semibold shadow-xs transition active:scale-95"
              >
                <FilePlus className="w-4 h-4 text-amber-300" />
                <span>Tải Lên</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills: Format and Categories */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
          {/* Format pills */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium text-[11px] mr-1">Định dạng:</span>
            <button
              onClick={() => setSelectedType('all')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                selectedType === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Tất cả ({documents.length})
            </button>
            <button
              onClick={() => setSelectedType('pdf')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                selectedType === 'pdf'
                  ? 'bg-rose-700 text-white'
                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
              }`}
            >
              PDF ({stats.pdfCount})
            </button>
            <button
              onClick={() => setSelectedType('html')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                selectedType === 'html'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              HTML ({stats.htmlCount})
            </button>
          </div>

          {/* Category Dropdown Filter */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium text-[11px]">Chuyên mục:</span>
            <select
              id="category-filter-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-100 border border-slate-200 text-slate-700 text-xs rounded-lg px-2.5 py-1 font-medium focus:outline-none cursor-pointer"
            >
              <option value="all">Tất cả chuyên mục</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <div>
          {searchQuery ? (
            <span>
              Tìm thấy <strong className="text-[#800020] font-bold">{filteredDocuments.length}</strong> kết quả cho từ khóa &ldquo;{searchQuery}&rdquo;
            </span>
          ) : (
            <span>Hiển thị <strong className="text-slate-800 font-bold">{filteredDocuments.length}</strong> tài liệu trong kho thư viện</span>
          )}
        </div>

        {/* Reload seed archive button */}
        <button
          onClick={onLoadSeedArchives}
          className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-[#800020] transition"
          title="Tải lại kho dữ liệu mẫu của Viện Việt Học"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Tải Lại Kho Mẫu</span>
        </button>
      </div>

      {/* Document List / Grid */}
      {filteredDocuments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDocuments.map(({ doc, matchScore, snippets }) => (
            <div
              key={doc.id}
              onClick={() => onOpenDocument(doc, searchQuery)}
              className="group bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition cursor-pointer hover:border-amber-400 flex flex-col justify-between"
            >
              <div>
                {/* Header Badge */}
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-wider ${
                        doc.fileType === 'pdf'
                          ? 'bg-rose-100 text-rose-700 border border-rose-200'
                          : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {doc.fileType}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                      {doc.category}
                    </span>
                  </div>

                  <span className="text-[11px] text-slate-400 font-medium">
                    {formatFileSize(doc.fileSize)}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-slate-900 group-hover:text-[#800020] transition line-clamp-2 leading-snug mb-2 font-serif">
                  {doc.title}
                </h3>

                {/* Summary */}
                {doc.summary && (
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                    {doc.summary}
                  </p>
                )}

                {/* Snippets with highlighted search terms */}
                {snippets.length > 0 && (
                  <div className="mb-3 p-2.5 rounded-lg bg-amber-50/80 border border-amber-200 text-xs text-slate-800 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-amber-900 block">
                      Trích đoạn tìm thấy trong văn bản:
                    </span>
                    {snippets.map((snip, idx) => (
                      <p key={idx} className="line-clamp-2 italic text-slate-700 leading-snug">
                        &ldquo;{renderHighlightedSnippet(snip.snippet, searchQuery)}&rdquo;
                      </p>
                    ))}
                  </div>
                )}

                {/* Tags */}
                {doc.tags && doc.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {doc.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Footer: Metadata & Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 mt-2">
                <div className="flex items-center gap-2">
                  <span>{doc.pageCount || 1} trang</span>
                  <span>&bull;</span>
                  <span>{(doc.wordCount || 0).toLocaleString()} từ</span>
                </div>

                <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={(e) => handleDownload(doc, e)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
                    title="Tải về tập tin"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>

                  {isAdmin && (
                    <button
                      onClick={() => onDeleteDocument(doc.id)}
                      className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition"
                      title="Xóa tài liệu khỏi kho lưu trữ"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    onClick={() => onOpenDocument(doc, searchQuery)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#800020] hover:bg-[#6b001a] text-white font-semibold text-xs transition"
                  >
                    <span>Xem</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
            <FolderOpen className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            Không tìm thấy tài liệu phù hợp
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Thử tìm với từ khóa khác, tìm không dấu (ví dụ: &ldquo;truyen kieu&rdquo;, &ldquo;lich su&rdquo;) hoặc đặt lại bộ lọc định dạng.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedType('all');
                setSelectedCategory('all');
              }}
              className="px-3.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold"
            >
              Đặt Lại Bộ Lọc
            </button>
            <button
              onClick={onLoadSeedArchives}
              className="px-3.5 py-1.5 rounded-lg bg-amber-100 text-amber-900 text-xs font-semibold hover:bg-amber-200"
            >
              Khôi Phục Kho Dữ Liệu Gốc
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
