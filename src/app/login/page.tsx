'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ShieldCheck, User, Phone } from 'lucide-react';
import { signIn, getSession } from 'next-auth/react';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true); // Toggle giữa Đăng nhập và Đăng ký
  
  // States cho form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'Customer' | 'CTV'>('Customer');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError(res.error);
        setLoading(false);
      } else {
        // Fetch session to check role
        const session = await getSession();
        if (session?.user?.role === 'Admin') {
          window.location.href = '/admin';
        } else if (session?.user?.role === 'CTV') {
          window.location.href = '/ctv';
        } else {
          window.location.href = '/';
        }
      }
    } catch (err) {
      setError('Đã xảy ra lỗi, vui lòng thử lại');
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password, role }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.message || 'Lỗi đăng ký');
        setLoading(false);
      } else {
        setSuccess('Đăng ký tài khoản thành công! Vui lòng Đăng nhập.');
        setIsLogin(true); // Switch to login
        setPassword(''); // Clear password for security
        setLoading(false);
      }
    } catch(err) {
      setError('Đã xảy ra lỗi hệ thống, vui lòng thử lại sau');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-indigo-600 p-6 text-center text-white">
          <ShieldCheck className="w-12 h-12 mx-auto mb-3 text-indigo-200" />
          <h1 className="text-2xl font-bold">{isLogin ? 'Đăng nhập Hệ thống' : 'Tạo Tài khoản mới'}</h1>
          <p className="text-indigo-200 text-sm mt-1">Dành cho Khách hàng & Cộng tác viên</p>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-slate-200">
          <button 
            className={`flex-1 py-3 text-sm font-bold text-center ${isLogin ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
            onClick={() => { setIsLogin(true); setError(''); setSuccess(''); }}
            type="button"
          >
            ĐĂNG NHẬP
          </button>
          <button 
            className={`flex-1 py-3 text-sm font-bold text-center ${!isLogin ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
            onClick={() => { setIsLogin(false); setError(''); setSuccess(''); }}
            type="button"
          >
            ĐĂNG KÝ
          </button>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-600 text-sm rounded-lg font-medium">
              {success}
            </div>
          )}

          <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-4">
            
            {/* Registration Fields */}
            {!isLogin && (
              <>
                <div className="flex gap-4 mb-4">
                  <label className={`flex-1 flex items-center justify-center gap-2 p-3 border rounded-xl cursor-pointer transition ${role === 'Customer' ? 'bg-indigo-50 border-indigo-600 text-indigo-700 font-semibold' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                    <input type="radio" name="role" value="Customer" checked={role === 'Customer'} onChange={() => setRole('Customer')} className="hidden" />
                    <span>Khách Hàng</span>
                  </label>
                  <label className={`flex-1 flex items-center justify-center gap-2 p-3 border rounded-xl cursor-pointer transition ${role === 'CTV' ? 'bg-indigo-50 border-indigo-600 text-indigo-700 font-semibold' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                    <input type="radio" name="role" value="CTV" checked={role === 'CTV'} onChange={() => setRole('CTV')} className="hidden" />
                    <span>Cộng Tác Viên</span>
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Họ và Tên</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <User className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition"
                      placeholder="Nguyễn Văn A"
                      required={!isLogin}
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
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition"
                      placeholder="0912345678"
                      required={!isLogin}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Common Fields */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email / Tài khoản</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition"
                  placeholder="Nhập email của bạn..."
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Mật khẩu</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition"
                  placeholder="••••••••"
                  required
                />
              </div>
              {isLogin && (
                <div className="flex justify-end mt-2">
                  <a href="#" className="text-sm font-medium text-indigo-600 hover:underline">Quên mật khẩu?</a>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white font-bold py-3 rounded-lg transition shadow-md mt-4 ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg'}`}
            >
              {loading ? 'Đang xử lý...' : (isLogin ? 'Đăng nhập' : 'Đăng ký ngay')}
            </button>
          </form>
        </div>
        
        <div className="bg-slate-50 p-4 border-t border-slate-100 text-center text-sm text-slate-500">
          <a href="/" className="text-indigo-600 font-medium hover:underline inline-block">← Quay lại trang chủ</a>
        </div>
      </div>
    </div>
  );
}
