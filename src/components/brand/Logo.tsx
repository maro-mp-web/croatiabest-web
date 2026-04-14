
"use client"

import React, { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
}

export function Logo({ className, iconOnly = false }: LogoProps) {
  const [error, setError] = useState(false);

  // Ako PNG ne radi, prikazujemo preciznu SVG repliku logotipa
  if (error) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <svg viewBox="0 0 400 240" className={cn("h-12 w-auto", iconOnly && "h-16")} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Stilzirano srce iz logotipa */}
          <path d="M200 220C200 220 380 150 380 75C380 -10 290 -20 230 40L200 75L170 40C110 -20 20 -10 20 75C20 150 200 220 200 220Z" stroke="#FF3131" strokeWidth="12" strokeLinecap="round" />
          {!iconOnly && (
            <>
              <text x="75" y="105" fill="#FF3131" fontFamily="Belleza, sans-serif" fontWeight="900" fontSize="58" letterSpacing="2">CROATIA</text>
              <text x="185" y="180" fill="#3090FF" fontFamily="Belleza, sans-serif" fontWeight="900" fontSize="82" letterSpacing="1">BEST</text>
            </>
          )}
        </svg>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Image 
        src="/logo.png" 
        alt="CroatiaBest Logo" 
        width={iconOnly ? 80 : 240} 
        height={80} 
        className={cn("h-12 w-auto object-contain", iconOnly && "h-16 w-16")}
        priority
        onError={() => setError(true)}
      />
    </div>
  );
}
