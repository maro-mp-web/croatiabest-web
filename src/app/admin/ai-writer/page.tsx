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
import { Sparkles, Loader2, Send, Copy, RotateCcw, Save } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function AIWriterPage() {
  const [contentType, setContentType] = useState<'listing' | 'article'>('listing');
  const [category, setCategory] = useState('');
  const [prompt, setPrompt] = useState('');
  const [existingContent, setExistingContent] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-12">
          <h1 className="text-4xl font-headline font-bold mb-2">AI Content Assistant</h1>
          <p className="text-muted-foreground text-lg">Koristite umjetnu inteligenciju za pisanje opisa objekata i članaka.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Konfiguracija</CardTitle>
                <CardDescription>Postavite parametre za generiranje sadržaja</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Tip Sadržaja</Label>
                  <Select value={contentType} onValueChange={(v) => setContentType(v as any)}>
                    <SelectTrigger>
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
                  />
                </div>

                <div className="space-y-2">
                  <Label>Postojeći sadržaj (za poboljšanje)</Label>
                  <Textarea 
                    placeholder="Ako imate tekst koji želite poboljšati, zalijepite ga ovdje..." 
                    className="min-h-[100px]"
                    value={existingContent}
                    onChange={(e) => setExistingContent(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Upute za AI (Što želite napisati?)</Label>
                  <Textarea 
                    placeholder="npr. 'Napiši privlačan opis za luksuzni restoran na obali Splita koji nudi svježu ribu i vina.'" 
                    className="min-h-[120px]"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                </div>

                <Button 
                  onClick={handleGenerate} 
                  disabled={isGenerating} 
                  className="w-full h-12 text-lg font-semibold"
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
            <Card className="h-full flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Generirani Sadržaj</CardTitle>
                  <CardDescription>Pregled AI rezultata</CardDescription>
                </div>
                {generatedContent && (
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setGeneratedContent('')} title="Očisti">
                      <RotateCcw className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={copyToClipboard} title="Kopiraj">
                      <Copy className="size-4" />
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="flex-1 overflow-auto">
                {!generatedContent && !isGenerating ? (
                  <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-xl border-muted">
                    <Sparkles className="size-12 text-muted-foreground mb-4 opacity-20" />
                    <p className="text-muted-foreground font-light">
                      Vaš generirani sadržaj će se pojaviti ovdje.<br />Ispunite formu s lijeve strane za početak.
                    </p>
                  </div>
                ) : isGenerating ? (
                  <div className="space-y-4 animate-pulse">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-full" />
                    <div className="h-4 bg-muted rounded w-5/6" />
                    <div className="h-4 bg-muted rounded w-full" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                  </div>
                ) : (
                  <div className="prose prose-sm max-w-none whitespace-pre-wrap font-body text-lg leading-relaxed">
                    {generatedContent}
                  </div>
                )}
              </CardContent>
              {generatedContent && (
                <div className="p-6 border-t bg-secondary/30 flex justify-end gap-3">
                  <Button variant="outline">Odbaci</Button>
                  <Button className="bg-primary">
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