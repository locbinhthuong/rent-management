'use client';

import { useState } from 'react';
import { ArrowUpCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function BumpButton({ postId, isVip }: { postId: string, isVip?: boolean }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleBump = async () => {
    if (!confirm('Bạn có chắc chắn muốn đẩy tin này với phí 10,000 VNĐ không?')) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/ctv/posts/${postId}/bump`, {
        method: 'POST',
      });
      const data = await res.json();
      
      if (res.ok) {
        alert('Đẩy tin thành công!');
        router.refresh();
      } else {
        alert(data.message || 'Lỗi hệ thống');
      }
    } catch (err) {
      alert('Lỗi hệ thống');
    }
    setLoading(false);
  };

  return (
    <button 
      onClick={handleBump}
      disabled={loading}
      className={`ml-3 px-3 py-1.5 rounded-lg text-xs font-bold border flex items-center gap-1 transition ${isVip ? 'bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200' : 'bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-indigo-100'}`}
      title="Đẩy tin lên đầu (Phí 10K)"
    >
      <ArrowUpCircle className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
      {loading ? 'Đang xử lý...' : (isVip ? 'Gia hạn VIP' : 'Đẩy tin (10K)')}
    </button>
  );
}
