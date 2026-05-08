'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ShieldCheck } from 'lucide-react';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
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
        // middleware will handle redirection, but we can force a reload to let it take over
        router.refresh();
        router.push('/ctv'); // It will redirect to correct place or just redirect based on role in the future, for now push and let middleware handle or we can decode token.
        // Actually, best to just let middleware handle it after we push somewhere protected.
        // Let's just push to /ctv, if admin it'll kick to /admin or we can fetch session.
        // Let's use router.replace
        router.replace('/ctv'); // Assuming CTV is default, Admin will need a separate redirect if we want it perfect, but let's keep it simple.
      }
    } catch (err) {
      setError('Đã xảy ra lỗi, vui lòng thử lại');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-indigo-600 p-6 text-center text-white">
          <ShieldCheck className="w-12 h-12 mx-auto mb-3 text-indigo-200" />
          <h1 className="text-2xl font-bold">Đăng nhập Hệ thống</h1>
          <p className="text-indigo-200 text-sm mt-1">Dành cho Quản trị viên và Cộng tác viên</p>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
              {error}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email / Số điện thoại</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="text"
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
              <div className="flex justify-end mt-2">
                <a href="#" className="text-sm font-medium text-indigo-600 hover:underline">Quên mật khẩu?</a>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white font-bold py-3 rounded-lg transition shadow-md mt-2 ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg'}`}
            >
              {loading ? 'Đang xử lý...' : 'Đăng nhập'}
            </button>
          </form>
        </div>
        
        <div className="bg-slate-50 p-4 border-t border-slate-100 text-center text-sm text-slate-500">
          Khách hàng không cần đăng nhập để tìm phòng.<br/>
          <a href="/" className="text-indigo-600 font-medium hover:underline mt-1 inline-block">Quay lại trang chủ Khách Hàng</a>
        </div>
      </div>
    </div>
  );
}
