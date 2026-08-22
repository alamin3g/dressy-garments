import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, MapPin, Check, ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import ctaImg from "@/assets/cta-tags.jpg";

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

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const next: Errors = {};
    if (!form.name.trim()) next.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Please enter a valid email.";
    if (form.message.trim().length < 10) next.message = "Tell us a little more (10+ characters).";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
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
              Have a Product
              <br />
              In Mind?
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
                    className="label-xs flex items-center gap-4 bg-primary px-6 py-4 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    Send Enquiry <ArrowRight className="size-4" />
                  </button>
                </div>
              </form>
            )}
          </div>

          <aside>
            <ul className="divide-y divide-border border-y border-border">
              <li className="flex items-center gap-4 py-5">
                <MapPin className="size-4 text-primary" />
                <span className="text-sm text-muted-foreground">Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-4 py-5">
                <Phone className="size-4 text-primary" />
                <a href="tel:+8801234567890" className="text-sm text-muted-foreground hover:text-foreground">
                  +880 1234 567890
                </a>
              </li>
              <li className="flex items-center gap-4 py-5">
                <Mail className="size-4 text-primary" />
                <a href="mailto:hello@dressybd.com" className="text-sm text-muted-foreground hover:text-foreground">
                  hello@dressybd.com
                </a>
              </li>
            </ul>
            <img
              src={ctaImg}
              alt="Dressy branded hang tags and paper bag"
              loading="lazy"
              width={900}
              height={700}
              className="mt-8 max-h-72 w-full object-cover grayscale"
            />
          </aside>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
