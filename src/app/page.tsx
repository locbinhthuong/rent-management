import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Phone, Home, Filter, Search } from 'lucide-react';

const MOCK_ROOMS = [
  {
    id: '1',
    title: 'Phòng trọ ban công thoáng mát, full nội thất Quận 7',
    price: 4500000,
    address: 'Lâm Văn Bền, Quận 7, TP.HCM',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop',
    ctv_phone: '0901234567',
  },
  {
    id: '2',
    title: 'Studio mini mới xây, an ninh, gần Lotte Mart',
    price: 3800000,
    address: 'Nguyễn Thị Thập, Quận 7, TP.HCM',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1e52408437?q=80&w=1974&auto=format&fit=crop',
    ctv_phone: '0901234568',
  },
  {
    id: '3',
    title: 'Căn hộ dịch vụ cao cấp 1PN riêng biệt, giờ giấc tự do',
    price: 6500000,
    address: 'Huỳnh Tấn Phát, Quận 7, TP.HCM',
    image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=2070&auto=format&fit=crop',
    ctv_phone: '0901234569',
  },
  {
    id: '4',
    title: 'Phòng trọ giá sinh viên, gần Đại học Tôn Đức Thắng',
    price: 2500000,
    address: 'Nguyễn Hữu Thọ, Quận 7, TP.HCM',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop',
    ctv_phone: '0901234570',
  },
];

export default function CustomerHome() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="bg-white sticky top-0 z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Home className="w-6 h-6 text-indigo-600" />
            <span className="font-bold text-xl text-slate-800">RentHome</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link href="/" className="text-indigo-600">Trang chủ</Link>
            <Link href="/(customer)/saved">Đã lưu</Link>
            <Link href="/(ctv)/dashboard" className="px-4 py-2 bg-slate-100 rounded-md hover:bg-slate-200 transition">Dành cho CTV</Link>
          </nav>
        </div>
      </header>

      {/* Hero Search */}
      <section className="bg-indigo-600 py-12 px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white text-center">Tìm phòng trọ ưng ý ngay hôm nay</h1>
          <div className="bg-white rounded-lg p-2 flex items-center shadow-lg">
            <div className="flex-1 flex items-center px-3 border-r border-slate-200 gap-2 text-slate-500">
              <Search className="w-5 h-5" />
              <input type="text" placeholder="Tìm theo khu vực, tên đường..." className="w-full bg-transparent outline-none text-slate-800" />
            </div>
            <button className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Lọc
            </button>
          </div>
        </div>
      </section>

      {/* Masonry Grid List */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-8">Phòng trọ mới nhất</h2>
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {MOCK_ROOMS.map((room) => (
            <div key={room.id} className="break-inside-avoid bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition group border border-slate-100">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                <Image
                  src={room.image}
                  alt={room.title}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-indigo-600 shadow-sm">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(room.price)}/tháng
                </div>
              </div>
              
              <div className="p-4 space-y-3">
                <h3 className="font-semibold text-slate-800 line-clamp-2 leading-tight">
                  {room.title}
                </h3>
                
                <div className="flex items-start gap-1.5 text-slate-500 text-sm">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                  <span className="line-clamp-1">{room.address}</span>
                </div>
                
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs text-slate-500">
                    Đăng bởi CTV
                  </div>
                  <a 
                    href={`https://zalo.me/${room.ctv_phone}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-medium hover:bg-blue-100 transition"
                  >
                    <Phone className="w-3 h-3" />
                    Zalo
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
