import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Shirt,
  Inbox,
  FileText,
  Images,
  Users,
  Settings,
  ExternalLink,
  Search,
  Plus,
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Console — Dressy Clothing Ltd." },
      {
        name: "description",
        content:
          "Internal Dressy admin console to preview products, inquiries, content and media in one place.",
      },
      { property: "og:title", content: "Admin Console — Dressy Clothing Ltd." },
      {
        property: "og:description",
        content: "Preview products, inquiries, content and media for Dressy Clothing Ltd.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

type SectionId =
  | "dashboard"
  | "products"
  | "inquiries"
  | "pages"
  | "media"
  | "team"
  | "settings";

const MENU: { id: SectionId; label: string; icon: typeof LayoutDashboard; hint: string }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, hint: "Overview" },
  { id: "products", label: "Products", icon: Shirt, hint: "Catalogue" },
  { id: "inquiries", label: "Inquiries", icon: Inbox, hint: "Leads" },
  { id: "pages", label: "Pages", icon: FileText, hint: "Site copy" },
  { id: "media", label: "Media", icon: Images, hint: "Assets" },
  { id: "team", label: "Team", icon: Users, hint: "Access" },
  { id: "settings", label: "Settings", icon: Settings, hint: "Config" },
];

const STATS = [
  { label: "Open Inquiries", value: "12" },
  { label: "Active Styles", value: "148" },
  { label: "Monthly Capacity", value: "5M pcs" },
  { label: "On-Time Delivery", value: "98%" },
];

const PRODUCTS = [
  { name: "Heavyweight Hoodie", cat: "Knitwear", moq: "500 pcs", status: "Live" },
  { name: "Oxford Shirt", cat: "Woven", moq: "800 pcs", status: "Live" },
  { name: "Cargo Workwear Pant", cat: "Workwear", moq: "1,000 pcs", status: "Draft" },
  { name: "Organic Cotton Tee", cat: "Knitwear", moq: "300 pcs", status: "Live" },
  { name: "Performance Jacket", cat: "Outerwear", moq: "600 pcs", status: "Review" },
];

const INQUIRIES = [
  { name: "Nordic Basics", email: "sourcing@nordicbasics.se", topic: "Knitwear program", when: "2h ago" },
  { name: "Halden Apparel", email: "buy@halden.co.uk", topic: "Sampling request", when: "Yesterday" },
  { name: "Maison Ora", email: "ops@maisonora.fr", topic: "Compliance docs", when: "2 days ago" },
  { name: "Volt Workwear", email: "hello@voltwork.de", topic: "Bulk quote", when: "4 days ago" },
];

const PAGES = [
  { path: "/", title: "Home", updated: "Aug 21, 2026" },
  { path: "/capabilities", title: "Capabilities", updated: "Aug 18, 2026" },
  { path: "/products", title: "Products", updated: "Aug 16, 2026" },
  { path: "/factory", title: "Factory", updated: "Aug 12, 2026" },
  { path: "/compliance", title: "Compliance", updated: "Aug 09, 2026" },
  { path: "/about", title: "About", updated: "Aug 02, 2026" },
  { path: "/contact", title: "Contact", updated: "Jul 30, 2026" },
];

const TEAM = [
  { name: "Rafiq Hasan", role: "Owner", email: "rafiq@dressy.com" },
  { name: "Nusrat Jahan", role: "Merchandiser", email: "nusrat@dressy.com" },
  { name: "Tanvir Ahmed", role: "Compliance", email: "tanvir@dressy.com" },
];

