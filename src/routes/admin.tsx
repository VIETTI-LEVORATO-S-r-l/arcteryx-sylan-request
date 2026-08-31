import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  adminLogin,
  adminLogout,
  adminSessionStatus,
  exportApplicationsCsv,
  getAdminDashboard,
  getConfirmationLink,
  setApplicationStatus,
  setDateOptions,
  updateEventConfig,
} from "@/lib/admin.functions";
import { formatDate } from "@/lib/queries";
import { inputClass, selectClass } from "@/components/site/Primitives";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Dashboard organizzazione — Sylan 2 Community Trail Run" },
      { name: "description", content: "Area riservata dell'organizzazione della Sylan 2 Community Trail Run." },
      { property: "og:title", content: "Dashboard organizzazione — Sylan 2 Community Trail Run" },
      { property: "og:description", content: "Area riservata dell'organizzazione." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/admin" }],
  }),
  component: Admin,
});

const STATUSES = [
  "APPLICATION_RECEIVED",
  "WAITLISTED",
  "ACCEPTED",
  "DECLINED",
  "CONFIRMED",
  "CANCELLED",
] as const;

const COMPLIANCE_ITEMS = [
  {
    key: "positioning",
    label: "POSIZIONAMENTO NON COMPETITIVO",
    hint: "Nessun riferimento a gara, competizione, classifica, cronometraggio o premi legati alla performance in tutti i testi e nelle comunicazioni.",
  },
  {
    key: "rules",
    label: "REGOLAMENTO PUBBLICATO",
    hint: "Regolamento della Community Trail Run rivisto legalmente, pubblicato e collegato nel modulo di richiesta.",
  },
  {
    key: "privacy",
    label: "INFORMATIVA PRIVACY ART. 13 GDPR",
    hint: "Titolare, finalità, basi giuridiche, destinatari, conservazione e diritti compilati e verificati.",
  },
  {
    key: "consents",
    label: "REGISTRO DEI CONSENSI",
    hint: "Consensi obbligatori e marketing registrati separatamente con data, ora e versione della policy.",
  },
  {
    key: "no_medical",
    label: "NESSUN DATO SANITARIO IN FASE DI RICHIESTA",
    hint: "Il modulo iniziale non raccoglie dati relativi alla salute.",
  },
  {
    key: "media",
    label: "LIBERATORIA FOTO E VIDEO",
    hint: "Avviso di produzione foto/video sul sito e liberatoria separata solo per i partecipanti accettati.",
  },
  {
    key: "capacity",
    label: "CAPIENZA E LISTA D’ATTESA",
    hint: "Capienza, numero massimo di richieste e gestione della lista d'attesa configurati.",
  },
  {
    key: "safety",
    label: "SICUREZZA E BRIEFING",
    hint: "Guide, pacer, piano di sicurezza, contatti di emergenza e briefing pre-partenza definiti.",
  },
  {
    key: "weather",
    label: "METEO E DISCLAIMER",
    hint: "Dati meteo da fonte reale, indicatore di affidabilità e disclaimer visibili.",
  },
  {
    key: "cookies",
    label: "COOKIE E STRUMENTI DI MISURAZIONE",
    hint: "Cookie policy aggiornata ed eventuale consent management attivo prima della pubblicazione.",
  },
] as const;

type Dashboard = Awaited<ReturnType<typeof getAdminDashboard>>;

