import { createFileRoute } from "@tanstack/react-router";
import { LegalBlock, LegalPage } from "@/components/site/LegalPage";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Termini dell'evento — Sylan 2 Community Trail Run | Arc'teryx × VIETTI" },
      {
        name: "description",
        content:
          "Termini di partecipazione alla Community Trail Run guidata e non competitiva Arc'teryx × VIETTI Sylan 2 sul Lago Maggiore.",
      },
      { property: "og:title", content: "Termini dell'evento — Sylan 2 Community Trail Run" },
      {
        property: "og:description",
        content: "Termini di partecipazione alla Sylan 2 Community Trail Run.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/terms" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: () => (
    <LegalPage title="TERMINI DELL’EVENTO">
      <LegalBlock heading="NATURA DELL’ATTIVITÀ">
        <p>
          L&rsquo;evento è una Community Trail Run guidata e non competitiva. Non sono previsti
          classifica, cronometraggio ufficiale o premi legati alla performance.
        </p>
      </LegalBlock>
      <LegalBlock heading="PARTECIPAZIONE">
        <p>
          L&rsquo;invio della richiesta non garantisce la partecipazione. I posti sono limitati e la
          partecipazione è soggetta a conferma da parte dell&rsquo;organizzazione.
        </p>
      </LegalBlock>
      <LegalBlock heading="TERRENO E PREPARAZIONE">
        <p>
          L&rsquo;attività si svolge su terreno naturale e sconnesso e richiede un adeguato livello
          di preparazione fisica. [PLACEHOLDER — inserire termini finali di sicurezza e
          responsabilità.]
        </p>
      </LegalBlock>
      <LegalBlock heading="DATE E MODIFICHE">
        <p>
          Le date indicate sono provvisorie. La data finale viene confermata in base alla
          disponibilità dei partecipanti, alle condizioni meteo e alle esigenze organizzative.
        </p>
      </LegalBlock>
      <LegalBlock heading="IMMAGINI E VIDEO">
        <p>
          La liberatoria definitiva per immagini e video viene fornita ai soli partecipanti
          accettati in una fase di conferma separata. [PLACEHOLDER — testo definitivo della
          liberatoria.]
        </p>
      </LegalBlock>
      <LegalBlock heading="REGOLAMENTO">
        <p>
          La partecipazione è soggetta al Regolamento della Community Trail Run disponibile alla
          pagina /regolamento.
        </p>
      </LegalBlock>
    </LegalPage>
  ),
});
