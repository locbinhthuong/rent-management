'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import GlassPropertyCard from '@/components/GlassPropertyCard';
import { Search, MapPin, Home as HomeIcon, Navigation, Map as MapIcon, List as ListIcon, Filter } from 'lucide-react';
import { getAllProvinces, getDistrictsByProvince } from '@/lib/data/provinces';
import MapClientWrapper from '@/components/MapClientWrapper';

export default function SplitScreenSearch({ posts, pagination }: { posts: any[], pagination: any }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [district, setDistrict] = useState(searchParams.get('district') || '');
  const [propertyType, setPropertyType] = useState(searchParams.get('property_type') || '');
  const [keyword, setKeyword] = useState(searchParams.get('q') || '');
  const minPrice = searchParams.get('min_price');
  const maxPrice = searchParams.get('max_price');
  const [priceRange, setPriceRange] = useState((minPrice && maxPrice) ? `${minPrice}-${maxPrice}` : '');
  
  const [categories, setCategories] = useState([]);
  const [hoveredPostId, setHoveredPostId] = useState<string | null>(null);
  const [showMapMobile, setShowMapMobile] = useState(false);

  useEffect(() => {
    fetch('/api/admin/categories')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCategories(data.filter((c: any) => c.isActive));
      })
      .catch(() => {});
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (city) params.set('city', city);
    if (district) params.set('district', district);
    if (propertyType) params.set('property_type', propertyType);
    if (keyword) params.set('q', keyword);
    if (priceRange) {
      const [min, max] = priceRange.split('-');
      params.set('min_price', min);
      params.set('max_price', max);
    }
    router.push(`/?${params.toString()}`, { scroll: false });
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`/?${params.toString()}`, { scroll: false });
  };

  const provincesList = getAllProvinces();
  const districtsList = city ? getDistrictsByProvince(city) : [];

  return (
    <div className="w-full flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-slate-50 relative mt-16">
      {/* Sticky Filter Bar */}
      <div className="w-full bg-white border-b border-slate-200 shadow-sm z-20 flex-shrink-0">
        <div className="max-w-[1600px] mx-auto px-4 py-3">
          <div className="flex flex-col md:flex-row items-center gap-3 overflow-x-auto custom-scrollbar pb-1 md:pb-0">
            {/* Search Input */}
            <div className="flex items-center bg-slate-100 rounded-full px-4 py-2 w-full md:w-auto md:min-w-[250px] shrink-0 border border-slate-200 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-100 transition-all">
              <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
              <input 
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Tìm theo địa điểm, tên..."
                className="bg-transparent border-none outline-none text-sm text-slate-700 w-full"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto shrink-0 overflow-x-auto pb-1 md:pb-0">
              {/* City Filter */}
              <select 
                value={city}
                onChange={(e) => { setCity(e.target.value); setDistrict(''); }}
                className="bg-white border border-slate-200 text-slate-700 text-sm rounded-full px-4 py-2 outline-none hover:border-cyan-400 transition cursor-pointer appearance-none"
                style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2394A3B8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px top 50%', backgroundSize: '10px auto', paddingRight: '30px' }}
              >
                <option value="">Tỉnh/Thành</option>
                {provincesList.map(p => <option key={p} value={p}>{p}</option>)}
              </select>

              {/* District Filter */}
              <select 
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                disabled={!city}
                className="bg-white border border-slate-200 text-slate-700 text-sm rounded-full px-4 py-2 outline-none hover:border-cyan-400 transition cursor-pointer appearance-none disabled:opacity-50"
                style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2394A3B8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px top 50%', backgroundSize: '10px auto', paddingRight: '30px' }}
              >
                <option value="">Quận/Huyện</option>
                {districtsList.map(d => <option key={d} value={d}>{d}</option>)}
              </select>

              {/* Type Filter */}
              <select 
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="bg-white border border-slate-200 text-slate-700 text-sm rounded-full px-4 py-2 outline-none hover:border-cyan-400 transition cursor-pointer appearance-none"
                style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2394A3B8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px top 50%', backgroundSize: '10px auto', paddingRight: '30px' }}
              >
                <option value="">Loại phòng</option>
                {categories.map((cat: any) => <option key={cat._id} value={cat.name}>{cat.name}</option>)}
              </select>

              {/* Price Filter */}
              <select 
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="bg-white border border-slate-200 text-slate-700 text-sm rounded-full px-4 py-2 outline-none hover:border-cyan-400 transition cursor-pointer appearance-none"
                style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2394A3B8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px top 50%', backgroundSize: '10px auto', paddingRight: '30px' }}
              >
                <option value="">Mức giá</option>
                <option value="0-2000000">Dưới 2 triệu</option>
                <option value="2000000-5000000">2 - 5 triệu</option>
                <option value="5000000-10000000">5 - 10 triệu</option>
                <option value="10000000-999999999">Trên 10 triệu</option>
              </select>

              <button 
                onClick={handleSearch}
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-2 rounded-full shrink-0 transition-colors shadow-sm font-bold text-sm ml-auto"
              >
                Tìm
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex w-full h-full overflow-hidden relative">
        
        {/* Left Column: Post List */}
        <div className={`${showMapMobile ? 'hidden md:flex' : 'flex'} w-full md:w-[55%] lg:w-[60%] flex-col h-full bg-slate-50 overflow-y-auto custom-scrollbar`}>
          <div className="p-4 md:p-6 lg:px-8">
            <div className="mb-6 flex justify-between items-center">
              <h1 className="text-xl md:text-2xl font-bold font-space tracking-tight text-slate-900">
                Khám phá không gian sống
              </h1>
              <span className="text-sm text-slate-500 font-medium">
                {pagination.total} kết quả
              </span>
            </div>
            
            {posts.length === 0 ? (
              <div className="text-center py-20 bg-white/80 rounded-2xl border border-slate-200">
                <p className="text-slate-500 font-medium">Không tìm thấy kết quả phù hợp. Hãy thử thay đổi bộ lọc.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {posts.map((post) => (
                  <GlassPropertyCard 
                    key={post._id} 
                    post={post} 
                    isActive={hoveredPostId === post._id}
                    onMouseEnter={() => setHoveredPostId(post._id)}
                    onMouseLeave={() => setHoveredPostId(null)}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8 pb-12 md:pb-6">
                <button 
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg disabled:opacity-50 hover:bg-slate-50 transition shadow-sm"
                >
                  Trước
                </button>
                <span className="text-slate-600 font-medium text-sm px-4">
                  Trang {pagination.page} / {pagination.totalPages}
                </span>
                <button 
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                  className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg disabled:opacity-50 hover:bg-slate-50 transition shadow-sm"
                >
                  Sau
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Interactive Map */}
        <div className={`${!showMapMobile ? 'hidden md:block' : 'block'} w-full md:w-[45%] lg:w-[40%] h-full relative z-10 border-l border-slate-200`}>
          <MapClientWrapper posts={posts} hoveredPostId={hoveredPostId} />
        </div>
      </div>

      {/* Floating Toggle Button (Mobile Only) */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <button 
          onClick={() => setShowMapMobile(!showMapMobile)}
          className="bg-slate-900 text-white px-6 py-3 rounded-full flex items-center gap-2 font-bold shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:scale-105 transition-transform"
        >
          {showMapMobile ? (
            <><ListIcon className="w-4 h-4" /> Xem danh sách</>
          ) : (
            <><MapIcon className="w-4 h-4" /> Bản đồ</>
          )}
        </button>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(148, 163, 184, 0.4);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(100, 116, 139, 0.6);
        }
      `}</style>
    </div>
  );
}