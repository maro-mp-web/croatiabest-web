
"use client"

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { aiContentAssistant } from '@/ai/flows/ai-content-assistant';
import { Sparkles, Loader2, Copy, RotateCcw, Save, ShieldAlert } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';

export default function AIWriterPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [contentType, setContentType] = useState<'listing' | 'article'>('listing');
  const [category, setCategory] = useState('');
  const [prompt, setPrompt] = useState('');
  const [existingContent, setExistingContent] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Stroga provjera administratora
  const isAdmin = user?.email === 'maro.webdeveloper@gmail.com';

  const handleGenerate = async () => {
    if (!prompt) {
      toast({ title: "Nedostaje uputa", description: "Molimo unesite uputu za AI.", variant: "destructive" });
      return;
    }

    setIsGenerating(true);
    try {
      const result = await aiContentAssistant({
        contentType,
        category,
        promptInstruction: prompt,
        existingContent: existingContent || undefined
      });
      setGeneratedContent(result.generatedContent);
      toast({ title: "Sadržaj generiran", description: "AI je uspješno kreirao tekst." });
    } catch (error) {
      console.error(error);
      toast({ title: "Greška", description: "Došlo je do greške prilikom generiranja.", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
    toast({ title: "Kopirano", description: "Tekst je kopiran u međuspremnik." });
  };

  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="size-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <ShieldAlert className="size-24 text-destructive mb-6" />
        <h1 className="text-4xl font-black mb-4 uppercase tracking-tighter">Pristup Odbijen</h1>
        <p className="text-muted-foreground text-lg max-w-md mb-8">Ovaj moćni AI alat rezerviran je samo za administratora portala CroatiaBest.</p>
        <Button onClick={() => router.push('/')} className="rounded-xl h-12 px-8 font-bold">Povratak na portal</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-12">
          <h1 className="text-4xl font-headline font-bold mb-2">AI Content Assistant</h1>
          <p className="text-muted-foreground text-lg">Ekskluzivni alat za administrativno generiranje sadržaja visoke kvalitete.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls Panel */}
          <div className="space-y-6">
            <Card className="border-none shadow-xl rounded-[2rem]">
              <CardHeader>
                <CardTitle>Konfiguracija</CardTitle>
                <CardDescription>Postavite parametre za generiranje sadržaja</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Tip Sadržaja</Label>
                  <Select value={contentType} onValueChange={(v) => setContentType(v as any)}>
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue placeholder="Odaberite tip" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="listing">Listing (Restoran, Hotel, itd.)</SelectItem>
                      <SelectItem value="article">Članak / Blog post</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Kategorija (Opcionalno)</Label>
                  <Input 
                    placeholder="npr. Restorani, Povijest, Putovanja" 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="h-12 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Postojeći sadržaj (za poboljšanje)</Label>
                  <Textarea 
                    placeholder="Ako imate tekst koji želite poboljšati, zalijepite ga ovdje..." 
                    className="min-h-[100px] rounded-xl"
                    value={existingContent}
                    onChange={(e) => setExistingContent(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Upute za AI (Što želite napisati?)</Label>
                  <Textarea 
                    placeholder="npr. 'Napiši privlačan opis za luksuzni restoran na obali Splita koji nudi svježu ribu i vina.'" 
                    className="min-h-[120px] rounded-xl"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                </div>

                <Button 
                  onClick={handleGenerate} 
                  disabled={isGenerating} 
                  className="w-full h-14 text-lg font-black bg-primary rounded-2xl shadow-lg shadow-primary/20"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generiranje...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" /> Generiraj Sadržaj
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Preview Panel */}
          <div className="space-y-6">
            <Card className="h-full flex flex-col border-none shadow-xl rounded-[2rem] overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between border-b bg-secondary/5">
                <div>
                  <CardTitle>Generirani Sadržaj</CardTitle>
                  <CardDescription>Pregled AI rezultata</CardDescription>
                </div>
                {generatedContent && (
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setGeneratedContent('')} title="Očisti" className="rounded-full">
                      <RotateCcw className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={copyToClipboard} title="Kopiraj" className="rounded-full">
                      <Copy className="size-4" />
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="flex-1 overflow-auto p-8">
                {!generatedContent && !isGenerating ? (
                  <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-3xl border-muted">
                    <Sparkles className="size-16 text-primary mb-4 opacity-10" />
                    <p className="text-muted-foreground font-body text-lg italic">
                      Vaš generirani sadržaj će se pojaviti ovdje.<br />Ispunite formu s lijeve strane za početak.
                    </p>
                  </div>
                ) : isGenerating ? (
                  <div className="space-y-6 animate-pulse">
                    <div className="h-4 bg-muted rounded-full w-3/4" />
                    <div className="h-4 bg-muted rounded-full w-full" />
                    <div className="h-4 bg-muted rounded-full w-5/6" />
                    <div className="h-4 bg-muted rounded-full w-full" />
                    <div className="h-4 bg-muted rounded-full w-2/3" />
                  </div>
                ) : (
                  <div className="prose prose-lg max-w-none whitespace-pre-wrap font-body text-xl leading-relaxed">
                    {generatedContent}
                  </div>
                )}
              </CardContent>
              {generatedContent && (
                <div className="p-8 border-t bg-primary/5 flex justify-end gap-3">
                  <Button variant="outline" className="rounded-xl px-6">Odbaci</Button>
                  <Button className="bg-primary rounded-xl px-8 font-bold">
                    <Save className="size-4 mr-2" /> Spremi kao nacrt
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
