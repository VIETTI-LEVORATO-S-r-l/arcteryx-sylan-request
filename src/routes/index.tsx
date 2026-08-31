import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import heroImage from "@/assets/hero-trail.jpg";
import { eventQueryOptions, formatDate } from "@/lib/queries";
import { DateBoard } from "@/components/site/DateBoard";
import { EventWeatherPanel } from "@/components/site/Weather";
import { ApplicationForm } from "@/components/site/ApplicationForm";
import { SectionLabel, Spec, TopoLines, Reveal } from "@/components/site/Primitives";
import { useI18n, LangSwitch } from "@/lib/i18n";

const DESCRIPTION =
  "Un'esperienza guidata di trail running non competitiva, dedicata alla community e al test della Arc'teryx Sylan 2.";

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(eventQueryOptions),
  head: () => ({
    meta: [
      { title: "Sylan 2 Community Trail Run — Arc'teryx × VIETTI | Lago Maggiore" },
      { name: "description", content: DESCRIPTION },
      {
        property: "og:title",
        content: "Sylan 2 Community Trail Run — Arc'teryx × VIETTI | Lago Maggiore",
      },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Event",
          name: "Arc'teryx × VIETTI — Sylan 2 Community Trail Run",
          location: {
            "@type": "Place",
            name: "VIETTI — Arona, Lago Maggiore",
            address: "Arona, Lago Maggiore, IT",
          },
          description: DESCRIPTION,
        }),
      },
    ],
  }),
  component: Home,
});

const STEP_NUMBERS = ["01", "02", "03", "04"] as const;

