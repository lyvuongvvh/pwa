import React from 'react';
import { useAuth } from '../context/AuthContext';
import { PWAInstallButton } from './PWAInstallButton';
import {
  FileText,
  Newspaper,
  Upload,
  PlusCircle,
  Shield,
  LogIn,
  LogOut,
  User as UserIcon,
  Search,
  Building,
  Info,
  BookOpen
} from 'lucide-react';
import { UserRole } from '../types';

interface HeaderProps {
  activeTab: 'home' | 'documents' | 'articles' | 'about';
  setActiveTab: (tab: 'home' | 'documents' | 'articles' | 'about') => void;
  onOpenUpload: () => void;
  onOpenNewArticle: () => void;
  onOpenRoleManager: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenUpload,
  onOpenNewArticle,
  onOpenRoleManager,
  searchQuery,
  setSearchQuery,
}) => {
  const {
    user,
    userProfile,
    role,
    isAdmin,
    isEditor,
    signInWithGoogle,
    signOutUser,
    demoRoleOverride,
    setDemoRoleOverride,
  } = useAuth();

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'default') {
      setDemoRoleOverride(null);
    } else {
      setDemoRoleOverride(val as UserRole);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && activeTab !== 'documents') {
      setActiveTab('documents');
    }
  };

  return (
    <header className="sticky top-0 z-40 relative overflow-hidden bg-[url('/viethoc-header-bg.png')] bg-cover bg-center text-white shadow-xl border-b border-amber-500/40">
      {/* Light subtle scrim to ensure sharp contrast without masking the viethoc.com background */}
      <div
        className="absolute inset-0 bg-black/15 pointer-events-none"
        aria-hidden="true"
      />
      {/* Subtle gold accent underline */}
      <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-amber-500/20 via-amber-400 to-amber-500/20 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Brand / Logo - Viện Việt Học */}
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 shrink-0 text-left cursor-pointer group"
            title="Viện Việt Học - Trang Chủ"
          >
            <div className="h-11 px-1.5 py-1 rounded-xl bg-white/95 border border-amber-400/50 flex items-center justify-center shadow-md group-hover:scale-102 transition-transform">
              <img
                src="/viethoc-logo.jpg"
                alt="Viện Việt Học"
                className="h-full w-auto object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white font-serif hidden sm:inline drop-shadow-md">
                  VIỆN VIỆT HỌC
                </span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-sm bg-amber-400/30 text-amber-200 border border-amber-400/50">
                  PWA
                </span>
              </div>
              <p className="text-[11px] text-amber-200/90 hidden lg:block font-medium drop-shadow-xs">
                Thư Viện & Cổng Tra Cứu Toàn Văn
              </p>
            </div>
          </button>

          {/* Quick Search in Header */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 max-w-md hidden md:block mx-2 lg:mx-4"
          >
            <div className="relative">
              <Search className="w-4 h-4 text-amber-200/80 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="header-search-input"
                type="text"
                placeholder="Tìm kiếm toàn văn tài liệu HTML & PDF..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (activeTab === 'home' && searchQuery) {
                    setActiveTab('documents');
                  }
                }}
                className="w-full bg-black/35 hover:bg-black/45 focus:bg-black/60 border border-amber-400/40 focus:border-amber-400 rounded-lg pl-9 pr-4 py-1.5 text-xs text-white placeholder-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-400/40 transition backdrop-blur-xs"
              />
            </div>
          </form>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-1.5">
            <button
              id="nav-tab-home"
              onClick={() => setActiveTab('home')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'home'
                  ? 'bg-amber-400 text-stone-950 shadow-sm'
                  : 'text-stone-100 hover:text-white hover:bg-white/15'
              }`}
            >
              <span>Trang Chủ</span>
            </button>

            <button
              id="nav-tab-documents"
              onClick={() => setActiveTab('documents')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'documents'
                  ? 'bg-amber-400 text-stone-950 shadow-sm'
                  : 'text-stone-100 hover:text-white hover:bg-white/15'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Kho Tài Liệu</span>
            </button>

            <button
              id="nav-tab-articles"
              onClick={() => setActiveTab('articles')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'articles'
                  ? 'bg-amber-400 text-stone-950 shadow-sm'
                  : 'text-stone-100 hover:text-white hover:bg-white/15'
              }`}
            >
              <Newspaper className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tin Tức & Sinh Hoạt</span>
              <span className="sm:hidden">Tin Tức</span>
            </button>

            <button
              id="nav-tab-about"
              onClick={() => setActiveTab('about')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'about'
                  ? 'bg-amber-400 text-stone-950 shadow-sm'
                  : 'text-stone-100 hover:text-white hover:bg-white/15'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Giới Thiệu</span>
            </button>

            {/* Editor Action: Tải lên tài liệu */}
            {isEditor && (
              <button
                id="btn-upload-doc-header"
                onClick={onOpenUpload}
                className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/25 hover:bg-amber-500/35 text-amber-200 border border-amber-400/50 transition shadow-xs"
                title="Tải lên tài liệu HTML hoặc PDF mới"
              >
                <Upload className="w-3.5 h-3.5 text-amber-300" />
                <span>Tải Lên</span>
              </button>
            )}

            {/* Editor Action: Đăng bài viết */}
            {isEditor && (
              <button
                id="btn-new-article-header"
                onClick={onOpenNewArticle}
                className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/15 hover:bg-white/25 text-white border border-white/25 transition"
                title="Đăng bài viết hoặc thông báo sinh hoạt mới"
              >
                <PlusCircle className="w-3.5 h-3.5 text-amber-300" />
                <span>Đăng Tin</span>
              </button>
            )}

            {/* Admin Action: Quản lý phân quyền */}
            {isAdmin && (
              <button
                id="btn-role-manager-header"
                onClick={onOpenRoleManager}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-amber-500/25 hover:bg-amber-500/35 text-amber-200 border border-amber-400/50 transition"
                title="Quản lý phân quyền Quản trị viên, Biên tập viên, Độc giả"
              >
                <Shield className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden md:inline">Phân Quyền</span>
              </button>
            )}
          </nav>

          {/* Right Section: PWA Install, Role Switcher & Auth */}
          <div className="flex items-center gap-2 shrink-0">
            <PWAInstallButton />

            {/* Role Switcher Pill for testing RBAC */}
            <div className="relative inline-flex items-center">
              <select
                id="role-preview-selector"
                value={demoRoleOverride || userProfile?.role || 'viewer'}
                onChange={handleRoleChange}
                className="text-[11px] font-medium bg-black/45 hover:bg-black/65 text-amber-200 border border-amber-400/40 rounded-lg px-2 py-1 focus:ring-1 focus:ring-amber-400 focus:outline-none cursor-pointer"
                title="Chuyển đổi vai trò để thử nghiệm quyền Độc giả / Biên tập viên / Quản trị viên"
              >
                <option value="viewer" className="bg-stone-900 text-white">Độc giả (Viewer)</option>
                <option value="editor" className="bg-stone-900 text-white">Biên tập (Editor)</option>
                <option value="admin" className="bg-stone-900 text-white">Quản trị (Admin)</option>
              </select>
            </div>

            {/* Firebase Auth Controls */}
            {user ? (
              <div className="flex items-center gap-2 pl-1 border-l border-white/20">
                <div className="flex items-center gap-1.5">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      referrerPolicy="no-referrer"
                      className="w-7 h-7 rounded-full border border-amber-400/50"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-xs font-bold text-amber-300">
                      {(user.displayName || user.email || 'U')[0].toUpperCase()}
                    </div>
                  )}
                  <span className="text-xs font-medium text-amber-100 hidden lg:block max-w-[100px] truncate">
                    {user.displayName || user.email?.split('@')[0]}
                  </span>
                </div>
                <button
                  id="btn-signout"
                  onClick={signOutUser}
                  className="p-1.5 rounded-lg text-stone-300 hover:text-white hover:bg-white/15 transition"
                  title="Đăng xuất"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                id="btn-signin-google"
                onClick={signInWithGoogle}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold shadow-xs transition"
                title="Đăng nhập Google qua Firebase Auth"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Đăng Nhập</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="pb-3 md:hidden">
          <form onSubmit={handleSearchSubmit}>
            <div className="relative">
              <Search className="w-4 h-4 text-amber-200/80 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="mobile-search-input"
                type="text"
                placeholder="Tìm kiếm toàn văn tài liệu PDF & HTML..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (activeTab === 'home' && searchQuery) {
                    setActiveTab('documents');
                  }
                }}
                className="w-full bg-black/35 border border-amber-400/40 focus:border-amber-400 rounded-lg pl-9 pr-4 py-1.5 text-xs text-white placeholder-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
              />
            </div>
          </form>
        </div>
      </div>
    </header>
  );
};
