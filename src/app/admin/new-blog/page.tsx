"use client"

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Save, ArrowLeft, Loader2, BookOpen } from 'lucide-react';
import { useUser, usePB } from '@/pocketbase';
import { useRouter } from 'next/navigation';

export default function AdminNewBlogPage() {
  const { user, isUserLoading } = useUser();
  const pb = usePB();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');
  const [author, setAuthor] = useState('CroatiaBest');
  const [readTime, setReadTime] = useState('5 min');
  const [isSaving, setIsSaving] = useState(false);

  const isAdmin = user?.email === 'maro.webdeveloper@gmail.com';

  const generateSlug = (text: string) => {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (!slug) {
      setSlug(generateSlug(e.target.value));
    }
  };

  const handleSave = async () => {
    if (!pb) return;
    if (!title || !slug || !content) {
      toast({ title: "Nedostaju podaci", description: "Naslov, slug i sadržaj su obavezni.", variant: "destructive" });
      return;
    }

    setIsSaving(true);
    try {
      await pb.collection('blogs').create({
        title,
        slug,
        category,
        image,
        excerpt,
        content,
        seoKeywords,
        author,
        readTime
      });

      toast({ title: "Uspješno", description: "Blog članak je spremljen." });
      router.push('/admin');
    } catch (error: any) {
      console.error('Error saving blog:', error);
      toast({ title: "Greška", description: error?.message || "Došlo je do greške prilikom spremanja.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  if (isUserLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin size-8 text-primary" /></div>;

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <h1 className="text-4xl font-black italic mb-4">Pristup Odbijen</h1>
            <Button onClick={() => router.push('/')}>Povratak na Naslovnicu</Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col pb-24">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 max-w-5xl mt-12">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => router.push('/admin')} className="rounded-full size-12">
            <ArrowLeft className="size-6" />
          </Button>
          <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter">Novi Članak (Magazin)</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="rounded-[2.5rem] shadow-xl border-none">
              <CardHeader className="bg-primary/5 rounded-t-[2.5rem] border-b border-black/5 pb-8 pt-10 px-10">
                <div className="flex items-center gap-4">
                  <BookOpen className="size-8 text-primary" />
                  <CardTitle className="text-2xl font-black italic">Osnovni Podaci</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-10 space-y-6">
                <div className="space-y-3">
                  <Label className="text-sm font-black uppercase tracking-widest text-muted-foreground">Naslov članka *</Label>
                  <Input value={title} onChange={handleTitleChange} placeholder="Npr. 10 Najboljih Plaža..." className="h-14 rounded-2xl bg-secondary/5 border-none" />
                </div>
                <div className="space-y-3">
                  <Label className="text-sm font-black uppercase tracking-widest text-muted-foreground">Sadržaj (HTML/Text) *</Label>
                  <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="<p>Tekst članka...</p>" className="min-h-[400px] rounded-2xl bg-secondary/5 border-none font-mono text-sm" />
                </div>
                <div className="space-y-3">
                  <Label className="text-sm font-black uppercase tracking-widest text-muted-foreground">Sažetak (Excerpt)</Label>
                  <Textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Kratki opis članka za karticu..." className="min-h-[100px] rounded-2xl bg-secondary/5 border-none" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="rounded-[2.5rem] shadow-xl border-none">
              <CardContent className="p-8 space-y-6">
                <div className="space-y-3">
                  <Label className="text-sm font-black uppercase tracking-widest text-muted-foreground">Kategorija</Label>
                  <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Npr. Ljeto 2026" className="h-12 rounded-xl bg-secondary/5 border-none" />
                </div>
                <div className="space-y-3">
                  <Label className="text-sm font-black uppercase tracking-widest text-muted-foreground">URL Slike (Hero)</Label>
                  <Input value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://..." className="h-12 rounded-xl bg-secondary/5 border-none" />
                </div>
                <div className="space-y-3">
                  <Label className="text-sm font-black uppercase tracking-widest text-muted-foreground">Autor</Label>
                  <Input value={author} onChange={(e) => setAuthor(e.target.value)} className="h-12 rounded-xl bg-secondary/5 border-none" />
                </div>
                <div className="space-y-3">
                  <Label className="text-sm font-black uppercase tracking-widest text-muted-foreground">Vrijeme čitanja</Label>
                  <Input value={readTime} onChange={(e) => setReadTime(e.target.value)} className="h-12 rounded-xl bg-secondary/5 border-none" />
                </div>
                <div className="space-y-3">
                  <Label className="text-sm font-black uppercase tracking-widest text-muted-foreground">SEO Ključne Riječi</Label>
                  <Input value={seoKeywords} onChange={(e) => setSeoKeywords(e.target.value)} placeholder="ljeto, plaže, odmor..." className="h-12 rounded-xl bg-secondary/5 border-none" />
                </div>
                <div className="space-y-3">
                  <Label className="text-sm font-black uppercase tracking-widest text-muted-foreground">Slug (URL) *</Label>
                  <Input value={slug} onChange={(e) => setSlug(e.target.value)} className="h-12 rounded-xl bg-secondary/5 border-none" />
                </div>
              </CardContent>
            </Card>

            <Button onClick={handleSave} disabled={isSaving} className="w-full h-16 rounded-[1.5rem] font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform">
              {isSaving ? <Loader2 className="animate-spin size-6" /> : <><Save className="size-6 mr-3" /> OBJAVI ČLANAK</>}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
