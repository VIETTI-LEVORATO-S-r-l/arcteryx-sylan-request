import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { submitApplication } from "@/lib/event.functions";
import {
  DIETARY_PROFILES,
  LONGEST_RUN,
  MONTHLY_ELEVATION,
  PACE_RANGES,
  RUNNING_LEVELS,
  TRAIL_LEVELS,
  WEEKLY_VOLUME,
  type EventPayload,
} from "@/lib/types";
import { CheckRow, Field, inputClass, selectClass } from "./Primitives";

function Step({ n, title, hint }: { n: string; title: string; hint?: string }) {
  return (
    <div className="mb-5 grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-3 border-t border-border pt-4">
      <span className="tech-sm text-jade-soft">{n}</span>
      <div className="min-w-0">
        <div className="tech text-foreground">{title}</div>
        {hint ? <div className="tech-sm mt-1 normal-case tracking-normal">{hint}</div> : null}
      </div>
    </div>
  );
}
import { DateBoard } from "./DateBoard";
import { formatDate } from "@/lib/queries";
import { cn } from "@/lib/utils";

type Consents = {
  isAdult: boolean;
  terrainAck: boolean;
  fitnessAck: boolean;
  rulesAck: boolean;
  noGuaranteeAck: boolean;
  privacyAck: boolean;
  marketingVietti: boolean;
  marketingArcteryx: boolean;
};

