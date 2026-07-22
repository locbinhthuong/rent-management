import Link from 'next/link';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200 max-w-lg w-full text-center">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>
        
        <h1 className="text-3xl font-extrabold text-slate-900 mb-4">
          Thanh toán thành công!
        </h1>
        
        <p className="text-slate-600 mb-8 leading-relaxed">
          Cảm ơn bạn đã nâng cấp gói dịch vụ. Hệ thống đã tự động ghi nhận thanh toán và cập nhật quyền lợi cho tài khoản của bạn.
        </p>
        
        <div className="space-y-3">
          <Link 
            href="/ctv" 
            className="flex items-center justify-center gap-2 w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 transition-colors"
          >
            Về trang quản lý CTV <ArrowRight className="w-5 h-5" />
          </Link>
          <Link 
            href="/ctv/post" 
            className="flex items-center justify-center gap-2 w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition-colors"
          >
            Đăng tin ngay
          </Link>
        </div>
      </div>
    </div>
  );
}
