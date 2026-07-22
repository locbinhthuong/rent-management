import Link from 'next/link';
import { ArrowLeft, Building, Users, ShieldCheck, Zap } from 'lucide-react';

export default function GioiThieuPage() {
  return (
    <main className="min-h-screen bg-slate-50 pt-8 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-cyan-500 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Về trang chủ
        </Link>
        
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">Về Locushome</h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Nền tảng tìm phòng trọ thông minh, mang đến trải nghiệm thuê và cho thuê nhà dễ dàng, an toàn và minh bạch.
            </p>
          </div>

          <div className="space-y-8 text-slate-700 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Tầm nhìn & Sứ mệnh</h2>
              <p className="mb-4">
                Locushome ra đời với mong muốn giải quyết những khó khăn trong việc tìm kiếm không gian sống phù hợp của hàng triệu sinh viên và người đi làm. Chúng tôi xây dựng một hệ sinh thái kết nối trực tiếp giữa chủ nhà và người thuê, loại bỏ các rào cản và rủi ro không đáng có.
              </p>
              <p>
                Sứ mệnh của chúng tôi là ứng dụng công nghệ để chuẩn hóa thị trường cho thuê phòng trọ, mang lại sự <strong>an tâm</strong> cho người thuê và sự <strong>tiện lợi</strong> cho chủ nhà.
              </p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10">
              <div className="p-6 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-start gap-4">
                <div className="p-3 bg-cyan-100 text-cyan-600 rounded-xl"><Building className="w-6 h-6" /></div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Đa dạng lựa chọn</h3>
                  <p className="text-sm text-slate-600">Hàng ngàn phòng trọ, căn hộ mini được xác thực và cập nhật mỗi ngày.</p>
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-start gap-4">
                <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl"><ShieldCheck className="w-6 h-6" /></div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">An toàn tuyệt đối</h3>
                  <p className="text-sm text-slate-600">Thông tin minh bạch, nói không với tin giả và lừa đảo môi giới.</p>
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-start gap-4">
                <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl"><Zap className="w-6 h-6" /></div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Tìm kiếm thông minh</h3>
                  <p className="text-sm text-slate-600">Bộ lọc chi tiết giúp bạn tìm chính xác căn phòng ưng ý trong tíc tắc.</p>
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-orange-50 border border-orange-100 flex items-start gap-4">
                <div className="p-3 bg-orange-100 text-orange-600 rounded-xl"><Users className="w-6 h-6" /></div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Cộng đồng tin cậy</h3>
                  <p className="text-sm text-slate-600">Nơi kết nối những người thuê văn minh và chủ nhà thân thiện.</p>
                </div>
              </div>
            </div>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Câu chuyện của chúng tôi</h2>
              <p>
                Bắt nguồn từ những trải nghiệm thực tế đầy khó khăn khi đi tìm trọ của đội ngũ sáng lập, Locushome được xây dựng bằng cả tâm huyết. Chúng tôi tin rằng mỗi người đều xứng đáng có một không gian sống tốt, nơi họ có thể an tâm nghỉ ngơi sau những giờ học tập và làm việc căng thẳng.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
