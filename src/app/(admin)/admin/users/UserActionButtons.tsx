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
          className="flex items-center gap-1 px-3 py-1.5 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-lg text-xs font-bold transition disabled:opacity-50"
        >
          {loading ? <ShieldAlert className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Duyệt
        </button>
        <button 
          onClick={() => handleUpdate('Rejected')}
          disabled={loading}
          className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-xs font-bold transition disabled:opacity-50"
        >
          {loading ? <ShieldAlert className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />} Từ chối
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${optimisticStatus === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
        {optimisticStatus === 'Active' ? <><ShieldCheck className="w-3 h-3"/> Đã Duyệt</> : <><ShieldAlert className="w-3 h-3"/> Đã Khóa</>}
      </span>
      {optimisticStatus === 'Active' ? (
        <button onClick={() => handleUpdate('Rejected')} disabled={loading} className="text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition ml-2 disabled:opacity-50" title="Khóa tài khoản">
          Khóa
        </button>
      ) : (
        <button onClick={() => handleUpdate('Active')} disabled={loading} className="text-emerald-600 hover:bg-emerald-50 p-1.5 rounded-lg transition ml-2 disabled:opacity-50" title="Mở khóa">
          Mở Khóa
        </button>
      )}
    </div>
  );
}
