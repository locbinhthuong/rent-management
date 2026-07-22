import Link from 'next/link';
import { ArrowLeft, Check, Sparkles, Zap, Gem } from 'lucide-react';

export default function BangGiaPage() {
  const plans = [
    {
      name: "Cơ Bản (Miễn phí)",
      icon: <Sparkles className="w-6 h-6 text-slate-500" />,
      price: "0đ",
      desc: "Trải nghiệm sức mạnh của Locushome hoàn toàn miễn phí.",
      features: [
        "Đăng tối đa 5 tin miễn phí",
        "Hiển thị tin ở chế độ tiêu chuẩn",
        "Tải lên tối đa 5 ảnh / tin",
        "Quản lý thông tin qua trang cá nhân",
        "Hỗ trợ qua Email"
      ],
      color: "bg-slate-50",
      borderColor: "border-slate-200",
      btnColor: "bg-slate-800 hover:bg-slate-900",
    },
    {
      name: "Gói Pro",
      icon: <Zap className="w-6 h-6 text-amber-500" />,
      price: "199.000đ",
      period: "/tháng",
      desc: "Dành cho chủ trọ chuyên nghiệp cần tiếp cận nhiều khách hàng.",
      features: [
        "Đăng tin không giới hạn",
        "Nhãn nổi bật (Hot) cho tin đăng",
        "Ghim tin lên trang đầu 3 ngày/tuần",
        "Tải lên không giới hạn hình ảnh",
        "Thống kê lượt xem tin chi tiết",
        "Hỗ trợ ưu tiên 24/7 qua Hotline"
      ],
      color: "bg-amber-50 border-amber-200 shadow-xl shadow-amber-500/10 scale-105 z-10",
      borderColor: "border-amber-200",
      btnColor: "bg-amber-500 hover:bg-amber-600",
      isPopular: true
    },
    {
      name: "Gói VIP",
      icon: <Gem className="w-6 h-6 text-emerald-500" />,
      price: "499.000đ",
      period: "/tháng",
      desc: "Giải pháp tối ưu cho hệ thống nhà trọ lớn, môi giới.",
      features: [
        "Mọi quyền lợi của gói Pro",
        "Ghim tin trang chủ toàn thời gian",
        "Tin đăng hiển thị kích thước lớn",
        "Gắn banner quảng cáo nhà trọ",
        "Được đề xuất qua Email cho khách thuê",
        "Tư vấn tối ưu nội dung tin đăng"
      ],
      color: "bg-emerald-50",
      borderColor: "border-emerald-200",
      btnColor: "bg-emerald-600 hover:bg-emerald-700",
    }
  ];

  return (
    <main className="min-h-screen bg-slate-50 pt-8 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-500 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Về trang chủ
        </Link>
        
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">Bảng Giá Dịch Vụ</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Chi phí minh bạch, không phụ phí ẩn. Hãy chọn gói dịch vụ phù hợp nhất với nhu cầu kinh doanh phòng trọ của bạn.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <div key={i} className={`rounded-3xl p-8 border relative transition-transform ${plan.color}`}>
              {plan.isPopular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                  Được dùng nhiều nhất
                </div>
              )}
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-3 bg-white rounded-xl shadow-sm ${plan.borderColor} border`}>{plan.icon}</div>
                <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
              </div>
              
              <div className="mb-4">
                <span className="text-4xl font-extrabold text-slate-900">{plan.price}</span>
                {plan.period && <span className="text-slate-500 font-medium">{plan.period}</span>}
              </div>
              
              <p className="text-sm text-slate-600 mb-8 min-h-[40px]">{plan.desc}</p>
              
              <ul className="space-y-4 mb-8">
                {plan.features.map((feat, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <Check className={`w-5 h-5 shrink-0 ${plan.isPopular ? 'text-amber-500' : 'text-slate-400'}`} />
                    <span className="text-slate-700 font-medium text-sm">{feat}</span>
                  </li>
                ))}
              </ul>
              
              <button className={`w-full py-3 px-6 rounded-xl text-white font-bold transition-colors shadow-md ${plan.btnColor}`}>
                Chọn gói này
              </button>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-slate-500">
            Cần một gói dịch vụ được thiết kế riêng? <Link href="/lien-he" className="text-indigo-600 font-bold hover:underline">Liên hệ ngay với chúng tôi</Link>.
          </p>
        </div>
      </div>
    </main>
  );
}
