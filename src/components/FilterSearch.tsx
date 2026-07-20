'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Home, MapPin, Navigation, DollarSign, Loader2, RotateCcw } from 'lucide-react';

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
  const [priceMax, setPriceMax] = useState(searchParams.get('priceMax') || '');
  const [locating, setLocating] = useState(false);

  const handleGPSLocation = () => {
    if (!navigator.geolocation) {
      alert("Trình duyệt của bạn không hỗ trợ định vị GPS.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        // Dùng API Nominatim để lấy địa chỉ từ tọa độ
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=14&addressdetails=1`, {
          headers: { 'Accept-Language': 'vi' }
        });
        const data = await res.json();
        
        const addr = data.address || {};
        const foundDistrict = addr.suburb || addr.quarter || addr.neighbourhood || addr.city_district || addr.district || addr.town || addr.county || '';
        
        if (foundDistrict) {
          // Bỏ chữ "Quận/Huyện/Phường..." dư thừa để đối chiếu chính xác hơn
          const cleanDistrict = foundDistrict.replace(/District|Quận|Huyện|Thành phố|Phường|Xã|Town|City/g, '').trim();
          // Tìm quận gần giống nhất trong danh sách locations
          const matched = locations.find(loc => loc.toLowerCase().includes(cleanDistrict.toLowerCase()) || cleanDistrict.toLowerCase().includes(loc.toLowerCase()));
          
          const searchTarget = matched || foundDistrict;
          setDistrict(searchTarget);

          // Tự động kích hoạt tìm kiếm và tải lại trọ gần vị trí định vị
          const params = new URLSearchParams();
          if (keyword) params.set('keyword', keyword);
          if (propertyType) params.set('type', propertyType);
          params.set('district', searchTarget);
          if (priceMax) {
            if (priceMax === '1000000') {
              params.set('priceMax', '1000000');
            } else if (priceMax === '2000000') {
              params.set('priceMin', '1000000');
              params.set('priceMax', '2000000');
            } else if (priceMax === '3000000') {
              params.set('priceMin', '2000000');
              params.set('priceMax', '3000000');
            } else if (priceMax === '5000000') {
              params.set('priceMin', '3000000');
              params.set('priceMax', '5000000');
            } else if (priceMax === '7000000') {
              params.set('priceMin', '5000000');
              params.set('priceMax', '7000000');
            } else if (priceMax === '10000000') {
              params.set('priceMin', '7000000');
              params.set('priceMax', '10000000');
            } else if (priceMax === '10000001') {
              params.set('priceMin', '10000000');
            }
          }
          router.push(`/?${params.toString()}`);
        } else {
          alert("Không thể xác định Quận/Huyện từ vị trí của bạn.");
        }
      } catch (err) {
        alert("Lỗi khi kết nối đến dịch vụ bản đồ.");
      } finally {
        setLocating(false);
      }
    }, (error) => {
      alert("Vui lòng cấp quyền vị trí để sử dụng tính năng này.");
      setLocating(false);
    }, { timeout: 10000 });
  };

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const params = new URLSearchParams();
    if (keyword) params.set('keyword', keyword);
    if (propertyType) params.set('type', propertyType);
    if (district) params.set('district', district);
    if (priceMax) {
      if (priceMax === '1000000') {
        params.set('priceMax', '1000000');
      } else if (priceMax === '2000000') {
        params.set('priceMin', '1000000');
        params.set('priceMax', '2000000');
      } else if (priceMax === '3000000') {
        params.set('priceMin', '2000000');
        params.set('priceMax', '3000000');
      } else if (priceMax === '5000000') {
        params.set('priceMin', '3000000');
        params.set('priceMax', '5000000');
      } else if (priceMax === '7000000') {
        params.set('priceMin', '5000000');
        params.set('priceMax', '7000000');
      } else if (priceMax === '10000000') {
        params.set('priceMin', '7000000');
        params.set('priceMax', '10000000');
      } else if (priceMax === '10000001') {
        params.set('priceMin', '10000000');
      }
    }

    router.push(`/?${params.toString()}`);
  };

  const handleClearFilters = () => {
    setKeyword('');
    setPropertyType('');
    setDistrict('');
    setPriceMax('');
    router.push('/');
  };

  return (
    <div className="w-full relative z-10">
      <form onSubmit={handleSearch} className="bg-white rounded-2xl md:rounded-full p-2 flex flex-col md:flex-row items-center shadow-2xl max-w-5xl mx-auto gap-2 md:gap-0">
        
        {/* Tìm kiếm từ khóa */}
        <div className="w-full md:w-1/4 flex items-center px-4 md:border-r border-slate-200 text-slate-500">
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
        <div className="w-full md:w-1/4 flex items-center px-4 md:border-r border-slate-200 text-slate-500 relative group">
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
        <div className="w-full md:w-1/4 flex items-center px-4 md:border-r border-slate-200 text-slate-500 relative group">
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

        {/* Chọn mức giá */}
        <div className="w-full md:w-1/4 flex items-center px-4 text-slate-500 relative group">
          <DollarSign className="w-5 h-5 text-indigo-600 shrink-0 mr-2" />
          <select 
            value={priceMax} 
            onChange={(e) => setPriceMax(e.target.value)}
            className="w-full bg-transparent outline-none text-slate-800 font-medium py-3 appearance-none cursor-pointer"
          >
            <option value="">Chọn mức giá</option>
            <option value="1000000">Dưới 1 triệu</option>
            <option value="2000000">Từ 1 - 2 triệu</option>
            <option value="3000000">Từ 2 - 3 triệu</option>
            <option value="5000000">Từ 3 - 5 triệu</option>
            <option value="7000000">Từ 5 - 7 triệu</option>
            <option value="10000000">Từ 7 - 10 triệu</option>
            <option value="10000001">Trên 10 triệu</option>
          </select>
        </div>

        {/* Nút tìm kiếm */}
        <div className="w-full md:w-auto flex gap-2 pl-2">
          {(keyword || propertyType || district || priceMax) && (
            <button 
              type="button" 
              onClick={handleClearFilters}
              title="Xóa tất cả bộ lọc"
              className="px-4 py-3.5 bg-rose-50 text-rose-600 font-bold rounded-full hover:bg-rose-100 hover:text-rose-700 transition shrink-0 flex items-center justify-center shadow-sm border border-rose-100 animate-in fade-in zoom-in duration-200"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          )}
          <button 
            type="button" 
            onClick={handleGPSLocation}
            disabled={locating}
            title="Tìm trọ gần vị trí của bạn"
            className="px-4 py-3.5 bg-slate-100 text-slate-600 font-bold rounded-full hover:bg-slate-200 transition shrink-0 flex items-center justify-center shadow-sm disabled:opacity-50"
          >
            {locating ? <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" /> : <Navigation className="w-5 h-5 text-indigo-600" />}
          </button>
          <button type="submit" className="flex-1 md:w-auto md:px-8 py-3.5 bg-indigo-600 text-slate-900 font-bold rounded-full hover:bg-indigo-700 transition shrink-0 flex items-center justify-center shadow-md">
            <Search className="w-5 h-5 mr-2 md:hidden" />
            <span>Tìm kiếm</span>
          </button>
        </div>
      </form>
    </div>
  );
}
