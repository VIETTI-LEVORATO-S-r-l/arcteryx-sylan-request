export type WeatherConfidence = "LOW" | "MEDIUM" | "HIGHER";

export type DayWeather = {
  available: boolean;
  confidence?: WeatherConfidence | undefined;
  apparentMin?: number | undefined;
  apparentMax?: number | undefined;
  precipitationSum?: number | undefined;
  windGusts?: number | undefined;
  cloudCover?: number | undefined;
  tempMin?: number | undefined;
  tempMax?: number | undefined;
  precipitationProbability?: number | undefined;
  windMax?: number | undefined;
  code?: number | undefined;
  condition?: string | undefined;
};

export type DateStat = {
  id: string;
  date: string;
  count: number;
  pct: number;
  weather: DayWeather;
};

export type EventPayload = {
  event: {
    id: string;
    title: string;
    location: string;
    meetingPoint: string;
    meetingTime: string;
    distanceKm: string;
    elevationM: string;
    surface: string;
    routeNotes: string;
    weatherEnabled: boolean;
    applicationsOpen: boolean;
    waitlistMode: boolean;
    capacity: number;
    maxApplications: number;
    finalDateId: string | null;
    privacyVersion: string;
  };
  dates: DateStat[];
  total: number;
  leadingDateId: string | null;
  weatherUpdatedAt: string | null;
};

export const RUNNING_LEVELS = [
  "Recreational runner",
  "Regular runner",
  "Experienced trail runner",
  "Competitive / advanced trail runner",
] as const;

export const TRAIL_LEVELS = [
  "New to trail running",
  "Occasional",
  "Regular",
  "Experienced",
] as const;

export const PACE_RANGES = [
  "Under 4:30 min/km",
  "4:30 – 5:15 min/km",
  "5:15 – 6:00 min/km",
  "6:00 – 7:00 min/km",
  "Over 7:00 min/km",
] as const;

export const WEATHER_CODES: Record<number, string> = {
  0: "Clear",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Rime fog",
  51: "Light drizzle",
  53: "Drizzle",
  55: "Dense drizzle",
  61: "Light rain",
  63: "Rain",
  65: "Heavy rain",
  71: "Light snow",
  73: "Snow",
  75: "Heavy snow",
  80: "Rain showers",
  81: "Rain showers",
  82: "Violent showers",
  95: "Thunderstorm",
  96: "Thunderstorm / hail",
  99: "Thunderstorm / hail",
};
