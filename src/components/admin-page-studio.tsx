import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Check,
  GripVertical,
  Loader2,
  Monitor,
  Plus,
  RefreshCw,
  RotateCcw,
  Smartphone,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { uploadCategoryImage } from "@/lib/product-categories";
import { pageContentKey, usePageContentMap, type PageDef, type PageField } from "@/lib/page-content";

const inputClass =
  "w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary";

/* ------------------------------------------------------------------ */
/* Image field                                                         */
/* ------------------------------------------------------------------ */

function ImageField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function pick(file: File) {
    setUploading(true);
    try {
      const { url } = await uploadCategoryImage(file);
      onChange(url);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://… image URL"
          className={inputClass}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex shrink-0 items-center gap-2 rounded-xl border border-border px-3 py-2.5 text-xs font-semibold transition-colors hover:border-primary disabled:opacity-60"
        >
          {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void pick(f);
            e.target.value = "";
          }}
        />
      </div>
      {value ? (
        <img
          src={value}
          alt="Section preview"
          className="h-28 w-full rounded-xl border border-border object-cover"
        />
      ) : (
        <p className="text-[11px] text-muted-foreground">Using the default photo from the website.</p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Drag-and-drop list field (Shopify style blocks)                     */
/* ------------------------------------------------------------------ */

function ListField({
  value,
  fallback,
  onChange,
}: {
  value: string;
  fallback: string;
  onChange: (v: string) => void;
}) {
  const lines = (value || fallback || "").split("\n").filter((l) => l.trim().length > 0);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const commit = (next: string[]) => onChange(next.join("\n"));

  const move = (from: number, to: number) => {
    if (from === to) return;
    const next = [...lines];
    const [row] = next.splice(from, 1);
    next.splice(to, 0, row!);
    commit(next);
  };

  return (
    <div className="space-y-2">
      {lines.map((line, i) => (
        <div
          key={i}
          draggable
          onDragStart={() => setDragIndex(i)}
          onDragEnd={() => {
            setDragIndex(null);
            setOverIndex(null);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setOverIndex(i);
          }}
          onDrop={(e) => {
            e.preventDefault();
            if (dragIndex !== null) move(dragIndex, i);
            setDragIndex(null);
            setOverIndex(null);
          }}
          className={`flex items-center gap-2 rounded-xl border bg-background p-2 transition-all ${
            overIndex === i && dragIndex !== null && dragIndex !== i
              ? "border-primary ring-2 ring-primary/25"
              : "border-border"
          } ${dragIndex === i ? "opacity-50" : ""}`}
        >
          <span className="cursor-grab text-muted-foreground active:cursor-grabbing">
            <GripVertical className="size-4" />
          </span>
          <input
            value={line}
            onChange={(e) => {
              const next = [...lines];
              next[i] = e.target.value;
              commit(next);
            }}
            className="w-full bg-transparent text-xs outline-none"
          />
          <button
            type="button"
            aria-label="Remove item"
            onClick={() => commit(lines.filter((_, x) => x !== i))}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => commit([...lines, "New item"])}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border py-2 text-[11px] font-semibold text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
      >
        <Plus className="size-3.5" /> Add item
      </button>
      <p className="text-[11px] text-muted-foreground">
        Drag the handle to reorder. Separate columns with |
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Studio                                                              */
/* ------------------------------------------------------------------ */

export function AdminPageStudio({ page, onDone }: { page: PageDef; onDone: () => void }) {
  const qc = useQueryClient();
  const { data: map, isLoading } = usePageContentMap();

  const fields: PageField[] = useMemo(() => page.sections.flatMap((s) => s.fields), [page]);

  const [draft, setDraft] = useState<Record<string, string> | null>(null);
  const [activeSection, setActiveSection] = useState(0);
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [frameKey, setFrameKey] = useState(0);
  const [sectionDrag, setSectionDrag] = useState<number | null>(null);
  const [sectionOver, setSectionOver] = useState<number | null>(null);
  const [order, setOrder] = useState<number[]>(() => page.sections.map((_, i) => i));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onDone();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onDone]);

  const values =
    draft ??
    Object.fromEntries(fields.map((f) => [f.key, map?.[pageContentKey(page.path, f.key)] ?? ""]));

  const set = (key: string, value: string) => setDraft({ ...values, [key]: value });

  const save = useMutation({
    mutationFn: async () => {
      const rows = fields.map((f) => ({
        key: pageContentKey(page.path, f.key),
        value: values[f.key] ?? "",
        label: `${page.title} — ${f.label}`,
      }));
      const { error } = await supabase.from("site_settings").upsert(rows, { onConflict: "key" });
      if (error) throw error;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["page-content"] });
      await qc.invalidateQueries({ queryKey: ["admin", "settings"] });
      setFrameKey((k) => k + 1);
    },
  });

  const section = page.sections[order[activeSection] ?? 0];

  const moveSection = (from: number, to: number) => {
    if (from === to) return;
    const next = [...order];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item!);
    setOrder(next);
    setActiveSection(to);
  };

  return (
    <div className="fixed inset-0 z-[120] flex flex-col bg-background">
      {/* top bar */}
      <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3">
        <div className="min-w-0">
          <p className="label-xs text-primary">Page studio</p>
          <h2 className="display truncate text-xl text-foreground">
            {page.title} <span className="font-mono text-xs text-muted-foreground">{page.path}</span>
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFrameKey((k) => k + 1)}
            aria-label="Refresh preview"
            className="rounded-xl border border-border p-2 text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
          >
            <RefreshCw className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => save.mutate()}
            disabled={save.isPending}
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground disabled:opacity-60"
          >
            {save.isPending ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
            Save
          </button>
          <button
            type="button"
            onClick={onDone}
            aria-label="Close page studio"
            className="rounded-xl border border-border p-2 text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        {/* sidebar */}
        <aside className="flex min-h-0 w-full shrink-0 flex-col border-b border-border lg:w-[380px] lg:border-b-0 lg:border-r">
          <div className="border-b border-border/60 px-4 py-3">
            <p className="label-xs text-muted-foreground">Sections — drag to reorder</p>
            <div className="mt-2 space-y-1.5">
              {order.map((sectionIndex, i) => {
                const s = page.sections[sectionIndex]!;
                return (
                  <div
                    key={s.name}
                    draggable
                    onDragStart={() => setSectionDrag(i)}
                    onDragEnd={() => {
                      setSectionDrag(null);
                      setSectionOver(null);
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setSectionOver(i);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (sectionDrag !== null) moveSection(sectionDrag, i);
                      setSectionDrag(null);
                      setSectionOver(null);
                    }}
                    onClick={() => setActiveSection(i)}
                    className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${
                      i === activeSection
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border text-muted-foreground hover:border-primary/60"
                    } ${sectionOver === i && sectionDrag !== null && sectionDrag !== i ? "ring-2 ring-primary/30" : ""} ${
                      sectionDrag === i ? "opacity-50" : ""
                    }`}
                  >
                    <GripVertical className="size-4 cursor-grab text-muted-foreground active:cursor-grabbing" />
                    {s.name}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4">
            {isLoading ? (
              <div className="flex items-center gap-3 py-10 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" /> Loading page content…
              </div>
            ) : (
              section?.fields.map((f) => (
                <div key={f.key}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <label className="text-xs font-semibold text-muted-foreground">{f.label}</label>
                    {values[f.key] ? (
                      <button
                        type="button"
                        onClick={() => set(f.key, "")}
                        className="flex items-center gap-1.5 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <RotateCcw className="size-3" /> Reset
                      </button>
                    ) : null}
                  </div>

                  {f.type === "image" ? (
                    <ImageField value={values[f.key] ?? ""} onChange={(v) => set(f.key, v)} />
                  ) : f.type === "list" ? (
                    <ListField
                      value={values[f.key] ?? ""}
                      fallback={f.fallback ?? ""}
                      onChange={(v) => set(f.key, v)}
                    />
                  ) : f.type === "textarea" ? (
                    <textarea
                      rows={3}
                      value={values[f.key] ?? ""}
                      placeholder={f.fallback}
                      onChange={(e) => set(f.key, e.target.value)}
                      className={inputClass}
                    />
                  ) : (
                    <input
                      value={values[f.key] ?? ""}
                      placeholder={f.fallback}
                      onChange={(e) => set(f.key, e.target.value)}
                      className={inputClass}
                    />
                  )}
                  {f.hint && f.type !== "list" && (
                    <p className="mt-1.5 text-[11px] text-muted-foreground">{f.hint}</p>
                  )}
                </div>
              ))
            )}

            {save.isError && (
              <p className="text-xs text-destructive">
                Could not save: {(save.error as Error)?.message ?? "unknown error"}
              </p>
            )}
            <p className="text-[11px] text-muted-foreground">
              Leave a field empty to keep the website default. Save to update the live preview and the
              website.
            </p>
          </div>
        </aside>

        {/* live preview */}
        <div className="min-h-0 flex-1 overflow-auto bg-muted/30 p-4">
          <div
            className={`mx-auto h-full overflow-hidden rounded-2xl border border-border bg-background shadow-xl transition-all ${
              device === "mobile" ? "w-[390px] max-w-full" : "w-full"
            }`}
          >
            <iframe
              key={frameKey}
              title={`${page.title} live preview`}
              src={page.path}
              className="h-full min-h-[70vh] w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
