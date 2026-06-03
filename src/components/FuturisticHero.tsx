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
    <div className="relative w-full h-[90vh] flex flex-col items-center justify-center overflow-hidden">
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
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 flex flex-col items-center mt-[-10vh]">
        
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <h1 className="font-space text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-4 drop-shadow-2xl">
            Tương lai của <span className="text-cyan-400 font-space glow-cyan">Không Gian Sống</span>
          </h1>
          <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto font-medium">
            Khám phá trải nghiệm thuê nhà đẳng cấp với hệ thống tìm kiếm đa chiều.
          </p>
        </motion.div>

        {/* Floating Pill Search Bar (Glassmorphism) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8, type: "spring", stiffness: 100 }}
          className="glass-pill rounded-[2rem] p-2 w-full flex flex-col md:flex-row items-center justify-between mx-auto shadow-[0_0_40px_rgba(6,182,212,0.15)] transition-all"
        >
          {/* Segments */}
          <div className="flex-1 flex flex-col md:flex-row items-center w-full divide-y md:divide-y-0 md:divide-x divide-white/20">
            
            {/* Segment 1: City */}
            <div className="flex items-center gap-3 px-6 py-4 md:py-3 w-full hover:bg-white/5 transition-colors rounded-t-[1.5rem] md:rounded-l-full group relative">
              <MapPin className="w-5 h-5 text-cyan-400 shrink-0" />
              <div className="flex flex-col w-full">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Tỉnh/Thành</span>
                <select 
                  value={city}
                  onChange={handleCityChange}
                  className="bg-transparent text-slate-100 font-medium outline-none appearance-none cursor-pointer w-full"
                >
                  <option value="" className="bg-slate-800">Toàn quốc</option>
                  {provincesList.map((p) => (
                    <option key={p} value={p} className="bg-slate-800">{p}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Segment 2: Location (Dependent on City) */}
            <div className={`flex items-center gap-3 px-6 py-4 md:py-3 w-full transition-colors group relative ${!city ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/5'}`}>
              <MapPin className="w-5 h-5 text-violet-400 shrink-0" />
              <div className="flex flex-col w-full">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Quận/Huyện</span>
                <select 
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  disabled={!city}
                  className="bg-transparent text-slate-100 font-medium outline-none appearance-none cursor-pointer w-full disabled:cursor-not-allowed"
                >
                  <option value="" className="bg-slate-800">{city ? "Tất cả khu vực" : "Chọn Tỉnh/Thành trước"}</option>
                  {districtsList.map((loc: string) => (
                    <option key={loc} value={loc} className="bg-slate-800">{loc}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Segment 3: Property Type */}
            <div className="flex items-center gap-3 px-6 py-4 md:py-3 w-full hover:bg-white/5 transition-colors group relative">
              <Home className="w-5 h-5 text-emerald-400 shrink-0" />
              <div className="flex flex-col w-full">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Loại phòng</span>
                <select 
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="bg-transparent text-slate-100 font-medium outline-none appearance-none cursor-pointer w-full"
                >
                  <option value="" className="bg-slate-800">Tất cả loại hình</option>
                  {config.propertyTypes.map((type: string) => (
                    <option key={type} value={type} className="bg-slate-800">{type}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Segment 4: Price */}
            <div className="flex items-center gap-3 px-6 py-4 md:py-3 w-full hover:bg-white/5 transition-colors group relative md:rounded-r-none rounded-b-[1.5rem] md:rounded-b-none">
              <div className="w-5 h-5 text-amber-400 shrink-0 font-bold flex items-center justify-center">₫</div>
              <div className="flex flex-col w-full">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Mức giá</span>
                <select 
                  onChange={(e) => {
                    const val = e.target.value;
                    if (!val) {
                      setPriceRange('');
                    } else {
                      setPriceRange(val);
                    }
                  }}
                  value={priceRange}
                  className="bg-transparent text-slate-100 font-medium outline-none appearance-none cursor-pointer w-full"
                >
                  <option value="" className="bg-slate-800">Mọi mức giá</option>
                  <option value="0-2000000" className="bg-slate-800">Dưới 2 triệu</option>
                  <option value="2000000-5000000" className="bg-slate-800">Từ 2 - 5 triệu</option>
                  <option value="5000000-10000000" className="bg-slate-800">Từ 5 - 10 triệu</option>
                  <option value="10000000-999999999" className="bg-slate-800">Trên 10 triệu</option>
                </select>
              </div>
            </div>

          </div>

          <div className="flex gap-2 w-full md:w-auto p-2 md:p-0">
            {/* Near Me Button */}
            <button 
              onClick={handleNearMe}
              title="Tìm quanh đây"
              className="bg-violet-500/20 hover:bg-violet-500/40 border border-violet-500/50 w-full md:w-14 h-14 shrink-0 rounded-xl md:rounded-full flex items-center justify-center transition-all glow-violet hover:scale-105 active:scale-95 shadow-lg"
            >
              <Navigation className="w-6 h-6 text-violet-300" />
              <span className="md:hidden ml-2 font-bold text-violet-300">Gần Tôi</span>
            </button>
            
            {/* Search Button */}
            <button 
              onClick={handleSearch}
              className="bg-cyan-500 hover:bg-cyan-400 w-full md:w-14 h-14 shrink-0 rounded-xl md:rounded-full flex items-center justify-center md:ml-2 md:mr-1 transition-all glow-cyan hover:scale-105 active:scale-95 shadow-lg"
            >
              <Search className="w-6 h-6 text-slate-900 shrink-0" />
              <span className="md:hidden ml-2 font-bold text-slate-900">TÌM KIẾM</span>
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
