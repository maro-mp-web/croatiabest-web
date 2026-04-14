
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
import { Info } from 'lucide-react';

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

  const selectedCategory = CATEGORIES.find(c => c.id === formData.categoryId);
  const isPaid = selectedCategory?.type === 'paid';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Ovdje bi išla Firestore logika za spremanje u /listings kolekciju sa statusom 'pending'
    setTimeout(() => {
      toast({
        title: "Prijava poslana!",
        description: isPaid 
          ? "Vaša prijava je zaprimljena. Očekujte upute za plaćanje na email prije odobrenja." 
          : "Vaša prijava je poslana na pregled administratoru.",
      });
      setIsSubmitting(false);
      setFormData({ name: '', categoryId: '', address: '', description: '', email: '', phone: '' });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-headline font-bold mb-4">Prijavite svoj objekt</h1>
          <p className="text-muted-foreground">Postanite dio najveće baze najboljeg u Hrvatskoj.</p>
        </div>

        <Card className="border-none shadow-2xl">
          <CardHeader>
            <CardTitle>Podaci o objektu</CardTitle>
            <CardDescription>Sve prijave pregledava Superadmin prije objave.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Naziv objekta</Label>
                  <Input 
                    id="name" 
                    required 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Kategorija</Label>
                  <Select onValueChange={v => setFormData({...formData, categoryId: v})} required>
                    <SelectTrigger>
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
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Opis objekta / Usluge</Label>
                <Textarea 
                  id="description" 
                  className="min-h-[120px]" 
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                <div className="space-y-2">
                  <Label htmlFor="email">Kontakt Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    required 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Kontakt Telefon</Label>
                  <Input 
                    id="phone" 
                    required 
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>

              {isPaid && (
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl flex gap-3">
                  <Info className="size-5 text-primary shrink-0" />
                  <p className="text-sm">
                    Odabrali ste plaćenu kategoriju <strong>{selectedCategory?.name}</strong>. 
                    Nakon što Superadmin provjeri prijavu, dobit ćete podatke za uplatu <strong>{selectedCategory?.price}</strong> na email.
                  </p>
                </div>
              )}

              <Button type="submit" disabled={isSubmitting} className="w-full h-12 text-lg font-bold">
                {isSubmitting ? "Slanje..." : "Pošalji prijavu Superadminu"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
