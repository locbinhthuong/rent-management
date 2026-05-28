import Link from 'next/link';
import { Phone, Mail, MapPin, ShieldCheck, Globe, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Về chúng tôi */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-800">RentHome</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Kênh thông tin Phòng Trọ số 1 Việt Nam. Chuyên trang cung cấp thông tin cho thuê phòng trọ, căn hộ, nhà nguyên căn nhanh chóng, an toàn và hiệu quả nhất.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-indigo-600 hover:text-white transition">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-pink-600 hover:text-white transition">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Hỗ trợ khách hàng */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800">Về chúng tôi</h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li><Link href="#" className="hover:text-indigo-600 transition">Trang chủ</Link></li>
              <li><Link href="#" className="hover:text-indigo-600 transition">Giới thiệu</Link></li>
              <li><Link href="#" className="hover:text-indigo-600 transition">Quy chế hoạt động</Link></li>
              <li><Link href="#" className="hover:text-indigo-600 transition">Quy định sử dụng</Link></li>
              <li><Link href="#" className="hover:text-indigo-600 transition">Chính sách bảo mật</Link></li>
            </ul>
          </div>

          {/* Dịch vụ */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800">Hỗ trợ khách hàng</h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li><Link href="#" className="hover:text-indigo-600 transition">Hướng dẫn đăng tin</Link></li>
              <li><Link href="#" className="hover:text-indigo-600 transition">Bảng giá dịch vụ</Link></li>
              <li><Link href="#" className="hover:text-indigo-600 transition">Giải quyết khiếu nại</Link></li>
              <li><Link href="#" className="hover:text-indigo-600 transition">Tin tức phòng trọ</Link></li>
            </ul>
          </div>

          {/* Liên hệ */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800">Liên hệ với chúng tôi</h3>
            <ul className="space-y-4 text-sm text-slate-600">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-indigo-600 shrink-0" />
                <span>123 Đường Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-indigo-600 shrink-0" />
                <span className="font-bold">Hotline: 0987.654.321</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-indigo-600 shrink-0" />
                <span>hotro@renthome.vn</span>
              </li>
            </ul>
            <div className="pt-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200">
                <ShieldCheck className="w-5 h-5" />
                <span className="font-bold text-sm">Đã đăng ký Bộ Công Thương</span>
              </div>
            </div>
          </div>

        </div>

        <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>© {new Date().getFullYear()} RentHome.vn. All rights reserved.</p>
          <p>Thiết kế và phát triển với tâm huyết.</p>
        </div>
      </div>
    </footer>
  );
}
