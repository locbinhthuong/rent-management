import React from 'react';
import Image from 'next/image';

interface LocusLogoProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

export default function LocusLogo({ className = "", width = 55, height = 55, variant = 'vertical' }: LocusLogoProps & { variant?: 'vertical' | 'horizontal' }) {
  const parsedWidth = parseFloat(width as string) || 55;
  const parsedHeight = parseFloat(height as string) || 55;

  const Icon = (
    <div 
      className="relative flex items-center justify-center shrink-0" 
      style={{ width: parsedWidth, height: parsedHeight }}
    >
      <Image 
        src="/logo_locushome.png" 
        alt="2026 LOCUS" 
        fill
        sizes={`${parsedWidth}px`}
        className="object-contain scale-[2.2] origin-center"
      />
    </div>
  );

  if (variant === 'horizontal') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {Icon}
        <span className="font-sans font-black text-slate-900 text-lg md:text-xl tracking-tight leading-none uppercase">
          LOCUS<span className="text-cyan-500">HOME</span>
        </span>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center gap-2 ${className}`}>
      {Icon}
      <span className="font-sans font-black text-slate-900 text-2xl tracking-tight leading-none uppercase">
        LOCUS<span className="text-cyan-500">HOME</span>
      </span>
    </div>
  );
}