function Panel({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle: string;
  action?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="animate-fade-up">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-5">
        <div>
          <h2 className="display text-3xl md:text-4xl">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        </div>
        {action ? (
          <button
            type="button"
            className="label-xs inline-flex items-center gap-2 bg-primary px-4 py-2.5 text-primary-foreground transition-transform hover:scale-[1.02] active:scale-95"
          >
            <Plus className="size-3.5" />
            {action}
          </button>
        ) : null}
      </div>
      <div className="mt-6">{children}</div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const tone =
    status === "Live"
      ? "bg-primary/15 text-primary"
      : status === "Draft"
        ? "bg-muted text-muted-foreground"
        : "bg-foreground/10 text-foreground";
  return <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${tone}`}>{status}</span>;
}

function AdminPage() {
  const [active, setActive] = useState<SectionId>("dashboard");
  const current = MENU.find((m) => m.id === active)!;

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-4 py-6 md:flex-row md:px-8">
        {/* Left menu */}
        <aside className="md:sticky md:top-24 md:h-[calc(100vh-8rem)] md:w-64 md:shrink-0">
          <div className="flex h-full flex-col rounded-2xl border border-border bg-card/40 p-4">
            <div className="flex items-center gap-3 px-1 pb-4">
              <img src="/favicon.png" alt="Dressy" className="size-8 rounded-md object-contain" />
              <div>
                <p className="text-sm font-semibold leading-tight">Dressy Admin</p>
                <p className="text-[11px] text-muted-foreground">Frontend preview</p>
              </div>
            </div>

            <nav className="flex flex-row gap-1.5 overflow-x-auto pb-1 md:flex-col md:overflow-visible">
              {MENU.map((item) => {
                const Icon = item.icon;
                const isActive = item.id === active;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActive(item.id)}
                    className={`flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-all md:w-full ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25"
                        : "text-foreground/80 hover:bg-muted"
                    }`}
                  >
                    <Icon className="size-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="mt-auto hidden pt-4 md:block">
              <Link
                to="/"
                className="flex items-center justify-between rounded-xl border border-border px-3 py-2.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                View live site
                <ExternalLink className="size-3.5" />
              </Link>
            </div>
          </div>
        </aside>

        {/* Right preview */}
        <main className="min-w-0 flex-1">
          <div className="rounded-2xl border border-border bg-card/20 p-5 md:p-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <p className="label-xs text-primary">{current.hint}</p>
              <div className="flex items-center gap-2 rounded-full border border-border px-3 py-1.5">
                <Search className="size-3.5 text-muted-foreground" />
                <input
                  placeholder="Search…"
                  className="w-32 bg-transparent text-xs outline-none placeholder:text-muted-foreground sm:w-48"
                />
              </div>
            </div>

            {active === "dashboard" && (
              <Panel title="Dashboard" subtitle="Snapshot of the factory and the website.">
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                  {STATS.map((s) => (
                    <div key={s.label} className="rounded-xl border border-border p-4">
                      <p className="display text-3xl">{s.value}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 grid gap-4 lg:grid-cols-2">
                  <div className="rounded-xl border border-border p-4">
                    <p className="text-sm font-semibold">Latest inquiries</p>
                    <ul className="mt-3 space-y-3">
                      {INQUIRIES.slice(0, 3).map((i) => (
                        <li key={i.email} className="flex items-center justify-between gap-3 text-sm">
                          <span className="truncate">{i.name}</span>
                          <span className="shrink-0 text-xs text-muted-foreground">{i.when}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-xl border border-border p-4">
                    <p className="text-sm font-semibold">Recently updated pages</p>
                    <ul className="mt-3 space-y-3">
                      {PAGES.slice(0, 3).map((p) => (
                        <li key={p.path} className="flex items-center justify-between gap-3 text-sm">
                          <span className="truncate">{p.title}</span>
                          <span className="shrink-0 text-xs text-muted-foreground">{p.updated}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Panel>
            )}

            {active === "products" && (
              <Panel title="Products" subtitle="Catalogue styles shown on the products page." action="New style">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[520px] text-left text-sm">
                    <thead className="text-xs uppercase tracking-wider text-muted-foreground">
                      <tr>
                        <th className="pb-3 pr-4 font-medium">Style</th>
                        <th className="pb-3 pr-4 font-medium">Category</th>
                        <th className="pb-3 pr-4 font-medium">MOQ</th>
                        <th className="pb-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {PRODUCTS.map((p) => (
                        <tr key={p.name} className="border-t border-border transition-colors hover:bg-muted/40">
                          <td className="py-3 pr-4 font-medium">{p.name}</td>
                          <td className="py-3 pr-4 text-muted-foreground">{p.cat}</td>
                          <td className="py-3 pr-4 text-muted-foreground">{p.moq}</td>
                          <td className="py-3">
                            <StatusPill status={p.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Panel>
            )}

            {active === "inquiries" && (
              <Panel title="Inquiries" subtitle="Messages submitted through the contact form.">
                <ul className="space-y-3">
                  {INQUIRIES.map((i) => (
                    <li
                      key={i.email}
                      className="rounded-xl border border-border p-4 transition-colors hover:bg-muted/40"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm font-semibold">{i.name}</p>
                        <span className="text-xs text-muted-foreground">{i.when}</span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{i.email}</p>
                      <p className="mt-2 text-sm">{i.topic}</p>
                    </li>
                  ))}
                </ul>
              </Panel>
            )}

            {active === "pages" && (
              <Panel title="Pages" subtitle="Every public route with its last content update.">
                <div className="grid gap-3 sm:grid-cols-2">
                  {PAGES.map((p) => (
                    <div key={p.path} className="rounded-xl border border-border p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold">{p.title}</p>
                        <StatusPill status="Live" />
                      </div>
                      <p className="mt-1 font-mono text-xs text-muted-foreground">{p.path}</p>
                      <p className="mt-2 text-xs text-muted-foreground">Updated {p.updated}</p>
                    </div>
                  ))}
                </div>
              </Panel>
            )}

            {active === "media" && (
              <Panel title="Media" subtitle="Imagery used across the site." action="Upload">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {["/dressy-logo.png", "/favicon.png"].map((src) => (
                    <div key={src} className="overflow-hidden rounded-xl border border-border">
                      <div className="flex h-28 items-center justify-center bg-muted/40">
                        <img src={src} alt={src} className="max-h-full max-w-full object-contain" />
                      </div>
                      <p className="truncate px-3 py-2 font-mono text-[11px] text-muted-foreground">{src}</p>
                    </div>
                  ))}
                </div>
              </Panel>
            )}

            {active === "team" && (
              <Panel title="Team" subtitle="People with access to this console." action="Invite">
                <ul className="divide-y divide-border">
                  {TEAM.map((t) => (
                    <li key={t.email} className="flex flex-wrap items-center justify-between gap-3 py-4">
                      <div>
                        <p className="text-sm font-semibold">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.email}</p>
                      </div>
                      <StatusPill status={t.role} />
                    </li>
                  ))}
                </ul>
              </Panel>
            )}

            {active === "settings" && (
              <Panel title="Settings" subtitle="Company details shown across the website.">
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    { label: "Company name", value: "Dressy Clothing Ltd." },
                    { label: "Contact email", value: "hello@dressy.com" },
                    { label: "Head office", value: "Dhaka, Bangladesh" },
                    { label: "Monthly capacity", value: "5,000,000 pcs" },
                  ].map((f) => (
                    <label key={f.label} className="block">
                      <span className="label-xs text-muted-foreground">{f.label}</span>
                      <input
                        defaultValue={f.value}
                        className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary"
                      />
                    </label>
                  ))}
                </div>
                <button
                  type="button"
                  className="label-xs mt-6 bg-primary px-5 py-3 text-primary-foreground transition-transform hover:scale-[1.02] active:scale-95"
                >
                  Save changes
                </button>
              </Panel>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
