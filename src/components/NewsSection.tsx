import React, { useState } from 'react';
import { ArticleItem } from '../types';
import { useAuth } from '../context/AuthContext';
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
  Layers
} from 'lucide-react';

interface NewsSectionProps {
  articles: ArticleItem[];
  onOpenNewArticle: () => void;
  onDeleteArticle: (id: string) => void;
  selectedArticleExternal?: ArticleItem | null;
  onClearSelectedArticleExternal?: () => void;
}

export const NewsSection: React.FC<NewsSectionProps> = ({
  articles,
  onOpenNewArticle,
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

  const filteredArticles = articles.filter((art) => {
    if (selectedCategory !== 'all' && art.category !== selectedCategory) return false;
    return true;
  });

  const calculateReadTime = (text: string) => {
    const words = text.split(/\s+/).length;
    const mins = Math.max(1, Math.ceil(words / 180));
    return `${mins} phút đọc`;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-linear-to-r from-[#800020] via-[#8b1538] to-[#580d23] rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-[#9f2244] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-200 border border-amber-400/30 text-xs font-semibold mb-3">
            <Newspaper className="w-3.5 h-3.5" />
            <span>Sinh Hoạt & Tin Tức Học Thuật</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif tracking-tight text-white mb-2">
            Tin Tức & Thông Báo Viện Việt Học
          </h1>
          <p className="text-rose-100 text-xs sm:text-sm leading-relaxed">
            Cập nhật lịch thuyết trình văn hóa hàng tháng, các công trình khảo cứu mới, hoạt động thư viện và thông tin sinh hoạt của Viện Việt Học tại Westminster, California.
          </p>
        </div>

        {isEditor && (
          <button
            id="btn-new-article-main"
            onClick={onOpenNewArticle}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 text-xs font-bold shadow-md transition self-start md:self-auto shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Đăng Bài Viết / Thông Báo</span>
          </button>
        )}
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-xl font-semibold transition ${
            selectedCategory === 'all'
              ? 'bg-[#800020] text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Tất cả tin bài ({articles.length})
        </button>
        {categories.map((cat) => {
          const count = articles.filter((a) => a.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-medium transition ${
                selectedCategory === cat
                  ? 'bg-[#800020] text-white shadow-xs'
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
          {filteredArticles.map((article) => (
            <article
              key={article.id}
              onClick={() => setInternalSelectedArticle(article)}
              className="group bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition cursor-pointer hover:border-amber-400 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2 text-xs text-slate-500">
                  <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 font-semibold border border-amber-200 text-[11px]">
                    {article.category}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>{calculateReadTime(article.content)}</span>
                  </div>
                </div>

                <h2 className="text-base font-bold text-slate-900 group-hover:text-[#800020] transition line-clamp-2 leading-snug mb-2 font-serif">
                  {article.title}
                </h2>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
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

                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    {isAdmin && (
                      <button
                        onClick={() => onDeleteArticle(article.id)}
                        className="p-1 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition"
                        title="Xóa bài viết"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <span className="text-[#800020] font-semibold text-xs group-hover:underline flex items-center gap-1">
                      <span>Đọc tiếp</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <Newspaper className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">
            Chưa có bài viết nào trong chuyên mục này
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Chọn chuyên mục khác hoặc thêm bài viết mới nếu bạn có quyền biên tập viên.
          </p>
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
            {/* Modal Header */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 font-semibold border border-amber-200 text-xs">
                  {selectedArticle.category}
                </span>
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
                <h1 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 leading-snug mb-3">
                  {selectedArticle.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pb-4 border-b border-slate-100">
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
              <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200/80 text-xs sm:text-sm text-amber-950 font-medium leading-relaxed italic">
                {selectedArticle.excerpt}
              </div>

              {/* Body Text */}
              <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-800 leading-relaxed space-y-4 whitespace-pre-wrap font-sans">
                {selectedArticle.content}
              </div>

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
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 rounded-b-2xl flex justify-end">
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
