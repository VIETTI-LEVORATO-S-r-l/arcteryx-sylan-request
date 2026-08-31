import { WEATHER_CODES, type DayWeather } from "./types";

/**
 * Open-Meteo daily forecast. Only returns data for dates inside the reliable
 * forecast horizon; otherwise the date is marked unavailable so the UI can show
 * "FORECAST AVAILABLE CLOSER TO THE EVENT". Never returns climatology as forecast.
 */
export async function fetchWeather(
  lat: number,
  lon: number,
  dates: string[],
): Promise<Record<string, DayWeather>> {
  const result: Record<string, DayWeather> = {};
  for (const d of dates) result[d] = { available: false };
  if (!dates.length) return result;

  const horizon = new Date();
  horizon.setDate(horizon.getDate() + 15);
  const inRange = dates.filter((d) => new Date(d) <= horizon && new Date(d) >= new Date(Date.now() - 864e5));
  if (!inRange.length) return result;

  try {
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max` +
      `&timezone=Europe%2FRome&forecast_days=16`;
    const res = await fetch(url);
    if (!res.ok) return result;
    const json = (await res.json()) as {
      daily?: {
        time: string[];
        weather_code: number[];
        temperature_2m_max: number[];
        temperature_2m_min: number[];
        precipitation_probability_max: (number | null)[];
        wind_speed_10m_max: number[];
      };
    };
    const daily = json.daily;
    if (!daily) return result;
    daily.time.forEach((t, i) => {
      if (!(t in result)) return;
      const code = daily.weather_code[i] ?? 0;
      result[t] = {
        available: true,
        code,
        condition: WEATHER_CODES[code] ?? "—",
        tempMax: Math.round(daily.temperature_2m_max[i] ?? 0),
        tempMin: Math.round(daily.temperature_2m_min[i] ?? 0),
        precipitationProbability: daily.precipitation_probability_max[i] ?? undefined,
        windMax: Math.round(daily.wind_speed_10m_max[i] ?? 0),
      };
    });
  } catch {
    return result;
  }
  return result;
}
