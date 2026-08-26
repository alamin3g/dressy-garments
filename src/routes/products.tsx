import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useCatalogRealtime } from "@/hooks/use-realtime-sync";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/page-shell";
import { getSEOMetadata } from "@/lib/seo";
import { usePageContent } from "@/lib/page-content";
import { parseColor } from "@/lib/product-media";


import pKnit from "@/assets/p-knit.jpg";
import pWoven from "@/assets/p-woven.jpg";
import pOuterwear from "@/assets/p-outerwear.jpg";
import pFleece from "@/assets/p-fleece.jpg";
import pWorkwear from "@/assets/p-workwear.jpg";
import pDevelopmentAsset from "@/assets/p-development.jpg.asset.json";

const pDevelopment = pDevelopmentAsset.url;

export const Route = createFileRoute("/products")({
  head: () => getSEOMetadata({
    title: "Products — Garment Range & Styles",
    description: "Dressy Clothing is one of the leading Garments Manufacture. Explore our Knit, Woven, Outerwear, Fleece and Workwear collections.",
    url: "/products",
    image: "/__l5e/assets-v1/cbc3c3bb-0e8d-4ce5-9eb4-55ec1a2fac97/dressy-og.jpg",
  }),

  component: ProductsPage,
});

const PRODUCTS = [
  {
    n: "01",
    name: "Knit",
    group: "Jersey",
    img: pKnit,
    body: "T-shirts, polos, hoodies and loungewear in single jersey, pique, rib and interlock.",
    items: ["T-Shirts", "Polos", "Hoodies", "Loungewear"],
    moq: "1,200 pcs / colour",
  },
  {
    n: "02",
    name: "Woven",
    group: "Woven",
    img: pWoven,
    body: "Shirts, dresses, trousers and shorts in poplin, twill, viscose and linen blends.",
    items: ["Shirts", "Dresses", "Trousers", "Shorts"],
    moq: "800 pcs / colour",
  },
  {
    n: "03",
    name: "Outerwear",
    group: "Woven",
    img: pOuterwear,
    body: "Padded jackets, parkas, shells and vests with taped seams and technical trims.",
    items: ["Padded Jackets", "Parkas", "Shells", "Vests"],
    moq: "600 pcs / colour",
  },
  {
    n: "04",
    name: "Fleece",
    group: "Jersey",
    img: pFleece,
    body: "Brushed-back fleece sweats, zip-throughs and joggers in recycled and organic yarns.",
    items: ["Crewnecks", "Zip Hoodies", "Joggers"],
    moq: "1,000 pcs / colour",
  },
  {
    n: "05",
    name: "Workwear",
    group: "Woven",
    img: pWorkwear,
    body: "Durable workwear and uniforms with reinforced stitching and hi-vis options.",
    items: ["Coveralls", "Work Shirts", "Cargo Pants", "Hi-Vis"],
    moq: "1,500 pcs / colour",
  },
  {
    n: "06",
    name: "Development",
    group: "Service",
    img: pDevelopment,
    body: "Concept-to-sample development: patterns, CAD, fit sets and pre-production samples.",
    items: ["Tech Packs", "CAD", "Fit Sets", "PP Samples"],
    moq: "No minimum",
  },
];

const FILTERS = ["All", "Jersey", "Woven", "Service"] as const;

