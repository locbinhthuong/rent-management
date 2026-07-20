'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Search, MapPin, Home, Navigation, SlidersHorizontal, X, ChevronDown, Map, GraduationCap } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getAllProvinces, getDistrictsByProvince } from '@/lib/data/provinces';
import { universities } from '@/lib/data/universities';
import MapClientWrapper from '@/components/MapClientWrapper';

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
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [universityName, setUniversityName] = useState('');
  
  // Additional fields for advanced search
  const [ward, setWard] = useState(searchParams.get('ward') || '');
  const [street, setStreet] = useState(searchParams.get('street') || '');
  const [maxElectricity, setMaxElectricity] = useState(searchParams.get('max_electricity') || '');
  const [maxWater, setMaxWater] = useState(searchParams.get('max_water') || '');
  
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        if (data?.config?.propertyTypes) {
          setCategories(data.config.propertyTypes);
        }
      })
      .catch(() => {});
  }, []);

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCity(e.target.value);
    setDistrict(''); // Reset district khi đổi city
  };

  const buildSearchParams = () => {
    const params = new URLSearchParams();
    if (city) params.set('city', city);
    if (district) params.set('district', district);
    if (propertyType) params.set('property_type', propertyType);
    if (keyword) params.set('q', keyword);
    
    if (ward) params.set('ward', ward);
    if (street) params.set('street', street);
    if (maxElectricity) params.set('max_electricity', maxElectricity);
    if (maxWater) params.set('max_water', maxWater);
    
    if (priceRange) {
      const [min, max] = priceRange.split('-');
      params.set('min_price', min);
      params.set('max_price', max);
    }
    
    if (universityName) {
      const uni = universities.find(u => u.name === universityName);
      if (uni) {
        params.set('uni_lat', uni.lat.toString());
        params.set('uni_lng', uni.lng.toString());
      }
    }
    
    return params;
  };

  const handleSearch = () => {
    const params = buildSearchParams();
    router.push(`/?${params.toString()}`, { scroll: false });
    setTimeout(() => {
      document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };
  
  const handleMapSearch = () => {
    const params = buildSearchParams();
    router.push(`/?${params.toString()}`, { scroll: false });
    setTimeout(() => {
      document.getElementById('map-view')?.scrollIntoView({ behavior: 'smooth' });
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
    <div className="relative w-full flex flex-col items-center justify-center overflow-hidden pt-6 pb-2 md:pt-24 md:pb-4">
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
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 flex flex-col items-center mt-2 md:mt-[-5vh]">
        
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-2 md:mb-6 w-full"
        >
          <h1 className="font-space text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight mb-1 md:mb-4 drop-shadow-sm leading-tight">
            Tương lai của <span className="md:hidden text-blue-600">Không Gian Sống</span>
            <span className="hidden md:block text-blue-600 font-space drop-shadow-md">Không Gian Sống</span>
          </h1>
          <p className="hidden md:block text-slate-600 text-base md:text-xl max-w-2xl mx-auto font-medium px-2">
            Khám phá trải nghiệm thuê nhà đẳng cấp với hệ thống tìm kiếm đa chiều.
          </p>
        </motion.div>

        {/* Search Section */}
        <div className="w-full max-w-3xl flex flex-col gap-2 md:gap-3 mt-2 md:mt-6">
          
          {/* Top Row: Keyword & Filter Toggle */}
          <div className="flex items-center gap-2 w-full">
            <div className="flex-1 flex items-center bg-white/95 backdrop-blur-md rounded-full px-5 py-3.5 border border-slate-200 shadow-sm hover:border-blue-400 transition-all">
              <Search className="w-5 h-5 text-blue-500 mr-2 shrink-0" />
              <input 
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Tìm tên phòng trọ, đường, địa chỉ..."
                className="bg-transparent text-slate-700 font-medium text-[15px] outline-none w-full placeholder-slate-400"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            
            <button 
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`p-3.5 rounded-full border shadow-sm transition-all flex items-center justify-center shrink-0 ${
                showAdvanced 
                  ? 'bg-blue-600 border-blue-600 text-white shadow-blue-500/30' 
                  : 'bg-white/95 border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-600'
              }`}
              title="Bộ lọc tìm kiếm"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>

          {/* Expanded Advanced Filters */}
          <motion.div 
            initial={false}
            animate={{ height: showAdvanced ? 'auto' : 0, opacity: showAdvanced ? 1 : 0 }}
            className="overflow-hidden w-full"
          >
            <div className="bg-white/95 backdrop-blur-xl border border-slate-200 rounded-3xl p-5 shadow-lg mb-2 mt-1 flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm">
                  <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                  Bộ lọc chi tiết
                </h3>
                <button onClick={() => setShowAdvanced(false)} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
                
                {/* City */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Tỉnh/Thành phố</label>
                  <div className="flex items-center bg-slate-50 rounded-xl px-4 py-2.5 border border-slate-200 hover:border-blue-300 transition-colors">
                    <select 
                      value={city}
                      onChange={handleCityChange}
                      className="bg-transparent text-slate-700 font-medium text-sm outline-none cursor-pointer appearance-none w-full"
                    >
                      <option value="">Tất cả Tỉnh/Thành</option>
                      {provincesList.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                  </div>
                </div>

                {/* District */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Quận/Huyện</label>
                  <div className={`flex items-center bg-slate-50 rounded-xl px-4 py-2.5 border border-slate-200 transition-colors ${city ? 'hover:border-blue-300' : 'opacity-50'}`}>
                    <select 
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      disabled={!city}
                      className="bg-transparent text-slate-700 font-medium text-sm outline-none cursor-pointer appearance-none w-full"
                    >
                      <option value="">{city ? "Tất cả Quận/Huyện" : "Chọn Tỉnh trước"}</option>
                      {districtsList.map((loc: string) => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                  </div>
                </div>
                
                {/* Ward */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Phường/Xã</label>
                  <div className="flex items-center bg-slate-50 rounded-xl px-4 py-2.5 border border-slate-200 hover:border-blue-300 transition-colors">
                    <input 
                      value={ward}
                      onChange={(e) => setWard(e.target.value)}
                      placeholder="Nhập phường/xã..."
                      className="bg-transparent text-slate-700 font-medium text-sm outline-none w-full placeholder-slate-400"
                    />
                  </div>
                </div>
                
                {/* Street */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Tên đường</label>
                  <div className="flex items-center bg-slate-50 rounded-xl px-4 py-2.5 border border-slate-200 hover:border-blue-300 transition-colors">
                    <input 
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="Nhập tên đường..."
                      className="bg-transparent text-slate-700 font-medium text-sm outline-none w-full placeholder-slate-400"
                    />
                  </div>
                </div>

                {/* Property Type */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Loại phòng</label>
                  <div className="flex items-center bg-slate-50 rounded-xl px-4 py-2.5 border border-slate-200 hover:border-blue-300 transition-colors">
                    <select 
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      className="bg-transparent text-slate-700 font-medium text-sm outline-none cursor-pointer appearance-none w-full"
                    >
                      <option value="">Tất cả loại hình</option>
                      {categories.map((cat: string) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                  </div>
                </div>
                
                {/* Room Price */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Giá phòng</label>
                  <div className="flex items-center bg-slate-50 rounded-xl px-4 py-2.5 border border-slate-200 hover:border-blue-300 transition-colors">
                    <select 
                      onChange={(e) => setPriceRange(e.target.value || "")}
                      value={priceRange}
                      className="bg-transparent text-slate-700 font-medium text-sm outline-none cursor-pointer appearance-none w-full"
                    >
                      <option value="">Tất cả mức giá</option>
                      <option value="0-2000000">Dưới 2 triệu</option>
                      <option value="2000000-5000000">Từ 2 - 5 triệu</option>
                      <option value="5000000-10000000">Từ 5 - 10 triệu</option>
                      <option value="10000000-999999999">Trên 10 triệu</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                  </div>
                </div>
                
                {/* Electricity Price */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Giá điện tối đa (VNĐ)</label>
                  <div className="flex items-center bg-slate-50 rounded-xl px-4 py-2.5 border border-slate-200 hover:border-blue-300 transition-colors">
                    <input 
                      type="number"
                      value={maxElectricity}
                      onChange={(e) => setMaxElectricity(e.target.value)}
                      placeholder="VD: 3500..."
                      className="bg-transparent text-slate-700 font-medium text-sm outline-none w-full placeholder-slate-400"
                    />
                  </div>
                </div>
                
                {/* Water Price */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Giá nước tối đa (VNĐ)</label>
                  <div className="flex items-center bg-slate-50 rounded-xl px-4 py-2.5 border border-slate-200 hover:border-blue-300 transition-colors">
                    <input 
                      type="number"
                      value={maxWater}
                      onChange={(e) => setMaxWater(e.target.value)}
                      placeholder="VD: 100000..."
                      className="bg-transparent text-slate-700 font-medium text-sm outline-none w-full placeholder-slate-400"
                    />
                  </div>
                </div>
                
              </div>
              
              {/* Action Buttons Inside Detailed Filter */}
              <div className="flex gap-3 mt-6 pt-5 border-t border-slate-100">
                <button 
                  onClick={() => {
                    setShowAdvanced(false);
                    handleMapSearch();
                  }}
                  className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm flex-1"
                >
                  <Map className="w-4 h-4 text-emerald-600 font-bold" />
                  <span className="font-bold text-sm">BẢN ĐỒ</span>
                </button>
                
                <button 
                  onClick={() => {
                    setShowAdvanced(false);
                    handleSearch();
                  }}
                  className="bg-blue-600 hover:bg-blue-500 px-4 py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-500/30 flex-1"
                >
                  <Search className="w-4 h-4 text-white font-bold" />
                  <span className="font-bold text-sm text-white">TÌM KIẾM</span>
                </button>
              </div>

            </div>
          </motion.div>

          {/* Bottom Row: Simple Filters & Search Button */}
          {!showAdvanced && (
            <div className="flex flex-col w-full gap-2">
              
              {/* Row 1: City & District */}
              <div className="grid grid-cols-2 gap-2 w-full mt-1 md:mt-2">
                {/* City */}
                <div className="flex items-center bg-white/95 backdrop-blur-md rounded-full px-3 py-2.5 md:px-4 md:py-3 border border-slate-200 shadow-sm hover:border-blue-300 transition-colors w-full overflow-hidden">
                  <MapPin className="w-4 h-4 text-emerald-500 mr-1.5 shrink-0" />
                  <select 
                    value={city}
                    onChange={handleCityChange}
                    className="bg-transparent text-slate-700 font-medium text-xs md:text-sm outline-none cursor-pointer appearance-none w-full truncate"
                  >
                    <option value="">Tỉnh/Thành</option>
                    {provincesList.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                {/* District */}
                <div className={`flex items-center bg-white/95 backdrop-blur-md rounded-full px-3 py-2.5 md:px-4 md:py-3 border border-slate-200 shadow-sm transition-colors w-full overflow-hidden ${city ? 'hover:border-blue-300' : 'opacity-50'}`}>
                  <select 
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    disabled={!city}
                    className="bg-transparent text-slate-700 font-medium text-xs md:text-sm outline-none cursor-pointer appearance-none w-full truncate"
                  >
                    <option value="">{city ? "Quận/Huyện" : "Chọn Tỉnh"}</option>
                    {districtsList.map((loc: string) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Price & University */}
              <div className="grid grid-cols-2 gap-2 w-full">
                
                {/* Price */}
                <div className="flex items-center bg-white/95 backdrop-blur-md rounded-full px-3 py-2.5 md:px-4 md:py-3 border border-slate-200 shadow-sm hover:border-blue-300 transition-colors w-full overflow-hidden">
                  <span className="text-amber-500 mr-1.5 font-bold text-xs md:text-sm shrink-0">₫</span>
                  <select 
                    onChange={(e) => setPriceRange(e.target.value || "")}
                    value={priceRange}
                    className="bg-transparent text-slate-700 font-medium text-xs md:text-sm outline-none cursor-pointer appearance-none w-full truncate"
                  >
                    <option value="">Mức giá</option>
                    <option value="0-2000000">Dưới 2 triệu</option>
                    <option value="2000000-5000000">Từ 2 - 5 triệu</option>
                    <option value="5000000-10000000">Từ 5 - 10 triệu</option>
                    <option value="10000000-999999999">Trên 10 triệu</option>
                  </select>
                </div>

                {/* University Search */}
                <div className="flex items-center bg-white/95 backdrop-blur-md rounded-full px-3 py-2.5 md:px-4 md:py-3 border border-slate-200 shadow-sm hover:border-blue-300 transition-colors w-full overflow-hidden">
                  <GraduationCap className="w-4 h-4 text-violet-500 mr-1.5 shrink-0" />
                  <input 
                    list="universities-list"
                    value={universityName}
                    onChange={(e) => setUniversityName(e.target.value)}
                    placeholder="Đại học (bán kính 3km)..."
                    className="bg-transparent text-slate-700 font-medium text-xs md:text-sm outline-none w-full placeholder-slate-400 truncate"
                  />
                  <datalist id="universities-list">
                    {universities.map(u => (
                      <option key={u.name} value={u.name} />
                    ))}
                  </datalist>
                </div>
              </div>

              {/* Row 3: Action Buttons */}
              <div className="flex w-full gap-2 mt-1 md:mt-2">
                <button 
                  onClick={handleMapSearch}
                  className="bg-white/95 hover:bg-slate-100 text-slate-700 backdrop-blur-md border border-slate-200 px-3 py-2.5 md:px-4 md:py-3 rounded-full flex items-center justify-center gap-1.5 transition-all shadow-sm flex-1 whitespace-nowrap"
                >
                  <Map className="w-4 h-4 text-emerald-600 font-bold" />
                  <span className="font-bold text-xs md:text-sm">BẢN ĐỒ</span>
                </button>
                
                <button 
                  onClick={handleSearch}
                  className="bg-blue-600 hover:bg-blue-500 px-3 py-2.5 md:px-4 md:py-3 rounded-full flex items-center justify-center gap-1.5 transition-all shadow-md shadow-blue-500/30 flex-[1.5] whitespace-nowrap"
                >
                  <Search className="w-4 h-4 text-white font-bold" />
                  <span className="font-bold text-xs md:text-sm text-white">TÌM KIẾM</span>
                </button>
              </div>
              
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
