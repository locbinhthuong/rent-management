'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, DollarSign, Home, Bolt, FileText, Users, Image as ImageIcon, Send, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
const ImageUpload = dynamic(() => import('@/components/ImageUpload'), { ssr: false });

export default function CreatePostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    address: '',
    price: '',
    property_type: 'Phòng trọ sinh viên',
    utility_costs: 'Điện 3.5k/kwh - Nước 100k/người',
    contract_terms: 'Cọc 1 tháng - Hợp đồng 6 tháng',
    target_audience: 'Sinh viên, Người đi làm',
    images: [] as string[],
    description: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
      const res = await fetch('/api/ctv/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
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
      <div className="flex-1 flex flex-col items-center justify-center h-screen bg-slate-50">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Đăng bài thành công!</h2>
          <p className="text-slate-500 mb-6">Bài đăng của bạn đã được gửi đi và đang chờ Admin kiểm duyệt.</p>
          <p className="text-sm text-slate-400">Đang quay lại bảng điều khiển...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-50 min-h-screen pb-12">
      <header className="bg-white p-4 border-b border-slate-200 sticky top-0 z-10 shadow-sm flex items-center gap-4">
        <Link href="/ctv" className="text-slate-500 hover:text-indigo-600 transition bg-slate-100 hover:bg-indigo-50 p-2 rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h2 className="text-xl font-bold text-slate-800">Tạo tin đăng phòng trọ</h2>
      </header>

      <div className="max-w-4xl mx-auto px-4 mt-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white">
            <h3 className="text-lg font-bold">Thông tin Rao vặt chi tiết</h3>
            <p className="text-indigo-100 text-sm mt-1">Vui lòng điền thông tin thật chính xác để thu hút khách hàng.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 font-medium">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cột 1 */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-600" /> Tiêu đề bài đăng *
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none"
                    placeholder="VD: Phòng trọ ban công rộng gần ĐH Bách Khoa..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-indigo-600" /> Khu vực / Địa chỉ *
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none"
                    placeholder="Tên đường, phường, quận..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-indigo-600" /> Giá / Tháng *
                    </label>
                    <input
                      type="number"
                      name="price"
                      required
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none"
                      placeholder="3500000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                      <Home className="w-4 h-4 text-indigo-600" /> Loại nhà trọ
                    </label>
                    <select
                      name="property_type"
                      value={formData.property_type}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none bg-white"
                    >
                      <option value="Phòng trọ sinh viên">Phòng trọ sinh viên</option>
                      <option value="Chung cư mini">Chung cư mini</option>
                      <option value="Căn hộ dịch vụ (CHDV)">Căn hộ dịch vụ (CHDV)</option>
                      <option value="Ký túc xá / Sleepbox">Ký túc xá / Sleepbox</option>
                      <option value="Nhà nguyên căn">Nhà nguyên căn</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-indigo-600" /> Hình ảnh phòng trọ *
                  </label>
                  <ImageUpload 
                    value={formData.images}
                    onChange={handleImageUpload}
                    onRemove={handleImageRemove}
                  />
                  <p className="text-xs text-slate-500 mt-2">Upload ít nhất 1 ảnh (khuyến khích tỉ lệ ngang 4:3).</p>
                </div>
              </div>

              {/* Cột 2 */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <Bolt className="w-4 h-4 text-indigo-600" /> Chính sách Điện - Nước - Dịch vụ
                  </label>
                  <input
                    type="text"
                    name="utility_costs"
                    value={formData.utility_costs}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none"
                    placeholder="Điện 3.5k/kwh - Nước 100k/người - Dịch vụ 150k"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-600" /> Điều khoản hợp đồng
                  </label>
                  <input
                    type="text"
                    name="contract_terms"
                    value={formData.contract_terms}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none"
                    placeholder="Cọc 1 tháng, Hợp đồng 6-12 tháng"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-600" /> Đối tượng phù hợp
                  </label>
                  <input
                    type="text"
                    name="target_audience"
                    value={formData.target_audience}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none"
                    placeholder="Sinh viên, Dân văn phòng, Vợ chồng trẻ..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Mô tả chi tiết *</label>
                  <textarea
                    name="description"
                    required
                    value={formData.description}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none resize-none"
                    placeholder="Mô tả nội thất, tiện ích xung quanh, giờ giấc..."
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 flex justify-end gap-4">
              <Link href="/ctv" className="px-6 py-3 font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition">
                Hủy bỏ
              </Link>
              <button
                type="submit"
                disabled={loading}
                className={`px-8 py-3 text-white font-bold rounded-xl shadow-md transition flex items-center gap-2 ${loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg'}`}
              >
                <Send className="w-5 h-5" />
                {loading ? 'Đang gửi...' : 'Đăng bài kiểm duyệt'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
