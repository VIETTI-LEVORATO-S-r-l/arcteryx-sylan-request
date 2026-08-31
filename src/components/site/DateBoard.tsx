import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/queries";
import { WeatherLine, WeatherFooter } from "@/components/site/Weather";
import { useI18n } from "@/lib/i18n";
import type { DateStat } from "@/lib/types";

export function DateBoard({
  dates,
  leadingDateId,
  total,
  weatherEnabled,
  weatherUpdatedAt,
  selectable,
  selectedId,
  onSelect,
}: {
  dates: DateStat[];
  leadingDateId: string | null;
  total: number;
  weatherEnabled: boolean;
  weatherUpdatedAt: string | null;
  selectable?: boolean;
  selectedId?: string | null;
  onSelect?: (id: string) => void;
}) {
  const { t, lang } = useI18n();
  return (
    <div>
      <div className="grid gap-4 md:grid-cols-3">
        {dates.map((d) => {
          const f = formatDate(d.date, lang);
          const leading = leadingDateId === d.id;
          const selected = selectedId === d.id;
          const Tag = selectable ? "button" : "div";
          return (
            <Tag
              key={d.id}
              {...(selectable
                ? {
                    type: "button" as const,
                    onClick: () => onSelect?.(d.id),
                    "aria-pressed": selected,
                  }
                : {})}
              className={cn(
                "panel relative w-full p-5 text-left transition-all duration-300 sm:p-7",
                selectable &&
                  "panel-hover cursor-pointer active:scale-[0.99] focus:outline-none focus-visible:border-foreground",
                leading && "border-foreground/40",
                selected && "panel-raised border-2 border-foreground",
              )}
            >

              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="display text-5xl tabular-nums sm:text-6xl">{f.day}</div>
                  <div className="tech mt-2">
                    {f.month} {f.year}
                  </div>
                  <div className="tech-sm mt-1">{f.weekday}</div>
                </div>
                <div className="text-right">
                  <div
                    className={cn(
                      "display tabular-nums",
                      leading ? "text-4xl text-foreground" : "text-3xl text-muted-foreground",
                    )}
                  >
                    {d.pct}%
                  </div>

                  <div className="tech-sm mt-1">
                    {d.count} {t("dates.requests")}
                  </div>
                </div>
              </div>

              <div className="mt-6 h-1.5 w-full bg-muted">
                <div
                  className={cn(
                    "bar-grow h-1.5 transition-all duration-700",
                    leading ? "bg-foreground" : "bg-muted-foreground/60",
                  )}
                  style={{ width: `${Math.max(d.pct, 1)}%` }}
                />
              </div>

              <div className="mt-4 flex min-h-4 flex-wrap items-center gap-2">
                {leading ? <span className="badge badge-solid">{t("dates.leading")}</span> : null}

                {selectable ? (
                  <span
                    className={cn(
                      "tech-sm inline-flex items-center gap-2 transition-colors",
                      selected && "text-jade-soft",
                    )}
                  >
                    <span
                      className={cn(
                        "grid h-3.5 w-3.5 shrink-0 place-items-center border transition-all",
                        selected ? "border-jade bg-jade" : "border-border",
                      )}
                    >
                      {selected ? <span className="block h-1 w-1 bg-primary-foreground" /> : null}
                    </span>
                    {selected ? t("dates.selected") : t("dates.select")}
                  </span>
                ) : (
                  <span className="tech-sm">
                    {total > 0 ? t("dates.open") : t("dates.waiting")}
                  </span>
                )}
              </div>

              {weatherEnabled ? (
                <div className="mt-6 border-t border-border pt-4">
                  <WeatherLine w={d.weather} />
                </div>
              ) : null}
            </Tag>
          );
        })}
      </div>
      {weatherEnabled ? <WeatherFooter updatedAt={weatherUpdatedAt} /> : null}
    </div>
  );
}
