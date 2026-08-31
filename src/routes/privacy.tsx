import { createFileRoute } from "@tanstack/react-router";
import { LegalBlock, LegalPage } from "@/components/site/LegalPage";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Informativa Privacy — Sylan 2 Community Trail Run | Arc'teryx × VIETTI" },
      {
        name: "description",
        content:
          "Informativa privacy ex art. 13 GDPR sui dati personali trattati per le richieste di partecipazione alla Sylan 2 Community Trail Run.",
      },
      { property: "og:title", content: "Informativa Privacy — Sylan 2 Community Trail Run" },
      {
        property: "og:description",
        content: "Come vengono trattati i dati delle richieste di partecipazione.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/privacy" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: () => (
    <LegalPage title="INFORMATIVA PRIVACY">
      <p className="text-xs text-muted-foreground">
        Informativa resa ai sensi dell&rsquo;art. 13 del Regolamento (UE) 2016/679 (GDPR).
      </p>
      <LegalBlock heading="TITOLARE DEL TRATTAMENTO">
        <p>
          [PLACEHOLDER — inserire la ragione sociale del titolare del trattamento, sede, P.IVA e
          contatti. Eventuale responsabile della protezione dei dati (DPO).]
        </p>
      </LegalBlock>
      <LegalBlock heading="DATI TRATTATI">
        <p>
          Dati identificativi e di contatto (nome, cognome, email, telefono), città, esperienza di
          running e trail running, passo indicativo, data preferita e altre date disponibili, taglia
          e fitting della calzatura, profilo Instagram facoltativo, breve descrizione facoltativa,
          oltre ai registri dei consensi con data, ora e versione dell&rsquo;informativa. Nella fase
          di richiesta non vengono raccolti dati sanitari.
        </p>
      </LegalBlock>
      <LegalBlock heading="FINALITÀ E BASE GIURIDICA">
        <p>
          Gestione e valutazione delle richieste di partecipazione, organizzazione
          dell&rsquo;attività e comunicazioni collegate: esecuzione di misure precontrattuali e
          contrattuali (art. 6.1.b GDPR). Adempimenti di legge: art. 6.1.c GDPR. Comunicazioni
          marketing: consenso facoltativo e revocabile (art. 6.1.a GDPR).
        </p>
      </LegalBlock>
      <LegalBlock heading="DESTINATARI">
        <p>
          [PLACEHOLDER — indicare fornitori di servizi IT, hosting, agenzie e partner che agiscono
          come responsabili del trattamento, ed eventuali trasferimenti extra UE con relative
          garanzie.]
        </p>
      </LegalBlock>
      <LegalBlock heading="CONSERVAZIONE">
        <p>
          [PLACEHOLDER — definire i tempi di conservazione per richieste, consensi e dati dei
          partecipanti confermati.]
        </p>
      </LegalBlock>
      <LegalBlock heading="NATURA DEL CONFERIMENTO">
        <p>
          Il conferimento dei dati contrassegnati come obbligatori è necessario per gestire la
          richiesta; il mancato conferimento impedisce la valutazione della partecipazione. I dati
          facoltativi possono essere omessi liberamente.
        </p>
      </LegalBlock>
      <LegalBlock heading="DIRITTI DELL’INTERESSATO">
        <p>
          Accesso, rettifica, cancellazione, limitazione, portabilità, opposizione e revoca del
          consenso in qualsiasi momento, oltre al diritto di reclamo al Garante per la protezione
          dei dati personali. [PLACEHOLDER — indirizzo email per l&rsquo;esercizio dei diritti.]
        </p>
      </LegalBlock>
    </LegalPage>
  ),
});
