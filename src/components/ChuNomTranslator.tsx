import React, { useState, useRef } from 'react';
import {
  Languages,
  Upload,
  Camera,
  Sparkles,
  BookOpen,
  FileText,
  Copy,
  Check,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  ChevronRight,
  Info,
  Layers,
  Save,
  Printer,
  AlertCircle,
  HelpCircle,
  Eye,
  Scroll,
  Key,
} from 'lucide-react';
import { CHU_NOM_SAMPLES, ChuNomSample } from '../data/chuNomSamples';
import { ChuNomTranslationResult, DocumentItem } from '../types';
import { normalizeVietnameseText } from '../utils/vietnameseTypography';

interface ChuNomTranslatorProps {
  onSaveAsDocument?: (doc: Partial<DocumentItem>) => void;
  onNavigateTab?: (tab: 'home' | 'documents' | 'articles' | 'nom-translator' | 'about') => void;
}

export const ChuNomTranslator: React.FC<ChuNomTranslatorProps> = ({
  onSaveAsDocument,
}) => {
  // Image & Input State
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string>('image/jpeg');
  const [fileName, setFileName] = useState<string>('');
  const [contextInput, setContextInput] = useState<string>('');
  const [selectedSample, setSelectedSample] = useState<ChuNomSample | null>(null);

  // Analysis State
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<ChuNomTranslationResult | null>(null);

  // Display & View State
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);
  const [activeResultTab, setActiveResultTab] = useState<
    'interlinear' | 'parallel' | 'annotations' | 'image-compare'
  >('interlinear');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [nomFontSize, setNomFontSize] = useState<number>(32);
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Compress / resize image via HTML5 Canvas before uploading
  const compressImage = async (
    dataUrl: string,
    maxDimension = 1600,
    quality = 0.85
  ): Promise<{ compressedBase64: string; mimeType: string }> => {
    if (dataUrl.startsWith('data:image/svg+xml')) {
      return { compressedBase64: dataUrl, mimeType: 'image/svg+xml' };
    }
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        let { width, height } = img;
        if (width <= maxDimension && height <= maxDimension && dataUrl.length < 1500000) {
          resolve({ compressedBase64: dataUrl, mimeType: 'image/jpeg' });
          return;
        }
        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({ compressedBase64: dataUrl, mimeType: 'image/jpeg' });
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const compressed = canvas.toDataURL('image/jpeg', quality);
        resolve({ compressedBase64: compressed, mimeType: 'image/jpeg' });
      };
      img.onerror = () => {
        resolve({ compressedBase64: dataUrl, mimeType: 'image/jpeg' });
      };
      img.src = dataUrl;
    });
  };

  // Handle File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    processSelectedFile(file);
  };

  const processSelectedFile = (file: File) => {
    setErrorMessage(null);
    setNoticeMessage(null);
    setFileName(file.name);
    setImageMimeType(file.type || 'image/jpeg');
    setSelectedSample(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setSelectedImage(base64);
      setResult(null);
      setSavedSuccess(false);
    };
    reader.onerror = () => {
      setErrorMessage('Không thể đọc tập tin hình ảnh. Vui lòng thử lại.');
    };
    reader.readAsDataURL(file);
  };

  // Drag and Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processSelectedFile(file);
    } else {
      setErrorMessage('Vui lòng chỉ tải lên tập tin hình ảnh (JPG, PNG, WebP).');
    }
  };

  // Select Pre-configured Sample
  const handleSelectSample = (sample: ChuNomSample) => {
    setSelectedSample(sample);
    setSelectedImage(sample.svgDataUrl);
    setImageMimeType('image/svg+xml');
    setFileName(`${sample.id}.svg`);
    setContextInput(sample.context);
    setResult(sample.precomputedResult);
    setErrorMessage(null);
    setNoticeMessage(null);
    setSavedSuccess(false);
  };

  // Run Translation with Gemini API
  const handleTranslate = async () => {
    if (!selectedImage) {
      setErrorMessage('Vui lòng chọn hoặc tải lên một hình ảnh Chữ Nôm.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setNoticeMessage(null);
    setSavedSuccess(false);

    // If a pre-curated classical sample is active, immediately present the full scholarly analysis
    if (selectedSample) {
      setLoadingStep(`Đang tra cứu tàng thư mộc bản: ${selectedSample.title}...`);
      setTimeout(() => {
        setLoadingStep('Đang đồng bộ phiên âm Quốc ngữ & chú giải điển tích...');
      }, 400);

      setTimeout(() => {
        setResult(selectedSample.precomputedResult);
        setNoticeMessage(
          `Đã hiển thị toàn văn giải mã đối chiếu mộc bản "${selectedSample.title}". Bạn có thể xem bảng đối chiếu liên dòng, chú giải cổ ngữ và lưu vào văn khố cá nhân.`
        );
        setIsLoading(false);
        setLoadingStep('');
      }, 900);
      return;
    }

    // Step 1: Initiating for custom user image uploads
    setLoadingStep('Đang chuẩn bị và tối ưu hóa kích thước hình ảnh...');

    try {
      // Compress if large
      const { compressedBase64, mimeType: finalMime } = await compressImage(
        selectedImage,
        1600,
        0.85
      );

      setLoadingStep('Đang gửi hình ảnh đến máy chủ phân tích Gemini Vision...');

      // Periodic step progress display
      const timer1 = setTimeout(() => {
        setLoadingStep('Đang nhận dạng các bộ thủ Chữ Nôm và bảng mã Unicode CJK...');
      }, 1400);

      const timer2 = setTimeout(() => {
        setLoadingStep('Đang phiên âm Quốc ngữ theo niêm luật & thanh điệu cổ...');
      }, 2800);

      const timer3 = setTimeout(() => {
        setLoadingStep('Đang hoàn thiện bản dịch tiếng Việt hiện đại và trích xuất điển cố...');
      }, 4200);

      const response = await fetch('/api/translate-chu-nom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: compressedBase64,
          mimeType: finalMime,
          context: contextInput.trim(),
          sampleId: '',
        }),
      });

      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);

      const contentType = response.headers.get('content-type') || '';
      let data: any = null;

      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const rawText = await response.text();
        console.warn('API returned non-JSON response:', rawText.slice(0, 150));
        throw new Error(
          'Máy chủ chưa cấu hình định dạng phản hồi JSON cho dịch vụ AI. Quý vị có thể trải nghiệm toàn diện bằng các mẫu mộc bản đối chiếu sẵn của Viện.'
        );
      }

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ||
            'Không thể giải mã hình ảnh Chữ Nôm. Vui lòng kiểm tra lại hình ảnh hoặc kết nối.'
        );
      }

      setResult(data.data);
    } catch (err: any) {
      console.error('Translation error:', err);
      setErrorMessage(
        err?.message ||
          'Lỗi kết nối máy chủ Gemini. Quý vị vui lòng thử lại hoặc chọn một mẫu mộc bản có sẵn để khảo sát.'
      );
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  // Copy to clipboard helper
  const handleCopy = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  // Save to Viện Việt Học Digital Archive
  const handleSaveToArchive = () => {
    if (!result || !onSaveAsDocument) return;

    const title = selectedSample
      ? `Bản Dịch Chữ Nôm: ${selectedSample.title}`
      : `Bản Dịch Chữ Nôm: ${result.summary?.slice(0, 60) || fileName || 'Văn bản Nôm cổ'}`;

    const textContent = `
=== NGUYÊN VĂN CHỮ NÔM (UNICODE) ===
${result.nomUnicode}

=== PHIÊN ÂM CHỮ QUỐC NGỮ ===
${result.quocNgu}

=== BẢN DỊCH DIỄN NGHĨA HIỆN ĐẠI ===
${result.modernTranslation}

=== THÔNG TIN THƯ TỊCH ===
Thể chữ: ${result.scriptType || 'Khải thư Nôm'}
Niên đại ước tính: ${result.estimatedPeriod || 'Thời Nguyễn'}
Thể loại: ${result.literaryGenre || 'Thơ văn cổ điển'}

=== CHÚ THÍCH ĐIỂN TÍCH & TỪ CỔ ===
${result.annotations.map((a) => `• ${a.term}: ${a.explanation}`).join('\n')}
    `.trim();

    onSaveAsDocument({
      title: normalizeVietnameseText(title),
      fileName: fileName ? `dich-nom-${fileName}.txt` : 'dich-chu-nom.txt',
      fileType: 'text',
      category: 'Hán Nôm & Cổ Thư',
      summary: normalizeVietnameseText(result.summary || result.modernTranslation.slice(0, 180)),
      tags: ['Chữ Nôm', 'Dịch Thuật AI', 'Hán Việt', result.literaryGenre || 'Cổ văn'].filter(Boolean),
      textContent: normalizeVietnameseText(textContent),
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner / Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-amber-50 p-6 sm:p-8 border border-amber-500/30 shadow-xl">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-6 bottom-4 opacity-15 pointer-events-none select-none font-serif text-8xl text-amber-300">
          喃
        </div>

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>Viện Việt Học • AI Multimodal Decryption & Philology</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-amber-100 tracking-tight leading-tight">
            Giải Mã &amp; Dịch Thuật Chữ Nôm Bằng AI
          </h1>

          <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
            Ứng dụng thị giác máy tính và mô hình đa phương thức tiên tiến của <strong className="text-amber-300 font-medium">Google Gemini</strong> kết hợp với hệ thống chuẩn hóa ngôn ngữ học Viện Việt Học. Tự động nhận diện chữ Nôm từ ảnh chụp mộc bản, sắc phong, gia phả, hoành phi; đối chiếu từng chữ, phiên âm Quốc ngữ và diễn giải văn học cổ điển.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-amber-200/80">
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" /> Nhận dạng chữ Nôm Unicode CJK
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" /> Đối chiếu liên dòng từng chữ
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" /> Chú giải điển tích &amp; từ cổ
            </span>
          </div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Image Upload & Sample Selection (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Sample Manuscripts Showcase */}
          <div className="bg-white/90 backdrop-blur-xs rounded-xl p-5 border border-stone-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-800" />
                <h3 className="font-serif font-bold text-stone-900 text-sm">
                  Thư Viện Mẫu Chữ Nôm Điển Hình
                </h3>
              </div>
              <span className="text-[11px] text-stone-500 font-medium">
                Chọn mẫu để thử nghiệm nhanh
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {CHU_NOM_SAMPLES.map((sample) => {
                const isSelected = selectedSample?.id === sample.id;
                return (
                  <button
                    key={sample.id}
                    onClick={() => handleSelectSample(sample)}
                    className={`p-3 rounded-lg text-left transition-all border ${
                      isSelected
                        ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-500/20 shadow-xs'
                        : 'bg-stone-50/80 hover:bg-stone-100 border-stone-200/80'
                    }`}
                  >
                    <div className="text-xs font-serif font-bold text-stone-900 line-clamp-1">
                      {sample.title}
                    </div>
                    <div className="text-[11px] text-amber-800 font-medium line-clamp-1 mt-0.5">
                      {sample.author}
                    </div>
                    <div className="text-[10px] text-stone-500 line-clamp-1 mt-1 font-mono">
                      {sample.genre}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Upload / Capture Card */}
          <div className="bg-white/95 backdrop-blur-xs rounded-xl p-5 border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-stone-900 text-sm flex items-center gap-2">
                <Upload className="w-4 h-4 text-amber-800" />
                Tải Lên Hình Ảnh Chữ Nôm
              </h3>
              {selectedImage && (
                <button
                  onClick={() => {
                    setSelectedImage(null);
                    setSelectedSample(null);
                    setResult(null);
                    setFileName('');
                  }}
                  className="text-xs text-stone-500 hover:text-red-600 flex items-center gap-1 transition"
                >
                  <RotateCcw className="w-3 h-3" /> Đặt lại
                </button>
              )}
            </div>

            {/* Dropzone */}
            {!selectedImage ? (
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-amber-600/30 hover:border-amber-600 rounded-xl p-8 text-center cursor-pointer transition-colors bg-amber-50/30 hover:bg-amber-50/60 group"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/jpg"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleFileChange}
                />

                <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 group-hover:scale-110 transition-transform">
                  <Languages className="w-7 h-7" />
                </div>
                <p className="text-sm font-semibold text-stone-800 mb-1">
                  Kéo thả ảnh văn bản Chữ Nôm vào đây
                </p>
                <p className="text-xs text-stone-500 mb-4">
                  Hỗ trợ định dạng JPG, PNG, WEBP (Ảnh mộc bản, sắc phong, thư tịch, bia ký)
                </p>

                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-800 hover:bg-amber-900 text-white shadow-xs transition"
                  >
                    Chọn Tập Tin Ảnh
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      cameraInputRef.current?.click();
                    }}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 transition flex items-center gap-1.5"
                  >
                    <Camera className="w-3.5 h-3.5" /> Chụp Ảnh
                  </button>
                </div>
              </div>
            ) : (
              /* Image Preview Card with Zoom & Inspection */
              <div className="space-y-3">
                <div className="relative rounded-lg overflow-hidden border border-stone-300 bg-stone-950/5 flex items-center justify-center min-h-[260px] max-h-[380px]">
                  <img
                    src={selectedImage}
                    alt="Bản thảo Chữ Nôm cần dịch"
                    referrerPolicy="no-referrer"
                    style={{ transform: `scale(${zoomLevel / 100})` }}
                    className="max-h-[360px] w-auto object-contain transition-transform duration-150 select-none"
                  />

                  {/* Zoom controls floating */}
                  <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-stone-900/80 backdrop-blur-xs text-white px-2 py-1 rounded-md text-xs">
                    <button
                      onClick={() => setZoomLevel((z) => Math.max(75, z - 25))}
                      className="p-1 hover:text-amber-400"
                      title="Thu nhỏ"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono text-[11px] px-1">{zoomLevel}%</span>
                    <button
                      onClick={() => setZoomLevel((z) => Math.min(200, z + 25))}
                      className="p-1 hover:text-amber-400"
                      title="Phóng to"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setZoomLevel(100)}
                      className="p-1 hover:text-amber-400 text-[10px]"
                      title="Kích thước gốc"
                    >
                      1:1
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span className="truncate max-w-[240px] font-medium text-stone-700">
                    {fileName || 'Ảnh Chữ Nôm'}
                  </span>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-amber-800 hover:underline font-medium"
                  >
                    Thay ảnh khác
                  </button>
                </div>
              </div>
            )}

            {/* Optional Research Context Field */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Ghi chú / Ngữ cảnh tư liệu (Không bắt buộc)
              </label>
              <textarea
                rows={2}
                value={contextInput}
                onChange={(e) => setContextInput(e.target.value)}
                placeholder="Ví dụ: Bản khắc Truyện Kiều thế kỷ XIX, hoặc Sắc phong thời Cảnh Thịnh, văn bia chùa..."
                className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-hidden bg-stone-50/50 resize-none"
              />
              <p className="text-[11px] text-stone-500 mt-1">
                Cung cấp niên đại hoặc chủ đề giúp Gemini nhận diện chính xác các từ cổ dị thể.
              </p>
            </div>

            {/* Notice / Fallback Feedback */}
            {noticeMessage && (
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
                <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-amber-700" />
                <span className="leading-relaxed">{noticeMessage}</span>
              </div>
            )}

            {/* Error Feedback */}
            {errorMessage && (
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-300 text-stone-800 text-xs space-y-3 shadow-xs">
                <div className="flex items-start gap-2.5 text-amber-900 font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-700" />
                  <span className="leading-relaxed">{errorMessage}</span>
                </div>

                {/* Structured Resolution Guide */}
                <div className="bg-white p-3 rounded-lg border border-stone-200 space-y-2">
                  <div className="font-semibold text-stone-900 text-[11px] flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-amber-800" />
                    <span>Hướng dẫn kích hoạt thị giác máy tính cho ảnh tự tải:</span>
                  </div>
                  <ol className="list-decimal list-inside text-[11px] text-stone-600 space-y-1 pl-1 leading-relaxed">
                    <li>
                      Tạo khóa API tại{' '}
                      <span className="font-mono text-amber-900 font-semibold">
                        aistudio.google.com
                      </span>
                    </li>
                    <li>
                      Nhấp biểu tượng bánh răng <span className="font-semibold text-stone-800">Settings &gt; Secrets</span> trong AI Studio.
                    </li>
                    <li>
                      Thêm bí danh <span className="font-mono bg-stone-100 px-1 py-0.5 rounded text-amber-900 font-bold">GEMINI_API_KEY</span> và dán khóa API của quý vị.
                    </li>
                  </ol>
                </div>

                {/* Quick Sample Selector */}
                <div className="pt-2 border-t border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-[11px] text-stone-600 font-medium">
                    Hoặc khảo sát ngay các bản mộc bản chuẩn:
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {CHU_NOM_SAMPLES.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => handleSelectSample(s)}
                        className="px-2 py-1 rounded bg-amber-100 hover:bg-amber-200 text-amber-900 font-medium text-[10px] transition border border-amber-300/60"
                      >
                        {s.title.split('(')[0].trim()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Action Button: Dịch Chữ Nôm */}
            <button
              onClick={handleTranslate}
              disabled={isLoading || !selectedImage}
              className={`w-full py-3 px-4 rounded-xl font-semibold text-sm shadow-md transition flex items-center justify-center gap-2 ${
                isLoading || !selectedImage
                  ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-800 to-amber-900 hover:from-amber-900 hover:to-amber-950 text-white shadow-amber-900/20 active:scale-[0.99]'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-amber-300 border-t-transparent rounded-full animate-spin" />
                  <span>Đang Giải Mã &amp; Dịch Thuật...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Giải Mã &amp; Dịch Bằng AI Gemini</span>
                </>
              )}
            </button>

            {/* Loading step progress indicator */}
            {isLoading && loadingStep && (
              <div className="p-3 rounded-lg bg-amber-50/80 border border-amber-200/80 text-amber-900 text-xs space-y-1.5 animate-fadeIn">
                <div className="flex items-center gap-2 font-medium">
                  <div className="w-2 h-2 rounded-full bg-amber-600 animate-ping" />
                  <span>{loadingStep}</span>
                </div>
                <div className="w-full bg-amber-200/60 rounded-full h-1 overflow-hidden">
                  <div className="bg-amber-700 h-full w-2/3 animate-pulse" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Decrypted Results & Comparative Analysis (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {!result ? (
            /* Empty placeholder state */
            <div className="bg-white/80 backdrop-blur-xs rounded-xl p-10 border border-stone-200/80 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-100/60 border border-amber-200/80 flex items-center justify-center text-amber-800">
                <Scroll className="w-8 h-8 opacity-80" />
              </div>
              <div className="max-w-md mx-auto space-y-2">
                <h3 className="font-serif font-bold text-stone-800 text-base">
                  Chưa có kết quả dịch thuật
                </h3>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Hãy chọn một mẫu Chữ Nôm ở cột bên trái hoặc tải lên hình ảnh văn bản cổ để hệ thống giải mã nguyên văn chữ Nôm, đối chiếu từng âm và xuất bản dịch hiện đại.
                </p>
              </div>

              {/* Tips */}
              <div className="pt-4 border-t border-stone-100 max-w-lg mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                <div className="p-3 rounded-lg bg-stone-50 border border-stone-200/60">
                  <div className="text-xs font-semibold text-stone-800 flex items-center gap-1.5 mb-1">
                    <Eye className="w-3.5 h-3.5 text-amber-800" /> Đối chiếu liên dòng
                  </div>
                  <p className="text-[11px] text-stone-500">
                    Hiển thị từng ký tự Nôm thẳng hàng với phiên âm chữ Quốc ngữ tương ứng bên dưới.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-stone-50 border border-stone-200/60">
                  <div className="text-xs font-semibold text-stone-800 flex items-center gap-1.5 mb-1">
                    <Save className="w-3.5 h-3.5 text-amber-800" /> Lưu vào thư viện số
                  </div>
                  <p className="text-[11px] text-stone-500">
                    Có thể lưu trữ toàn bộ bản dịch và chú giải trực tiếp vào Kho Tài Liệu của Viện.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Result Workspace */
            <div className="bg-white/95 backdrop-blur-xs rounded-xl border border-stone-200 shadow-md overflow-hidden space-y-0">
              {/* Bibliographic Metadata Header */}
              <div className="bg-stone-900 text-stone-100 p-5 border-b border-amber-500/30">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                      {result.scriptType || 'Khải thư Nôm'}
                    </span>
                    {result.estimatedPeriod && (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white/10 text-stone-200">
                        {result.estimatedPeriod}
                      </span>
                    )}
                    {result.literaryGenre && (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white/10 text-stone-200">
                        {result.literaryGenre}
                      </span>
                    )}
                  </div>

                  {/* Actions: Save & Copy */}
                  <div className="flex items-center gap-2">
                    {onSaveAsDocument && (
                      <button
                        onClick={handleSaveToArchive}
                        disabled={savedSuccess}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                          savedSuccess
                            ? 'bg-emerald-600 text-white'
                            : 'bg-amber-600 hover:bg-amber-500 text-white shadow-xs'
                        }`}
                        title="Lưu bản dịch vào Kho Tài Liệu của Viện Việt Học"
                      >
                        {savedSuccess ? (
                          <>
                            <Check className="w-3.5 h-3.5" /> Đã Lưu Vào Kho
                          </>
                        ) : (
                          <>
                            <Save className="w-3.5 h-3.5" /> Lưu Vào Kho Lưu Trữ
                          </>
                        )}
                      </button>
                    )}

                    <button
                      onClick={() =>
                        handleCopy(
                          `NGUYÊN VĂN CHỮ NÔM:\n${result.nomUnicode}\n\nPHIÊN ÂM QUỐC NGỮ:\n${result.quocNgu}\n\nDIỄN NGHĨA HIỆN ĐẠI:\n${result.modernTranslation}`,
                          'all'
                        )
                      }
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-white/15 hover:bg-white/25 text-stone-100 transition"
                      title="Sao chép toàn bộ bản dịch và nguyên văn"
                    >
                      {copiedSection === 'all' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" /> Đã chép
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> Sao Chép
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {result.summary && (
                  <p className="text-xs text-stone-300 leading-relaxed mt-2 pt-2 border-t border-stone-800">
                    <strong className="text-amber-300 font-semibold">Tóm lược tư liệu: </strong>
                    {result.summary}
                  </p>
                )}
              </div>

              {/* Navigation Tabs for Views */}
              <div className="flex items-center justify-between border-b border-stone-200 px-4 bg-stone-50/90 overflow-x-auto">
                <div className="flex items-center gap-1 py-2">
                  <button
                    onClick={() => setActiveResultTab('interlinear')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                      activeResultTab === 'interlinear'
                        ? 'bg-amber-800 text-white shadow-xs'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Đối Chiếu Từng Chữ (Liên Dòng)</span>
                  </button>

                  <button
                    onClick={() => setActiveResultTab('parallel')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                      activeResultTab === 'parallel'
                        ? 'bg-amber-800 text-white shadow-xs'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Bản Dịch Toàn Văn</span>
                  </button>

                  <button
                    onClick={() => setActiveResultTab('annotations')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                      activeResultTab === 'annotations'
                        ? 'bg-amber-800 text-white shadow-xs'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                    }`}
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>Chú Thích Điển Tích ({result.annotations?.length || 0})</span>
                  </button>

                  {selectedImage && (
                    <button
                      onClick={() => setActiveResultTab('image-compare')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                        activeResultTab === 'image-compare'
                          ? 'bg-amber-800 text-white shadow-xs'
                          : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>So Sánh Với Ảnh Gốc</span>
                    </button>
                  )}
                </div>

                {/* Font Size Adjuster for Chữ Nôm */}
                {activeResultTab === 'interlinear' && (
                  <div className="hidden sm:flex items-center gap-1 text-xs text-stone-500 font-medium pl-2">
                    <span className="text-[11px]">Cỡ Nôm:</span>
                    <button
                      onClick={() => setNomFontSize((s) => Math.max(20, s - 4))}
                      className="w-6 h-6 rounded-md hover:bg-stone-200 flex items-center justify-center font-bold"
                      title="Giảm cỡ chữ Nôm"
                    >
                      -
                    </button>
                    <span className="w-6 text-center font-mono text-[11px]">{nomFontSize}</span>
                    <button
                      onClick={() => setNomFontSize((s) => Math.min(48, s + 4))}
                      className="w-6 h-6 rounded-md hover:bg-stone-200 flex items-center justify-center font-bold"
                      title="Tăng cỡ chữ Nôm"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>

              {/* View 1: Interlinear Character-by-Character Alignment */}
              {activeResultTab === 'interlinear' && (
                <div className="p-6 space-y-6">
                  <div className="text-xs text-stone-500 flex items-center justify-between border-b border-stone-100 pb-2">
                    <span>Rê chuột lên từng chữ Nôm để xem gốc Hán-Việt và ngữ nghĩa:</span>
                    <span className="text-amber-800 font-medium">Bảng mã Unicode CJK Ext</span>
                  </div>

                  {result.lines && result.lines.length > 0 ? (
                    <div className="space-y-6">
                      {result.lines.map((line, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-xl bg-stone-50/70 border border-stone-200/80 hover:border-amber-400/80 transition-colors"
                        >
                          <div className="text-[11px] font-mono text-stone-400 mb-2">
                            Dòng {line.lineNumber || idx + 1}
                          </div>

                          {/* Words Grid for this line */}
                          <div className="flex flex-wrap items-end gap-3 sm:gap-4">
                            {line.words && line.words.length > 0 ? (
                              line.words.map((w, wIdx) => (
                                <div
                                  key={wIdx}
                                  className="group relative flex flex-col items-center p-2 rounded-lg bg-white border border-stone-200/80 hover:border-amber-600 hover:shadow-md transition-all cursor-pointer min-w-[54px]"
                                >
                                  {/* Chữ Nôm Glyph */}
                                  <span
                                    style={{ fontSize: `${nomFontSize}px` }}
                                    className="font-serif font-bold text-stone-900 group-hover:text-amber-900 transition-colors leading-none my-1"
                                  >
                                    {w.nom}
                                  </span>

                                  {/* Quốc Ngữ Transliteration */}
                                  <span className="text-xs font-semibold text-stone-700 group-hover:text-amber-800 border-t border-stone-100 pt-1 w-full text-center">
                                    {w.quocNgu}
                                  </span>

                                  {/* Hover Tooltip showing Sino-Vietnamese & definition */}
                                  <div className="absolute bottom-full mb-2 hidden group-hover:block z-30 w-44 p-2.5 rounded-lg bg-stone-900 text-white text-left shadow-xl text-[11px] pointer-events-none">
                                    <div className="font-bold text-amber-300 flex items-center justify-between">
                                      <span>{w.nom}</span>
                                      <span className="text-stone-300 font-normal">
                                        HV: {w.hanViet || '—'}
                                      </span>
                                    </div>
                                    <div className="text-stone-200 font-medium mt-0.5">
                                      {w.quocNgu}
                                    </div>
                                    {w.meaning && (
                                      <div className="text-stone-400 text-[10px] mt-1 border-t border-stone-800 pt-1">
                                        {w.meaning}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))
                            ) : (
                              /* Fallback if words array was empty */
                              <div className="space-y-1">
                                <div
                                  style={{ fontSize: `${nomFontSize}px` }}
                                  className="font-serif font-bold text-stone-900"
                                >
                                  {line.nomText}
                                </div>
                                <div className="text-sm font-medium text-amber-900">
                                  {line.quocNguText}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* Fallback if lines were not broken down */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                        <h4 className="font-serif font-bold text-stone-900 text-sm mb-2">
                          Chữ Nôm (Unicode)
                        </h4>
                        <div
                          style={{ fontSize: `${nomFontSize}px` }}
                          className="font-serif leading-relaxed text-stone-900 whitespace-pre-line"
                        >
                          {result.nomUnicode}
                        </div>
                      </div>
                      <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                        <h4 className="font-serif font-bold text-stone-900 text-sm mb-2">
                          Phiên Âm Quốc Ngữ
                        </h4>
                        <div className="text-base leading-relaxed text-stone-900 whitespace-pre-line font-serif">
                          {result.quocNgu}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* View 2: Full Translation & Modern Reading */}
              {activeResultTab === 'parallel' && (
                <div className="p-6 space-y-6">
                  {/* Modern Vietnamese Translation Hero */}
                  <div className="p-5 rounded-xl bg-amber-50/70 border border-amber-300/70 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif font-bold text-amber-950 text-sm flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-amber-800" />
                        Bản Dịch Nghĩa &amp; Diễn Giảng Hiện Đại
                      </h4>
                      <button
                        onClick={() => handleCopy(result.modernTranslation, 'trans')}
                        className="text-xs text-amber-900 hover:text-amber-700 font-medium flex items-center gap-1"
                      >
                        {copiedSection === 'trans' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" /> Đã chép
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" /> Sao chép
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-stone-800 text-sm sm:text-base leading-relaxed font-serif">
                      {result.modernTranslation}
                    </p>
                  </div>

                  {/* Two Columns: Nôm Unicode vs Quốc Ngữ */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left: Original Chữ Nôm */}
                    <div className="p-5 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
                      <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                        <h4 className="font-serif font-bold text-stone-900 text-sm">
                          Nguyên Văn Chữ Nôm (Unicode)
                        </h4>
                        <button
                          onClick={() => handleCopy(result.nomUnicode, 'nom')}
                          className="text-xs text-stone-600 hover:text-stone-900 font-medium flex items-center gap-1"
                        >
                          {copiedSection === 'nom' ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" /> Đã chép
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" /> Sao chép
                            </>
                          )}
                        </button>
                      </div>
                      <div className="font-serif text-2xl leading-loose tracking-wide text-stone-900 whitespace-pre-line">
                        {result.nomUnicode}
                      </div>
                    </div>

                    {/* Right: Quốc Ngữ Transliteration */}
                    <div className="p-5 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
                      <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                        <h4 className="font-serif font-bold text-stone-900 text-sm">
                          Phiên Âm Chữ Quốc Ngữ
                        </h4>
                        <button
                          onClick={() => handleCopy(result.quocNgu, 'qn')}
                          className="text-xs text-stone-600 hover:text-stone-900 font-medium flex items-center gap-1"
                        >
                          {copiedSection === 'qn' ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" /> Đã chép
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" /> Sao chép
                            </>
                          )}
                        </button>
                      </div>
                      <div className="font-serif text-base sm:text-lg leading-loose text-stone-900 whitespace-pre-line">
                        {result.quocNgu}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* View 3: Scholarly Annotations */}
              {activeResultTab === 'annotations' && (
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif font-bold text-stone-900 text-sm">
                      Khảo Cứu Điển Tích, Từ Cổ &amp; Ngữ Pháp
                    </h4>
                    <span className="text-xs text-stone-500">
                      Tổng cộng {result.annotations?.length || 0} mục chú giải
                    </span>
                  </div>

                  {result.annotations && result.annotations.length > 0 ? (
                    <div className="space-y-3">
                      {result.annotations.map((anno, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-xl bg-stone-50 border border-stone-200/90 space-y-1 hover:border-amber-400 transition-colors"
                        >
                          <div className="font-serif font-bold text-amber-900 text-sm flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 text-xs flex items-center justify-center font-mono">
                              {idx + 1}
                            </span>
                            {anno.term}
                          </div>
                          <p className="text-stone-700 text-xs sm:text-sm leading-relaxed pl-7">
                            {anno.explanation}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-stone-400 text-xs">
                      Không có chú giải điển tích riêng cho đoạn văn bản này.
                    </div>
                  )}
                </div>
              )}

              {/* View 4: Side-by-Side Image Compare */}
              {activeResultTab === 'image-compare' && selectedImage && (
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    {/* Image Column */}
                    <div className="space-y-2">
                      <div className="text-xs font-semibold text-stone-700">
                        Hình ảnh gốc tư liệu:
                      </div>
                      <div className="rounded-xl overflow-hidden border border-stone-300 bg-stone-950/5 flex items-center justify-center p-2">
                        <img
                          src={selectedImage}
                          alt="Ảnh Chữ Nôm đối chiếu"
                          referrerPolicy="no-referrer"
                          className="max-h-[460px] w-auto object-contain rounded-lg"
                        />
                      </div>
                    </div>

                    {/* Decrypted Text Column */}
                    <div className="space-y-4">
                      <div className="text-xs font-semibold text-stone-700">
                        Văn bản đã giải mã:
                      </div>

                      <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                        <div className="text-[11px] font-bold text-amber-900 uppercase tracking-wider">
                          Chữ Nôm (Unicode)
                        </div>
                        <div className="font-serif text-xl leading-relaxed text-stone-900 whitespace-pre-line">
                          {result.nomUnicode}
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 space-y-2">
                        <div className="text-[11px] font-bold text-amber-900 uppercase tracking-wider">
                          Phiên âm Quốc ngữ
                        </div>
                        <div className="font-serif text-sm sm:text-base leading-relaxed text-stone-900 whitespace-pre-line">
                          {result.quocNgu}
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-2">
                        <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                          Diễn giải hiện đại
                        </div>
                        <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-serif">
                          {result.modernTranslation}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
