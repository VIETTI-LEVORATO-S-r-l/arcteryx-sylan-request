import { createFileRoute } from "@tanstack/react-router";
import { LegalBlock, LegalPage } from "@/components/site/LegalPage";

export const Route = createFileRoute("/cookies")({
  head: () => ({
    meta: [
      { title: "Cookie Policy — Sylan 2 Trail Run | Arc'teryx × VIETTI" },
      {
        name: "description",
        content: "Draft cookie policy for the Arc'teryx × VIETTI Sylan 2 Trail Run website.",
      },
      { property: "og:title", content: "Cookie Policy — Sylan 2 Trail Run" },
      { property: "og:description", content: "Cookies used on the Sylan 2 Trail Run website." },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/cookies" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/cookies" }],
  }),
  component: () => (
    <LegalPage title="COOKIE POLICY">
      <LegalBlock heading="TECHNICAL COOKIES">
        <p>
          The site uses a strictly necessary session cookie for the organizer dashboard. No
          advertising cookies are set by default.
        </p>
      </LegalBlock>
      <LegalBlock heading="ANALYTICS">
        <p>[PLACEHOLDER — list any analytics or measurement tools before launch.]</p>
      </LegalBlock>
      <LegalBlock heading="MANAGING COOKIES">
        <p>[PLACEHOLDER — insert instructions and, if required, a consent management tool.]</p>
      </LegalBlock>
    </LegalPage>
  ),
});
