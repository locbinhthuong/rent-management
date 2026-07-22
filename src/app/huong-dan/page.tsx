import Link from 'next/link';
import { ArrowLeft, UserPlus, PencilLine, Image as ImageIcon, Send, CheckCircle2 } from 'lucide-react';

export default function HuongDanPage() {
  const steps = [
    {
      icon: <UserPlus className="w-6 h-6 text-blue-500" />,
      title: "Bước 1: Đăng nhập / Đăng ký",
      content: "Để đăng tin, bạn cần có một tài khoản Cộng tác viên (CTV) hoặc Chủ trọ trên hệ thống. Truy cập mục Đăng nhập, sử dụng tài khoản Google để thao tác nhanh chóng và bảo mật nhất."
    },
    {
      icon: <PencilLine className="w-6 h-6 text-emerald-500" />,
      title: "Bước 2: Điền thông tin phòng trọ",
      content: "Chọn 'Đăng tin mới' trên bảng điều khiển. Điền đầy đủ và chính xác các thông tin như: Tiêu đề, Giá thuê, Diện tích, Vị trí (chọn thả ghim trên bản đồ), Điện nước, và các tiện ích có sẵn."
    },
    {
      icon: <ImageIcon className="w-6 h-6 text-purple-500" />,
      title: "Bước 3: Tải hình ảnh chân thực",
      content: "Một tin đăng có hình ảnh sáng sủa, rõ nét sẽ thu hút khách thuê gấp 3 lần. Hãy chụp ảnh phòng, nhà vệ sinh, không gian chung, và mặt tiền. Hỗ trợ upload nhiều ảnh cùng lúc."
    },
    {
      icon: <Send className="w-6 h-6 text-cyan-500" />,
      title: "Bước 4: Gửi duyệt tin",
      content: "Sau khi kiểm tra lại toàn bộ thông tin, bấm nút 'Đăng bài'. Tin của bạn sẽ được chuyển sang trạng thái chờ duyệt. Quản trị viên sẽ xem xét nội dung và duyệt tin trong vòng 1-4 giờ làm việc."
    }
  ];

  return (
    <main className="min-h-screen bg-slate-50 pt-8 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-cyan-500 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Về trang chủ
        </Link>
        
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">Hướng Dẫn Đăng Tin</h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Chỉ với 4 bước đơn giản, bạn có thể đưa phòng trọ của mình tiếp cận với hàng ngàn người thuê tiềm năng trên hệ thống Locushome.
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="hidden md:block absolute left-8 top-8 bottom-8 w-0.5 bg-slate-100"></div>

            <div className="space-y-8 relative">
              {steps.map((step, index) => (
                <div key={index} className="flex flex-col md:flex-row gap-6">
                  <div className="shrink-0 flex items-center md:items-start gap-4 md:gap-0">
                    <div className="w-16 h-16 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center relative z-10">
                      {step.icon}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 md:hidden">{step.title}</h3>
                  </div>
                  <div className="flex-1 md:pt-4">
                    <h3 className="hidden md:block text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                    <p className="text-slate-600 leading-relaxed bg-slate-50 p-6 rounded-2xl border border-slate-100">
                      {step.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 p-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl text-white text-center">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-4 opacity-80" />
            <h3 className="text-2xl font-bold mb-2">Bạn đã sẵn sàng?</h3>
            <p className="opacity-90 mb-6">Đăng tin ngay để nhanh chóng lấp đầy phòng trống của bạn.</p>
            <Link href="/login" className="inline-block bg-white text-blue-600 font-bold px-8 py-3 rounded-full hover:bg-slate-50 transition-colors shadow-lg">
              Đăng tin ngay
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
