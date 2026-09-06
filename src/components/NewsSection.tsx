import React, { useState } from 'react';
import { ArticleItem } from '../types';
import { useAuth } from '../context/AuthContext';
import { ArticleRenderer } from './ArticleRenderer';
import {
  Newspaper,
  PlusCircle,
  Calendar,
  User,
  Clock,
  Trash2,
  BookOpen,
  X,
  Share2,
  Tag,
  Building,
  ArrowRight,
  ExternalLink,
  Layers,
  FileText,
  Edit3,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface NewsSectionProps {
  articles: ArticleItem[];
  onOpenNewArticle: () => void;
  onEditArticle?: (article: ArticleItem) => void;
  onDeleteArticle: (id: string) => void;
  selectedArticleExternal?: ArticleItem | null;
  onClearSelectedArticleExternal?: () => void;
}

export const NewsSection: React.FC<NewsSectionProps> = ({
  articles,
  onOpenNewArticle,
  onEditArticle,
  onDeleteArticle,
  selectedArticleExternal,
  onClearSelectedArticleExternal,
}) => {
  const { user, isEditor, isAdmin } = useAuth();
  const [internalSelectedArticle, setInternalSelectedArticle] = useState<ArticleItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const selectedArticle = selectedArticleExternal || internalSelectedArticle;

  const handleCloseArticle = () => {
    setInternalSelectedArticle(null);
    if (onClearSelectedArticleExternal) {
      onClearSelectedArticleExternal();
    }
  };

  const categories = [
    'Thông báo & Sinh hoạt',
    'Nghiên cứu',
    'Văn hóa & Nghệ thuật',
    'Giáo dục',
    'Thư viện & Sách mới',
  ];

  const publishedArticles = articles.filter((a) => a.published !== false);
  const draftArticles = articles.filter(
    (a) => a.published === false && (isAdmin || a.authorId === user?.uid || isEditor)
  );

  const filteredArticles = articles.filter((art) => {
    // Non-editors cannot see drafts
    if (!isEditor && art.published === false) return false;

    if (selectedCategory === 'drafts') {
      return art.published === false;
    }

    if (selectedCategory === 'all') {
      // By default show published in 'all', unless user explicitly chooses drafts or no filter
      return art.published !== false;
    }

    if (art.category !== selectedCategory) return false;
    // In category views, regular users see published; editors see both published and category drafts
    return isEditor ? true : art.published !== false;
  });

  const calculateReadTime = (text: string) => {
    const words = text.split(/\s+/).length;
    const mins = Math.max(1, Math.ceil(words / 180));
    return `${mins} phút đọc`;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden bg-linear-to-r from-[#0b5394] via-[#094277] to-[#072d54] rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-[#1b6ab3] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute inset-0 bg-[url('/viethoc-header-bg.png')] bg-cover bg-center opacity-30 mix-blend-screen pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-200 border border-amber-400/30 text-xs font-semibold mb-3">
            <Newspaper className="w-3.5 h-3.5" />
            <span>Sinh Hoạt & Tin Tức Học Thuật</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif tracking-tight text-white mb-2">
            Tin Tức & Thông Báo Viện Việt Học
          </h1>
          <p className="text-amber-100 text-xs sm:text-sm leading-relaxed">
            Cập nhật lịch thuyết trình văn hóa hàng tháng, các công trình khảo cứu mới, hoạt động thư viện và thông tin sinh hoạt của Viện Việt Học tại Westminster, California.
          </p>
        </div>

        {isEditor && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 self-start md:self-auto shrink-0">
            <button
              id="btn-new-article-main"
              onClick={onOpenNewArticle}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 text-xs font-bold shadow-md transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Đăng Bài Viết Mới</span>
            </button>
          </div>
        )}
      </div>

      {/* Editor Working Draft Alert Bar */}
      {isEditor && draftArticles.length > 0 && selectedCategory !== 'drafts' && (
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-950 shadow-2xs">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              Quý vị có <strong>{draftArticles.length}</strong> bản nháp đang lưu chưa xuất bản.
            </span>
          </div>
          <button
            onClick={() => setSelectedCategory('drafts')}
            className="px-3 py-1 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition shrink-0"
          >
            Xem Bản Nháp
          </button>
        </div>
      )}

      {/* Category & Status Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-xl font-semibold transition ${
            selectedCategory === 'all'
              ? 'bg-[#0b5394] text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Tất cả đã xuất bản ({publishedArticles.length})
        </button>

        {isEditor && (
          <button
            onClick={() => setSelectedCategory('drafts')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition ${
              selectedCategory === 'drafts'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-300'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Bản Nháp Làm Việc</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-200 text-amber-950 font-bold">
              {draftArticles.length}
            </span>
          </button>
        )}

        {categories.map((cat) => {
          const count = articles.filter(
            (a) => a.category === cat && (isEditor || a.published !== false)
          ).length;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-medium transition ${
                selectedCategory === cat
                  ? 'bg-[#0b5394] text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Articles Grid */}
      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => {
            const isDraft = article.published === false;
            return (
              <article
                key={article.id}
                onClick={() => setInternalSelectedArticle(article)}
                className={`group rounded-2xl p-5 border shadow-xs hover:shadow-md transition cursor-pointer flex flex-col justify-between ${
                  isDraft
                    ? 'bg-amber-50/40 border-amber-300 hover:border-amber-500'
                    : 'bg-white border-slate-200/90 hover:border-amber-400'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 font-semibold border border-amber-200 text-[11px]">
                        {article.category}
                      </span>
                      {isDraft && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-950 font-bold border border-amber-400 text-[10px]">
                          <FileText className="w-2.5 h-2.5" />
                          Bản Nháp
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span>{calculateReadTime(article.content)}</span>
                    </div>
                  </div>

                  <h2 className="vn-article-title text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#0b5394] transition line-clamp-2 leading-snug mb-2 font-serif">
                    {article.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed mb-4 font-sans">
                    {article.excerpt}
                  </p>
                </div>

                <div>
                  {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {article.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{new Date(article.createdAt).toLocaleDateString('vi-VN')}</span>
                    </div>

                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      {isEditor && onEditArticle && (
                        <button
                          onClick={() => onEditArticle(article)}
                          className="p-1.5 rounded-lg text-amber-700 hover:text-amber-950 hover:bg-amber-100 transition"
                          title={isDraft ? 'Hoàn thiện bản nháp & Xuất bản' : 'Chỉnh sửa bài viết'}
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {isAdmin && (
                        <button
                          onClick={() => onDeleteArticle(article.id)}
                          className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition"
                          title="Xóa bài viết"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <span className="text-[#0b5394] font-semibold text-xs group-hover:underline flex items-center gap-1 pl-1">
                        <span>{isDraft ? 'Xem nháp' : 'Đọc tiếp'}</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <Newspaper className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">
            {selectedCategory === 'drafts'
              ? 'Chưa có bản nháp nào đang lưu'
              : 'Chưa có bài viết nào trong chuyên mục này'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {selectedCategory === 'drafts'
              ? 'Quý vị có thể bắt đầu soạn thảo bài viết mới và chọn "Lưu Bản Nháp" bất kỳ lúc nào.'
              : 'Chọn chuyên mục khác hoặc thêm bài viết mới nếu bạn có quyền biên tập viên.'}
          </p>
          {isEditor && selectedCategory === 'drafts' && (
            <button
              onClick={onOpenNewArticle}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0b5394] text-white text-xs font-semibold shadow-xs hover:bg-[#084175] transition"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Bắt Đầu Soạn Bài Mới</span>
            </button>
          )}
        </div>
      )}

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
          onClick={handleCloseArticle}
        >
          <div
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Draft Notice Banner if this is a draft */}
            {selectedArticle.published === false && (
              <div className="bg-amber-50 border-b border-amber-300 px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs text-amber-950">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>
                    <strong>Bản nháp làm việc (Chưa xuất bản):</strong> Chỉ Ban Biên Tập & Quản Trị Viên mới xem được nội dung này.
                  </span>
                </div>
                {isEditor && onEditArticle && (
                  <button
                    onClick={() => {
                      handleCloseArticle();
                      onEditArticle(selectedArticle);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition shrink-0"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Tiếp Tục Soạn & Xuất Bản</span>
                  </button>
                )}
              </div>
            )}

            {/* Modal Header */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between z-10">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 font-semibold border border-amber-200 text-xs">
                  {selectedArticle.category}
                </span>
                {selectedArticle.published === false && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-950 font-bold border border-amber-300 text-[10px]">
                    Bản Nháp
                  </span>
                )}
                <span className="text-xs text-slate-400">&bull;</span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {calculateReadTime(selectedArticle.content)}
                </span>
              </div>

              <button
                onClick={handleCloseArticle}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <h1 className="vn-article-title text-xl sm:text-2xl lg:text-3xl font-bold font-serif text-slate-900 leading-snug mb-3">
                  {selectedArticle.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pb-4 border-b border-slate-100 font-sans">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-medium text-slate-700">{selectedArticle.authorName}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{new Date(selectedArticle.createdAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>
              </div>

              {/* Lead Excerpt */}
              <div className="vn-article-lead p-4 sm:p-5 bg-amber-50/70 rounded-xl border border-amber-200/90 text-sm sm:text-base text-amber-950 font-serif italic leading-relaxed shadow-2xs">
                {selectedArticle.excerpt}
              </div>

              {/* Body Text using ArticleRenderer */}
              <ArticleRenderer content={selectedArticle.content} />

              {/* Tags */}
              {selectedArticle.tags && selectedArticle.tags.length > 0 && (
                <div className="pt-4 border-t border-slate-100 flex items-center gap-2 flex-wrap text-xs">
                  <Tag className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-500">Từ khóa:</span>
                  {selectedArticle.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 rounded-b-2xl flex items-center justify-between">
              {isEditor && onEditArticle ? (
                <button
                  onClick={() => {
                    handleCloseArticle();
                    onEditArticle(selectedArticle);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 text-xs font-semibold transition"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>
                    {selectedArticle.published === false ? 'Chỉnh Sửa & Xuất Bản' : 'Sửa Bài Viết'}
                  </span>
                </button>
              ) : (
                <div />
              )}

              <button
                onClick={handleCloseArticle}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
