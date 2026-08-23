import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/page-shell";

import pKnit from "@/assets/p-knit.jpg";
import pWoven from "@/assets/p-woven.jpg";
import pOuterwear from "@/assets/p-outerwear.jpg";
import pFleece from "@/assets/p-fleece.jpg";
import pWorkwear from "@/assets/p-workwear.jpg";
import pDevelopment from "@/assets/p-development.jpg";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Products — Knit, Woven, Outerwear & Workwear | Dressy" },
      {
        name: "description",
        content:
          "Explore Dressy's product range: knit, woven, outerwear, fleece, workwear and development styles produced for global fashion brands.",
      },
      { property: "og:title", content: "Products — Knit, Woven, Outerwear & Workwear | Dressy" },
      {
        property: "og:description",
        content: "Knit, woven, outerwear, fleece and workwear programmes made in Dhaka, Bangladesh.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://dressyltd.com/products" },
      { property: "og:image", content: "https://dressyltd.com/__l5e/assets-v1/cbc3c3bb-0e8d-4ce5-9eb4-55ec1a2fac97/dressy-og.jpg" },
      { name: "twitter:image", content: "https://dressyltd.com/__l5e/assets-v1/cbc3c3bb-0e8d-4ce5-9eb4-55ec1a2fac97/dressy-og.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://dressyltd.com/products" }],
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

function ProductsPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const visible = PRODUCTS.filter((p) => filter === "All" || p.group === filter);

  return (
    <PageShell
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
          <div className="flex flex-wrap items-center gap-3">
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
        </div>
      </section>

      <LiveStyles />
    </PageShell>
  );
}

function LiveStyles() {
  const { data } = useQuery({
    queryKey: ["public", "products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id,name,category,moq,description")
        .eq("status", "Live")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  if (!data || data.length === 0) return null;

  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-[1400px] px-6 py-12 md:px-10">
        <h2 className="display text-4xl">Current Styles</h2>
        <div className="mt-8 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
          {data.map((p) => (
            <article key={p.id} className="bg-background p-6">
              <p className="label-xs text-primary">{p.category}</p>
              <h3 className="display mt-3 text-2xl">{p.name}</h3>
              {p.description && (
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.description}</p>
              )}
              <p className="label-xs mt-5 text-muted-foreground">MOQ / {p.moq}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

