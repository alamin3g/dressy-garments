import { createServerFn } from "@tanstack/react-start";
import { getRequestIP } from "@tanstack/react-start/server";
import { z } from "zod";

const emailSchema = z.object({
  email: z.string().trim().email().max(255),
  page: z.string().max(300).default("/"),
});

function clientIp(): string {
  return getRequestIP({ xForwardedFor: true }) ?? "";
}

export const checkPopupEmail = createServerFn({ method: "POST" }).handler(async () => {
  const ip = clientIp();
  if (!ip) return { captured: false };
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { count } = await supabaseAdmin
    .from("popup_emails")
    .select("id", { count: "exact", head: true })
    .eq("ip", ip);
  return { captured: (count ?? 0) > 0 };
});

export const submitPopupEmail = createServerFn({ method: "POST" })
  .inputValidator((data) => emailSchema.parse(data))
  .handler(async ({ data }) => {
    const ip = clientIp();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("popup_emails").insert({
      email: data.email.toLowerCase(),
      page: data.page,
      ip,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
