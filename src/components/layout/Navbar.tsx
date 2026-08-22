"use client"

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Map, Menu, BookOpen, ChevronDown, Building2, Anchor, PlusCircle, LogOut, User, LayoutDashboard } from 'lucide-react';
import { getLocalizedUrl } from '@/lib/i18n-routes';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { useLanguage } from '@/contexts/LanguageContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Logo } from '@/components/brand/Logo';
import { useUser, useCollection, usePB } from '@/pocketbase';

interface NavbarProps {
  transparent?: boolean;
}

export function Navbar({ transparent = false }: NavbarProps) {
  const { language, setLanguage, t } = useLanguage();
  const { user } = useUser();
  const pb = usePB();
  const router = useRouter();

  // Logout handler
  const handleLogout = () => {
    if (!pb) return;
    pb.authStore.clear();
    router.push('/');
  };

  const isAdmin = user?.email === 'maro.webdeveloper@gmail.com';

  const { data: citiesData } = useCollection('cities', { sort: 'name', requestKey: null });
  const { data: islandsData } = useCollection('islands', { sort: 'name', requestKey: null });

  const cities = citiesData || [];
  const islands = islandsData || [];



  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`${transparent ? 'fixed' : 'sticky'} top-0 left-0 right-0 z-50 w-full border-b transition-all duration-300 ${
      isScrolled || !transparent
        ? 'bg-white/95 backdrop-blur-md text-foreground border-black/5 shadow-sm' 
        : 'bg-transparent text-white border-transparent'
    }`}>
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="hover:opacity-90 transition-opacity">
            <Logo />
          </Link>
          <nav className="hidden gap-6 lg:flex items-center">
            <Link href={getLocalizedUrl("/explore", language)} className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider hover:text-primary transition-colors">
              <Map className="size-4" /> {t.navExplore}
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider hover:text-primary transition-colors outline-none">
                  <Building2 className="size-4" /> {t.navCities} <ChevronDown className="size-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 rounded-xl p-2 grid grid-cols-1 gap-1">
                {cities.map((city) => (
                  <DropdownMenuItem 
                    key={city.slug} 
                    onSelect={() => router.push(getLocalizedUrl(`/cities/${city.slug}`, language))}
                    className="w-full cursor-pointer font-medium hover:bg-primary/5 hover:text-primary rounded-lg transition-colors"
                  >
                    {city.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider hover:text-primary transition-colors outline-none">
                  <Anchor className="size-4" /> {t.navIslands} <ChevronDown className="size-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 rounded-xl p-2 grid grid-cols-1 gap-1">
                {islands.map((island) => (
                  <DropdownMenuItem 
                    key={island.slug} 
                    onSelect={() => router.push(getLocalizedUrl(`/islands/${island.slug}`, language))}
                    className="w-full cursor-pointer font-medium hover:bg-primary/5 hover:text-primary rounded-lg transition-colors"
                  >
                    {island.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider hover:text-primary transition-colors outline-none">
                  <BookOpen className="size-4" /> {language === 'en' ? 'News' : 'Vijesti'} <ChevronDown className="size-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 rounded-xl p-2 grid grid-cols-1 gap-1">
                {[
                  'Vijesti iz Hrvatske', 'Vijesti iz Svijeta', 'Poznati Hrvati',
                  'Slavni u Hrvatskoj', 'Zanimljivosti', 'Iz Povijesti',
                  'Iz geografije', 'Domovinski rat'
                ].map((cat) => (
                  <DropdownMenuItem 
                    key={cat} 
                    onSelect={() => router.push(getLocalizedUrl(`/vijesti/${cat.toLowerCase().replace(/ /g, '-')}`, language))}
                    className="w-full cursor-pointer font-medium hover:bg-primary/5 hover:text-primary rounded-lg transition-colors"
                  >
                    {cat}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href={getLocalizedUrl("/blog", language)} className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider hover:text-primary transition-colors">
              <BookOpen className="size-4" /> {t.navBlog}
            </Link>
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <Link href={getLocalizedUrl("/dodaj-objekt", language)}>
            <Button variant="outline" className="rounded-full border-primary text-primary font-black px-6">
              <PlusCircle className="size-4 mr-2" /> {t.navAddListing}
            </Button>
          </Link>

          {/* User Menu (when logged in) */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-full font-bold gap-2 px-4">
                  <User className="size-4" />
                  <span className="hidden md:inline text-sm">{user.email?.split('@')[0]}</span>
                  <ChevronDown className="size-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl p-2">
                {isAdmin && (
                  <DropdownMenuItem 
                    onSelect={() => router.push('/admin')}
                    className="cursor-pointer font-medium hover:bg-primary/5 hover:text-primary rounded-lg transition-colors gap-2"
                  >
                    <LayoutDashboard className="size-4" /> Admin Panel
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem 
                  onSelect={() => router.push('/dashboard')}
                  className="cursor-pointer font-medium hover:bg-primary/5 hover:text-primary rounded-lg transition-colors gap-2"
                >
                  <User className="size-4" /> Moj Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onSelect={handleLogout}
                  className="cursor-pointer font-medium hover:bg-red-50 text-red-600 hover:text-red-700 rounded-lg transition-colors gap-2"
                >
                  <LogOut className="size-4" /> Odjavi se
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <div className="flex items-center space-x-2 font-black text-sm">
            <button 
              onClick={() => setLanguage('hr')} 
              className={`transition-colors ${language === 'hr' ? 'text-primary' : (isScrolled || !transparent ? 'text-muted-foreground hover:text-foreground' : 'text-white/60 hover:text-white')}`}
            >
              HR
            </button>
            <span className="text-muted-foreground/30">|</span>
            <button 
              onClick={() => setLanguage('en')} 
              className={`transition-colors ${language === 'en' ? 'text-primary' : (isScrolled || !transparent ? 'text-muted-foreground hover:text-foreground' : 'text-white/60 hover:text-white')}`}
            >
              EN
            </button>
          </div>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Otvori izbornik">
                <Menu className="size-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetTitle className="sr-only">Navigacija</SheetTitle>
              <SheetDescription className="sr-only">Glavni izbornik za mobilne uređaje</SheetDescription>
              <div className="flex flex-col gap-8 pt-12">
                <Logo className="mb-4" />
                <nav className="flex flex-col gap-4">
                  <Link href={getLocalizedUrl("/dodaj-objekt", language)} className="text-xl font-black text-primary uppercase tracking-tight">
                    {t.navAddListing}
                  </Link>
                  <Link href={getLocalizedUrl("/explore", language)} className="text-xl font-black uppercase tracking-tight hover:text-primary transition-colors">{t.navExplore}</Link>
                  <div className="border-t pt-4 pb-2">
                    <p className="text-xs font-bold text-muted-foreground mb-4 tracking-widest uppercase">{t.navCities}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {cities.map(city => (
                        <Link key={city.slug} href={getLocalizedUrl(`/cities/${city.slug}`, language)} className="text-sm font-bold hover:text-primary transition-colors">{city.name}</Link>
                      ))}
                    </div>
                  </div>
                  <div className="border-t pt-4 pb-2">
                    <p className="text-xs font-bold text-muted-foreground mb-4 tracking-widest uppercase">{t.navIslands}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {islands.map(island => (
                        <Link key={island.slug} href={`/islands/${island.slug}`} className="text-sm font-bold hover:text-primary transition-colors">{island.name}</Link>
                      ))}
                    </div>
                  </div>
                  <div className="border-t pt-4 pb-2">
                    <p className="text-xs font-bold text-muted-foreground mb-4 tracking-widest uppercase">{language === 'en' ? 'News' : 'Vijesti'}</p>
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        'Vijesti iz Hrvatske', 'Vijesti iz Svijeta', 'Poznati Hrvati',
                        'Slavni u Hrvatskoj', 'Zanimljivosti', 'Iz Povijesti',
                        'Iz geografije', 'Domovinski rat'
                      ].map((cat) => (
                        <Link key={cat} href={`/vijesti/${cat.toLowerCase().replace(/ /g, '-')}`} className="text-sm font-bold hover:text-primary transition-colors">{cat}</Link>
                      ))}
                    </div>
                  </div>
                  <Link href="/blog" className="text-xl font-black uppercase tracking-tight hover:text-primary transition-colors">{t.navBlog}</Link>
                  {user && (
                    <div className="border-t pt-6 mt-4 space-y-3">
                      <p className="text-xs font-bold text-muted-foreground tracking-widest uppercase">Moj Račun</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      {isAdmin && (
                        <Link href="/admin" className="flex items-center gap-2 text-sm font-bold hover:text-primary transition-colors">
                          <LayoutDashboard className="size-4" /> Admin Panel
                        </Link>
                      )}
                      <Link href="/dashboard" className="flex items-center gap-2 text-sm font-bold hover:text-primary transition-colors">
                        <User className="size-4" /> Moj Dashboard
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-sm font-bold text-red-600 hover:text-red-700 transition-colors"
                      >
                        <LogOut className="size-4" /> Odjavi se
                      </button>
                    </div>
                  )}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
