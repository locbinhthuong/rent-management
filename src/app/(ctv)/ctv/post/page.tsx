'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, DollarSign, Home, Bolt, FileText, Users, Image as ImageIcon, Send, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { getAllProvinces, getDistrictsByProvince } from '@/lib/data/provinces';
const ImageUpload = dynamic(() => import('@/components/ImageUpload'), { ssr: false });
const MapPicker = dynamic(() => import('@/components/MapPicker'), { ssr: false });
import CTVMobileHeader from '@/components/ctv/CTVMobileHeader';

export default function CreatePostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [categories, setCategories] = useState([]);
  const [amenities, setAmenities] = useState([]);

  useEffect(() => {
    // Fetch Property Types from Settings
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        if (data?.config?.propertyTypes) {
          setCategories(data.config.propertyTypes);
        }
      });
      
    // Fetch Amenities
    fetch('/api/admin/amenities')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setAmenities(data.filter((a: any) => a.isActive));
      });
  }, []);

  const [formData, setFormData] = useState({
    title: '',
    address: '',
    city: 'Hồ Chí Minh',
    price: '',
    property_type: '',
    electricity_price: '',
    water_price: '',
    service_price: '',
    contract_terms: 'Cọc 1 tháng - Hợp đồng 6 tháng',
    target_audience: 'Sinh viên, Người đi làm',
    images: [] as string[],
    description: '',
    location: null as [number, number] | null,
    district: '',
    amenities: [] as string[],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, city: e.target.value, district: '' });
  };

  const handleImageUpload = (url: string) => {
    setFormData(prev => ({ ...prev, images: [...prev.images, url] }));
  };

  const handleImageRemove = (url: string) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter(img => img !== url) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload: any = { ...formData };
      if (formData.location) {
        payload.location = {
          type: 'Point',
          coordinates: [formData.location[1], formData.location[0]] // [lng, lat]
        };
      }

      const res = await fetch('/api/ctv/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Lỗi tạo bài đăng');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/ctv');
        router.refresh();
      }, 2000);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-screen bg-transparent">
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-200 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Đăng bài thành công!</h2>
          <p className="text-slate-600 mb-6">Bài đăng của bạn đã được gửi đi và đang chờ Admin kiểm duyệt.</p>
          <p className="text-sm text-slate-500">Đang quay lại bảng điều khiển...</p>
        </div>
      </div>
    );
  }

  // Lấy danh sách Tỉnh/Thành và Quận/Huyện động
  const provincesList = getAllProvinces();
  const districtsList = formData.city ? getDistrictsByProvince(formData.city) : [];

  return (
    <main className="flex-1 bg-slate-50 h-screen overflow-y-auto pb-24 md:pb-12">
      <div className="max-w-3xl mx-auto px-4 mt-6">
        <CTVMobileHeader />
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 font-space tracking-wide">Đăng phòng mới</h2>
            <p className="text-slate-600 text-sm mt-1">Điền thông tin chi tiết để tạo bài đăng cho thuê mới.</p>
          </div>
          <Link href="/ctv" className="text-slate-600 hover:text-slate-900 transition bg-white p-2 rounded-full border border-slate-200">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </header>

        {/* Fake Progress Bar */}
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-full p-1.5 sm:p-2 mb-8 flex items-center justify-between gap-1">
          <div className="flex items-center gap-1 sm:gap-2 bg-blue-600 rounded-full py-1.5 px-2 sm:px-4 text-slate-900 text-[10px] sm:text-xs font-bold w-1/3 justify-center">
            <span className="w-4 h-4 sm:w-5 sm:h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">1</span>
            <span className="truncate">Thông tin</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 text-slate-600 text-[10px] sm:text-xs font-bold w-1/3 justify-center">
            <span className="w-4 h-4 sm:w-5 sm:h-5 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">2</span>
            <span className="truncate">Tiện ích</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 text-slate-600 text-[10px] sm:text-xs font-bold w-1/3 justify-center">
            <span className="w-4 h-4 sm:w-5 sm:h-5 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">3</span>
            <span className="truncate">Hình ảnh</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-500/10 text-red-400 rounded-xl border border-red-500/20 font-medium text-sm">
              {error}
            </div>
          )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cột 1 */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-cyan-400" /> Tiêu đề bài đăng *
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 outline-none text-slate-900 font-medium placeholder:text-slate-500"
                    placeholder="VD: Phòng trọ ban công rộng gần ĐH Bách Khoa..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-cyan-400" /> Địa chỉ chi tiết *
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 outline-none text-slate-900 font-medium placeholder:text-slate-500"
                    placeholder="Tên đường, phường, khu vực..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-cyan-400" /> Tỉnh/Thành *
                    </label>
                    <select
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleCityChange}
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 outline-none text-slate-900 font-medium"
                    >
                      <option value="">Chọn Tỉnh/Thành</option>
                      {provincesList.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-cyan-400" /> Khu vực (Quận) *
                    </label>
                    <select
                      name="district"
                      required
                      value={formData.district}
                      onChange={handleChange}
                      disabled={!formData.city}
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 outline-none text-slate-900 font-medium disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed"
                    >
                      <option value="">{formData.city ? "Chọn khu vực" : "Chọn Tỉnh/Thành trước"}</option>
                      {districtsList.map((loc: string) => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-cyan-400" /> Ghim Vị trí trên Bản đồ *
                  </label>
                  <MapPicker 
                    position={formData.location} 
                    onPositionChange={(pos) => setFormData(prev => ({ ...prev, location: pos }))} 
                    city={formData.city} 
                    district={(formData as any).district} 
                  />
                  <p className="text-xs text-slate-600 mt-2">Bấm vào bản đồ để chọn tọa độ chính xác của phòng trọ. Việc này giúp khách hàng tìm kiếm dễ dàng hơn.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-cyan-400" /> Giá / Tháng *
                    </label>
                    <input
                      type="number"
                      name="price"
                      required
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 outline-none text-slate-900 font-medium placeholder:text-slate-500"
                      placeholder="3500000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                      <Home className="w-4 h-4 text-cyan-400" /> Loại nhà trọ
                    </label>
                    <select
                      name="property_type"
                      value={formData.property_type}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 outline-none text-slate-900 font-medium"
                    >
                      {categories.map((cat: string) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                      {categories.length === 0 && <option value="">Đang tải loại phòng...</option>}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                    <Bolt className="w-4 h-4 text-cyan-400" /> Tiện ích có sẵn
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {amenities.map((amenity: any) => (
                      <label key={amenity._id} className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-slate-50 transition">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 text-cyan-500 rounded border-slate-300 focus:ring-cyan-500"
                          checked={formData.amenities.includes(amenity.name)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData(prev => ({ ...prev, amenities: [...prev.amenities, amenity.name] }));
                            } else {
                              setFormData(prev => ({ ...prev, amenities: prev.amenities.filter(a => a !== amenity.name) }));
                            }
                          }}
                        />
                        <span className="text-sm font-medium text-slate-700">{amenity.name}</span>
                      </label>
                    ))}
                  </div>
                  {amenities.length === 0 && <p className="text-xs text-slate-500">Đang tải tiện ích...</p>}
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-cyan-400" /> Hình ảnh phòng trọ *
                  </label>
                  <ImageUpload 
                    value={formData.images}
                    onChange={handleImageUpload}
                    onRemove={handleImageRemove}
                  />
                  <p className="text-xs text-slate-600 mt-2">Upload ít nhất 1 ảnh (khuyến khích tỉ lệ ngang 4:3).</p>
                </div>
              </div>

              {/* Cột 2 */}
              <div className="space-y-6">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-6">
                  <label className="block text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Bolt className="w-4 h-4 text-cyan-500" /> Chi phí Điện - Nước - Dịch vụ
                  </label>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-slate-600 w-24">Giá điện</span>
                      <input type="number" name="electricity_price" value={formData.electricity_price} onChange={handleChange} placeholder="VD: 3500 (VNĐ/kWh)" className="flex-1 px-4 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500/50 outline-none text-slate-900 font-medium" />
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-slate-600 w-24">Giá nước</span>
                      <input type="number" name="water_price" value={formData.water_price} onChange={handleChange} placeholder="VD: 100000 (VNĐ/người)" className="flex-1 px-4 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500/50 outline-none text-slate-900 font-medium" />
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-slate-600 w-24">Phí dịch vụ</span>
                      <input type="number" name="service_price" value={formData.service_price} onChange={handleChange} placeholder="VD: 150000 (VNĐ/tháng)" className="flex-1 px-4 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500/50 outline-none text-slate-900 font-medium" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-cyan-400" /> Điều khoản hợp đồng
                  </label>
                  <input
                    type="text"
                    name="contract_terms"
                    value={formData.contract_terms}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 outline-none text-slate-900 font-medium placeholder:text-slate-500"
                    placeholder="Cọc 1 tháng, Hợp đồng 6-12 tháng"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                    <Users className="w-4 h-4 text-cyan-400" /> Đối tượng phù hợp
                  </label>
                  <input
                    type="text"
                    name="target_audience"
                    value={formData.target_audience}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 outline-none text-slate-900 font-medium placeholder:text-slate-500"
                    placeholder="Sinh viên, Dân văn phòng, Vợ chồng trẻ..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2">Mô tả chi tiết *</label>
                  <textarea
                    name="description"
                    required
                    value={formData.description}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 outline-none resize-none text-slate-900 font-medium placeholder:text-slate-500"
                    placeholder="Mô tả nội thất, tiện ích xung quanh, giờ giấc..."
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="pt-8 flex gap-4">
              <Link href="/ctv" className="w-1/3 py-4 font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-full transition text-center flex items-center justify-center">
                Hủy
              </Link>
              <button
                type="submit"
                disabled={loading}
                className={`w-2/3 py-4 text-slate-900 font-bold rounded-full transition flex items-center justify-center gap-2 ${loading ? 'bg-blue-900/50' : 'bg-blue-400 hover:bg-blue-500 shadow-lg shadow-blue-500/20'}`}
              >
                {loading ? 'Đang xử lý...' : 'Đăng tin ngay'}
              </button>
            </div>
          </form>
      </div>
    </main>
  );
}
