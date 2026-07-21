'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Bell, Mail, Loader2, Save } from 'lucide-react';

export default function NotificationsSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);

  useEffect(() => {
    fetch('/api/users/profile')
      .then((res) => res.json())
      .then((data) => {
        if (data.email_notifications !== undefined) {
          setEmailNotifications(data.email_notifications);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email_notifications: emailNotifications }),
      });
      if (res.ok) {
        alert('Đã lưu cài đặt thông báo!');
      } else {
        alert('Có lỗi xảy ra khi lưu.');
      }
    } catch (error) {
      alert('Lỗi kết nối.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex-1 bg-slate-50 min-h-screen pb-24 md:pb-12">
      <div className="max-w-3xl mx-auto px-4 mt-6 space-y-6">
        <div className="flex items-center mb-6">
          <Link href="/ctv/account" className="mr-4 p-2 bg-white rounded-full shadow-sm hover:bg-slate-100 transition">
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 font-space tracking-wide">Cài đặt thông báo</h1>
        </div>
        
        {loading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex flex-col gap-6">
              
              <div className="flex items-start justify-between gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center shrink-0">
                    <Bell className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">Thông báo trong ứng dụng</h3>
                    <p className="text-slate-500 text-sm mt-1">
                      Nhận thông báo trực tiếp qua biểu tượng Chuông báo trên thanh công cụ khi đang mở trình duyệt.
                    </p>
                  </div>
                </div>
                <div className="shrink-0 mt-2">
                  <span className="px-3 py-1 bg-slate-200 text-slate-500 text-xs font-bold rounded-full">
                    Mặc định bật
                  </span>
                </div>
              </div>

              <div className="flex items-start justify-between gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">Thông báo qua Email</h3>
                    <p className="text-slate-500 text-sm mt-1">
                      Gửi email thông báo cho bạn khi có khách hàng mới gửi yêu cầu tư vấn hoặc có tin nhắn mới.
                    </p>
                  </div>
                </div>
                <div className="shrink-0 mt-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={emailNotifications}
                      onChange={(e) => setEmailNotifications(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                  </label>
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-200 mt-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full md:w-auto px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-2xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] flex justify-center items-center gap-2"
                >
                  {saving ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  Lưu thay đổi
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
