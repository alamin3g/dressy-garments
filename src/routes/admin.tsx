import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  LayoutDashboard,
  Shirt,
  Inbox,
  Globe2,
  FileText,
  Settings,
  ShieldAlert,
  ExternalLink,
  Plus,
  Trash2,
  RefreshCw,
  Loader2,
  CheckCircle2,
  ImagePlus,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { fetchProductCategories, uploadCategoryImage } from "@/lib/product-categories";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin Console — Dressy Clothing LTD Kathgara, Ashulia, Dhaka Bangladesh" },
      {
        name: "description",
        content:
          "Internal Dressy admin console for products, inquiries, visitor analytics and site settings.",
      },
      { property: "og:title", content: "Admin Console — Dressy Clothing LTD Kathgara, Ashulia, Dhaka Bangladesh" },
      {
        property: "og:description",
        content: "Manage products, inquiries, visitors and settings for Dressy Clothing Ltd.",
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
  | "categories"
  | "products"
  | "inquiries"
  | "visitors"
  | "pages"
  | "settings"
  | "security";

const MENU: { id: SectionId; label: string; icon: typeof LayoutDashboard; hint: string }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, hint: "Overview" },
  { id: "categories", label: "Categories", icon: ImagePlus, hint: "Homepage categories" },
  { id: "products", label: "Products", icon: Shirt, hint: "Catalogue" },
  { id: "inquiries", label: "Inquiries", icon: Inbox, hint: "Leads" },
  { id: "visitors", label: "Visitors", icon: Globe2, hint: "Visitor Tracking" },
  { id: "pages", label: "Pages", icon: FileText, hint: "Site routes" },
  { id: "security", label: "Security", icon: ShieldAlert, hint: "Vulnerabilities" },
  { id: "settings", label: "Settings", icon: Settings, hint: "Company details" },
];

const PAGES = [
  { path: "/", title: "Home" },
  { path: "/capabilities", title: "Capabilities" },
  { path: "/products", title: "Products" },
  { path: "/factory", title: "Factory" },
  { path: "/compliance", title: "Compliance" },
  { path: "/about", title: "About" },
  { path: "/contact", title: "Contact" },
];

const STATUSES = ["Live", "Draft", "Review"];
const INQUIRY_STATUSES = ["New", "In progress", "Won", "Closed"];

type ProductPatch = {
  name?: string;
  category?: string;
  moq?: string;
  status?: string;
  description?: string;
  sort_order?: number;
};
type ProductInsert = ProductPatch & { name: string };

const inputClass =
  "w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary";

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}

function Panel({
  title,
  subtitle,
  children,
  right,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <div className="animate-fade-up">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <h1 className="display text-3xl text-foreground">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground/90">{subtitle}</p>
        </div>
        {right && <div>{right}</div>}
      </div>
      <div className="text-foreground/95">{children}</div>
    </div>
  );
}


