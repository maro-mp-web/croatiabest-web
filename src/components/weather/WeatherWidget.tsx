"use client";

import React from 'react';
import { 
  Sun, 
  CloudSun, 
  Cloud, 
  CloudRain, 
  CloudDrizzle, 
  CloudFog, 
  CloudSnow, 
  CloudLightning, 
  Waves, 
  Wind, 
  Compass, 
  Droplets, 
  Thermometer, 
  Sunrise, 
  Sunset, 
  Sparkles,
  ArrowDown
} from 'lucide-react';
import type { WeatherData, DailyForecast } from '@/app/lib/weather';

interface WeatherWidgetProps {
  data: WeatherData | null;
  locationName: string;
  isEn?: boolean;
}

function getWeatherIcon(iconName: string, className: string = 'size-6') {
  switch (iconName) {
    case 'Sun':
      return <Sun className={`${className} text-amber-500`} />;
    case 'CloudSun':
      return <CloudSun className={`${className} text-amber-500`} />;
    case 'Cloud':
      return <Cloud className={`${className} text-slate-400`} />;
    case 'CloudRain':
      return <CloudRain className={`${className} text-blue-500`} />;
    case 'CloudDrizzle':
      return <CloudDrizzle className={`${className} text-cyan-500`} />;
    case 'CloudFog':
      return <CloudFog className={`${className} text-slate-400`} />;
    case 'CloudSnow':
      return <CloudSnow className={`${className} text-sky-300`} />;
    case 'CloudLightning':
      return <CloudLightning className={`${className} text-amber-400`} />;
    default:
      return <Sun className={`${className} text-amber-500`} />;
  }
}

/**
 * WeatherAnchorPill — Top hero/header badge with quick weather and sea temperature
 * that smooth-scrolls to the full #vrijeme-i-more widget.
 */
export function WeatherAnchorPill({ data, isEn = false }: { data: WeatherData | null; isEn?: boolean }) {
  if (!data || !data.current) return null;

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById('vrijeme-i-more');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <a
      href="#vrijeme-i-more"
      onClick={handleScroll}
      className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border border-white/30 text-xs md:text-sm font-bold shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group"
      title={isEn ? 'Jump to weather and sea temperature' : 'Pogledajte vremensku prognozu i temperaturu mora'}
    >
      <span className="flex items-center gap-1 text-amber-300 font-black">
        {getWeatherIcon(data.current.iconName, 'size-4')}
        <span>{data.current.temperature}°C</span>
      </span>

      {data.marine.hasSeaData && data.marine.seaTemperature !== null && (
        <>
          <span className="text-white/40">•</span>
          <span className="flex items-center gap-1.5 text-cyan-200 font-black">
            <Waves className="size-3.5" />
            <span>{isEn ? 'Sea' : 'More'} {data.marine.seaTemperature}°C</span>
          </span>
        </>
      )}

      <span className="text-white/70 text-[11px] font-medium hidden sm:inline-flex items-center gap-1 group-hover:text-white transition-colors">
        <span>{isEn ? 'Weather & Sea' : 'Vrijeme i more'}</span>
        <ArrowDown className="size-3 group-hover:translate-y-0.5 transition-transform" />
      </span>
    </a>
  );
}

/**
 * WeatherWidget — Full modern Weather & Adriatic Marine Hub.
 * Optimized for SEO, rich schema, zero slowdown, and maximum engagement.
 */
