import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Eye, EyeOff, Loader2, Monitor } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { fetchProductCategories } from "@/lib/product-categories";
import { parseColor } from "@/lib/product-media";

/** Collapsible wrapper that frames a chunk of the real public site. */
function PreviewFrame({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div className="mb-8 overflow-hidden rounded-2xl border border-border bg-muted/20">
      <div className="flex items-center justify-between gap-4 border-b border-border bg-muted/40 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <Monitor className="size-4 text-primary" />
          <div>
            <p className="label-xs text-foreground">{title}</p>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="label-xs inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 transition-colors hover:border-primary hover:text-primary"
        >
          {open ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
          {open ? "Hide" : "Show"} live view
        </button>
      </div>
      {open && <div className="bg-background p-4">{children}</div>}
    </div>
  );
}

/** Exactly what the homepage "Our Products" grid currently renders. */
export function CategoryLivePreview() {
  const { data, isLoading } = useQuery({
    queryKey: ["product-categories"],
    queryFn: fetchProductCategories,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  return (
    <PreviewFrame
      title="Live on homepage — Our Products"
      subtitle="Updates instantly as you edit, reorder or upload."
    >
      {isLoading ? (
        <Loader2 className="size-5 animate-spin text-primary" />
      ) : !data || data.length === 0 ? (
        <p className="text-sm italic text-muted-foreground/80">
          Nothing published yet — the homepage falls back to default categories.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-3 lg:grid-cols-6">
          {data.map((c, i) => (
            <article
              key={c.id}
              className="group relative aspect-[3/4] overflow-hidden bg-card"
            >
              {c.image_url ? (
                <img
                  src={c.image_url}
                  alt={`${c.name} garment detail`}
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex size-full items-center justify-center bg-muted text-xs text-muted-foreground">
                  No image
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-transparent to-background/40" />
              <div className="absolute left-4 top-4">
                <p className="display text-2xl">{String(i + 1).padStart(2, "0")}</p>
                <p className="label-xs mt-1">{c.name}</p>
              </div>
            </article>
          ))}
        </div>

      )}
    </PreviewFrame>
  );
}

/** Exactly what the /products page "Current Styles" grid currently renders. */
export function ProductLivePreview() {
  const { data, isLoading } = useQuery({
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

  return (
    <PreviewFrame
      title="Live on /products — Current Styles"
      subtitle="Only styles with status “Live” appear to visitors."
    >
      {isLoading ? (
        <Loader2 className="size-5 animate-spin text-primary" />
      ) : !data || data.length === 0 ? (
        <p className="text-sm italic text-muted-foreground/80">
          No live styles yet — set a product's status to “Live” to publish it.
        </p>
      ) : (
        <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
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
                <div className="p-5">
                  <p className="label-xs text-primary">{p.category}</p>
                  <h3 className="display mt-2 text-xl">{p.name}</h3>
                  {p.description && (
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {p.description}
                    </p>
                  )}
                  {colors.length > 0 && (
                    <div className="mt-4 flex flex-wrap items-center gap-2">
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
                  <p className="label-xs mt-4 text-muted-foreground">MOQ / {p.moq}</p>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </PreviewFrame>
  );
}
