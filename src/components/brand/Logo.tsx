import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
}

export function Logo({ className, iconOnly = false }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2 select-none", className)}>
      <div className="relative size-8 flex items-center justify-center">
        {/* Stylized Logo Icon: A combination of a location pin and a star */}
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className="size-full drop-shadow-sm"
        >
          <path 
            d="M12 21.5C12 21.5 4 15.5 4 9.5C4 5.08172 7.58172 1.5 12 1.5C16.4183 1.5 20 5.08172 20 9.5C20 15.5 12 21.5 12 21.5Z" 
            fill="hsl(var(--primary))" 
          />
          <path 
            d="M12 13L13.1756 10.6166L15.8038 10.2346L13.9019 8.38042L14.3511 5.76537L12 7L9.64886 5.76537L10.0981 8.38042L8.19615 10.2346L10.8244 10.6166L12 13Z" 
            fill="white" 
          />
          <circle cx="12" cy="9.5" r="5" stroke="white" strokeWidth="0.5" strokeDasharray="1 1" opacity="0.5" />
        </svg>
      </div>
      
      {!iconOnly && (
        <span className="font-headline text-2xl font-black tracking-tighter flex items-baseline">
          <span className="text-primary">Croatia</span>
          <span className="text-secondary">Best</span>
        </span>
      )}
    </div>
  );
}
