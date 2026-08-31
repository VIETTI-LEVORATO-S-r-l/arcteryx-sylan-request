import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Cloudy,
  Droplets,
  Sun,
  Thermometer,
  ThermometerSun,
  Umbrella,
  Wind,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatRomeDateTime } from "@/lib/queries";
import { useI18n } from "@/lib/i18n";
import type { DayWeather } from "@/lib/types";

/** Etichette WMO in inglese: la condizione arriva dal server in italiano. */
function conditionEn(code?: number): string {
  const c = code ?? 0;
  if (c === 0) return "CLEAR SKY";
  if (c <= 2) return "PARTLY CLOUDY";
  if (c === 3) return "OVERCAST";
  if (c === 45 || c === 48) return "FOG";
  if (c >= 51 && c <= 57) return "DRIZZLE";
  if (c >= 61 && c <= 67) return "RAIN";
  if (c >= 71 && c <= 77) return "SNOW";
  if (c >= 80 && c <= 82) return "RAIN SHOWERS";
  if (c >= 95) return "THUNDERSTORM";
  return "RAIN";
}

function useWeatherLabels() {
  const { lang, t } = useI18n();
  const en = lang === "en";
  return {
    lang,
    t,
    en,
    condition: (w: DayWeather) => (en ? conditionEn(w.code) : w.condition),
    l: {
      rain: en ? "RAIN" : "PIOGGIA",
      wind: en ? "WIND" : "VENTO",
      title: en ? "EVENT WEATHER" : "METEO DELL\u2019EVENTO",
      temp: en ? "TEMPERATURE" : "TEMPERATURA",
      apparent: en ? "FEELS LIKE" : "PERCEPITA",
      rainProb: en ? "PRECIPITATION PROBABILITY" : "PROBABILIT\u00c0 DI PIOGGIA",
      rainSum: en ? "EXPECTED PRECIPITATION" : "PRECIPITAZIONI PREVISTE",
      gusts: en ? "GUSTS" : "RAFFICHE",
      clouds: en ? "CLOUD COVER" : "COPERTURA NUVOLOSA",
      min: en ? "MIN" : "MIN",
      max: en ? "MAX" : "MAX",
      updated: en ? "LAST WEATHER UPDATE" : "ULTIMO AGGIORNAMENTO METEO",
      source: en
        ? "SOURCE \u2014 OPEN-METEO / ARONA, PIEDMONT, IT"
        : "FONTE \u2014 OPEN-METEO / ARONA, PIEMONTE, IT",
      soon: en
        ? "Weather data will appear automatically as the event approaches."
        : "I dati meteo compariranno automaticamente con l\u2019avvicinarsi dell\u2019evento.",
    },
  };
}

export const WEATHER_DISCLAIMER =
  "Le previsioni possono cambiare. Le condizioni finali dell'evento e le decisioni relative alla sicurezza restano soggette alla valutazione dell'organizzazione.";

export function WeatherIcon({ code, className }: { code?: number | undefined; className?: string }) {
  const c = code ?? 0;
  const Icon =
    c === 0
      ? Sun
      : c <= 2
        ? CloudSun
        : c === 3
          ? Cloud
          : c === 45 || c === 48
            ? CloudFog
            : c >= 51 && c <= 57
              ? CloudDrizzle
              : c >= 71 && c <= 77
                ? CloudSnow
                : c >= 95
                  ? CloudLightning
                  : CloudRain;
  return <Icon aria-hidden className={cn("h-5 w-5 text-jade-soft", className)} strokeWidth={1.5} />;
}

export function ConfidenceTag({ w }: { w: DayWeather }) {
  const { t } = useI18n();
  if (!w.confidence) return null;
  const label =
    w.confidence === "LOW"
      ? t("w.low")
      : w.confidence === "MEDIUM"
        ? t("w.medium")
        : t("w.high");
  const level = w.confidence === "HIGHER" ? 3 : w.confidence === "MEDIUM" ? 2 : 1;
  return (
    <span
      className={cn(
        "tech-sm inline-flex items-center gap-2 border px-2 py-1",
        w.confidence === "HIGHER"
          ? "border-jade text-jade-soft"
          : "border-border text-muted-foreground",
      )}
    >
      <span aria-hidden className="flex items-end gap-[2px]">
        {[1, 2, 3].map((i) => (
          <span
            key={i}
            className={cn(
              "w-[3px] bg-current",
              i === 1 ? "h-[5px]" : i === 2 ? "h-[8px]" : "h-[11px]",
              i > level && "opacity-25",
            )}
          />
        ))}
      </span>
      {label}
    </span>
  );
}

export function UnavailableWeather({ compact }: { compact?: boolean }) {
  const { t, l } = useWeatherLabels();
  return (
    <div>
      <span className="tech-sm">{t("w.unavailable")}</span>
      {compact ? null : (
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{l.soon}</p>
      )}
    </div>
  );
}

