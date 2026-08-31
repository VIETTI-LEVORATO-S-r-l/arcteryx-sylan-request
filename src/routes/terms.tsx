import { createFileRoute } from "@tanstack/react-router";
import { LegalBlock, LegalPage } from "@/components/site/LegalPage";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Event Terms — Sylan 2 Trail Run | Arc'teryx × VIETTI" },
      {
        name: "description",
        content:
          "Draft event terms for the Arc'teryx × VIETTI Sylan 2 Trail Run participation process on Lake Maggiore.",
      },
      { property: "og:title", content: "Event Terms — Sylan 2 Trail Run" },
      { property: "og:description", content: "Participation terms for the Sylan 2 Trail Run." },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/terms" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: () => (
    <LegalPage title="EVENT TERMS">
      <LegalBlock heading="PARTICIPATION">
        <p>
          Submitting a request does not guarantee participation. Places are limited and participation
          is subject to confirmation by the organizers.
        </p>
      </LegalBlock>
      <LegalBlock heading="ACTIVITY AND TERRAIN">
        <p>
          The activity takes place on natural, uneven outdoor terrain and requires an appropriate
          level of physical preparation. [PLACEHOLDER — insert final safety and liability terms.]
        </p>
      </LegalBlock>
      <LegalBlock heading="DATES AND CHANGES">
        <p>
          Provisional dates may change. The final date is confirmed based on participant
          availability, weather conditions and operational requirements.
        </p>
      </LegalBlock>
      <LegalBlock heading="IMAGE AND VIDEO">
        <p>
          Final image and video release terms are provided to confirmed participants in a separate
          confirmation step. [PLACEHOLDER — insert final release wording.]
        </p>
      </LegalBlock>
    </LegalPage>
  ),
});
