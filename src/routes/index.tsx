import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import heroImage from "@/assets/hero-trail.jpg";
import { eventQueryOptions, formatDate } from "@/lib/queries";
import { DateBoard } from "@/components/site/DateBoard";
import { ApplicationForm } from "@/components/site/ApplicationForm";
import { SectionLabel, Spec, TopoLines } from "@/components/site/Primitives";

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(eventQueryOptions),
  head: () => ({
    meta: [
      { title: "Arc'teryx × VIETTI — Sylan 2 Trail Run | Lake Maggiore" },
      {
        name: "description",
        content:
          "Request to join a limited Arc'teryx Sylan 2 trail-running experience on Lake Maggiore.",
      },
      { property: "og:title", content: "Arc'teryx × VIETTI — Sylan 2 Trail Run | Lake Maggiore" },
      {
        property: "og:description",
        content:
          "Request to join a limited Arc'teryx Sylan 2 trail-running experience on Lake Maggiore.",
      },
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
          "@type": "SportsEvent",
          name: "Arc'teryx × VIETTI — Sylan 2 Trail Run",
          location: {
            "@type": "Place",
            name: "VIETTI — Arona, Lake Maggiore",
            address: "Arona, Lake Maggiore, IT",
          },
          description:
            "A limited trail-running experience designed to test the Arc'teryx Sylan 2 on Lake Maggiore.",
        }),
      },
    ],
  }),
  component: Home,
});

const STEPS = [
  { n: "01", t: "ARRIVAL", d: "Welcome and check-in at VIETTI." },
  { n: "02", t: "FITTING", d: "Participants receive and fit the Arc'teryx Sylan 2 demo shoes." },
  { n: "03", t: "TRAIL", d: "Guided trail-running experience in the Lake Maggiore area." },
  { n: "04", t: "RECOVERY", d: "Post-run refreshments and community moment." },
];

