import { createFileRoute } from "@tanstack/react-router";
import { LegalBlock, LegalPage } from "@/components/site/LegalPage";

export const Route = createFileRoute("/cookies")({
  head: () => ({
    meta: [
      { title: "Cookie Policy — Sylan 2 Community Trail Run | Arc'teryx × VIETTI" },
      {
        name: "description",
        content:
          "Cookie policy del sito della Community Trail Run Arc'teryx × VIETTI Sylan 2 sul Lago Maggiore.",
      },
      { property: "og:title", content: "Cookie Policy — Sylan 2 Community Trail Run" },
      { property: "og:description", content: "Cookie utilizzati sul sito dell'evento." },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/cookies" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/cookies" }],
  }),
  component: () => (
    <LegalPage title="COOKIE POLICY">
      <LegalBlock heading="COOKIE TECNICI">
        <p>
          Il sito utilizza un cookie di sessione strettamente necessario per l&rsquo;area riservata
          dell&rsquo;organizzazione. Non vengono impostati cookie pubblicitari per impostazione
          predefinita.
        </p>
      </LegalBlock>
      <LegalBlock heading="ANALYTICS">
        <p>
          [PLACEHOLDER — elencare eventuali strumenti di analisi e misurazione prima della
          pubblicazione.]
        </p>
      </LegalBlock>
      <LegalBlock heading="GESTIONE DEI COOKIE">
        <p>
          [PLACEHOLDER — inserire istruzioni per la gestione dei cookie e, se necessario, uno
          strumento di consent management.]
        </p>
      </LegalBlock>
    </LegalPage>
  ),
});
