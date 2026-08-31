import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";


export function SectionLabel({ index, children }: { index: string; children: ReactNode }) {
  return (
    <div className="section-sticky -mx-5 mb-8 border-b border-border px-5 py-3 sm:mx-0 sm:mb-12 sm:border-b-0 sm:border-t-2 sm:border-t-foreground sm:px-0 sm:pb-0 sm:pt-4">
      <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4">
        <span className="index-chip">{index}</span>
        <h2 className="tech truncate font-semibold tracking-technical text-foreground sm:whitespace-normal">
          {children}
        </h2>
      </div>
    </div>
  );
}


export function Spec({ label, value, mono }: { label: string; value: ReactNode; mono?: boolean }) {
  return (
    <div className="spec-row border-t border-border py-5">
      <div className="badge border-0 p-0">{label}</div>
      <div className={cn("display mt-3 text-3xl sm:text-4xl", mono && "tabular-nums")}>{value}</div>
    </div>
  );
}


export function Rule() {
  return <div className="h-px w-full bg-border" />;
}

export function TopoLines({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 800 400"
      className={cn("pointer-events-none absolute inset-0 h-full w-full opacity-[0.16]", className)}
      preserveAspectRatio="none"
    >
      {Array.from({ length: 9 }).map((_, i) => (
        <path
          key={i}
          d={`M0 ${60 + i * 34} C 160 ${10 + i * 34}, 300 ${140 + i * 26}, 480 ${70 + i * 30} S 720 ${20 + i * 32}, 800 ${90 + i * 28}`}
          fill="none"
          stroke="var(--jade)"
          strokeWidth="0.7"
        />
      ))}
    </svg>
  );
}

export function Field({
  label,
  hint,
  children,
  required,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  required?: boolean;
}) {
  const { t } = useI18n();
  return (
    <label className="block border-t border-border pt-4">
      <span className="tech-sm flex items-center gap-2">
        {label}
        {required ? (
          <span className="text-jade-soft">*</span>
        ) : (
          <span>{t("form.optionalTag")}</span>
        )}
      </span>
      <div className="mt-3">{children}</div>
      {hint ? <span className="tech-sm mt-2 block normal-case tracking-normal">{hint}</span> : null}
    </label>
  );
}


export const inputClass =
  "w-full min-h-11 border-0 border-b border-border bg-transparent px-0 pb-3 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-jade-soft";

export const selectClass = `${inputClass} appearance-none cursor-pointer`;

export function CheckRow({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  children: ReactNode;
}) {
  return (
    <label className="grid cursor-pointer grid-cols-[auto_minmax(0,1fr)] gap-4 border-t border-border py-4 transition-colors hover:bg-card/60">
      <span
        className={cn(
          "mt-0.5 grid h-4 w-4 shrink-0 place-items-center border transition-all",
          checked ? "border-jade bg-jade jade-glow" : "border-border",
        )}
      >
        {checked ? <span className="block h-1.5 w-1.5 bg-primary-foreground" /> : null}
      </span>
      <span className="text-xs leading-relaxed text-muted-foreground">{children}</span>
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
    </label>
  );
}

export function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className,
  ...rest
}: {
  children: ReactNode;
  delay?: number;
  as?: "div" | "section" | "article" | "header" | "footer";
  className?: string;
  [key: string]: unknown;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      className={cn("reveal", shown && "reveal-in", className)}
      style={{ transitionDelay: `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
