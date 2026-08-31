import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getConfirmationContext, submitConfirmation } from "@/lib/confirm.functions";
import { CheckRow, Field, inputClass } from "@/components/site/Primitives";

export const Route = createFileRoute("/confirm/$token")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Conferma partecipazione — Sylan 2 Community Trail Run" },
      {
        name: "description",
        content:
          "Conferma il tuo posto alla Community Trail Run Arc'teryx × VIETTI Sylan 2 sul Lago Maggiore.",
      },
      { property: "og:title", content: "Conferma partecipazione — Sylan 2 Community Trail Run" },
      { property: "og:description", content: "Conferma il tuo posto alla Sylan 2 Community Trail Run." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Confirm,
});

function Confirm() {
  const { token } = Route.useParams();
  const getCtx = useServerFn(getConfirmationContext);
  const submit = useServerFn(submitConfirmation);
  const [ctx, setCtx] = useState<Awaited<ReturnType<typeof getConfirmationContext>> | null>(null);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [acks, setAcks] = useState({ attending: false, rules: false, image: false });

  useEffect(() => {
    getCtx({ data: { token } })
      .then(setCtx)
      .catch(() => setError("Questo link non è valido."));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (error) return <Shell><p className="text-sm text-muted-foreground">{error}</p></Shell>;
  if (!ctx) return <Shell><p className="tech-sm">CARICAMENTO…</p></Shell>;
  if (!ctx.found)
    return (
      <Shell>
        <p className="text-sm text-muted-foreground">Questo link di conferma non è valido.</p>
      </Shell>
    );
  if (!ctx.eligible)
    return (
      <Shell>
        <p className="text-sm text-muted-foreground">
          Questa richiesta non è al momento idonea alla conferma. Stato attuale: {ctx.status}.
        </p>
      </Shell>
    );
  if (done)
    return (
      <Shell>
        <h1 className="display text-4xl sm:text-6xl">
          PARTECIPAZIONE
          <span className="block text-jade-soft">CONFERMATA</span>
        </h1>
        <p className="mt-6 text-sm text-muted-foreground">
          Grazie. I dettagli finali verranno inviati prima dell&rsquo;evento.
        </p>
      </Shell>
    );

  return (
    <Shell>
      <div className="tech-sm">FASE DUE — PARTECIPANTI ACCETTATI</div>
      <h1 className="display mt-6 text-4xl sm:text-6xl">
        CONFERMA IL TUO
        <span className="block text-jade-soft">POSTO</span>
      </h1>
      <p className="mt-6 max-w-lg text-sm text-muted-foreground">
        Benvenuto/a {ctx.firstName}. La tua richiesta è stata accettata. Completa i dati qui sotto
        per confermare la partecipazione. Taglia registrata: {ctx.shoeSize}.
      </p>

      <form
        className="mt-12 grid gap-8"
        onSubmit={async (e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          if (!acks.attending || !acks.rules || !acks.image) {
            setError("Tutte le conferme sono obbligatorie.");
            return;
          }
          const res = await submit({
            data: {
              token,
              attending: true,
              emergencyName: String(fd.get("emergencyName") ?? ""),
              emergencyPhone: String(fd.get("emergencyPhone") ?? ""),
              finalShoeSize: String(fd.get("finalShoeSize") ?? ""),
              rulesAck: true,
              imageRelease: true,
            },
          });
          if (res.ok) setDone(true);
          else setError("Non è stato possibile salvare la conferma.");
        }}
      >
        <div className="grid gap-x-12 gap-y-6 sm:grid-cols-2">
          <Field label="Nome contatto di emergenza" required>
            <input name="emergencyName" required maxLength={120} className={inputClass} />
          </Field>
          <Field label="Telefono contatto di emergenza" required>
            <input name="emergencyPhone" required maxLength={40} className={inputClass} />
          </Field>
          <Field label="Taglia scarpa definitiva" required>
            <input name="finalShoeSize" required maxLength={20} className={inputClass} />
          </Field>
        </div>

        <div>
          <CheckRow
            checked={acks.attending}
            onChange={(v) => setAcks((a) => ({ ...a, attending: v }))}
          >
            Confermo la mia presenza all&rsquo;evento.
          </CheckRow>
          <CheckRow checked={acks.rules} onChange={(v) => setAcks((a) => ({ ...a, rules: v }))}>
            Dichiaro di aver letto e accettato il{" "}
            <a
              href="/regolamento"
              target="_blank"
              rel="noreferrer"
              className="text-jade-soft underline"
            >
              Regolamento della Community Trail Run
            </a>{" "}
            e di partecipare al briefing di sicurezza.
          </CheckRow>
          <CheckRow checked={acks.image} onChange={(v) => setAcks((a) => ({ ...a, image: v }))}>
            Accetto la liberatoria per immagini e video ai fini dello storytelling Arc&rsquo;teryx ×
            VIETTI. [PLACEHOLDER — TESTO DEFINITIVO, RICHIEDE REVISIONE LEGALE]
          </CheckRow>
        </div>

        {error ? <p className="text-xs text-destructive">{error}</p> : null}
        <button
          type="submit"
          className="tech w-fit border border-jade bg-jade px-8 py-4 text-primary-foreground hover:jade-glow"
        >
          CONFERMA PARTECIPAZIONE
        </button>
      </form>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return <main className="mx-auto min-h-screen w-full max-w-3xl px-6 py-24">{children}</main>;
}