function Home() {
  const { t, lang } = useI18n();
  const { data } = useSuspenseQuery(eventQueryOptions);
  const finalDate = data.dates.find((d) => d.id === data.event.finalDateId) ?? null;

  return (
    <div className="min-h-screen">
      {/* HERO */}
      <header className="surface-dark relative flex min-h-[92svh] flex-col justify-between overflow-hidden">
        <img
          src={heroImage}
          alt={t("hero.alt")}
          width={1920}
          height={1280}
          className="slow-zoom absolute inset-0 h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/45 to-background" />

        <nav className="relative grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-5 py-5 sm:px-10 sm:py-6">
          <span className="tech-sm truncate text-foreground">ARC&rsquo;TERYX × VIETTI</span>
          <div className="hidden shrink-0 items-center gap-5 sm:flex">
            <a href="#esperienza" className="tech-sm transition-colors hover:text-jade-soft">
              {t("nav.experience")}
            </a>
            <a href="#date" className="tech-sm transition-colors hover:text-jade-soft">
              {t("nav.dates")}
            </a>
            <a href="#richiesta" className="tech-sm transition-colors hover:text-jade-soft">
              {t("nav.request")}
            </a>
            <LangSwitch className="flex items-center gap-1 border-l border-border pl-4" />
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:hidden">
            <LangSwitch className="flex items-center gap-0.5" />
            <a href="#richiesta" className="cta cta-sm cta-ghost">
              {t("nav.requestShort")}
              <span className="cta-arrow" aria-hidden>
                →
              </span>
            </a>
          </div>
        </nav>

        <div className="relative px-5 pb-16 sm:px-10 sm:pb-14">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:items-end">
            <div className="rise">
              <h1 className="display text-[15vw] leading-[0.86] sm:text-[9vw] lg:text-[6.6vw]">
                SYLAN 2<span className="block text-jade-soft">COMMUNITY TRAIL RUN</span>
                <span className="block text-[0.42em] tracking-technical text-foreground">
                  LAGO MAGGIORE
                </span>
              </h1>
              <p className="mt-8 max-w-lg text-sm leading-relaxed text-muted-foreground">
                {t("hero.description")}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a href="#richiesta" className="cta cta-solid w-full sm:w-auto">
                  {t("hero.cta")}
                  <span className="cta-arrow" aria-hidden>
                    →
                  </span>
                </a>
                <a href="#esperienza" className="cta cta-ghost w-full sm:w-auto">
                  {t("hero.ctaSecondary")}
                  <span className="cta-arrow" aria-hidden>
                    ↓
                  </span>
                </a>
              </div>
              <p className="tech-sm mt-6 flex items-center gap-2">
                <span className="inline-block h-1.5 w-1.5 bg-foreground" aria-hidden />
                {t("hero.limited")}
              </p>
            </div>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4 lg:grid-cols-1">
              {[
                [t("hero.k.place"), t("hero.v.place")],
                [t("hero.k.format"), t("hero.v.format")],
                [t("hero.k.access"), t("hero.v.access")],
                [t("hero.k.dates"), t("hero.v.dates")],
              ].map(([k, v]) => (
                <div key={k} className="border-t border-border pt-3">
                  <dt className="tech-sm">{k}</dt>
                  <dd className="tech mt-1 text-foreground">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </header>

      {/* POSIZIONAMENTO */}
      <section className="px-5 pt-10 sm:px-10">
        <Reveal className="border-l-2 border-jade bg-card p-6 text-sm leading-relaxed text-foreground sm:p-8">
          {t("nonCompetitive")}
        </Reveal>
      </section>

      {/* ESPERIENZA */}
      <section id="esperienza" className="band mt-10">
        <SectionLabel index="01">{t("exp.title")}</SectionLabel>

        <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
          {STEP_NUMBERS.map((n, i) => (
            <Reveal as="article" delay={i * 90} key={n} className="bg-background p-6 sm:p-8">
              <span className="tech-sm text-jade-soft">{n}</span>
              <h3 className="display mt-6 text-2xl">{t(`exp.${n}.t` as const)}</h3>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {t(`exp.${n}.d` as const)}
              </p>
            </Reveal>
          ))}
        </div>
        <p className="mt-8 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {t("exp.note")}
        </p>
      </section>

      {/* PERCORSO */}
      <section className="band band-soft overflow-hidden">
        <TopoLines />
        <div className="relative">
          <SectionLabel index="02">{t("route.title")}</SectionLabel>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
            <div className="grid sm:grid-cols-2 lg:grid-cols-1">
              <Spec label={t("route.distance")} value={data.event.distanceKm} mono />
              <Spec label={t("route.elevation")} value={data.event.elevationM} mono />
              <Spec label={t("route.surface")} value={data.event.surface} />
              <Spec label={t("route.place")} value={data.event.location} />
            </div>
            <div>
              <div className="relative grid aspect-[4/3] place-items-center border border-border bg-card">
                <TopoLines className="opacity-30" />
                <span className="tech-sm relative">{t("route.map")}</span>
                <span className="tech-sm absolute bottom-4 left-4 tabular-nums">
                  45.7597° N / 8.5556° E
                </span>
              </div>
              <p className="tech-sm mt-4 normal-case tracking-normal">{data.event.routeNotes}</p>
            </div>
          </div>
        </div>
      </section>

      {/* DATE */}
      <section id="date" className="band">
        <SectionLabel index="03">
          {finalDate ? t("dates.titleConfirmed") : t("dates.titleChoose")}
        </SectionLabel>

        {finalDate ? (
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
            <div className="jade-glow bg-card p-8">
              <div className="tech-sm mb-4 text-jade-soft">{t("dates.confirmed")}</div>
              <div className="display text-5xl sm:text-7xl">{formatDate(finalDate.date, lang).long}</div>
              <div className="mt-10 grid gap-6 sm:grid-cols-2">
                <div className="border-t border-border pt-3">
                  <div className="tech-sm">{t("dates.meetingTime")}</div>
                  <div className="display mt-2 text-2xl">{data.event.meetingTime}</div>
                </div>
                <div className="border-t border-border pt-3">
                  <div className="tech-sm">{t("dates.meetingPoint")}</div>
                  <div className="display mt-2 text-2xl">{data.event.meetingPoint}</div>
                </div>
              </div>
              {data.event.weatherEnabled ? (
                <div className="mt-10">
                  <EventWeatherPanel w={finalDate.weather} updatedAt={data.weatherUpdatedAt} />
                </div>
              ) : null}
            </div>
            <div>
              <div className="tech-sm mb-4">{t("dates.communityPreference")}</div>
              <DateBoard
                dates={data.dates}
                leadingDateId={data.leadingDateId}
                total={data.total}
                weatherEnabled={data.event.weatherEnabled}
                weatherUpdatedAt={data.weatherUpdatedAt}
              />
            </div>
          </div>
        ) : (
          <>
            <div className="mb-8 flex flex-wrap items-center gap-x-8 gap-y-2">
              <span className="tech-sm border border-border px-3 py-1">{t("dates.provisional")}</span>
              <span className="tech-sm">
                {t("dates.communityPreference")} — {data.total} {t("dates.requests")}
              </span>
              {data.leadingDateId ? (
                <span className="tech-sm text-jade-soft">
                  {t("dates.leading")} —{" "}
                  {formatDate(data.dates.find((d) => d.id === data.leadingDateId)!.date, lang).long}
                </span>
              ) : null}
            </div>
            <DateBoard
              dates={data.dates}
              leadingDateId={data.leadingDateId}
              total={data.total}
              weatherEnabled={data.event.weatherEnabled}
              weatherUpdatedAt={data.weatherUpdatedAt}
            />
            <p className="mt-8 max-w-2xl text-xs leading-relaxed text-muted-foreground">
              {t("dates.note")}
            </p>
          </>
        )}
      </section>

      {/* FOTO / VIDEO */}
      <section className="px-5 pb-4 sm:px-10">
        <div className="border border-border p-6 sm:p-8">
          <div className="tech-sm mb-3 text-jade-soft">{t("media.title")}</div>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {t("media.body")}
          </p>
        </div>
      </section>

      {/* RICHIESTA */}
      <section id="richiesta" className="band band-soft">

        <SectionLabel index="04">{t("req.title")}</SectionLabel>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <div>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              {t("req.body")}
            </p>
            <div className="mt-6 space-y-2">
              <div className="tech-sm">{t("req.tag1")}</div>
              <div className="tech-sm text-jade-soft">{t("req.tag3")}</div>
            </div>
          </div>
          <ApplicationForm data={data} />
        </div>
      </section>

      {/* CTA persistente su mobile */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4 pb-4 sm:hidden">
        <a
          href="#richiesta"
          className="cta cta-solid pointer-events-auto w-full shadow-[0_18px_40px_-24px_var(--color-foreground)]"
        >
          {t("hero.cta")}
          <span className="cta-arrow" aria-hidden>
            →
          </span>
        </a>
      </div>

      <footer className="grid gap-6 border-t border-border px-5 pb-28 pt-10 sm:grid-cols-[minmax(0,1fr)_auto] sm:px-10 sm:pb-10">
        <div className="tech-sm">
          ARC&rsquo;TERYX × VIETTI — SYLAN 2 COMMUNITY TRAIL RUN / LAGO MAGGIORE / 2026
          <span className="mt-2 block opacity-60">{t("footer.logo")}</span>
        </div>
        <div className="flex flex-wrap gap-5">
          <Link to="/regolamento" className="tech-sm hover:text-jade-soft">
            {t("footer.rules")}
          </Link>
          <Link to="/privacy" className="tech-sm hover:text-jade-soft">
            {t("footer.privacy")}
          </Link>
          <Link to="/terms" className="tech-sm hover:text-jade-soft">
            {t("footer.terms")}
          </Link>
          <Link to="/cookies" className="tech-sm hover:text-jade-soft">
            {t("footer.cookies")}
          </Link>
        </div>
      </footer>
    </div>
  );
}
