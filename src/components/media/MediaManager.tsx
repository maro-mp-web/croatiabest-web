'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { usePB, useStorage } from '@/pocketbase';
import { POCKETBASE_URL } from '@/pocketbase/config';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Loader2, 
  Search, 
  UploadCloud, 
  Copy, 
  Check, 
  ExternalLink, 
  Image as ImageIcon, 
  RefreshCw, 
  X,
  FileText
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface MediaRecord {
  id: string;
  file: string;
  collectionId: string;
  collectionName: string;
  created?: string;
  updated?: string;
  url: string;
}

export function MediaManager() {
  const pb = usePB();
  const { uploadFile, isUploading } = useStorage();

  const [items, setItems] = useState<MediaRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchMedia = async () => {
    if (!pb) return;
    setIsLoading(true);
    try {
      const records = await pb.collection('media').getFullList({
        requestKey: null,
      });

      const formatted: MediaRecord[] = records
        .map((r: any): MediaRecord | null => {
          const fileName = r.file || '';
          if (!fileName) return null;

          let fileUrl = '';
          try {
            fileUrl = pb.files.getUrl(r, fileName);
          } catch {
            fileUrl = `${POCKETBASE_URL}/api/files/${r.collectionId || 'pbc_2708086759'}/${r.id}/${fileName}`;
          }

          return {
            id: r.id,
            file: fileName,
            collectionId: r.collectionId || 'pbc_2708086759',
            collectionName: r.collectionName || 'media',
            created: r.created,
            updated: r.updated,
            url: fileUrl,
          };
        })
        .filter((i): i is MediaRecord => i !== null);

      setItems(formatted);
    } catch (err: any) {
      console.error('Error fetching media:', err);
      toast({
        title: 'Greška pri dohvatu medija',
        description: err.message || 'Provjerite administratorske ovlasti.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [pb]);

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase();
    return items.filter(
      (item) => item.file.toLowerCase().includes(q) || item.id.toLowerCase().includes(q)
    );
  }, [items, searchQuery]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Datoteka je prevelika',
        description: 'Maksimalna veličina je 5MB.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const url = await uploadFile('media', undefined, file);
      toast({
        title: 'Uspješno učitano!',
        description: `Slika je spremljena u bazu. URL: ${url}`,
      });
      await fetchMedia();
    } catch (err: any) {
      toast({
        title: 'Greška pri učitavanju',
        description: err.message || 'Pokušajte ponovno.',
        variant: 'destructive',
      });
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast({
      title: 'Kopirano!',
      description: 'Cijeli URL fotografije spreman je za lijepljenje.',
    });
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
      <CardHeader className="flex flex-col md:flex-row md:items-center justify-between border-b p-8 bg-secondary/5 gap-4">
        <div>
          <CardTitle className="text-2xl font-black uppercase tracking-tight flex items-center gap-2 text-slate-900">
            <ImageIcon className="size-6 text-primary" />
            Medijska zbirka (PocketBase Media)
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Ukupno dostupnih datoteka u bazi: <span className="font-bold text-slate-800">{items.length}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={fetchMedia}
            disabled={isLoading}
            className="rounded-xl h-10 px-4 text-xs font-bold gap-2"
          >
            <RefreshCw className={`size-4 ${isLoading ? 'animate-spin' : ''}`} />
            Osvježi
          </Button>

          <label className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-xl bg-primary text-white text-xs font-black uppercase tracking-wider cursor-pointer hover:bg-primary/90 transition-all shadow-md">
            {isUploading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <UploadCloud className="size-4" />
            )}
            <span>{isUploading ? 'Učitavanje...' : 'Učitaj novu sliku'}</span>
            <input
              type="file"
              accept="image/*"
              disabled={isUploading}
              onChange={handleUpload}
              className="hidden"
            />
          </label>
        </div>
      </CardHeader>

      <CardContent className="p-8 space-y-6">
        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Pretraži po nazivu (npr. varazdin, dubrovnik, zagreb...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 rounded-2xl bg-slate-50 border-slate-200 text-sm font-medium"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* Grid */}
        {isLoading && items.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-slate-400 gap-3">
            <Loader2 className="size-8 animate-spin text-primary" />
            <p className="text-xs font-bold uppercase tracking-wider">Učitavanje datoteka iz baze...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-200 rounded-3xl gap-3">
            <ImageIcon className="size-12 text-slate-300" />
            <p className="font-bold text-slate-700 text-sm">
              {searchQuery ? 'Nema pronađenih slika za traženi pojam.' : 'Nema još uploadanih slika u kolekciji media.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-2xl overflow-hidden border border-slate-200 bg-white hover:border-primary/50 hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="aspect-[4/3] w-full relative overflow-hidden bg-slate-950 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.url}
                    alt={item.file}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Actions on hover */}
                  <div className="absolute inset-0 p-3 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                    <div className="flex items-center justify-end gap-1.5 pointer-events-auto">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="size-8 rounded-xl bg-black/70 hover:bg-black text-white flex items-center justify-center shadow-md transition-all"
                        title="Otvori original"
                      >
                        <ExternalLink className="size-3.5" />
                      </a>
                    </div>

                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handleCopyUrl(item.url, item.id)}
                      className="pointer-events-auto w-full h-8 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs shadow-lg flex items-center justify-center gap-1.5"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="size-3.5 text-emerald-600" /> Kopirano!
                        </>
                      ) : (
                        <>
                          <Copy className="size-3.5" /> Kopiraj URL
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <div className="p-3 space-y-1">
                  <p className="text-xs font-bold text-slate-900 truncate" title={item.file}>
                    {item.file}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span className="truncate">ID: {item.id}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
