export interface CurrentWeather {
  temperature: number;
  apparentTemperature: number;
  weatherCode: number;
  weatherText: string;
  iconName: string;
  windSpeed: number;
  windDirection: number;
  windName: string;
  humidity: number;
  time: string;
}

export interface MarineData {
  seaTemperature: number | null;
  waveHeight: number | null;
  seaComfortText: string;
  hasSeaData: boolean;
}

export interface DailyForecast {
  date: string;
  dayName: string;
  weatherCode: number;
  weatherText: string;
  iconName: string;
  tempMax: number;
  tempMin: number;
  uvIndex: number;
  sunrise: string;
  sunset: string;
}

export interface WeatherData {
  current: CurrentWeather;
  marine: MarineData;
  daily: DailyForecast[];
  locationName: string;
  touristTip: string;
}

// Map WMO Weather Codes to human readable descriptions & Lucide icon identifiers
export function mapWeatherCode(code: number, isEn: boolean = false): { text: string; icon: string } {
  switch (code) {
    case 0:
      return { text: isEn ? 'Clear sky' : 'Vedro i sunčano', icon: 'Sun' };
    case 1:
      return { text: isEn ? 'Mainly clear' : 'Pretežno sunčano', icon: 'Sun' };
    case 2:
      return { text: isEn ? 'Partly cloudy' : 'Djelomično oblačno', icon: 'CloudSun' };
    case 3:
      return { text: isEn ? 'Overcast' : 'Oblačno', icon: 'Cloud' };
    case 45:
    case 48:
      return { text: isEn ? 'Fog' : 'Magla', icon: 'CloudFog' };
    case 51:
    case 53:
    case 55:
      return { text: isEn ? 'Drizzle' : 'Slaba rosulja', icon: 'CloudDrizzle' };
    case 61:
    case 63:
    case 65:
      return { text: isEn ? 'Rain' : 'Kiša', icon: 'CloudRain' };
    case 66:
    case 67:
      return { text: isEn ? 'Freezing rain' : 'Hladna kiša', icon: 'CloudRain' };
    case 71:
    case 73:
    case 75:
    case 77:
      return { text: isEn ? 'Snow' : 'Snijeg', icon: 'CloudSnow' };
    case 80:
    case 81:
    case 82:
      return { text: isEn ? 'Rain showers' : 'Lokalni pljuskovi', icon: 'CloudRain' };
    case 95:
    case 96:
    case 99:
      return { text: isEn ? 'Thunderstorm' : 'Grmljavinsko nevrijeme', icon: 'CloudLightning' };
    default:
      return { text: isEn ? 'Partly sunny' : 'Djelomično sunčano', icon: 'CloudSun' };
  }
}

// Convert wind direction degrees to traditional Adriatic wind names
export function getAdriaticWindName(degrees: number, isEn: boolean = false): string {
  if (degrees >= 337.5 || degrees < 22.5) {
    return isEn ? 'Tramontana (N)' : 'Tramontana (Sjeverac)';
  } else if (degrees >= 22.5 && degrees < 67.5) {
    return isEn ? 'Bura (NE)' : 'Bura (SV)';
  } else if (degrees >= 67.5 && degrees < 112.5) {
    return isEn ? 'Levant (E)' : 'Levant (Istočnjak)';
  } else if (degrees >= 112.5 && degrees < 157.5) {
    return isEn ? 'Jugo / Šiloko (SE)' : 'Jugo (JI)';
  } else if (degrees >= 157.5 && degrees < 202.5) {
    return isEn ? 'Oštro (S)' : 'Oštro (Južnjak)';
  } else if (degrees >= 202.5 && degrees < 247.5) {
    return isEn ? 'Lebić / Garbin (SW)' : 'Lebić / Garbin (JZ)';
  } else if (degrees >= 247.5 && degrees < 292.5) {
    return isEn ? 'Pulenat (W)' : 'Pulenat (Zapadnjak)';
  } else {
    return isEn ? 'Maestral (NW)' : 'Maestral (SZ)';
  }
}

// Sea temperature comfort assessment for tourists
export function getSeaComfortAssessment(seaTemp: number | null, isEn: boolean = false): string {
  if (seaTemp === null) return '';
  if (seaTemp >= 24) {
    return isEn ? 'Warm sea, perfect for swimming and all water sports.' : 'Toplo more, savršeno za dugo kupanje i obitelji s djecom.';
  } else if (seaTemp >= 21) {
    return isEn ? 'Pleasant & refreshing sea, great for beach recreation.' : 'Ugodno i osvježavajuće more, idealno za plivanje.';
  } else if (seaTemp >= 18) {
    return isEn ? 'Fresh sea, suitable for active swimmers.' : 'Svježe more, pogodno za aktivne plivače i vodene sportove.';
  } else {
    return isEn ? 'Cool sea, best for walking along the coast and sea breeze.' : 'Hladno more, preporučuje se šetnja uz obalu i morski zrak.';
  }
}