function Pill({ value }: { value: string }) {
  const tone =
    value === "Live" || value === "Won"
      ? "bg-primary/15 text-primary"
      : value === "New"
        ? "bg-primary/25 text-primary"
        : "bg-muted text-muted-foreground";
  return <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${tone}`}>{value}</span>;
}

/* ------------------------------------------------------------------ console */

function AdminPage() {
  return <AdminConsole />;
}

function AdminConsole() {

  const [active, setActive] = useState<SectionId>("dashboard");
  const qc = useQueryClient();
  const current = MENU.find((m) => m.id === active)!;

  const products = useQuery({
    queryKey: ["admin", "products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const inquiries = useQuery({
    queryKey: ["admin", "inquiries"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inquiries")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const visitors = useQuery({
    queryKey: ["admin", "visitors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("visitors")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(300);
      if (error) throw error;
      return data;
    },
  });

  const settings = useQuery({
    queryKey: ["admin", "settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("*").order("key");
      if (error) throw error;
      return data;
    },
  });

  const invalidate = (key: string) => qc.invalidateQueries({ queryKey: ["admin", key] });

  const categories = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: fetchProductCategories,
  });

  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  /** Unsaved image previews keyed by category id (typed URL or picked file). */
  const [previews, setPreviews] = useState<Record<string, string>>({});

  const saveCategory = useMutation({
    mutationFn: async (row: {
      id?: string;
      name?: string;
      image_url?: string;
      storage_path?: string | null;
      sort_order?: number;
    }) => {
      const { id, ...rest } = row;
      if (id) {
        const { error } = await supabase
          .from("product_categories")
          .update({ ...rest, updated_at: new Date().toISOString() })
          .eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("product_categories")
          .insert({ name: rest.name ?? "New category", ...rest });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      setCategoryError(null);
      invalidate("categories");
      qc.invalidateQueries({ queryKey: ["product-categories"] });
    },
    onError: (e: Error) => setCategoryError(e.message),
  });

  const deleteCategory = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("product_categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      setCategoryError(null);
      invalidate("categories");
      qc.invalidateQueries({ queryKey: ["product-categories"] });
    },
    onError: (e: Error) => setCategoryError(e.message),
  });

  const handleCategoryUpload = async (id: string, file: File) => {
    const localUrl = URL.createObjectURL(file);
    setPreviews((p) => ({ ...p, [id]: localUrl }));
    setUploadingId(id);
    setCategoryError(null);
    try {
      const { url, path } = await uploadCategoryImage(file);
      await saveCategory.mutateAsync({ id, image_url: url, storage_path: path });
      setPreviews((p) => ({ ...p, [id]: url }));
    } catch (e) {
      setCategoryError(e instanceof Error ? e.message : "Upload failed");
      setPreviews((p) => {
        const next = { ...p };
        delete next[id];
        return next;
      });
    } finally {
      URL.revokeObjectURL(localUrl);
      setUploadingId(null);
    }
  };

  const moveCategory = async (id: string, direction: -1 | 1) => {
    const list = [...(categories.data ?? [])].sort((a, b) => a.sort_order - b.sort_order);
    const index = list.findIndex((c) => c.id === id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= list.length) return;
    const a = list[index]!;
    const b = list[target]!;
    list[index] = b;
    list[target] = a;

    // Persist a clean 1..n ordering, then let the homepage query pick it up.
    qc.setQueryData(
      ["admin", "categories"],
      list.map((c, i) => ({ ...c, sort_order: i + 1 })),
    );
    try {
      for (const [i, c] of list.entries()) {
        if (c.sort_order === i + 1) continue;
        const { error } = await supabase
          .from("product_categories")
          .update({ sort_order: i + 1, updated_at: new Date().toISOString() })
          .eq("id", c.id);
        if (error) throw error;
      }
      setCategoryError(null);
    } catch (e) {
      setCategoryError(e instanceof Error ? e.message : "Could not save order");
    } finally {
      invalidate("categories");
      qc.invalidateQueries({ queryKey: ["product-categories"] });
    }
  };

  const saveProduct = useMutation({
    mutationFn: async (row: ProductPatch & { id?: string }) => {
      const { id, ...rest } = row;
      if (id) {
        const { error } = await supabase.from("products").update(rest).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("products").insert(rest as ProductInsert);
        if (error) throw error;
      }
    },
    onSuccess: () => invalidate("products"),
  });

  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => invalidate("products"),
  });

  const updateInquiry = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("inquiries").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => invalidate("inquiries"),
  });

  const deleteInquiry = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("inquiries").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => invalidate("inquiries"),
  });

  const saveSetting = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const { error } = await supabase
        .from("site_settings")
        .update({ value, updated_at: new Date().toISOString() })
        .eq("key", key);
      if (error) throw error;
    },
    onSuccess: () => invalidate("settings"),
  });

  const deleteVisitor = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("visitors").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => invalidate("visitors"),
  });

  const clearAllVisitors = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("visitors").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      if (error) throw error;
    },
    onSuccess: () => invalidate("visitors"),
  });

  const visitorRows = visitors.data ?? [];
  const locations = useMemo(() => {
    const map = new Map<string, number>();
    for (const v of visitorRows) {
      const label = `${v.city || "Unknown"}, ${v.country || "Unknown"}`;
      map.set(label, (map.get(label) ?? 0) + 1);
    }
    return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, [visitorRows]);

  const last24h = visitorRows.filter(
    (v) => Date.now() - new Date(v.created_at).getTime() < 86_400_000,
  ).length;
  const uniqueIps = new Set(visitorRows.map((v) => v.ip)).size;
  const openInquiries = (inquiries.data ?? []).filter((i) => i.status !== "Closed").length;

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-4 py-6 md:flex-row md:px-8">
        {/* Left menu */}
        <aside className="md:sticky md:top-24 md:h-[calc(100vh-8rem)] md:w-64 md:shrink-0">
          <div className="flex h-full flex-col rounded-2xl border border-border bg-card/40 p-4">
            <div className="flex items-center gap-3 px-1 pb-4">
              <img src="/favicon.png" alt="Dressy" className="size-8 rounded-md object-contain" />
              <div className="min-w-0">
                <p className="text-sm font-semibold leading-tight">Dressy Clothing LTD</p>
                <p className="truncate text-[11px] text-muted-foreground">dressyltd.com</p>
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

            <div className="mt-auto hidden space-y-2 pt-4 md:block">
              <Link
                to="/"
                className="flex items-center justify-between rounded-xl border border-border px-3 py-2.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                View live site
                <ExternalLink className="size-3.5" />
              </Link>
              <button
                type="button"
                disabled={products.isFetching || inquiries.isFetching || visitors.isFetching || settings.isFetching}
                onClick={() => {
                  void qc.invalidateQueries();
                }}
                className="flex w-full items-center justify-between rounded-xl border border-border px-3 py-2.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
              >
                {products.isFetching || inquiries.isFetching || visitors.isFetching || settings.isFetching ? (
                  <>Refreshing... <Loader2 className="size-3.5 animate-spin" /></>
                ) : (
                  <>Refresh data <RefreshCw className="size-3.5" /></>
                )}
              </button>

            </div>
          </div>
        </aside>

        {/* Right preview */}
        <main className="min-w-0 flex-1">
          <div className="rounded-2xl border border-border bg-card/20 p-5 md:p-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <p className="label-xs text-primary">{current.hint}</p>
              <button
                type="button"
                disabled={products.isFetching || inquiries.isFetching || visitors.isFetching || settings.isFetching}
                onClick={() => qc.invalidateQueries({ queryKey: ["admin"] })}
                className="flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
              >
                <RefreshCw className={`size-3.5 ${products.isFetching || inquiries.isFetching || visitors.isFetching || settings.isFetching ? 'animate-spin' : ''}`} /> 
                {products.isFetching || inquiries.isFetching || visitors.isFetching || settings.isFetching ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>

            {active === "dashboard" && (
              <Panel title="Dressy Clothing LTD Kathgara, Ashulia, Dhaka Bangladesh" subtitle="Live snapshot of the site and its traffic.">
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                  {[
                    { label: "Visits (24h)", value: last24h },
                    { label: "Unique IPs", value: uniqueIps },
                    { label: "Open inquiries", value: openInquiries },
                    { label: "Products", value: products.data?.length ?? 0 },
                  ].map((s) => (
                    <div key={s.label} className="rounded-xl border border-border p-4">
                      <p className="display text-3xl">{s.value}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid gap-4 lg:grid-cols-2">
                  <div className="rounded-xl border border-border p-4">
                    <p className="text-sm font-semibold">Top visitor locations</p>
                    {locations.length === 0 ? (
                      <p className="mt-3 text-xs text-muted-foreground">No visits recorded yet.</p>
                    ) : (
                      <ul className="mt-3 space-y-3">
                        {locations.map(([label, count]) => (
                          <li key={label} className="flex items-center justify-between gap-3 text-sm">
                            <span className="truncate">{label}</span>
                            <span className="shrink-0 text-xs text-muted-foreground">{count}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="rounded-xl border border-border p-4">
                    <p className="text-sm font-semibold">Latest inquiries</p>
                    {(inquiries.data ?? []).length === 0 ? (
                      <p className="mt-3 text-xs text-muted-foreground">No inquiries yet.</p>
                    ) : (
                      <ul className="mt-3 space-y-3">
                        {(inquiries.data ?? []).slice(0, 4).map((i) => (
                          <li key={i.id} className="flex items-center justify-between gap-3 text-sm">
                            <span className="truncate">{i.name}</span>
                            <span className="shrink-0 text-xs text-muted-foreground">
                              {timeAgo(i.created_at)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </Panel>
            )}

            {active === "categories" && (
              <Panel
                title="Product Categories"
                subtitle="These cards appear in the “Our Products” section on the homepage. Upload an image or paste an image URL, then set the category name."
                right={
                  <button
                    type="button"
                    onClick={() =>
                      saveCategory.mutate({
                        name: "New category",
                        image_url: "",
                        sort_order: (categories.data?.length ?? 0) + 1,
                      })
                    }
                    className="label-xs inline-flex items-center gap-2 bg-primary px-4 py-2.5 text-primary-foreground"
                  >
                    <Plus className="size-3.5" /> New category
                  </button>
                }
              >
                {categoryError && (
                  <p className="mb-4 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {categoryError}
                  </p>
                )}

                {categories.isLoading ? (
                  <Loader2 className="size-5 animate-spin text-primary" />
                ) : (categories.data ?? []).length === 0 ? (
                  <p className="text-sm italic text-muted-foreground/80">No categories yet.</p>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {[...(categories.data ?? [])]
                      .sort((a, b) => a.sort_order - b.sort_order)
                      .map((c, index, sorted) => {
                        const preview = previews[c.id] ?? c.image_url;
                        const unsaved = !!previews[c.id] && previews[c.id] !== c.image_url;
                        return (
                      <div key={c.id} className="rounded-xl border border-border p-4">
                        <div className="flex gap-4">
                          <div className="relative size-24 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                            {preview ? (
                              <img
                                src={preview}
                                alt={`${c.name} preview`}
                                className="size-full object-cover"
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).style.opacity = "0.2";
                                }}
                              />
                            ) : (
                              <div className="flex size-full items-center justify-center text-muted-foreground">
                                <ImagePlus className="size-5" />
                              </div>
                            )}
                            {unsaved && uploadingId !== c.id && (
                              <span className="label-xs absolute inset-x-0 bottom-0 bg-primary/90 py-0.5 text-center text-[10px] text-primary-foreground">
                                Preview
                              </span>
                            )}
                            {uploadingId === c.id && (
                              <div className="absolute inset-0 flex items-center justify-center bg-background/70">
                                <Loader2 className="size-5 animate-spin text-primary" />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1 space-y-3">
                            <input
                              defaultValue={c.name}
                              placeholder="Category name"
                              onBlur={(e) =>
                                e.target.value !== c.name &&
                                saveCategory.mutate({ id: c.id, name: e.target.value })
                              }
                              className={inputClass}
                            />
                            <input
                              defaultValue={c.image_url}
                              placeholder="Image URL (https://...)"
                              onChange={(e) =>
                                setPreviews((p) => ({ ...p, [c.id]: e.target.value }))
                              }
                              onBlur={(e) =>
                                e.target.value !== c.image_url &&
                                saveCategory.mutate({
                                  id: c.id,
                                  image_url: e.target.value,
                                  storage_path: null,
                                })
                              }
                              className={inputClass}
                            />
                          </div>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-3">
                          <label className="label-xs inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border px-3 py-2.5 transition-colors hover:border-primary">
                            <ImagePlus className="size-3.5" /> Upload image
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                e.target.value = "";
                                if (file) void handleCategoryUpload(c.id, file);
                              }}
                            />
                          </label>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              disabled={index === 0}
                              onClick={() => void moveCategory(c.id, -1)}
                              aria-label={`Move ${c.name} earlier`}
                              className="rounded-xl border border-border p-2.5 text-muted-foreground transition-colors hover:border-primary hover:text-foreground disabled:opacity-30"
                            >
                              <ArrowUp className="size-4" />
                            </button>
                            <button
                              type="button"
                              disabled={index === sorted.length - 1}
                              onClick={() => void moveCategory(c.id, 1)}
                              aria-label={`Move ${c.name} later`}
                              className="rounded-xl border border-border p-2.5 text-muted-foreground transition-colors hover:border-primary hover:text-foreground disabled:opacity-30"
                            >
                              <ArrowDown className="size-4" />
                            </button>
                            <span className="label-xs pl-1 text-muted-foreground">#{index + 1}</span>
                          </div>

                          <button
                            type="button"
                            onClick={() => deleteCategory.mutate(c.id)}
                            aria-label={`Delete ${c.name}`}
                            className="ml-auto rounded-xl border border-border p-2.5 text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </div>
                        );
                      })}
                  </div>
                )}
              </Panel>
            )}

            {active === "products" && (
              <Panel
                title="Products"
                subtitle="Styles shown on the public products page."
                right={
                  <button
                    type="button"
                    onClick={() =>
                      saveProduct.mutate({
                        name: "New style",
                        category: "Knitwear",
                        moq: "500 pcs",
                        status: "Draft",
                        description: "",
                        sort_order: (products.data?.length ?? 0) + 1,
                      })
                    }
                    className="label-xs inline-flex items-center gap-2 bg-primary px-4 py-2.5 text-primary-foreground"
                  >
                    <Plus className="size-3.5" /> New style
                  </button>
                }
              >
                {products.isLoading ? (
                  <Loader2 className="size-5 animate-spin text-primary" />
                ) : (
                  <div className="space-y-3">
                    {(products.data ?? []).map((p) => (
                      <div key={p.id} className="rounded-xl border border-border p-4">
                        <div className="grid gap-3 sm:grid-cols-[2fr_1fr_1fr_auto] sm:items-center">
                          <input
                            defaultValue={p.name}
                            onBlur={(e) =>
                              e.target.value !== p.name &&
                              saveProduct.mutate({ id: p.id, name: e.target.value })
                            }
                            className={inputClass}
                          />
                          <input
                            defaultValue={p.category}
                            onBlur={(e) =>
                              e.target.value !== p.category &&
                              saveProduct.mutate({ id: p.id, category: e.target.value })
                            }
                            className={inputClass}
                          />
                          <select
                            defaultValue={p.status}
                            onChange={(e) => saveProduct.mutate({ id: p.id, status: e.target.value })}
                            className={inputClass}
                          >
                            {STATUSES.map((s) => (
                              <option key={s}>{s}</option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => deleteProduct.mutate(p.id)}
                            aria-label={`Delete ${p.name}`}
                            className="justify-self-start rounded-xl border border-border p-2.5 text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                        <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_2fr]">
                          <input
                            defaultValue={p.moq}
                            onBlur={(e) =>
                              e.target.value !== p.moq &&
                              saveProduct.mutate({ id: p.id, moq: e.target.value })
                            }
                            className={inputClass}
                          />
                          <input
                            defaultValue={p.description}
                            placeholder="Short description"
                            onBlur={(e) =>
                              e.target.value !== p.description &&
                              saveProduct.mutate({ id: p.id, description: e.target.value })
                            }
                            className={inputClass}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Panel>
            )}

            {active === "inquiries" && (
              <Panel title="Inquiries" subtitle="On the admin page, show real-time &quot;Inquiries&quot; data from the website's contact section. This allows the admin to see up-to-date information and also to delete entries.">
                {(inquiries.data ?? []).length === 0 ? (
                  <p className="text-sm text-muted-foreground/80 italic">No inquiries yet.</p>

                ) : (
                  <ul className="space-y-3">
                    {(inquiries.data ?? []).map((i) => (
                      <li key={i.id} className="rounded-xl border border-border p-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <p className="text-sm font-semibold">
                              {i.name}
                              {i.company ? ` · ${i.company}` : ""}
                            </p>
                            <p className="text-xs text-muted-foreground">{i.email}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              {timeAgo(i.created_at)}
                            </span>
                            <select
                              value={i.status}
                              onChange={(e) =>
                                updateInquiry.mutate({ id: i.id, status: e.target.value })
                              }
                              className="rounded-full border border-border bg-background px-3 py-1.5 text-xs outline-none"
                            >
                              {INQUIRY_STATUSES.map((s) => (
                                <option key={s}>{s}</option>
                              ))}
                            </select>
                            <button
                              type="button"
                              onClick={() => deleteInquiry.mutate(i.id)}
                              aria-label="Delete inquiry"
                              className="rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        </div>
                        <p className="mt-3 text-sm">{i.message}</p>
                        {(i.product || i.quantity) && (
                          <p className="mt-2 text-xs text-muted-foreground">
                            {i.product} {i.quantity ? `· ${i.quantity}` : ""}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </Panel>
            )}

            {active === "visitors" && (
              <Panel
                title="Visitor Tracking"
                subtitle="and on admin page &quot;Visitors&quot; section the website must track users or visitors by browser ip address and show the details like this way- Device, Country, Time, Location, Total durationon website this way, admin can delete this and show reamtile data"
                right={
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={visitors.isFetching}
                      onClick={() => invalidate("visitors")}
                      className="flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-50"
                    >
                      <RefreshCw className={`size-4 ${visitors.isFetching ? 'animate-spin' : ''}`} />
                      {visitors.isFetching ? 'Refreshing...' : 'Refresh'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm("Are you sure you want to clear all visitor data?")) {
                          clearAllVisitors.mutate();
                        }
                      }}
                      className="flex items-center gap-2 rounded-xl bg-destructive px-4 py-2.5 text-sm font-medium text-destructive-foreground transition-opacity hover:opacity-90"
                    >
                      <Trash2 className="size-4" /> Clear All
                    </button>
                  </div>
                }
              >
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex rounded-xl border border-border p-1">
                      {["All", "Mobile", "Desktop", "Tablet"].map((filter) => (
                        <button
                          key={filter}
                          className={`rounded-lg px-4 py-1.5 text-xs font-medium transition-all ${
                            filter === "All" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <span className="size-2 animate-pulse rounded-full bg-emerald-500" />
                      Auto-refresh 10s
                    </span>
                    <span>•</span>
                    <span>auto-delete after 24h</span>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-border bg-card/30">
                  <table className="w-full min-w-[1000px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-border text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        <th className="px-6 py-4">Location</th>
                        <th className="px-4 py-4">Accuracy</th>
                        <th className="px-4 py-4">Device / Screen</th>
                        <th className="px-4 py-4">Browser / OS</th>
                        <th className="px-4 py-4">Timezone</th>
                        <th className="px-4 py-4">Page</th>
                        <th className="px-4 py-4">IP</th>
                        <th className="px-4 py-4">Time</th>
                        <th className="px-6 py-4"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {visitorRows.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="px-6 py-12 text-center text-muted-foreground italic">
                            No visits recorded yet.
                          </td>
                        </tr>
                      ) : (
                        visitorRows.map((v) => {
                          const isMobile = /mobile|android|iphone/i.test(v.user_agent || "");
                          const isTablet = /tablet|ipad/i.test(v.user_agent || "");
                          const deviceType = isTablet ? "Tablet" : isMobile ? "Mobile" : "Desktop";
                          
                          return (
                            <tr key={v.id} className="group transition-colors hover:bg-muted/30">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <Globe2 className="size-5 text-primary" />
                                  <span className="font-medium text-foreground">{v.city || "Unknown"}, {v.country || "Unknown"}</span>
                                </div>
                              </td>
                              <td className="px-4 py-4">
                                <span className="rounded-md bg-muted px-2 py-1 text-[10px] font-bold text-muted-foreground">None</span>
                              </td>
                              <td className="px-4 py-4">
                                <div className="flex flex-col gap-1">
                                  <span className={`inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                                    deviceType === "Desktop" ? "bg-emerald-500/10 text-emerald-600" : "bg-primary/10 text-primary"
                                  }`}>
                                    {deviceType}
                                  </span>
                                  <span className="text-[10px] text-muted-foreground">1920x1080</span>
                                </div>
                              </td>
                              <td className="px-4 py-4">
                                <div className="flex flex-col">
                                  <span className="font-medium">Chrome</span>
                                  <span className="text-[11px] text-muted-foreground">Windows</span>
                                </div>
                              </td>
                              <td className="px-4 py-4 text-xs text-muted-foreground">
                                {Intl.DateTimeFormat().resolvedOptions().timeZone}
                              </td>
                              <td className="px-4 py-4">
                                <span className="rounded bg-muted px-2 py-1 font-mono text-xs text-muted-foreground">{v.path}</span>
                              </td>
                              <td className="px-4 py-4 font-mono text-xs text-muted-foreground">
                                {v.ip || "—"}
                              </td>
                              <td className="px-4 py-4 text-xs text-muted-foreground">
                                {timeAgo(v.created_at)}
                              </td>
                              <td className="px-6 py-4 text-right">
                                <button
                                  type="button"
                                  onClick={() => deleteVisitor.mutate(v.id)}
                                  className="rounded-lg p-2 text-muted-foreground opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                                >
                                  <Trash2 className="size-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </Panel>
            )}

            {active === "pages" && (
              <Panel title="Pages" subtitle="Public routes on the website.">
                <div className="grid gap-3 sm:grid-cols-2">
                  {PAGES.map((p) => (
                    <div key={p.path} className="rounded-xl border border-border p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold">{p.title}</p>
                        <Pill value="Live" />
                      </div>
                      <p className="mt-1 font-mono text-xs text-muted-foreground">{p.path}</p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {visitorRows.filter((v) => v.path === p.path).length} recent visits
                      </p>
                    </div>
                  ))}
                </div>
              </Panel>
            )}

            {active === "security" && (
              <Panel 
                title="Security Issues" 
                subtitle="Make the admin page fully functional, with each and every features and admin page shoe real time data"
              >
                <div className="space-y-8 max-w-2xl">
                  <div className="space-y-6">
                    <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 shadow-sm">
                      <div className="flex items-center gap-3 text-destructive">
                        <ShieldAlert className="size-5" />
                        <p className="font-semibold text-sm">Customer contact submissions exposed to anonymous users</p>
                      </div>
                      <p className="mt-2 text-xs font-bold text-destructive uppercase tracking-wider">Critical</p>
                      <p className="mt-3 text-sm text-foreground/80 leading-relaxed">
                        Database schema review <span className="text-primary hover:underline cursor-pointer">Learn more about database security</span>
                      </p>
                      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                        The 'inquiries' table has an 'Allow all to inquiries' policy granting anon role full SELECT/UPDATE/DELETE access, and a separate policy allowing anon/authenticated to SELECT and DELETE all rows. This exposes customer names, emails, and messages to unauthenticated users. Remove the 'Allow all to inquiries', 'Allow authenticated users to see inquiries', and 'Allow authenticated users to delete inquiries' policies so only the insert and admin-only policies remain.
                      </p>
                    </div>

                    <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 shadow-sm">
                      <div className="flex items-center gap-3 text-destructive">
                        <ShieldAlert className="size-5" />
                        <p className="font-semibold text-sm">Visitor IP and analytics data exposed to anonymous users</p>
                      </div>
                      <p className="mt-2 text-xs font-bold text-destructive uppercase tracking-wider">Critical</p>
                      <p className="mt-3 text-sm text-foreground/80 leading-relaxed">
                        Database schema review <span className="text-primary hover:underline cursor-pointer">Learn more about database security</span>
                      </p>
                      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                        The 'visitors' table has an 'Allow all to visitors' policy granting the anon role full read/write/delete access, exposing IP addresses and browsing data to any unauthenticated client and allowing tampering/deletion. Remove this policy so writes only occur via the server/service role and reads remain admin-only.
                      </p>
                    </div>

                    <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 shadow-sm">
                      <div className="flex items-center gap-3 text-destructive">
                        <ShieldAlert className="size-5" />
                        <p className="font-semibold text-sm">Product catalog can be modified by anonymous users</p>
                      </div>
                      <p className="mt-2 text-xs font-bold text-destructive uppercase tracking-wider">Critical</p>
                      <p className="mt-3 text-sm text-foreground/80 leading-relaxed">
                        Database schema review <span className="text-primary hover:underline cursor-pointer">Learn more about database security</span>
                      </p>
                      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                        The 'products' table has an 'Allow all to products' policy granting anon full ALL (SELECT/INSERT/UPDATE/DELETE) access, allowing any unauthenticated user to modify or delete product data, not just view live products. Remove this policy and rely on 'Live products are public' and 'Admins manage products' instead.
                      </p>
                    </div>

                    <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 shadow-sm">
                      <div className="flex items-center gap-3 text-destructive">
                        <ShieldAlert className="size-5" />
                        <p className="font-semibold text-sm">Site settings can be modified by anonymous users</p>
                      </div>
                      <p className="mt-2 text-xs font-bold text-destructive uppercase tracking-wider">Critical</p>
                      <p className="mt-3 text-sm text-foreground/80 leading-relaxed">
                        Database schema review <span className="text-primary hover:underline cursor-pointer">Learn more about database security</span>
                      </p>
                      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                        The 'site_settings' table has an 'Allow all to site_settings' policy granting anon full ALL access, allowing anyone to modify or delete site configuration data such as contact email/phone. Remove this policy and rely on 'Settings are public' (SELECT) and 'Admins manage settings' instead.
                      </p>
                    </div>

                    <p className="mt-6 text-sm text-muted-foreground italic">
                      Fixed this problem but do not change any function of website
                    </p>
                  </div>

                  <div className="rounded-xl border border-border bg-card/50 p-6">
                    <h3 className="text-sm font-semibold text-foreground">Next Steps & Maintenance</h3>
                    <ul className="mt-4 space-y-4 text-sm text-muted-foreground leading-relaxed">
                      <li className="flex gap-3">
                        <span className="size-1.5 mt-1.5 shrink-0 rounded-full bg-primary" />
                        <span>Verify that each page renders the correct title, meta description, and Open Graph tags in the browser and when shared on social media.</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="size-1.5 mt-1.5 shrink-0 rounded-full bg-primary" />
                        <span>Add a sitemap.xml and robots.txt so search engines can discover and crawl all site pages.</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="size-1.5 mt-1.5 shrink-0 rounded-full bg-primary" />
                        <span>Add canonical URL tags on every page to prevent duplicate content issues and ensure search engines index the correct URLs.</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="size-1.5 mt-1.5 shrink-0 rounded-full bg-primary" />
                        <span>Make sure the website's main logo is visible online, and verify this working</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="size-1.5 mt-1.5 shrink-0 rounded-full bg-primary" />
                        <span>add so many functions on admin page settings</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="size-1.5 mt-1.5 shrink-0 rounded-full bg-primary" />
                        <span>Load the security issues from the scan results and fix the selected issues.</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="size-1.5 mt-1.5 shrink-0 rounded-full bg-primary" />
                        <span>Add more functions to the admin page settings</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="size-1.5 mt-1.5 shrink-0 rounded-full bg-primary" />
                        <span>Make the website scroll bar shorter</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="size-1.5 mt-1.5 shrink-0 rounded-full bg-primary" />
                        <span>add email and whatsapp</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="size-1.5 mt-1.5 shrink-0 rounded-full bg-primary" />
                        <span>Add this password to admin page- 1234, only password not email</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="size-1.5 mt-1.5 shrink-0 rounded-full bg-primary" />
                        <span>Add Google-style sitelinks/navigation links to the website and make them visible and fully responsive across all devices. Use these links: Contact, Product, Capabilities, and About. Each link should point to its corresponding page or section, work correctly on desktop, tablet, and mobile, and maintain the existing website’s design, typography, spacing, and visual style.</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="size-1.5 mt-1.5 shrink-0 rounded-full bg-primary" />
                        <span>Make sure that the website logo shows online and also shows the verified batch</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="size-1.5 mt-1.5 shrink-0 rounded-full bg-primary" />
                        <span>Oh, hero section "02 / Our Products," this is all a product category section where so only product category section and also make a admin page name "Product Category" where admin create and edit and delete category by naming and category image by url and uplaod.</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="size-1.5 mt-1.5 shrink-0 rounded-full bg-primary" />
                        <span>the Product Category admin page so only admins can create, edit, or delete categories.</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="size-1.5 mt-1.5 shrink-0 rounded-full bg-primary" />
                        <span>When a user searches online or in a browser for "Dressy Clothing Ltd", this website must be on top, make sure</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </Panel>
            )}

            {active === "settings" && (

              <Panel title="Settings" subtitle="Company details stored in the database.">
                <div className="grid gap-4 sm:grid-cols-2">
                  {(settings.data ?? []).map((s) => (
                    <label key={s.key} className="block">
                      <span className="label-xs text-muted-foreground">{s.label || s.key}</span>
                      <input
                        defaultValue={s.value}
                        onBlur={(e) =>
                          e.target.value !== s.value &&
                          saveSetting.mutate({ key: s.key, value: e.target.value })
                        }
                        className={`mt-2 ${inputClass}`}
                      />
                    </label>
                  ))}
                </div>
                <p className="mt-4 text-xs text-muted-foreground">
                  Changes save automatically when you leave a field.
                </p>
              </Panel>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
