'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Search, MapPin, Home, Navigation } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getAllProvinces, getDistrictsByProvince } from '@/lib/data/provinces';
import MapClientWrapper from '@/components/MapClientWrapper';

export default function FuturisticHero({ posts = [] }: { posts?: any[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [district, setDistrict] = useState(searchParams.get('district') || '');
  const [propertyType, setPropertyType] = useState(searchParams.get('property_type') || '');
  const [keyword, setKeyword] = useState(searchParams.get('q') || '');
  
  // Xử lý logic cho priceRange từ min_price và max_price
  const minPrice = searchParams.get('min_price');
  const maxPrice = searchParams.get('max_price');
  const initialPriceRange = (minPrice && maxPrice) ? `${minPrice}-${maxPrice}` : '';
  const [priceRange, setPriceRange] = useState(initialPriceRange);
  
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch('/api/admin/categories')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCategories(data.filter((c: any) => c.isActive));
        }
      })
      .catch(() => {});
  }, []);

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCity(e.target.value);
    setDistrict(''); // Reset district khi đổi city
  };

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
    setTimeout(() => {
      document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleNearMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const params = new URLSearchParams();
          params.set('lat', position.coords.latitude.toString());
          params.set('lng', position.coords.longitude.toString());
          router.push(`/?${params.toString()}#explore`);
        },
        (error) => {
          alert("Không thể lấy vị trí của bạn. Vui lòng kiểm tra quyền trên trình duyệt.");
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      alert("Trình duyệt không hỗ trợ định vị.");
    }
  };

  // Lấy danh sách Tỉnh/Thành và Quận/Huyện động
  const provincesList = getAllProvinces();
  const districtsList = city ? getDistrictsByProvince(city) : [];

  return (
    <div className="relative w-full flex flex-col items-center justify-center overflow-hidden py-12 md:py-16">
      {/* Premium Modern Mesh Gradient Background */}
      <div className="absolute inset-0 z-0 bg-slate-50 overflow-hidden">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8b5cf610_1px,transparent_1px),linear-gradient(to_bottom,#8b5cf610_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        
        {/* Glowing Orbs for Mesh Effect */}
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full bg-violet-400 opacity-20 blur-[120px] animate-pulse-slow"></div>
        <div className="absolute top-[10%] right-[-5%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full bg-blue-400 opacity-20 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[60vw] h-[40vw] max-w-[700px] max-h-[500px] rounded-full bg-indigo-300 opacity-20 blur-[120px]"></div>
        
        {/* Smooth overlay fading into the content below */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-50/50 to-slate-50"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 flex flex-col items-center mt-4 md:mt-[-5vh]">
        
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-4 md:mb-6 w-full"
        >
          <h1 className="font-space text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight mb-3 md:mb-4 drop-shadow-sm leading-tight">
            Tương lai của <br className="md:hidden" />
            <span className="text-blue-600 font-space drop-shadow-md">Không Gian Sống</span>
          </h1>
          <p className="text-slate-600 text-base md:text-xl max-w-2xl mx-auto font-medium px-2">
            Khám phá trải nghiệm thuê nhà đẳng cấp với hệ thống tìm kiếm đa chiều.
          </p>
        </motion.div>

        {/* Horizontal Independent Search Filters */}
        <div className="w-full max-w-4xl flex flex-wrap items-center justify-center gap-2 mt-2">
          
          {/* Keyword */}
          <div className="flex items-center bg-white/90 backdrop-blur-md rounded-full px-4 py-2.5 border border-slate-200 shadow-sm min-w-[180px] flex-1 hover:border-blue-300 transition-colors">
            <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
            <input 
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Tìm tên, địa chỉ..."
              className="bg-transparent text-slate-700 font-medium text-sm outline-none w-full placeholder-slate-400"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>

          {/* City */}
          <div className="flex items-center bg-white/90 backdrop-blur-md rounded-full px-4 py-2.5 border border-slate-200 shadow-sm hover:border-blue-300 transition-colors">
            <MapPin className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
            <select 
              value={city}
              onChange={handleCityChange}
              className="bg-transparent text-slate-700 font-medium text-sm outline-none cursor-pointer appearance-none pr-4"
            >
              <option value="">Toàn quốc</option>
              {provincesList.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* District */}
          <div className={`flex items-center bg-white/90 backdrop-blur-md rounded-full px-4 py-2.5 border border-slate-200 shadow-sm transition-colors ${city ? 'hover:border-blue-300' : 'opacity-50'}`}>
            <div className="w-4 h-4 rounded-full border-2 border-slate-400 flex items-center justify-center shrink-0 mr-2">
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
            </div>
            <select 
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              disabled={!city}
              className="bg-transparent text-slate-700 font-medium text-sm outline-none cursor-pointer appearance-none pr-4"
            >
              <option value="">{city ? "Quận/Huyện" : "Chọn Tỉnh trước"}</option>
              {districtsList.map((loc: string) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {/* Property Type */}
          <div className="flex items-center bg-white/90 backdrop-blur-md rounded-full px-4 py-2.5 border border-slate-200 shadow-sm hover:border-blue-300 transition-colors">
            <Home className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
            <select 
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="bg-transparent text-slate-700 font-medium text-sm outline-none cursor-pointer appearance-none pr-4"
            >
              <option value="">Loại phòng</option>
              {categories.map((cat: any) => (
                <option key={cat._id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div className="flex items-center bg-white/90 backdrop-blur-md rounded-full px-4 py-2.5 border border-slate-200 shadow-sm hover:border-blue-300 transition-colors">
            <span className="text-slate-400 mr-2 font-bold text-sm shrink-0">₫</span>
            <select 
              onChange={(e) => setPriceRange(e.target.value || "")}
              value={priceRange}
              className="bg-transparent text-slate-700 font-medium text-sm outline-none cursor-pointer appearance-none pr-4"
            >
              <option value="">Mức giá</option>
              <option value="0-2000000">Dưới 2 triệu</option>
              <option value="2000000-5000000">Từ 2 - 5 triệu</option>
              <option value="5000000-10000000">Từ 5 - 10 triệu</option>
              <option value="10000000-999999999">Trên 10 triệu</option>
            </select>
          </div>

          {/* Action Buttons */}
          <button 
            onClick={handleNearMe}
            className="bg-white/90 hover:bg-slate-100 backdrop-blur-md border border-slate-200 px-3 py-2.5 rounded-full flex items-center justify-center transition-all shadow-sm"
            title="Tìm quanh đây"
          >
            <Navigation className="w-4 h-4 text-slate-600" />
          </button>
          
          <button 
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-500 px-6 py-2.5 rounded-full flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-500/20"
          >
            <Search className="w-4 h-4 text-white font-bold" />
            <span className="font-bold text-sm text-white">TÌM KIẾM</span>
          </button>
        </div>
      </div>
    </div>
  );
}
