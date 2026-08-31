import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getConfirmationContext, submitConfirmation } from "@/lib/confirm.functions";
import { CheckRow, Field, inputClass, selectClass } from "@/components/site/Primitives";
import { DIETARY_PROFILES, optionLabel } from "@/lib/types";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/confirm/$token")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Conferma partecipazione — Sylan 2 Community Trail Run" },
      {
        name: "description",
        content:
          "Conferma il tuo posto alla Community Trail Run Arc'teryx × VIETTI Sylan 2 sul Lago Maggiore.",
      },
      { property: "og:title", content: "Conferma partecipazione — Sylan 2 Community Trail Run" },
      {
        property: "og:description",
        content: "Conferma il tuo posto alla Sylan 2 Community Trail Run.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Confirm,
});

function Confirm() {
  const { token } = Route.useParams();
  const { t, lang } = useI18n();
  const getCtx = useServerFn(getConfirmationContext);
  const submit = useServerFn(submitConfirmation);
  const [ctx, setCtx] = useState<Awaited<ReturnType<typeof getConfirmationContext>> | null>(null);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [acks, setAcks] = useState({ attending: false, rules: false, image: false, dietary: false });

  useEffect(() => {
    getCtx({ data: { token } })
      .then(setCtx)
      .catch(() => setError(t("cf.invalid")));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (error && !ctx)
    return (
      <Shell>
        <p className="text-sm text-muted-foreground">{error}</p>
      </Shell>
    );
  if (!ctx)
    return (
      <Shell>
        <p className="tech-sm">{t("cf.loading")}</p>
      </Shell>
    );
  if (!ctx.found)
    return (
      <Shell>
        <p className="text-sm text-muted-foreground">{t("cf.invalid")}</p>
      </Shell>
    );
  if (!ctx.eligible)
    return (
      <Shell>
        <p className="text-sm text-muted-foreground">
          {t("cf.notEligible")} {ctx.status}.
        </p>
      </Shell>
    );
  if (done)
    return (
      <Shell>
        <h1 className="display text-4xl sm:text-6xl">
          {t("cf.doneTitle1")}
          <span className="block text-jade-soft">{t("cf.doneTitle2")}</span>
        </h1>
        <p className="mt-6 text-sm text-muted-foreground">{t("cf.doneBody")}</p>
      </Shell>
    );

  return (
    <Shell>
      <div className="tech-sm">{t("cf.stage")}</div>
      <h1 className="display mt-6 text-4xl sm:text-6xl">
        {t("cf.title1")}
        <span className="block text-jade-soft">{t("cf.title2")}</span>
      </h1>
      <p className="mt-6 max-w-lg text-sm text-muted-foreground">
        {t("cf.welcome")} {ctx.firstName}. {t("cf.intro")} {t("cf.registeredSize")} {ctx.shoeSize}.
      </p>

      <form
        className="mt-12 grid gap-8"
        onSubmit={async (e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          if (!acks.attending || !acks.rules || !acks.image || !acks.dietary) {
            setError(t("cf.required"));
            return;
          }
          setError(null);
          const res = await submit({
            data: {
              token,
              attending: true,
              emergencyName: String(fd.get("emergencyName") ?? ""),
              emergencyPhone: String(fd.get("emergencyPhone") ?? ""),
              finalShoeSize: String(fd.get("finalShoeSize") ?? ""),
              dietaryProfile: String(fd.get("dietaryProfile") ?? ""),
              foodAllergies: String(fd.get("foodAllergies") ?? ""),
              dietaryConsent: true,
              rulesAck: true,
              imageRelease: true,
            },
          });
          if (res.ok) setDone(true);
          else setError(t("cf.saveFailed"));
        }}
      >
        <div className="grid gap-x-12 gap-y-6 sm:grid-cols-2">
          <Field label={t("cf.emName")} required>
            <input name="emergencyName" required maxLength={120} className={inputClass} />
          </Field>
          <Field label={t("cf.emPhone")} required>
            <input name="emergencyPhone" required maxLength={40} className={inputClass} />
          </Field>
          <Field label={t("cf.finalSize")} required>
            <input name="finalShoeSize" required maxLength={20} className={inputClass} />
          </Field>
        </div>

        <div>
          <div className="tech mb-4 border-t border-border pt-4 text-foreground">
            {t("cf.lunchTitle")}
          </div>
          <div className="grid gap-x-12 gap-y-6 sm:grid-cols-2">
            <Field label={t("cf.dietary")} required>
              <select name="dietaryProfile" required className={selectClass} defaultValue="">
                <option value="" disabled>
                  {t("form.select")}
                </option>
                {DIETARY_PROFILES.map((o) => (
                  <option key={o} value={o}>
                    {optionLabel(o, lang)}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={t("cf.allergies")} hint={t("cf.allergiesHint")}>
              <input name="foodAllergies" maxLength={300} className={inputClass} />
            </Field>
          </div>
        </div>

        <div>
          <CheckRow
            checked={acks.attending}
            onChange={(v) => setAcks((a) => ({ ...a, attending: v }))}
          >
            {t("cf.attending")}
          </CheckRow>
          <CheckRow checked={acks.rules} onChange={(v) => setAcks((a) => ({ ...a, rules: v }))}>
            {t("cf.rulesA")}{" "}
            <a
              href="/regolamento"
              target="_blank"
              rel="noreferrer"
              className="text-jade-soft underline"
            >
              {t("cf.rulesLink")}
            </a>{" "}
            {t("cf.rulesB")}
          </CheckRow>
          <CheckRow checked={acks.dietary} onChange={(v) => setAcks((a) => ({ ...a, dietary: v }))}>
            {t("cf.dietaryConsent")}
          </CheckRow>
          <CheckRow checked={acks.image} onChange={(v) => setAcks((a) => ({ ...a, image: v }))}>
            {t("cf.image")}
          </CheckRow>
        </div>

        {error ? <p className="text-xs text-destructive">{error}</p> : null}
        <button
          type="submit"
          className="tech w-fit border border-jade bg-jade px-8 py-4 text-primary-foreground hover:jade-glow"
        >
          {t("cf.submit")}
        </button>
      </form>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return <main className="mx-auto min-h-screen w-full max-w-3xl px-6 py-24">{children}</main>;
}
