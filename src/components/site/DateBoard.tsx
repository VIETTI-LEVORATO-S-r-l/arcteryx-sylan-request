import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/queries";
import { WeatherLine, WeatherFooter } from "@/components/site/Weather";
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
  return (
    <div>
      <div className="grid gap-px bg-border md:grid-cols-3">
        {dates.map((d) => {
          const f = formatDate(d.date);
          const leading = leadingDateId === d.id;
          const selected = selectedId === d.id;
          const Tag = selectable ? "button" : "div";
          return (
            <Tag
              key={d.id}
              {...(selectable
                ? { type: "button" as const, onClick: () => onSelect?.(d.id), "aria-pressed": selected }
                : {})}
              className={cn(
                "relative bg-background p-6 text-left transition-all duration-300 sm:p-8",
                selectable && "hover:bg-card focus:outline-none focus-visible:bg-card",
                selected && "jade-glow bg-card",
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
                      "display text-3xl tabular-nums",
                      leading ? "text-jade-soft" : "text-foreground",
                    )}
                  >
                    {d.pct}%
                  </div>
                  <div className="tech-sm mt-1">{d.count} REQ.</div>
                </div>
              </div>

              <div className="mt-6 h-px w-full bg-border">
                <div
                  className={cn("h-px transition-all duration-700", leading ? "bg-jade-soft" : "bg-muted-foreground")}
                  style={{ width: `${Math.max(d.pct, 1)}%` }}
                />
              </div>

              <div className="mt-4 flex min-h-4 items-center gap-3">
                {leading ? (
                  <span className="tech-sm border border-jade px-2 py-1 text-jade-soft">MOST REQUESTED</span>
                ) : null}
                {selectable ? (
                  <span className="tech-sm">{selected ? "SELECTED" : "SELECT AS PREFERRED"}</span>
                ) : (
                  <span className="tech-sm">{total > 0 ? "VOTING OPEN" : "AWAITING FIRST REQUESTS"}</span>
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
