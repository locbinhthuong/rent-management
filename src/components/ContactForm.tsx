'use client';

import { useState } from 'react';
import { Send, MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function ContactForm({ contactInfo }: { contactInfo: any }) {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', content: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Có lỗi xảy ra');
      
      setSuccess(data.message);
      setFormData({ name: '', phone: '', email: '', content: '' });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Form */}
        <div className="p-8 md:p-12">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Liên Hệ Hỗ Trợ</h1>
          <p className="text-slate-600 mb-8">
            Bạn có câu hỏi hoặc cần hỗ trợ? Đội ngũ luôn sẵn sàng lắng nghe và giải đáp trong thời gian sớm nhất.
          </p>

          {success && <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 rounded-xl font-medium border border-emerald-200">{success}</div>}
          {error && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl font-medium border border-red-200">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">Họ và tên *</label>
                <input type="text" required placeholder="Nguyễn Văn A" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none text-slate-900 font-medium" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">Số điện thoại *</label>
                <input type="tel" required placeholder="0988..." value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none text-slate-900 font-medium" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">Email</label>
              <input type="email" placeholder="example@gmail.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none text-slate-900 font-medium" />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">Nội dung cần hỗ trợ *</label>
              <textarea required rows={5} placeholder="Chi tiết vấn đề bạn đang gặp phải..." value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none resize-none text-slate-900 font-medium"></textarea>
            </div>

            <button disabled={loading} type="submit" className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 transition-colors flex items-center justify-center gap-2">
              <Send className="w-5 h-5" /> {loading ? 'Đang gửi...' : 'Gửi yêu cầu'}
            </button>
          </form>
        </div>

        {/* Info */}
        <div className="bg-indigo-900 text-indigo-50 p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px]"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-[80px]"></div>

          <div className="relative z-10 space-y-10">
            <h2 className="text-2xl font-bold text-white">Thông tin liên hệ</h2>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="p-3 bg-indigo-800/50 rounded-xl shrink-0 h-12 w-12 flex flex-col items-center justify-center">
                  <MapPin className="w-6 h-6 text-indigo-300" />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">Văn phòng chính</h3>
                  <p className="text-indigo-200 text-sm leading-relaxed">{contactInfo.address || 'Chưa cập nhật'}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="p-3 bg-indigo-800/50 rounded-xl shrink-0 h-12 w-12 flex flex-col items-center justify-center">
                  <Phone className="w-6 h-6 text-indigo-300" />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">Hotline hỗ trợ</h3>
                  <p className="text-indigo-200 font-medium">{contactInfo.hotline || 'Chưa cập nhật'}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="p-3 bg-indigo-800/50 rounded-xl shrink-0 h-12 w-12 flex flex-col items-center justify-center">
                  <Mail className="w-6 h-6 text-indigo-300" />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">Email</h3>
                  <p className="text-indigo-200">{contactInfo.email || 'Chưa cập nhật'}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="p-3 bg-indigo-800/50 rounded-xl shrink-0 h-12 w-12 flex flex-col items-center justify-center">
                  <Clock className="w-6 h-6 text-indigo-300" />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">Giờ làm việc</h3>
                  <div className="text-indigo-200 text-sm space-y-1">
                    <p>Thứ 2 - Thứ 6: 08:00 - 17:30</p>
                    <p>Thứ 7: 08:00 - 12:00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
