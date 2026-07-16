'use client';

import { Phone, Lock } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function ContactButton({ postId, ctvId, postTitle, ctvPhone }: { postId: string, ctvId: string, postTitle: string, ctvPhone: string }) {
  const { data: session, status } = useSession();

  const handleAction = async (type: 'call' | 'zalo') => {
    try {
      fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_id: postId, ctv_id: ctvId, message: `Khách hàng bấm ${type === 'call' ? 'Gọi điện trực tiếp' : 'Nhắn tin Zalo'}` })
      }).catch(() => {});
    } catch (err) {}
    
    if (type === 'call') {
      window.location.href = `tel:${ctvPhone}`;
    } else {
      window.open(`https://zalo.me/${ctvPhone}`, '_blank');
    }
  };

  if (status === 'loading') return null;

  if (!session) {
    return (
      <div className="space-y-3 w-full">
        <Link 
          href="/login" 
          className="w-full flex items-center justify-center gap-2 bg-slate-800 text-white font-bold py-4 rounded-xl hover:bg-slate-700 transition shadow-md"
        >
          <Lock className="w-5 h-5" />
          Đăng nhập để xem Liên hệ
        </Link>
        <p className="text-xs text-center text-slate-500 leading-relaxed px-2">
          Hệ thống yêu cầu đăng nhập miễn phí để bảo vệ thông tin Cộng tác viên và lưu lịch sử xem phòng của bạn.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 w-full">
      <button 
        onClick={() => handleAction('call')}
        className="w-full flex items-center justify-center gap-3 bg-emerald-500 text-white font-bold py-4 rounded-xl hover:bg-emerald-600 transition shadow-[0_0_15px_rgba(16,185,129,0.2)]"
      >
        <Phone className="w-6 h-6" />
        <span className="text-lg">Gọi: {ctvPhone}</span>
      </button>

      <button 
        onClick={() => handleAction('zalo')}
        className="w-full flex items-center justify-center gap-3 bg-blue-500 text-white font-bold py-4 rounded-xl hover:bg-blue-600 transition shadow-[0_0_15px_rgba(59,130,246,0.2)]"
      >
        <span className="font-black text-xl leading-none">Zalo</span>
        <span className="text-lg">Nhắn tin Zalo</span>
      </button>
    </div>
  );
}