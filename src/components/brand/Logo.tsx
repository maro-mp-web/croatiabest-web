
"use client"

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
}

export function Logo({ className, iconOnly = false }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Image 
        src="/logo.png" 
        alt="CroatiaBest Logo" 
        width={iconOnly ? 80 : 240} 
        height={80} 
        className={cn("h-12 w-auto object-contain", iconOnly && "h-16 w-16")}
        priority
      />
    </div>
  );
}
