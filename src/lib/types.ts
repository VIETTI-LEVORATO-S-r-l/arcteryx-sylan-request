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
    latitude: number;
    longitude: number;
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
  "Corro per passione, saltuariamente",
  "Corro con regolarità",
  "Trail runner esperto",
  "Trail runner avanzato",
] as const;

export const TRAIL_LEVELS = [
  "Prima esperienza di trail running",
  "Occasionale",
  "Regolare",
  "Esperto",
] as const;

export const PACE_RANGES = [
  "Meno di 4:30 min/km",
  "4:30 – 5:15 min/km",
  "5:15 – 6:00 min/km",
  "6:00 – 7:00 min/km",
  "Oltre 7:00 min/km",
] as const;

export const WEEKLY_VOLUME = [
  "Meno di 15 km a settimana",
  "15 – 30 km a settimana",
  "30 – 50 km a settimana",
  "50 – 80 km a settimana",
  "Oltre 80 km a settimana",
] as const;

export const LONGEST_RUN = [
  "Fino a 10 km",
  "10 – 20 km",
  "20 – 30 km",
  "Oltre 30 km",
] as const;

export const MONTHLY_ELEVATION = [
  "Meno di 500 m D+ al mese",
  "500 – 1500 m D+ al mese",
  "1500 – 3000 m D+ al mese",
  "Oltre 3000 m D+ al mese",
] as const;

export const DIETARY_PROFILES = [
  "Nessuna esigenza particolare",
  "Vegetariano",
  "Vegano",
  "Senza glutine",
  "Senza lattosio",
  "Altro (specificare)",
] as const;

export const WEATHER_CODES: Record<number, string> = {
  0: "Sereno",
  1: "Prevalentemente sereno",
  2: "Parzialmente nuvoloso",
  3: "Coperto",
  45: "Nebbia",
  48: "Nebbia con brina",
  51: "Pioviggine leggera",
  53: "Pioviggine",
  55: "Pioviggine intensa",
  61: "Pioggia debole",
  63: "Pioggia",
  65: "Pioggia forte",
  71: "Neve debole",
  73: "Neve",
  75: "Neve intensa",
  80: "Rovesci",
  81: "Rovesci",
  82: "Rovesci violenti",
  95: "Temporale",
  96: "Temporale con grandine",
  99: "Temporale con grandine",
};

/**
 * Etichette inglesi per i valori dei select.
 * Il valore inviato resta sempre quello italiano, così admin e CSV non cambiano.
 */
export const OPTION_LABELS_EN: Record<string, string> = {
  // TRAIL_LEVELS
  "Prima esperienza di trail running": "First trail running experience",
  Occasionale: "Occasional",
  Regolare: "Regular",
  Esperto: "Experienced",
  // WEEKLY_VOLUME
  "Meno di 15 km a settimana": "Less than 15 km per week",
  "15 – 30 km a settimana": "15 – 30 km per week",
  "30 – 50 km a settimana": "30 – 50 km per week",
  "50 – 80 km a settimana": "50 – 80 km per week",
  "Oltre 80 km a settimana": "More than 80 km per week",
  // LONGEST_RUN
  "Fino a 10 km": "Up to 10 km",
  "10 – 20 km": "10 – 20 km",
  "20 – 30 km": "20 – 30 km",
  "Oltre 30 km": "More than 30 km",
  // DIETARY_PROFILES
  "Nessuna esigenza particolare": "No particular requirement",
  Vegetariano: "Vegetarian",
  Vegano: "Vegan",
  "Senza glutine": "Gluten free",
  "Senza lattosio": "Lactose free",
  "Altro (specificare)": "Other (please specify)",
};

export function optionLabel(value: string, lang: "it" | "en") {
  return lang === "en" ? (OPTION_LABELS_EN[value] ?? value) : value;
}

function halfSteps(from: number, to: number) {
  const out: string[] = [];
  for (let v = from * 2; v <= to * 2; v++) {
    out.push(v % 2 === 0 ? String(v / 2) : `${Math.floor(v / 2)}.5`);
  }
  return out;
}

export const SHOE_SIZES: Record<"EU" | "UK", string[]> = {
  EU: halfSteps(35, 48),
  UK: halfSteps(2, 13),
};

/** Codici di errore restituiti da submitApplication, tradotti lato client. */
export type SubmitErrorCode =
  | "INVALID_SUBMISSION"
  | "EVENT_UNAVAILABLE"
  | "APPLICATIONS_CLOSED"
  | "MAX_APPLICATIONS"
  | "DUPLICATE_EMAIL"
  | "RATE_LIMITED"
  | "SAVE_FAILED";
