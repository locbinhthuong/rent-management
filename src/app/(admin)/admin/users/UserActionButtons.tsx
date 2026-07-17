'use client';

import { useState } from 'react';
import { Check, X, ShieldAlert, ShieldCheck, Edit, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import UserEditModal from './UserEditModal';

interface UserData {
  _id: string;
  name: string;
  phone: string;
  avatar: string;
  status: string;
}

export default function UserActionButtons({ user }: { user: UserData }) {
  const [loading, setLoading] = useState(false);
  const [optimisticStatus, setOptimisticStatus] = useState(user.status || 'Active');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const router = useRouter();

  const handleUpdateStatus = async (newStatus: string) => {
    let confirmMsg = `Bạn chắc chắn muốn duyệt tài khoản này?`;
    if (newStatus === 'Rejected') confirmMsg = `Bạn chắc chắn muốn từ chối tài khoản này?`;
    if (newStatus === 'Locked') confirmMsg = `Bạn chắc chắn muốn khóa tài khoản này? Tài khoản sẽ không thể đăng nhập.`;
    
    if (!confirm(confirmMsg)) return;
    
    // Optimistic Update
    const previousStatus = optimisticStatus;
    setOptimisticStatus(newStatus);
    setLoading(true);
    
    try {
      const res = await fetch(`/api/admin/users/${user._id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (res.ok) {
        toast.success('Đã cập nhật trạng thái thành công');
        router.refresh();
      } else {
        setOptimisticStatus(previousStatus);
        toast.error('Lỗi cập nhật');
      }
    } catch (err) {
      setOptimisticStatus(previousStatus);
      toast.error('Lỗi hệ thống');
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm(`CẢNH BÁO: Bạn chuẩn bị XÓA HOÀN TOÀN tài khoản ${user.name} và TẤT CẢ dữ liệu liên quan (Bài đăng, Khách hàng, Hợp đồng, Giao dịch...). Hành động này không thể hoàn tác. Bạn chắc chắn muốn tiếp tục?`)) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${user._id}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        toast.success('Đã xóa người dùng thành công');
        router.refresh();
      } else {
        const data = await res.json();
        toast.error(data.message || 'Lỗi xóa tài khoản');
      }
    } catch (err) {
      toast.error('Lỗi hệ thống');
    }
    setLoading(false);
  };

  if (optimisticStatus === 'Pending') {
    return (
      <div className="flex items-center justify-end gap-2">
        <button 
          onClick={() => handleUpdateStatus('Active')}
          disabled={loading}
          className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 rounded-lg text-xs font-bold transition disabled:opacity-50 border border-emerald-500/20"
        >
          {loading ? <ShieldAlert className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Duyệt
        </button>
        <button 
          onClick={() => handleUpdateStatus('Rejected')}
          disabled={loading}
          className="flex items-center gap-1 px-3 py-1.5 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg text-xs font-bold transition disabled:opacity-50 border border-red-500/20"
        >
          {loading ? <ShieldAlert className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />} Từ chối
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-end gap-2">
        <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border ${optimisticStatus === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
          {optimisticStatus === 'Active' ? <><ShieldCheck className="w-3 h-3"/> Đã Duyệt</> : <><ShieldAlert className="w-3 h-3"/> Đã Khóa</>}
        </span>
        
        {/* Status Toggle */}
        {optimisticStatus === 'Active' ? (
          <button onClick={() => handleUpdateStatus('Locked')} disabled={loading} className="text-red-400 hover:bg-red-500/20 p-1.5 rounded-lg transition ml-2 disabled:opacity-50" title="Khóa tài khoản">
            Khóa
          </button>
        ) : (
          <button onClick={() => handleUpdateStatus('Active')} disabled={loading} className="text-emerald-400 hover:bg-emerald-500/20 p-1.5 rounded-lg transition ml-2 disabled:opacity-50" title="Mở khóa">
            Mở Khóa
          </button>
        )}

        {/* Edit Button */}
        <button onClick={() => setIsEditModalOpen(true)} disabled={loading} className="text-blue-400 hover:bg-blue-500/20 p-1.5 rounded-lg transition disabled:opacity-50" title="Sửa thông tin">
          <Edit className="w-4 h-4" />
        </button>

        {/* Delete Button */}
        <button onClick={handleDelete} disabled={loading} className="text-rose-500 hover:bg-rose-500/20 p-1.5 rounded-lg transition disabled:opacity-50" title="Xóa tài khoản">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <UserEditModal 
        user={user} 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
      />
    </>
  );
}
