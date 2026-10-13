'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { usePB, useStorage } from '@/pocketbase';
import { POCKETBASE_URL } from '@/pocketbase/config';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Loader2, 
  Search, 
  UploadCloud, 
  Check, 
  Copy, 
  Image as ImageIcon, 
  RefreshCw, 
  X 
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface MediaItem {
  id: string;
  file: string;
  collectionId: string;
  collectionName: string;
  created?: string;
  updated?: string;
  url: string;
}

interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  title?: string;
}

export function MediaLibraryModal({
  isOpen,
  onClose,
  onSelect,
  title = 'Medijska zbirka (PocketBase Media)'
}: MediaLibraryModalProps) {
  const pb = usePB();
  const { uploadFile, isUploading } = useStorage();
  
  const [items, setItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Fetch all items from PocketBase 'media' collection
  const fetchMedia = async () => {
    if (!pb) return;
    setIsLoading(true);
    try {
      const records = await pb.collection('media').getFullList({
        requestKey: null,
      });

      const formatted: MediaItem[] = records
        .map((r: any): MediaItem | null => {
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
        .filter((item): item is MediaItem => item !== null);

      setItems(formatted);
    } catch (err: any) {
      console.error('Failed to fetch media collection:', err);
      // Even if list fails, show empty state gracefully
      toast({
        title: 'Greška pri dohvatu medija',
        description: err.message || 'Nije moguće dohvatiti stavke iz kolekcije media.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
      setSelectedUrl(null);
    }
  }, [isOpen, pb]);

  // Filter items by search query
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase();
    return items.filter(
      (item) => item.file.toLowerCase().includes(q) || item.id.toLowerCase().includes(q)
    );
  }, [items, searchQuery]);

  // Handle upload of a new file directly within the modal
  const handleUploadNew = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Datoteka je prevelika',
        description: 'Maksimalna dopuštena veličina je 5MB.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const newUrl = await uploadFile('media', undefined, file);
      toast({
        title: 'Slika uspješno učitana',
        description: 'Datoteka je dodana u bazu i odabrana.',
      });
      await fetchMedia();
      setSelectedUrl(newUrl);
    } catch (error: any) {
      toast({
        title: 'Greška pri učitavanju',
        description: error.message || 'Učitavanje nije uspjelo.',
        variant: 'destructive',
      });
    }
  };

  const handleConfirmSelect = (url: string) => {
    onSelect(url);
    onClose();
    toast({
      title: 'Fotografija odabrana',
      description: 'URL je uspješno postavljen u formu.',
    });
  };

  const handleCopy = (e: React.MouseEvent, url: string, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast({ title: 'Kopirano', description: 'URL slike kopiran u međuspremnik.' });
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        style={{ zIndex: 99999 }}
        className="max-w-4xl max-h-[88vh] flex flex-col p-0 gap-0 overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-2xl z-[99999]"
      >
        <DialogHeader className="p-6 pb-4 border-b border-slate-100 flex flex-row items-center justify-between space-y-0">
          <div>
            <DialogTitle className="text-xl font-headline font-black italic tracking-tight text-slate-900 flex items-center gap-2">
              <ImageIcon className="size-5 text-primary" />
              {title}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 font-medium mt-1">
              Odaberite postojeću sliku iz baze ili učitajte novu datoteku.
            </DialogDescription>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={fetchMedia}
            disabled={isLoading}
            className="rounded-full size-9 p-0 hover:bg-slate-100"
            title="Osvježi popis"
          >
            <RefreshCw className={`size-4 text-slate-600 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </DialogHeader>

        {/* Toolbar: Search + Quick Upload */}
        <div className="p-4 px-6 bg-slate-50 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Pretraži po nazivu datoteke (npr. varazdin, dubrovnik...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 rounded-xl bg-white border-slate-200 text-sm font-medium"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          <label className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl bg-primary text-white text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-primary/90 transition-colors shrink-0 shadow-sm">
            {isUploading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <UploadCloud className="size-4" />
            )}
            <span>{isUploading ? 'Učitavam...' : 'Učitaj novu u medije'}</span>
            <input
              type="file"
              accept="image/*"
              disabled={isUploading}
              onChange={handleUploadNew}
              className="hidden"
            />
          </label>
        </div>

        {/* Media Grid */}
        <div className="flex-1 overflow-y-auto p-6 min-h-[350px] max-h-[55vh]">
          {isLoading && items.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-slate-400 gap-3">
              <Loader2 className="size-8 animate-spin text-primary" />
              <p className="text-xs font-bold uppercase tracking-wider">Učitavanje medijske zbirke...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-200 rounded-2xl gap-3">
              <ImageIcon className="size-12 text-slate-300" />
              <div className="space-y-1">
                <p className="font-bold text-slate-700 text-sm">
                  {searchQuery ? 'Nema pronađenih slika za traženi pojam' : 'Medijska zbirka je prazna'}
                </p>
                <p className="text-xs text-slate-400">
                  Učitajte sliku pomoću gumba gore ili zalijepite izravan link.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredItems.map((item) => {
                const isSelected = selectedUrl === item.url;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedUrl(item.url)}
                    onDoubleClick={() => handleConfirmSelect(item.url)}
                    className={`group relative rounded-2xl overflow-hidden border-2 cursor-pointer transition-all duration-200 bg-slate-900 ${
                      isSelected
                        ? 'border-primary ring-4 ring-primary/20 shadow-lg scale-[1.02]'
                        : 'border-slate-200 hover:border-slate-400 hover:shadow-md'
                    }`}
                  >
                    <div className="aspect-[4/3] w-full relative overflow-hidden bg-slate-950 flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.url}
                        alt={item.file}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          // Fallback on load error
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    {/* Selected Badge */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 size-6 rounded-full bg-primary text-white flex items-center justify-center shadow-md">
                        <Check className="size-3.5 stroke-[3]" />
                      </div>
                    )}

                    {/* Copy Link Button */}
                    <button
                      type="button"
                      onClick={(e) => handleCopy(e, item.url, item.id)}
                      className="absolute top-2 left-2 size-7 rounded-lg bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-black transition-all"
                      title="Kopiraj URL"
                    >
                      {copiedId === item.id ? (
                        <Check className="size-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="size-3.5" />
                      )}
                    </button>

                    {/* Filename caption */}
                    <div className="p-2.5 bg-white border-t border-slate-100">
                      <p className="text-[11px] font-bold text-slate-800 truncate" title={item.file}>
                        {item.file}
                      </p>
                      <p className="text-[9px] text-slate-400 font-mono mt-0.5 truncate">
                        ID: {item.id}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 px-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-500 font-medium truncate max-w-md">
            {selectedUrl ? (
              <span className="text-slate-800 font-bold truncate">
                Odabrano: <span className="font-mono text-primary text-[11px]">{selectedUrl}</span>
              </span>
            ) : (
              'Kliknite na fotografiju kako biste je odabrali (ili dvoklik za trenutan odabir)'
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="rounded-xl font-bold text-xs"
            >
              Odustani
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={!selectedUrl}
              onClick={() => selectedUrl && handleConfirmSelect(selectedUrl)}
              className="rounded-xl font-bold text-xs bg-primary hover:bg-primary/90 text-white shadow-md disabled:opacity-50"
            >
              Potvrdi odabir
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
