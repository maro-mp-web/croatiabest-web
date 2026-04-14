import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
}

export function Logo({ className, iconOnly = false }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2 select-none", className)}>
      <div className={cn("relative flex items-center justify-center", iconOnly ? "size-12" : "h-16 w-auto")}>
        <svg 
          viewBox="0 0 320 200" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-full w-auto drop-shadow-sm"
        >
          {/* Stylized Red Heart Stroke */}
          <path 
            d="M20 80C20 40 80 20 160 80C240 20 300 40 300 80C300 130 160 190 160 190C160 190 20 130 20 80Z" 
            stroke="hsl(var(--primary))" 
            strokeWidth="12" 
            strokeLinecap="round"
            className="opacity-90"
          />
          
          {!iconOnly && (
            <>
              {/* CROATIA Text */}
              <text 
                x="160" 
                y="95" 
                textAnchor="middle" 
                fill="hsl(var(--primary))" 
                className="font-headline text-[42px] font-black tracking-tight"
                style={{ fontFamily: 'serif' }}
              >
                CROATIA
              </text>
              
              {/* BEST Text */}
              <text 
                x="185" 
                y="155" 
                textAnchor="middle" 
                fill="hsl(var(--secondary))" 
                className="font-headline text-[72px] font-black tracking-tighter"
                style={{ fontFamily: 'serif' }}
              >
                BEST
              </text>
            </>
          )}
        </svg>
      </div>
    </div>
  );
}
