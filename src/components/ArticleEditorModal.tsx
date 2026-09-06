import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ArticleItem } from '../types';
import { extractSearchTokens } from '../utils/fileParser';
import { ArticleRenderer } from './ArticleRenderer';
import {
  X,
  PlusCircle,
  AlertCircle,
  Loader2,
  Newspaper,
  FileText,
  CheckCircle2,
  RotateCcw,
  Clock,
  Save,
  ArchiveRestore,
  Eye,
  Edit3
} from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

interface ArticleEditorModalProps {
  isOpen: boolean;
  initialArticle?: ArticleItem | null;
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

const AUTOSAVE_STORAGE_KEY = 'viethoc_article_draft_autosave';

export const ArticleEditorModal: React.FC<ArticleEditorModalProps> = ({
  isOpen,
  initialArticle,
  onClose,
  onArticleCreated,
}) => {
  const { user, userProfile, isEditor } = useAuth();

  const [title, setTitle] = useState(initialArticle?.title || '');
  const [category, setCategory] = useState(initialArticle?.category || 'Thông báo & Sinh hoạt');
  const [excerpt, setExcerpt] = useState(initialArticle?.excerpt || '');
  const [content, setContent] = useState(initialArticle?.content || '');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(initialArticle?.tags || ['Viện Việt Học']);

  const [isCurrentlyDraft, setIsCurrentlyDraft] = useState<boolean>(
    initialArticle ? initialArticle.published === false : true
  );

  const [savingAction, setSavingAction] = useState<'draft' | 'publish' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasAutosavePrompt, setHasAutosavePrompt] = useState(false);
  const [autosaveTime, setAutosaveTime] = useState<string | null>(null);
  const [editorTab, setEditorTab] = useState<'edit' | 'preview'>('edit');