// Generate an automated tourist tip for the day
export function generateTouristTip(temp: number, weatherCode: number, seaTemp: number | null, isEn: boolean = false): string {
  if (weatherCode >= 61 && weatherCode <= 99) {
    return isEn
      ? 'Rain is in the forecast. Excellent time to visit local museums, historical galleries, and traditional taverns!'
      : 'Prognozirana je kiša. Izvrsna prilika za obilazak lokalnih muzeja, povijesnih znamenitosti i uživanje u konobama!';
  }

  if (seaTemp && seaTemp >= 20 && temp >= 22) {
    return isEn
      ? 'Perfect beach weather! Enjoy the crystal clear Adriatic sea and protect yourself with sunscreen during midday.'
      : 'Savršen dan za plažu! Uživajte u kristalno čistom moru, a oko podneva potražite hladovinu borova.';
  }

  if (temp >= 25) {
    return isEn
      ? 'Warm and sunny day. Ideal for exploring coastal viewpoints, boat excursions, and evening walks.'
      : 'Topao i sunčan dan. Idealan za posjet vidikovcima, izlete brodom i večernju šetnju uz obalu.';
  }

  return isEn
    ? 'Pleasant weather for sightseeing, outdoor walks, cycling, and discovering local gastronomic delights.'
    : 'Ugodno vrijeme za razgledavanje kulturne baštine, šetnju prirodom i otkrivanje lokalne gastronomije.';
}

const HR_DAYS = ['Nedjelja', 'Ponedjeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak', 'Subota'];
const EN_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export async function getWeatherAndMarineData(
  lat: number, 
  lng: number, 
  locationName: string,
  isEn: boolean = false
): Promise<WeatherData | null> {
  // Validate coordinates
  if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
    return null;
  }

  try {
    // 1. Fetch Open-Meteo Weather Forecast (SSR with Next.js 30min ISR cache)
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,relative_humidity_2m&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max,sunrise,sunset&timezone=Europe%2FBerlin&forecast_days=7`;
    
    // 2. Fetch Open-Meteo Marine (Sea temperature & waves)
    const marineUrl = `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lng}&current=wave_height,wave_direction,wave_period&hourly=sea_surface_temperature&timezone=Europe%2FBerlin`;

    const [weatherRes, marineRes] = await Promise.all([
      fetch(weatherUrl, { next: { revalidate: 1800 } }).then(r => r.ok ? r.json() : null).catch(() => null),
      fetch(marineUrl, { next: { revalidate: 1800 } }).then(r => r.ok ? r.json() : null).catch(() => null),
    ]);

    if (!weatherRes || !weatherRes.current) {
      return null;
    }

    const current = weatherRes.current;
    const dailyData = weatherRes.daily;

    const weatherInfo = mapWeatherCode(current.weather_code, isEn);
    const windName = getAdriaticWindName(current.wind_direction_10m, isEn);

    // Parse Marine Data
    let seaTemp: number | null = null;
    let waveHeight: number | null = null;

    if (marineRes) {
      if (marineRes.current && typeof marineRes.current.wave_height === 'number') {
        waveHeight = Math.round(marineRes.current.wave_height * 10) / 10;
      }
      if (marineRes.hourly && Array.isArray(marineRes.hourly.sea_surface_temperature)) {
        // Find first non-null temperature for today
        const validTemps = marineRes.hourly.sea_surface_temperature.filter((t: any) => typeof t === 'number' && !isNaN(t));
        if (validTemps.length > 0) {
          seaTemp = Math.round(validTemps[0] * 10) / 10;
        }
      }
    }

    const hasSeaData = seaTemp !== null && seaTemp > 0;
    const seaComfortText = getSeaComfortAssessment(seaTemp, isEn);

    // Build 7-day forecast
    const daily: DailyForecast[] = [];
    if (dailyData && Array.isArray(dailyData.time)) {
      for (let i = 0; i < dailyData.time.length; i++) {
        const dStr = dailyData.time[i];
        const dObj = new Date(dStr + 'T00:00:00');
        const dayIdx = dObj.getDay();
        const dayName = i === 0 ? (isEn ? 'Today' : 'Danas') : (isEn ? EN_DAYS[dayIdx] : HR_DAYS[dayIdx]);
        const dCode = dailyData.weather_code[i] ?? 0;
        const dInfo = mapWeatherCode(dCode, isEn);

        daily.push({
          date: dStr,
          dayName,
          weatherCode: dCode,
          weatherText: dInfo.text,
          iconName: dInfo.icon,
          tempMax: Math.round(dailyData.temperature_2m_max[i] ?? 0),
          tempMin: Math.round(dailyData.temperature_2m_min[i] ?? 0),
          uvIndex: Math.round((dailyData.uv_index_max[i] ?? 0) * 10) / 10,
          sunrise: dailyData.sunrise[i] ? dailyData.sunrise[i].split('T')[1] : '',
          sunset: dailyData.sunset[i] ? dailyData.sunset[i].split('T')[1] : '',
        });
      }
    }

    const currentTemp = Math.round(current.temperature_2m);
    const touristTip = generateTouristTip(currentTemp, current.weather_code, seaTemp, isEn);

    return {
      current: {
        temperature: currentTemp,
        apparentTemperature: Math.round(current.apparent_temperature),
        weatherCode: current.weather_code,
        weatherText: weatherInfo.text,
        iconName: weatherInfo.icon,
        windSpeed: Math.round(current.wind_speed_10m),
        windDirection: current.wind_direction_10m,
        windName,
        humidity: Math.round(current.relative_humidity_2m),
        time: current.time,
      },
      marine: {
        seaTemperature: seaTemp,
        waveHeight,
        seaComfortText,
        hasSeaData,
      },
      daily,
      locationName,
      touristTip,
    };
  } catch (error) {
    console.error(`[Weather] Error fetching weather for ${locationName}:`, error);
    return null;
  }
}
