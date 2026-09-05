import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole, UserProfile } from '../types';
import {
  Shield,
  ShieldCheck,
  UserCheck,
  Eye,
  Edit3,
  X,
  CheckCircle,
  AlertCircle,
  Users
} from 'lucide-react';

interface RoleManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoleManagementModal: React.FC<RoleManagementModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user, userProfile, isAdmin, allUsers, setUserRole } = useAuth();
  const [updatingUid, setUpdatingUid] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Prepare user list including currently logged in user if not in allUsers
  const userList: UserProfile[] = [...allUsers];
  if (userProfile && !userList.some((u) => u.uid === userProfile.uid)) {
    userList.unshift(userProfile);
  }

  // If list is empty (e.g. initial demo), provide demonstration rows
  if (userList.length === 0) {
    userList.push(
      {
        uid: user?.uid || 'usr-admin-1',
        email: user?.email || 'lyvuong@viethoc.com',
        displayName: user?.displayName || 'Lý Vương (Quản trị viên)',
        role: 'admin',
        createdAt: new Date().toISOString(),
      },
      {
        uid: 'usr-editor-sample',
        email: 'bien-tap@viethoc.com',
        displayName: 'Ban Biên Tập Viện Việt Học',
        role: 'editor',
        createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
      },
      {
        uid: 'usr-viewer-sample',
        email: 'hoc-gia@nghiencuu.edu',
        displayName: 'Học Giả Nghiên Cứu',
        role: 'viewer',
        createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
      }
    );
  }

  const handleRoleSelect = async (targetUid: string, newRole: UserRole) => {
    setUpdatingUid(targetUid);
    setSuccessMsg(null);
    setErrorMsg(null);

    const roleName = newRole === 'admin' ? 'Quản trị viên' : newRole === 'editor' ? 'Biên tập viên' : 'Độc giả';

    try {
      await setUserRole(targetUid, newRole);
      setSuccessMsg(`Đã cập nhật vai trò người dùng thành ${roleName} thành công.`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      console.error('Failed to change role:', err);
      setErrorMsg('Không thể cập nhật quyền người dùng trên hệ thống.');
    } finally {
      setUpdatingUid(null);
    }
  };

  return (
    <div
      id="role-management-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto"
    >
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#1e2024] text-white border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-300">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white font-serif">
                Quản Trị Phân Quyền Người Dùng (RBAC)
              </h2>
              <p className="text-[11px] text-stone-400">
                Quản lý quyền hạn cho Quản trị viên, Biên tập viên và Độc giả
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

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status alerts */}
          {successMsg && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Role Explanations */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
              <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800 mb-1">
                <Eye className="w-4 h-4 text-stone-500" />
                <span>Độc Giả (Viewer)</span>
              </div>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                Đọc toàn bộ tài liệu, tìm kiếm toàn văn trong kho sách PDF & HTML, đọc tin tức sinh hoạt và tải tài liệu về máy.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-1">
                <Edit3 className="w-4 h-4 text-[#800020]" />
                <span>Biên Tập Viên (Editor)</span>
              </div>
              <p className="text-[11px] text-amber-900/80 leading-relaxed">
                Toàn quyền Độc giả + Tải lên văn kiện HTML & PDF, tự động trích xuất nội dung và đăng tin tức/thông báo mới.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200">
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-900 mb-1">
                <ShieldCheck className="w-4 h-4 text-rose-700" />
                <span>Quản Trị Viên (Admin)</span>
              </div>
              <p className="text-[11px] text-rose-900/80 leading-relaxed">
                Toàn quyền Biên tập viên + Thiết lập phân quyền người dùng, quản lý tài khoản và xóa văn kiện/bài viết.
              </p>
            </div>
          </div>

          {/* User List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-stone-500" />
                <span>Danh Sách Thành Viên & Vai Trò</span>
              </h3>
              <span className="text-[11px] text-stone-400">{userList.length} thành viên</span>
            </div>

            <div className="divide-y divide-stone-100 border border-stone-200 rounded-xl overflow-hidden bg-white">
              {userList.map((u) => {
                const isMasterAdmin = u.email?.toLowerCase() === 'lyvuong@viethoc.com';

                return (
                  <div
                    key={u.uid}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-stone-50 transition"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-stone-900 truncate">
                          {u.displayName || u.email?.split('@')[0] || 'Người dùng'}
                        </span>
                        {isMasterAdmin && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                            Quản Trị Tối Cao
                          </span>
                        )}
                        {u.uid === user?.uid && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-stone-100 text-stone-600">
                            Bạn
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-500 truncate">{u.email}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-stone-400 hidden sm:inline">Phân vai trò:</span>
                      <div className="inline-flex rounded-lg shadow-2xs border border-stone-200 p-0.5 bg-stone-100">
                        {(['viewer', 'editor', 'admin'] as UserRole[]).map((r) => {
                          const label = r === 'admin' ? 'Quản Trị' : r === 'editor' ? 'Biên Tập' : 'Độc Giả';
                          return (
                            <button
                              key={r}
                              onClick={() => handleRoleSelect(u.uid, r)}
                              disabled={updatingUid === u.uid || (isMasterAdmin && r !== 'admin')}
                              className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                                u.role === r
                                  ? r === 'admin'
                                    ? 'bg-rose-700 text-white shadow-xs'
                                    : r === 'editor'
                                    ? 'bg-[#800020] text-white shadow-xs'
                                    : 'bg-stone-800 text-white shadow-xs'
                                  : 'text-stone-600 hover:text-stone-900'
                              }`}
                            >
                              {label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-stone-50 border-t border-stone-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
