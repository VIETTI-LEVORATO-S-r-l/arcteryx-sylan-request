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
      { title: "Organizer Dashboard — Sylan 2 Trail Run" },
      { name: "description", content: "Private organizer dashboard for the Sylan 2 Trail Run." },
      { property: "og:title", content: "Organizer Dashboard — Sylan 2 Trail Run" },
      { property: "og:description", content: "Private organizer dashboard." },
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
            } else setError("Incorrect password.");
          }}
          className="w-full max-w-sm"
        >
          <div className="tech-sm mb-6">ORGANIZER ACCESS</div>
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
            ENTER
          </button>
        </form>
      </main>
    );
  }

  if (!data) return <main className="tech grid min-h-screen place-items-center">LOADING…</main>;

  const dateMap = new Map(data.dates.map((d) => [d.id, d.event_date]));
  const shoeSizes = Array.from(
    new Set(data.applications.map((a) => `${a.shoe_size_system} ${a.shoe_size}`)),
  ).sort();
  const confirmedCount = data.applications.filter((a) => a.status === "CONFIRMED").length;

  const patch = async (payload: Parameters<typeof saveConfig>[0]["data"]) => {
    await saveConfig({ data: payload });
    await refresh();
    setNotice("Saved.");
  };

  return (
    <main className="min-h-screen px-6 py-10 sm:px-10">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-border pb-6">
        <h1 className="display truncate text-2xl">ORGANIZER DASHBOARD</h1>
        <button
          className="tech-sm shrink-0 border border-border px-4 py-2"
          onClick={async () => {
            await logout();
            setUnlocked(false);
            setData(null);
          }}
        >
          LOCK
        </button>
      </header>

      <section className="mt-8 grid gap-px bg-border sm:grid-cols-4">
        {[
          ["APPLICATIONS", data.applications.length],
          ["PARTICIPANT CAPACITY", data.event.capacity],
          ["AVAILABLE PARTICIPANT SPOTS", Math.max(data.event.capacity - confirmedCount, 0)],
          ["CONFIRMED PARTICIPANTS", confirmedCount],
        ].map(([k, v]) => (
          <div key={String(k)} className="bg-background p-6">
            <div className="tech-sm">{k}</div>
            <div className="display mt-3 text-4xl tabular-nums">{v}</div>
          </div>
        ))}
      </section>
      <p className="tech-sm mt-3">
        NOTE — THE NUMBER OF APPLICATIONS IS NOT THE SAME AS CONFIRMED PARTICIPANTS
      </p>

      <section className="mt-12">
        <h2 className="tech mb-4 text-foreground">DATE PREFERENCE</h2>
        <div className="grid gap-px bg-border sm:grid-cols-3">
          {data.stats.map((s) => (
            <div key={s.id} className="bg-background p-5">
              <div className="tech-sm">{formatDate(s.date).long}</div>
              <div className="display mt-2 text-3xl tabular-nums">{s.pct}%</div>
              <div className="tech-sm mt-1">{s.count} PREFERRED</div>
              <div className="tech-sm mt-1">
                +{" "}
                {
                  data.availability.filter((a) => a.date_option_id === s.id).length
                }{" "}
                ALSO AVAILABLE
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
                {data.event.final_date_id === s.id ? "FINAL DATE — CLICK TO UNDO" : "CONFIRM AS FINAL DATE"}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="tech mb-4 text-foreground">EVENT SETTINGS</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {(
              [
                ["meeting_time", "MEETING TIME"],
                ["meeting_point", "MEETING POINT"],
                ["distance_km", "DISTANCE"],
                ["elevation_m", "ELEVATION"],
                ["surface", "SURFACE"],
                ["route_notes", "ROUTE NOTES"],
                ["privacy_url", "PRIVACY LINK"],
                ["terms_url", "TERMS LINK"],
                ["cookie_url", "COOKIE LINK"],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="block">
                <span className="tech-sm">{label}</span>
                <input
                  defaultValue={String(data.event[key] ?? "")}
                  className={inputClass}
                  onBlur={(e) => patch({ [key]: e.target.value } as never)}
                />
              </label>
            ))}
            <label className="block">
              <span className="tech-sm">PARTICIPANT CAPACITY</span>
              <input
                type="number"
                defaultValue={data.event.capacity}
                className={inputClass}
                onBlur={(e) => patch({ capacity: Number(e.target.value) })}
              />
            </label>
            <label className="block">
              <span className="tech-sm">MAX APPLICATIONS</span>
              <input
                type="number"
                defaultValue={data.event.max_applications}
                className={inputClass}
                onBlur={(e) => patch({ max_applications: Number(e.target.value) })}
              />
            </label>
            <label className="block">
              <span className="tech-sm">PROVISIONAL DATES (COMMA SEPARATED YYYY-MM-DD)</span>
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
                    setNotice("Dates updated.");
                  }
                }}
              />
            </label>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            {(
              [
                ["applications_open", "APPLICATIONS OPEN"],
                ["waitlist_mode", "WAITLIST MODE"],
                ["weather_enabled", "WEATHER DISPLAY"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                onClick={() => patch({ [key]: !data.event[key] } as never)}
                className={cn(
                  "tech-sm border px-4 py-2",
                  data.event[key] ? "border-jade text-jade-soft" : "border-border",
                )}
              >
                {label} — {data.event[key] ? "ON" : "OFF"}
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
              EXPORT CSV
            </button>
          </div>
          {notice ? <p className="tech-sm mt-4 text-jade-soft">{notice}</p> : null}
        </div>

        <div>
          <h2 className="tech mb-4 text-foreground">FILTERS</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              placeholder="Search name, email, city"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className={inputClass}
            />
            <select value={fLevel} onChange={(e) => setFLevel(e.target.value)} className={selectClass}>
              <option value="">All running levels</option>
              {Array.from(new Set(data.applications.map((a) => a.running_level))).map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
            <select value={fDate} onChange={(e) => setFDate(e.target.value)} className={selectClass}>
              <option value="">All preferred dates</option>
              {data.dates.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.event_date}
                </option>
              ))}
            </select>
            <select value={fShoe} onChange={(e) => setFShoe(e.target.value)} className={selectClass}>
              <option value="">All shoe sizes</option>
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
        <h2 className="tech mb-4 text-foreground">APPLICANTS — {filtered.length}</h2>
        <div className="overflow-x-auto border border-border">
          <table className="w-full min-w-[900px] text-left text-xs">
            <thead>
              <tr className="border-b border-border">
                {["NAME", "CONTACT", "LOCATION", "PREFERRED", "LEVEL", "SHOE", "STATUS", ""].map(
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
                          setNotice(`Confirmation link copied for ${a.first_name}.`);
                        }
                      }}
                    >
                      COPY LINK
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
