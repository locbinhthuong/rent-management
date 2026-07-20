'use client';

import { useState, useEffect } from 'react';
import LocusLogo from './LocusLogo';

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Only show once per session
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');
    
    if (hasSeenSplash) {
      setIsVisible(false);
      return;
    }

    sessionStorage.setItem('hasSeenSplash', 'true');

    // Start fade out after 1.2 seconds
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 1200);

    // Completely remove from DOM after fade out completes (1.2s + 0.5s)
    const removeTimer = setTimeout(() => {
      setIsVisible(false);
    }, 1700);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center transition-opacity duration-500 ease-in-out ${isFading ? 'opacity-0' : 'opacity-100'}`}
    >
      <div className="animate-pulse">
        <LocusLogo width="250px" height="250px" />
      </div>
    </div>
  );
}
