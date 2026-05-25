'use client';

import { useState } from 'react';
import { X, Send, Lock } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function ContactModal({ postId, ctvId, postTitle, isOpen, onClose }: { postId: string, ctvId: string, postTitle: string, isOpen: boolean, onClose: () => void }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [ctvInfo, setCtvInfo] = useState<{ phone: string, name: string } | null>(null);
  const { data: session, status } = useSession();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_id: postId, ctv_id: ctvId })
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
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          <X className="w-5 h-5" />
        </button>
        
        {success && ctvInfo ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Kết nối thành công!</h3>
            <p className="text-slate-500 text-sm mb-4">Bạn có thể liên hệ trực tiếp với Cộng tác viên qua số điện thoại bên dưới:</p>
            
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-slate-500">Cộng tác viên: <span className="font-medium text-slate-700">{ctvInfo.name}</span></p>
              <p className="text-2xl font-bold text-indigo-600 mt-2">{ctvInfo.phone}</p>
            </div>
            
            <a href={`tel:${ctvInfo.phone}`} className="block w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 transition shadow-md">
              Gọi ngay
            </a>
          </div>
        ) : session ? (
          <>
            <h3 className="text-xl font-bold text-slate-800 mb-1">Xác nhận gửi yêu cầu tư vấn</h3>
            <p className="text-sm text-slate-500 mb-6 truncate" title={postTitle}>Phòng quan tâm: <span className="font-medium">{postTitle}</span></p>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
              <p className="text-sm text-blue-800 mb-2">Hệ thống sẽ tự động sử dụng thông tin từ tài khoản của bạn để gửi cho Cộng tác viên.</p>
              <p className="font-bold text-blue-900">Tên: {session.user?.name}</p>
            </div>

            <button disabled={loading} onClick={handleSubmit} className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 transition shadow-md flex justify-center items-center gap-2">
              <Send className="w-5 h-5" />
              {loading ? 'Đang gửi...' : 'Xác nhận & Nhận số điện thoại'}
            </button>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Yêu cầu đăng nhập</h3>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              Vui lòng đăng nhập hoặc tạo tài khoản miễn phí để nhận thông tin liên hệ của Cộng tác viên đăng bài này.
            </p>
            
            <div className="flex gap-3">
              <Link href="/login" className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition shadow-md">
                Đăng nhập ngay
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
