
"use client"

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import dynamic from 'next/dynamic';

const MiniMap = dynamic(() => import('@/components/map/MiniMap'), { ssr: false });
import { CATEGORIES, DEFAULT_LISTING_IMAGE } from '@/app/lib/constants';
import { CATEGORY_FIELDS } from '@/app/lib/category-fields';
import { MapPin, Phone, Mail, Globe, Calendar, Users, List, Info, Loader2, Send, Tag, ShoppingBag, Check, X, Sparkles } from 'lucide-react';
import { notFound, useParams } from 'next/navigation';
import { getFirstPhoto, getAllPhotos } from '@/app/lib/image-helpers';
import { generateSlug } from '@/app/lib/utils/slug';
import { useUser, usePB, useCollection } from '@/pocketbase';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';
import AdBanner from '@/components/ads/AdBanner';
import { generateListingUrl } from '@/app/lib/utils/slug';
import FAQSection from '@/components/ui/FAQSection';

export default function ListingDetailPage() {
  const params = useParams();
  const slug = (params.slugAndId as string) || '';

  const { t, language } = useLanguage();
  const { user } = useUser();
  const pb = usePB();
  const [inquiryText, setInquiryText] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [isInquiring, setIsInquiring] = useState(false);
  
  const { data: allActiveListings, isLoading } = useCollection('listings', {
    filter: 'status = "active"',
    sort: '-created',
  });

  const idParts = slug.split('-');
  const lastPart = idParts[idParts.length - 1];

  const listing = allActiveListings?.find(l => 
    (l.metadata && l.metadata.slug === slug) ||
    generateSlug(l.name) === slug ||
    l.slug === slug ||
    l.id === slug ||
    (lastPart && lastPart.length === 15 && l.id === lastPart)
  );
  
  const handleSendInquiry = async () => {
    if (!listing || !pb) return;
    if (!inquiryText) {
      toast({ title: "Prazna poruka", description: "Napišite nešto u upitu.", variant: "destructive" });
      return;
    }
    if (!user && !inquiryEmail) {
      toast({ title: "Nedostaje email", description: "Unesite email adresu kako bi vam vlasnik mogao odgovoriti.", variant: "destructive" });
      return;
    }
    setIsInquiring(true);
    try {
      await pb.collection('inquiries').create({
        listingId: listing.id,
        listingName: listing.name,
        ownerId: listing.ownerId,
        senderId: user?.id || 'anonymous',
        senderEmail: user?.email || inquiryEmail,
        message: inquiryText,
      });
      toast({ title: "Upit poslan!", description: "Vlasnik će primiti vašu poruku." });
      setInquiryText('');
      setInquiryEmail('');
    } catch (e) {
      toast({ title: "Greška", description: "Slanje nije uspjelo.", variant: "destructive" });
    } finally {
      setIsInquiring(false);
    }
  };

  if (isLoading || allActiveListings === null) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
  if (!listing) return notFound();

  const photos = getAllPhotos(listing);
  const category = CATEGORIES.find(c => c.id === listing.locationCategoryId);
  const isFreeCategory = category?.type === 'free' || listing.locationCategoryType === 'free' || listing.locationCategoryType === 'Free';

  // Helper for parsing JSON safely
  const parseJsonArray = (val: any): any[] => {
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') {
      const trimmed = val.trim();
      if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
        try {
          const parsed = JSON.parse(trimmed);
          return Array.isArray(parsed) ? parsed : [parsed];
        } catch (e) {
          return [];
        }
      }
    }
    return val ? [val] : [];
  };

  // Only show inquiry form if not a free category and actually has an owner
  const hasOwner = Boolean(listing.ownerId && typeof listing.ownerId === 'string' && listing.ownerId.trim().length > 0);
  const showInquiryForm = !isFreeCategory && hasOwner;

  // Contact details verification
  const contactPhone = listing.contactPhone?.trim();
  const webAddress = listing.webAddress?.trim();
  const contactEmail = listing.contactEmail?.trim();
  const hasContactDetails = Boolean(contactPhone || webAddress || contactEmail);

  // Products and Offer verification
  const rawProducts = parseJsonArray(listing.products);
  const validProducts = rawProducts.filter((p: any) => p && typeof p === 'object' && (p.name || p.title) && (p.price || p.desc));
  const menuDescription = listing.menuDescription?.trim();
  const hasOffer = validProducts.length > 0 || Boolean(menuDescription && menuDescription.length > 0);

  // Custom FAQ verification
  const rawFaq = parseJsonArray(listing.faq);
  const validFaq = rawFaq.filter((f: any) => f && typeof f === 'object' && f.question && f.answer && f.question.trim().length > 0 && f.answer.trim().length > 0);
  const hasFaq = validFaq.length > 0;

  // Specific category metadata fields verification
  const activeCategoryFields = (CATEGORY_FIELDS[listing.locationCategoryId] || []).filter(field => {
    const value = listing.metadata?.[field.id];
    return value !== undefined && value !== null && value !== '' && value !== false;
  });

  // Description verification
  const descriptionHtml = (language === 'en' && listing.metadata?.descriptionEn) ? listing.metadata.descriptionEn : listing.description;
  const hasDescription = Boolean(descriptionHtml && descriptionHtml.trim().length > 0);

  // Location / coordinates check
  const lat = parseFloat(listing.latitude);
  const lng = parseFloat(listing.longitude);
  const hasValidCoordinates = !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;

  const addressText = listing.address?.trim();
  const cityText = listing.city?.trim();

  const relatedListings = allActiveListings
    ?.filter(l => l.id !== listing.id && (l.locationCategoryId === listing.locationCategoryId || l.city === listing.city))
    .slice(0, 4) || [];

  const promotedListings = allActiveListings
    ?.filter(l => l.id !== listing.id && (l.locationCategoryType === 'paid' || l.locationCategoryType === 'Paid') && l.city === listing.city)
    .slice(0, 4) || [];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pb-24">
        <section className="h-[50vh] min-h-[400px] relative flex gap-2 p-2">
          <div className="flex-1 relative rounded-[2rem] overflow-hidden">
            <Image src={getFirstPhoto(listing) || DEFAULT_LISTING_IMAGE} alt="Hero" fill sizes="100vw" className="object-cover" priority />
          </div>
          {photos.length > 1 && (
            <div className="w-1/4 hidden md:flex flex-col gap-2">
              {photos.slice(1, 3).map((p: string, i: number) => (
                <div key={i} className="flex-1 relative rounded-[2rem] overflow-hidden">
                  <Image src={p} alt={`Photo ${i}`} fill sizes="25vw" className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="container mx-auto px-4 mt-12 flex flex-col lg:flex-row gap-12">
          <div className="flex-1 space-y-12">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {category && (
                  <Badge className="bg-primary/10 text-primary border-none px-6 py-1.5 uppercase font-black text-[10px] tracking-widest">
                    {t[`cat_${category.id}` as keyof typeof t] || category.name}
                  </Badge>
                )}
                {cityText && (
                  <Badge variant="outline" className="text-secondary border-secondary px-6 py-1.5 font-black text-[10px]">
                    {cityText}
                  </Badge>
                )}
              </div>
              <h1 className="text-6xl font-headline font-black tracking-tighter">
                {language === 'en' && listing.metadata?.nameEn ? listing.metadata.nameEn : listing.name}
              </h1>
              {(addressText || cityText) && (
                <p className="text-xl text-muted-foreground flex items-center gap-2">
                  <MapPin className="size-5 text-primary" /> 
                  {addressText ? (cityText && !addressText.toLowerCase().includes(cityText.toLowerCase()) ? `${addressText}, ${cityText}` : addressText) : cityText}
                </p>
              )}
            </div>

            <Tabs defaultValue="info" className="w-full">
              <TabsList className="bg-secondary/5 p-1 rounded-2xl h-14">
                <TabsTrigger value="info" className="px-10 h-full rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md font-black uppercase text-xs">
                  Informacije
                </TabsTrigger>
                {hasOffer && (
                  <TabsTrigger value="offer" className="px-10 h-full rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md font-black uppercase text-xs">
                    Ponuda
                  </TabsTrigger>
                )}
                {hasFaq && (
                  <TabsTrigger value="faq" className="px-10 h-full rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md font-black uppercase text-xs">
                    Česta Pitanja
                  </TabsTrigger>
                )}
              </TabsList>
              
              <TabsContent value="info" className="pt-10 space-y-8">
                {activeCategoryFields.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10 p-8 bg-secondary/5 rounded-[2rem]">
                    {activeCategoryFields.map(field => {
                      const value = listing.metadata[field.id];
                      return (
                        <div key={field.id} className="flex flex-col space-y-1">
                           <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                             {t[`field_${field.id}` as keyof typeof t] || field.label}
                           </span>
                          <span className="font-black text-lg flex items-center gap-2">
                            {field.type === 'checkbox' ? (
                              <div className="flex items-center gap-2 text-primary"><Check className="size-5" /> {language === 'en' ? 'Yes' : 'Da'}</div>
                            ) : (
                              String(value)
                            )}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
                {hasDescription && (
                  <div 
                    className="prose prose-lg max-w-none font-body italic text-foreground/80 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: descriptionHtml }}
                  />
                )}
              </TabsContent>

              {hasOffer && (
                <TabsContent value="offer" className="pt-10 space-y-10">
                  {menuDescription && (
                    <div className="p-10 bg-secondary/5 rounded-[2rem] italic text-2xl font-body">
                      {menuDescription}
                    </div>
                  )}
                  {validProducts.length > 0 && (
                    <div className="space-y-6">
                      <h3 className="text-3xl font-black italic flex items-center gap-4"><ShoppingBag className="text-primary" /> Katalog Proizvoda</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {validProducts.map((p: any, i: number) => (
                          <div key={i} className="flex justify-between items-center p-6 bg-white rounded-2xl border border-black/5 shadow-sm">
                            <span className="font-bold text-lg">{p.name || p.title}</span>
                            {(p.price || p.desc) && <Badge variant="secondary" className="text-lg px-4 py-1">{p.price || p.desc}</Badge>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>
              )}

              {hasFaq && (
                <TabsContent value="faq" className="pt-10">
                  <Accordion type="single" collapsible className="w-full space-y-4">
                    {validFaq.map((f: any, i: number) => (
                      <AccordionItem key={i} value={`item-${i}`} className="border-none bg-secondary/5 rounded-2xl px-6 py-2">
                        <AccordionTrigger className="text-xl font-bold hover:no-underline">{f.question}</AccordionTrigger>
                        <AccordionContent className="text-lg text-muted-foreground pb-4 leading-relaxed">
                          {f.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </TabsContent>
              )}
            </Tabs>
          </div>

          <aside className="w-full lg:w-96 space-y-8">
            {hasValidCoordinates && (
              <Card className="rounded-[3rem] shadow-2xl border-none overflow-hidden h-[250px] relative z-0">
                <MiniMap latitude={lat} longitude={lng} className="h-full w-full" />
              </Card>
            )}

            {showInquiryForm && (
              <Card className="rounded-[3rem] shadow-2xl border-none overflow-hidden">
                <div className="bg-foreground p-8 text-white flex justify-between items-center">
                  <h3 className="text-2xl font-black italic">Kontakt Forma</h3>
                  <Send className="size-5 opacity-40" />
                </div>
                <CardContent className="p-8 space-y-6">
                  <p className="text-xs text-muted-foreground italic">Pošaljite upit izravno vlasniku. Naš sustav štiti vašu privatnost.</p>
                  {!user && (
                    <Input 
                      type="email" 
                      placeholder="Vaša email adresa..." 
                      value={inquiryEmail} 
                      onChange={e => setInquiryEmail(e.target.value)} 
                      className="h-12 rounded-xl border-none bg-secondary/5 font-medium" 
                    />
                  )}
                  <Textarea placeholder="Vaša poruka..." value={inquiryText} onChange={e => setInquiryText(e.target.value)} className="min-h-[120px] rounded-xl border-none bg-secondary/5" />
                  <Button onClick={handleSendInquiry} disabled={isInquiring} className="w-full h-14 font-black bg-primary rounded-xl shadow-lg">
                    {isInquiring ? <Loader2 className="animate-spin" /> : 'POŠALJI UPIT'}
                  </Button>
                </CardContent>
              </Card>
            )}

            {hasContactDetails && (
              <Card className="rounded-[3rem] shadow-2xl border-none p-8 space-y-4">
                <h4 className="text-xl font-black">Detalji</h4>
                <div className="space-y-3">
                  {contactPhone && (
                    <a href={`tel:${contactPhone}`} className="flex items-center gap-3 font-bold text-sm hover:text-primary transition-colors">
                      <Phone className="size-4 text-primary" /> {contactPhone}
                    </a>
                  )}
                  {contactEmail && (
                    <a href={`mailto:${contactEmail}`} className="flex items-center gap-3 font-bold text-sm hover:text-primary transition-colors">
                      <Mail className="size-4 text-primary" /> {contactEmail}
                    </a>
                  )}
                  {webAddress && (
                    <a href={webAddress.startsWith('http') ? webAddress : `https://${webAddress}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 font-bold text-sm text-secondary hover:underline">
                      <Globe className="size-4" /> Web stranica
                    </a>
                  )}
                </div>
              </Card>
            )}

            <div className="mt-8">
              <AdBanner format="rectangle" />
            </div>
          </aside>
        </div>

        <div className="container mx-auto px-4 mt-16 mb-8">
          <AdBanner format="horizontal" />
        </div>

        {promotedListings.length > 0 && (
          <section className="container mx-auto px-4 mt-16">
            <div className="bg-primary/5 rounded-[3rem] p-10 border border-primary/20">
              <div className="flex items-center gap-4 mb-8">
                <div className="size-12 rounded-2xl bg-primary text-white flex items-center justify-center">
                  <Sparkles className="size-6" />
                </div>
                <h3 className="text-3xl font-black italic">Istaknuto u blizini</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {promotedListings.map(l => (
                  <Link key={l.id} href={generateListingUrl(l.locationCategoryId, l.metadata?.slug || l.name, language)}>
                    <Card className="group border-none shadow-md hover:shadow-xl transition-all rounded-3xl overflow-hidden h-full flex flex-col bg-white">
                      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4 group-hover:shadow-lg transition-all duration-300 bg-secondary/5">
                        <Image src={getFirstPhoto(l) || DEFAULT_LISTING_IMAGE} alt={l.name} fill sizes="25vw" className="object-cover group-hover:scale-110 transition-transform duration-700" />
                        <Badge className="absolute top-4 right-4 bg-primary text-white font-black uppercase text-[10px] tracking-widest shadow-lg">Premium</Badge>
                      </div>
                      <CardContent className="p-5 flex-1 flex flex-col justify-center">
                        <h4 className="font-black text-sm leading-tight line-clamp-2">{l.name}</h4>
                        <p className="text-[10px] text-muted-foreground mt-2 font-bold">{l.address}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {relatedListings.length > 0 && (
          <section className="container mx-auto px-4 mt-16">
            <h3 className="text-3xl font-black italic mb-8">Slični objekti u blizini</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {relatedListings.map(l => (
                <Link key={l.id} href={generateListingUrl(l.locationCategoryId, l.metadata?.slug || l.name, language)}>
                  <Card className="group border-none shadow-md hover:shadow-xl transition-all rounded-3xl overflow-hidden h-full flex flex-col bg-secondary/5">
                    <div className="relative aspect-square overflow-hidden">
                      <Image src={getFirstPhoto(l) || DEFAULT_LISTING_IMAGE} alt={l.name} fill sizes="25vw" className="object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    <CardContent className="p-5 flex-1 flex flex-col justify-center">
                      <h4 className="font-black text-sm leading-tight line-clamp-2">{l.name}</h4>
                      <p className="text-[10px] text-muted-foreground mt-2 font-bold">{l.city}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* DYNAMIC FAQ SECTION */}
        {listing && (
          <div className="container mx-auto px-4 mt-16">
            <FAQSection type="listing" name={listing.name} cityContext={listing.city} isFreeCategory={isFreeCategory} />
          </div>
        )}
      </main>
    </div>
  );
}
