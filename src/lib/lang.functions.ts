import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import type { Lang } from "./i18n";

/**
 * Lingua iniziale usata per l'SSR (attributo <html lang> e primo render):
 * derivata dall'header Accept-Language. Lato client la lingua salvata
 * dall'utente ha comunque la precedenza (vedi LangProvider).
 */
export const getInitialLang = createServerFn({ method: "GET" }).handler(async (): Promise<Lang> => {
  const header = getRequestHeader("accept-language") ?? "";
  const first = header.split(",")[0]?.trim().toLowerCase() ?? "";
  if (!first) return "it";
  return first.startsWith("it") ? "it" : "en";
});