export default function WeatherWidget({ data, locationName, isEn = false }: WeatherWidgetProps) {
  if (!data || !data.current) return null;

  const current = data.current;
  const marine = data.marine;
  const daily = data.daily || [];

  // UV index category
  const getUvBadge = (uv: number) => {
    if (uv <= 2) return { text: isEn ? 'Low' : 'Nizak', color: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30' };
    if (uv <= 5) return { text: isEn ? 'Moderate' : 'Umjeren', color: 'bg-amber-500/15 text-amber-600 border-amber-500/30' };
    if (uv <= 7) return { text: isEn ? 'High' : 'Visok', color: 'bg-orange-500/15 text-orange-600 border-orange-500/30' };
    return { text: isEn ? 'Very High' : 'Vrlo visok', color: 'bg-rose-500/15 text-rose-600 border-rose-500/30' };
  };

  const todayUv = daily[0]?.uvIndex ?? 4;
  const uvBadge = getUvBadge(todayUv);

  // Structured Data Schema for Search Engines
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: isEn 
          ? `What is the current weather and temperature in ${locationName}?` 
          : `Kakvo je trenutno vrijeme i temperatura u ${locationName}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: isEn 
            ? `The current temperature in ${locationName} is ${current.temperature}°C (${current.weatherText}) with a wind speed of ${current.windSpeed} km/h (${current.windName}).`
            : `Trenutna temperatura u ${locationName} iznosi ${current.temperature}°C (${current.weatherText}) uz vjetar ${current.windSpeed} km/h (${current.windName}).`
        }
      },
      ...(marine.hasSeaData && marine.seaTemperature !== null ? [
        {
          '@type': 'Question',
          name: isEn 
            ? `What is the sea temperature in ${locationName}?` 
            : `Kolika je temperatura mora u ${locationName}?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: isEn 
              ? `The Adriatic sea temperature in ${locationName} is currently ${marine.seaTemperature}°C. ${marine.seaComfortText}`
              : `Temperatura Jadranskog mora u ${locationName} trenutačno iznosi ${marine.seaTemperature}°C. ${marine.seaComfortText}`
          }
        }
      ] : [])
    ]
  };

  return (
    <section 
      id="vrijeme-i-more" 
      className="scroll-mt-24 rounded-[3rem] bg-gradient-to-br from-sky-500/5 via-blue-500/5 to-cyan-500/10 border border-sky-100 dark:border-sky-950/50 shadow-xl overflow-hidden p-6 md:p-10 transition-all duration-300"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* HEADER SECTION WITH SEO HEADLINE */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-sky-100 dark:border-sky-900/40">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 font-black text-xs uppercase tracking-widest mb-3">
            <Sparkles className="size-3.5" />
            <span>{isEn ? 'Live Meteorological & Sea Hub' : 'Meteo & More Info Uživo'}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-headline font-black tracking-tight text-foreground flex items-center gap-3">
            {getWeatherIcon(current.iconName, 'size-8')}
            <span>
              {isEn 
                ? `Weather & Sea Temperature — ${locationName}` 
                : `Vrijeme i temperatura mora — ${locationName}`}
            </span>
          </h2>
          <p className="text-muted-foreground text-sm font-medium mt-2 max-w-2xl">
            {isEn
              ? `Real-time meteorological forecast, Adriatic sea temperature, wave height, and 7-day outlook for ${locationName}.`
              : `Aktualno stanje vremena, temperatura Jadranskog mora, vjetar, UV indeks i 7-dnevna prognoza za ${locationName}.`}
          </p>
        </div>

        <div className="text-right text-xs text-muted-foreground font-semibold flex items-center md:flex-col md:items-end gap-2">
          <span className="inline-block size-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{isEn ? 'Updated every 30 min' : 'Osvježeno prije nekoliko minuta'}</span>
        </div>
      </div>

      {/* TOP 4 KEY METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        {/* 1. TRENUTNA TEMPERATURA */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2rem] p-6 border border-sky-100/60 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-muted-foreground mb-3">
            <span className="text-xs font-black uppercase tracking-wider">{isEn ? 'Temperature' : 'Temperatura zraka'}</span>
            <Thermometer className="size-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-5xl font-black font-headline text-foreground tracking-tight">{current.temperature}°</span>
            <span className="text-sm font-bold text-muted-foreground">C</span>
          </div>
          <p className="font-bold text-sm text-foreground flex items-center gap-1.5">
            {getWeatherIcon(current.iconName, 'size-4')}
            <span>{current.weatherText}</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {isEn ? `Feels like ${current.apparentTemperature}°C` : `Osjet ugode: ${current.apparentTemperature}°C`}
          </p>
        </div>

        {/* 2. TEMPERATURA MORA (AKO JE OBALA/OTOK) */}
        {marine.hasSeaData && marine.seaTemperature !== null ? (
          <div className="bg-gradient-to-br from-cyan-500/10 via-sky-500/10 to-blue-500/15 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2rem] p-6 border border-cyan-200/60 dark:border-cyan-900/40 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="flex items-center justify-between text-cyan-700 dark:text-cyan-400 mb-3">
              <span className="text-xs font-black uppercase tracking-wider">{isEn ? 'Sea Temperature' : 'Temperatura mora'}</span>
              <Waves className="size-4 animate-bounce" />
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-5xl font-black font-headline text-cyan-600 dark:text-cyan-300 tracking-tight">{marine.seaTemperature}°</span>
              <span className="text-sm font-bold text-cyan-600/70">C</span>
            </div>
            <p className="font-bold text-sm text-foreground">
              {marine.waveHeight !== null ? (isEn ? `Waves: ~${marine.waveHeight} m` : `Valovi: ~${marine.waveHeight} m`) : (isEn ? 'Calm sea' : 'Mirno more')}
            </p>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
              {marine.seaComfortText}
            </p>
          </div>
        ) : (
          /* FALLBACK ZA KONTINENTALNE GRADOVE (VLAGA I TLAK) */
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2rem] p-6 border border-sky-100/60 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-muted-foreground mb-3">
              <span className="text-xs font-black uppercase tracking-wider">{isEn ? 'Humidity' : 'Vlažnost zraka'}</span>
              <Droplets className="size-4 text-blue-500" />
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-5xl font-black font-headline text-foreground tracking-tight">{current.humidity}</span>
              <span className="text-sm font-bold text-muted-foreground">%</span>
            </div>
            <p className="font-bold text-sm text-foreground">
              {current.humidity > 70 ? (isEn ? 'High humidity' : 'Visoka vlažnost') : (isEn ? 'Pleasant air' : 'Ugodan zrak')}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {isEn ? 'Continental climate' : 'Kontinentalna klima'}
            </p>
          </div>
        )}

        {/* 3. VJETAR & JADRAN */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2rem] p-6 border border-sky-100/60 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-muted-foreground mb-3">
            <span className="text-xs font-black uppercase tracking-wider">{isEn ? 'Wind' : 'Vjetar'}</span>
            <Wind className="size-4 text-sky-500" />
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-5xl font-black font-headline text-foreground tracking-tight">{current.windSpeed}</span>
            <span className="text-sm font-bold text-muted-foreground">km/h</span>
          </div>
          <p className="font-bold text-sm text-foreground flex items-center gap-1.5">
            <Compass 
              className="size-4 text-sky-600 transition-transform duration-700" 
              style={{ transform: `rotate(${current.windDirection}deg)` }}
            />
            <span>{current.windName}</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {current.windSpeed < 15 ? (isEn ? 'Light breeze' : 'Slab vjetar, mirno') : (isEn ? 'Moderate to strong wind' : 'Umjeren do jak vjetar')}
          </p>
        </div>

        {/* 4. UV INDEKS I SUNCE */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2rem] p-6 border border-sky-100/60 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-muted-foreground mb-3">
            <span className="text-xs font-black uppercase tracking-wider">{isEn ? 'UV Index' : 'UV Indeks'}</span>
            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${uvBadge.color}`}>
              {uvBadge.text}
            </span>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-5xl font-black font-headline text-foreground tracking-tight">{todayUv}</span>
            <span className="text-sm font-bold text-muted-foreground">/ 11</span>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
            <span className="flex items-center gap-1">
              <Sunrise className="size-3.5 text-amber-500" />
              <span>{daily[0]?.sunrise || '07:00'}</span>
            </span>
            <span className="flex items-center gap-1">
              <Sunset className="size-3.5 text-orange-500" />
              <span>{daily[0]?.sunset || '18:15'}</span>
            </span>
          </div>
        </div>

      </div>

      {/* 7-DAY FORECAST STRIP */}
      {daily.length > 0 && (
        <div className="mb-8">
          <h3 className="font-black text-sm uppercase tracking-wider text-muted-foreground mb-4">
            {isEn ? `7-Day Weather Outlook — ${locationName}` : `Prognoza za 7 dana — ${locationName}`}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {daily.map((day, idx) => (
              <div 
                key={day.date}
                className={`p-4 rounded-2xl border text-center transition-all duration-200 ${
                  idx === 0 
                    ? 'bg-sky-50 dark:bg-sky-950/30 border-sky-300 dark:border-sky-800 shadow-sm' 
                    : 'bg-white/60 dark:bg-slate-900/60 border-black/5 dark:border-white/5 hover:bg-white dark:hover:bg-slate-900'
                }`}
              >
                <p className="text-xs font-black text-foreground mb-2 truncate">
                  {day.dayName}
                </p>
                <div className="flex justify-center my-3">
                  {getWeatherIcon(day.iconName, 'size-7')}
                </div>
                <div className="flex items-center justify-center gap-2 font-black text-sm text-foreground">
                  <span>{day.tempMax}°</span>
                  <span className="text-muted-foreground font-semibold text-xs">{day.tempMin}°</span>
                </div>
                <p className="text-[10px] text-muted-foreground font-semibold mt-1 truncate">
                  {day.weatherText}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TOURIST ADVICE BANNER */}
      <div className="rounded-2xl bg-gradient-to-r from-amber-500/10 via-sky-500/10 to-emerald-500/10 border border-amber-500/20 p-5 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
        <div className="size-10 rounded-full bg-amber-500/20 text-amber-600 flex items-center justify-center shrink-0">
          <Sparkles className="size-5" />
        </div>
        <div className="flex-1">
          <h4 className="font-black text-sm text-foreground uppercase tracking-wider">
            {isEn ? `Tourist & Visitor Tip for ${locationName}` : `Meteo & turistička preporuka za ${locationName}`}
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed font-medium">
            {data.touristTip}
          </p>
        </div>
        {marine.hasSeaData && (
          <a
            href="#explore-listings"
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById('explore-listings');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-wider shadow hover:opacity-90 transition-opacity shrink-0"
          >
            {isEn ? 'View Beaches' : 'Plaže u blizini'}
          </a>
        )}
      </div>

    </section>
  );
}
