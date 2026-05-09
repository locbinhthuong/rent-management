'use client';

import { useState } from 'react';
import { X, Send } from 'lucide-react';

export default function ContactModal({ postId, ctvId, postTitle, isOpen, onClose }: { postId: string, ctvId: string, postTitle: string, isOpen: boolean, onClose: () => void }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_id: postId, ctv_id: ctvId, name, phone })
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 2000);
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
        
        {success ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Đã gửi thông tin!</h3>
            <p className="text-slate-500">Cộng tác viên sẽ liên hệ với bạn trong thời gian sớm nhất.</p>
          </div>
        ) : (
          <>
            <h3 className="text-xl font-bold text-slate-800 mb-1">Để lại thông tin tư vấn</h3>
            <p className="text-sm text-slate-500 mb-6 truncate" title={postTitle}>Phòng quan tâm: <span className="font-medium">{postTitle}</span></p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Tên của bạn</label>
                <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none" placeholder="Nguyễn Văn A" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Số điện thoại</label>
                <input required type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none" placeholder="0901234567" />
              </div>
              <button disabled={loading} type="submit" className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 transition mt-2 shadow-md">
                {loading ? 'Đang gửi...' : 'Gửi cho Cộng tác viên'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
