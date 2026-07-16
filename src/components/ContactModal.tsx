'use client';

import { useState, useEffect } from 'react';
import { X, Send, Lock, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function ContactModal({ postId, ctvId, postTitle, isOpen, onClose }: { postId: string, ctvId: string, postTitle: string, isOpen: boolean, onClose: () => void }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [ctvInfo, setCtvInfo] = useState<{ phone: string, name: string } | null>(null);
  const { data: session, status } = useSession();

  // Tự động điền nếu đã đăng nhập
  useEffect(() => {
    if (session?.user) {
      if (session.user.name && !name) setName(session.user.name);
    }
  }, [session]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_id: postId, ctv_id: ctvId, message })
      });
      if (res.ok) {
        const data = await res.json();
        setSuccess(true);
        setCtvInfo({ phone: data.ctvPhone, name: data.ctvName });
      } else {
        alert('Lỗi gửi thông tin');
      }
    } catch (err) {
      alert('Lỗi hệ thống');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative animate-in fade-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-600 hover:text-slate-600">
          <X className="w-5 h-5" />
        </button>
        
        {success && ctvInfo ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Gửi yêu cầu thành công!</h3>
            <p className="text-slate-500 text-sm mb-4">Bạn có thể liên hệ trực tiếp với chuyên viên tư vấn qua số điện thoại bên dưới:</p>
            
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-slate-500">Chuyên viên tư vấn: <span className="font-medium text-slate-700">{ctvInfo.name}</span></p>
              <p className="text-2xl font-bold text-indigo-600 mt-2">{ctvInfo.phone}</p>
            </div>
            
            <a href={`tel:${ctvInfo.phone}`} className="block w-full flex items-center justify-center bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 transition shadow-md">
              Gọi điện ngay
            </a>
          </div>
        ) : (
          <>
            <h3 className="text-xl font-bold text-slate-800 mb-1">Yêu cầu gọi lại tư vấn</h3>
            <p className="text-sm text-slate-500 mb-6 truncate" title={postTitle}>Phòng quan tâm: <span className="font-medium">{postTitle}</span></p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Họ và tên <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nhập họ tên của bạn"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-800 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Số điện thoại <span className="text-red-500">*</span></label>
                <input 
                  type="tel" 
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Nhập số điện thoại để CTV gọi lại"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-800 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-1">Lời nhắn bổ sung (tùy chọn)</label>
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="VD: Tôi muốn đến xem phòng vào chiều nay lúc 17h..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-800 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
                  rows={3}
                />
              </div>

              <button disabled={loading} type="submit" className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 transition shadow-md flex justify-center items-center gap-2 disabled:opacity-50">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                {loading ? 'Đang gửi yêu cầu...' : 'Gửi yêu cầu ngay'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
