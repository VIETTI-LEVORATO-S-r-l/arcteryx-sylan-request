import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { submitApplication } from "@/lib/event.functions";
import {
  DIETARY_PROFILES,
  LONGEST_RUN,
  MONTHLY_ELEVATION,
  PACE_RANGES,
  RUNNING_LEVELS,
  TRAIL_LEVELS,
  WEEKLY_VOLUME,
  type EventPayload,
} from "@/lib/types";
import { CheckRow, Field, inputClass, selectClass } from "./Primitives";
import { useI18n } from "@/lib/i18n";

function Step({ n, title, hint }: { n: string; title: string; hint?: string }) {
  return (
    <div className="mb-5 grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-3 border-t border-border pt-4">
      <span className="tech-sm text-jade-soft">{n}</span>
      <div className="min-w-0">
        <div className="tech text-foreground">{title}</div>
        {hint ? <div className="tech-sm mt-1 normal-case tracking-normal">{hint}</div> : null}
      </div>
    </div>
  );
}
import { DateBoard } from "./DateBoard";
import { formatDate } from "@/lib/queries";
import { cn } from "@/lib/utils";

type Consents = {
  isAdult: boolean;
  terrainAck: boolean;
  fitnessAck: boolean;
  rulesAck: boolean;
  noGuaranteeAck: boolean;
  privacyAck: boolean;
  marketingVietti: boolean;
  marketingArcteryx: boolean;
};

