import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      id="offline-status-banner"
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-[#800020] px-4 py-2.5 text-xs font-semibold text-white shadow-xl border border-amber-400/50 animate-pulse"
    >
      <WifiOff className="w-4 h-4 text-amber-300" />
      <span>Chế độ Ngoại tuyến (PWA Offline) &bull; Kho tài liệu đã lưu và tìm kiếm toàn văn sẵn sàng sử dụng.</span>
    </div>
  );
};
