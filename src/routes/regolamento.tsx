import { createFileRoute } from "@tanstack/react-router";
import { LegalBlock, LegalPage } from "@/components/site/LegalPage";

export const Route = createFileRoute("/regolamento")({
  head: () => ({
    meta: [
      { title: "Regolamento — Sylan 2 Community Trail Run | Arc'teryx × VIETTI" },
      {
        name: "description",
        content:
          "Regolamento della Community Trail Run guidata e non competitiva Arc'teryx × VIETTI Sylan 2 sul Lago Maggiore.",
      },
      { property: "og:title", content: "Regolamento — Sylan 2 Community Trail Run" },
      {
        property: "og:description",
        content: "Regole di partecipazione della Community Trail Run non competitiva.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/regolamento" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/regolamento" }],
  }),
  component: () => (
    <LegalPage title="REGOLAMENTO DELLA COMMUNITY TRAIL RUN">
      <LegalBlock heading="NATURA DELL’EVENTO">
        <p>
          L&rsquo;evento è una Community Trail Run guidata e non competitiva. Non sono previsti
          classifica, cronometraggio ufficiale o premi legati alla performance.
        </p>
      </LegalBlock>
      <LegalBlock heading="PARTECIPAZIONE">
        <p>
          La partecipazione è riservata a maggiorenni, è a posti limitati e soggetta a conferma da
          parte dell&rsquo;organizzazione. L&rsquo;invio della richiesta non garantisce il posto.
        </p>
      </LegalBlock>
      <LegalBlock heading="SVOLGIMENTO E GUIDE">
        <p>
          Il gruppo è accompagnato da guide e pacer. I partecipanti si impegnano a rimanere sul
          percorso indicato, a seguire le istruzioni delle guide e a non allontanarsi dal gruppo.
        </p>
      </LegalBlock>
      <LegalBlock heading="IDONEITÀ E SICUREZZA">
        <p>
          L&rsquo;attività si svolge su terreno naturale e sconnesso e richiede un adeguato livello
          di preparazione fisica. Ogni partecipante dichiara di essere in condizioni idonee.
          [PLACEHOLDER — inserire requisiti di idoneità e prescrizioni di sicurezza definitive.]
        </p>
      </LegalBlock>
      <LegalBlock heading="ATTREZZATURA">
        <p>
          Le calzature Arc&rsquo;teryx Sylan 2 sono fornite in test per la durata
          dell&rsquo;attività. [PLACEHOLDER — inserire elenco attrezzatura consigliata e condizioni
          di restituzione.]
        </p>
      </LegalBlock>
      <LegalBlock heading="MODIFICHE, RINVII E ANNULLAMENTI">
        <p>
          L&rsquo;organizzazione può modificare percorso, orari o data, o annullare
          l&rsquo;attività, per ragioni di sicurezza, meteo o organizzative.
        </p>
      </LegalBlock>
      <LegalBlock heading="COMPORTAMENTO E AMBIENTE">
        <p>
          È richiesto un comportamento rispettoso verso gli altri partecipanti, i residenti e
          l&rsquo;ambiente naturale. Non è consentito abbandonare rifiuti lungo il percorso.
        </p>
      </LegalBlock>
      <LegalBlock heading="FOTO E VIDEO">
        <p>
          Durante l&rsquo;evento sono previste riprese foto e video. La liberatoria per immagini e
          video è raccolta separatamente e solo dai partecipanti accettati. [PLACEHOLDER — testo
          definitivo della liberatoria.]
        </p>
      </LegalBlock>
      <LegalBlock heading="RESPONSABILITÀ">
        <p>[PLACEHOLDER — inserire clausole finali di responsabilità e copertura assicurativa.]</p>
      </LegalBlock>
    </LegalPage>
  ),
});
