import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { z } from "zod";

type AdminSession = { unlocked?: boolean };

function sessionConfig() {
  return {
    password: process.env["SESSION_SECRET"]!,
    name: "sylan-admin",
    maxAge: 60 * 60 * 8,
    cookie: { httpOnly: true, secure: true, sameSite: "lax" as const, path: "/" },
  };
}

async function requireAdmin() {
  const session = await useSession<AdminSession>(sessionConfig());
  if (!session.data.unlocked) throw new Error("Unauthorized");
}

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ password: z.string().max(200) }).parse(input))
  .handler(async ({ data }) => {
    const expected = process.env["ADMIN_PASSWORD"];
    if (!expected) return { ok: false as const };
    const enc = new TextEncoder();
    const [a, b] = await Promise.all([
      crypto.subtle.digest("SHA-256", enc.encode(data.password)),
      crypto.subtle.digest("SHA-256", enc.encode(expected)),
    ]);
    const av = new Uint8Array(a);
    const bv = new Uint8Array(b);
    let diff = 0;
    for (let i = 0; i < av.length; i++) diff |= (av[i] ?? 0) ^ (bv[i] ?? 0);
    if (diff !== 0) return { ok: false as const };
    const session = await useSession<AdminSession>(sessionConfig());
    await session.update({ unlocked: true });
    return { ok: true as const };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useSession<AdminSession>(sessionConfig());
  await session.clear();
  return { ok: true as const };
});

export const adminSessionStatus = createServerFn({ method: "GET" }).handler(async () => {
  const session = await useSession<AdminSession>(sessionConfig());
  return { unlocked: Boolean(session.data.unlocked) };
});

export const getAdminDashboard = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { EVENT_SLUG } = await import("./supabase-public.server");

  const { data: event } = await supabaseAdmin
    .from("events")
    .select("*")
    .eq("slug", EVENT_SLUG)
    .single();
  const { data: dates } = await supabaseAdmin
    .from("date_options")
    .select("id, event_date, is_active, sort_order")
    .eq("event_id", event!.id)
    .order("sort_order");
  const { data: applications } = await supabaseAdmin
    .from("applications")
    .select(
      "id, created_at, first_name, last_name, email, phone, city, country, preferred_date_id, running_level, trail_experience, pace, shoe_size_system, shoe_size, footwear_fit, instagram_handle, runner_description, status",
    )
    .eq("event_id", event!.id)
    .order("created_at", { ascending: false });
  const { data: availability } = await supabaseAdmin
    .from("application_date_availability")
    .select("application_id, date_option_id");
  const { data: stats } = await supabaseAdmin.rpc("date_preference_stats", {
    _event_id: event!.id,
  });

  return {
    event: event!,
    dates: dates ?? [],
    applications: applications ?? [],
    availability: availability ?? [],
    stats: (stats ?? []).map((s) => ({
      id: s.date_option_id,
      date: s.event_date,
      count: Number(s.preferred_count),
      pct: Number(s.pct),
    })),
  };
});

export const setApplicationStatus = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.enum([
          "APPLICATION_RECEIVED",
          "WAITLISTED",
          "ACCEPTED",
          "DECLINED",
          "CONFIRMED",
          "CANCELLED",
        ]),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("applications").update({ status: data.status }).eq("id", data.id);
    return { ok: true as const };
  });

export const getConfirmationLink = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row } = await supabaseAdmin
      .from("applications")
      .select("confirmation_token")
      .eq("id", data.id)
      .single();
    return { path: row ? `/confirm/${row.confirmation_token}` : null };
  });

export const updateEventConfig = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        meeting_time: z.string().max(40).optional(),
        meeting_point: z.string().max(200).optional(),
        distance_km: z.string().max(40).optional(),
        elevation_m: z.string().max(40).optional(),
        surface: z.string().max(80).optional(),
        route_notes: z.string().max(400).optional(),
        capacity: z.number().int().min(1).max(10000).optional(),
        max_applications: z.number().int().min(1).max(100000).optional(),
        applications_open: z.boolean().optional(),
        waitlist_mode: z.boolean().optional(),
        weather_enabled: z.boolean().optional(),
        final_date_id: z.string().uuid().nullable().optional(),
        privacy_url: z.string().max(300).optional(),
        terms_url: z.string().max(300).optional(),
        cookie_url: z.string().max(300).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { EVENT_SLUG } = await import("./supabase-public.server");
    const patch = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== undefined),
    ) as Record<string, unknown>;
    patch["updated_at"] = new Date().toISOString();
    await supabaseAdmin
      .from("events")
      .update(patch as never)
      .eq("slug", EVENT_SLUG);
    return { ok: true as const };
  });

export const setDateOptions = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ dates: z.array(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).min(1).max(8) }).parse(input),
  )
  .handler(async ({ data }) => {
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { EVENT_SLUG } = await import("./supabase-public.server");
    const { data: event } = await supabaseAdmin
      .from("events")
      .select("id")
      .eq("slug", EVENT_SLUG)
      .single();
    if (!event) return { ok: false as const };

    const { data: existing } = await supabaseAdmin
      .from("date_options")
      .select("id, event_date")
      .eq("event_id", event.id);

    for (const [i, d] of data.dates.entries()) {
      const found = (existing ?? []).find((e) => e.event_date === d);
      if (found) {
        await supabaseAdmin
          .from("date_options")
          .update({ is_active: true, sort_order: i })
          .eq("id", found.id);
      } else {
        await supabaseAdmin
          .from("date_options")
          .insert({ event_id: event.id, event_date: d, sort_order: i });
      }
    }
    for (const e of existing ?? []) {
      if (!data.dates.includes(e.event_date)) {
        await supabaseAdmin.from("date_options").update({ is_active: false }).eq("id", e.id);
      }
    }
    return { ok: true as const };
  });

export const exportApplicationsCsv = createServerFn({ method: "POST" }).handler(async () => {
  await requireAdmin();
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { EVENT_SLUG } = await import("./supabase-public.server");
  const { data: event } = await supabaseAdmin
    .from("events")
    .select("id")
    .eq("slug", EVENT_SLUG)
    .single();
  const { data: rows } = await supabaseAdmin
    .from("applications")
    .select("*")
    .eq("event_id", event!.id)
    .order("created_at", { ascending: false });
  const { data: dates } = await supabaseAdmin
    .from("date_options")
    .select("id, event_date");
  const dateMap = new Map((dates ?? []).map((d) => [d.id, d.event_date]));

  const headers = [
    "created_at",
    "first_name",
    "last_name",
    "email",
    "phone",
    "city",
    "country",
    "preferred_date",
    "running_level",
    "trail_experience",
    "pace",
    "shoe_size_system",
    "shoe_size",
    "footwear_fit",
    "instagram_handle",
    "runner_description",
    "status",
  ];
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lines = [headers.join(",")];
  for (const r of rows ?? []) {
    lines.push(
      [
        r.created_at,
        r.first_name,
        r.last_name,
        r.email,
        r.phone,
        r.city,
        r.country,
        dateMap.get(r.preferred_date_id) ?? "",
        r.running_level,
        r.trail_experience,
        r.pace,
        r.shoe_size_system,
        r.shoe_size,
        r.footwear_fit,
        r.instagram_handle,
        r.runner_description,
        r.status,
      ]
        .map(esc)
        .join(","),
    );
  }
  return { csv: lines.join("\n") };
});
