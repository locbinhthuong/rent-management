'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ShieldCheck, User, Phone, ArrowLeft } from 'lucide-react';
import { signIn, getSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import LocusLogo from '@/components/LocusLogo';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'Customer' | 'CTV'>('Customer');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [registeredEmail, setRegisteredEmail] = useState('');

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
        const session = await getSession();
        if (session?.user?.role === 'Admin') {
          router.push('/admin');
        } else if (session?.user?.role === 'CTV') {
          router.push('/ctv');
        } else {
          router.push('/');
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
        if (data.requiresVerification) {
          setSuccess(data.message);
          setRegisteredEmail(data.email);
          setShowVerification(true);
          setLoading(false);
        } else {
          setSuccess(data.message || 'Đăng ký tài khoản thành công! Vui lòng Đăng nhập.');
          setIsLogin(true);
          setPassword('');
          setLoading(false);
        }
      }
    } catch(err) {
      setError('Đã xảy ra lỗi hệ thống, vui lòng thử lại sau');
      setLoading(false);
    }
  };

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: registeredEmail, code: verificationCode }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Mã xác thực không hợp lệ');
        setLoading(false);
      } else {
        setSuccess('Xác thực email thành công! Vui lòng đăng nhập.');
        setShowVerification(false);
        setIsLogin(true);
        setPassword('');
        setVerificationCode('');
        setLoading(false);
      }
    } catch (err) {
      setError('Đã xảy ra lỗi, vui lòng thử lại');
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-8 overflow-hidden">
      {/* Full-screen Background Image */}
      <Image 
        src="/login-bg.png" 
        alt="Background" 
        fill 
        priority
        className="object-cover object-center z-0"
      />
      
      {/* Dark Gradient Overlay for readability */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-black/70 via-black/40 to-indigo-900/40 backdrop-blur-[2px]" />

      <Link 
        href="/" 
        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-slate-700 hover:text-slate-900 transition group bg-black/20 px-4 py-2 rounded-full backdrop-blur-md border border-slate-200"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Trang chủ</span>
      </Link>

      {/* Central Glassmorphism Panel */}
      <div className="relative z-10 max-w-[420px] w-full rounded-3xl overflow-hidden backdrop-blur-xl bg-slate-200 border border-slate-300 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
        
        {/* Header Section */}
        <div className="p-8 pb-6 text-center border-b border-slate-200 relative overflow-hidden flex flex-col items-center">
          {/* Glow Effect */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-indigo-500/50 rounded-full blur-[50px] -z-10" />
          
          <div className="mb-4">
            <LocusLogo width={50} height={50} variant="horizontal" className="scale-110" />
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight mt-2">
            {showVerification ? 'Xác thực Email' : isLogin ? 'Đăng nhập hệ thống' : 'Tạo tài khoản'}
          </h1>
          <p className="text-slate-500 text-sm mt-1.5 font-medium">
            Truy cập nền tảng môi giới hiện đại nhất
          </p>
        </div>

        {/* Tab Toggle */}
        {!showVerification && (
          <div className="flex border-b border-slate-200 bg-black/20">
          <button 
            className={`flex-1 py-3.5 text-sm font-bold text-center transition-all duration-300 ${isLogin ? 'text-slate-900 border-b-2 border-indigo-400 bg-slate-200/50' : 'text-slate-900/50 hover:text-slate-700 hover:bg-slate-200/50'}`}
            onClick={() => { setIsLogin(true); setError(''); setSuccess(''); }}
            type="button"
          >
            ĐĂNG NHẬP
          </button>
          <button 
            className={`flex-1 py-3.5 text-sm font-bold text-center transition-all duration-300 ${!isLogin ? 'text-slate-900 border-b-2 border-indigo-400 bg-slate-200/50' : 'text-slate-900/50 hover:text-slate-700 hover:bg-slate-200/50'}`}
            onClick={() => { setIsLogin(false); setError(''); setSuccess(''); }}
            type="button"
          >
            ĐĂNG KÝ
          </button>
        </div>
        )}

        {/* Form Content */}
        <div className="p-8 relative">
          {/* Subtle bottom glow */}
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-violet-500/20 rounded-full blur-[60px] -z-10 pointer-events-none" />

          {error && (
            <div className="mb-6 p-3 bg-red-100 border border-red-200 text-red-600 text-sm rounded-xl font-medium shadow-sm flex items-center justify-center text-center">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-3 bg-emerald-100 border border-emerald-200 text-emerald-700 text-sm rounded-xl font-medium shadow-sm flex items-center justify-center text-center">
              {success}
            </div>
          )}

          {showVerification ? (
            <form onSubmit={handleVerifyEmail} className="space-y-4">
              <p className="text-sm text-slate-600 mb-4 text-center font-medium">
                Vui lòng kiểm tra email <strong className="text-indigo-600">{registeredEmail}</strong> và nhập mã xác thực gồm 6 chữ số.
              </p>
              <div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-900/40 group-focus-within:text-indigo-300 transition-colors">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-black/30 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-900 placeholder-white/30 backdrop-blur-sm transition-all text-center tracking-widest text-xl font-bold"
                    placeholder="------"
                    maxLength={6}
                    required
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className={`w-full py-6 mt-6 rounded-xl font-bold text-base tracking-wide transition-all duration-300 ${loading ? 'bg-indigo-600/50' : 'bg-gradient-to-r from-indigo-500 to-violet-600 hover:shadow-[0_0_20px_rgba(99,102,241,0.6)] hover:scale-[1.02] border border-slate-300'}`}
              >
                {loading ? 'ĐANG XỬ LÝ...' : 'XÁC NHẬN EMAIL'}
              </Button>
              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => setShowVerification(false)}
                  className="text-sm text-indigo-500 hover:underline font-medium"
                >
                  Quay lại đăng ký
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-4">
            
            {!isLogin && (
              <div className="space-y-4">
                <div className="flex gap-3 mb-2">
                  <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl cursor-pointer transition-all border ${role === 'Customer' ? 'bg-indigo-600/30 border-indigo-400 text-slate-900 shadow-[0_0_15px_rgba(99,102,241,0.3)]' : 'bg-black/30 border-slate-200 text-slate-500 hover:bg-slate-200/50'}`}>
                    <input type="radio" name="role" value="Customer" checked={role === 'Customer'} onChange={() => setRole('Customer')} className="hidden" />
                    <span className="text-sm font-bold tracking-wide">KHÁCH</span>
                  </label>
                  <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl cursor-pointer transition-all border ${role === 'CTV' ? 'bg-indigo-600/30 border-indigo-400 text-slate-900 shadow-[0_0_15px_rgba(99,102,241,0.3)]' : 'bg-black/30 border-slate-200 text-slate-500 hover:bg-slate-200/50'}`}>
                    <input type="radio" name="role" value="CTV" checked={role === 'CTV'} onChange={() => setRole('CTV')} className="hidden" />
                    <span className="text-sm font-bold tracking-wide">MÔI GIỚI</span>
                  </label>
                </div>

                <div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-900/40 group-focus-within:text-indigo-300 transition-colors">
                      <User className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-black/30 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-900 placeholder-white/30 backdrop-blur-sm transition-all"
                      placeholder="Họ và Tên"
                      required={!isLogin}
                    />
                  </div>
                </div>

                <div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-900/40 group-focus-within:text-indigo-300 transition-colors">
                      <Phone className="w-5 h-5" />
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-black/30 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-900 placeholder-white/30 backdrop-blur-sm transition-all"
                      placeholder="Số điện thoại"
                      required={!isLogin}
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-900/40 group-focus-within:text-indigo-300 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-black/30 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-900 placeholder-white/30 backdrop-blur-sm transition-all"
                  placeholder="Email đăng nhập"
                  required
                />
              </div>
            </div>

            <div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-900/40 group-focus-within:text-indigo-300 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-black/30 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-900 placeholder-white/30 backdrop-blur-sm transition-all"
                  placeholder="Mật khẩu"
                  required
                />
              </div>
              {isLogin && (
                <div className="flex justify-end mt-3">
                  <a href="#" className="text-xs font-medium text-indigo-300 hover:text-slate-900 transition-colors hover:underline">
                    Quên mật khẩu?
                  </a>
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className={`w-full py-6 mt-6 rounded-xl font-bold text-base tracking-wide transition-all duration-300 ${loading ? 'bg-indigo-600/50' : 'bg-gradient-to-r from-indigo-500 to-violet-600 hover:shadow-[0_0_20px_rgba(99,102,241,0.6)] hover:scale-[1.02] border border-slate-300'}`}
            >
              {loading ? 'ĐANG XỬ LÝ...' : (isLogin ? 'ĐĂNG NHẬP' : 'TẠO TÀI KHOẢN')}
            </Button>
          </form>
          )}
        </div>
      </div>
    </div>
  );
}
