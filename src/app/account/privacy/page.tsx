import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Lock, Eye, FileCheck } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12">
      {/* App Header */}
      <header className="sticky top-0 z-50 bg-slate-50/80 backdrop-blur-xl border-b border-slate-200 h-16 flex items-center px-4">
        <Link href="/account" className="p-2 -ml-2 rounded-full hover:bg-slate-200 transition-colors text-slate-600">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-lg font-space font-bold tracking-wide ml-2 flex-1 text-center pr-9">Chính sách bảo mật</h1>
      </header>

      <main className="max-w-2xl mx-auto px-4 mt-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
          <div className="flex items-center justify-center w-16 h-16 bg-violet-100 rounded-2xl mb-6 mx-auto">
            <ShieldCheck className="w-8 h-8 text-violet-600" />
          </div>
          
          <h2 className="text-2xl font-bold font-space text-center text-slate-800 mb-8">
            Bảo vệ thông tin của bạn
          </h2>

          <div className="space-y-6 text-slate-600 text-sm md:text-base leading-relaxed">
            <section>
              <h3 className="flex items-center gap-2 font-bold text-slate-800 mb-3 text-base">
                <Lock className="w-5 h-5 text-blue-500" />
                1. Thu thập thông tin
              </h3>
              <p>
                Chúng tôi thu thập các thông tin cơ bản của bạn (Họ tên, Số điện thoại, Email) khi bạn đăng ký tài khoản hoặc gửi yêu cầu tư vấn phòng trọ. Điều này giúp chúng tôi hỗ trợ bạn tìm được không gian sống ưng ý nhất.
              </p>
            </section>

            <section>
              <h3 className="flex items-center gap-2 font-bold text-slate-800 mb-3 text-base">
                <Eye className="w-5 h-5 text-emerald-500" />
                2. Sử dụng thông tin
              </h3>
              <p>
                Thông tin của bạn hoàn toàn được giữ kín và chỉ được sử dụng trong nội bộ hệ thống để:
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Liên hệ tư vấn phòng trọ theo yêu cầu.</li>
                  <li>Gửi thông báo cập nhật về hợp đồng, hóa đơn.</li>
                  <li>Nâng cao chất lượng dịch vụ chăm sóc khách hàng.</li>
                </ul>
              </p>
            </section>

            <section>
              <h3 className="flex items-center gap-2 font-bold text-slate-800 mb-3 text-base">
                <FileCheck className="w-5 h-5 text-amber-500" />
                3. Cam kết bảo mật
              </h3>
              <p>
                Chúng tôi cam kết <strong>KHÔNG</strong> bán, chia sẻ hay trao đổi thông tin cá nhân của khách hàng cho bất kỳ bên thứ ba nào khác. Hệ thống máy chủ được bảo vệ bằng các công nghệ mã hóa hiện đại nhất.
              </p>
            </section>
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-100 text-center text-xs text-slate-400">
            Cập nhật lần cuối: 15/07/2026
          </div>
        </div>
      </main>
    </div>
  );
}
