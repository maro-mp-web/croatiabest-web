
"use client"

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { initiateEmailSignIn, initiateEmailSignUp } from '@/firebase';
import { useUser, useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Loader2, ShieldCheck, Mail, Lock, ArrowRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function LoginPage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if (user) {
      router.push('/admin');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    
    setIsLoading(true);
    try {
      if (isSignUp) {
        initiateEmailSignUp(auth, email, password);
        toast({ title: "Račun kreiran", description: "Dobrodošli na portal!" });
      } else {
        initiateEmailSignIn(auth, email, password);
        toast({ title: "Prijava uspješna", description: "Preusmjeravanje..." });
      }
    } catch (error: any) {
      toast({ 
        title: "Greška", 
        description: "Provjerite podatke i pokušajte ponovno.", 
        variant: "destructive" 
      });
    } finally {
      setTimeout(() => setIsLoading(false), 2000);
    }
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
            <p className="text-muted-foreground font-body italic text-lg">Pristupite svom partnerskom računu.</p>
          </div>

          <Card className="rounded-[2.5rem] shadow-2xl border-none overflow-hidden bg-white/80 backdrop-blur-xl">
            <CardHeader className="bg-primary text-white p-10 text-center">
              <ShieldCheck className="size-12 mx-auto mb-4" />
              <CardTitle className="text-3xl font-black italic">Partner Portal</CardTitle>
              <CardDescription className="text-white/70">Za administraciju i vlasnike objekata</CardDescription>
            </CardHeader>
            <CardContent className="p-10 space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground">Email adresa</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input 
                      type="email" 
                      placeholder="npr. admin@croatiabest.hr" 
                      className="pl-12 h-14 rounded-2xl border-none bg-secondary/10 focus-visible:ring-primary"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground">Lozinka</Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      className="pl-12 h-14 rounded-2xl border-none bg-secondary/10 focus-visible:ring-primary"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <Button type="submit" disabled={isLoading} className="w-full h-16 rounded-[1.5rem] font-black text-lg bg-primary shadow-xl shadow-primary/20 group">
                  {isLoading ? (
                    <Loader2 className="size-6 animate-spin" />
                  ) : (
                    <>
                      {isSignUp ? 'KREIRAJ RAČUN' : 'PRIJAVI SE'}
                      <ArrowRight className="ml-2 size-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </form>

              <div className="text-center">
                <Button variant="link" onClick={() => setIsSignUp(!isSignUp)} className="text-muted-foreground text-xs uppercase font-black hover:text-primary transition-colors">
                  {isSignUp ? 'Već imate račun? Prijavite se' : 'Nemate račun? Registrirajte se ovdje'}
                </Button>
              </div>

              <div className="p-6 bg-secondary/5 rounded-2xl border border-black/5">
                <p className="text-[10px] font-black uppercase text-muted-foreground mb-2 tracking-widest">Savjet za Superadmina</p>
                <p className="text-[10px] italic text-muted-foreground/60 leading-relaxed">
                  Za pristup upravljačkoj ploči koristite email koji sadrži riječ <strong className="text-primary">"admin"</strong> ili se prijavite kao <strong className="text-primary">vlasnik@croatiabest.hr</strong>.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
