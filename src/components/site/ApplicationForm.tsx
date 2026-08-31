import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { submitApplication } from "@/lib/event.functions";
import { PACE_RANGES, RUNNING_LEVELS, TRAIL_LEVELS, type EventPayload } from "@/lib/types";
import { CheckRow, Field, inputClass, selectClass } from "./Primitives";
import { DateBoard } from "./DateBoard";
import { formatDate } from "@/lib/queries";
import { cn } from "@/lib/utils";

type Consents = {
  isAdult: boolean;
  terrainAck: boolean;
  fitnessAck: boolean;
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
      setError("Select one preferred date.");
      return;
    }
    const required: (keyof Consents)[] = [
      "isAdult",
      "terrainAck",
      "fitnessAck",
      "noGuaranteeAck",
      "privacyAck",
    ];
    if (required.some((k) => !consents[k])) {
      setError("All required declarations must be accepted.");
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
          country: v("country"),
          preferredDateId,
          otherDateIds,
          runningLevel: v("runningLevel"),
          trailExperience: v("trailExperience"),
          pace: v("pace"),
          shoeSizeSystem: v("shoeSizeSystem") as "EU" | "UK",
          shoeSize: v("shoeSize"),
          footwearFit: v("footwearFit") as "MEN'S" | "WOMEN'S",
          instagramHandle: v("instagramHandle"),
          runnerDescription: description.slice(0, 300),
          isAdult: true,
          terrainAck: true,
          fitnessAck: true,
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
      setError("Please review the form: some required information is missing or invalid.");
      setPending(false);
    }
  }

  if (!data.event.applicationsOpen) {
    return (
      <div className="border border-border p-8">
        <div className="tech mb-3 text-jade-soft">APPLICATIONS CLOSED</div>
        <p className="max-w-xl text-sm text-muted-foreground">
          Requests to join are currently closed. Follow VIETTI for future Arc'teryx activations.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-10">
      {data.event.waitlistMode ? (
        <p className="border border-jade/60 p-4 text-xs text-jade-soft">
          Applications have exceeded the initial event capacity. New requests may be placed on the
          waiting list.
        </p>
      ) : null}

      <div className="grid gap-x-12 gap-y-6 sm:grid-cols-2">
        <Field label="First name" required>
          <input name="firstName" required maxLength={80} className={inputClass} />
        </Field>
        <Field label="Last name" required>
          <input name="lastName" required maxLength={80} className={inputClass} />
        </Field>
        <Field label="Email" required>
          <input name="email" type="email" required maxLength={255} className={inputClass} />
        </Field>
        <Field label="Mobile phone" required>
          <input name="phone" required maxLength={40} className={inputClass} />
        </Field>
        <Field label="City" required>
          <input name="city" required maxLength={120} className={inputClass} />
        </Field>
        <Field label="Country" required>
          <input name="country" required maxLength={120} className={inputClass} />
        </Field>
      </div>

      <div>
        <div className="tech-sm mb-4">PREFERRED DATE — SELECT ONE (REQUIRED)</div>
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
        <div className="tech-sm mb-2">OTHER DATES I COULD ATTEND — OPTIONAL</div>
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

      <div className="grid gap-x-12 gap-y-6 sm:grid-cols-2">
        <Field label="Running experience" required>
          <select name="runningLevel" required className={selectClass} defaultValue="">
            <option value="" disabled>
              Select
            </option>
            {RUNNING_LEVELS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Trail running experience" required>
          <select name="trailExperience" required className={selectClass} defaultValue="">
            <option value="" disabled>
              Select
            </option>
            {TRAIL_LEVELS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Comfortable running pace">
          <select name="pace" className={selectClass} defaultValue="">
            <option value="">Select a range</option>
            {PACE_RANGES.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Instagram handle">
          <input name="instagramHandle" maxLength={60} placeholder="@" className={inputClass} />
        </Field>
        <Field label="Footwear size system" required>
          <select name="shoeSizeSystem" required className={selectClass} defaultValue="EU">
            <option value="EU">EU</option>
            <option value="UK">UK</option>
          </select>
        </Field>
        <Field label="Shoe size" required>
          <input name="shoeSize" required maxLength={10} className={inputClass} />
        </Field>
        <Field label="Footwear fit" required>
          <select name="footwearFit" required className={selectClass} defaultValue="MEN'S">
            <option value="MEN'S">MEN&rsquo;S</option>
            <option value="WOMEN'S">WOMEN&rsquo;S</option>
          </select>
        </Field>
      </div>

      <Field label="Tell us briefly about your running experience" hint={`${description.length}/300`}>
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
        <div className="tech-sm mb-2">REQUIRED DECLARATIONS</div>
        <CheckRow checked={consents.isAdult} onChange={setConsent("isAdult")}>
          I confirm that I am 18 years of age or older.
        </CheckRow>
        <CheckRow checked={consents.terrainAck} onChange={setConsent("terrainAck")}>
          I understand that this is a trail-running activity taking place on natural and uneven
          outdoor terrain and requires an appropriate level of physical preparation.
        </CheckRow>
        <CheckRow checked={consents.fitnessAck} onChange={setConsent("fitnessAck")}>
          I confirm that I am physically able to take part in the proposed activity.
        </CheckRow>
        <CheckRow checked={consents.noGuaranteeAck} onChange={setConsent("noGuaranteeAck")}>
          I understand that submitting this request does not guarantee participation and that
          participation is subject to confirmation by the organizers.
        </CheckRow>
        <CheckRow checked={consents.privacyAck} onChange={setConsent("privacyAck")}>
          I have read the{" "}
          <a href="/privacy" target="_blank" rel="noreferrer" className="text-jade-soft underline">
            Privacy Notice
          </a>{" "}
          regarding the processing of my personal data for the management of my participation
          request.
        </CheckRow>

        <div className="tech-sm mt-8 mb-2">OPTIONAL — MARKETING</div>
        <CheckRow checked={consents.marketingVietti} onChange={setConsent("marketingVietti")}>
          I would like to receive news and marketing communications from VIETTI.
        </CheckRow>
        <CheckRow checked={consents.marketingArcteryx} onChange={setConsent("marketingArcteryx")}>
          I would like to receive news and marketing communications from Arc&rsquo;teryx.
          <span className="block opacity-60">
            [CONFIGURABLE — ENABLE ONLY IF LEGALLY REQUIRED AND APPROVED]
          </span>
        </CheckRow>
      </div>

      {error ? <p className="text-xs text-destructive">{error}</p> : null}

      <div className="flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="tech-sm max-w-md normal-case tracking-normal">
          Submitting this form does not automatically confirm your place.
        </p>
        <button
          type="submit"
          disabled={pending}
          className="tech border border-jade bg-jade px-8 py-4 text-primary-foreground transition-all hover:jade-glow disabled:opacity-50"
        >
          {pending ? "SENDING…" : "SUBMIT REQUEST"}
        </button>
      </div>
    </form>
  );
}
