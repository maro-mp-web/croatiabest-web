
"use client"

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { CATEGORIES } from '@/app/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Info, CheckCircle2 } from 'lucide-react';

export default function SubmitListingPage() {
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    address: '',
    description: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const selectedCategory = CATEGORIES.find(c => c.id === formData.categoryId);
  const isPaid = selectedCategory?.type === 'paid';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulacija slanja u bazu podataka
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      toast({
        title: "Prijava poslana!",
        description: isPaid 
          ? "Vaša prijava je zaprimljena. Očekujte upute za plaćanje na email prije odobrenja." 
          : "Vaša prijava je poslana na pregled administratoru.",
      });
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-24 flex flex-col items-center justify-center text-center">
          <div className="size-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="size-12" />
          </div>
          <h1 className="text-4xl font-headline font-bold mb-4">Uspješno poslano!</h1>
          <p className="text-muted-foreground text-lg max-w-md mb-8">
            Hvala vam na prijavi objekta <strong>{formData.name}</strong>. Vaš zahtjev je poslan Superadminu na provjeru.
          </p>
          <Button onClick={() => window.location.href = '/'}>Povratak na naslovnicu</Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-headline font-bold mb-4">Prijavite svoj objekt</h1>
          <p className="text-muted-foreground text-lg italic">Postanite dio najveće baze najboljeg u Hrvatskoj.</p>
        </div>

        <Card className="border-none shadow-2xl overflow-hidden rounded-[2rem]">
          <div className="bg-primary h-2 w-full" />
          <CardHeader className="pt-8 px-8">
            <CardTitle className="text-2xl">Podaci o objektu</CardTitle>
            <CardDescription>Sve prijave pregledava Superadmin prije službene objave.</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Naziv objekta</Label>
                  <Input 
                    id="name" 
                    required 
                    placeholder="npr. Restoran Riva"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="h-12 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Kategorija</Label>
                  <Select onValueChange={v => setFormData({...formData, categoryId: v})} required>
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue placeholder="Odaberi kategoriju" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name} {cat.price ? `(${cat.price})` : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Adresa (Ulica, Grad)</Label>
                <Input 
                  id="address" 
                  required 
                  placeholder="npr. Ilica 1, Zagreb"
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  className="h-12 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Opis objekta / Usluge</Label>
                <Textarea 
                  id="description" 
                  className="min-h-[120px] rounded-xl" 
                  placeholder="Opišite što nudite..."
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-dashed">
                <div className="space-y-2">
                  <Label htmlFor="email">Kontakt Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    required 
                    placeholder="vas@email.com"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="h-12 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Kontakt Telefon</Label>
                  <Input 
                    id="phone" 
                    required 
                    placeholder="+385..."
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="h-12 rounded-xl"
                  />
                </div>
              </div>

              {isPaid && (
                <div className="p-5 bg-primary/5 border border-primary/20 rounded-[1.5rem] flex gap-4">
                  <div className="size-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <Info className="size-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-primary">Plaćena kategorija: {selectedCategory?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Nakon što Superadmin provjeri prijavu, dobit ćete podatke za uplatu iznosa od <strong>{selectedCategory?.price}</strong> na vaš email. Objekt će biti objavljen čim uplata bude vidljiva.
                    </p>
                  </div>
                </div>
              )}

              <Button type="submit" disabled={isSubmitting} className="w-full h-14 text-xl font-black rounded-2xl bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all">
                {isSubmitting ? "Slanje u bazu..." : "Pošalji Superadminu na provjeru"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