function Admin() {
  const login = useServerFn(adminLogin);
  const logout = useServerFn(adminLogout);
  const status = useServerFn(adminSessionStatus);
  const load = useServerFn(getAdminDashboard);
  const setStatus = useServerFn(setApplicationStatus);
  const saveConfig = useServerFn(updateEventConfig);
  const saveDates = useServerFn(setDateOptions);
  const exportCsv = useServerFn(exportApplicationsCsv);
  const confirmLink = useServerFn(getConfirmationLink);

  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Dashboard | null>(null);
  const [q, setQ] = useState("");
  const [fLevel, setFLevel] = useState("");
  const [fDate, setFDate] = useState("");
  const [fShoe, setFShoe] = useState("");
  const [notice, setNotice] = useState<string | null>(null);

  const refresh = async () => setData(await load());

  useEffect(() => {
    status().then((s) => {
      setUnlocked(s.unlocked);
      if (s.unlocked) void refresh();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    if (!data) return [];
    const needle = q.trim().toLowerCase();
    return data.applications.filter((a) => {
      const hay = `${a.first_name} ${a.last_name} ${a.email} ${a.city} ${a.country}`.toLowerCase();
      return (
        (!needle || hay.includes(needle)) &&
        (!fLevel || a.running_level === fLevel) &&
        (!fDate || a.preferred_date_id === fDate) &&
        (!fShoe || `${a.shoe_size_system} ${a.shoe_size}` === fShoe)
      );
    });
  }, [data, q, fLevel, fDate, fShoe]);

  if (!unlocked) {
    return (
      <main className="grid min-h-screen place-items-center px-6">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const res = await login({ data: { password } });
            if (res.ok) {
              setUnlocked(true);
              setError(null);
              await refresh();
            } else setError("Password non corretta.");
          }}
          className="w-full max-w-sm"
        >
          <div className="tech-sm mb-6">ACCESSO ORGANIZZAZIONE</div>
          <h1 className="display mb-8 text-4xl">DASHBOARD</h1>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            placeholder="Password"
          />
          {error ? <p className="mt-3 text-xs text-destructive">{error}</p> : null}
          <button
            type="submit"
            className="tech mt-8 w-full border border-jade bg-jade py-4 text-primary-foreground hover:jade-glow"
          >
            ACCEDI
          </button>
        </form>
      </main>
    );
  }

  if (!data) return <main className="tech grid min-h-screen place-items-center">CARICAMENTO…</main>;

  const dateMap = new Map(data.dates.map((d) => [d.id, d.event_date]));
  const shoeSizes = Array.from(
    new Set(data.applications.map((a) => `${a.shoe_size_system} ${a.shoe_size}`)),
  ).sort();
  const confirmedCount = data.applications.filter((a) => a.status === "CONFIRMED").length;
  const checklist = (data.event.compliance_checklist ?? {}) as Record<string, boolean>;

  const patch = async (payload: Record<string, unknown>) => {
    await saveConfig({ data: payload as never });
    await refresh();
    setNotice("Salvato.");
  };

  return (
    <main className="min-h-screen px-6 py-10 sm:px-10">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-border pb-6">
        <h1 className="display truncate text-2xl">DASHBOARD ORGANIZZAZIONE</h1>
        <button
          className="tech-sm shrink-0 border border-border px-4 py-2"
          onClick={async () => {
            await logout();
            setUnlocked(false);
            setData(null);
          }}
        >
          BLOCCA
        </button>
      </header>

      <section className="mt-8 grid gap-px bg-border sm:grid-cols-4">
        {[
          ["RICHIESTE", data.applications.length],
          ["CAPIENZA PARTECIPANTI", data.event.capacity],
          ["POSTI DISPONIBILI", Math.max(data.event.capacity - confirmedCount, 0)],
          ["PARTECIPANTI CONFERMATI", confirmedCount],
        ].map(([k, v]) => (
          <div key={String(k)} className="bg-background p-6">
            <div className="tech-sm">{k}</div>
            <div className="display mt-3 text-4xl tabular-nums">{v}</div>
          </div>
        ))}
      </section>
      <p className="tech-sm mt-3">
        NOTA — IL NUMERO DI RICHIESTE NON CORRISPONDE AI PARTECIPANTI CONFERMATI
      </p>

      <section className="mt-12">
        <h2 className="tech mb-4 text-foreground">PREFERENZA DELLE DATE</h2>
        <div className="grid gap-px bg-border sm:grid-cols-3">
          {data.stats.map((s) => (
            <div key={s.id} className="bg-background p-5">
              <div className="tech-sm">{formatDate(s.date).long}</div>
              <div className="display mt-2 text-3xl tabular-nums">{s.pct}%</div>
              <div className="tech-sm mt-1">{s.count} PREFERENZE</div>
              <div className="tech-sm mt-1">
                +{" "}
                {
                  data.availability.filter((a) => a.date_option_id === s.id).length
                }{" "}
                ANCHE DISPONIBILI
              </div>
              <button
                className={cn(
                  "tech-sm mt-4 border px-3 py-2",
                  data.event.final_date_id === s.id ? "border-jade text-jade-soft" : "border-border",
                )}
                onClick={() =>
                  patch({ final_date_id: data.event.final_date_id === s.id ? null : s.id })
                }
              >
                {data.event.final_date_id === s.id ? "DATA FINALE — CLICCA PER ANNULLARE" : "CONFERMA COME DATA FINALE"}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="tech mb-4 text-foreground">IMPOSTAZIONI EVENTO</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {(
              [
                ["meeting_time", "ORARIO DI RITROVO"],
                ["meeting_point", "PUNTO DI RITROVO"],
                ["distance_km", "DISTANZA"],
                ["elevation_m", "DISLIVELLO"],
                ["surface", "FONDO"],
                ["route_notes", "NOTE PERCORSO"],
                ["privacy_url", "LINK PRIVACY"],
                ["terms_url", "LINK TERMINI"],
                ["cookie_url", "LINK COOKIE"],
                ["rules_url", "LINK REGOLAMENTO"],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="block">
                <span className="tech-sm">{label}</span>
                <input
                  defaultValue={String(data.event[key] ?? "")}
                  className={inputClass}
                  onBlur={(e) => patch({ [key]: e.target.value })}
                />
              </label>
            ))}
            <label className="block">
              <span className="tech-sm">CAPIENZA PARTECIPANTI</span>
              <input
                type="number"
                defaultValue={data.event.capacity}
                className={inputClass}
                onBlur={(e) => patch({ capacity: Number(e.target.value) })}
              />
            </label>
            <label className="block">
              <span className="tech-sm">NUMERO MASSIMO DI RICHIESTE</span>
              <input
                type="number"
                defaultValue={data.event.max_applications}
                className={inputClass}
                onBlur={(e) => patch({ max_applications: Number(e.target.value) })}
              />
            </label>
            <label className="block">
              <span className="tech-sm">DATE PROVVISORIE (SEPARATE DA VIRGOLA, AAAA-MM-GG)</span>
              <input
                defaultValue={data.dates
                  .filter((d) => d.is_active)
                  .map((d) => d.event_date)
                  .join(", ")}
                className={inputClass}
                onBlur={async (e) => {
                  const dates = e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean);
                  if (dates.length) {
                    await saveDates({ data: { dates } });
                    await refresh();
                    setNotice("Date aggiornate.");
                  }
                }}
              />
            </label>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            {(
              [
                ["applications_open", "RICHIESTE APERTE"],
                ["waitlist_mode", "LISTA D'ATTESA"],
                ["weather_enabled", "METEO VISIBILE"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                onClick={() => patch({ [key]: !data.event[key] })}
                className={cn(
                  "tech-sm border px-4 py-2",
                  data.event[key] ? "border-jade text-jade-soft" : "border-border",
                )}
              >
                {label} — {data.event[key] ? "ATTIVO" : "DISATTIVO"}
              </button>
            ))}
            <button
              className="tech-sm border border-border px-4 py-2"
              onClick={async () => {
                const { csv } = await exportCsv();
                const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
                const a = document.createElement("a");
                a.href = url;
                a.download = "applications.csv";
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              ESPORTA CSV
            </button>
          </div>
          {notice ? <p className="tech-sm mt-4 text-jade-soft">{notice}</p> : null}
        </div>

        <div>
          <h2 className="tech mb-4 text-foreground">FILTRI</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              placeholder="Cerca nome, email, città"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className={inputClass}
            />
            <select value={fLevel} onChange={(e) => setFLevel(e.target.value)} className={selectClass}>
              <option value="">Tutti i livelli di running</option>
              {Array.from(new Set(data.applications.map((a) => a.running_level))).map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
            <select value={fDate} onChange={(e) => setFDate(e.target.value)} className={selectClass}>
              <option value="">Tutte le date preferite</option>
              {data.dates.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.event_date}
                </option>
              ))}
            </select>
            <select value={fShoe} onChange={(e) => setFShoe(e.target.value)} className={selectClass}>
              <option value="">Tutte le taglie</option>
              {shoeSizes.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="tech mb-4 text-foreground">CHECKLIST DI CONFORMITÀ DELL’EVENTO</h2>
        <p className="tech-sm mb-4 normal-case tracking-normal">
          Uso interno. Verificare ogni punto prima della pubblicazione e prima dell&rsquo;evento.
        </p>
        <div className="grid gap-px bg-border sm:grid-cols-2">
          {COMPLIANCE_ITEMS.map((item) => {
            const done = Boolean(checklist[item.key]);
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => patch({ compliance_checklist: { ...checklist, [item.key]: !done } })}
                className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-4 bg-background p-5 text-left"
              >
                <span
                  className={cn(
                    "mt-0.5 grid h-4 w-4 shrink-0 place-items-center border",
                    done ? "border-jade bg-jade" : "border-border",
                  )}
                >
                  {done ? <span className="block h-1.5 w-1.5 bg-primary-foreground" /> : null}
                </span>
                <span>
                  <span className="tech-sm block text-foreground">{item.label}</span>
                  <span className="mt-2 block text-xs leading-relaxed text-muted-foreground">
                    {item.hint}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
        <p className="tech-sm mt-4">
          COMPLETATI — {COMPLIANCE_ITEMS.filter((i) => checklist[i.key]).length} /{" "}
          {COMPLIANCE_ITEMS.length}
        </p>
      </section>

      <section className="mt-12">
        <h2 className="tech mb-4 text-foreground">RICHIEDENTI — {filtered.length}</h2>
        <div className="overflow-x-auto border border-border">
          <table className="w-full min-w-[900px] text-left text-xs">
            <thead>
              <tr className="border-b border-border">
                {["NOME", "CONTATTI", "LUOGO", "DATA PREFERITA", "LIVELLO", "CALZATURA", "STATO", ""].map(
                  (h) => (
                    <th key={h} className="tech-sm p-3 font-normal">
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id} className="border-b border-border align-top">
                  <td className="p-3">
                    {a.first_name} {a.last_name}
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {a.email}
                    <br />
                    {a.phone}
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {a.city}, {a.country}
                  </td>
                  <td className="p-3 tabular-nums">{dateMap.get(a.preferred_date_id)}</td>
                  <td className="p-3 text-muted-foreground">
                    {a.running_level}
                    <br />
                    {a.trail_experience}
                  </td>
                  <td className="p-3 tabular-nums">
                    {a.shoe_size_system} {a.shoe_size} {a.footwear_fit}
                  </td>
                  <td className="p-3">
                    <select
                      value={a.status}
                      className={selectClass}
                      onChange={async (e) => {
                        await setStatus({
                          data: { id: a.id, status: e.target.value as (typeof STATUSES)[number] },
                        });
                        await refresh();
                      }}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-3">
                    <button
                      className="tech-sm border border-border px-2 py-1"
                      onClick={async () => {
                        const { path } = await confirmLink({ data: { id: a.id } });
                        if (path) {
                          await navigator.clipboard?.writeText(window.location.origin + path);
                          setNotice(`Link di conferma copiato per ${a.first_name}.`);
                        }
                      }}
                    >
                      COPIA LINK
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
