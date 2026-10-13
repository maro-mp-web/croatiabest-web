"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { 
  Sparkles, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ExternalLink, 
  Plus, 
  Trash2, 
  Check, 
  Edit3, 
  Loader2,
  Sliders,
  Rss,
  Key,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePB } from '@/pocketbase';
import { BotConfig, NewsSource, SyncLogEntry } from '@/lib/news-bot/types';

const NEWS_CATEGORIES = [
  'Vijesti iz Hrvatske',
  'Vijesti iz Svijeta',
  'Poznati Hrvati',
  'Slavni u Hrvatskoj',
  'Zanimljivosti',
  'Iz Povijesti',
  'Iz geografije',
  'Domovinski rat',
];

export function NewsBotManager({ blogs, onBlogsUpdate }: { blogs: any[]; onBlogsUpdate?: () => void }) {
  const pb = usePB();
  const [config, setConfig] = useState<BotConfig | null>(null);
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncLogs, setSyncLogs] = useState<SyncLogEntry[]>([]);
  const [syncSummary, setSyncSummary] = useState<string | null>(null);

  // New source form state
  const [newSourceName, setNewSourceName] = useState('');
  const [newSourceUrl, setNewSourceUrl] = useState('');
  const [newSourceCategory, setNewSourceCategory] = useState(NEWS_CATEGORIES[0]);

  // Učitaj postavke bota
  const fetchConfig = async () => {
    try {
      setIsLoadingConfig(true);
      const token = pb?.authStore?.token || '';
      const res = await fetch('/api/bot/config', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success && data.config) {
        setConfig(data.config);
      }
    } catch (e: any) {
      toast({ title: 'Greška', description: 'Neuspjelo učitavanje postavki bota.', variant: 'destructive' });
    } finally {
      setIsLoadingConfig(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, [pb?.authStore?.token]);

  // Spremi postavke bota
  const handleSaveConfig = async () => {
    if (!config) return;
    try {
      setIsSavingConfig(true);
      const token = pb?.authStore?.token || '';
      const res = await fetch('/api/bot/config', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(config),
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: 'Spremljeno', description: 'Postavke bota su uspješno ažurirane.' });
      } else {
        throw new Error(data.error);
      }
    } catch (e: any) {
      toast({ title: 'Greška', description: e.message || 'Greška pri spremanju postavki.', variant: 'destructive' });
    } finally {
      setIsSavingConfig(false);
    }
  };

  // Pokreni sinkronizaciju
  const handleRunSync = async () => {
    try {
      setIsSyncing(true);
      setSyncLogs([]);
      setSyncSummary(null);

      const token = pb?.authStore?.token || '';
      const res = await fetch('/api/bot/sync', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.success) {
        setSyncLogs(data.logs || []);
        setSyncSummary(`Uvezeno: ${data.imported} novih vijesti | Preskočeno duplikata: ${data.skippedDuplicate} | Bez slike: ${data.skippedNoImage} | Limit popunjen: ${data.skippedLimitReached}`);
        toast({ title: 'Sinkronizacija završena', description: `Uvezeno ${data.imported} novih vijesti.` });
        if (onBlogsUpdate) onBlogsUpdate();
      } else {
        throw new Error(data.error);
      }
    } catch (e: any) {
      toast({ title: 'Greška pri sinkronizaciji', description: e.message || 'Sinkronizacija nije uspjela.', variant: 'destructive' });
    } finally {
      setIsSyncing(false);
    }
  };

  // Odobri ili odbaci članak
  const handleArticleAction = async (articleId: string, action: 'approve' | 'delete') => {
    try {
      const token = pb?.authStore?.token || '';
      const res = await fetch('/api/bot/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ articleId, action }),
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: 'Uspješno', description: data.message });
        if (onBlogsUpdate) onBlogsUpdate();
      } else {
        throw new Error(data.error);
      }
    } catch (e: any) {
      toast({ title: 'Greška', description: e.message || 'Radnja nije uspjela.', variant: 'destructive' });
    }
  };

  // Dodavanje novog izvora
  const handleAddSource = () => {
    if (!newSourceName.trim() || !newSourceUrl.trim() || !config) return;
    const newSource: NewsSource = {
      id: `src-${Date.now()}`,
      name: newSourceName.trim(),
      url: newSourceUrl.trim(),
      type: 'rss',
      category: newSourceCategory,
      enabled: true,
    };
    setConfig({
      ...config,
      sources: [...config.sources, newSource],
    });
    setNewSourceName('');
    setNewSourceUrl('');
    toast({ title: 'Izvor dodan', description: 'Kliknite "Spremi postavke" za potvrdu izmjena.' });
  };

  // Uklanjanje izvora
  const handleRemoveSource = (id: string) => {
    if (!config) return;
    setConfig({
      ...config,
      sources: config.sources.filter(s => s.id !== id),
    });
    toast({ title: 'Izvor uklonjen', description: 'Kliknite "Spremi postavke" za potvrdu izmjena.' });
  };

  // Uključivanje/isključivanje izvora
  const handleToggleSource = (id: string, enabled: boolean) => {
    if (!config) return;
    setConfig({
      ...config,
      sources: config.sources.map(s => s.id === id ? { ...s, enabled } : s),
    });
  };

  // Filtriraj članke koji čekaju odobrenje
  const pendingArticles = (blogs || []).filter(b => {
    const tags = Array.isArray(b.tags) ? b.tags : [];
    return tags.includes('pending_approval');
  });

  if (isLoadingConfig) {
    return (
      <div className="flex flex-col items-center justify-center p-16 space-y-4">
        <Loader2 className="size-10 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium">Učitavam modul Vijesti Bota...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Glavni Header kartica */}
      <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-8 md:p-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="p-3 bg-primary/20 text-primary rounded-2xl border border-primary/30">
                <Sparkles className="size-8" />
              </span>
              <div>
                <Badge className="bg-primary text-white font-black text-xs uppercase tracking-widest px-3 py-1 mb-1">
                  Automatski AI Modul
                </Badge>
                <h2 className="text-3xl md:text-4xl font-black italic tracking-tight">Turistički Vijesti Bot</h2>
              </div>
            </div>
            <p className="text-slate-300 max-w-2xl text-sm md:text-base leading-relaxed">
              Automatski preuzima najnovije turističke vijesti s provjerenih izvora, prepisuje ih pomoću AI kako bi bile 100% originalne (bez Google duplikat penala), prevodi na engleski i popunjava sve SEO podatke.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <Button
              size="lg"
              onClick={handleRunSync}
              disabled={isSyncing}
              className="w-full sm:w-auto rounded-2xl h-14 px-8 bg-primary hover:bg-primary/90 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-primary/25 transition-all"
            >
              {isSyncing ? (
                <>
                  <Loader2 className="size-5 mr-3 animate-spin" /> Sinkroniziram...
                </>
              ) : (
                <>
                  <RefreshCw className="size-5 mr-3" /> Pokreni uvoz vijesti sada
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Brzi status indikatori */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mt-8 pt-8 border-t border-white/10">
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
            <span className="text-xs uppercase font-bold text-slate-400 block mb-1">Automatski rad</span>
            <div className="flex items-center gap-2">
              <span className={`size-2.5 rounded-full ${config?.enabled !== false ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
              <span className="font-black text-sm">{config?.enabled !== false ? 'Svaki sat (Cron)' : 'Isključeno'}</span>
            </div>
          </div>
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
            <span className="text-xs uppercase font-bold text-slate-400 block mb-1">Zadnje pokretanje</span>
            <span className="font-black text-sm text-slate-200">
              {config?.lastRun ? `${new Date(config.lastRun.timestamp).toLocaleTimeString('hr-HR', { hour: '2-digit', minute: '2-digit' })} (${config.lastRun.imported} uvezeno)` : 'Spremno'}
            </span>
          </div>
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
            <span className="text-xs uppercase font-bold text-slate-400 block mb-1">Način objave</span>
            <div className="flex items-center gap-2">
              <span className={`size-2.5 rounded-full ${config?.autoPublish ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              <span className="font-black text-sm">{config?.autoPublish ? 'Auto-objava' : 'Ručno odobrenje'}</span>
            </div>
          </div>
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
            <span className="text-xs uppercase font-bold text-slate-400 block mb-1">Dnevni limit</span>
            <span className="font-black text-sm text-primary">{config?.maxPerCategoryPerDay || 10} po rubrici/dan</span>
          </div>
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
            <span className="text-xs uppercase font-bold text-slate-400 block mb-1">Na čekanju za pregled</span>
            <span className="font-black text-sm text-amber-300">{pendingArticles.length} vijesti</span>
          </div>
        </div>
      </Card>

      {/* Dnevnik zadnje sinkronizacije (ako postoji) */}
      {(syncLogs.length > 0 || isSyncing) && (
        <Card className="border-none shadow-xl rounded-[2.5rem] bg-slate-950 text-white p-8">
          <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <RefreshCw className={`size-5 text-primary ${isSyncing ? 'animate-spin' : ''}`} />
              <h3 className="font-black uppercase tracking-wider text-sm">Dnevnik Sinkronizacije Uživo</h3>
            </div>
            {syncSummary && (
              <Badge className="bg-primary/20 text-primary border border-primary/30 text-xs">
                {syncSummary}
              </Badge>
            )}
          </div>
          <div className="max-h-60 overflow-y-auto space-y-2 font-mono text-xs text-slate-300 pr-2">
            {syncLogs.map((log, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <span className="text-slate-500 shrink-0">[{log.timestamp}]</span>
                <span className={
                  log.level === 'success' ? 'text-emerald-400 font-bold' :
                  log.level === 'warn' ? 'text-amber-400' :
                  log.level === 'error' ? 'text-rose-400 font-bold' :
                  'text-slate-300'
                }>
                  {log.message}
                </span>
              </div>
            ))}
            {isSyncing && (
              <div className="flex items-center gap-2 text-primary font-bold animate-pulse pt-2">
                <Loader2 className="size-4 animate-spin" /> Obrađujem članke u pozadini...
              </div>
            )}
          </div>
        </Card>
      )}

      {/* ČLANCI NA ČEKANJU ZA ODOBRENJE (ako je autoPublish isključen ili ima zaostalih) */}
      {pendingArticles.length > 0 && (
        <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
          <CardHeader className="bg-amber-500/10 border-b border-amber-500/20 p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="size-6 text-amber-600" />
                <div>
                  <CardTitle className="text-xl font-black italic tracking-tight text-amber-900">
                    Članci na čekanju za odobrenje ({pendingArticles.length})
                  </CardTitle>
                  <CardDescription className="text-amber-800/80">
                    Ove vijesti je bot pripremio, ali čekaju tvoje odobrenje prije prikazivanja na portalu.
                  </CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingArticles.map((article) => (
                <div key={article.id} className="border border-slate-200 rounded-2xl overflow-hidden flex flex-col bg-slate-50 shadow-sm hover:shadow-md transition-all">
                  <div className="relative h-44 w-full bg-slate-200">
                    {article.image ? (
                      <Image src={article.image} alt={article.title} fill className="object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-slate-400 text-xs">Nema slike</div>
                    )}
                    <Badge className="absolute top-3 left-3 bg-black/75 text-white font-black text-[10px] uppercase">
                      {article.category}
                    </Badge>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h4 className="font-black text-sm leading-snug line-clamp-2 text-slate-900 mb-2">
                        {article.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {article.excerpt}
                      </p>
                    </div>
                    <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleArticleAction(article.id, 'approve')}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-10 font-bold text-xs"
                      >
                        <Check className="size-4 mr-1.5" /> Odobri i objavi
                      </Button>
                      <Link href={`/admin/new-blog?edit=${article.id}`}>
                        <Button size="sm" variant="outline" className="rounded-xl h-10 px-3">
                          <Edit3 className="size-4" />
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleArticleAction(article.id, 'delete')}
                        className="rounded-xl h-10 px-3"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* POSTAVKE BOTA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
          <CardHeader className="bg-secondary/5 border-b p-8">
            <div className="flex items-center gap-3">
              <Sliders className="size-5 text-primary" />
              <CardTitle className="text-xl font-black italic">Pravila i Postavke</CardTitle>
            </div>
            <CardDescription>Upravljajte načinom objave i dnevnim limitima.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            {config && (
              <>
                {/* Prekidač Auto-Publish vs Approval */}
                <div className="rounded-2xl border p-5 bg-slate-50 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-black text-sm block cursor-pointer">
                        Automatsko objavljivanje
                      </Label>
                      <span className="text-xs text-slate-500">
                        {config.autoPublish 
                          ? 'Vijesti se automatski objavljuju odmah na portalu.' 
                          : 'Vijesti se spremaju na čekanje i traže tvoje odobrenje.'}
                      </span>
                    </div>
                    <Switch
                      checked={config.autoPublish}
                      onCheckedChange={(checked) => setConfig({ ...config, autoPublish: checked })}
                    />
                  </div>
                </div>

                {/* Dnevni limit */}
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-wider text-slate-500">
                    Maksimalan broj vijesti po rubrici na dan
                  </Label>
                  <Input
                    type="number"
                    min="1"
                    max="50"
                    value={config.maxPerCategoryPerDay}
                    onChange={(e) => setConfig({ ...config, maxPerCategoryPerDay: parseInt(e.target.value) || 10 })}
                    className="h-12 rounded-xl bg-secondary/5 border-none font-bold"
                  />
                  <p className="text-[11px] text-slate-400">
                    Zadano 10 vijesti. Kad se kvota ispuni, bot prestaje preuzimati za tu kategoriju tog dana.
                  </p>
                </div>

                {/* Gemini API Key */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-black uppercase tracking-wider text-slate-500">
                      Google Gemini API Ključ
                    </Label>
                    <a
                      href="https://aistudio.google.com/app/apikey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-primary hover:underline flex items-center gap-1 font-bold"
                    >
                      Dohvati besplatno <ExternalLink className="size-3" />
                    </a>
                  </div>
                  <Input
                    type="password"
                    placeholder="AIzaSy..."
                    value={config.geminiApiKey || ''}
                    onChange={(e) => setConfig({ ...config, geminiApiKey: e.target.value })}
                    className="h-12 rounded-xl bg-secondary/5 border-none font-mono text-xs"
                  />
                  <p className="text-[11px] text-slate-400">
                    100% besplatno preko Google AI Studija. Koristi se za prepisivanje članaka, prijevod i SEO.
                  </p>
                </div>

                <Button
                  onClick={handleSaveConfig}
                  disabled={isSavingConfig}
                  className="w-full rounded-2xl h-12 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider mt-4"
                >
                  {isSavingConfig ? <Loader2 className="size-4 animate-spin mr-2" /> : <CheckCircle2 className="size-4 mr-2" />}
                  Spremi postavke
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* UPRAVLJANJE IZVORIMA */}
        <Card className="lg:col-span-2 border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
          <CardHeader className="bg-secondary/5 border-b p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <Rss className="size-5 text-primary" />
                <CardTitle className="text-xl font-black italic">Izvori Vijesti (RSS & Portali)</CardTitle>
              </div>
              <CardDescription>Uključite, isključite ili dodajte nove web izvore za preuzimanje vijesti.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            {/* Popis postojećih izvora */}
            <div className="space-y-4">
              {config?.sources?.map((source) => (
                <div key={source.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 gap-4 transition-all">
                  <div className="flex items-center gap-4">
                    <Switch
                      checked={source.enabled}
                      onCheckedChange={(checked) => handleToggleSource(source.id, checked)}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-slate-900">{source.name}</span>
                        <Badge variant="outline" className="text-[10px] font-black uppercase bg-white">
                          {source.category}
                        </Badge>
                      </div>
                      <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-400 hover:text-primary flex items-center gap-1 mt-0.5 break-all">
                        {source.url} <ExternalLink className="size-3 shrink-0" />
                      </a>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemoveSource(source.id)}
                    className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl h-10 px-3 self-end sm:self-center"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Forma za dodavanje novog izvora */}
            <div className="p-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50/30 space-y-4">
              <h4 className="font-black text-sm uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Plus className="size-4 text-primary" /> Dodaj novi izvor vijesti
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-slate-500">Naziv izvora</Label>
                  <Input
                    placeholder="Npr. HTZ Press"
                    value={newSourceName}
                    onChange={(e) => setNewSourceName(e.target.value)}
                    className="h-11 rounded-xl bg-white text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-slate-500">RSS ili URL adresa</Label>
                  <Input
                    placeholder="https://domena.hr/feed"
                    value={newSourceUrl}
                    onChange={(e) => setNewSourceUrl(e.target.value)}
                    className="h-11 rounded-xl bg-white text-xs font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-slate-500">Kategorija vijesti</Label>
                  <select
                    value={newSourceCategory}
                    onChange={(e) => setNewSourceCategory(e.target.value)}
                    className="w-full h-11 rounded-xl bg-white border border-slate-200 px-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {NEWS_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
              <Button
                onClick={handleAddSource}
                disabled={!newSourceName.trim() || !newSourceUrl.trim()}
                className="rounded-xl h-10 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
              >
                Dodaj u popis
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