function Home() {
  const { data } = useSuspenseQuery(eventQueryOptions);
  const finalDate = data.dates.find((d) => d.id === data.event.finalDateId) ?? null;

  return (
    <div className="min-h-screen">
      {/* HERO */}
      <header className="relative flex min-h-[92svh] flex-col justify-between overflow-hidden">
        <img
          src={heroImage}
          alt="Trail runner on a ridge above Lake Maggiore at dusk"
          width={1920}
          height={1280}
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/40 to-background" />

        <nav className="relative grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-6 py-6 sm:px-10">
          <span className="tech-sm truncate text-foreground">ARC&rsquo;TERYX × VIETTI</span>
          <div className="flex shrink-0 items-center gap-5">
            <a href="#experience" className="tech-sm hover:text-jade-soft">
              EXPERIENCE
            </a>
            <a href="#apply" className="tech-sm hover:text-jade-soft">
              REQUEST
            </a>
          </div>
        </nav>

        <div className="relative px-6 pb-14 sm:px-10">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:items-end">
            <div className="rise">
              <h1 className="display text-[15vw] leading-[0.82] sm:text-[10vw] lg:text-[7.5vw]">
                SYLAN 2
                <span className="block text-jade-soft">TRAIL RUN</span>
                <span className="block text-[0.42em] tracking-technical text-foreground">
                  LAKE MAGGIORE
                </span>
              </h1>
              <p className="mt-8 max-w-md text-sm leading-relaxed text-muted-foreground">
                A limited trail-running experience designed to test the Sylan 2 where it belongs.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#apply"
                  className="tech border border-jade bg-jade px-7 py-4 text-primary-foreground transition-all hover:jade-glow"
                >
                  REQUEST TO JOIN
                </a>
                <a
                  href="#experience"
                  className="tech border border-border px-7 py-4 text-foreground transition-colors hover:border-jade-soft"
                >
                  DISCOVER THE EXPERIENCE
                </a>
              </div>
            </div>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4 lg:grid-cols-1">
              {[
                ["LOCATION", "LAKE MAGGIORE / IT"],
                ["DISCIPLINE", "TRAIL RUNNING"],
                ["ACCESS", "LIMITED PARTICIPATION"],
                ["SEASON", "2026"],
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

      {/* EXPERIENCE */}
      <section id="experience" className="px-6 py-24 sm:px-10">
        <SectionLabel index="01">THE EXPERIENCE</SectionLabel>
        <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <article key={s.n} className="bg-background p-6 sm:p-8">
              <span className="tech-sm text-jade-soft">{s.n}</span>
              <h3 className="display mt-6 text-2xl">{s.t}</h3>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
            </article>
          ))}
        </div>
        <p className="mt-8 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Experienced run leaders and pacers accompany the group. Photography and video production
          are part of the Arc&rsquo;teryx × VIETTI storytelling.
        </p>
      </section>

      {/* ROUTE */}
      <section className="relative overflow-hidden px-6 py-24 sm:px-10">
        <TopoLines />
        <div className="relative">
          <SectionLabel index="02">THE ROUTE</SectionLabel>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
            <div className="grid sm:grid-cols-2 lg:grid-cols-1">
              <Spec label="DISTANCE" value={data.event.distanceKm} mono />
              <Spec label="ELEVATION" value={data.event.elevationM} mono />
              <Spec label="SURFACE" value={data.event.surface} />
              <Spec label="LOCATION" value={data.event.location} />
            </div>
            <div>
              <div className="relative grid aspect-[4/3] place-items-center border border-border bg-card">
                <TopoLines className="opacity-30" />
                <span className="tech-sm relative">GPX / TOPOGRAPHIC MAP PLACEHOLDER</span>
                <span className="tech-sm absolute bottom-4 left-4 tabular-nums">
                  45.7597° N / 8.5556° E
                </span>
              </div>
              <p className="tech-sm mt-4 normal-case tracking-normal">{data.event.routeNotes}</p>
            </div>
          </div>
        </div>
      </section>

      {/* DATES */}
      <section id="dates" className="px-6 py-24 sm:px-10">
        <SectionLabel index="03">
          {finalDate ? "EVENT DATE CONFIRMED" : "CHOOSE YOUR PREFERRED DATE"}
        </SectionLabel>

        {finalDate ? (
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
            <div className="jade-glow bg-card p-8">
              <div className="tech-sm mb-4 text-jade-soft">CONFIRMED</div>
              <div className="display text-5xl sm:text-7xl">{formatDate(finalDate.date).long}</div>
              <div className="mt-10 grid gap-6 sm:grid-cols-2">
                <div className="border-t border-border pt-3">
                  <div className="tech-sm">MEETING TIME</div>
                  <div className="display mt-2 text-2xl">{data.event.meetingTime}</div>
                </div>
                <div className="border-t border-border pt-3">
                  <div className="tech-sm">MEETING POINT</div>
                  <div className="display mt-2 text-2xl">{data.event.meetingPoint}</div>
                </div>
              </div>
            </div>
            <div>
              <div className="tech-sm mb-4">COMMUNITY PREFERENCE RESULTS</div>
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
              <span className="tech-sm border border-border px-3 py-1">PROVISIONAL EVENT DATES</span>
              <span className="tech-sm">CURRENT COMMUNITY PREFERENCE — {data.total} REQUESTS</span>
              {data.leadingDateId ? (
                <span className="tech-sm text-jade-soft">
                  CURRENT LEADING DATE —{" "}
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
              The most requested date will be prioritized. The final event date will be confirmed
              based on participant availability, weather conditions and operational requirements.
              Weather information is indicative only.
            </p>
          </>
        )}
      </section>

      {/* PHOTO / VIDEO */}
      <section className="px-6 sm:px-10">
        <div className="border border-border p-6 sm:p-8">
          <div className="tech-sm mb-3 text-jade-soft">PHOTO &amp; VIDEO PRODUCTION</div>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Photography and video production will take place during the event as part of the
            Arc&rsquo;teryx × VIETTI event storytelling. Final image and video release terms are
            provided to confirmed participants in a separate confirmation step.
          </p>
        </div>
      </section>

      {/* APPLY */}
      <section id="apply" className="px-6 py-24 sm:px-10">
        <SectionLabel index="04">REQUEST TO JOIN</SectionLabel>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <div>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              Spaces are limited. Complete the application below to request participation.
              Submitting this form does not automatically confirm your place.
            </p>
            <div className="mt-8 space-y-2">
              <div className="tech-sm">LIMITED SPOTS</div>
              <div className="tech-sm">REQUEST TO JOIN</div>
              <div className="tech-sm text-jade-soft">PARTICIPATION SUBJECT TO CONFIRMATION</div>
            </div>
          </div>
          <ApplicationForm data={data} />
        </div>
      </section>

      <footer className="grid gap-6 border-t border-border px-6 py-10 sm:grid-cols-[minmax(0,1fr)_auto] sm:px-10">
        <div className="tech-sm">
          ARC&rsquo;TERYX × VIETTI — SYLAN 2 TRAIL RUN / LAKE MAGGIORE / 2026
          <span className="mt-2 block opacity-60">[LOGO PLACEHOLDER — UPLOAD FINAL ASSETS]</span>
        </div>
        <div className="flex flex-wrap gap-5">
          <Link to="/privacy" className="tech-sm hover:text-jade-soft">
            PRIVACY NOTICE
          </Link>
          <Link to="/terms" className="tech-sm hover:text-jade-soft">
            EVENT TERMS
          </Link>
          <Link to="/cookies" className="tech-sm hover:text-jade-soft">
            COOKIE POLICY
          </Link>
        </div>
      </footer>
    </div>
  );
}
