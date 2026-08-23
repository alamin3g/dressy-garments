import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader, getRequestIP } from "@tanstack/react-start/server";
import { z } from "zod";

const visitSchema = z.object({
  path: z.string().max(300).default("/"),
  referrer: z.string().max(500).default(""),
});

const COUNTRY_NAMES: Record<string, string> = {
  BD: "Bangladesh",
  US: "USA",
  GB: "United Kingdom",
  DE: "Germany",
  FR: "France",
  SE: "Sweden",
  NL: "Netherlands",
  ES: "Spain",
  IT: "Italy",
  CA: "Canada",
  AU: "Australia",
  IN: "India",
  JP: "Japan",
  CN: "China",
};

export const trackVisit = createServerFn({ method: "POST" })
  .inputValidator((data) => visitSchema.parse(data))
  .handler(async ({ data }) => {
    const ip = getRequestIP({ xForwardedFor: true }) ?? "";
    const userAgent = getRequestHeader("user-agent") ?? "";

    let city = getRequestHeader("cf-ipcity") ?? "";
    let region = getRequestHeader("cf-region") ?? "";
    let countryCode = getRequestHeader("cf-ipcountry") ?? "";
    let country = countryCode ? (COUNTRY_NAMES[countryCode] ?? countryCode) : "";

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
  .inputValidator((data) => z.object({ userId: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { count } = await supabaseAdmin
      .from("user_roles")
      .select("id", { count: "exact", head: true })
      .eq("role", "admin");

    if ((count ?? 0) > 0) return { granted: false };

    await supabaseAdmin.from("user_roles").insert({ user_id: data.userId, role: "admin" });
    return { granted: true };
  });
