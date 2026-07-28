import Link from 'next/link';
import { Home, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md w-full text-center space-y-8 bg-white p-12 rounded-[3rem] shadow-xl border border-black/5">
        <div className="space-y-4">
          <div className="flex justify-center mb-6">
            <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <Compass className="size-12" />
            </div>
          </div>
          <h1 className="text-6xl font-headline font-black text-primary">404</h1>
          <h2 className="text-2xl font-bold">Stranica nije pronađena</h2>
          <p className="text-muted-foreground font-body">
            Izgleda da ste skrenuli s puta. Stranica koju tražite ne postoji ili je premještena.
          </p>
        </div>
        
        <div className="pt-6">
          <Button asChild className="rounded-full w-full font-bold h-12 shadow-md hover:shadow-lg transition-all text-base gap-2">
            <Link href="/">
              <Home className="size-5" />
              Povratak na naslovnicu
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
