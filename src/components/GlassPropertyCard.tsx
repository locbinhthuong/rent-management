'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, ShieldCheck, Home, Bath, Maximize } from 'lucide-react';
import { motion } from 'framer-motion';

interface GlassPropertyCardProps {
  post: any;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  isActive?: boolean;
}

export default function GlassPropertyCard({ post, onMouseEnter, onMouseLeave, isActive }: GlassPropertyCardProps) {
  const price = post.price || 0;
  const address = post.address || 'Chưa cập nhật địa chỉ';
  const imageUrl = post.images && post.images.length > 0 
    ? post.images[0] 
    : 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop';

  return (
    <motion.div
      whileHover={{ y: -5 }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`relative rounded-2xl overflow-hidden backdrop-blur-lg bg-white/40 border transition-all duration-300 ${
        isActive ? 'border-indigo-500 shadow-[0_8px_32px_0_rgba(79,70,229,0.2)]' : 'border-white/40 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] hover:border-white/60 hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.1)]'
      }`}
    >
      <Link href={`/p/${post._id}`} className="block">
        {/* Image Section */}
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <Image
            src={imageUrl}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-700 hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-3 left-3 bg-white/70 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-slate-800 shadow-sm">
            {post.property_type || 'Phòng trọ'}
          </div>
          {post.is_verified && (
            <div className="absolute top-3 right-3 bg-emerald-500/90 backdrop-blur-md px-2 py-1 rounded-full flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-5 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-slate-800 line-clamp-2 leading-snug text-lg">
              {post.title}
            </h3>
          </div>

          <div className="flex items-end gap-2">
            <div className="font-extrabold text-indigo-600 text-xl">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}
            </div>
            <span className="text-slate-500 text-sm mb-1 font-medium">/tháng</span>
          </div>

          <div className="flex items-start gap-1.5 text-slate-600 text-sm">
            <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-slate-400" />
            <span className="line-clamp-1">{address}</span>
          </div>

          {/* Amenities Row */}
          <div className="pt-3 flex items-center gap-4 border-t border-slate-200/50 text-slate-600 text-sm">
            {post.area_sqm && (
              <div className="flex items-center gap-1.5">
                <Maximize className="w-4 h-4 text-indigo-400" />
                <span className="font-medium">{post.area_sqm} m²</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Home className="w-4 h-4 text-indigo-400" />
              <span className="font-medium">1 PN</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Bath className="w-4 h-4 text-indigo-400" />
              <span className="font-medium">1 WC</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
