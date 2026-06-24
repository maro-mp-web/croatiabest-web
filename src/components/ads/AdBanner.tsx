"use client"

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface AdBannerProps {
  format?: 'horizontal' | 'rectangle' | 'vertical';
  className?: string;
}

export default function AdBanner({ format = 'horizontal', className }: AdBannerProps) {
  // Ovo je placeholder. Kada dobijemo Google AdSense kod, 
  // zamijenit ćemo ovo sa pravom <ins> oznakom ili Googleovim skriptama.

  const formatStyles = {
    horizontal: 'w-full h-[90px] md:h-[250px]',
    rectangle: 'w-[300px] h-[250px] mx-auto',
    vertical: 'w-[300px] h-[600px] mx-auto'
  };

  return (
    <div className={cn(
      "relative bg-secondary/10 border-2 border-dashed border-secondary/20 rounded-2xl flex flex-col items-center justify-center overflow-hidden",
      formatStyles[format],
      className
    )}>
      <Badge variant="secondary" className="absolute top-2 left-2 text-[8px] uppercase tracking-widest opacity-50">
        Oglas
      </Badge>
      <span className="text-secondary/40 font-black tracking-widest uppercase text-xl md:text-3xl rotate-[-5deg]">
        Google Ads
      </span>
      <span className="text-secondary/40 text-xs font-bold mt-2">
        Prostor rezerviran za oglas
      </span>
    </div>
  );
}
