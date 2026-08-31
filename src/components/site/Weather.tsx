import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Sun,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatRomeDateTime } from "@/lib/queries";
import type { DayWeather } from "@/lib/types";

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
  if (!w.confidence) return null;
  const label =
    w.confidence === "LOW"
      ? "AFFIDABILITÀ BASSA"
      : w.confidence === "MEDIUM"
        ? "AFFIDABILITÀ MEDIA"
        : "AFFIDABILITÀ ALTA";
  return (
    <span
      className={cn(
        "tech-sm border px-2 py-1",
        w.confidence === "HIGHER"
          ? "border-jade text-jade-soft"
          : "border-border text-muted-foreground",
      )}
    >
      {label}
    </span>
  );
}

export function UnavailableWeather({ compact }: { compact?: boolean }) {
  return (
    <div>
      <span className="tech-sm">PREVISIONI DISPONIBILI PIÙ VICINO ALLA DATA DELL&rsquo;EVENTO</span>
      {compact ? null : (
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          I dati meteo compariranno automaticamente con l&rsquo;avvicinarsi dell&rsquo;evento.
        </p>
      )}
    </div>
  );
}

/** Riga meteo compatta usata nelle card delle date provvisorie. */
export function WeatherLine({ w }: { w: DayWeather }) {
  if (!w.available) return <UnavailableWeather compact />;
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <WeatherIcon code={w.code} />
        <span className="tech-sm text-foreground">{w.condition}</span>
      </div>
      <div className="tech-sm flex flex-wrap gap-x-4 gap-y-1 tabular-nums">
        <span>
          {w.tempMin}° / {w.tempMax}°C
        </span>
        <span>PIOGGIA {w.precipitationProbability ?? 0}%</span>
        <span>VENTO {w.windMax ?? 0} KM/H</span>
      </div>
      <ConfidenceTag w={w} />
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-border pt-3">
      <div className="tech-sm">{label}</div>
      <div className="display mt-2 text-2xl tabular-nums">{value}</div>
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
  return (
    <div className="border border-border bg-card p-6 sm:p-8">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <h3 className="tech text-jade-soft">METEO DELL&rsquo;EVENTO</h3>
        <div className="flex shrink-0 items-center gap-3">
          <WeatherIcon code={w.code} className="h-6 w-6" />
          <ConfidenceTag w={w} />
        </div>
      </div>

      {!w.available ? (
        <div className="mt-6">
          <UnavailableWeather />
        </div>
      ) : (
        <>
          <div className="display mt-6 text-4xl sm:text-5xl">{w.condition}</div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Metric label="TEMPERATURA" value={`${w.tempMin}° / ${w.tempMax}°C`} />
            {w.apparentMax != null ? (
              <Metric label="PERCEPITA" value={`${w.apparentMin}° / ${w.apparentMax}°C`} />
            ) : null}
            <Metric label="PROBABILITÀ DI PIOGGIA" value={`${w.precipitationProbability ?? 0}%`} />
            <Metric label="PRECIPITAZIONI PREVISTE" value={`${w.precipitationSum ?? 0} MM`} />
            <Metric label="VENTO" value={`${w.windMax ?? 0} KM/H`} />
            <Metric label="RAFFICHE" value={`${w.windGusts ?? 0} KM/H`} />
            {w.cloudCover != null ? (
              <Metric label="COPERTURA NUVOLOSA" value={`${w.cloudCover}%`} />
            ) : null}
          </div>
        </>
      )}

      <WeatherFooter updatedAt={updatedAt} />
    </div>
  );
}

export function WeatherFooter({ updatedAt }: { updatedAt: string | null }) {
  return (
    <div className="mt-6 border-t border-border pt-4">
      {updatedAt ? (
        <div className="tech-sm">
          ULTIMO AGGIORNAMENTO METEO — {formatRomeDateTime(updatedAt)} (ROMA)
        </div>
      ) : null}
      <p className="mt-2 max-w-2xl text-xs leading-relaxed text-muted-foreground">
        {WEATHER_DISCLAIMER}
      </p>
      <p className="tech-sm mt-2">FONTE — OPEN-METEO / ARONA, PIEMONTE, IT</p>
    </div>
  );
}
