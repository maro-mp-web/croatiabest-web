
"use client"

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Image 
        src="/criatia-best.png" 
        alt="CroatiaBest Logo" 
        width={240} 
        height={80} 
        className="h-12 w-auto object-contain"
        priority
      />
    </div>
  );
}
