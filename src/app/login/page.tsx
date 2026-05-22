
"use client"

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { initiateGoogleSignIn } from '@/firebase';
import { useUser, useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Loader2, ShieldCheck, Chrome } from 'lucide-react';

export default function LoginPage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (user) {
      const isAdmin = user.email === 'maro.webdeveloper@gmail.com';
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
              <CardTitle className="text-3xl font-black italic">Portal</CardTitle>
            </CardHeader>
            <CardContent className="p-10 space-y-6">
              <Button 
                onClick={handleGoogleLogin}
                className="w-full h-16 rounded-[1.5rem] font-black text-lg bg-white text-black border-2 border-black/5 hover:bg-black/5 shadow-xl transition-all flex items-center justify-center gap-3"
              >
                <Chrome className="size-6 text-primary" />
                PRIJAVI SE PUTEM GOOGLE-A
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
