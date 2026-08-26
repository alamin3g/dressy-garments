import { useEffect, useState } from "react";
import { Loader2, LockKeyhole, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { adminPasswordLogin } from "@/lib/admin-auth.functions";

const inputClass =
  "w-full rounded-xl border border-border bg-background px-3 py-2.5 text-center text-lg tracking-[0.4em] outline-none transition-colors focus:border-primary";

type State = "loading" | "locked" | "admin";

export function AdminGate({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>("loading");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void supabase.auth.getSession().then(({ data }) => {
      if (active) setState(data.session ? "admin" : "locked");
    });
    return () => {
      active = false;
    };
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await adminPasswordLogin({ data: { password } });
      if (!res.ok) {
        setError("Incorrect password");
        return;
      }
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: res.access_token,
        refresh_token: res.refresh_token,
      });
      if (sessionError) throw sessionError;
      setPassword("");
      setState("admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
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
          onClick={async () => {
            await supabase.auth.signOut();
            setState("locked");
          }}
          className="fixed bottom-4 right-4 z-50 inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-xs font-semibold shadow-lg"
        >
          <LogOut className="size-3.5" /> Lock
        </button>
        {children}
      </>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-2xl border border-border p-6">
        <div className="flex items-center gap-2">
          <LockKeyhole className="size-5 text-primary" />
          <h1 className="display text-2xl">Admin access</h1>
        </div>
        <p className="text-sm text-muted-foreground">Enter the admin password to continue.</p>
        <input
          type="password"
          required
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••"
          className={inputClass}
        />
        <button
          type="submit"
          disabled={busy}
          className="label-xs inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-primary-foreground disabled:opacity-60"
        >
          {busy && <Loader2 className="size-4 animate-spin" />}
          Unlock
        </button>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </form>
    </div>
  );
}
