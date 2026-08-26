import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader, getRequestIP } from "@tanstack/react-start/server";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const visitSchema = z.object({
  path: z.string().max(300).default("/"),
  referrer: z.string().max(500).default(""),
});

const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

function countryName(code: string): string {
  if (!code) return "";
  try {
    return regionNames.of(code.toUpperCase()) ?? code;
  } catch {
    return code;
  }
}

export const trackVisit = createServerFn({ method: "POST" })
  .inputValidator((data) => visitSchema.parse(data))
  .handler(async ({ data }) => {
    const ip = getRequestIP({ xForwardedFor: true }) ?? "";
    const userAgent = getRequestHeader("user-agent") ?? "";

    let city = getRequestHeader("cf-ipcity") ?? "";
    let region = getRequestHeader("cf-region") ?? "";
    let countryCode = getRequestHeader("cf-ipcountry") ?? "";
    let country = countryName(countryCode);

    const isPrivate =
      !ip ||
      ip.startsWith("127.") ||
      ip.startsWith("10.") ||
      ip.startsWith("192.168.") ||
      ip === "::1";

    if (!city && !isPrivate) {
      try {
        const res = await fetch(`https://ipapi.co/${encodeURIComponent(ip)}/json/`, {
          headers: { "user-agent": "dressy-analytics" },
        });
        if (res.ok) {
          const geo = (await res.json()) as Record<string, string>;
          city = geo['city'] ?? "";
          region = geo['region'] ?? "";
          country = geo['country_name'] ?? "";
          countryCode = geo['country_code'] ?? "";
        }
      } catch {
        // geo lookup is best-effort
      }
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    await supabaseAdmin.from("visitors").insert({
      ip,
      city: city || "Unknown",
      region,
      country: country || "Unknown",
      country_code: countryCode,
      path: data.path,
      referrer: data.referrer,
      user_agent: userAgent,
    });

    return { ok: true };
  });

export const bootstrapAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { count } = await supabaseAdmin
      .from("user_roles")
      .select("id", { count: "exact", head: true })
      .eq("role", "admin");

    if ((count ?? 0) > 0) return { granted: false };

    await supabaseAdmin.from("user_roles").insert({ user_id: context.userId, role: "admin" });
    return { granted: true };
  });
