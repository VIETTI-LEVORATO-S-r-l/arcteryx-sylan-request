import { queryOptions } from "@tanstack/react-query";
import { getEventData } from "./event.functions";

export const eventQueryOptions = queryOptions({
  queryKey: ["event"],
  queryFn: () => getEventData(),
  staleTime: 60_000,
  // Aggiornamento meteo: almeno ogni 3 ore, più al ritorno sulla scheda.
  refetchInterval: 3 * 60 * 60 * 1000,
  refetchIntervalInBackground: false,
  refetchOnWindowFocus: true,
});

export const ROME_TZ = "Europe/Rome";

export function formatRomeDateTime(iso: string) {
  return new Intl.DateTimeFormat("it-IT", {
    timeZone: ROME_TZ,
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
    .format(new Date(iso))
    .toUpperCase();
}

export const DAY_NAMES = [
  "DOMENICA",
  "LUNEDÌ",
  "MARTEDÌ",
  "MERCOLEDÌ",
  "GIOVEDÌ",
  "VENERDÌ",
  "SABATO",
];
export const MONTHS = [
  "GENNAIO",
  "FEBBRAIO",
  "MARZO",
  "APRILE",
  "MAGGIO",
  "GIUGNO",
  "LUGLIO",
  "AGOSTO",
  "SETTEMBRE",
  "OTTOBRE",
  "NOVEMBRE",
  "DICEMBRE",
];

export function formatDate(iso: string) {
  const d = new Date(`${iso}T12:00:00`);
  return {
    day: String(d.getDate()).padStart(2, "0"),
    month: MONTHS[d.getMonth()]!,
    weekday: DAY_NAMES[d.getDay()]!,
    year: d.getFullYear(),
    long: `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`,
  };
}
