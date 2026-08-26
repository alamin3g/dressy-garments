import { useEffect, useState } from "react";
import { z } from "zod";
import { checkPopupEmail, submitPopupEmail } from "@/lib/popup-email.functions";

const STORAGE_KEY = "dressy_popup_email";

const emailSchema = z
  .string()
  .trim()
  .email({ message: "Please enter a valid email address" })
  .max(255, { message: "Email must be less than 255 characters" });

export function EmailGatePopup() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.localStorage.getItem(STORAGE_KEY)) return;
    let cancelled = false;
    const t = window.setTimeout(async () => {
      try {
        const res = await checkPopupEmail();
        if (res?.captured) {
          window.localStorage.setItem(STORAGE_KEY, "1");
          return;
        }
      } catch {
        // if the check fails, still show the popup
      }
      if (!cancelled) setOpen(true);
    }, 5000);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, []);

  useEffect(() => {
    if (!open || typeof document === "undefined") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid email");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await submitPopupEmail({
        data: {
          email: parsed.data,
          page: typeof window !== "undefined" ? window.location.pathname : "/",
        },
      });
    } catch {
      setSaving(false);
      setError("Something went wrong. Please try again.");
      return;
    }
    setSaving(false);
    window.localStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="email-gate-title"
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 p-5"
    >
      <div className="w-full max-w-md rounded-2xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
        <p className="label-xs text-primary">Dressy Clothing Ltd.</p>
        <h2 id="email-gate-title" className="display mt-3 text-3xl leading-tight text-white">
          Enter your email to continue
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-white/70">
          Get our latest collections, capabilities and factory updates straight to your inbox.
        </p>

        <form onSubmit={submit} className="mt-6 space-y-3">
          <input
            type="email"
            required
            autoFocus
            maxLength={255}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null);
            }}
            placeholder="you@company.com"
            aria-label="Email address"
            className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3.5 text-sm text-white placeholder:text-white/50 outline-none transition-colors focus:border-primary"
          />
          {error && <p className="text-xs text-destructive">{error}</p>}
          <button
            type="submit"
            disabled={saving}
            className="label-xs w-full rounded-xl bg-primary px-5 py-4 text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {saving ? "Submitting…" : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
