'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Search, MapPin, Home, DollarSign, ChevronDown } from 'lucide-react';
import Link from 'next/link';

export default function FuturisticHero() {
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
          whileHover={{ scale: 1.02 }}
          className="glass-pill rounded-full p-2 w-full flex flex-col md:flex-row items-center justify-between mx-auto shadow-[0_0_40px_rgba(6,182,212,0.15)] transition-all"
        >
          {/* Segments */}
          <div className="flex-1 flex flex-col md:flex-row items-center w-full divide-y md:divide-y-0 md:divide-x divide-white/20">
            
            {/* Segment 1: Search */}
            <div className="flex items-center gap-3 px-6 py-4 md:py-3 w-full hover:bg-white/5 transition-colors rounded-l-full cursor-pointer group">
              <Search className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
              <div className="flex flex-col">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Từ khóa</span>
                <span className="text-slate-100 font-medium">Bạn muốn tìm gì?</span>
              </div>
            </div>

            {/* Segment 2: Location */}
            <div className="flex items-center gap-3 px-6 py-4 md:py-3 w-full hover:bg-white/5 transition-colors cursor-pointer group">
              <MapPin className="w-5 h-5 text-violet-400 group-hover:text-violet-300 transition-colors" />
              <div className="flex flex-col">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Khu vực</span>
                <span className="text-slate-100 font-medium">Chọn địa điểm</span>
              </div>
            </div>

            {/* Segment 3: Property Type */}
            <div className="flex items-center gap-3 px-6 py-4 md:py-3 w-full hover:bg-white/5 transition-colors cursor-pointer group">
              <Home className="w-5 h-5 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
              <div className="flex flex-col">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Loại phòng</span>
                <span className="text-slate-100 font-medium">Tất cả</span>
              </div>
            </div>

            {/* Segment 4: Price */}
            <div className="flex items-center gap-3 px-6 py-4 md:py-3 w-full hover:bg-white/5 transition-colors cursor-pointer group">
              <DollarSign className="w-5 h-5 text-amber-400 group-hover:text-amber-300 transition-colors" />
              <div className="flex flex-col">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Mức giá</span>
                <span className="text-slate-100 font-medium">Bất kỳ</span>
              </div>
            </div>

          </div>

          {/* Search Button (Bright Blue Circle) */}
          <button className="bg-cyan-500 hover:bg-cyan-400 w-14 h-14 shrink-0 rounded-full flex items-center justify-center ml-2 mr-1 transition-all glow-cyan hover:scale-110 active:scale-95 shadow-lg hidden md:flex">
            <Search className="w-6 h-6 text-slate-900" />
          </button>
          
          {/* Mobile Search Button */}
          <button className="md:hidden bg-cyan-500 w-full mt-2 py-3 rounded-full flex items-center justify-center gap-2 font-bold text-slate-900 glow-cyan">
            <Search className="w-5 h-5" /> TÌM KIẾM
          </button>
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
