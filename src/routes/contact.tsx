import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, MapPin, Check, ArrowRight, ExternalLink } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import dressyLogo from "@/assets/dressy-logo.png.asset.json";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Dressy — Start a Garment Project" },
      {
        name: "description",
        content:
          "Send Dressy your tech pack, reference piece or concept. Our Dhaka team replies to production enquiries within one business day.",
      },
      { property: "og:title", content: "Contact Dressy — Start a Garment Project" },
      {
        property: "og:description",
        content: "Talk to our merchandising team about your next garment programme.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

const PRODUCT_TYPES = ["Knit", "Woven", "Outerwear", "Fleece", "Workwear", "Development"];

type Errors = Partial<Record<"name" | "email" | "message", string>>;

function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    product: "Knit",
    quantity: "",
    message: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState("");

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const next: Errors = {};
    if (!form.name.trim()) next.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Please enter a valid email.";
    if (form.message.trim().length < 10) next.message = "Tell us a little more (10+ characters).";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSending(true);
    setFailed("");
    const { error } = await supabase.from("inquiries").insert({
      name: form.name.trim(),
      company: form.company.trim(),
      email: form.email.trim(),
      product: form.product,
      quantity: form.quantity.trim(),
      message: form.message.trim(),
    });
    setSending(false);
    if (error) {
      setFailed("Something went wrong sending your enquiry. Please try again.");
      return;
    }
    setSent(true);
  }


  const field =
    "mt-2 w-full border border-border bg-card px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary";

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <SiteHeader />

      <section className="border-b border-border">
        <div className="mx-auto max-w-[1400px] px-6 pb-14 pt-6 md:px-10">
          <p className="label-xs text-primary">06 / Let's Make Something Great</p>
          <div className="mt-8 grid gap-10 lg:grid-cols-[1.3fr_1fr]">
            <h1 className="display text-5xl leading-[0.95] sm:text-6xl lg:text-7xl">
              Connect With Us
            </h1>
            <p className="max-w-md self-end text-sm leading-relaxed text-muted-foreground">
              Send us your tech pack, reference piece or concept. Our merchandising team replies
              within one business day.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto grid max-w-[1400px] gap-12 px-6 py-16 md:px-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            {sent ? (
              <div className="border border-primary p-10">
                <Check className="size-8 text-primary" />
                <h2 className="display mt-6 text-3xl">Enquiry Received</h2>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
                  Thanks {form.name.split(" ")[0]} — your enquiry about {form.product.toLowerCase()}{" "}
                  production has been logged. Our team will reply to {form.email} within one
                  business day.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSent(false);
                    setForm({ name: "", company: "", email: "", product: "Knit", quantity: "", message: "" });
                  }}
                  className="label-xs mt-8 flex items-center gap-4 border-b border-primary pb-2 text-primary"
                >
                  Send another enquiry <ArrowRight className="size-4" />
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="label-xs text-muted-foreground">
                    Name *
                  </label>
                  <input
                    id="name"
                    value={form.name}
                    onChange={(e) => set("name")(e.target.value)}
                    className={field}
                    placeholder="Your full name"
                  />
                  {errors.name && <p className="mt-2 text-xs text-destructive">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="company" className="label-xs text-muted-foreground">
                    Company
                  </label>
                  <input
                    id="company"
                    value={form.company}
                    onChange={(e) => set("company")(e.target.value)}
                    className={field}
                    placeholder="Brand or company"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="label-xs text-muted-foreground">
                    Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => set("email")(e.target.value)}
                    className={field}
                    placeholder="you@brand.com"
                  />
                  {errors.email && <p className="mt-2 text-xs text-destructive">{errors.email}</p>}
                </div>
                <div>
                  <label htmlFor="quantity" className="label-xs text-muted-foreground">
                    Estimated Quantity
                  </label>
                  <input
                    id="quantity"
                    value={form.quantity}
                    onChange={(e) => set("quantity")(e.target.value)}
                    className={field}
                    placeholder="e.g. 5,000 pcs"
                  />
                </div>
                <div className="sm:col-span-2">
                  <span className="label-xs text-muted-foreground">Product Type</span>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {PRODUCT_TYPES.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => set("product")(p)}
                        className={`label-xs border px-4 py-3 transition-colors ${
                          form.product === p
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="message" className="label-xs text-muted-foreground">
                    Project Details *
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    value={form.message}
                    onChange={(e) => set("message")(e.target.value)}
                    className={field}
                    placeholder="Styles, fabrics, target price, delivery window…"
                  />
                  {errors.message && (
                    <p className="mt-2 text-xs text-destructive">{errors.message}</p>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    disabled={sending}
                    className="label-xs flex items-center gap-4 bg-primary px-6 py-4 font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
                  >
                    {sending ? "Sending…" : "Send Enquiry"} <ArrowRight className="size-4" />
                  </button>
                  {failed && <p className="mt-3 text-xs text-destructive">{failed}</p>}
                </div>

              </form>
            )}
          </div>

          <aside className="space-y-6">
            <ul className="divide-y divide-border border-y border-border">
              <li className="flex items-start gap-4 py-5">
                <MapPin className="size-4 shrink-0 text-primary mt-0.5" />
                <a
                  href="https://maps.app.goo.gl/6FepzNpWRSVHpofe8"
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-start gap-1.5 text-sm text-muted-foreground hover:text-foreground leading-snug transition-colors"
                >
                  <span>House # 475, Flat # B3, Road # 08/A DOHS Baridhara, Dhaka 1206</span>
                  <ExternalLink className="size-3.5 shrink-0 text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 mt-0.5" />
                </a>
              </li>
              <li className="flex items-start gap-4 py-5">
                <Phone className="size-4 shrink-0 text-primary mt-0.5" />
                <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                  <a href="tel:+8801754104307" className="hover:text-foreground">
                    +88 01754104307
                  </a>
                  <a href="tel:+8801751244211" className="hover:text-foreground">
                    +88 01751244211
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-4 py-5">
                <Mail className="size-4 shrink-0 text-primary" />
                <a href="mailto:info@dressyclothing.com" className="text-sm text-muted-foreground hover:text-foreground">
                  info@dressyclothing.com
                </a>
              </li>
            </ul>

            {/* Google Maps Location Button Card */}
            <a
              href="https://maps.app.goo.gl/6FepzNpWRSVHpofe8"
              target="_blank"
              rel="noreferrer"
              className="group flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-all duration-300 hover:border-primary hover:bg-card/80 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <MapPin className="size-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">Google Maps Location</p>
                  <p className="text-[11px] text-muted-foreground">Baridhara DOHS, Dhaka</p>
                </div>
              </div>
              <span className="label-xs flex items-center gap-1 text-primary group-hover:underline">
                Open Maps <ExternalLink className="size-3.5" />
              </span>
            </a>

            <img
              src={dressyLogo.url}
              alt="Dressy main logo"
              loading="lazy"
              width={900}
              height={700}
              className="max-h-64 w-full rounded-lg object-contain bg-primary/5"
            />
          </aside>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
