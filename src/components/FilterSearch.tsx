'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Filter, Home, MapPin, DollarSign, X } from 'lucide-react';

interface FilterSearchProps {
  propertyTypes?: string[];
  locations?: string[];
}

export default function FilterSearch({ propertyTypes = [], locations = [] }: FilterSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [propertyType, setPropertyType] = useState(searchParams.get('type') || '');
  const [district, setDistrict] = useState(searchParams.get('district') || '');
  const [priceMin, setPriceMin] = useState(searchParams.get('priceMin') || '');
  const [priceMax, setPriceMax] = useState(searchParams.get('priceMax') || '');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const params = new URLSearchParams();
    if (keyword) params.set('keyword', keyword);
    if (propertyType) params.set('type', propertyType);
    if (district) params.set('district', district);
    if (priceMin) params.set('priceMin', priceMin);
    if (priceMax) params.set('priceMax', priceMax);

    router.push(`/?${params.toString()}`);
  };

  const clearFilters = () => {
    setKeyword('');
    setPropertyType('');
    setDistrict('');
    setPriceMin('');
    setPriceMax('');
    router.push('/');
    setShowFilters(false);
  };

  return (
    <div className="w-full relative z-10">
      <form onSubmit={handleSearch} className="bg-white rounded-full p-2 flex flex-wrap md:flex-nowrap items-center shadow-2xl max-w-4xl mx-auto">
        <div className="flex-1 w-full md:w-auto flex items-center px-4 md:border-r border-slate-200 gap-3 text-slate-500 mb-2 md:mb-0">
          <Search className="w-5 h-5 text-primary shrink-0" />
          <input 
            type="text" 
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm theo khu vực, đường, tên phòng..." 
            className="w-full bg-transparent outline-none text-slate-800 font-medium placeholder:font-normal py-2" 
          />
        </div>
        
        <button 
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className={`px-3 md:px-5 py-3 font-bold rounded-full transition flex items-center gap-2 mx-1 md:mx-2 shrink-0 ${showFilters ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          <Filter className="w-4 h-4" />
          <span className="hidden sm:inline">Bộ lọc</span>
        </button>

        <button type="submit" className="px-6 md:px-8 py-3 bg-primary text-white font-bold rounded-full hover:bg-emerald-700 transition shrink-0 flex items-center justify-center shadow-md">
          <Search className="w-5 h-5 md:hidden" />
          <span className="hidden md:inline">Tìm kiếm</span>
        </button>
      </form>

      {/* Dropdown Bộ lọc */}
      {showFilters && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-3xl shadow-xl border border-slate-200 p-6 animate-in fade-in slide-in-from-top-2 max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-800 flex items-center gap-2"><Filter className="w-5 h-5 text-primary"/> Phân loại & Mức giá</h3>
            <button onClick={() => setShowFilters(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Loại phòng */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                <Home className="w-4 h-4 text-slate-400" /> Loại phòng / Nhà
              </label>
              <select 
                value={propertyType} 
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none font-medium text-slate-700 appearance-none"
              >
                <option value="">Tất cả các loại</option>
                {propertyTypes.map(pt => (
                  <option key={pt} value={pt}>{pt}</option>
                ))}
              </select>
            </div>

            {/* Khu vực */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400" /> Khu vực (Quận/Huyện)
              </label>
              <select 
                value={district} 
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none font-medium text-slate-700 appearance-none"
              >
                <option value="">Tất cả khu vực</option>
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            {/* Mức giá */}
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-slate-400" /> Khoảng giá (VNĐ)
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <input 
                  type="number" 
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  placeholder="Từ (VD: 1000000)" 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-slate-700"
                />
                <span className="text-slate-400 font-bold hidden sm:block">-</span>
                <input 
                  type="number" 
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  placeholder="Đến (VD: 5000000)" 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-slate-700"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3 justify-end pt-4 border-t border-slate-100">
            <button 
              onClick={clearFilters}
              type="button" 
              className="px-6 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition"
            >
              Xóa bộ lọc
            </button>
            <button 
              onClick={(e) => { handleSearch(e); setShowFilters(false); }}
              type="button" 
              className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-emerald-700 transition shadow-md"
            >
              Áp dụng & Tìm kiếm
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