  // Sync state if initialArticle changes
  useEffect(() => {
    if (initialArticle) {
      setTitle(initialArticle.title || '');
      setCategory(initialArticle.category || 'Thông báo & Sinh hoạt');
      setExcerpt(initialArticle.excerpt || '');
      setContent(initialArticle.content || '');
      setTags(initialArticle.tags || ['Viện Việt Học']);
      setIsCurrentlyDraft(initialArticle.published === false);
      setHasAutosavePrompt(false);
    } else {
      // Check if there is an unsaved working draft in localStorage
      try {
        const raw = localStorage.getItem(AUTOSAVE_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && (parsed.title || parsed.content)) {
            setHasAutosavePrompt(true);
            setAutosaveTime(parsed.savedAt ? new Date(parsed.savedAt).toLocaleTimeString('vi-VN') : null);
          }
        }
      } catch {}
    }
  }, [initialArticle, isOpen]);

  // Autosave locally while editing if it's a new article and has content
  useEffect(() => {
    if (initialArticle || !isOpen) return;

    if (title.trim() || content.trim()) {
      const timer = setTimeout(() => {
        try {
          localStorage.setItem(
            AUTOSAVE_STORAGE_KEY,
            JSON.stringify({
              title,
              category,
              excerpt,
              content,
              tags,
              savedAt: Date.now(),
            })
          );
        } catch {}
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [title, category, excerpt, content, tags, initialArticle, isOpen]);

  if (!isOpen) return null;

  const handleRestoreAutosave = () => {
    try {
      const raw = localStorage.getItem(AUTOSAVE_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.title) setTitle(parsed.title);
        if (parsed.category) setCategory(parsed.category);
        if (parsed.excerpt) setExcerpt(parsed.excerpt);
        if (parsed.content) setContent(parsed.content);
        if (Array.isArray(parsed.tags)) setTags(parsed.tags);
      }
    } catch {}
    setHasAutosavePrompt(false);
  };

  const handleDiscardAutosave = () => {
    try {
      localStorage.removeItem(AUTOSAVE_STORAGE_KEY);
    } catch {}
    setHasAutosavePrompt(false);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim()) && tags.length < 10) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSaveArticle = async (asDraft: boolean) => {
    if (!isEditor) {
      setError('Chỉ tài khoản có quyền Biên tập viên hoặc Quản trị viên mới được thao tác.');
      return;
    }

    if (asDraft) {
      if (!title.trim()) {
        setError('Vui lòng nhập ít nhất Tiêu đề bài viết để lưu bản nháp.');
        return;
      }
    } else {
      if (!title.trim() || !content.trim()) {
        setError('Vui lòng nhập đầy đủ Tiêu đề và Nội dung bài viết trước khi xuất bản.');
        return;
      }
    }

    setSavingAction(asDraft ? 'draft' : 'publish');
    setError(null);

    const articleId = initialArticle?.id || `art-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const effectiveContent = content.trim() || (asDraft ? '(Bản nháp đang soạn thảo...)' : '');
    const autoExcerpt =
      excerpt.trim() ||
      effectiveContent.slice(0, 180).trim() + (effectiveContent.length > 180 ? '...' : '');

    const savedArticle: ArticleItem = {
      id: articleId,
      title: title.trim(),
      content: effectiveContent,
      excerpt: autoExcerpt,
      category,
      authorId: initialArticle?.authorId || user?.uid || 'anonymous',
      authorEmail: initialArticle?.authorEmail || user?.email || 'bien-tap@viethoc.com',
      authorName:
        initialArticle?.authorName ||
        userProfile?.displayName ||
        user?.displayName ||
        'Biên Tập Viên Viện Việt Học',
      published: !asDraft,
      createdAt: initialArticle?.createdAt || Date.now(),
      updatedAt: Date.now(),
      tags,
      searchTokens: extractSearchTokens(title + ' ' + autoExcerpt + ' ' + effectiveContent),
    };

    try {
      // Sync with Firestore if active
      try {
        await setDoc(doc(db, 'articles', articleId), savedArticle);
      } catch (firestoreErr) {
        console.warn('Firestore offline fallback for article:', firestoreErr);
      }

      // Clear local autosave buffer
      try {
        localStorage.removeItem(AUTOSAVE_STORAGE_KEY);
      } catch {}

      onArticleCreated(savedArticle);
      onClose();
    } catch (err: any) {
      console.error('Error saving article:', err);
      setError(err.message || 'Lỗi khi lưu bài viết.');
    } finally {
      setSavingAction(null);
    }
  };

  return (
    <div
      id="article-editor-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto"
    >
      <div
        id="article-editor-container"
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#0f2b48] text-white border-b border-sky-950">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-[#0b5394] to-[#072d54] flex items-center justify-center shadow-xs">
              <Newspaper className="w-4 h-4 text-amber-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white font-serif">
                  {initialArticle
                    ? initialArticle.published === false
                      ? 'Hoàn Thiện Bản Nháp'
                      : 'Chỉnh Sửa Bài Viết'
                    : 'Soạn Thảo Bài Viết & Thông Báo'}
                </h2>
                {initialArticle && initialArticle.published === false && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40">
                    Bản Nháp
                  </span>
                )}
                {initialArticle && initialArticle.published !== false && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                    Đã Xuất Bản
                  </span>
                )}
              </div>
              <p className="text-xs text-sky-200">
                Lưu bản nháp làm việc hoặc xuất bản thông báo, khảo cứu vào cổng Viện Việt Học
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-300 hover:text-white hover:bg-stone-800 transition"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Autosave Recovery Banner */}
        {hasAutosavePrompt && !initialArticle && (
          <div className="px-6 py-2.5 bg-amber-50 border-b border-amber-200 text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <ArchiveRestore className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                Tìm thấy bản nháp đang soạn dở lúc <strong>{autosaveTime || 'gần đây'}</strong>.
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleRestoreAutosave}
                className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-md shadow-xs transition"
              >
                Khôi phục
              </button>
              <button
                type="button"
                onClick={handleDiscardAutosave}
                className="px-2 py-1 text-amber-800 hover:text-stone-900 transition"
              >
                Bỏ qua
              </button>
            </div>
          </div>
        )}

        {/* Form Body */}
        <div className="p-6 space-y-4 max-h-[calc(85vh-130px)] overflow-y-auto">
          {error && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-700 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                Tiêu Đề Bài Viết / Thông Báo <span className="text-amber-600">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ví dụ: Thông Báo Buổi Thuyết Trình Học Thuật Thứ Bảy"
                className="w-full text-sm sm:text-base font-serif font-bold bg-white border border-stone-300 rounded-lg px-3.5 py-2 text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#0b5394]"
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
              Đoạn Văn Mở Đầu / Tóm Lược Ngắn <span className="text-stone-400 font-normal">(Hiển thị trên thẻ tóm tắt)</span>
            </label>
            <textarea
              rows={2}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Đoạn mở đầu ngắn gọn để độc giả nắm bắt nhanh nội dung..."
              className="w-full text-xs sm:text-sm font-sans bg-white border border-stone-300 rounded-lg p-3 text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#0b5394] leading-relaxed"
            />
          </div>

          {/* Full Content with Live Preview Tab */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-stone-800">
                Nội Dung Toàn Văn <span className="text-amber-600">*</span>
              </label>

              {/* Edit / Preview Tabs */}
              <div className="inline-flex rounded-lg border border-stone-300 bg-stone-100 p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => setEditorTab('edit')}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md transition ${
                    editorTab === 'edit'
                      ? 'bg-white text-stone-900 font-semibold shadow-2xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Edit3 className="w-3 h-3 text-[#0b5394]" />
                  <span>Soạn Thảo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditorTab('preview')}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md transition ${
                    editorTab === 'preview'
                      ? 'bg-white text-stone-900 font-semibold shadow-2xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Eye className="w-3 h-3 text-amber-700" />
                  <span>Xem Trước Phông Chữ</span>
                </button>
              </div>
            </div>

            {editorTab === 'edit' ? (
              <textarea
                rows={9}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Nhập toàn văn bài viết, khảo luận hoặc chi tiết thông báo..."
                className="w-full text-sm font-sans bg-white border border-stone-300 rounded-lg p-3.5 text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#0b5394] leading-relaxed"
              />
            ) : (
              <div className="p-4 sm:p-5 rounded-xl border border-stone-300 bg-stone-50 min-h-[220px] max-h-[350px] overflow-y-auto">
                <div className="mb-4 pb-3 border-b border-stone-200">
                  <h3 className="vn-article-title text-lg font-bold font-serif text-slate-900 mb-2">
                    {title || '(Chưa có tiêu đề)'}
                  </h3>
                  {excerpt && (
                    <div className="vn-article-lead text-xs sm:text-sm font-serif italic text-amber-950 bg-amber-100/50 p-3 rounded-lg border border-amber-200/60 leading-relaxed mb-2">
                      {excerpt}
                    </div>
                  )}
                </div>
                {content ? (
                  <ArticleRenderer content={content} showControls={false} />
                ) : (
                  <p className="text-xs text-stone-400 italic">Chưa có nội dung để hiển thị xem trước...</p>
                )}
              </div>
            )}
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
                placeholder="Thêm từ khóa (ví dụ: Thuyết Trình, Westminster, Khảo Cứu)"
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
                      className="text-amber-500 hover:text-amber-800 ml-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Controls: Draft and Publish */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 bg-stone-50 border-t border-stone-200">
          <div className="text-[11px] text-stone-500 flex items-center gap-1.5 self-start sm:self-auto">
            <Clock className="w-3.5 h-3.5 text-stone-400" />
            <span>
              Tự động sao lưu cục bộ khi gõ văn bản
            </span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 rounded-lg transition"
            >
              Hủy
            </button>

            {/* Save as Draft Button */}
            <button
              type="button"
              disabled={savingAction !== null}
              onClick={() => handleSaveArticle(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-amber-950 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-lg shadow-2xs transition disabled:opacity-50"
              title="Lưu bản nháp để tiếp tục chỉnh sửa sau mà chưa công khai"
            >
              {savingAction === 'draft' ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-800" />
                  <span>Đang Lưu Nháp...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5 text-amber-800" />
                  <span>Lưu Bản Nháp</span>
                </>
              )}
            </button>

            {/* Publish Button */}
            <button
              type="button"
              disabled={savingAction !== null}
              onClick={() => handleSaveArticle(false)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#0b5394] hover:bg-[#084175] rounded-lg shadow-sm transition disabled:opacity-50 active:scale-95"
              title="Xuất bản ngay để mọi độc giả có thể đọc trên trang chủ"
            >
              {savingAction === 'publish' ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Đang Xuất Bản...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />
                  <span>{initialArticle && initialArticle.published !== false ? 'Lưu & Xuất Bản' : 'Xuất Bản Bài Viết'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
