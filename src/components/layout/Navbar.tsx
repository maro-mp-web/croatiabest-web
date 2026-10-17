"use client"

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Map, Menu, BookOpen, ChevronDown, Building2, Anchor, PlusCircle, LogOut, User, LayoutDashboard, CreditCard, Newspaper, Sparkles } from 'lucide-react';
import { getLocalizedUrl } from '@/lib/i18n-routes';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { useLanguage } from '@/contexts/LanguageContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
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

  const isAdmin = Boolean(
    user?.email === 'maro.webdeveloper@gmail.com' || 
    user?.email === 'admin@croatiabest.hr' || 
    (user as any)?.role === 'admin' || 
    (user as any)?.isAdmin === true || 
    (pb?.authStore?.isSuperuser ?? false)
  );

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
    <header className={`${transparent ? 'fixed' : 'sticky'} top-0 left-0 right-0 z-50 w-full border-b transition-colors duration-200 ${
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
            
            {/* Cities Menu */}
            <div className="relative group py-2">
              <Link 
                href={getLocalizedUrl("/cities", language)} 
                className="flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider hover:text-primary transition-colors cursor-pointer"
              >
                <Building2 className="size-4" /> {t.navCities} 
                <ChevronDown className="size-3 transition-transform duration-200 group-hover:rotate-180 text-muted-foreground group-hover:text-primary" />
              </Link>
              
              <div className="absolute top-full left-0 pt-2 opacity-0 invisible pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:visible group-focus-within:pointer-events-auto transition-all duration-200 z-50">
                <div className="w-60 rounded-2xl p-2 bg-white/95 backdrop-blur-md shadow-2xl border border-black/5 text-slate-800 grid grid-cols-1 gap-1 max-h-[75vh] overflow-y-auto">
                  <Link 
                    href={getLocalizedUrl("/cities", language)}
                    className="w-full font-black text-primary hover:bg-primary/5 rounded-xl transition-colors px-3 py-2 block border-b border-slate-100 text-xs uppercase tracking-wider"
                  >
                    {language === 'en' ? 'All Cities →' : 'Svi gradovi →'}
                  </Link>
                  {cities.map((city) => (
                    <Link 
                      key={city.slug} 
                      href={getLocalizedUrl(`/cities/${city.slug}`, language)}
                      className="w-full font-medium hover:bg-primary/5 hover:text-primary rounded-lg transition-colors px-3 py-1.5 block text-xs"
                    >
                      {city.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Islands Menu */}
            <div className="relative group py-2">
              <Link 
                href={getLocalizedUrl("/islands", language)} 
                className="flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider hover:text-primary transition-colors cursor-pointer"
              >
                <Anchor className="size-4" /> {t.navIslands} 
                <ChevronDown className="size-3 transition-transform duration-200 group-hover:rotate-180 text-muted-foreground group-hover:text-primary" />
              </Link>
              
              <div className="absolute top-full left-0 pt-2 opacity-0 invisible pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:visible group-focus-within:pointer-events-auto transition-all duration-200 z-50">
                <div className="w-60 rounded-2xl p-2 bg-white/95 backdrop-blur-md shadow-2xl border border-black/5 text-slate-800 grid grid-cols-1 gap-1 max-h-[75vh] overflow-y-auto">
                  <Link 
                    href={getLocalizedUrl("/islands", language)}
                    className="w-full font-black text-primary hover:bg-primary/5 rounded-xl transition-colors px-3 py-2 block border-b border-slate-100 text-xs uppercase tracking-wider"
                  >
                    {language === 'en' ? 'All Islands →' : 'Svi otoci →'}
                  </Link>
                  {islands.map((island) => (
                    <Link 
                      key={island.slug} 
                      href={getLocalizedUrl(`/islands/${island.slug}`, language)}
                      className="w-full font-medium hover:bg-primary/5 hover:text-primary rounded-lg transition-colors px-3 py-1.5 block text-xs"
                    >
                      {island.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* News Menu */}
            <div className="relative group py-2">
              <Link 
                href={getLocalizedUrl("/vijesti", language)} 
                className="flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider hover:text-primary transition-colors cursor-pointer"
              >
                <Newspaper className="size-4" /> {language === 'en' ? 'News' : 'Vijesti'} 
                <ChevronDown className="size-3 transition-transform duration-200 group-hover:rotate-180 text-muted-foreground group-hover:text-primary" />
              </Link>
              
              <div className="absolute top-full left-0 pt-2 opacity-0 invisible pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:visible group-focus-within:pointer-events-auto transition-all duration-200 z-50">
                <div className="w-64 rounded-2xl p-2 bg-white/95 backdrop-blur-md shadow-2xl border border-black/5 text-slate-800 grid grid-cols-1 gap-1 max-h-[75vh] overflow-y-auto">
                  <Link 
                    href={getLocalizedUrl('/vijesti', language)}
                    className="w-full font-black text-primary hover:bg-primary/5 rounded-xl transition-colors px-3 py-2 block border-b border-slate-100 text-xs uppercase tracking-wider"
                  >
                    {language === 'en' ? 'All News →' : 'Sve vijesti →'}
                  </Link>
                  {[
                    'Vijesti iz Hrvatske', 'Vijesti iz Svijeta', 'Poznati Hrvati',
                    'Slavni u Hrvatskoj', 'Zanimljivosti', 'Iz Povijesti',
                    'Iz geografije', 'Domovinski rat'
                  ].map((cat) => (
                    <Link 
                      key={cat} 
                      href={getLocalizedUrl(`/vijesti/${cat.toLowerCase().replace(/ /g, '-')}`, language)}
                      className="w-full font-medium hover:bg-primary/5 hover:text-primary rounded-lg transition-colors px-3 py-1.5 block text-xs"
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

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
              <DropdownMenuContent align="end" className="w-60 rounded-xl p-2">
                {isAdmin && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link 
                        href="/admin"
                        className="cursor-pointer font-bold hover:bg-primary/5 hover:text-primary rounded-lg transition-colors gap-2 flex items-center px-2 py-1.5 text-sm"
                      >
                        <LayoutDashboard className="size-4 text-primary" /> Admin Panel
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link 
                        href="/admin?tab=bot"
                        className="cursor-pointer font-semibold hover:bg-amber-50 text-amber-700 rounded-lg transition-colors gap-2 text-xs flex items-center px-2 py-1.5"
                      >
                        <Sparkles className="size-3.5 text-amber-500" /> Vijesti Bot (Objave & Uređivanje)
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link 
                        href="/admin?tab=blogs"
                        className="cursor-pointer font-semibold hover:bg-rose-50 text-rose-700 rounded-lg transition-colors gap-2 text-xs flex items-center px-2 py-1.5"
                      >
                        <BookOpen className="size-3.5" /> Magazin i Vijesti
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link 
                        href="/admin?tab=islands"
                        className="cursor-pointer font-semibold hover:bg-emerald-50 text-emerald-700 rounded-lg transition-colors gap-2 text-xs flex items-center px-2 py-1.5"
                      >
                        <Anchor className="size-3.5" /> Administracija Otoka
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link 
                        href="/admin?tab=cities"
                        className="cursor-pointer font-semibold hover:bg-blue-50 text-blue-700 rounded-lg transition-colors gap-2 text-xs flex items-center px-2 py-1.5"
                      >
                        <Building2 className="size-3.5" /> Administracija Gradova
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link 
                        href="/admin?tab=listings"
                        className="cursor-pointer font-semibold hover:bg-slate-100 text-slate-700 rounded-lg transition-colors gap-2 text-xs flex items-center px-2 py-1.5"
                      >
                        <CreditCard className="size-3.5" /> Administracija Objekata
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="my-1" />
                  </>
                )}
                <DropdownMenuItem asChild>
                  <Link 
                    href="/dashboard"
                    className="cursor-pointer font-medium hover:bg-primary/5 hover:text-primary rounded-lg transition-colors gap-2 flex items-center px-2 py-1.5 text-sm"
                  >
                    <User className="size-4" /> Moj Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onSelect={handleLogout}
                  className="cursor-pointer font-medium hover:bg-red-50 text-red-600 hover:text-red-700 rounded-lg transition-colors gap-2 flex items-center px-2 py-1.5 text-sm"
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
                    <Link href={getLocalizedUrl("/cities", language)} className="text-xs font-bold text-muted-foreground hover:text-primary mb-3 tracking-widest uppercase flex items-center justify-between">
                      <span>{t.navCities}</span>
                      <span className="text-primary text-xs font-bold">Svi gradovi →</span>
                    </Link>
                    <div className="grid grid-cols-2 gap-2">
                      {cities.map(city => (
                        <Link key={city.slug} href={getLocalizedUrl(`/cities/${city.slug}`, language)} className="text-sm font-bold hover:text-primary transition-colors">{city.name}</Link>
                      ))}
                    </div>
                  </div>
                  <div className="border-t pt-4 pb-2">
                    <Link href={getLocalizedUrl("/islands", language)} className="text-xs font-bold text-muted-foreground hover:text-primary mb-3 tracking-widest uppercase flex items-center justify-between">
                      <span>{t.navIslands}</span>
                      <span className="text-primary text-xs font-bold">Svi otoci →</span>
                    </Link>
                    <div className="grid grid-cols-2 gap-2">
                      {islands.map(island => (
                        <Link key={island.slug} href={getLocalizedUrl(`/islands/${island.slug}`, language)} className="text-sm font-bold hover:text-primary transition-colors">{island.name}</Link>
                      ))}
                    </div>
                  </div>
                  <div className="border-t pt-4 pb-2">
                    <div className="flex items-center justify-between mb-3">
                      <Link href={getLocalizedUrl("/vijesti", language)} className="text-xs font-bold text-muted-foreground hover:text-primary tracking-widest uppercase">
                        {language === 'en' ? 'News' : 'Vijesti'}
                      </Link>
                      <Link href={getLocalizedUrl("/vijesti", language)} className="text-xs font-bold text-primary hover:underline">
                        {language === 'en' ? 'All news →' : 'Sve vijesti →'}
                      </Link>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        'Vijesti iz Hrvatske', 'Vijesti iz Svijeta', 'Poznati Hrvati',
                        'Slavni u Hrvatskoj', 'Zanimljivosti', 'Iz Povijesti',
                        'Iz geografije', 'Domovinski rat'
                      ].map((cat) => (
                        <Link key={cat} href={getLocalizedUrl(`/vijesti/${cat.toLowerCase().replace(/ /g, '-')}`, language)} className="text-sm font-bold hover:text-primary transition-colors">{cat}</Link>
                      ))}
                    </div>
                  </div>
                  <Link href={getLocalizedUrl("/blog", language)} className="text-xl font-black uppercase tracking-tight hover:text-primary transition-colors">{t.navBlog}</Link>
                  {user && (
                    <div className="border-t pt-6 mt-4 space-y-3">
                      <p className="text-xs font-bold text-muted-foreground tracking-widest uppercase">Moj Račun</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      {isAdmin && (
                        <div className="space-y-2 pb-2 border-b border-black/5">
                          <Link href="/admin" className="flex items-center gap-2 text-sm font-bold text-primary hover:text-primary transition-colors">
                            <LayoutDashboard className="size-4" /> Admin Panel
                          </Link>
                          <Link href="/admin?tab=islands" className="flex items-center gap-2 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors pl-6">
                            <Anchor className="size-3.5" /> Administracija Otoka
                          </Link>
                          <Link href="/admin?tab=cities" className="flex items-center gap-2 text-xs font-bold text-blue-700 hover:text-blue-800 transition-colors pl-6">
                            <Building2 className="size-3.5" /> Administracija Gradova
                          </Link>
                        </div>
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
