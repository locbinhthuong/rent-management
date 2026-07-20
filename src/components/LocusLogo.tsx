import React from 'react';

interface LocusLogoProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

export default function LocusLogo({ className = "", width = "100%", height = "100%", variant = 'vertical' }: LocusLogoProps & { variant?: 'vertical' | 'horizontal' }) {
  const Icon = (
    <svg 
      width={width} 
      height={height} 
      viewBox="70 40 260 190" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      {/* Sky/Airplane Line */}
      <path d="M190 85 L280 60" stroke="#1d5681" strokeWidth="4" />
      
      {/* Airplane */}
      <path d="M290 65 L280 75 L300 70 L315 65 L320 63 C325 61 325 58 320 57 L310 56 L305 45 L295 50 L300 59 L285 63 Z" fill="#1d5681" />

      {/* House Roof */}
      <path d="M150 100 L200 85 L320 120" stroke="#1d5681" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
      
      {/* House Left Wall */}
      <path d="M175 110 L175 220" stroke="#1d5681" strokeWidth="10" strokeLinecap="round" />
      
      {/* House Right Wall */}
      <path d="M305 115 L305 220" stroke="#1d5681" strokeWidth="10" strokeLinecap="round" />
      
      {/* House Floor */}
      <path d="M170 220 L320 220" stroke="#1d5681" strokeWidth="10" strokeLinecap="round" />

      {/* Window (4 squares) */}
      <rect x="210" y="115" width="12" height="12" fill="#1d5681" />
      <rect x="228" y="115" width="12" height="12" fill="#1d5681" />
      <rect x="210" y="132" width="12" height="12" fill="#1d5681" />
      <rect x="228" y="132" width="12" height="12" fill="#1d5681" />

      {/* Door */}
      <path d="M210 160 L245 160 L245 215 L210 215 Z" stroke="#1d5681" strokeWidth="8" fill="none" />

      {/* Palm Tree Trunk */}
      <path d="M130 90 L130 220" stroke="#25b6d6" strokeWidth="10" strokeLinecap="round" />
      <path d="M110 220 L150 220" stroke="#25b6d6" strokeWidth="8" strokeLinecap="round" />

      {/* Palm Tree Leaves */}
      <path d="M130 95 C100 85 80 110 75 125 C85 115 105 105 130 110" fill="#25b6d6" />
      <path d="M130 95 C90 70 85 80 85 80 C100 85 110 100 130 105" fill="#25b6d6" />
      <path d="M130 95 C110 60 120 50 120 50 C125 65 125 80 130 90" fill="#25b6d6" />
      <path d="M130 95 C145 55 160 55 160 55 C155 70 140 80 130 90" fill="#25b6d6" />
      <path d="M130 95 C165 75 180 85 180 85 C160 90 145 100 130 105" fill="#25b6d6" />
      <path d="M130 95 C160 110 165 130 165 130 C150 120 140 110 130 105" fill="#25b6d6" />
    </svg>
  );

  if (variant === 'horizontal') {
    return (
      <div className={`flex items-center gap-1.5 ${className}`}>
        {Icon}
        <span className="font-sans font-black text-slate-900 text-lg md:text-xl tracking-tight leading-none mt-1">
          locus<span className="text-cyan-500">home</span>
        </span>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center gap-1 ${className}`}>
      {Icon}
      <span className="font-sans font-black text-slate-900 text-2xl tracking-tight leading-none mt-2">
        locus<span className="text-cyan-500">home</span>
      </span>
    </div>
  );
}
