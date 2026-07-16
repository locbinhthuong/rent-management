'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, ShieldCheck, Home, Bath, Maximize, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface GlassPropertyCardProps {
  post: any;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  isActive?: boolean;
}

export default function GlassPropertyCard({ post, onMouseEnter, onMouseLeave, isActive }: GlassPropertyCardProps) {
  const price = post.price || 0;
  const fullAddress = [post.address, post.district, post.city].filter(Boolean).join(', ') || 'Chưa cập nhật địa chỉ';
  const images = post.images && post.images.length > 0 
    ? post.images 
    : ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop'];
  
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  // 3D Tilt Effect Setup
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7.5deg", "-7.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7.5deg", "7.5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    if (onMouseLeave) onMouseLeave();
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="relative z-10 perspective-1000"
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        className={`relative rounded-2xl overflow-hidden backdrop-blur-xl bg-white/40 border transition-all duration-300 ${
          isActive 
            ? 'border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.5)]' 
            : 'border-emerald-400/60 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:border-emerald-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]'
        }`}
      >
        <div className="block h-full w-full">
          {/* Image Section */}
          <div className="relative aspect-[4/3] w-full overflow-hidden group/slider">
            <Link href={`/p/${post.slug || post._id || post.id}`} className="absolute inset-0 z-0">
              <Image
                src={images[currentImgIndex]}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </Link>
            
            {/* Carousel Controls */}
            {images.length > 1 && (
              <>
                <button 
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentImgIndex((prev) => (prev - 1 + images.length) % images.length); }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-slate-900 p-1.5 rounded-full backdrop-blur-md transition opacity-100 md:opacity-0 md:group-hover/slider:opacity-100 z-30"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentImgIndex((prev) => (prev + 1) % images.length); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-slate-900 p-1.5 rounded-full backdrop-blur-md transition opacity-100 md:opacity-0 md:group-hover/slider:opacity-100 z-30"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                {/* Dots */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-30 pointer-events-none">
                  {images.map((_: any, idx: number) => (
                    <div 
                      key={idx} 
                      className={`h-1.5 rounded-full transition-all ${idx === currentImgIndex ? 'w-3 bg-white' : 'w-1.5 bg-white/50'}`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Badges */}
            <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] font-bold text-slate-900 tracking-wide uppercase shadow-sm z-20 pointer-events-none">
              {post.property_type || 'PHÒNG TRỌ'}
            </div>
            
            {post.is_verified && (
              <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-md px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm z-20 pointer-events-none">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[10px] font-bold text-slate-900 tracking-wide uppercase">ĐÃ XÁC THỰC</span>
              </div>
            )}
          </div>

          {/* Content Section */}
          <Link href={`/p/${post.slug || post._id || post.id}`} className="block p-5 flex flex-col gap-3 relative z-20">
            {/* Title & Location */}
            <div>
              <h3 className="font-bold text-slate-900 line-clamp-1 text-[16px] md:text-lg mb-1 tracking-tight">
                {post.title}
              </h3>
              <div className="flex items-center gap-1.5 text-slate-600 text-xs font-medium">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="line-clamp-1">{fullAddress}</span>
              </div>
            </div>

            {/* Price & View Button */}
            <div className="flex items-end justify-between mt-1">
              <div className="flex items-baseline gap-1">
                <span className="font-extrabold text-cyan-400 text-[18px] md:text-[22px] tracking-tight">
                  {new Intl.NumberFormat('vi-VN').format(price)}₫
                </span>
                <span className="text-slate-600 text-[11px] md:text-xs font-medium">/tháng</span>
              </div>
            </div>

            {/* Amenities Tags */}
            <div className="flex flex-wrap items-center gap-2 mt-1">
              {post.area_sqm && (
                <div className="flex items-center gap-1.5 bg-slate-100/80 border border-slate-300/50 rounded-lg px-2.5 py-1.5 text-slate-700">
                  <Maximize className="w-3.5 h-3.5 opacity-70" />
                  <span className="font-medium text-[11px] md:text-xs">{post.area_sqm} m²</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 bg-slate-100/80 border border-slate-300/50 rounded-lg px-2.5 py-1.5 text-slate-700">
                <Home className="w-3.5 h-3.5 opacity-70" />
                <span className="font-medium text-[11px] md:text-xs">1 PN</span>
              </div>
            </div>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}