export function ApplicationForm({ data }: { data: EventPayload }) {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const submit = useServerFn(submitApplication);
  const [preferredDateId, setPreferredDateId] = useState<string | null>(
    data.event.finalDateId ?? null,
  );
  const [otherDateIds, setOtherDateIds] = useState<string[]>([]);
  const [consents, setConsents] = useState<Consents>({
    isAdult: false,
    terrainAck: false,
    fitnessAck: false,
    rulesAck: false,
    noGuaranteeAck: false,
    privacyAck: false,
    marketingVietti: false,
    marketingArcteryx: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [description, setDescription] = useState("");

  const setConsent = (k: keyof Consents) => (v: boolean) => setConsents((c) => ({ ...c, [k]: v }));

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (!preferredDateId) {
      setError(t("form.errDate"));
      return;
    }
    const required: (keyof Consents)[] = [
      "isAdult",
      "terrainAck",
      "fitnessAck",
      "rulesAck",
      "noGuaranteeAck",
      "privacyAck",
    ];
    if (required.some((k) => !consents[k])) {
      setError(t("form.errConsents"));
      return;
    }
    const fd = new FormData(e.currentTarget);
    const v = (k: string) => String(fd.get(k) ?? "").trim();
    setPending(true);
    try {
      const res = await submit({
        data: {
          firstName: v("firstName"),
          lastName: v("lastName"),
          email: v("email"),
          phone: v("phone"),
          city: v("city"),
          country: "",
          preferredDateId,
          otherDateIds,
          runningLevel: v("runningLevel"),
          trailExperience: v("trailExperience"),
          pace: v("pace"),
          weeklyVolume: v("weeklyVolume"),
          longestRun: v("longestRun"),
          monthlyElevation: v("monthlyElevation"),
          recentActivity: v("recentActivity"),
          dietaryProfile: v("dietaryProfile"),
          foodAllergies: v("foodAllergies"),
          shoeSizeSystem: v("shoeSizeSystem") as "EU" | "UK",
          shoeSize: v("shoeSize"),
          footwearFit: v("footwearFit") as "MEN'S" | "WOMEN'S",
          instagramHandle: v("instagramHandle"),
          runnerDescription: description.slice(0, 300),
          isAdult: true,
          terrainAck: true,
          fitnessAck: true,
          rulesAck: true,
          noGuaranteeAck: true,
          privacyAck: true,
          marketingVietti: consents.marketingVietti,
          marketingArcteryx: consents.marketingArcteryx,
          website: v("website"),
        },
      });
      if (!res.ok) {
        setError(res.error);
        setPending(false);
        return;
      }
      await navigate({ to: "/request-received" });
    } catch {
      setError(t("form.errGeneric"));
      setPending(false);
    }
  }

  if (!data.event.applicationsOpen) {
    return (
      <div className="border border-border p-8">
        <div className="tech mb-3 text-jade-soft">{t("form.closed")}</div>
        <p className="max-w-xl text-sm text-muted-foreground">{t("form.closedBody")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-10">
      {data.event.waitlistMode ? (
        <p className="border border-jade/60 p-4 text-xs text-jade-soft">
          {t("form.waitlist")}
        </p>
      ) : null}

      <div>
        <Step n="01" title={t("form.s1")} hint={t("form.s1h")} />
        <div className="grid gap-x-12 gap-y-6 sm:grid-cols-2">
          <Field label={t("form.firstName")} required>
            <input name="firstName" required maxLength={80} className={inputClass} />
          </Field>
          <Field label={t("form.lastName")} required>
            <input name="lastName" required maxLength={80} className={inputClass} />
          </Field>
          <Field label={t("form.email")} required>
            <input name="email" type="email" required maxLength={255} className={inputClass} />
          </Field>
          <Field label={t("form.phone")} required>
            <input name="phone" required maxLength={40} className={inputClass} />
          </Field>
          <Field label={t("form.city")} required>
            <input name="city" required maxLength={120} className={inputClass} />
          </Field>
          <Field label={t("form.instagram")}>
            <input name="instagramHandle" maxLength={60} placeholder="@" className={inputClass} />
          </Field>
        </div>
      </div>

      <div>
        <Step n="02" title={t("form.s2")} hint={t("form.s2h")} />
        <DateBoard
          dates={data.dates}
          leadingDateId={data.leadingDateId}
          total={data.total}
          weatherEnabled={false}
          weatherUpdatedAt={null}
          selectable
          selectedId={preferredDateId}
          onSelect={setPreferredDateId}
        />
      </div>

      <div>
        <Step n="03" title={t("form.s3")} hint={t("form.s3h")} />
        <div className="grid sm:grid-cols-3">
          {data.dates.map((d) => {
            const f = formatDate(d.date, lang);
            const checked = otherDateIds.includes(d.id);
            return (
              <CheckRow
                key={d.id}
                checked={checked}
                onChange={(v) =>
                  setOtherDateIds((prev) => (v ? [...prev, d.id] : prev.filter((x) => x !== d.id)))
                }
              >
                {f.day} {f.month}
              </CheckRow>
            );
          })}
        </div>
      </div>

      <div>
        <Step n="04" title={t("form.s4")} />
        <div className="grid gap-x-12 gap-y-6 sm:grid-cols-2">
          <Field label={t("form.trailLevel")} required>
            <select name="trailExperience" required className={selectClass} defaultValue="">
              <option value="" disabled>
                {t("form.select")}
              </option>
              {TRAIL_LEVELS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t("form.weeklyVolume")} required>
            <select name="weeklyVolume" required className={selectClass} defaultValue="">
              <option value="" disabled>
                {t("form.select")}
              </option>
              {WEEKLY_VOLUME.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t("form.longestRun")} required>
            <select name="longestRun" required className={selectClass} defaultValue="">
              <option value="" disabled>
                {t("form.select")}
              </option>
              {LONGEST_RUN.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t("form.sizeSystem")} required>
            <select name="shoeSizeSystem" required className={selectClass} defaultValue="EU">
              <option value="EU">EU</option>
              <option value="UK">UK</option>
            </select>
          </Field>
          <Field label={t("form.shoeSize")} required>
            <input name="shoeSize" required maxLength={10} className={inputClass} />
          </Field>
          <Field label={t("form.fit")} required>
            <select name="footwearFit" required className={selectClass} defaultValue="MEN'S">
              <option value="MEN'S">{t("form.fitMen")}</option>
              <option value="WOMEN'S">{t("form.fitWomen")}</option>
            </select>
          </Field>
        </div>
      </div>

      <Field label={t("form.description")} hint={`${description.length}/300`}>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value.slice(0, 300))}
          rows={4}
          maxLength={300}
          className={cn(inputClass, "resize-none")}
        />
      </Field>

      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="pointer-events-none absolute h-0 w-0 opacity-0"
      />

      <div>
        <Step
          n="05"
          title={t("form.s5")}
          hint={t("form.s5h")}
        />
        <div className="grid gap-x-12 gap-y-6 sm:grid-cols-2">
          <Field label={t("form.dietary")} required>
            <select name="dietaryProfile" required className={selectClass} defaultValue="">
              <option value="" disabled>
                {t("form.select")}
              </option>
              {DIETARY_PROFILES.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </Field>
          <Field
            label={t("form.allergies")}
            hint={t("form.allergiesHint")}
          >
            <input name="foodAllergies" maxLength={300} className={inputClass} />
          </Field>
        </div>
      </div>

      <div>
        <Step n="06" title={t("form.s6")} />
        <CheckRow checked={consents.isAdult} onChange={setConsent("isAdult")}>
          {t("form.c.adult")}
        </CheckRow>
        <CheckRow checked={consents.terrainAck} onChange={setConsent("terrainAck")}>
          {t("form.c.terrain")}
        </CheckRow>
        <CheckRow checked={consents.fitnessAck} onChange={setConsent("fitnessAck")}>
          {t("form.c.fitness")}
        </CheckRow>
        <CheckRow checked={consents.rulesAck} onChange={setConsent("rulesAck")}>
          {t("form.c.rulesA")}{" "}
          <a
            href="/regolamento"
            target="_blank"
            rel="noreferrer"
            className="text-jade-soft underline"
          >
            {t("form.c.rulesLink")}
          </a>{" "}
          {t("form.c.rulesB")}
        </CheckRow>
        <CheckRow checked={consents.noGuaranteeAck} onChange={setConsent("noGuaranteeAck")}>
          {t("form.c.noGuarantee")}
        </CheckRow>
        <CheckRow checked={consents.privacyAck} onChange={setConsent("privacyAck")}>
          {t("form.c.privacyA")}{" "}
          <a href="/privacy" target="_blank" rel="noreferrer" className="text-jade-soft underline">
            {t("form.c.privacyLink")}
          </a>{" "}
          {t("form.c.privacyB")}
        </CheckRow>

        <div className="tech-sm mt-8 mb-2">{t("form.optional")}</div>
        <CheckRow checked={consents.marketingVietti} onChange={setConsent("marketingVietti")}>
          {t("form.c.mkVietti")}
        </CheckRow>
        <CheckRow checked={consents.marketingArcteryx} onChange={setConsent("marketingArcteryx")}>
          {t("form.c.mkArcteryx")}
          <span className="block opacity-60">{t("form.c.mkNote")}</span>
        </CheckRow>
      </div>

      {error ? (
        <p
          role="alert"
          className="border-l-2 border-destructive bg-card p-4 text-xs leading-relaxed text-destructive"
        >
          {error}
        </p>
      ) : null}

      <div className="flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="tech-sm max-w-md normal-case tracking-normal">
          {t("form.disclaimer")}
        </p>
        <button
          type="submit"
          disabled={pending}
          className="cta cta-solid w-full disabled:pointer-events-none disabled:opacity-50 sm:w-auto"
        >
          {pending ? t("form.submitting") : t("form.submit")}
          <span className="cta-arrow" aria-hidden>
            →
          </span>
        </button>
      </div>
    </form>
  );
}
