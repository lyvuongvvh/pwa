import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ArticleItem } from '../types';
import { extractSearchTokens } from '../utils/fileParser';
import { X, PlusCircle, AlertCircle, Loader2, Newspaper } from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

interface ArticleEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onArticleCreated: (article: ArticleItem) => void;
}

const CATEGORIES = [
  'Thông báo & Sinh hoạt',
  'Nghiên cứu',
  'Văn hóa & Nghệ thuật',
  'Giáo dục',
  'Thư viện & Sách mới',
];

export const ArticleEditorModal: React.FC<ArticleEditorModalProps> = ({
  isOpen,
  onClose,
  onArticleCreated,
}) => {
  const { user, userProfile, isEditor } = useAuth();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Thông báo & Sinh hoạt');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['Viện Việt Học']);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim()) && tags.length < 10) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Vui lòng nhập tiêu đề và nội dung bài viết.');
      return;
    }

    if (!isEditor) {
      setError('Chỉ tài khoản có quyền Biên tập viên hoặc Quản trị viên mới được đăng bài viết.');
      return;
    }

    setSaving(true);
    setError(null);

    const articleId = `art-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const autoExcerpt =
      excerpt.trim() ||
      content.slice(0, 180).trim() + (content.length > 180 ? '...' : '');

    const newArticle: ArticleItem = {
      id: articleId,
      title: title.trim(),
      content: content.trim(),
      excerpt: autoExcerpt,
      category,
      authorId: user?.uid || 'anonymous',
      authorEmail: user?.email || 'bien-tap@viethoc.com',
      authorName: userProfile?.displayName || user?.displayName || 'Biên Tập Viên Viện Việt Học',
      published: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      tags,
    };

    try {
      // Sync with Firestore if active
      try {
        await setDoc(doc(db, 'articles', articleId), newArticle);
      } catch (firestoreErr) {
        console.warn('Firestore offline fallback for article:', firestoreErr);
      }

      onArticleCreated(newArticle);
      onClose();
    } catch (err: any) {
      console.error('Error publishing article:', err);
      setError(err.message || 'Lỗi khi xuất bản bài viết.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      id="article-editor-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto"
    >
      <div
        id="article-editor-container"
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#0f2b48] text-white border-b border-sky-950">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-[#0b5394] to-[#072d54] flex items-center justify-center">
              <Newspaper className="w-4 h-4 text-amber-200" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-serif">
                Đăng Tin Tức & Bài Viết Mới
              </h2>
              <p className="text-xs text-sky-200">
                Thông báo sinh hoạt, sự kiện học thuật hoặc khảo cứu văn hóa
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-700 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                Tiêu Đề Bài Viết / Thông Báo
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ví dụ: Thông Báo Buổi Thuyết Trình Học Thuật Thứ Bảy"
                required
                className="w-full text-xs bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#0b5394]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">Chuyên Mục</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#0b5394] cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-1">
              Đoạn Văn Mở Đầu / Tóm Lược Ngắn
            </label>
            <textarea
              rows={2}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Đoạn tóm tắt hiển thị trên trang chủ và danh sách tin tức..."
              className="w-full text-xs bg-white border border-stone-300 rounded-lg p-3 text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#0b5394] leading-relaxed"
            />
          </div>

          {/* Full Content */}
          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-1">
              Nội Dung Bài Viết Đầy Đủ
            </label>
            <textarea
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nhập toàn văn thông báo hoặc bài nghiên cứu..."
              required
              className="w-full text-xs font-mono bg-white border border-stone-300 rounded-lg p-3 text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#0b5394] leading-relaxed"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-1">Từ Khóa & Chủ Đề</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Thêm từ khóa (ví dụ: Thuyết Trình, Westminster, Ca Trù)"
                className="flex-1 text-xs bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#0b5394]"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-xs font-semibold text-stone-700 transition cursor-pointer"
              >
                Thêm
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200"
                  >
                    #{t}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(t)}
                      className="text-amber-500 hover:text-amber-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Footer Controls */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-100 rounded-lg transition"
            >
              Hủy Bỏ
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-[#0b5394] hover:bg-[#084175] disabled:opacity-50 rounded-lg shadow-sm transition active:scale-95"
            >
              {saving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Đang Xuất Bản...
                </>
              ) : (
                <>
                  <PlusCircle className="w-3.5 h-3.5 text-amber-300" />
                  Xuất Bản Bài Viết
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
