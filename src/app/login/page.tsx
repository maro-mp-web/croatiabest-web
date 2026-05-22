"use client"

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { initiateGoogleSignIn } from '@/firebase';
import { useUser, useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Loader2, ShieldCheck, Chrome } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function LoginPage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (user) {
      // Ako je admin, idi u admin, inače na početnu/dashboard
      const isAdmin = user.email === 'vlasnik@croatiabest.hr' || user.email?.includes('admin');
      router.push(isAdmin ? '/admin' : '/dashboard');
    }
  }, [user, router]);

  const handleGoogleLogin = () => {
    if (!auth) return;
    initiateGoogleSignIn(auth);
  };

  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="size-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4 py-20">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-5xl font-black italic tracking-tighter">Prijava</h1>
            <p className="text-muted-foreground font-body italic text-lg">Pristupite portalu CroatiaBest.</p>
          </div>

          <Card className="rounded-[2.5rem] shadow-2xl border-none overflow-hidden bg-white/80 backdrop-blur-xl">
            <CardHeader className="bg-primary text-white p-10 text-center">
              <ShieldCheck className="size-12 mx-auto mb-4" />
              <CardTitle className="text-3xl font-black italic">Partner Portal</CardTitle>
              <CardDescription className="text-white/70">Sigurna prijava putem vašeg Google računa</CardDescription>
            </CardHeader>
            <CardContent className="p-10 space-y-6">
              <Button 
                onClick={handleGoogleLogin}
                className="w-full h-16 rounded-[1.5rem] font-black text-lg bg-white text-black border-2 border-black/5 hover:bg-black/5 shadow-xl transition-all flex items-center justify-center gap-3"
              >
                <Chrome className="size-6 text-primary" />
                PRIJAVI SE PUTEM GOOGLE-A
              </Button>

              <div className="p-6 bg-secondary/5 rounded-2xl border border-black/5">
                <p className="text-[10px] font-black uppercase text-muted-foreground mb-2 tracking-widest">Napomena za vlasnika</p>
                <p className="text-[10px] italic text-muted-foreground/60 leading-relaxed">
                  Administraciji možete pristupiti isključivo koristeći svoj autorizirani Google račun povezan s adresom <strong className="text-primary">vlasnik@croatiabest.hr</strong>.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