function useLiveProducts() {
  return useQuery({
    queryKey: ["public", "products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id,name,category,moq,description,images,colors")
        .eq("status", "Live")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

function ProductsPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const { data: live } = useLiveProducts();

  const q = query.trim().toLowerCase();

  const suggestions = (() => {
    if (!q) return [] as string[];
    const pool = new Set<string>();
    PRODUCTS.forEach((p) => {
      pool.add(p.name);
      pool.add(p.group);
      p.items.forEach((i) => pool.add(i));
    });
    (live ?? []).forEach((p) => {
      if (p.name) pool.add(p.name);
      if (p.category) pool.add(p.category);
    });
    return [...pool]
      .filter((s) => s.toLowerCase().includes(q))
      .sort((a, b) => a.toLowerCase().indexOf(q) - b.toLowerCase().indexOf(q))
      .slice(0, 8);
  })();

  const matches = (p: (typeof PRODUCTS)[number]) =>
    !q ||
    [p.name, p.group, p.body, p.moq, ...p.items].join(" ").toLowerCase().includes(q);

  const visible = PRODUCTS.filter(
    (p) => (filter === "All" || p.group === filter) && matches(p),
  );

  return (
    <PageShell
      path="/products"
      eyebrow="02 / Our Products"
      title={
        <>
          Built for
          <br />
          Every Rail.
        </>
      }
      intro="Six core programmes covering jersey, woven and technical garments — each with dedicated lines, patterns and quality standards."
    >
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1400px] px-6 py-12 md:px-10">
          <div className="relative max-w-xl">
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              onBlur={() => window.setTimeout(() => setOpen(false), 150)}
              placeholder="Search products — e.g. hoodies, parkas, workwear…"
              aria-label="Search products"
              className="w-full border border-border bg-background px-5 py-4 text-sm outline-none transition-colors focus:border-primary"
            />
            {open && suggestions.length > 0 && (
              <ul className="absolute z-30 mt-1 w-full border border-border bg-background shadow-lg">
                {suggestions.map((s) => (
                  <li key={s}>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        setQuery(s);
                        setFilter("All");
                        setOpen(false);
                      }}
                      className="block w-full px-5 py-3 text-left text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`label-xs border px-5 py-3 transition-colors ${
                  filter === f
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                }`}
              >
                {f}
              </button>
            ))}
            <span className="label-xs ml-auto text-muted-foreground">
              {visible.length} programme{visible.length === 1 ? "" : "s"}
            </span>
          </div>

          <div className="mt-10 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((p) => (
              <article key={p.name} className="group bg-background">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={p.img}
                    alt={`${p.name} garment detail`}
                    loading="lazy"
                    width={800}
                    height={600}
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute left-4 top-4">
                    <p className="display text-2xl">{p.n}</p>
                  </div>
                </div>
                <div className="p-6">
                  <h2 className="display text-3xl">{p.name}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {p.items.map((i) => (
                      <li key={i} className="label-xs border border-border px-3 py-2 text-muted-foreground">
                        {i}
                      </li>
                    ))}
                  </ul>
                  <p className="label-xs mt-6 text-primary">MOQ / {p.moq}</p>
                </div>
              </article>
            ))}
          </div>

          {visible.length === 0 && (
            <p className="mt-10 text-sm text-muted-foreground">
              No programmes match “{query}”.
            </p>
          )}
        </div>
      </section>

      <LiveStyles search={q} />
    </PageShell>
  );
}


function LiveStyles() {
  useCatalogRealtime();
  const cc = usePageContent("/products");
  const { data } = useQuery({
    queryKey: ["public", "products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id,name,category,moq,description,images,colors")
        .eq("status", "Live")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  if (!data || data.length === 0) return null;

  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-[1400px] px-6 py-12 md:px-10">
        <h2 className="display text-4xl">{cc("styles_title", "Current Styles")}</h2>
        <div className="mt-8 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
          {data.map((p) => {
            const images = (p.images ?? []) as string[];
            const colors = (p.colors ?? []) as string[];
            return (
              <article key={p.id} className="group bg-background">
                {images.length > 0 && (
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={images[0]}
                      alt={`${p.name} — ${p.category}`}
                      loading="lazy"
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {images.length > 1 && (
                      <div className="absolute bottom-3 left-3 flex gap-2">
                        {images.slice(1, 5).map((src, i) => (
                          <img
                            key={`${src}-${i}`}
                            src={src}
                            alt=""
                            loading="lazy"
                            className="size-10 rounded-md border border-background/60 object-cover"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
                <div className="p-6">
                  <p className="label-xs text-primary">{p.category}</p>
                  <h3 className="display mt-3 text-2xl">{p.name}</h3>
                  {p.description && (
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {p.description}
                    </p>
                  )}
                  {colors.length > 0 && (
                    <div className="mt-5 flex flex-wrap items-center gap-2">
                      {colors.map((c, i) => {
                        const { name, hex } = parseColor(c);
                        return (
                          <span
                            key={`${c}-${i}`}
                            title={name}
                            aria-label={name}
                            className="size-6 rounded-full border border-border shadow-sm"
                            style={{ backgroundColor: hex }}
                          />
                        );
                      })}
                    </div>
                  )}
                  <p className="label-xs mt-5 text-muted-foreground">MOQ / {p.moq}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}


