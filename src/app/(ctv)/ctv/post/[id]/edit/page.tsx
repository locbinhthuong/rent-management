'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { MapPin, DollarSign, Home, Bolt, FileText, Users, Image as ImageIcon, Send, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { getAllProvinces, getDistrictsByProvince } from '@/lib/data/provinces';
const ImageUpload = dynamic(() => import('@/components/ImageUpload'), { ssr: false });

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [config, setConfig] = useState<{ propertyTypes: string[] }>({ propertyTypes: [] });

  const [formData, setFormData] = useState({
    title: '',
    address: '',
    city: 'Hồ Chí Minh',
    district: '',
    price: '',
    property_type: '',
    utility_costs: '',
    contract_terms: '',
    target_audience: '',
    images: [] as string[],
    description: '',
  });

  useEffect(() => {
    if (!id) return;
    // Fetch System Config and Post Data in parallel
    Promise.all([
      fetch('/api/admin/settings').then(res => res.json()),
      fetch(`/api/posts/${id}`).then(res => {
        if (!res.ok) throw new Error('Không tìm thấy bài đăng');
        return res.json();
      })
    ])
    .then(([configData, postData]) => {
      if (configData.config) {
        setConfig({ propertyTypes: configData.config.propertyTypes || [] });
      }
      if (postData.post) {
        setFormData({
          title: postData.post.title || '',
          address: postData.post.address || '',
          city: postData.post.city || 'Hồ Chí Minh',
          district: postData.post.district || '',
          price: postData.post.price || '',
          property_type: postData.post.property_type || '',
          utility_costs: postData.post.utility_costs || '',
          contract_terms: postData.post.contract_terms || '',
          target_audience: postData.post.target_audience || '',
          images: postData.post.images || [],
          description: postData.post.description || '',
        });
      }
    })
    .catch(err => setError(err.message))
    .finally(() => setInitialLoading(false));
  }, [id]);

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
      const res = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Lỗi cập nhật bài đăng');
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

  if (initialLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-transparent"><Loader2 className="w-8 h-8 animate-spin text-cyan-400" /></div>;
  }

  if (success) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-screen bg-transparent">
        <div className="bg-slate-900/50 backdrop-blur-xl p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/10 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-100 mb-2">Cập nhật thành công!</h2>
          <p className="text-slate-400 mb-6">Bài đăng của bạn đã được thay đổi.</p>
          <p className="text-sm text-slate-500">Đang quay lại bảng điều khiển...</p>
        </div>
      </div>
    );
  }

  const provincesList = getAllProvinces();
  const districtsList = formData.city ? getDistrictsByProvince(formData.city) : [];

  return (
    <main className="flex-1 bg-transparent h-screen overflow-y-auto pb-24 md:pb-12">
      <header className="bg-slate-900/50 backdrop-blur-xl p-4 border-b border-white/10 sticky top-0 z-10 shadow-sm flex items-center gap-4">
        <Link href="/ctv" className="text-slate-400 hover:text-cyan-400 transition bg-slate-800 hover:bg-cyan-500/20 p-2 rounded-full border border-white/5 hover:border-cyan-500/30">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h2 className="text-xl font-bold text-slate-100">Chỉnh sửa tin đăng phòng trọ</h2>
      </header>

      <div className="max-w-4xl mx-auto px-4 mt-8">
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/10 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white">
            <h3 className="text-lg font-bold">Cập nhật thông tin Rao vặt</h3>
            <p className="text-emerald-100 text-sm mt-1">Sửa đổi thông tin bài đăng của bạn.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {error && (
              <div className="p-4 bg-red-500/10 text-red-400 rounded-xl border border-red-500/20 font-medium">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cột 1 */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-200 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-400" /> Tiêu đề bài đăng *
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-900 border border-white/20 rounded-xl focus:ring-2 focus:ring-emerald-500/50 outline-none text-slate-100 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-200 mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-400" /> Địa chỉ chi tiết *
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-900 border border-white/20 rounded-xl focus:ring-2 focus:ring-emerald-500/50 outline-none text-slate-100 font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-200 mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-400" /> Tỉnh/Thành *
                    </label>
                    <select
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleCityChange}
                      className="w-full px-4 py-3 bg-slate-900 border border-white/20 rounded-xl focus:ring-2 focus:ring-emerald-500/50 outline-none text-slate-100 font-medium"
                    >
                      <option value="">Chọn Tỉnh/Thành</option>
                      {provincesList.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                      {formData.city && !provincesList.includes(formData.city) && (
                         <option value={formData.city}>{formData.city}</option>
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-200 mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-400" /> Khu vực (Quận/Huyện) *
                    </label>
                    <select
                      name="district"
                      required
                      value={formData.district || ''}
                      onChange={handleChange}
                      disabled={!formData.city}
                      className="w-full px-4 py-3 bg-slate-900 border border-white/20 rounded-xl focus:ring-2 focus:ring-emerald-500/50 outline-none disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-slate-100 font-medium"
                    >
                      <option value="">{formData.city ? "Chọn khu vực" : "Chọn Tỉnh/Thành trước"}</option>
                      {districtsList.map((loc: string) => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                      {formData.district && !districtsList.includes(formData.district) && (
                         <option value={formData.district}>{formData.district}</option>
                      )}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-200 mb-2 flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-emerald-400" /> Giá / Tháng *
                    </label>
                    <input
                      type="number"
                      name="price"
                      required
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-900 border border-white/20 rounded-xl focus:ring-2 focus:ring-emerald-500/50 outline-none text-slate-100 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-200 mb-2 flex items-center gap-2">
                      <Home className="w-4 h-4 text-emerald-400" /> Loại nhà trọ
                    </label>
                    <select
                      name="property_type"
                      value={formData.property_type}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-900 border border-white/20 rounded-xl focus:ring-2 focus:ring-emerald-500/50 outline-none text-slate-100 font-medium"
                    >
                      {config.propertyTypes.map((type: string) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                      {formData.property_type && !config.propertyTypes.includes(formData.property_type as never) && (
                         <option value={formData.property_type}>{formData.property_type}</option>
                      )}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-200 mb-2 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-emerald-400" /> Hình ảnh phòng trọ *
                  </label>
                  <ImageUpload 
                    value={formData.images}
                    onChange={handleImageUpload}
                    onRemove={handleImageRemove}
                  />
                  <p className="text-xs text-slate-400 mt-2">Upload ít nhất 1 ảnh (khuyến khích tỉ lệ ngang 4:3).</p>
                </div>
              </div>

              {/* Cột 2 */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-200 mb-2 flex items-center gap-2">
                    <Bolt className="w-4 h-4 text-emerald-400" /> Chính sách Điện - Nước - Dịch vụ
                  </label>
                  <input
                    type="text"
                    name="utility_costs"
                    value={formData.utility_costs}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-900 border border-white/20 rounded-xl focus:ring-2 focus:ring-emerald-500/50 outline-none text-slate-100 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-200 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-400" /> Điều khoản hợp đồng
                  </label>
                  <input
                    type="text"
                    name="contract_terms"
                    value={formData.contract_terms}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-900 border border-white/20 rounded-xl focus:ring-2 focus:ring-emerald-500/50 outline-none text-slate-100 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-200 mb-2 flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-400" /> Đối tượng phù hợp
                  </label>
                  <input
                    type="text"
                    name="target_audience"
                    value={formData.target_audience}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-900 border border-white/20 rounded-xl focus:ring-2 focus:ring-emerald-500/50 outline-none text-slate-100 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-200 mb-2">Mô tả chi tiết *</label>
                  <textarea
                    name="description"
                    required
                    value={formData.description}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-3 bg-slate-900 border border-white/20 rounded-xl focus:ring-2 focus:ring-emerald-500/50 outline-none resize-none text-slate-100 font-medium"
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 flex justify-end gap-4">
              <Link href="/ctv" className="px-6 py-3 font-bold text-slate-400 hover:bg-white/5 rounded-xl transition">
                Hủy bỏ
              </Link>
              <button
                type="submit"
                disabled={loading}
                className={`px-8 py-3 text-white font-bold rounded-xl shadow-md transition flex items-center gap-2 ${loading ? 'bg-emerald-900/50' : 'bg-emerald-600 hover:bg-emerald-700 shadow-[0_0_15px_rgba(16,185,129,0.5)]'}`}
              >
                <Send className="w-5 h-5" />
                {loading ? 'Đang cập nhật...' : 'Cập nhật bài đăng'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
