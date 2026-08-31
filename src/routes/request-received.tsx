import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { eventQueryOptions, formatDate } from "@/lib/queries";
import { DateBoard } from "@/components/site/DateBoard";

export const Route = createFileRoute("/request-received")({
  loader: ({ context }) => context.queryClient.ensureQueryData(eventQueryOptions),
  head: () => ({
    meta: [
      { title: "Request received — Sylan 2 Trail Run | Arc'teryx × VIETTI" },
      {
        name: "description",
        content:
          "Your request to join the Arc'teryx × VIETTI Sylan 2 Trail Run has been received and is pending confirmation.",
      },
      { property: "og:title", content: "Request received — Sylan 2 Trail Run" },
      {
        property: "og:description",
        content: "Your participation request is received and pending confirmation.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/request-received" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/request-received" }],
  }),
  component: RequestReceived,
});

function RequestReceived() {
  const { data } = useSuspenseQuery(eventQueryOptions);
  const finalDate = data.dates.find((d) => d.id === data.event.finalDateId) ?? null;

  function calendarHref() {
    if (!finalDate) return "#";
    const d = finalDate.date.replace(/-/g, "");
    const body = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      `DTSTART;VALUE=DATE:${d}`,
      `SUMMARY:Arc'teryx x VIETTI — Sylan 2 Trail Run`,
      `LOCATION:${data.event.meetingPoint}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\n");
    return `data:text/calendar;charset=utf-8,${encodeURIComponent(body)}`;
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-6 py-24">
      <Link to="/" className="tech-sm hover:text-jade-soft">
        ← ARC&rsquo;TERYX × VIETTI
      </Link>
      <h1 className="display mt-10 text-5xl sm:text-7xl">
        REQUEST
        <span className="block text-jade-soft">RECEIVED</span>
      </h1>
      <p className="mt-8 max-w-lg text-sm leading-relaxed text-muted-foreground">
        Thank you. Your participation is not yet confirmed. We&rsquo;ll contact you once the event
        date and participant group have been finalized.
      </p>

      <div className="mt-16">
        <div className="tech-sm mb-6">CURRENT COMMUNITY PREFERENCE</div>
        <DateBoard
          dates={data.dates}
          leadingDateId={data.leadingDateId}
          total={data.total}
          weatherEnabled={data.event.weatherEnabled}
          weatherUpdatedAt={data.weatherUpdatedAt}
        />
        {data.leadingDateId ? (
          <p className="tech-sm mt-6 text-jade-soft">
            CURRENT LEADING DATE —{" "}
            {formatDate(data.dates.find((d) => d.id === data.leadingDateId)!.date).long}
          </p>
        ) : null}
        <p className="mt-6 max-w-2xl text-xs leading-relaxed text-muted-foreground">
          The most requested date will be prioritized. The final event date will be confirmed based
          on participant availability, weather conditions and operational requirements.
        </p>
      </div>

      {finalDate ? (
        <a
          href={calendarHref()}
          download="sylan-2-trail-run.ics"
          className="tech mt-12 inline-block border border-jade bg-jade px-7 py-4 text-primary-foreground hover:jade-glow"
        >
          ADD TO CALENDAR — {formatDate(finalDate.date).long}
        </a>
      ) : (
        <p className="tech-sm mt-12 border border-border px-4 py-3">
          ADD TO CALENDAR AVAILABLE ONCE THE FINAL DATE IS CONFIRMED
        </p>
      )}
    </main>
  );
}
