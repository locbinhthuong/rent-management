'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Home, MapPin } from 'lucide-react';

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

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const params = new URLSearchParams();
    if (keyword) params.set('keyword', keyword);
    if (propertyType) params.set('type', propertyType);
    if (district) params.set('district', district);

    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="w-full relative z-10">
      <form onSubmit={handleSearch} className="bg-white rounded-full p-2 flex flex-col md:flex-row items-center shadow-2xl max-w-5xl mx-auto gap-2 md:gap-0">
        
        {/* Tìm kiếm từ khóa */}
        <div className="w-full md:w-1/3 flex items-center px-4 md:border-r border-slate-200 text-slate-500">
          <Search className="w-5 h-5 text-indigo-600 shrink-0 mr-2" />
          <input 
            type="text" 
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tên đường, phường..." 
            className="w-full bg-transparent outline-none text-slate-800 font-medium placeholder:font-normal py-3" 
          />
        </div>
        
        {/* Chọn khu vực */}
        <div className="w-full md:w-1/3 flex items-center px-4 md:border-r border-slate-200 text-slate-500 relative group">
          <MapPin className="w-5 h-5 text-indigo-600 shrink-0 mr-2" />
          <select 
            value={district} 
            onChange={(e) => setDistrict(e.target.value)}
            className="w-full bg-transparent outline-none text-slate-800 font-medium py-3 appearance-none cursor-pointer"
          >
            <option value="">Tất cả khu vực</option>
            {locations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        {/* Chọn loại phòng */}
        <div className="w-full md:w-1/3 flex items-center px-4 text-slate-500 relative group">
          <Home className="w-5 h-5 text-indigo-600 shrink-0 mr-2" />
          <select 
            value={propertyType} 
            onChange={(e) => setPropertyType(e.target.value)}
            className="w-full bg-transparent outline-none text-slate-800 font-medium py-3 appearance-none cursor-pointer"
          >
            <option value="">Tất cả loại phòng</option>
            {propertyTypes.map(pt => (
              <option key={pt} value={pt}>{pt}</option>
            ))}
          </select>
        </div>

        {/* Nút tìm kiếm */}
        <button type="submit" className="w-full md:w-auto px-8 py-3.5 bg-indigo-600 text-white font-bold rounded-full hover:bg-indigo-700 transition shrink-0 flex items-center justify-center shadow-md">
          <Search className="w-5 h-5 mr-2 md:hidden" />
          <span>Tìm kiếm</span>
        </button>
      </form>
    </div>
  );
}
