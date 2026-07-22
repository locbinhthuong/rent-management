'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';

export default function PostImageGallery({ images }: { images: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsFullscreen(false);
    };
    if (isFullscreen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-[400px] bg-white/80 rounded-2xl flex items-center justify-center border border-slate-200">
        <span className="text-slate-500 font-space tracking-wider">CHƯA CÓ HÌNH ẢNH</span>
      </div>
    );
  }

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const mainView = (
    <div className="relative w-full h-[300px] sm:h-[400px] rounded-2xl overflow-hidden group bg-white">
      <Image 
        src={images[currentIndex]} 
        alt={`Phòng ảnh ${currentIndex + 1}`} 
        fill 
        className="object-contain transition duration-500" 
        priority 
        sizes="(max-width: 768px) 100vw, 66vw" 
      />
      
      {/* Navigation Controls */}
      {images.length > 1 && (
        <>
          <button 
            onClick={handlePrev} 
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-md transition opacity-100 md:opacity-0 md:group-hover:opacity-100"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={handleNext} 
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-md transition opacity-100 md:opacity-0 md:group-hover:opacity-100"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md">
            {images.map((_, idx) => (
              <div 
                className={`h-2 rounded-full transition-all ${idx === currentIndex ? 'w-4 bg-cyan-400' : 'w-2 bg-white/50'}`}
              />
            ))}
          </div>
        </>
      )}

      {/* Fullscreen Toggle */}
      <button 
        onClick={() => setIsFullscreen(true)}
        className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white p-2 rounded-lg backdrop-blur-md transition opacity-100 md:opacity-0 md:group-hover:opacity-100 z-10"
      >
        <Maximize2 className="w-5 h-5" />
      </button>
    </div>
  );

  const fullscreenOverlay = (
    <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex items-center justify-center">
      <button 
        onClick={() => setIsFullscreen(false)}
        className="absolute top-6 right-6 text-white hover:text-cyan-400 bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors z-50"
      >
        <X className="w-8 h-8" />
      </button>
      
      <div className="relative w-full h-full flex items-center justify-center p-4">
        <Image 
          src={images[currentIndex]} 
          alt={`Fullscreen ${currentIndex + 1}`} 
          fill 
          className="object-contain"
          sizes="100vw"
        />
        {images.length > 1 && (
          <>
            <button 
              onClick={handlePrev} 
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 md:p-4 rounded-full backdrop-blur-md transition z-50"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button 
              onClick={handleNext} 
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 md:p-4 rounded-full backdrop-blur-md transition z-50"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white font-space tracking-widest bg-white/10 px-6 py-2.5 rounded-full backdrop-blur-md z-50">
              {currentIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>
    </div>
  );

  return (
    <>
      {mainView}

      {/* Thumbnails Row */}
      {images.length > 1 && (
        <div className="mt-3 flex items-center gap-3 overflow-x-auto pb-2 custom-scrollbar">
          {images.map((img, idx) => (
            <button
              key={idx}
              className={`relative h-20 w-24 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${idx === currentIndex ? 'border-cyan-400 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
            >
              <Image src={img} alt={`Thumb ${idx + 1}`} fill className="object-cover" sizes="100px" />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Overlay */}
      {isFullscreen && mounted && createPortal(fullscreenOverlay, document.body)}
    </>
  );
}
