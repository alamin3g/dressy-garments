import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({ password: z.string().max(200) });

const ADMIN_EMAIL = "admin@dressyltd.com";

export const adminPasswordLogin = createServerFn({ method: "POST" })
  .inputValidator((data) => schema.parse(data))
  .handler(async ({ data }) => {
    const expected = process.env['ADMIN_PANEL_PASSWORD'] ?? "1234";
    if (data.password !== expected) {
      return { ok: false as const };
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { createClient } = await import("@supabase/supabase-js");
    const { createHash } = await import("node:crypto");

    // Deterministic internal credential, never shown to the user.
    const internalPassword = createHash("sha256")
      .update(`dressy-admin::${process.env['SUPABASE_SERVICE_ROLE_KEY'] ?? "local"}`)
      .digest("hex")
      .slice(0, 40);

    const { data: list } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
    let user = list?.users.find((u) => u.email === ADMIN_EMAIL) ?? null;

    if (!user) {
      const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
        email: ADMIN_EMAIL,
        password: internalPassword,
        email_confirm: true,
      });
      if (error) throw error;
      user = created.user;
    } else {
      await supabaseAdmin.auth.admin.updateUserById(user.id, {
        password: internalPassword,
        email_confirm: true,
      });
    }

    if (!user) throw new Error("Admin account unavailable");

    const { count } = await supabaseAdmin
      .from("user_roles")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("role", "admin");

    if ((count ?? 0) === 0) {
      await supabaseAdmin.from("user_roles").insert({ user_id: user.id, role: "admin" });
    }

    const key = process.env['SUPABASE_PUBLISHABLE_KEY']!;
    const client = createClient(process.env['SUPABASE_URL']!, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => {
          const h = new Headers(init?.headers);
          if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
            h.delete("Authorization");
          }
          h.set("apikey", key);
          return fetch(input, { ...init, headers: h });
        },
      },
    });

    const { data: session, error: signInError } = await client.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password: internalPassword,
    });
    if (signInError || !session.session) throw signInError ?? new Error("Sign-in failed");

    return {
      ok: true as const,
      access_token: session.session.access_token,
      refresh_token: session.session.refresh_token,
    };
  });
