import Link from 'next/link';
import { ArrowLeft, Lock, Database, EyeOff, ShieldCheck } from 'lucide-react';

export default function BaoMatPage() {
  return (
    <main className="min-h-screen bg-slate-50 pt-8 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-emerald-500 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Về trang chủ
        </Link>
        
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200">
          <div className="flex items-center gap-4 mb-8 border-b border-slate-100 pb-8">
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center shrink-0">
              <ShieldCheck className="w-8 h-8 text-emerald-500" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Chính Sách Bảo Mật</h1>
              <p className="text-slate-500 mt-1">Cập nhật lần cuối: 22/07/2026</p>
            </div>
          </div>

          <div className="space-y-8 text-slate-700 leading-relaxed">
            <section>
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-3">
                <Database className="w-5 h-5 text-emerald-500" /> 1. Thu thập thông tin
              </h3>
              <p>
                Khi sử dụng dịch vụ tại Locushome, chúng tôi có thể thu thập các thông tin cá nhân cơ bản như: Tên, Số điện thoại, Email, Địa chỉ, và các thông tin liên quan đến phòng trọ mà bạn đăng tải. Các thông tin này được cung cấp hoàn toàn tự nguyện bởi người dùng.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-3">
                <Lock className="w-5 h-5 text-emerald-500" /> 2. Sử dụng thông tin
              </h3>
              <p>
                Thông tin của bạn được sử dụng để:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-2">
                <li>Kết nối người cho thuê và người đi thuê một cách chính xác.</li>
                <li>Xác thực tài khoản và phòng chống gian lận, lừa đảo.</li>
                <li>Gửi các thông báo quan trọng về tài khoản và dịch vụ.</li>
                <li>Cải thiện trải nghiệm người dùng và chất lượng nền tảng.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-3">
                <EyeOff className="w-5 h-5 text-emerald-500" /> 3. Bảo vệ dữ liệu
              </h3>
              <p>
                Locushome cam kết <strong>không bán, trao đổi hay chia sẻ</strong> thông tin cá nhân của bạn cho bất kỳ bên thứ ba nào vì mục đích thương mại. Thông tin chỉ được tiết lộ khi có yêu cầu hợp pháp từ các cơ quan chức năng có thẩm quyền. Dữ liệu của bạn được mã hóa và bảo mật trên hệ thống máy chủ của chúng tôi.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-3">
                <ShieldCheck className="w-5 h-5 text-emerald-500" /> 4. Quyền của người dùng
              </h3>
              <p>
                Bạn có toàn quyền truy cập, chỉnh sửa hoặc xóa thông tin cá nhân của mình bất cứ lúc nào thông qua phần quản lý tài khoản. Nếu có bất kỳ thắc mắc nào về chính sách bảo mật, vui lòng liên hệ với bộ phận CSKH của chúng tôi để được giải đáp.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
