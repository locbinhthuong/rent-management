'use client';

import { Phone, Lock, MessageSquare, Send, ChevronDown, CheckCircle2, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';

export default function ContactButton({ postId, ctvId, postTitle, ctvPhone }: { postId: string, ctvId: string, postTitle: string, ctvPhone: string }) {
  const { data: session, status } = useSession();
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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

  const handleSubmitMessage = async () => {
    if (!message.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_id: postId, ctv_id: ctvId, message })
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          setShowForm(false);
          setSuccess(false);
          setMessage('');
        }, 3000);
      }
    } catch (err) {}
    setLoading(false);
  };

  if (status === 'loading') return null;

  if (!session) {
    return (
      <div className="space-y-3 w-full">
        <Link 
          href="/login" 
          className="w-full flex items-center justify-center gap-2 bg-slate-800 text-white font-bold py-4 rounded-xl hover:bg-slate-700 transition shadow-sm"
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
        className="w-full flex items-center justify-center gap-3 bg-emerald-500 text-white font-bold py-4 rounded-xl hover:bg-emerald-600 transition shadow-sm"
      >
        <Phone className="w-6 h-6" />
        <span className="text-lg tracking-wide">Gọi: {ctvPhone}</span>
      </button>

      <button 
        onClick={() => handleAction('zalo')}
        className="w-full flex items-center justify-center gap-3 bg-blue-500 text-white font-bold py-4 rounded-xl hover:bg-blue-600 transition shadow-sm"
      >
        <span className="font-black text-xl leading-none">Zalo</span>
        <span className="text-lg tracking-wide">Nhắn tin Zalo</span>
      </button>

      <button 
        onClick={() => setShowForm(!showForm)}
        className="w-full flex items-center justify-between px-4 py-4 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition"
      >
        <div className="flex items-center gap-3">
          <MessageSquare className="w-5 h-5 text-slate-500" />
          <span>Hỗ trợ tư vấn</span>
        </div>
        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${showForm ? 'rotate-180' : ''}`} />
      </button>

      {/* Slide down form */}
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showForm ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="pt-2">
          {success ? (
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex flex-col items-center justify-center text-center gap-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              <p className="font-bold text-emerald-700 text-sm">Gửi thành công!</p>
              <p className="text-xs text-emerald-600">Chuyên viên tư vấn sẽ liên hệ lại sớm nhất.</p>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
              <textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Bạn cần hỗ trợ thêm thông tin gì?"
                className="w-full bg-white border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 min-h-[80px] resize-none mb-2 text-slate-700 placeholder:text-slate-400"
              />
              <button 
                onClick={handleSubmitMessage}
                disabled={loading || !message.trim()}
                className="w-full bg-slate-900 text-white font-bold py-2.5 rounded-lg hover:bg-slate-800 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Gửi tin nhắn
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}