"use client"

import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Loader2, PartyPopper, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    // Give the webhook a moment to process
    const timer = setTimeout(() => setIsVerifying(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <Loader2 className="size-16 animate-spin text-primary mb-8" />
          <h1 className="text-4xl font-black tracking-tighter mb-4">Potvrđujemo vašu uplatu...</h1>
          <p className="text-muted-foreground text-lg font-body italic">Molimo pričekajte trenutak.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="relative mb-12">
          <div className="size-40 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center shadow-2xl shadow-primary/20 animate-pulse">
            <CheckCircle2 className="size-20 text-primary" />
          </div>
          <PartyPopper className="absolute -top-4 -right-4 size-12 text-secondary animate-bounce" />
        </div>

        <Badge className="bg-primary/10 text-primary border-none text-xs font-black tracking-widest uppercase px-6 py-2 mb-6">
          Plaćanje uspješno
        </Badge>

        <h1 className="text-6xl md:text-7xl font-black tracking-tighter mb-6 font-headline">
          Hvala na <span className="text-primary italic">povjerenju!</span>
        </h1>

        <p className="text-xl text-muted-foreground max-w-xl mb-4 font-body italic leading-relaxed">
          Vaša uplata je uspješno obrađena i vaš objekt je zaprimljen u naš sustav.
          Naš tim će ga pregledati u najkraćem roku.
        </p>

        <p className="text-sm text-muted-foreground/60 mb-12">
          Potvrda plaćanja bit će poslana na vašu email adresu.
          {sessionId && <span className="block mt-1 text-[10px] font-mono opacity-50">Referenca: {sessionId.slice(0, 24)}...</span>}
        </p>

        <div className="flex gap-4 flex-wrap justify-center">
          <Link href="/dashboard">
            <Button className="h-16 px-10 rounded-2xl font-black bg-primary shadow-xl shadow-primary/20 text-lg group">
              MOJ DASHBOARD <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="h-16 px-10 rounded-2xl font-black text-lg">
              POČETNA STRANICA
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}

export default function SubmitSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="size-12 animate-spin text-primary" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
