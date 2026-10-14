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
  Trash2,
  CheckSquare,
  Square
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
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

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

  const handleDelete = async (item: MediaRecord) => {
    if (!pb) return;
    const confirmed = window.confirm(
      `Jeste li sigurni da želite trajno obrisati fotografiju "${item.file}"? Ova radnja se ne može poništiti.`
    );
    if (!confirmed) return;

    setDeletingId(item.id);
    try {
      await pb.collection('media').delete(item.id);
      setItems((prev) => prev.filter((i) => i.id !== item.id));
      setSelectedIds((prev) => prev.filter((id) => id !== item.id));
      toast({
        title: 'Fotografija obrisana',
        description: `Slika "${item.file}" je trajno uklonjena iz medijske zbirke.`,
      });
    } catch (err: any) {
      console.error('Error deleting media:', err);
      toast({
        title: 'Greška pri brisanju',
        description: err.message || 'Nije uspjelo brisanje slike. Provjerite administratorske ovlasti.',
        variant: 'destructive',
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredItems.length && filteredItems.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredItems.map((item) => item.id));
    }
  };

  const handleBulkDelete = async () => {
    if (!pb || selectedIds.length === 0) return;
    const count = selectedIds.length;
    const confirmed = window.confirm(
      `Jeste li sigurni da želite trajno obrisati ${count} odabranih fotografija? Ova radnja se ne može poništiti.`
    );
    if (!confirmed) return;

    setIsBulkDeleting(true);
    let successCount = 0;
    const failedIds: string[] = [];

    for (const id of selectedIds) {
      try {
        await pb.collection('media').delete(id);
        successCount++;
      } catch (err) {
        console.error(`Failed to delete media ${id}:`, err);
        failedIds.push(id);
      }
    }

    setItems((prev) => prev.filter((item) => !selectedIds.includes(item.id) || failedIds.includes(item.id)));
    setSelectedIds(failedIds);
    setIsBulkDeleting(false);

    if (successCount > 0) {
      toast({
        title: 'Grupno brisanje završeno',
        description: `Uspješno obrisano ${successCount} fotografija.`,
      });
    }
    if (failedIds.length > 0) {
      toast({
        title: 'Neke slike nisu obrisane',
        description: `${failedIds.length} fotografija nije obrisano. Provjerite ovlasti.`,
        variant: 'destructive',
      });
    }
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
            {selectedIds.length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-700 font-bold rounded-md">
                Odabrano za brisanje: {selectedIds.length}
              </span>
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {selectedIds.length > 0 && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              disabled={isBulkDeleting}
              onClick={handleBulkDelete}
              className="rounded-xl h-10 px-4 text-xs font-bold gap-2 shadow-md bg-red-600 hover:bg-red-700 text-white"
            >
              {isBulkDeleting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Trash2 className="size-4" />
              )}
              <span>Obriši odabrano ({selectedIds.length})</span>
            </Button>
          )}

          {filteredItems.length > 0 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
              className="rounded-xl h-10 px-3.5 text-xs font-bold gap-2"
            >
              {selectedIds.length === filteredItems.length && filteredItems.length > 0 ? (
                <>
                  <CheckSquare className="size-4 text-primary" />
                  Odznači sve
                </>
              ) : (
                <>
                  <Square className="size-4 text-slate-400" />
                  Označi sve
                </>
              )}
            </Button>
          )}

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
            {filteredItems.map((item) => {
              const isSelected = selectedIds.includes(item.id);
              const isDeleting = deletingId === item.id;

              return (
                <div
                  key={item.id}
                  className={`group relative rounded-2xl overflow-hidden border bg-white transition-all duration-300 flex flex-col ${
                    isSelected
                      ? 'border-red-500 ring-2 ring-red-400/30 shadow-lg'
                      : 'border-slate-200 hover:border-primary/50 hover:shadow-xl'
                  }`}
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

                    {/* Multi-select Checkbox in top-left */}
                    <button
                      type="button"
                      onClick={() => handleToggleSelect(item.id)}
                      className={`absolute top-2.5 left-2.5 z-20 size-6 rounded-lg flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-red-600 text-white shadow-md'
                          : 'bg-black/50 text-white/70 hover:bg-black/80 hover:text-white opacity-0 group-hover:opacity-100'
                      }`}
                      title={isSelected ? 'Odznači' : 'Označi za grupno brisanje'}
                    >
                      {isSelected ? (
                        <Check className="size-4 stroke-[3]" />
                      ) : (
                        <Square className="size-4" />
                      )}
                    </button>

                    {/* Top right actions on hover: Open & Delete */}
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="size-7 rounded-lg bg-black/70 hover:bg-black text-white flex items-center justify-center shadow-md transition-all"
                        title="Otvori original"
                      >
                        <ExternalLink className="size-3.5" />
                      </a>
                      <button
                        type="button"
                        onClick={() => handleDelete(item)}
                        disabled={isDeleting}
                        className="size-7 rounded-lg bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-md transition-all"
                        title="Obriši fotografiju"
                      >
                        {isDeleting ? (
                          <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="size-3.5" />
                        )}
                      </button>
                    </div>

                    {/* Bottom action on hover: Copy URL */}
                    <div className="absolute bottom-2.5 inset-x-2.5 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handleCopyUrl(item.url, item.id)}
                        className="w-full h-8 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs shadow-lg flex items-center justify-center gap-1.5"
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

                  {/* Card footer with direct delete button */}
                  <div className="p-3 border-t border-slate-100 bg-white space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs font-bold text-slate-900 truncate flex-1" title={item.file}>
                        {item.file}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleDelete(item)}
                        disabled={isDeleting}
                        className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0"
                        title="Obriši ovu fotografiju iz medija"
                      >
                        {isDeleting ? (
                          <Loader2 className="size-3.5 animate-spin text-red-600" />
                        ) : (
                          <Trash2 className="size-3.5" />
                        )}
                      </button>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span className="truncate">ID: {item.id}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