export function ApplicationForm({ data }: { data: EventPayload }) {
  const navigate = useNavigate();
  const submit = useServerFn(submitApplication);
  const [preferredDateId, setPreferredDateId] = useState<string | null>(
    data.event.finalDateId ?? null,
  );
  const [otherDateIds, setOtherDateIds] = useState<string[]>([]);
  const [consents, setConsents] = useState<Consents>({
    isAdult: false,
    terrainAck: false,
    fitnessAck: false,
    rulesAck: false,
    noGuaranteeAck: false,
    privacyAck: false,
    marketingVietti: false,
    marketingArcteryx: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [description, setDescription] = useState("");

  const setConsent = (k: keyof Consents) => (v: boolean) => setConsents((c) => ({ ...c, [k]: v }));

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (!preferredDateId) {
      setError("Seleziona una data preferita.");
      return;
    }
    const required: (keyof Consents)[] = [
      "isAdult",
      "terrainAck",
      "fitnessAck",
      "rulesAck",
      "noGuaranteeAck",
      "privacyAck",
    ];
    if (required.some((k) => !consents[k])) {
      setError("Tutte le dichiarazioni obbligatorie devono essere accettate.");
      return;
    }
    const fd = new FormData(e.currentTarget);
    const v = (k: string) => String(fd.get(k) ?? "").trim();
    setPending(true);
    try {
      const res = await submit({
        data: {
          firstName: v("firstName"),
          lastName: v("lastName"),
          email: v("email"),
          phone: v("phone"),
          city: v("city"),
          country: "",
          preferredDateId,
          otherDateIds,
          runningLevel: v("runningLevel"),
          trailExperience: v("trailExperience"),
          pace: v("pace"),
          weeklyVolume: v("weeklyVolume"),
          longestRun: v("longestRun"),
          monthlyElevation: v("monthlyElevation"),
          recentActivity: v("recentActivity"),
          dietaryProfile: v("dietaryProfile"),
          foodAllergies: v("foodAllergies"),
          shoeSizeSystem: v("shoeSizeSystem") as "EU" | "UK",
          shoeSize: v("shoeSize"),
          footwearFit: v("footwearFit") as "MEN'S" | "WOMEN'S",
          instagramHandle: v("instagramHandle"),
          runnerDescription: description.slice(0, 300),
          isAdult: true,
          terrainAck: true,
          fitnessAck: true,
          rulesAck: true,
          noGuaranteeAck: true,
          privacyAck: true,
          marketingVietti: consents.marketingVietti,
          marketingArcteryx: consents.marketingArcteryx,
          website: v("website"),
        },
      });
      if (!res.ok) {
        setError(res.error);
        setPending(false);
        return;
      }
      await navigate({ to: "/request-received" });
    } catch {
      setError("Controlla il modulo: alcune informazioni obbligatorie mancano o non sono valide.");
      setPending(false);
    }
  }

  if (!data.event.applicationsOpen) {
    return (
      <div className="border border-border p-8">
        <div className="tech mb-3 text-jade-soft">RICHIESTE CHIUSE</div>
        <p className="max-w-xl text-sm text-muted-foreground">
          Le richieste di partecipazione sono attualmente chiuse. Segui VIETTI per le prossime
          attività Arc&rsquo;teryx.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-10">
      {data.event.waitlistMode ? (
        <p className="border border-jade/60 p-4 text-xs text-jade-soft">
          Le richieste hanno superato la capienza iniziale dell&rsquo;evento. Le nuove richieste
          possono essere inserite in lista d&rsquo;attesa.
        </p>
      ) : null}

      <div>
        <Step n="01" title="I TUOI DATI" hint="Servono per contattarti in caso di conferma." />
        <div className="grid gap-x-12 gap-y-6 sm:grid-cols-2">
          <Field label="Nome" required>
            <input name="firstName" required maxLength={80} className={inputClass} />
          </Field>
          <Field label="Cognome" required>
            <input name="lastName" required maxLength={80} className={inputClass} />
          </Field>
          <Field label="Email" required>
            <input name="email" type="email" required maxLength={255} className={inputClass} />
          </Field>
          <Field label="Telefono" required>
            <input name="phone" required maxLength={40} className={inputClass} />
          </Field>
          <Field label="Città" required>
            <input name="city" required maxLength={120} className={inputClass} />
          </Field>
          <Field label="Instagram">
            <input name="instagramHandle" maxLength={60} placeholder="@" className={inputClass} />
          </Field>
        </div>
      </div>

      <div>
        <Step n="02" title="LA TUA DATA PREFERITA" hint="Tocca una delle tre date. Obbligatorio." />
        <DateBoard
          dates={data.dates}
          leadingDateId={data.leadingDateId}
          total={data.total}
          weatherEnabled={false}
          weatherUpdatedAt={null}
          selectable
          selectedId={preferredDateId}
          onSelect={setPreferredDateId}
        />
      </div>

      <div>
        <Step n="03" title="ALTRE DATE DISPONIBILI" hint="Facoltativo — aiuta l'organizzazione." />
        <div className="grid sm:grid-cols-3">
          {data.dates.map((d) => {
            const f = formatDate(d.date);
            const checked = otherDateIds.includes(d.id);
            return (
              <CheckRow
                key={d.id}
                checked={checked}
                onChange={(v) =>
                  setOtherDateIds((prev) => (v ? [...prev, d.id] : prev.filter((x) => x !== d.id)))
                }
              >
                {f.day} {f.month}
              </CheckRow>
            );
          })}
        </div>
      </div>

      <div>
        <Step n="04" title="PROFILO RUNNING E FITTING SYLAN 2" />
        <div className="grid gap-x-12 gap-y-6 sm:grid-cols-2">
          <Field label="Esperienza di running" required>
            <select name="runningLevel" required className={selectClass} defaultValue="">
              <option value="" disabled>
                Seleziona
              </option>
              {RUNNING_LEVELS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Esperienza di trail running" required>
            <select name="trailExperience" required className={selectClass} defaultValue="">
              <option value="" disabled>
                Seleziona
              </option>
              {TRAIL_LEVELS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Passo indicativo">
            <select name="pace" className={selectClass} defaultValue="">
              <option value="">Seleziona un intervallo</option>
              {PACE_RANGES.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Volume settimanale medio" required>
            <select name="weeklyVolume" required className={selectClass} defaultValue="">
              <option value="" disabled>
                Seleziona
              </option>
              {WEEKLY_VOLUME.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Uscita più lunga negli ultimi 3 mesi" required>
            <select name="longestRun" required className={selectClass} defaultValue="">
              <option value="" disabled>
                Seleziona
              </option>
              {LONGEST_RUN.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Dislivello positivo mensile" required>
            <select name="monthlyElevation" required className={selectClass} defaultValue="">
              <option value="" disabled>
                Seleziona
              </option>
              {MONTHLY_ELEVATION.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </Field>
          <Field
            label="Attività recenti significative"
            hint="Es. percorsi, dislivelli o uscite lunghe degli ultimi mesi."
          >
            <input name="recentActivity" maxLength={300} className={inputClass} />
          </Field>
          <Field label="Sistema taglie" required>
            <select name="shoeSizeSystem" required className={selectClass} defaultValue="EU">
              <option value="EU">EU</option>
              <option value="UK">UK</option>
            </select>
          </Field>
          <Field label="Taglia scarpa" required>
            <input name="shoeSize" required maxLength={10} className={inputClass} />
          </Field>
          <Field label="Fitting Sylan 2" required>
            <select name="footwearFit" required className={selectClass} defaultValue="MEN'S">
              <option value="MEN'S">UOMO</option>
              <option value="WOMEN'S">DONNA</option>
            </select>
          </Field>
        </div>
      </div>

      <Field label="Breve descrizione della tua esperienza" hint={`${description.length}/300`}>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value.slice(0, 300))}
          rows={4}
          maxLength={300}
          className={cn(inputClass, "resize-none")}
        />
      </Field>

      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="pointer-events-none absolute h-0 w-0 opacity-0"
      />

      <div>
        <Step
          n="05"
          title="LUNCH BOX ED ESIGENZE ALIMENTARI"
          hint="Al termine dell'esperienza è previsto un lunch box. Indica eventuali esigenze per permetterci di prepararlo correttamente."
        />
        <div className="grid gap-x-12 gap-y-6 sm:grid-cols-2">
          <Field label="Profilo alimentare" required>
            <select name="dietaryProfile" required className={selectClass} defaultValue="">
              <option value="" disabled>
                Seleziona
              </option>
              {DIETARY_PROFILES.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </Field>
          <Field
            label="Allergie o intolleranze alimentari"
            hint="Indica solo le informazioni necessarie alla preparazione del lunch box."
          >
            <input name="foodAllergies" maxLength={300} className={inputClass} />
          </Field>
        </div>
      </div>

      <div>
        <Step n="06" title="DICHIARAZIONI OBBLIGATORIE" />
        <CheckRow checked={consents.isAdult} onChange={setConsent("isAdult")}>
          Dichiaro di avere 18 anni compiuti.
        </CheckRow>
        <CheckRow checked={consents.terrainAck} onChange={setConsent("terrainAck")}>
          Sono consapevole che si tratta di una Community Trail Run guidata e non competitiva, che
          si svolge su terreno naturale e sconnesso e richiede un adeguato livello di preparazione
          fisica.
        </CheckRow>
        <CheckRow checked={consents.fitnessAck} onChange={setConsent("fitnessAck")}>
          Dichiaro di essere in condizioni fisiche idonee a prendere parte all&rsquo;attività
          proposta.
        </CheckRow>
        <CheckRow checked={consents.rulesAck} onChange={setConsent("rulesAck")}>
          Ho letto e accetto il{" "}
          <a
            href="/regolamento"
            target="_blank"
            rel="noreferrer"
            className="text-jade-soft underline"
          >
            Regolamento della Community Trail Run
          </a>{" "}
          e mi impegno a seguire le indicazioni delle guide.
        </CheckRow>
        <CheckRow checked={consents.noGuaranteeAck} onChange={setConsent("noGuaranteeAck")}>
          Sono consapevole che l&rsquo;invio della richiesta non garantisce la partecipazione, che
          resta soggetta a conferma da parte dell&rsquo;organizzazione.
        </CheckRow>
        <CheckRow checked={consents.privacyAck} onChange={setConsent("privacyAck")}>
          Ho letto l&rsquo;
          <a href="/privacy" target="_blank" rel="noreferrer" className="text-jade-soft underline">
            Informativa Privacy
          </a>{" "}
          relativa al trattamento dei miei dati personali per la gestione della richiesta di
          partecipazione.
        </CheckRow>

        <div className="tech-sm mt-8 mb-2">FACOLTATIVO — MARKETING</div>
        <CheckRow checked={consents.marketingVietti} onChange={setConsent("marketingVietti")}>
          Desidero ricevere novità e comunicazioni marketing da VIETTI.
        </CheckRow>
        <CheckRow checked={consents.marketingArcteryx} onChange={setConsent("marketingArcteryx")}>
          Desidero ricevere novità e comunicazioni marketing da Arc&rsquo;teryx.
          <span className="block opacity-60">
            [CONFIGURABILE — ATTIVARE SOLO SE PREVISTO E APPROVATO]
          </span>
        </CheckRow>
      </div>

      {error ? (
        <p
          role="alert"
          className="border-l-2 border-destructive bg-card p-4 text-xs leading-relaxed text-destructive"
        >
          {error}
        </p>
      ) : null}

      <div className="flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="tech-sm max-w-md normal-case tracking-normal">
          L&rsquo;invio del modulo non conferma automaticamente il posto.
        </p>
        <button
          type="submit"
          disabled={pending}
          className="cta cta-solid w-full disabled:pointer-events-none disabled:opacity-50 sm:w-auto"
        >
          {pending ? "INVIO IN CORSO…" : "RICHIEDI DI PARTECIPARE"}
          <span className="cta-arrow" aria-hidden>
            →
          </span>
        </button>
      </div>
    </form>
  );
}
