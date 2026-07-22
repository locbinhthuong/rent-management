import React from 'react';
import Image from 'next/image';

interface LocusLogoProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  variant?: 'vertical' | 'horizontal'; // Kept for backward compatibility
}

export default function LocusLogo({ className = "", width, height }: LocusLogoProps) {
  // Parse the passed height. 
  // If it's a huge value from old splash screens (like 250), cap it to a reasonable size for a horizontal logo (e.g. 70).
  let parsedHeight = parseFloat(height as string) || 45;
  if (parsedHeight > 80) {
    parsedHeight = 70;
  }
  
  // Calculate width proportionally (approx 3.5:1 ratio for horizontal logos)
  const parsedWidth = parsedHeight * 3.5;

  return (
    <div 
      className={`relative flex items-center justify-center shrink-0 ${className}`} 
      style={{ width: parsedWidth, height: parsedHeight }}
    >
      <Image 
        src="/logo_locushome.png" 
        alt="LocusHome Logo" 
        fill
        sizes={`${parsedWidth}px`}
        className="object-contain"
        priority
      />
    </div>
  );
}
