import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import heroImage from "@/assets/hero-trail.jpg";
import { eventQueryOptions, formatDate } from "@/lib/queries";
import { DateBoard } from "@/components/site/DateBoard";
import { EventWeatherPanel } from "@/components/site/Weather";
import { ApplicationForm } from "@/components/site/ApplicationForm";
import { SectionLabel, Spec, TopoLines, Reveal } from "@/components/site/Primitives";

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

const STEPS = [
  { n: "01", t: "ARRIVO", d: "Accoglienza e check-in da VIETTI." },
  { n: "02", t: "FITTING", d: "Consegna e prova delle Arc'teryx Sylan 2 in test." },
  { n: "03", t: "TRAIL", d: "Community trail run guidata e non competitiva sul Lago Maggiore." },
  { n: "04", t: "RECOVERY", d: "Ristoro post-run e momento di community." },
];

const NON_COMPETITIVE =
  "L'evento è una Community Trail Run guidata e non competitiva. Non sono previsti classifica, cronometraggio ufficiale o premi legati alla performance.";

function Home() {
  const { data } = useSuspenseQuery(eventQueryOptions);
  const finalDate = data.dates.find((d) => d.id === data.event.finalDateId) ?? null;

  return (
    <div className="min-h-screen">
      {/* HERO */}
      <header className="surface-dark relative flex min-h-[92svh] flex-col justify-between overflow-hidden">
        <img
          src={heroImage}
          alt="Trail runner su un crinale sopra il Lago Maggiore"
          width={1920}
          height={1280}
          className="slow-zoom absolute inset-0 h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/45 to-background" />

        <nav className="relative grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-5 py-5 sm:px-10 sm:py-6">
          <span className="tech-sm truncate text-foreground">ARC&rsquo;TERYX × VIETTI</span>
          <div className="hidden shrink-0 items-center gap-5 sm:flex">
            <a href="#esperienza" className="tech-sm transition-colors hover:text-jade-soft">
              ESPERIENZA
            </a>
            <a href="#date" className="tech-sm transition-colors hover:text-jade-soft">
              DATE
            </a>
            <a href="#richiesta" className="tech-sm transition-colors hover:text-jade-soft">
              RICHIESTA
            </a>
          </div>
          <a
            href="#richiesta"
            className="action tech-sm shrink-0 border border-jade-soft px-3 py-2 text-jade-soft sm:hidden"
          >
            RICHIEDI
          </a>
        </nav>

        <div className="relative px-5 pb-16 sm:px-10 sm:pb-14">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:items-end">
            <div className="rise">
              <h1 className="display text-[15vw] leading-[0.86] sm:text-[9vw] lg:text-[6.6vw]">
                SYLAN 2
                <span className="block text-jade-soft">COMMUNITY TRAIL RUN</span>
                <span className="block text-[0.42em] tracking-technical text-foreground">
                  LAGO MAGGIORE
                </span>
              </h1>
              <p className="mt-8 max-w-lg text-sm leading-relaxed text-muted-foreground">
                {DESCRIPTION}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#richiesta"
                  className="action tech w-full border border-jade bg-jade px-7 py-4 text-center text-primary-foreground hover:jade-glow sm:w-auto"
                >
                  <span className="action-sweep" aria-hidden />
                  RICHIEDI DI PARTECIPARE
                </a>
                <a
                  href="#esperienza"
                  className="action tech w-full border border-border px-7 py-4 text-center text-foreground hover:border-jade-soft sm:w-auto"
                >
                  SCOPRI L&rsquo;ESPERIENZA
                </a>
              </div>
              <p className="tech-sm mt-6 text-jade-soft">POSTI LIMITATI</p>
            </div>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4 lg:grid-cols-1">
              {[
                ["LUOGO", "LAGO MAGGIORE / IT"],
                ["FORMATO", "TRAIL RUN NON COMPETITIVA"],
                ["ACCESSO", "PARTECIPAZIONE LIMITATA"],
                ["DATE", "17—19 SETTEMBRE 2026"],
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
          {NON_COMPETITIVE}
        </Reveal>
      </section>

      {/* ESPERIENZA */}
      <section id="esperienza" className="px-5 py-16 sm:px-10 sm:py-24">
        <SectionLabel index="01">L&rsquo;ESPERIENZA</SectionLabel>
        <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <Reveal as="article" delay={i * 90} key={s.n} className="bg-background p-6 sm:p-8">
              <span className="tech-sm text-jade-soft">{s.n}</span>
              <h3 className="display mt-6 text-2xl">{s.t}</h3>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
            </Reveal>
          ))}
        </div>
        <p className="mt-8 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Guide e pacer esperti accompagnano il gruppo lungo tutto il percorso. Le riprese foto e
          video fanno parte dello storytelling Arc&rsquo;teryx × VIETTI.
        </p>
      </section>

      {/* PERCORSO */}
      <section className="relative overflow-hidden px-5 py-16 sm:px-10 sm:py-24">
        <TopoLines />
        <div className="relative">
          <SectionLabel index="02">IL PERCORSO</SectionLabel>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
            <div className="grid sm:grid-cols-2 lg:grid-cols-1">
              <Spec label="DISTANZA" value={data.event.distanceKm} mono />
              <Spec label="DISLIVELLO" value={data.event.elevationM} mono />
              <Spec label="FONDO" value={data.event.surface} />
              <Spec label="LUOGO" value={data.event.location} />
            </div>
            <div>
              <div className="relative grid aspect-[4/3] place-items-center border border-border bg-card">
                <TopoLines className="opacity-30" />
                <span className="tech-sm relative">PLACEHOLDER MAPPA GPX / TOPOGRAFICA</span>
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
      <section id="date" className="px-5 py-16 sm:px-10 sm:py-24">
        <SectionLabel index="03">
          {finalDate ? "DATA DELL’EVENTO CONFERMATA" : "SCEGLI LA TUA DATA PREFERITA"}
        </SectionLabel>

        {finalDate ? (
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
            <div className="jade-glow bg-card p-8">
              <div className="tech-sm mb-4 text-jade-soft">CONFERMATA</div>
              <div className="display text-5xl sm:text-7xl">{formatDate(finalDate.date).long}</div>
              <div className="mt-10 grid gap-6 sm:grid-cols-2">
                <div className="border-t border-border pt-3">
                  <div className="tech-sm">ORARIO DI RITROVO</div>
                  <div className="display mt-2 text-2xl">{data.event.meetingTime}</div>
                </div>
                <div className="border-t border-border pt-3">
                  <div className="tech-sm">PUNTO DI RITROVO</div>
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
              <div className="tech-sm mb-4">PREFERENZA DELLA COMMUNITY</div>
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
              <span className="tech-sm border border-border px-3 py-1">DATE PROVVISORIE</span>
              <span className="tech-sm">
                PREFERENZA DELLA COMMUNITY — {data.total} RICHIESTE
              </span>
              {data.leadingDateId ? (
                <span className="tech-sm text-jade-soft">
                  DATA ATTUALMENTE PIÙ RICHIESTA —{" "}
                  {formatDate(data.dates.find((d) => d.id === data.leadingDateId)!.date).long}
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
              La data più richiesta sarà considerata prioritaria. La data finale verrà confermata in
              base alla disponibilità dei partecipanti, alle condizioni meteo e alle esigenze
              organizzative.
            </p>
          </>
        )}
      </section>

      {/* FOTO / VIDEO */}
      <section className="px-5 sm:px-10">
        <div className="border border-border p-6 sm:p-8">
          <div className="tech-sm mb-3 text-jade-soft">PRODUZIONE FOTO E VIDEO</div>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Durante l&rsquo;evento sono previste riprese foto e video per lo storytelling
            Arc&rsquo;teryx × VIETTI. La liberatoria per immagini e video viene raccolta
            separatamente, solo dai partecipanti accettati, nella fase di conferma.
          </p>
        </div>
      </section>

      {/* RICHIESTA */}
      <section id="richiesta" className="px-5 py-16 sm:px-10 sm:py-24">
        <SectionLabel index="04">RICHIEDI DI PARTECIPARE</SectionLabel>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <div>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              I posti sono limitati. Compila il modulo per inviare la tua richiesta di
              partecipazione: l&rsquo;invio non conferma automaticamente il posto.
            </p>
            <div className="mt-8 space-y-2">
              <div className="tech-sm">POSTI LIMITATI</div>
              <div className="tech-sm">RICHIESTA DI PARTECIPAZIONE</div>
              <div className="tech-sm text-jade-soft">
                PARTECIPAZIONE SOGGETTA A CONFERMA
              </div>
            </div>
            <p className="mt-8 max-w-sm text-xs leading-relaxed text-muted-foreground">
              {NON_COMPETITIVE}
            </p>
          </div>
          <ApplicationForm data={data} />
        </div>
      </section>

      {/* CTA persistente su mobile */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4 pb-4 sm:hidden">
        <a
          href="#richiesta"
          className="action tech pointer-events-auto flex items-center justify-center gap-3 border border-jade bg-jade px-6 py-4 text-primary-foreground jade-glow"
        >
          <span className="action-sweep" aria-hidden />
          RICHIEDI DI PARTECIPARE
        </a>
      </div>

      <footer className="grid gap-6 border-t border-border px-5 pb-28 pt-10 sm:grid-cols-[minmax(0,1fr)_auto] sm:px-10 sm:pb-10">
        <div className="tech-sm">
          ARC&rsquo;TERYX × VIETTI — SYLAN 2 COMMUNITY TRAIL RUN / LAGO MAGGIORE / 2026
          <span className="mt-2 block opacity-60">[PLACEHOLDER LOGO — CARICARE ASSET FINALI]</span>
        </div>
        <div className="flex flex-wrap gap-5">
          <Link to="/regolamento" className="tech-sm hover:text-jade-soft">
            REGOLAMENTO
          </Link>
          <Link to="/privacy" className="tech-sm hover:text-jade-soft">
            INFORMATIVA PRIVACY
          </Link>
          <Link to="/terms" className="tech-sm hover:text-jade-soft">
            TERMINI DELL&rsquo;EVENTO
          </Link>
          <Link to="/cookies" className="tech-sm hover:text-jade-soft">
            COOKIE POLICY
          </Link>
        </div>
      </footer>
    </div>
  );
}
