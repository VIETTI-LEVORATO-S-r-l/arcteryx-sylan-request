import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-6 py-24">
      <Link to="/" className="tech-sm hover:text-jade-soft">
        ← ARC&rsquo;TERYX × VIETTI / SYLAN 2 COMMUNITY TRAIL RUN
      </Link>
      <h1 className="display mt-10 text-4xl sm:text-6xl">{title}</h1>
      <p className="tech-sm mt-4 border border-jade/50 px-3 py-2 text-jade-soft">
        BOZZA — RICHIEDE REVISIONE LEGALE
      </p>
      <div className="mt-12 space-y-8 text-sm leading-relaxed text-muted-foreground">{children}</div>
      <p className="tech-sm mt-16 border-t border-border pt-6">
        TITOLARE DEL TRATTAMENTO — [RAGIONE SOCIALE] · [INDIRIZZO] · [P.IVA] · CONTATTO [EMAIL] ·
        RICHIESTE DI ACCESSO, RETTIFICA O CANCELLAZIONE — [EMAIL]
      </p>
    </main>
  );
}

export function LegalBlock({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="tech mb-3 text-foreground">{heading}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