function Chip({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <span
      className="tech-sm inline-flex items-center gap-1.5 border border-border px-2 py-1 tabular-nums"
      title={label}
    >
      <Icon aria-hidden className="h-3.5 w-3.5 shrink-0 text-jade-soft" strokeWidth={1.5} />
      <span className="sr-only">{label}: </span>
      {value}
    </span>
  );
}

/** Riga meteo compatta usata nelle card delle date provvisorie. */
export function WeatherLine({ w }: { w: DayWeather }) {
  const { condition, l } = useWeatherLabels();
  if (!w.available) return <UnavailableWeather compact />;
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <WeatherIcon code={w.code} />
        <span className="tech-sm text-foreground">{condition(w)}</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        <Chip
          icon={Thermometer}
          label={l.temp}
          value={`${w.tempMin}° / ${w.tempMax}°C`}
        />
        <Chip icon={Umbrella} label={l.rainProb} value={`${w.precipitationProbability ?? 0}%`} />
        <Chip icon={Wind} label={l.wind} value={`${w.windMax ?? 0} KM/H`} />
      </div>
      <ConfidenceTag w={w} />
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  hint,
  bar,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
  bar?: number;
}) {
  return (
    <div className="border-t border-border pt-3">
      <div className="tech-sm flex items-center gap-2">
        <Icon aria-hidden className="h-3.5 w-3.5 shrink-0 text-jade-soft" strokeWidth={1.5} />
        {label}
      </div>
      <div className="display mt-2 text-2xl tabular-nums">{value}</div>
      {hint ? <div className="tech-sm mt-1 text-muted-foreground">{hint}</div> : null}
      {bar != null ? (
        <div className="mt-2 h-[3px] w-full bg-border" aria-hidden>
          <div
            className="h-full bg-jade-soft transition-[width] duration-700"
            style={{ width: `${Math.max(0, Math.min(100, bar))}%` }}
          />
        </div>
      ) : null}
    </div>
  );
}

/** Pannello prominente usato quando l'organizzazione conferma la data finale. */
export function EventWeatherPanel({
  w,
  updatedAt,
}: {
  w: DayWeather;
  updatedAt: string | null;
}) {
  const { condition, l } = useWeatherLabels();
  return (
    <div className="border border-border bg-card p-6 sm:p-8">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <h3 className="tech text-jade-soft">{l.title}</h3>
        <div className="flex shrink-0 items-center gap-3">
          <ConfidenceTag w={w} />
        </div>
      </div>

      {!w.available ? (
        <div className="mt-6">
          <UnavailableWeather />
        </div>
      ) : (
        <>
          <div className="mt-6 flex items-center gap-5">
            <WeatherIcon code={w.code} className="h-14 w-14 sm:h-16 sm:w-16" />
            <div className="min-w-0">
              <div className="display text-3xl sm:text-5xl">{condition(w)}</div>
              <div className="tech-sm mt-2 tabular-nums text-muted-foreground">
                {l.min} {w.tempMin}°C · {l.max} {w.tempMax}°C
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Metric
              icon={Thermometer}
              label={l.temp}
              value={`${w.tempMin}° / ${w.tempMax}°C`}
            />
            {w.apparentMax != null ? (
              <Metric
                icon={ThermometerSun}
                label={l.apparent}
                value={`${w.apparentMin}° / ${w.apparentMax}°C`}
              />
            ) : null}
            <Metric
              icon={Umbrella}
              label={l.rainProb}
              value={`${w.precipitationProbability ?? 0}%`}
              bar={w.precipitationProbability ?? 0}
            />
            <Metric icon={Droplets} label={l.rainSum} value={`${w.precipitationSum ?? 0} MM`} />
            <Metric
              icon={Wind}
              label={l.wind}
              value={`${w.windMax ?? 0} KM/H`}
              hint={`${l.gusts} ${w.windGusts ?? 0} KM/H`}
            />
            {w.cloudCover != null ? (
              <Metric
                icon={Cloudy}
                label={l.clouds}
                value={`${w.cloudCover}%`}
                bar={w.cloudCover}
              />
            ) : null}
          </div>
        </>
      )}

      <WeatherFooter updatedAt={updatedAt} />
    </div>
  );
}

export function WeatherFooter({ updatedAt }: { updatedAt: string | null }) {
  const { t, l, lang } = useWeatherLabels();
  return (
    <div className="mt-6 border-t border-border pt-4">
      {updatedAt ? (
        <div className="tech-sm">
          {l.updated} — {formatRomeDateTime(updatedAt, lang)} ({lang === "en" ? "ROME" : "ROMA"})
        </div>
      ) : null}
      <p className="prose-note mt-2 max-w-2xl">{t("w.disclaimer")}</p>
      <p className="tech-sm mt-2">{l.source}</p>
    </div>
  );
}
