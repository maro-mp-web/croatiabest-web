"use client"

import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';

// Google AdSense preklopnik:
// Za potrebe prijave na Google AdSense, demo i placeholder oglasi su isključeni
// kako Google tim ne bi odbio stranicu zbog "placeholder/demo" sadržaja.
// Kada Google odobri račun, dovoljno je u .env postaviti:
// NEXT_PUBLIC_ENABLE_ADSENSE=true
// NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX
const IS_ADSENSE_ENABLED = process.env.NEXT_PUBLIC_ENABLE_ADSENSE === 'true';
const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || '';

interface AdBannerProps {
  format?: 'horizontal' | 'rectangle' | 'vertical';
  className?: string;
  slotId?: string;
  positionId?: string;
}

export default function AdBanner({ 
  format = 'horizontal', 
  className,
  slotId,
  positionId 
}: AdBannerProps) {
  useEffect(() => {
    if (IS_ADSENSE_ENABLED && typeof window !== 'undefined') {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        // Ignoriramo ako korisnik ima uključen AdBlocker
      }
    }
  }, []);

  // DOK ADSENSE NIJE ODOBREN I UKLJUČEN:
  // Vraćamo null kako Google AdSense crawler i recenzenti ne bi vidjeli prazne demo okvire.
  // Sve pozicije u kodu ostaju točno gdje jesu.
  if (!IS_ADSENSE_ENABLED) {
    return null;
  }

  const formatStyles = {
    horizontal: 'w-full min-h-[90px] md:min-h-[250px]',
    rectangle: 'w-[300px] min-h-[250px] mx-auto',
    vertical: 'w-[300px] min-h-[600px] mx-auto'
  };

  return (
    <div 
      className={cn(
        "ad-slot-container relative flex items-center justify-center overflow-hidden",
        formatStyles[format],
        className
      )}
      data-ad-position={positionId || format}
    >
      <ins 
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={slotId || ''}
        data-ad-format={format === 'horizontal' ? 'horizontal' : format === 'vertical' ? 'vertical' : 'rectangle'}
        data-full-width-responsive="true"
      />
    </div>
  );
}
