import { memo, useCallback, useMemo, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, Loader2, RotateCcw, X } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { uploadCategoryImage } from "@/lib/product-categories";
import { pageContentKey, usePageContentMap, type PageDef, type PageField } from "@/lib/page-content";

const inputClass =
  "w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary";

function ImageField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File) {
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
        <label className="flex shrink-0 cursor-pointer items-center gap-2 rounded-xl border border-border px-3 py-2.5 text-xs font-semibold transition-colors hover:border-primary disabled:opacity-60">
          {uploading ? <Loader2 className="size-4 animate-spin" /> : <span className="text-muted-foreground">Upload</span>}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void handleFile(f);
              e.target.value = "";
            }}
          />
        </label>
      </div>
      {value ? (
        <img src={value} alt="Section preview" className="h-28 w-full rounded-xl border border-border object-cover" />
      ) : (
        <p className="text-[11px] text-muted-foreground">Using the default photo from the website.</p>
      )}
    </div>
  );
}

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
  const commit = (next: string[]) => onChange(next.join("\n"));

  return (
    <div className="space-y-2">
      {lines.map((line, i) => (
        <div key={i} className="flex items-center gap-2 rounded-xl border border-border bg-background p-2">
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
            <X className="size-3.5" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => commit([...lines, "New item"])}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border py-2 text-[11px] font-semibold text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
      >
        + Add item
      </button>
      <p className="text-[11px] text-muted-foreground">One item per line. Separate columns with |</p>
    </div>
  );
}

const FieldEditor = memo(function FieldEditor({
  field,
  value,
  onChange,
}: {
  field: PageField;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <label className="text-xs font-semibold text-muted-foreground">{field.label}</label>
        {value ? (
          <button
            type="button"
            onClick={() => onChange("")}
            className="flex items-center gap-1.5 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
          >
            <RotateCcw className="size-3" /> Reset
          </button>
        ) : null}
      </div>

      {field.type === "image" ? (
        <ImageField value={value ?? ""} onChange={onChange} />
      ) : field.type === "list" ? (
        <ListField value={value ?? ""} fallback={field.fallback ?? ""} onChange={onChange} />
      ) : field.type === "textarea" ? (
        <textarea
          rows={3}
          value={value ?? ""}
          placeholder={field.fallback}
          onChange={(e) => onChange(e.target.value)}
          className={inputClass}
        />
      ) : (
        <input
          value={value ?? ""}
          placeholder={field.fallback}
          onChange={(e) => onChange(e.target.value)}
          className={inputClass}
        />
      )}
      {field.hint && field.type !== "list" && <p className="mt-1.5 text-[11px] text-muted-foreground">{field.hint}</p>}
    </div>
  );
});

export function AdminSimplePageEditor({ page, onDone }: { page: PageDef; onDone: () => void }) {
  const qc = useQueryClient();
  const { data: map, isLoading } = usePageContentMap();

  const sections = useMemo(() => {
    if (page.path === "/") {
      return page.sections.filter((s) => s.name === "Hero");
    }
    return page.sections;
  }, [page]);

  const fields = useMemo(() => sections.flatMap((s) => s.fields), [sections]);

  const [draft, setDraft] = useState<Record<string, string> | null>(null);

  const values =
    draft ??
    Object.fromEntries(fields.map((f) => [f.key, map?.[pageContentKey(page.path, f.key)] ?? ""]));

  const baseRef = useRef(values);
  baseRef.current = values;

  const handlersRef = useRef(new Map<string, (v: string) => void>());
  const set = useCallback((key: string) => {
    const cached = handlersRef.current.get(key);
    if (cached) return cached;
    const fn = (value: string) =>
      setDraft((prev) => ({ ...(prev ?? baseRef.current), [key]: value }));
    handlersRef.current.set(key, fn);
    return fn;
  }, []);

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
      setDraft(null);
    },
  });

  return (
    <div className="rounded-2xl border border-border bg-card/30 p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="label-xs text-primary">Editing {page.title}</p>
          <p className="text-xs text-muted-foreground">{page.path}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => save.mutate()}
            disabled={save.isPending || !draft}
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground disabled:opacity-60"
          >
            {save.isPending ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
            Save
          </button>
          <button
            type="button"
            onClick={onDone}
            className="rounded-xl border border-border px-3 py-2.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Close
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-3 py-10 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Loading page content…
        </div>
      ) : (
        <div className="space-y-6">
          {sections.map((section) => (
            <div key={section.name} className="space-y-4 rounded-xl border border-border p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-primary">{section.name}</p>
              <div className="grid gap-4 sm:grid-cols-2">
                {section.fields.map((f) => (
                  <div key={f.key} className={f.type === "textarea" || f.type === "list" ? "sm:col-span-2" : ""}>
                    <FieldEditor field={f} value={values[f.key] ?? ""} onChange={set(f.key)} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {save.isError && <p className="mt-4 text-xs text-destructive">Could not save: {(save.error as Error)?.message ?? "unknown error"}</p>}
      <p className="mt-4 text-[11px] text-muted-foreground">Leave a field empty to keep the website default. Save to update the live website.</p>
    </div>
  );
}
