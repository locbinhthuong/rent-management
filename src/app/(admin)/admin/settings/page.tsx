'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, Plus, X, Loader2, Megaphone, MapPin, Home, FileText, Users, Settings, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const [announcementText, setAnnouncementText] = useState('');
  const [announcementActive, setAnnouncementActive] = useState(false);
  const [propertyTypes, setPropertyTypes] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [newPropertyType, setNewPropertyType] = useState('');
  const [newLocation, setNewLocation] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['system-config'],
    queryFn: async () => {
      const res = await fetch('/api/admin/settings');
      if (!res.ok) throw new Error('Failed to fetch config');
      return res.json();
    }
  });

  useEffect(() => {
    if (data?.config) {
      setAnnouncementText(data.config.announcement.text);
      setAnnouncementActive(data.config.announcement.isActive);
      setPropertyTypes(data.config.propertyTypes || []);
      setLocations(data.config.locations || []);
    }
  }, [data]);

  const updateMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to update config');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-config'] });
      alert('Cập nhật cấu hình thành công!');
    }
  });

  const handleSave = () => {
    updateMutation.mutate({
      announcement: { text: announcementText, isActive: announcementActive },
      propertyTypes,
      locations,
    });
  };

  const addPropertyType = () => {
    if (newPropertyType.trim() && !propertyTypes.includes(newPropertyType.trim())) {
      setPropertyTypes([...propertyTypes, newPropertyType.trim()]);
      setNewPropertyType('');
    }
  };

  const addLocation = (loc: string) => {
    if (loc.trim() && !locations.includes(loc.trim())) {
      setLocations([...locations, loc.trim()]);
      setNewLocation('');
    }
  };

  if (isLoading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-primary w-8 h-8" /></div>;

  return (
      <main className="flex-1 flex flex-col h-screen overflow-y-auto pb-24 md:pb-0">
        <header className="bg-slate-900/50 backdrop-blur-xl p-4 md:p-5 border-b border-white/10 flex justify-between items-center sticky top-0 z-10 shadow-sm">
          <h2 className="text-lg md:text-xl font-bold text-slate-100">Cấu hình Hệ thống</h2>
          <Link href="/" target="_blank" className="text-sm font-bold text-cyan-400 border-2 border-cyan-500/20 bg-cyan-500/10 px-3 py-2 rounded-lg hover:bg-cyan-500/20 transition">
            Trang Khách
          </Link>
        </header>

        <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
          <div className="flex justify-between items-center mb-6">
            <p className="text-slate-400">Quản lý giao diện Trang chủ và Bộ lọc tìm kiếm</p>
            <Button onClick={handleSave} disabled={updateMutation.isPending} className="flex items-center gap-2">
              {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Lưu thay đổi
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Banner Thông Báo */}
            <div className="bg-slate-900/50 backdrop-blur-xl p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/10">
              <div className="flex items-center gap-3 mb-4 text-cyan-400 font-bold text-lg">
                <Megaphone className="w-5 h-5" /> Thông báo nổi bật (Banner)
              </div>
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={announcementActive} 
                    onChange={(e) => setAnnouncementActive(e.target.checked)}
                    className="w-5 h-5 accent-cyan-500"
                  />
                  <span className="font-medium text-slate-200">Kích hoạt thông báo trên trang chủ</span>
                </label>
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Nội dung thông báo</label>
                  <textarea 
                    value={announcementText}
                    onChange={(e) => setAnnouncementText(e.target.value)}
                    placeholder="VD: Khuyến mãi tháng 5 giảm 50% tiền cọc..."
                    className="w-full px-4 py-2 bg-slate-900 border border-white/20 text-slate-100 rounded-lg outline-none focus:border-cyan-500/50 placeholder:text-slate-500 min-h-[100px]"
                  />
                </div>
              </div>
            </div>

            {/* Danh mục Loại phòng */}
            <div className="bg-slate-900/50 backdrop-blur-xl p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/10">
              <div className="flex items-center gap-3 mb-4 text-emerald-400 font-bold text-lg">
                <Home className="w-5 h-5" /> Bộ lọc Loại phòng
              </div>
              <p className="text-sm text-slate-400 mb-4">Các loại phòng sẽ hiển thị trên thanh tìm kiếm và form đăng bài.</p>
              
              <div className="flex gap-2 mb-4">
                <input 
                  type="text" 
                  value={newPropertyType}
                  onChange={(e) => setNewPropertyType(e.target.value)}
                  placeholder="Nhập loại phòng mới..."
                  className="flex-1 px-4 py-2 bg-slate-900 border border-white/20 text-slate-100 rounded-lg outline-none focus:border-emerald-500/50 placeholder:text-slate-500"
                />
                <Button onClick={addPropertyType} variant="secondary"><Plus className="w-4 h-4" /></Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {propertyTypes.map((type) => (
                  <div key={type} className="bg-slate-800/80 text-slate-200 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 border border-white/10">
                    {type}
                    <button onClick={() => setPropertyTypes(propertyTypes.filter(t => t !== type))} className="text-slate-400 hover:text-red-400"><X className="w-3 h-3" /></button>
                  </div>
                ))}
              </div>
            </div>

            {/* Danh mục Khu vực */}
            <div className="bg-slate-900/50 backdrop-blur-xl p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/10 lg:col-span-2">
              <div className="flex items-center gap-3 mb-4 text-rose-400 font-bold text-lg">
                <MapPin className="w-5 h-5" /> Bộ lọc Khu vực (Quận/Huyện)
              </div>
              <p className="text-sm text-slate-400 mb-4">Quản lý danh sách các khu vực cho phép tìm kiếm và đăng bài.</p>
              
              <div className="flex gap-2 mb-6 max-w-md">
                <input 
                  type="text" 
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="Nhập khu vực mới (VD: Quận 1)..."
                  className="flex-1 px-4 py-2 bg-slate-900 border border-white/20 text-slate-100 rounded-lg outline-none focus:border-rose-500/50 placeholder:text-slate-500"
                />
                <Button onClick={() => addLocation(newLocation)} variant="secondary"><Plus className="w-4 h-4" /></Button>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-bold text-slate-200 mb-3">Khu vực đang hoạt động:</h4>
                <div className="flex flex-wrap gap-2">
                  {locations.length === 0 && <span className="text-slate-500 text-sm italic">Chưa có khu vực nào</span>}
                  {locations.map((loc) => (
                    <div key={loc} className="bg-rose-500/10 text-rose-400 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 border border-rose-500/20">
                      {loc}
                      <button onClick={() => setLocations(locations.filter(l => l !== loc))} className="text-rose-400 hover:text-red-400"><X className="w-3 h-3" /></button>
                    </div>
                  ))}
                </div>
              </div>

              {data?.suggestedLocations?.length > 0 && (
                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                  <h4 className="text-sm font-bold text-amber-400 mb-2 flex items-center gap-2">
                    Gợi ý tự động từ bài đăng thực tế:
                  </h4>
                  <p className="text-xs text-amber-400/80 mb-3">Hệ thống phát hiện các bài đăng thuộc các khu vực sau nhưng chưa có trong Bộ lọc. Hãy bấm vào để thêm.</p>
                  <div className="flex flex-wrap gap-2">
                    {data.suggestedLocations.map((loc: string) => (
                      <button 
                        key={loc}
                        onClick={() => addLocation(loc)}
                        className="bg-slate-800 text-amber-400 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1 border border-amber-500/30 hover:bg-amber-500/20 transition shadow-sm"
                      >
                        <Plus className="w-3 h-3" /> {loc}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
  );
}
