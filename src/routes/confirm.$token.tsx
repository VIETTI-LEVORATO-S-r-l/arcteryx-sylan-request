import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getConfirmationContext, submitConfirmation } from "@/lib/confirm.functions";
import { CheckRow, Field, inputClass } from "@/components/site/Primitives";

export const Route = createFileRoute("/confirm/$token")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Participant Confirmation — Sylan 2 Trail Run" },
      {
        name: "description",
        content: "Confirm your place in the Arc'teryx × VIETTI Sylan 2 Trail Run.",
      },
      { property: "og:title", content: "Participant Confirmation — Sylan 2 Trail Run" },
      { property: "og:description", content: "Confirm your place in the Sylan 2 Trail Run." },
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
      .catch(() => setError("This link is not valid."));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (error) return <Shell><p className="text-sm text-muted-foreground">{error}</p></Shell>;
  if (!ctx) return <Shell><p className="tech-sm">LOADING…</p></Shell>;
  if (!ctx.found) return <Shell><p className="text-sm text-muted-foreground">This confirmation link is not valid.</p></Shell>;
  if (!ctx.eligible)
    return (
      <Shell>
        <p className="text-sm text-muted-foreground">
          This request is not currently eligible for confirmation. Current status: {ctx.status}.
        </p>
      </Shell>
    );
  if (done)
    return (
      <Shell>
        <h1 className="display text-4xl sm:text-6xl">
          PARTICIPATION
          <span className="block text-jade-soft">CONFIRMED</span>
        </h1>
        <p className="mt-6 text-sm text-muted-foreground">
          Thank you. Final details will be sent before the event.
        </p>
      </Shell>
    );

  return (
    <Shell>
      <div className="tech-sm">STEP TWO — CONFIRMED PARTICIPANTS</div>
      <h1 className="display mt-6 text-4xl sm:text-6xl">
        CONFIRM YOUR
        <span className="block text-jade-soft">PLACE</span>
      </h1>
      <p className="mt-6 max-w-lg text-sm text-muted-foreground">
        Welcome {ctx.firstName}. Your request has been accepted. Complete the details below to
        confirm your participation. Registered sizing: {ctx.shoeSize}.
      </p>

      <form
        className="mt-12 grid gap-8"
        onSubmit={async (e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          if (!acks.attending || !acks.rules || !acks.image) {
            setError("All confirmations are required.");
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
          else setError("Could not save your confirmation.");
        }}
      >
        <div className="grid gap-x-12 gap-y-6 sm:grid-cols-2">
          <Field label="Emergency contact name" required>
            <input name="emergencyName" required maxLength={120} className={inputClass} />
          </Field>
          <Field label="Emergency contact phone" required>
            <input name="emergencyPhone" required maxLength={40} className={inputClass} />
          </Field>
          <Field label="Final shoe size" required>
            <input name="finalShoeSize" required maxLength={20} className={inputClass} />
          </Field>
        </div>

        <div>
          <CheckRow checked={acks.attending} onChange={(v) => setAcks((a) => ({ ...a, attending: v }))}>
            I confirm my attendance at the event.
          </CheckRow>
          <CheckRow checked={acks.rules} onChange={(v) => setAcks((a) => ({ ...a, rules: v }))}>
            I acknowledge the event rules and safety briefing requirements. [PLACEHOLDER — FINAL
            RULES, REQUIRES LEGAL REVIEW]
          </CheckRow>
          <CheckRow checked={acks.image} onChange={(v) => setAcks((a) => ({ ...a, image: v }))}>
            I accept the image and video release terms for the Arc&rsquo;teryx × VIETTI event
            storytelling. [PLACEHOLDER — FINAL RELEASE TEXT, REQUIRES LEGAL REVIEW]
          </CheckRow>
        </div>

        {error ? <p className="text-xs text-destructive">{error}</p> : null}
        <button
          type="submit"
          className="tech w-fit border border-jade bg-jade px-8 py-4 text-primary-foreground hover:jade-glow"
        >
          CONFIRM PARTICIPATION
        </button>
      </form>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return <main className="mx-auto min-h-screen w-full max-w-3xl px-6 py-24">{children}</main>;
}
