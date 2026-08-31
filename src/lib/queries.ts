import { queryOptions } from "@tanstack/react-query";
import { getEventData } from "./event.functions";

export const eventQueryOptions = queryOptions({
  queryKey: ["event"],
  queryFn: () => getEventData(),
  staleTime: 60_000,
});

export const DAY_NAMES = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
export const MONTHS = [
  "JANUARY",
  "FEBRUARY",
  "MARCH",
  "APRIL",
  "MAY",
  "JUNE",
  "JULY",
  "AUGUST",
  "SEPTEMBER",
  "OCTOBER",
  "NOVEMBER",
  "DECEMBER",
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
