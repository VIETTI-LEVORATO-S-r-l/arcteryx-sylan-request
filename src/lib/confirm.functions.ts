import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const getConfirmationContext = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ token: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: app } = await supabaseAdmin
      .from("applications")
      .select("id, first_name, status, shoe_size, shoe_size_system, footwear_fit")
      .eq("confirmation_token", data.token)
      .maybeSingle();
    if (!app) return { found: false as const };
    if (app.status !== "ACCEPTED" && app.status !== "CONFIRMED") {
      return { found: true as const, eligible: false as const, status: app.status };
    }
    return {
      found: true as const,
      eligible: true as const,
      status: app.status,
      firstName: app.first_name,
      shoeSize: `${app.shoe_size_system} ${app.shoe_size} — ${app.footwear_fit}`,
    };
  });

export const submitConfirmation = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        token: z.string().uuid(),
        attending: z.literal(true),
        emergencyName: z.string().trim().min(1).max(120),
        emergencyPhone: z.string().trim().min(6).max(40),
        finalShoeSize: z.string().trim().min(1).max(20),
        rulesAck: z.literal(true),
        imageRelease: z.literal(true),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: app } = await supabaseAdmin
      .from("applications")
      .select("id, status")
      .eq("confirmation_token", data.token)
      .maybeSingle();
    if (!app || (app.status !== "ACCEPTED" && app.status !== "CONFIRMED")) {
      return { ok: false as const };
    }
    await supabaseAdmin.from("participants").upsert(
      {
        application_id: app.id,
        attendance_confirmed: true,
        emergency_contact_name: data.emergencyName,
        emergency_contact_phone: data.emergencyPhone,
        final_shoe_size: data.finalShoeSize,
        rules_acknowledged: true,
        image_release_accepted: true,
        confirmed_at: new Date().toISOString(),
      },
      { onConflict: "application_id" },
    );
    await supabaseAdmin.from("applications").update({ status: "CONFIRMED" }).eq("id", app.id);
    return { ok: true as const };
  });
