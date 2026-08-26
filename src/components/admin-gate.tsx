import { useEffect, useState } from "react";
import { Loader2, LogOut, ShieldAlert } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { bootstrapAdmin } from "@/lib/analytics.functions";

const inputClass =
  "w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary";

type State = "loading" | "signed-out" | "not-admin" | "admin";

export function AdminGate({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>("loading");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"in" | "up">("in");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const check = async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      setState("signed-out");
      return;
    }
    try {
      await bootstrapAdmin();
    } catch {
      /* already claimed */
    }
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user.id)
      .eq("role", "admin");
    setState((roles ?? []).length > 0 ? "admin" : "not-admin");
  };

  useEffect(() => {
    void check();
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT") void check();
    });
    return () => sub.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    try {
      if (mode === "up") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        setMessage("Account created. Check your email to confirm, then sign in.");
        setMode("in");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        await check();
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  if (state === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  if (state === "admin") {
    return (
      <>
        <button
          type="button"
          onClick={() => supabase.auth.signOut()}
          className="fixed bottom-4 right-4 z-50 inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-xs font-semibold shadow-lg"
        >
          <LogOut className="size-3.5" /> Sign out
        </button>
        {children}
      </>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm rounded-2xl border border-border p-6">
        <div className="mb-6 flex items-center gap-2">
          <ShieldAlert className="size-5 text-primary" />
          <h1 className="display text-2xl">Admin access</h1>
        </div>

        {state === "not-admin" ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This account is signed in but is not an admin. Ask an existing admin to grant access.
            </p>
            <button
              type="button"
              onClick={() => supabase.auth.signOut()}
              className="label-xs w-full rounded-xl border border-border px-4 py-2.5"
            >
              Sign out
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className={inputClass}
            />
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className={inputClass}
            />
            <button
              type="submit"
              disabled={busy}
              className="label-xs inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-primary-foreground disabled:opacity-60"
            >
              {busy && <Loader2 className="size-4 animate-spin" />}
              {mode === "in" ? "Sign in" : "Create admin account"}
            </button>
            <button
              type="button"
              onClick={() => setMode(mode === "in" ? "up" : "in")}
              className="w-full text-xs text-muted-foreground underline"
            >
              {mode === "in" ? "First time? Create the admin account" : "Already have an account? Sign in"}
            </button>
            {message && <p className="text-xs text-muted-foreground">{message}</p>}
          </form>
        )}
      </div>
    </div>
  );
}
