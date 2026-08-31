import { WEATHER_CODES, type DayWeather, type WeatherConfidence } from "./types";

/**
 * Open-Meteo weather for Arona, Piedmont, Italy (Lake Maggiore).
 * Coordinates are resolved through Open-Meteo geocoding, with a static
 * fallback. Timezone Europe/Rome, metric units (°C / mm / km/h).
 *
 * Only dates inside the provider's supported forecast horizon (16 days)
 * return data. Anything beyond is marked unavailable so the UI can show
 * "FORECAST AVAILABLE CLOSER TO THE EVENT". Nothing is ever estimated.
 */

export const FORECAST_HORIZON_DAYS = 16;
const ARONA_FALLBACK = { lat: 45.7597, lon: 8.5556 };

let cachedCoords: { lat: number; lon: number } | null = null;

export async function resolveAronaCoords(): Promise<{ lat: number; lon: number }> {
  if (cachedCoords) return cachedCoords;
  try {
    const res = await fetch(
      "https://geocoding-api.open-meteo.com/v1/search?name=Arona&count=10&language=en&format=json&countryCode=IT",
    );
    if (res.ok) {
      const json = (await res.json()) as {
        results?: { latitude: number; longitude: number; admin1?: string; country_code?: string }[];
      };
      const hit =
        json.results?.find(
          (r) => r.country_code === "IT" && (r.admin1 ?? "").toLowerCase().includes("piedmont"),
        ) ?? json.results?.find((r) => r.country_code === "IT");
      if (hit) {
        cachedCoords = { lat: hit.latitude, lon: hit.longitude };
        return cachedCoords;
      }
    }
  } catch {
    /* fall through to static coordinates */
  }
  cachedCoords = ARONA_FALLBACK;
  return cachedCoords;
}

function daysUntil(iso: string): number {
  const today = new Date(`${new Date().toISOString().slice(0, 10)}T00:00:00Z`).getTime();
  const target = new Date(`${iso}T00:00:00Z`).getTime();
  return Math.round((target - today) / 864e5);
}

function confidenceFor(days: number): WeatherConfidence {
  if (days > 10) return "LOW";
  if (days > 5) return "MEDIUM";
  return "HIGHER";
}

const num = (v: number | null | undefined) => (v == null ? undefined : v);
const round = (v: number | null | undefined) => (v == null ? undefined : Math.round(v));

export async function fetchWeather(
  _lat: number,
  _lon: number,
  dates: string[],
): Promise<Record<string, DayWeather>> {
  const result: Record<string, DayWeather> = {};
  for (const d of dates) result[d] = { available: false, confidence: confidenceFor(daysUntil(d)) };
  if (!dates.length) return result;

  const inRange = dates.filter((d) => {
    const n = daysUntil(d);
    return n >= 0 && n < FORECAST_HORIZON_DAYS;
  });
  if (!inRange.length) return result;

  const { lat, lon } = await resolveAronaCoords();

  try {
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
      "&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max," +
      "apparent_temperature_min,precipitation_probability_max,precipitation_sum," +
      "wind_speed_10m_max,wind_gusts_10m_max,cloud_cover_mean" +
      "&temperature_unit=celsius&wind_speed_unit=kmh&precipitation_unit=mm" +
      `&timezone=Europe%2FRome&forecast_days=${FORECAST_HORIZON_DAYS}`;
    const res = await fetch(url);
    if (!res.ok) return result;
    const json = (await res.json()) as {
      daily?: Record<string, (number | null)[]> & { time: string[] };
    };
    const daily = json.daily;
    if (!daily) return result;

    daily.time.forEach((t, i) => {
      if (!(t in result)) return;
      const code = daily["weather_code"]?.[i] ?? 0;
      result[t] = {
        available: true,
        code,
        condition: WEATHER_CODES[code] ?? "—",
        tempMax: round(daily["temperature_2m_max"]?.[i]),
        tempMin: round(daily["temperature_2m_min"]?.[i]),
        apparentMax: round(daily["apparent_temperature_max"]?.[i]),
        apparentMin: round(daily["apparent_temperature_min"]?.[i]),
        precipitationProbability: num(daily["precipitation_probability_max"]?.[i]),
        precipitationSum: num(daily["precipitation_sum"]?.[i]),
        windMax: round(daily["wind_speed_10m_max"]?.[i]),
        windGusts: round(daily["wind_gusts_10m_max"]?.[i]),
        cloudCover: round(daily["cloud_cover_mean"]?.[i]),
        confidence: confidenceFor(daysUntil(t)),
      };
    });
  } catch {
    return result;
  }
  return result;
}
