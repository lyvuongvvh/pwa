import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, X, CheckCircle2 } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, display confirmed badge
  if (isInstalled) {
    return (
      <span
        id="pwa-installed-badge"
        className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-500/40"
      >
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        <span>Đã Cài Đặt PWA</span>
      </span>
    );
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        id="pwa-install-btn"
        onClick={install}
        className="inline-flex items-center gap-2 rounded-lg bg-amber-400 hover:bg-amber-300 px-3.5 py-1.5 text-xs font-bold text-amber-950 shadow-sm transition active:scale-95"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Cài Đặt App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          id="pwa-install-ios-btn"
          onClick={() => setShowIOSGuide(true)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-stone-700 bg-stone-800 px-3 py-1.5 text-xs font-medium text-stone-200 hover:bg-stone-700 transition shadow-xs"
        >
          <Smartphone className="w-3.5 h-3.5 text-amber-400" />
          <span>Cài trên iOS</span>
        </button>

        {showIOSGuide && (
          <div
            id="ios-guide-modal"
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4"
          >
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-stone-200 text-stone-900">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-stone-900 font-serif">
                  Cài Đặt Trên iPhone & iPad
                </h3>
                <button
                  id="close-ios-guide-btn"
                  onClick={() => setShowIOSGuide(false)}
                  className="rounded-lg p-1 text-stone-400 hover:text-stone-600 hover:bg-stone-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <ol className="space-y-2.5 text-xs text-stone-700 list-decimal pl-4 leading-relaxed mb-5">
                <li>
                  Mở ứng dụng trên trình duyệt <strong>Safari</strong> của thiết bị.
                </li>
                <li>
                  Nhấn vào nút <strong>Chia sẻ (Share)</strong> ở thanh dưới cùng của màn hình.
                </li>
                <li>
                  Cuộn xuống và chọn <strong>Thêm vào Màn hình chính (Add to Home Screen)</strong>.
                </li>
                <li>
                  Nhấn <strong>Thêm (Add)</strong> ở góc trên bên phải để hoàn tất cài đặt ứng dụng.
                </li>
              </ol>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full rounded-xl bg-[#0b5394] py-2 text-xs font-bold text-white hover:bg-[#084175] transition"
              >
                Đã Hiểu
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback: Always provide an install trigger for browsers
  return (
    <button
      id="pwa-install-general-btn"
      onClick={install}
      className="inline-flex items-center gap-1.5 rounded-lg border border-amber-400/50 bg-amber-400/20 hover:bg-amber-400/30 px-3 py-1.5 text-xs font-semibold text-amber-100 transition shadow-xs"
      title="Cài đặt Viện Việt Học thành ứng dụng trên máy tính hoặc điện thoại"
    >
      <Download className="w-3.5 h-3.5 text-amber-300" />
      <span className="hidden sm:inline">Cài Đặt PWA</span>
    </button>
  );
};
