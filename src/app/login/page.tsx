
"use client"

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser, usePB } from '@/pocketbase';
import { useRouter } from 'next/navigation';
import { Loader2, ShieldCheck, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const { user, isUserLoading } = useUser();
  const pb = usePB();
  const router = useRouter();
  const [isLoggingIn, setIsLoggingIn] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    if (user) {
      const isAdmin = user.email === 'maro.webdeveloper@gmail.com';
      router.push(isAdmin ? '/admin' : '/');
    }
  }, [user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pb) return;
    setIsLoggingIn(true);
    setError('');
    try {
      await pb.collection('users').authWithPassword(email, password);
      router.push('/admin');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err?.message || 'Neispravan email ili lozinka.');
      setIsLoggingIn(false);
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
          </div>

          <Card className="rounded-[2.5rem] shadow-2xl border-none overflow-hidden bg-white/80 backdrop-blur-xl">
            <CardHeader className="bg-primary text-white p-10 text-center">
              <ShieldCheck className="size-12 mx-auto mb-4" />
              <CardTitle className="text-3xl font-black italic">Administracija</CardTitle>
            </CardHeader>
            <CardContent className="p-10 space-y-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-12 h-14 rounded-2xl text-base"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Lozinka"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-12 pr-12 h-14 rounded-2xl text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                  </button>
                </div>

                {error && (
                  <p className="text-destructive text-sm text-center">{error}</p>
                )}

                <Button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full h-16 rounded-[1.5rem] font-black text-lg shadow-xl transition-all"
                >
                  {isLoggingIn ? (
                    <Loader2 className="size-6 animate-spin" />
                  ) : (
                    'PRIJAVI SE'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
