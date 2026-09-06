import React, { useState } from 'react';
import { DocumentItem, ArticleItem } from '../types';
import { useAuth } from '../context/AuthContext';
import { normalizeVietnameseText } from '../utils/vietnameseTypography';
import {
  Search,
  BookOpen,
  FileText,
  Newspaper,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  Layers,
  Download,
  ExternalLink,
  MapPin,
  Mail,
  Building,
  GraduationCap,
  History,
  Languages,
  Palette,
  ShieldCheck,
  CheckCircle2,
  FileCode
} from 'lucide-react';

interface FrontPageProps {
  documents: DocumentItem[];
  articles: ArticleItem[];
  onNavigateTab: (tab: 'home' | 'documents' | 'articles' | 'about') => void;
  onOpenDocument: (doc: DocumentItem, highlightTerm?: string) => void;
  onOpenUpload: () => void;
  onOpenNewArticle: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onSelectArticle: (article: ArticleItem) => void;
}

export const FrontPage: React.FC<FrontPageProps> = ({
  documents,
  articles,
  onNavigateTab,
  onOpenDocument,
  onOpenUpload,
  onOpenNewArticle,
  searchQuery,
  setSearchQuery,
  onSelectArticle,
}) => {
  const { isEditor } = useAuth();
  const [localSearch, setLocalSearch] = useState('');

  const handleExecuteSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim()) {
      setSearchQuery(localSearch.trim());
      onNavigateTab('documents');
    }
  };

  const handleQuickKeyword = (kw: string) => {
    setSearchQuery(kw);
    onNavigateTab('documents');
  };

  const quickKeywords = [
    'Nam Quốc Sơn Hà',
    'Truyện Kiều',
    'Chữ Quốc Ngữ',
    'Trần Trọng Kim',
    'Lịch sử',
    'Văn hóa dân gian',
  ];

  const totalWords = documents.reduce((acc, d) => acc + (d.wordCount || 0), 0);
  const pdfCount = documents.filter((d) => d.fileType === 'pdf').length;
  const htmlCount = documents.filter((d) => d.fileType === 'html').length;

  return (
    <div className="space-y-10 pb-12">
      {/* 1. Viện Việt Học Masthead & Cultural Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-linear-to-b from-[#0b5394] via-[#094277] to-[#072d54] text-white shadow-xl border border-[#1b6ab3]">
        {/* Authentic viethoc.com banner motif */}
        <div className="absolute inset-0 bg-[url('/viethoc-header-bg.png')] bg-cover bg-center opacity-30 mix-blend-screen pointer-events-none" />
        {/* Subtle decorative heritage patterns */}
        <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-amber-400/15 blur-3xl pointer-events-none" />
        <div className="absolute left-1/4 -top-20 w-72 h-72 rounded-full bg-sky-400/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 px-6 py-10 sm:px-10 sm:py-14 max-w-5xl mx-auto text-center">
          {/* Official Emblem Logo from viethoc.com */}
          <div className="flex justify-center mb-6">
            <div className="p-2 sm:p-3 rounded-2xl bg-white/95 backdrop-blur-xs border-2 border-amber-400/50 shadow-2xl inline-flex items-center justify-center">
              <img
                src="/viethoc-logo.jpg"
                alt="Viện Việt Học - Institute of Vietnamese Studies"
                className="h-16 sm:h-20 w-auto object-contain"
              />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/20 text-amber-200 border border-amber-400/40 text-xs font-semibold uppercase tracking-wider mb-4">
            <Building className="w-3.5 h-3.5 text-amber-300" />
            <span>Thành lập ngày 26 tháng 2 năm 2000 &bull; Westminster, California</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-3 font-sans">
            VIỆN VIỆT HỌC
          </h1>
          <p className="text-base sm:text-xl font-medium text-amber-100 tracking-wide uppercase mb-3">
            INSTITUTE OF VIETNAMESE STUDIES
          </p>
          <div className="w-24 h-0.5 bg-amber-400 mx-auto my-3" />
          <p className="text-sm sm:text-base text-amber-100 max-w-2xl mx-auto leading-relaxed italic mb-8">
            &ldquo;Bảo tồn và phát huy di sản văn hóa, tư tưởng, ngôn ngữ và lịch sử dân tộc Việt Nam&rdquo;
          </p>

          {/* Prominent Full-Text Search Box */}
          <div className="max-w-2xl mx-auto bg-white/95 backdrop-blur-md rounded-2xl p-2 sm:p-3 shadow-2xl border border-white/20 text-slate-800">
            <form onSubmit={handleExecuteSearch} className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="frontpage-hero-search"
                  type="text"
                  placeholder="Tìm kiếm toàn văn trong kho tài liệu PDF & HTML..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className="w-full bg-transparent pl-11 pr-4 py-2.5 text-sm sm:text-base text-slate-900 placeholder-slate-400 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                id="btn-frontpage-search-submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0b5394] hover:bg-[#084175] text-white text-xs sm:text-sm font-semibold transition active:scale-95 shadow-md"
              >
                <Search className="w-4 h-4" />
                <span>Tìm Kiếm</span>
              </button>
            </form>

            {/* Suggested quick keywords */}
            <div className="flex items-center flex-wrap gap-1.5 pt-2.5 px-2 border-t border-slate-200/80 text-xs">
              <span className="text-slate-500 font-medium">Gợi ý tra cứu:</span>
              {quickKeywords.map((kw) => (
                <button
                  key={kw}
                  type="button"
                  onClick={() => handleQuickKeyword(kw)}
                  className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 font-medium transition cursor-pointer"
                >
                  {kw}
                </button>
              ))}
            </div>
          </div>

          {/* Metrics summary bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto mt-8 text-left">
            <div className="bg-black/25 backdrop-blur-xs border border-white/15 rounded-xl p-3">
              <span className="text-[11px] text-amber-200 block">Tài Liệu Số Hóa</span>
              <span className="text-xl font-bold text-white">{documents.length} văn kiện</span>
            </div>
            <div className="bg-black/25 backdrop-blur-xs border border-white/15 rounded-xl p-3">
              <span className="text-[11px] text-amber-200 block">Từ Khóa Toàn Văn</span>
              <span className="text-xl font-bold text-amber-300">{totalWords.toLocaleString()} từ</span>
            </div>
            <div className="bg-black/25 backdrop-blur-xs border border-white/15 rounded-xl p-3">
              <span className="text-[11px] text-amber-200 block">Tài Liệu PDF & HTML</span>
              <span className="text-xl font-bold text-sky-300">{pdfCount} PDF / {htmlCount} HTML</span>
            </div>
            <div className="bg-black/25 backdrop-blur-xs border border-white/15 rounded-xl p-3">
              <span className="text-[11px] text-amber-200 block">Khả Năng Ngoại Tuyến</span>
              <span className="text-xl font-bold text-emerald-300">PWA Offline</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Content Columns: News & Announcements + Featured Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Sinh Hoạt & Tin Tức Mới Nhất (7 Cols) */}
        <section className="lg:col-span-7 space-y-5">
          <div className="flex items-center justify-between border-b-2 border-[#0b5394] pb-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#0b5394] text-white flex items-center justify-center shadow-xs">
                <Newspaper className="w-4 h-4 text-amber-200" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                  Sinh Hoạt & Thông Báo Mới Nhất
                </h2>
                <p className="text-xs text-slate-500">Tin tức học thuật, thuyết trình văn hóa và hoạt động của Viện</p>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('articles')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#0b5394] hover:text-[#062c52] hover:underline"
            >
              <span>Xem tất cả</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {articles
              .filter((a) => a.published !== false)
              .slice(0, 3)
              .map((article) => (
              <article
                key={article.id}
                onClick={() => onSelectArticle(article)}
                className="group bg-white rounded-xl p-4 sm:p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition cursor-pointer hover:border-amber-300"
              >
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                  <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 font-semibold border border-amber-200 text-[11px]">
                    {article.category}
                  </span>
                  <span>&bull;</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>{new Date(article.createdAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <span>&bull;</span>
                  <span className="text-slate-600 font-medium truncate max-w-[140px]">
                    {article.authorName}
                  </span>
                </div>

                <h3 className="vn-article-title text-base sm:text-lg font-bold font-sans text-slate-900 group-hover:text-[#0b5394] transition line-clamp-2 mb-2 leading-snug">
                  {normalizeVietnameseText(article.title)}
                </h3>

                <p className="text-xs sm:text-sm font-sans text-slate-600 line-clamp-2 leading-relaxed mb-3">
                  {normalizeVietnameseText(article.excerpt)}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-[#0b5394] font-semibold group-hover:underline">
                  <span>Đọc tiếp chi tiết</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </article>
            ))}
          </div>

          {/* Quick Action for Editors */}
          {isEditor && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-amber-900 block">Quyền Biên Tập Viên</span>
                <span className="text-xs text-amber-700">
                  Đăng thông báo sinh hoạt hoặc bài nghiên cứu mới vào cổng Viện Việt Học.
                  {articles.filter((a) => a.published === false).length > 0 && (
                    <span className="ml-1 font-semibold text-amber-900">
                      (Có {articles.filter((a) => a.published === false).length} bản nháp đang lưu)
                    </span>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {articles.filter((a) => a.published === false).length > 0 && (
                  <button
                    onClick={() => onNavigateTab('articles')}
                    className="px-3 py-1.5 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-950 text-xs font-semibold transition"
                  >
                    Xem Bản Nháp ({articles.filter((a) => a.published === false).length})
                  </button>
                )}
                <button
                  onClick={onOpenNewArticle}
                  className="shrink-0 px-3 py-1.5 rounded-lg bg-[#0b5394] hover:bg-[#084175] text-white text-xs font-semibold shadow-xs"
                >
                  Đăng Bài Viết
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Right Column: Kho Tài Liệu Tiêu Biểu & Sách Quý (5 Cols) */}
        <section className="lg:col-span-5 space-y-5">
          <div className="flex items-center justify-between border-b-2 border-amber-600 pb-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center shadow-xs">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                  Tài Liệu Số Hóa Tiêu Biểu
                </h2>
                <p className="text-xs text-slate-500">Bản thảo, sách khảo cứu và văn bản lịch sử</p>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('documents')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-900 hover:underline"
            >
              <span>Kho tài liệu</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3.5">
            {documents.slice(0, 4).map((doc) => (
              <div
                key={doc.id}
                onClick={() => onOpenDocument(doc)}
                className="group bg-white rounded-xl p-3.5 border border-slate-200/90 shadow-xs hover:shadow-md transition cursor-pointer hover:border-amber-400"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      doc.fileType === 'pdf'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {doc.fileType === 'pdf' ? (
                      <FileText className="w-5 h-5" />
                    ) : (
                      <FileCode className="w-5 h-5" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-sm bg-slate-100 text-slate-700 border border-slate-200">
                        {doc.fileType}
                      </span>
                      <span className="text-[11px] font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 truncate max-w-[130px]">
                        {doc.category}
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#0b5394] transition line-clamp-2 leading-snug">
                      {doc.title}
                    </h4>

                    <div className="flex items-center gap-2.5 text-[11px] text-slate-500 mt-1.5">
                      <span>{doc.pageCount || 1} trang</span>
                      <span>&bull;</span>
                      <span>{(doc.wordCount || 0).toLocaleString()} từ</span>
                      <span>&bull;</span>
                      <span className="text-[#0b5394] font-semibold group-hover:underline">Đọc toàn văn</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 text-center">
            <p className="text-xs text-slate-600 mb-2.5">
              Bạn có văn kiện lịch sử hoặc tài liệu nghiên cứu muốn số hóa?
            </p>
            <button
              onClick={() => {
                if (isEditor) {
                  onOpenUpload();
                } else {
                  onNavigateTab('documents');
                }
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0b5394] hover:bg-[#084175] text-white text-xs font-semibold transition"
            >
              <span>{isEditor ? 'Tải Lên Văn Kiện (PDF/HTML)' : 'Khám Phá Toàn Bộ Kho Thư Viện'}</span>
            </button>
          </div>
        </section>
      </div>

      {/* 3. Academic & Thematic Pillars (Các Chuyên Mục Nghiên Cứu Viện Việt Học) */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-sans mb-2">
            Các Chuyên Mục Nghiên Cứu & Học Thuật
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Hệ thống phân loại chuyên sâu hỗ trợ các nhà nghiên cứu, sinh viên và độc giả tiếp cận đúng nguồn sử liệu
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            onClick={() => handleQuickKeyword('Lịch sử')}
            className="p-4 rounded-xl bg-slate-50 hover:bg-amber-50/70 border border-slate-200 hover:border-amber-300 transition cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <History className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#0b5394] mb-1">
              Lịch Sử & Cổ Sử Dân Tộc
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Các triều đại Đinh, Lê, Lý, Trần, Lê, Nguyễn; các cuộc kháng chiến chống ngoại xâm và các bản văn chính sử.
            </p>
          </div>

          <div
            onClick={() => handleQuickKeyword('Văn học')}
            className="p-4 rounded-xl bg-slate-50 hover:bg-sky-50/70 border border-slate-200 hover:border-sky-300 transition cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#0b5394] mb-1">
              Văn Học & Nghệ Thuật
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Thi ca cổ điển, Truyện Kiều Nguyễn Du, thơ ca thời kháng chiến, ca trù, nhã nhạc và mỹ thuật dân tộc.
            </p>
          </div>

          <div
            onClick={() => handleQuickKeyword('Ngôn ngữ')}
            className="p-4 rounded-xl bg-slate-50 hover:bg-indigo-50/70 border border-slate-200 hover:border-indigo-300 transition cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Languages className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#0b5394] mb-1">
              Ngôn Ngữ & Chữ Viết
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Chữ Nôm, nguồn gốc Chữ Quốc Ngữ, tự điển Việt-Bồ-La 1651, ngữ pháp và sự tiến hóa của tiếng Việt.
            </p>
          </div>

          <div
            onClick={() => handleQuickKeyword('Triết học')}
            className="p-4 rounded-xl bg-slate-50 hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-300 transition cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#0b5394] mb-1">
              Triết Học & Tư Tưởng
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tinh thần Tam giáo đồng nguyên (Phật - Lão - Nho), nhân sinh quan và đạo lý làm người của dân tộc Việt.
            </p>
          </div>

          <div
            onClick={() => handleQuickKeyword('Tư liệu')}
            className="p-4 rounded-xl bg-slate-50 hover:bg-amber-50/70 border border-slate-200 hover:border-amber-300 transition cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#0b5394] mb-1">
              Tư Liệu & Bản Thảo Cổ
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Văn kiện bang giao, sắc phong, hương ước làng xã, di cảo của các danh nhân và văn kiện lịch sử quý.
            </p>
          </div>

          <div
            onClick={() => handleQuickKeyword('Viện Việt Học')}
            className="p-4 rounded-xl bg-slate-50 hover:bg-sky-50/70 border border-slate-200 hover:border-sky-300 transition cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Building className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#0b5394] mb-1">
              Thư Viện & Kỷ Yếu Viện
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Kỷ yếu sinh hoạt hơn 25 năm của Viện Việt Học tại Westminster, các bài tham luận hội thảo quốc tế.
            </p>
          </div>
        </div>
      </section>

      {/* 4. About Viện Việt Học & Westminster Center */}
      <section className="bg-linear-to-r from-amber-50 to-orange-50 rounded-2xl p-6 sm:p-8 border border-amber-200 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
              Trụ Sở & Thư Viện Nghiên Cứu
            </span>
            <h3 className="text-xl font-bold text-slate-900 font-sans">
              Viện Việt Học & Thư Viện Hơn 8.000 Đầu Sách
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              Tọa lạc tại trung tâm Little Saigon (Westminster, California), Viện duy trì thư viện nghiên cứu mở cửa đón học giả, sinh viên và đồng hương đến đọc, mượn sách và tra cứu các tư liệu văn hóa Việt Nam.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-2">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-rose-600 shrink-0" />
                <span>15355 Brookhurst St # 222, Westminster, CA 92683, USA</span>
              </div>
              <div className="flex items-center gap-1">
                <Mail className="w-4 h-4 text-amber-700 shrink-0" />
                <span>info@viethoc.org &bull; lyvuong@viethoc.com</span>
              </div>
            </div>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={() => onNavigateTab('about')}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold border border-slate-300 shadow-xs transition"
            >
              Xem Giới Thiệu Chi Tiết
            </button>
            <button
              onClick={() => onNavigateTab('documents')}
              className="px-4 py-2.5 rounded-xl bg-[#0b5394] hover:bg-[#084175] text-white text-xs font-semibold shadow-xs transition"
            >
              Vào Kho Tài Liệu
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
