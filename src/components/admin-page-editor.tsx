import { useMemo, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Upload, RotateCcw, Check } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { uploadCategoryImage } from "@/lib/product-categories";
import { pageContentKey, usePageContentMap, type PageDef, type PageField } from "@/lib/page-content";

const inputClass =
  "w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary";

function ImageField({
  value,
  fallbackHint,
  onChange,
}: {
  value: string;
  fallbackHint?: string;
  onChange: (v: string) => void;
}) {
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
      <div className="flex gap-3">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={fallbackHint || "https://… image URL"}
          className={inputClass}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex shrink-0 items-center gap-2 rounded-xl border border-border px-3 py-2.5 text-xs font-semibold transition-colors hover:border-primary disabled:opacity-60"
        >
          {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
          Upload
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
          className="h-36 w-full rounded-xl border border-border object-cover"
        />
      ) : (
        <p className="text-xs text-muted-foreground">Using the default photo from the website.</p>
      )}
    </div>
  );
}

export function AdminPageEditor({ page, onDone }: { page: PageDef; onDone: () => void }) {
  const qc = useQueryClient();
  const { data: map, isLoading } = usePageContentMap();

  const fields: PageField[] = useMemo(
    () => page.sections.flatMap((s) => s.fields),
    [page],
  );

  const [draft, setDraft] = useState<Record<string, string> | null>(null);
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
      onDone();
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 py-10 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" /> Loading page content…
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {page.sections.map((section) => (
        <div key={section.name} className="space-y-4">
          <p className="label-xs text-primary">{section.name}</p>
          {section.fields.map((f) => (
            <div key={f.key}>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label className="text-xs font-semibold text-muted-foreground">{f.label}</label>
                {values[f.key] ? (
                  <button
                    type="button"
                    onClick={() => set(f.key, "")}
                    className="flex items-center gap-1.5 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <RotateCcw className="size-3" /> Reset to default
                  </button>
                ) : null}
              </div>

              {f.type === "image" ? (
                <ImageField value={values[f.key] ?? ""} onChange={(v) => set(f.key, v)} />
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
              {f.hint && <p className="mt-1.5 text-[11px] text-muted-foreground">{f.hint}</p>}
            </div>
          ))}
        </div>
      ))}

      {save.isError && (
        <p className="text-xs text-destructive">
          Could not save: {(save.error as Error)?.message ?? "unknown error"}
        </p>
      )}

      <div className="flex items-center justify-end gap-3 border-t border-border/60 pt-5">
        <button
          type="button"
          onClick={onDone}
          className="rounded-xl border border-border px-4 py-2.5 text-xs font-semibold transition-colors hover:border-primary"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => save.mutate()}
          disabled={save.isPending}
          className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground disabled:opacity-60"
        >
          {save.isPending ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
          Save changes
        </button>
      </div>
    </div>
  );
}
