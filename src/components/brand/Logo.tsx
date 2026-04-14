
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
        width={iconOnly ? 48 : 180} 
        height={48} 
        className={cn("h-10 w-auto object-contain", iconOnly && "h-12 w-12")}
        priority
      />
    </div>
  );
}
