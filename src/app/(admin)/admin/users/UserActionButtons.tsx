'use client';

import { useState } from 'react';
import { Check, X, ShieldAlert, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function UserActionButtons({ userId, currentStatus }: { userId: string, currentStatus: string }) {
  const [loading, setLoading] = useState(false);
  const [optimisticStatus, setOptimisticStatus] = useState(currentStatus);
  const router = useRouter();

  const handleUpdate = async (newStatus: string) => {
    if (!confirm(`Bạn chắc chắn muốn đổi trạng thái thành ${newStatus === 'Active' ? 'Duyệt' : 'Khóa/Từ chối'}?`)) return;
    
    // Optimistic Update
    const previousStatus = optimisticStatus;
    setOptimisticStatus(newStatus);
    setLoading(true);
    
    try {
      const res = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (res.ok) {
        toast.success('Đã cập nhật trạng thái thành công');
        router.refresh(); // Still refresh to update server state in background
      } else {
        setOptimisticStatus(previousStatus); // Revert on error
        toast.error('Lỗi cập nhật');
      }
    } catch (err) {
      setOptimisticStatus(previousStatus); // Revert on error
      toast.error('Lỗi hệ thống');
    }
    setLoading(false);
  };

  if (optimisticStatus === 'Pending') {
    return (
      <div className="flex items-center justify-end gap-2">
        <button 
          onClick={() => handleUpdate('Active')}
          disabled={loading}
          className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 rounded-lg text-xs font-bold transition disabled:opacity-50 border border-emerald-500/20"
        >
          {loading ? <ShieldAlert className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Duyệt
        </button>
        <button 
          onClick={() => handleUpdate('Rejected')}
          disabled={loading}
          className="flex items-center gap-1 px-3 py-1.5 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg text-xs font-bold transition disabled:opacity-50 border border-red-500/20"
        >
          {loading ? <ShieldAlert className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />} Từ chối
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border ${optimisticStatus === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
        {optimisticStatus === 'Active' ? <><ShieldCheck className="w-3 h-3"/> Đã Duyệt</> : <><ShieldAlert className="w-3 h-3"/> Đã Khóa</>}
      </span>
      {optimisticStatus === 'Active' ? (
        <button onClick={() => handleUpdate('Rejected')} disabled={loading} className="text-red-400 hover:bg-red-500/20 p-1.5 rounded-lg transition ml-2 disabled:opacity-50" title="Khóa tài khoản">
          Khóa
        </button>
      ) : (
        <button onClick={() => handleUpdate('Active')} disabled={loading} className="text-emerald-400 hover:bg-emerald-500/20 p-1.5 rounded-lg transition ml-2 disabled:opacity-50" title="Mở khóa">
          Mở Khóa
        </button>
      )}
    </div>
  );
}
