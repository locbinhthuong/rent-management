import Link from 'next/link';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function QuyDinhPage() {
  const rules = [
    {
      title: "1. Đăng tin minh bạch",
      content: "Mọi thông tin về phòng trọ, hình ảnh, giá cả, và các chi phí phát sinh phải được trình bày rõ ràng, trung thực. Nghiêm cấm các hành vi đăng tin ảo, lừa đảo, câu view."
    },
    {
      title: "2. Văn minh & Tôn trọng",
      content: "Các thành viên khi trao đổi, bình luận hoặc liên hệ qua nền tảng phải giữ thái độ văn minh, lịch sự. Cấm mọi hành vi xúc phạm, đe dọa hoặc dùng từ ngữ thô tục."
    },
    {
      title: "3. Quyền sở hữu trí tuệ",
      content: "Người đăng tin phải chịu trách nhiệm về bản quyền hình ảnh và nội dung do mình cung cấp. Locushome có quyền gỡ bỏ các nội dung vi phạm bản quyền mà không cần báo trước."
    },
    {
      title: "4. Bảo mật thông tin",
      content: "Không chia sẻ thông tin tài khoản, mật khẩu cho người khác. Locushome không bao giờ yêu cầu bạn cung cấp mật khẩu qua điện thoại hay tin nhắn."
    },
    {
      title: "5. Xử lý vi phạm",
      content: "Tài khoản vi phạm quy định sẽ bị cảnh cáo, khóa tạm thời hoặc vĩnh viễn tùy vào mức độ vi phạm. Trong trường hợp lừa đảo, chúng tôi sẽ phối hợp với cơ quan chức năng để xử lý."
    }
  ];

  return (
    <main className="min-h-screen bg-slate-50 pt-8 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-500 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Về trang chủ
        </Link>
        
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-6">Quy Định Sử Dụng</h1>
          <p className="text-slate-600 mb-10 leading-relaxed text-lg">
            Chào mừng bạn đến với Locushome. Để xây dựng một cộng đồng thuê nhà văn minh và an toàn, vui lòng đọc kỹ và tuân thủ các quy định dưới đây trước khi sử dụng dịch vụ của chúng tôi.
          </p>

          <div className="space-y-6">
            {rules.map((rule, index) => (
              <div key={index} className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex gap-4">
                <div className="shrink-0 mt-1">
                  <CheckCircle2 className="w-6 h-6 text-indigo-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{rule.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{rule.content}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-amber-50 border border-amber-200 rounded-2xl">
            <h3 className="font-bold text-amber-900 mb-2">Lưu ý quan trọng</h3>
            <p className="text-sm text-amber-800 leading-relaxed">
              Locushome có quyền thay đổi, chỉnh sửa quy định bất cứ lúc nào để phù hợp với tình hình thực tế. Việc bạn tiếp tục sử dụng nền tảng đồng nghĩa với việc bạn chấp nhận những thay đổi đó. Vui lòng cập nhật thường xuyên.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
