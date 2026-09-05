import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { parseUploadedFile, extractSearchTokens, detectVietnameseCategory } from '../utils/fileParser';
import { DocumentItem } from '../types';
import {
  X,
  Upload,
  FileCode,
  FileText,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Sparkles,
  Tag,
  Building
} from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDocumentAdded: (doc: DocumentItem) => void;
}

const CATEGORIES = [
  'Lịch sử',
  'Văn học & Nghệ thuật',
  'Ngôn ngữ & Chữ viết',
  'Triết học & Tư tưởng',
  'Tư liệu & Văn kiện',
  'Nghiên cứu',
];

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  onClose,
  onDocumentAdded,
}) => {
  const { user, userProfile, isEditor } = useAuth();

  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Tư liệu & Văn kiện');
  const [summary, setSummary] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [extractedText, setExtractedText] = useState('');
  const [extractedHtml, setExtractedHtml] = useState<string | undefined>(undefined);
  const [fileDataUrl, setFileDataUrl] = useState<string | undefined>(undefined);
  const [wordCount, setWordCount] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = async (selectedFile: File) => {
    setError(null);
    setFile(selectedFile);
    setParsing(true);

    try {
      const parsed = await parseUploadedFile(selectedFile);
      setTitle(parsed.title);
      setExtractedText(parsed.textContent);
      setExtractedHtml(parsed.htmlContent);
      setFileDataUrl(parsed.fileDataUrl);
      setWordCount(parsed.wordCount);
      setPageCount(parsed.pageCount);
      setSummary(parsed.summary);
      if (parsed.suggestedCategory && CATEGORIES.includes(parsed.suggestedCategory)) {
        setCategory(parsed.suggestedCategory);
      } else {
        setCategory(detectVietnameseCategory(parsed.textContent));
      }

      // Auto-extract tags
      const tokens = extractSearchTokens(parsed.textContent).slice(0, 5);
      setTags(tokens);
    } catch (err: any) {
      console.error('File parsing error:', err);
      setError(err.message || 'Lỗi khi trích xuất dữ liệu tập tin.');
    } finally {
      setParsing(false);
    }
  };

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !extractedText) {
      setError('Vui lòng chọn một tập tin PDF hoặc HTML hợp lệ.');
      return;
    }

    if (!isEditor) {
      setError('Chỉ tài khoản có quyền Biên tập viên hoặc Quản trị viên mới được lưu trữ tài liệu.');
      return;
    }

    setSaving(true);
    setError(null);

    const docId = `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    const fileType = extension === 'pdf' ? 'pdf' : 'html';

    const newDocument: DocumentItem = {
      id: docId,
      title: title.trim() || file.name,
      fileName: file.name,
      fileType,
      fileSize: file.size,
      category,
      summary: summary.trim(),
      tags,
      authorId: user?.uid || 'anonymous',
      authorEmail: user?.email || 'bien-tap@viethoc.com',
      authorName: userProfile?.displayName || user?.displayName || 'Biên Tập Viên Viện Việt Học',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      pageCount,
      wordCount,
      textContent: extractedText,
      htmlContent: extractedHtml,
      fileDataUrl,
    };

    try {
      // Save in Firestore if available
      try {
        await setDoc(doc(db, 'documents', docId), newDocument);
      } catch (firestoreErr) {
        console.warn('Firestore offline fallback:', firestoreErr);
      }

      onDocumentAdded(newDocument);
      onClose();
    } catch (err: any) {
      console.error('Error saving document:', err);
      setError(err.message || 'Lỗi khi lưu tài liệu vào kho.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      id="document-upload-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto"
    >
      <div
        id="document-upload-modal-container"
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#1e2024] text-white border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-[#800020] to-[#b91c1c] flex items-center justify-center">
              <Upload className="w-4 h-4 text-amber-200" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-serif">
                Tải Lên & Số Hóa Văn Kiện
              </h2>
              <p className="text-xs text-stone-400">
                Tự động trích xuất toàn văn HTML/PDF và lập chỉ mục tra cứu
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
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* File Dropzone */}
          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-1.5">
              Chọn Tập Tin Văn Bản (HTML hoặc PDF)
            </label>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${
                dragActive
                  ? 'border-amber-500 bg-amber-50/50'
                  : file
                  ? 'border-emerald-400 bg-emerald-50/30'
                  : 'border-stone-300 bg-stone-50 hover:bg-stone-100/70'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".html,.htm,.pdf,.txt"
                onChange={handleFileInputChange}
                className="hidden"
              />

              {parsing ? (
                <div className="flex flex-col items-center py-2">
                  <Loader2 className="w-7 h-7 text-[#800020] animate-spin mb-2" />
                  <span className="text-xs font-semibold text-stone-700">
                    Đang trích xuất toàn văn và lập chỉ mục nội dung...
                  </span>
                </div>
              ) : file ? (
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-stone-900">{file.name}</p>
                    <p className="text-[11px] text-stone-500">
                      {(file.size / 1024).toFixed(1)} KB &bull; Đã trích xuất {wordCount.toLocaleString()} từ
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="p-3 rounded-full bg-stone-200/60 text-[#800020] mb-2">
                    <Upload className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-medium text-stone-700 mb-0.5">
                    Kéo và thả tập tin vào đây, hoặc <span className="text-[#800020] font-semibold underline">duyệt từ máy</span>
                  </p>
                  <p className="text-[11px] text-stone-400">Hỗ trợ các định dạng .html, .htm, .pdf, .txt</p>
                </>
              )}
            </div>
          </div>

          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                Tiêu Đề Tài Liệu / Tác Phẩm
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ví dụ: Đoạn Trường Tân Thanh - Khảo Luận Thi Pháp"
                required
                className="w-full text-xs bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#800020]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">Chuyên Mục</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#800020] cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Summary */}
          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-1">
              Tóm Tắt Trích Yếu / Giới Thiệu Ngắn
            </label>
            <textarea
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Tóm tắt ngắn gọn bối cảnh lịch sử, nội dung cốt lõi hoặc ý nghĩa của tài liệu..."
              className="w-full text-xs bg-white border border-stone-300 rounded-lg p-3 text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#800020] leading-relaxed"
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
                placeholder="Thêm từ khóa (ví dụ: Lịch sử, Thời Lý, Chữ Nôm)"
                className="flex-1 text-xs bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-[#800020]"
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
                {tags.map((t, idx) => (
                  <span
                    key={idx}
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
              disabled={!file || saving || parsing}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-[#800020] hover:bg-[#6b001a] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm transition active:scale-95"
            >
              {saving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Đang Lưu Trữ...
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5 text-amber-300" />
                  Lưu & Lập Chỉ Mục Toàn Văn
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
