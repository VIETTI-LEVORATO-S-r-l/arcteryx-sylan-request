import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { z } from "zod";
import type { EventPayload } from "./types";

const applicationSchema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(6).max(40),
  city: z.string().trim().min(1).max(120),
  country: z.string().trim().max(120).optional().or(z.literal("")),
  preferredDateId: z.string().uuid(),
  otherDateIds: z.array(z.string().uuid()).max(10).default([]),
  runningLevel: z.string().trim().min(1).max(80),
  trailExperience: z.string().trim().min(1).max(80),
  pace: z.string().trim().max(60).optional().or(z.literal("")),
  shoeSizeSystem: z.enum(["EU", "UK"]),
  shoeSize: z.string().trim().min(1).max(10),
  footwearFit: z.enum(["MEN'S", "WOMEN'S"]),
  instagramHandle: z.string().trim().max(60).optional().or(z.literal("")),
  runnerDescription: z.string().trim().max(300).optional().or(z.literal("")),
  isAdult: z.literal(true),
  terrainAck: z.literal(true),
  fitnessAck: z.literal(true),
  rulesAck: z.literal(true),
  noGuaranteeAck: z.literal(true),
  privacyAck: z.literal(true),
  marketingVietti: z.boolean().default(false),
  marketingArcteryx: z.boolean().default(false),
  website: z.string().max(0).optional().or(z.literal("")),
});

export type ApplicationInput = z.infer<typeof applicationSchema>;

export const getEventData = createServerFn({ method: "GET" }).handler(
  async (): Promise<EventPayload> => {
    const { createPublicClient, EVENT_SLUG } = await import("./supabase-public.server");
    const sb = createPublicClient();

    const { data: event, error } = await sb
      .from("events")
      .select("*")
      .eq("slug", EVENT_SLUG)
      .maybeSingle();
    if (error || !event) throw new Error("Event configuration unavailable");

    const { data: options } = await sb
      .from("date_options")
      .select("id, event_date, sort_order")
      .eq("event_id", event.id)
      .eq("is_active", true)
      .order("sort_order");

    const { data: stats } = await sb.rpc("date_preference_stats", { _event_id: event.id });
    const statMap = new Map((stats ?? []).map((s) => [s.date_option_id, s]));

    const { fetchWeather } = await import("./weather.server");
    const weather = event.weather_enabled
      ? await fetchWeather(event.latitude, event.longitude, (options ?? []).map((o) => o.event_date))
      : {};

    const dates = (options ?? []).map((o) => ({
      id: o.id,
      date: o.event_date,
      count: Number(statMap.get(o.id)?.preferred_count ?? 0),
      pct: Number(statMap.get(o.id)?.pct ?? 0),
      weather: weather[o.event_date] ?? { available: false },
    }));

    const total = Number(stats?.[0]?.total ?? 0);
    const leading =
      total > 0 ? dates.reduce((a, b) => (b.count > a.count ? b : a), dates[0]!) : null;

    return {
      event: {
        id: event.id,
        title: event.title,
        location: event.location,
        meetingPoint: event.meeting_point,
        meetingTime: event.meeting_time,
        distanceKm: event.distance_km,
        elevationM: event.elevation_m,
        surface: event.surface,
        routeNotes: event.route_notes,
        weatherEnabled: event.weather_enabled,
        applicationsOpen: event.applications_open,
        waitlistMode: event.waitlist_mode,
        capacity: event.capacity,
        maxApplications: event.max_applications,
        finalDateId: event.final_date_id,
        privacyVersion: event.privacy_version,
      },
      dates,
      total,
      leadingDateId: leading && leading.count > 0 ? leading.id : null,
      weatherUpdatedAt: event.weather_enabled ? new Date().toISOString() : null,
    };
  },
);

