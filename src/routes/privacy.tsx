import { createFileRoute } from "@tanstack/react-router";
import { LegalBlock, LegalPage } from "@/components/site/LegalPage";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Notice — Sylan 2 Trail Run | Arc'teryx × VIETTI" },
      {
        name: "description",
        content:
          "Draft privacy notice covering personal data processed for Sylan 2 Trail Run participation requests.",
      },
      { property: "og:title", content: "Privacy Notice — Sylan 2 Trail Run" },
      { property: "og:description", content: "How participation-request data is processed." },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/privacy" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: () => (
    <LegalPage title="PRIVACY NOTICE">
      <LegalBlock heading="DATA CONTROLLER">
        <p>[PLACEHOLDER — insert the legal entity acting as data controller, address and contact.]</p>
      </LegalBlock>
      <LegalBlock heading="DATA WE COLLECT">
        <p>
          Identification and contact details, city and country, running and trail experience,
          preferred and alternative dates, footwear sizing, optional Instagram handle and an optional
          free-text description, plus consent records with timestamps and policy version.
        </p>
      </LegalBlock>
      <LegalBlock heading="PURPOSE">
        <p>
          Management and evaluation of participation requests, organisation of the activation and
          related communication. Marketing communications are sent only with separate, optional
          consent.
        </p>
      </LegalBlock>
      <LegalBlock heading="RETENTION">
        <p>[PLACEHOLDER — define retention periods for applications, consents and participant data.]</p>
      </LegalBlock>
      <LegalBlock heading="YOUR RIGHTS">
        <p>
          [PLACEHOLDER — access, rectification, erasure, restriction, portability, objection and
          complaint to the supervisory authority. Insert contact address for requests.]
        </p>
      </LegalBlock>
    </LegalPage>
  ),
});
