'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Search, MapPin, Home, Navigation } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getAllProvinces, getDistrictsByProvince } from '@/lib/data/provinces';

export default function FuturisticHero() {
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
  
  const [config, setConfig] = useState({ propertyTypes: [] });

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        if (data.config) {
          setConfig({ propertyTypes: data.config.propertyTypes || [] });
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
    <div className="relative w-full min-h-[100svh] md:min-h-[90vh] flex flex-col items-center justify-center overflow-hidden py-24 md:py-0">
      {/* Hyper-realistic Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop"
          alt="High-end futuristic apartment"
          fill
          className="object-cover scale-105"
          priority
        />
        {/* Deep dark gradient overlay for text readability and futuristic vibe */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/60 to-slate-950"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 flex flex-col items-center mt-4 md:mt-[-10vh]">
        
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-8 md:mb-12"
        >
          <h1 className="font-space text-4xl sm:text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-3 md:mb-4 drop-shadow-2xl leading-tight">
            Tương lai của <br className="md:hidden" />
            <span className="text-cyan-400 font-space glow-cyan">Không Gian Sống</span>
          </h1>
          <p className="text-slate-300 text-base md:text-xl max-w-2xl mx-auto font-medium px-2">
            Khám phá trải nghiệm thuê nhà đẳng cấp với hệ thống tìm kiếm đa chiều.
          </p>
        </motion.div>

        {/* App-style Search Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="w-full max-w-3xl bg-slate-900/95 backdrop-blur-xl rounded-3xl border border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-4 md:p-6"
        >
          <div className="flex flex-col md:grid md:grid-cols-2 gap-x-6">
            
            {/* Row 1: Keyword */}
            <div className="flex items-center gap-4 py-3 md:py-4 border-b border-slate-800/80 md:col-span-2 group">
              <Search className="w-5 h-5 text-blue-500 shrink-0" />
              <div className="flex flex-col w-full flex-1">
                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-widest mb-0.5">Từ khóa</span>
                <input 
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Tìm tên, địa chỉ..."
                  className="bg-transparent text-slate-100 font-semibold text-[15px] outline-none placeholder-slate-500 w-full"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>

            {/* Row 2: City */}
            <div className="flex items-center gap-4 py-3 md:py-4 border-b border-slate-800/80 group">
              <MapPin className="w-5 h-5 text-emerald-500 shrink-0" />
              <div className="flex flex-col w-full flex-1">
                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-widest mb-0.5">Tỉnh/Thành</span>
                <select 
                  value={city}
                  onChange={handleCityChange}
                  className="bg-transparent text-slate-100 font-semibold text-[15px] outline-none appearance-none cursor-pointer w-full"
                >
                  <option value="" className="bg-slate-900">Toàn quốc</option>
                  {provincesList.map((p) => (
                    <option key={p} value={p} className="bg-slate-900">{p}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 3: District */}
            <div className={`flex items-center gap-4 py-3 md:py-4 border-b border-slate-800/80 group ${!city ? 'opacity-50' : ''}`}>
              <div className="w-5 h-5 rounded-full border-2 border-violet-500 flex items-center justify-center shrink-0">
                <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
              </div>
              <div className="flex flex-col w-full flex-1">
                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-widest mb-0.5">Quận/Huyện</span>
                <select 
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  disabled={!city}
                  className="bg-transparent text-slate-100 font-semibold text-[15px] outline-none appearance-none cursor-pointer w-full"
                >
                  <option value="" className="bg-slate-900">{city ? "Chọn Quận/Huyện" : "Chọn Tỉnh/Thành trước"}</option>
                  {districtsList.map((loc: string) => (
                    <option key={loc} value={loc} className="bg-slate-900">{loc}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 4: Property Type */}
            <div className="flex items-center gap-4 py-3 md:py-4 border-b border-slate-800/80 group">
              <Home className="w-5 h-5 text-teal-400 shrink-0" />
              <div className="flex flex-col w-full flex-1">
                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-widest mb-0.5">Loại phòng</span>
                <select 
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="bg-transparent text-slate-100 font-semibold text-[15px] outline-none appearance-none cursor-pointer w-full"
                >
                  <option value="" className="bg-slate-900">Tất cả loại hình</option>
                  {config.propertyTypes.map((type: string) => (
                    <option key={type} value={type} className="bg-slate-900">{type}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 5: Price */}
            <div className="flex items-center gap-4 py-3 md:py-4 border-b border-slate-800/80 group md:border-b-0">
              <div className="w-5 h-5 flex items-center justify-center bg-amber-500/20 text-amber-500 rounded shrink-0 font-bold text-xs border border-amber-500/50">
                ₫
              </div>
              <div className="flex flex-col w-full flex-1">
                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-widest mb-0.5">Mức giá</span>
                <select 
                  onChange={(e) => {
                    const val = e.target.value;
                    if (!val) setPriceRange('');
                    else setPriceRange(val);
                  }}
                  value={priceRange}
                  className="bg-transparent text-slate-100 font-semibold text-[15px] outline-none appearance-none cursor-pointer w-full"
                >
                  <option value="" className="bg-slate-900">Mọi mức giá</option>
                  <option value="0-2000000" className="bg-slate-900">Dưới 2 triệu</option>
                  <option value="2000000-5000000" className="bg-slate-900">Từ 2 - 5 triệu</option>
                  <option value="5000000-10000000" className="bg-slate-900">Từ 5 - 10 triệu</option>
                  <option value="10000000-999999999" className="bg-slate-900">Trên 10 triệu</option>
                </select>
              </div>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-5 w-full">
            <button 
              onClick={handleNearMe}
              className="flex-1 bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/30 py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <Navigation className="w-4 h-4 text-violet-400" />
              <span className="font-semibold text-[14px] text-violet-300">Gần Tôi</span>
            </button>
            
            <button 
              onClick={handleSearch}
              className="flex-[1.5] bg-cyan-500 hover:bg-cyan-400 py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(6,182,212,0.3)]"
            >
              <Search className="w-4 h-4 text-slate-950 font-bold" />
              <span className="font-bold text-[14px] text-slate-950">TÌM KIẾM</span>
            </button>
          </div>
        </motion.div>
      </div>
      
      {/* Scroll Down Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <span className="text-xs text-slate-400 font-space tracking-widest uppercase">Khám phá</span>
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-8 h-12 rounded-full border border-white/20 flex items-start justify-center p-1 bg-white/5 backdrop-blur-sm"
        >
          <div className="w-1.5 h-3 bg-cyan-400 rounded-full glow-cyan"></div>
        </motion.div>
      </motion.div>
    </div>
  );
}
