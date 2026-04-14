import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
}

export function Logo({ className, iconOnly = false }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2 group", className)}>
      <div className="relative flex items-center">
        {/* Prikazujemo sliku, ali dodajemo i tekstualni fallback u slučaju da slika nedostaje u public folderu */}
        <Image 
          src="/logo.png" 
          alt="CroatiaBest Logo" 
          width={iconOnly ? 48 : 160} 
          height={48} 
          className={cn("h-10 w-auto object-contain relative z-10", iconOnly && "h-12 w-12")}
          priority
          onError={(e) => {
            // Ako slika ne postoji, možemo sakriti element ili logirati
            e.currentTarget.style.display = 'none';
          }}
        />
        
        {!iconOnly && (
          <div className="flex flex-col ml-1 leading-none select-none">
            <span className="text-xl font-black tracking-tighter text-[#FF3131]">CROATIA</span>
            <span className="text-xs font-bold tracking-[0.3em] text-[#3090FF] -mt-1 uppercase">Best</span>
          </div>
        )}
      </div>
    </div>
  );
}
