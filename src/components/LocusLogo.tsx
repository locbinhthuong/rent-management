import React from 'react';
import Image from 'next/image';

interface LocusLogoProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

export default function LocusLogo({ className = "", width = 55, height = 55, variant = 'vertical' }: LocusLogoProps & { variant?: 'vertical' | 'horizontal' }) {
  const Icon = (
    <div 
      className="relative flex items-center justify-center shrink-0" 
      style={{ width: Number(width) || 55, height: Number(height) || 55 }}
    >
      <Image 
        src="/logo.png" 
        alt="2026 LOCUS" 
        fill
        sizes={`${Number(width) || 55}px`}
        className="object-contain scale-[1.6] origin-center"
      />
    </div>
  );

  if (variant === 'horizontal') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {Icon}
        <span className="font-sans font-black text-slate-900 text-lg md:text-xl tracking-tight leading-none uppercase">
          2026 <span className="text-cyan-500">LOCUS</span>
        </span>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center gap-2 ${className}`}>
      {Icon}
      <span className="font-sans font-black text-slate-900 text-2xl tracking-tight leading-none uppercase">
        2026 <span className="text-cyan-500">LOCUS</span>
      </span>
    </div>
  );
}
