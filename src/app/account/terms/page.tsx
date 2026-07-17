import Link from 'next/link';
import { ArrowLeft, FileText, CheckCircle2 } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12">
      {/* App Header */}
      <header className="sticky top-0 z-50 bg-slate-50/80 backdrop-blur-xl border-b border-slate-200 h-16 flex items-center px-4">
        <Link href="/account" className="p-2 -ml-2 rounded-full hover:bg-slate-200 transition-colors text-slate-600">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-lg font-space font-bold tracking-wide ml-2 flex-1 text-center pr-9">Điều khoản sử dụng</h1>
      </header>

      <main className="max-w-2xl mx-auto px-4 mt-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
          <div className="flex items-center justify-center w-16 h-16 bg-pink-100 rounded-2xl mb-6 mx-auto">
            <FileText className="w-8 h-8 text-pink-600" />
          </div>
          
          <h2 className="text-2xl font-bold font-space text-center text-slate-800 mb-8">
            Quy định chung
          </h2>

          <div className="space-y-5 text-slate-600 text-sm md:text-base leading-relaxed">
            <div className="flex gap-3 items-start">
              <CheckCircle2 className="w-5 h-5 text-pink-500 shrink-0 mt-0.5" />
              <p>Khách hàng cần cung cấp thông tin trung thực, chính xác khi đăng ký tư vấn và làm hợp đồng thuê phòng.</p>
            </div>
            
            <div className="flex gap-3 items-start">
              <CheckCircle2 className="w-5 h-5 text-pink-500 shrink-0 mt-0.5" />
              <p>Hệ thống không thu bất kỳ khoản phí nào từ người đi thuê đối với việc tư vấn, dẫn xem phòng.</p>
            </div>

            <div className="flex gap-3 items-start">
              <CheckCircle2 className="w-5 h-5 text-pink-500 shrink-0 mt-0.5" />
              <p>Mọi giao dịch cọc phòng, thanh toán chi phí cần được thực hiện thông qua hướng dẫn chính thức trên hệ thống hoặc làm việc trực tiếp tại văn phòng để đảm bảo quyền lợi.</p>
            </div>

            <div className="flex gap-3 items-start">
              <CheckCircle2 className="w-5 h-5 text-pink-500 shrink-0 mt-0.5" />
              <p>Chúng tôi có quyền từ chối phục vụ những khách hàng có hành vi quấy rối, lừa đảo hoặc vi phạm pháp luật hiện hành.</p>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-100 text-center text-xs text-slate-400">
            Có hiệu lực từ: 01/01/2026
          </div>
        </div>
      </main>
    </div>
  );
}
