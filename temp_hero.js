const fs = require('fs');
const content = "use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Search, MapPin, Home, Navigation } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { getAllProvinces, getDistrictsByProvince } from "@/lib/data/provinces";
import MapClientWrapper from "@/components/MapClientWrapper";

export default function FuturisticHero({ posts = [] }: { posts?: any[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [district, setDistrict] = useState(searchParams.get("district") || "");
  const [propertyType, setPropertyType] = useState(searchParams.get("property_type") || "");
  const [keyword, setKeyword] = useState(searchParams.get("q") || "");
  
  const minPrice = searchParams.get("min_price");
  const maxPrice = searchParams.get("max_price");
  const initialPriceRange = (minPrice && maxPrice) ? \\-\\ : "";
  const [priceRange, setPriceRange] = useState(initialPriceRange);
  
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("/api/admin/categories")
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
    setDistrict("");
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (district) params.set("district", district);
    if (propertyType) params.set("property_type", propertyType);
    if (keyword) params.set("q", keyword);
    
    if (priceRange) {
      const [min, max] = priceRange.split("-");
      params.set("min_price", min);
      params.set("max_price", max);
    }
    
    router.push(\/?\\, { scroll: false });
    setTimeout(() => {
      document.getElementById("explore")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleNearMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const params = new URLSearchParams();
          params.set("lat", position.coords.latitude.toString());
          params.set("lng", position.coords.longitude.toString());
          router.push(\/?\#explore\);
        },
        (error) => {
          alert("Không th? l?y v? trí c?a b?n. Vui lòng ki?m tra quy?n trên trình duy?t.");
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      alert("Trình duy?t không h? tr? d?nh v?.");
    }
  };

  const provincesList = getAllProvinces();
  const districtsList = city ? getDistrictsByProvince(city) : [];

  return (
    <div className="relative w-full min-h-[100svh] md:min-h-[90vh] flex flex-col items-center justify-center overflow-hidden pt-24 pb-12 md:py-0">
      {/* Futuristic Background */}
      <div className="absolute inset-0 z-0 bg-slate-950">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-cyan-500 opacity-20 blur-[100px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/80 to-slate-950"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 flex flex-col items-center mt-0 md:mt-[-5vh]">
        
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-8 md:mb-10 w-full"
        >
          <h1 className="font-space text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight mb-3 md:mb-4 drop-shadow-2xl leading-tight">
            Tuong lai c?a <br className="md:hidden" />
            <span className="text-cyan-400 font-space glow-cyan">Không Gian S?ng</span>
          </h1>
          <p className="text-slate-700 text-base md:text-xl max-w-2xl mx-auto font-medium px-2">
            Khám phá tr?i nghi?m thuê nhà d?ng c?p v?i h? th?ng tìm ki?m da chi?u.
          </p>
        </motion.div>

        {/* 2-Column Split: Search Filter & Map */}
        <div className="w-full flex flex-col lg:flex-row gap-6 md:gap-8 lg:h-[450px]">
          
          {/* Left Column: Search Filter */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="w-full lg:w-1/3 bg-white/95 backdrop-blur-xl rounded-3xl border border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)] p-5 md:p-6 flex flex-col h-full"
          >
            <div className="flex flex-col gap-1 overflow-y-auto custom-scrollbar flex-1 pr-1">
              
              {/* Row 1: Keyword */}
              <div className="flex items-center gap-4 py-3 border-b border-slate-200/80 group">
                <Search className="w-5 h-5 text-blue-500 shrink-0" />
                <div className="flex flex-col w-full flex-1">
                  <span className="text-[10px] text-slate-600 font-medium uppercase tracking-widest mb-0.5">T? khóa</span>
                  <input 
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Tìm tên, d?a ch?..."
                    className="bg-transparent text-slate-900 font-semibold text-[14px] outline-none placeholder-slate-500 w-full"
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>
              </div>

              {/* Row 2: City */}
              <div className="flex items-center gap-4 py-3 border-b border-slate-200/80 group">
                <MapPin className="w-5 h-5 text-emerald-500 shrink-0" />
                <div className="flex flex-col w-full flex-1">
                  <span className="text-[10px] text-slate-600 font-medium uppercase tracking-widest mb-0.5">T?nh/Thành</span>
                  <select 
                    value={city}
                    onChange={handleCityChange}
                    className="bg-transparent text-slate-900 font-semibold text-[14px] outline-none appearance-none cursor-pointer w-full"
                  >
                    <option value="" className="bg-white">Toàn qu?c</option>
                    {provincesList.map((p) => (
                      <option key={p} value={p} className="bg-white">{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 3: District */}
              <div className={\lex items-center gap-4 py-3 border-b border-slate-200/80 group \\}>
                <div className="w-5 h-5 rounded-full border-2 border-violet-500 flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
                </div>
                <div className="flex flex-col w-full flex-1">
                  <span className="text-[10px] text-slate-600 font-medium uppercase tracking-widest mb-0.5">Qu?n/Huy?n</span>
                  <select 
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    disabled={!city}
                    className="bg-transparent text-slate-900 font-semibold text-[14px] outline-none appearance-none cursor-pointer w-full"
                  >
                    <option value="" className="bg-white">{city ? "Ch?n Qu?n/Huy?n" : "Ch?n T?nh/Thành tru?c"}</option>
                    {districtsList.map((loc: string) => (
                      <option key={loc} value={loc} className="bg-white">{loc}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 4: Property Type */}
              <div className="flex items-center gap-4 py-3 border-b border-slate-200/80 group">
                <Home className="w-5 h-5 text-teal-400 shrink-0" />
                <div className="flex flex-col w-full flex-1">
                  <span className="text-[10px] text-slate-600 font-medium uppercase tracking-widest mb-0.5">Lo?i phòng</span>
                  <select 
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="bg-transparent text-slate-900 font-semibold text-[14px] outline-none appearance-none cursor-pointer w-full"
                  >
                    <option value="" className="bg-white">T?t c? lo?i hình</option>
                    {categories.map((cat: any) => (
                      <option key={cat._id} value={cat.name} className="bg-white">{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 5: Price */}
              <div className="flex items-center gap-4 py-3 group">
                <div className="w-5 h-5 flex items-center justify-center bg-amber-500/20 text-amber-500 rounded shrink-0 font-bold text-xs border border-amber-500/50">
                  ?
                </div>
                <div className="flex flex-col w-full flex-1">
                  <span className="text-[10px] text-slate-600 font-medium uppercase tracking-widest mb-0.5">M?c giá</span>
                  <select 
                    onChange={(e) => {
                      const val = e.target.value;
                      if (!val) setPriceRange("");
                      else setPriceRange(val);
                    }}
                    value={priceRange}
                    className="bg-transparent text-slate-900 font-semibold text-[14px] outline-none appearance-none cursor-pointer w-full"
                  >
                    <option value="" className="bg-white">M?i m?c giá</option>
                    <option value="0-2000000" className="bg-white">Du?i 2 tri?u</option>
                    <option value="2000000-5000000" className="bg-white">T? 2 - 5 tri?u</option>
                    <option value="5000000-10000000" className="bg-white">T? 5 - 10 tri?u</option>
                    <option value="10000000-999999999" className="bg-white">Trên 10 tri?u</option>
                  </select>
                </div>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-4 pt-4 border-t border-slate-200/50 w-full shrink-0">
              <button 
                onClick={handleNearMe}
                className="flex-[1] bg-violet-600/10 hover:bg-violet-600/20 border border-violet-500/30 py-3 rounded-xl flex items-center justify-center transition-all"
                title="G?n tôi"
              >
                <Navigation className="w-5 h-5 text-violet-500" />
              </button>
              
              <button 
                onClick={handleSearch}
                className="flex-[4] bg-cyan-500 hover:bg-cyan-400 py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)]"
              >
                <Search className="w-4 h-4 text-slate-950 font-bold" />
                <span className="font-bold text-[14px] text-slate-950">TÌM KI?M</span>
              </button>
            </div>
          </motion.div>

          {/* Right Column: Map */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="w-full lg:w-2/3 h-[400px] lg:h-full bg-slate-100/5 backdrop-blur-md rounded-3xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden relative group"
          >
            {/* Floating glowing frame */}
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-cyan-500/30 rounded-3xl transition-colors duration-500 z-50 pointer-events-none"></div>
            
            <MapClientWrapper posts={posts} />
            
            {/* Empty state fallback if no posts */}
            {posts.length === 0 && (
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[400] pointer-events-none">
                <span className="text-cyan-400 font-space font-medium glow-cyan-text bg-slate-950/80 px-6 py-3 rounded-full border border-cyan-500/30">
                  Không tìm th?y phòng ? khu v?c này
                </span>
              </div>
            )}
          </motion.div>
        </div>
      </div>
      
      {/* Scroll Down Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 hidden md:flex cursor-pointer"
        onClick={() => document.getElementById("explore")?.scrollIntoView({ behavior: "smooth" })}
      >
        <span className="text-xs text-slate-500 font-space tracking-widest uppercase">Danh sách phòng</span>
        <motion.div 
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-6 h-10 rounded-full border border-slate-500/50 flex items-start justify-center p-1 bg-slate-900/50 backdrop-blur-sm"
        >
          <div className="w-1 h-2.5 bg-cyan-400 rounded-full glow-cyan"></div>
        </motion.div>
      </motion.div>
    </div>
  );
}
;
fs.writeFileSync('src/components/FuturisticHero.tsx', content, 'utf8');
