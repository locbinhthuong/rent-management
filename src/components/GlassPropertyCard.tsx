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
  const address = post.address || 'Chưa cập nhật địa chỉ';
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
        className={`relative rounded-2xl overflow-hidden backdrop-blur-xl bg-slate-900/40 border transition-all duration-300 ${
          isActive 
            ? 'border-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.4)]' 
            : 'border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] hover:border-white/30 hover:shadow-[0_8px_32px_0_rgba(139,92,246,0.3)]'
        }`}
      >
        <Link href={`/p/${post._id}`} className="block h-full w-full">
          {/* Image Section */}
          <div className="relative aspect-[4/3] w-full overflow-hidden group/slider">
            <Image
              src={images[currentImgIndex]}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-700 hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {/* Dark gradient overlay on image for cyberpunk feel */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80 pointer-events-none"></div>
            
            {/* Carousel Controls */}
            {images.length > 1 && (
              <>
                <button 
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentImgIndex((prev) => (prev - 1 + images.length) % images.length); }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1.5 rounded-full backdrop-blur-md transition opacity-0 group-hover/slider:opacity-100 z-30"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentImgIndex((prev) => (prev + 1) % images.length); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1.5 rounded-full backdrop-blur-md transition opacity-0 group-hover/slider:opacity-100 z-30"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                {/* Dots */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-30 pointer-events-none">
                  {images.map((_: any, idx: number) => (
                    <div 
                      key={idx} 
                      className={`h-1.5 rounded-full transition-all ${idx === currentImgIndex ? 'w-3 bg-cyan-400' : 'w-1.5 bg-white/50'}`}
                    />
                  ))}
                </div>
              </>
            )}

            <div className="absolute top-3 left-3 bg-slate-900/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-cyan-300 border border-white/10 shadow-[0_0_10px_rgba(6,182,212,0.3)] z-20">
              {post.property_type || 'Phòng trọ'}
            </div>
            {post.is_verified && (
              <div className="absolute top-3 right-3 bg-emerald-500/20 backdrop-blur-md px-2 py-1 rounded-full flex items-center justify-center border border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.3)] z-20">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="p-5 space-y-3 relative z-20 translate-z-[20px]" style={{ transform: "translateZ(30px)" }}>
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-slate-100 line-clamp-2 leading-snug text-lg font-space tracking-tight">
                {post.title}
              </h3>
            </div>

            <div className="flex items-end gap-2">
              <div className="font-extrabold text-cyan-400 text-xl font-space glow-cyan-text">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}
              </div>
              <span className="text-slate-400 text-sm mb-1 font-medium">/tháng</span>
            </div>

            <div className="flex items-start gap-1.5 text-slate-300 text-sm">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-violet-400" />
              <span className="line-clamp-1">{address}</span>
            </div>

            {/* Amenities Row */}
            <div className="pt-3 flex items-center gap-4 border-t border-white/10 text-slate-400 text-sm">
              {post.area_sqm && (
                <div className="flex items-center gap-1.5">
                  <Maximize className="w-4 h-4 text-slate-500" />
                  <span className="font-medium">{post.area_sqm} m²</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Home className="w-4 h-4 text-slate-500" />
                <span className="font-medium">1 PN</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Bath className="w-4 h-4 text-slate-500" />
                <span className="font-medium">1 WC</span>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
}
