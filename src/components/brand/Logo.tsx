import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
}

export function Logo({ className, iconOnly = false }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2 select-none", className)}>
      <svg 
        viewBox="0 0 400 120" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        className={cn("h-12 w-auto", iconOnly ? "w-12" : "w-auto")}
      >
        {/* Heart Symbol */}
        <path 
          d="M60 40C60 25 85 20 100 35C115 20 140 25 140 40C140 65 100 90 100 90C100 90 60 65 60 40Z" 
          fill="hsl(var(--primary))" 
        />
        
        {!iconOnly && (
          <>
            {/* CROATIA Text */}
            <text 
              x="155" 
              y="50" 
              fill="hsl(var(--primary))" 
              className="font-headline"
              style={{ fontSize: '38px', fontWeight: '900', letterSpacing: '-0.02em' }}
            >
              CROATIA
            </text>
            
            {/* BEST Text */}
            <text 
              x="155" 
              y="95" 
              fill="hsl(var(--secondary))" 
              className="font-headline"
              style={{ fontSize: '56px', fontWeight: '900', letterSpacing: '-0.05em' }}
            >
              BEST
            </text>
          </>
        )}
      </svg>
    </div>
  );
}
