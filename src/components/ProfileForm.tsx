'use client';

import { useState, useEffect } from 'react';
import { User, Phone, MapPin, Lock, Camera, Loader2 } from 'lucide-react';

export default function ProfileForm() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    currentPassword: '',
    newPassword: '',
  });

  useEffect(() => {
    fetch('/api/users/profile')
      .then((res) => res.json())
      .then((data) => {
        setFormData((prev) => ({
          ...prev,
          name: data.name || '',
          phone: data.phone || '',
          address: data.address || '',
        }));
        setLoading(false);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        alert('Cập nhật thành công!');
        setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '' }));
      } else {
        alert(data.error || 'Có lỗi xảy ra');
      }
    } catch (error) {
      alert('Có lỗi xảy ra');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-cyan-500" /></div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-800 text-lg mb-2">Thông tin cơ bản</h3>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Họ và tên</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <User className="w-5 h-5" />
            </div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="block w-full pl-10 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Số điện thoại</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Phone className="w-5 h-5" />
            </div>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Địa chỉ</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <MapPin className="w-5 h-5" />
            </div>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Password Change */}
      <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-800 text-lg mb-2">Đổi mật khẩu</h3>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Mật khẩu hiện tại</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-5 h-5" />
            </div>
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              placeholder="Để trống nếu không muốn đổi"
              className="block w-full pl-10 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Mật khẩu mới</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-5 h-5" />
            </div>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Mật khẩu mới"
              className="block w-full pl-10 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="w-full py-3 px-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-2xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] flex justify-center items-center"
      >
        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Lưu thay đổi'}
      </button>
    </form>
  );
}