export const submitApplication = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => applicationSchema.parse(input))
  .handler(async ({ data }) => {
    if (data.website) return { ok: false as const, error: "Invio non valido." };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { EVENT_SLUG } = await import("./supabase-public.server");

    const { data: event } = await supabaseAdmin
      .from("events")
      .select("id, applications_open, max_applications, privacy_version, capacity")
      .eq("slug", EVENT_SLUG)
      .maybeSingle();
    if (!event) return { ok: false as const, error: "Evento non disponibile." };
    if (!event.applications_open) {
      return { ok: false as const, error: "Le richieste di partecipazione sono attualmente chiuse." };
    }

    const { count } = await supabaseAdmin
      .from("applications")
      .select("id", { count: "exact", head: true })
      .eq("event_id", event.id);
    if ((count ?? 0) >= event.max_applications) {
      return { ok: false as const, error: "È stato raggiunto il numero massimo di richieste." };
    }

    const email = data.email.toLowerCase();
    const { data: existing } = await supabaseAdmin
      .from("applications")
      .select("id")
      .eq("event_id", event.id)
      .eq("email", email)
      .maybeSingle();
    if (existing) {
      return { ok: false as const, error: "Una richiesta è già stata inviata con questa email." };
    }

    const ip = getRequestHeader("x-forwarded-for") ?? "";
    const ipHash = ip
      ? [...new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(ip)))]
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("")
      : null;

    if (ipHash) {
      const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
      const { count: recent } = await supabaseAdmin
        .from("applications")
        .select("id", { count: "exact", head: true })
        .eq("ip_hash", ipHash)
        .gte("created_at", since);
      if ((recent ?? 0) >= 3) {
        return { ok: false as const, error: "Troppe richieste. Riprova più tardi." };
      }
    }

    const { data: inserted, error } = await supabaseAdmin
      .from("applications")
      .insert({
        event_id: event.id,
        first_name: data.firstName,
        last_name: data.lastName,
        email,
        phone: data.phone,
        city: data.city,
        country: data.country || "Italia",
        is_adult: true,
        preferred_date_id: data.preferredDateId,
        running_level: data.runningLevel,
        trail_experience: data.trailExperience,
        pace: data.pace || null,
        shoe_size_system: data.shoeSizeSystem,
        shoe_size: data.shoeSize,
        footwear_fit: data.footwearFit,
        instagram_handle: data.instagramHandle || null,
        runner_description: data.runnerDescription || null,
        ip_hash: ipHash,
        status: (count ?? 0) >= event.capacity ? "WAITLISTED" : "APPLICATION_RECEIVED",
      })
      .select("id")
      .single();

    if (error || !inserted) return { ok: false as const, error: "Non è stato possibile salvare la richiesta." };

    const others = data.otherDateIds.filter((id) => id !== data.preferredDateId);
    if (others.length) {
      await supabaseAdmin
        .from("application_date_availability")
        .insert(others.map((id) => ({ application_id: inserted.id, date_option_id: id })));
    }

    const version = event.privacy_version;
    await supabaseAdmin.from("consents").insert([
      { application_id: inserted.id, consent_key: "AGE_18_PLUS", granted: true, policy_version: version },
      { application_id: inserted.id, consent_key: "TERRAIN_ACK", granted: true, policy_version: version },
      { application_id: inserted.id, consent_key: "FITNESS_ACK", granted: true, policy_version: version },
      { application_id: inserted.id, consent_key: "RULES_ACK", granted: true, policy_version: version },
      { application_id: inserted.id, consent_key: "NO_GUARANTEE_ACK", granted: true, policy_version: version },
      { application_id: inserted.id, consent_key: "PRIVACY_NOTICE", granted: true, policy_version: version },
      {
        application_id: inserted.id,
        consent_key: "MARKETING_VIETTI",
        granted: data.marketingVietti,
        policy_version: version,
      },
      {
        application_id: inserted.id,
        consent_key: "MARKETING_ARCTERYX",
        granted: data.marketingArcteryx,
        policy_version: version,
      },
    ]);

    return { ok: true as const };
  });
