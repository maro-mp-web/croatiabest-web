"use client"

import React, { useState, useEffect, Suspense } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUpload } from '@/components/ui/image-upload';
import { RichTextEditor } from '@/components/ui/RichTextEditor';
import { toast } from '@/hooks/use-toast';
import { Save, ArrowLeft, Loader2, BookOpen, Globe, Flag, ImageIcon } from 'lucide-react';
import { useUser, usePB } from '@/pocketbase';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AdminNewBlogPageWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin size-8 text-primary" /></div>}>
      <AdminNewBlogPage />
    </Suspense>
  );
}

function AdminNewBlogPage() {
  const { user, isUserLoading } = useUser();
  const pb = usePB();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');

  // Croatian fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');

  // English fields
  const [titleEn, setTitleEn] = useState('');
  const [excerptEn, setExcerptEn] = useState('');
  const [contentEn, setContentEn] = useState('');
  const [seoKeywordsEn, setSeoKeywordsEn] = useState('');
  const [seoTitleEn, setSeoTitleEn] = useState('');
  const [seoDescriptionEn, setSeoDescriptionEn] = useState('');

  // Common fields
  const [author, setAuthor] = useState('CroatiaBest');
  const [readTime, setReadTime] = useState('5 min');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingBlog, setIsLoadingBlog] = useState(false);

  // Language tab
  const [langTab, setLangTab] = useState<'hr' | 'en'>('hr');

  const isAdmin = user?.email === 'maro.webdeveloper@gmail.com';

  const generateSlug = (text: string) => {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (!slug || slug === generateSlug(title)) {
      setSlug(generateSlug(e.target.value));
    }
  };

  // Load existing blog for editing
  useEffect(() => {
    if (editId && pb) {
      setIsLoadingBlog(true);
      pb.collection('blogs').getOne(editId, { requestKey: null })
        .then((blog: any) => {
          setTitle(blog.title || '');
          setSlug(blog.slug || '');
          setCategory(blog.category || '');
          setImage(blog.image || '');
          setExcerpt(blog.excerpt || '');
          setContent(blog.content || '');
          setSeoKeywords(blog.seoKeywords || '');
          setSeoTitle(blog.seoTitle || '');
          setSeoDescription(blog.seoDescription || '');
          setTitleEn(blog.titleEn || '');
          setExcerptEn(blog.excerptEn || '');
          setContentEn(blog.contentEn || '');
          setSeoKeywordsEn(blog.seoKeywordsEn || '');
          setSeoTitleEn(blog.seoTitleEn || '');
          setSeoDescriptionEn(blog.seoDescriptionEn || '');
          setAuthor(blog.author || 'CroatiaBest');
          setReadTime(blog.readTime || '5 min');
        })
        .catch((err: any) => {
          console.error('Error loading blog:', err);
          toast({ title: "Greška", description: "Članak nije pronađen.", variant: "destructive" });
        })
        .finally(() => setIsLoadingBlog(false));
    }
  }, [editId, pb]);

  const handleSave = async () => {
    if (!pb) return;
    if (!title || !slug || !content) {
      toast({ title: "Nedostaju podaci", description: "Naslov, slug i sadržaj su obavezni.", variant: "destructive" });
      return;
    }

    setIsSaving(true);
    try {
      const blogData = {
        title,
        titleEn,
        slug,
        category,
        image,
        excerpt,
        excerptEn,
        content,
        contentEn,
        seoKeywords,
        seoKeywordsEn,
        seoTitle,
        seoTitleEn,
        seoDescription,
        seoDescriptionEn,
        author,
        readTime,
      };

      if (editId) {
        await pb.collection('blogs').update(editId, blogData);
        toast({ title: "Uspješno", description: "Članak je ažuriran." });
      } else {
        await pb.collection('blogs').create(blogData);
        toast({ title: "Uspješno", description: "Blog članak je spremljen." });
      }
      router.push('/admin');
    } catch (error: any) {
      console.error('Error saving blog:', error);
      // Extract detailed PocketBase validation errors
      let errorMsg = error?.message || "Došlo je do greške prilikom spremanja.";
      if (error?.response?.data) {
        const fieldErrors = Object.entries(error.response.data)
          .map(([field, err]: [string, any]) => `${field}: ${err?.message || JSON.stringify(err)}`)
          .join(', ');
        if (fieldErrors) {
          errorMsg = `${errorMsg} — ${fieldErrors}`;
        }
      }
      toast({ title: "Greška", description: errorMsg, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  if (isUserLoading || isLoadingBlog) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin size-8 text-primary" /></div>;

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
      
      <main className="flex-1 container mx-auto px-4 max-w-6xl mt-12">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => router.push('/admin')} className="rounded-full size-12">
            <ArrowLeft className="size-6" />
          </Button>
          <div>
            <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter">
              {editId ? 'Uredi Članak' : 'Novi Članak'} (Magazin)
            </h1>
            {editId && <p className="text-sm text-muted-foreground mt-1">Uređivanje ID: {editId}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Basic Info */}
            <Card className="rounded-[2.5rem] shadow-xl border-none">
              <CardHeader className="bg-primary/5 rounded-t-[2.5rem] border-b border-black/5 pb-8 pt-10 px-10">
                <div className="flex items-center gap-4">
                  <BookOpen className="size-8 text-primary" />
                  <CardTitle className="text-2xl font-black italic">Osnovni Podaci</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-10 space-y-6">
                <div className="space-y-3">
                  <Label className="text-sm font-black uppercase tracking-widest text-muted-foreground">Naslov članka (HR) *</Label>
                  <Input value={title} onChange={handleTitleChange} placeholder="Npr. 10 Najboljih Plaža..." className="h-14 rounded-2xl bg-secondary/5 border-none" />
                </div>

                {/* Language Tabs */}
                <div className="space-y-4">
                  <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl w-fit">
                    <button
                      type="button"
                      onClick={() => setLangTab('hr')}
                      className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${
                        langTab === 'hr'
                          ? 'bg-white text-primary shadow-md'
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      <Flag className="size-4" /> Hrvatski
                    </button>
                    <button
                      type="button"
                      onClick={() => setLangTab('en')}
                      className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${
                        langTab === 'en'
                          ? 'bg-white text-blue-600 shadow-md'
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      <Globe className="size-4" /> English
                    </button>
                  </div>

                  {/* HR Content */}
                  {langTab === 'hr' && (
                    <div className="space-y-6 animate-fade-in">
                      <div className="space-y-3">
                        <Label className="text-sm font-black uppercase tracking-widest text-muted-foreground">Sadržaj (WYSIWYG) *</Label>
                        <RichTextEditor 
                          value={content} 
                          onChange={setContent} 
                          placeholder="Počnite pisati članak na hrvatskom..." 
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-sm font-black uppercase tracking-widest text-muted-foreground">Sažetak (Excerpt)</Label>
                        <Textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Kratki opis članka za karticu..." className="min-h-[100px] rounded-2xl bg-secondary/5 border-none" />
                      </div>
                    </div>
                  )}

                  {/* EN Content */}
                  {langTab === 'en' && (
                    <div className="space-y-6 animate-fade-in">
                      <div className="space-y-3">
                        <Label className="text-sm font-black uppercase tracking-widest text-blue-600">Title (English)</Label>
                        <Input value={titleEn} onChange={(e) => setTitleEn(e.target.value)} placeholder="e.g. Top 10 Beaches in Croatia..." className="h-14 rounded-2xl bg-blue-50 border-none" />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-sm font-black uppercase tracking-widest text-blue-600">Content (English WYSIWYG)</Label>
                        <RichTextEditor 
                          value={contentEn} 
                          onChange={setContentEn} 
                          placeholder="Start writing the article in English..." 
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-sm font-black uppercase tracking-widest text-blue-600">Excerpt (English)</Label>
                        <Textarea value={excerptEn} onChange={(e) => setExcerptEn(e.target.value)} placeholder="Short description for the card..." className="min-h-[100px] rounded-2xl bg-blue-50 border-none" />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            
            {/* Image Upload Card */}
            <Card className="rounded-[2.5rem] shadow-xl border-none">
              <CardHeader className="bg-primary/5 rounded-t-[2.5rem] border-b border-black/5 pb-6 pt-8 px-8">
                <div className="flex items-center gap-3">
                  <ImageIcon className="size-6 text-primary" />
                  <CardTitle className="text-lg font-black italic">Hero Slika</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-4">
                <ImageUpload
                  defaultImage={image}
                  onUploadComplete={(url) => setImage(url)}
                />
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Ili unesite URL ručno</Label>
                  <Input value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://..." className="h-11 rounded-xl bg-secondary/5 border-none text-sm" />
                </div>
                {image && (
                  <div className="relative aspect-video rounded-2xl overflow-hidden border border-black/5 shadow-inner">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image} alt="Hero preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Meta Card */}
            <Card className="rounded-[2.5rem] shadow-xl border-none">
              <CardContent className="p-8 space-y-6">
                <div className="space-y-3">
                  <Label className="text-sm font-black uppercase tracking-widest text-muted-foreground">Kategorija</Label>
                  <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Npr. Ljeto 2026" className="h-12 rounded-xl bg-secondary/5 border-none" />
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
                  <Label className="text-sm font-black uppercase tracking-widest text-muted-foreground">Slug (URL) *</Label>
                  <Input value={slug} onChange={(e) => setSlug(e.target.value)} className="h-12 rounded-xl bg-secondary/5 border-none" />
                </div>
              </CardContent>
            </Card>

            {/* SEO Card */}
            <Card className="rounded-[2.5rem] shadow-xl border-none">
              <CardContent className="p-8 space-y-6">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">SEO Optimizacija</p>
                
                {langTab === 'hr' ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">SEO Naslov (HR)</Label>
                      <Input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} placeholder="Automatski se generira..." className="h-11 rounded-xl bg-secondary/5 border-none text-sm" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">SEO Opis (HR)</Label>
                      <Textarea rows={2} value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} placeholder="Max 160 znakova..." className="rounded-xl bg-secondary/5 border-none text-sm" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Ključne riječi (HR)</Label>
                      <Input value={seoKeywords} onChange={(e) => setSeoKeywords(e.target.value)} placeholder="ljeto, plaže, odmor..." className="h-11 rounded-xl bg-secondary/5 border-none text-sm" />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-widest text-blue-600">SEO Title (EN)</Label>
                      <Input value={seoTitleEn} onChange={(e) => setSeoTitleEn(e.target.value)} placeholder="Auto-generated..." className="h-11 rounded-xl bg-blue-50 border-none text-sm" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-widest text-blue-600">SEO Description (EN)</Label>
                      <Textarea rows={2} value={seoDescriptionEn} onChange={(e) => setSeoDescriptionEn(e.target.value)} placeholder="Max 160 characters..." className="rounded-xl bg-blue-50 border-none text-sm" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-widest text-blue-600">Keywords (EN)</Label>
                      <Input value={seoKeywordsEn} onChange={(e) => setSeoKeywordsEn(e.target.value)} placeholder="summer, beaches, travel..." className="h-11 rounded-xl bg-blue-50 border-none text-sm" />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Button onClick={handleSave} disabled={isSaving} className="w-full h-16 rounded-[1.5rem] font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform">
              {isSaving ? <Loader2 className="animate-spin size-6" /> : <><Save className="size-6 mr-3" /> {editId ? 'AŽURIRAJ ČLANAK' : 'OBJAVI ČLANAK'}</>}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
