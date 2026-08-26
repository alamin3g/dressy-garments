import { useRef, useState } from "react";
import { Loader2, Plus, Trash2, X } from "lucide-react";
import { uploadProductImage, parseColor } from "@/lib/product-media";

const inputClass =
  "w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary";

export type AdminProduct = {
  id: string;
  name: string;
  category: string;
  moq: string;
  status: string;
  description: string;
  images?: string[] | null;
  colors?: string[] | null;
};

export function AdminProductEditor({
  product,
  categories,
  statuses,
  onSave,
  onDelete,
}: {
  product: AdminProduct;
  categories: string[];
  statuses: string[];
  onSave: (patch: Record<string, unknown>) => void;
  onDelete: () => void;
}) {
  const images = product.images ?? [];
  const colors = product.colors ?? [];
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [urlDraft, setUrlDraft] = useState("");
  const [colorDraft, setColorDraft] = useState("");
  const [swatch, setSwatch] = useState("#c8a24a");

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setBusy(true);
    setError(null);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) uploaded.push(await uploadProductImage(file));
      onSave({ images: [...images, ...uploaded] });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const addUrl = () => {
    const url = urlDraft.trim();
    if (!url) return;
    onSave({ images: [...images, url] });
    setUrlDraft("");
  };

  const HEX_RE = /#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/;

  const handleColorDraft = (value: string) => {
    setColorDraft(value);
    const match = value.match(HEX_RE);
    if (match) setSwatch(match[0]);
  };

  const addColor = () => {
    const label = colorDraft.trim();
    if (!label) return;
    const match = label.match(HEX_RE);
    const name = match ? label.replace(match[0], "").trim() : label;
    const value = match
      ? name
        ? `${name} ${match[0]}`
        : match[0]
      : `${name} ${swatch}`;
    if (colors.includes(value)) return;
    onSave({ colors: [...colors, value] });
    setColorDraft("");
  };

  return (
    <div className="rounded-xl border border-border p-4">
      <div className="grid gap-3 sm:grid-cols-[2fr_1fr_1fr_auto] sm:items-center">
        <input
          defaultValue={product.name}
          placeholder="Title"
          onBlur={(e) => e.target.value !== product.name && onSave({ name: e.target.value })}
          className={inputClass}
        />
        <select
          defaultValue={product.category}
          onChange={(e) => onSave({ category: e.target.value })}
          className={inputClass}
        >
          {(categories.includes(product.category)
            ? categories
            : [product.category, ...categories]
          ).map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select
          defaultValue={product.status}
          onChange={(e) => onSave({ status: e.target.value })}
          className={inputClass}
        >
          {statuses.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <button
          type="button"
          onClick={onDelete}
          aria-label={`Delete ${product.name}`}
          className="justify-self-start rounded-xl border border-border p-2.5 text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
        >
          <Trash2 className="size-4" />
        </button>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_2fr]">
        <input
          defaultValue={product.moq}
          placeholder="MOQ / 1,500 pcs / colour"
          onBlur={(e) => e.target.value !== product.moq && onSave({ moq: e.target.value })}
          className={inputClass}
        />
        <input
          defaultValue={product.description}
          placeholder="Description"
          onBlur={(e) =>
            e.target.value !== product.description && onSave({ description: e.target.value })
          }
          className={inputClass}
        />
      </div>

      {/* images */}
      <div className="mt-4 border-t border-border/60 pt-4">
        <p className="label-xs mb-3 text-muted-foreground">Product images</p>
        {images.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-3">
            {images.map((src, i) => (
              <div key={`${src}-${i}`} className="relative size-20 overflow-hidden rounded-lg border border-border">
                <img src={src} alt="" className="size-full object-cover" />
                <button
                  type="button"
                  aria-label="Remove image"
                  onClick={() => onSave({ images: images.filter((_, idx) => idx !== i) })}
                  className="absolute right-1 top-1 rounded-full bg-background/90 p-1 text-muted-foreground hover:text-destructive"
                >
                  <X className="size-3" />
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="flex flex-wrap items-center gap-3">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFiles(e.target.files)}
            className="text-xs text-muted-foreground file:mr-3 file:rounded-lg file:border file:border-border file:bg-background file:px-3 file:py-2 file:text-xs"
          />
          {busy && <Loader2 className="size-4 animate-spin text-primary" />}
          <div className="flex flex-1 items-center gap-2">
            <input
              value={urlDraft}
              onChange={(e) => setUrlDraft(e.target.value)}
              placeholder="or paste image URL"
              className={inputClass}
            />
            <button
              type="button"
              onClick={addUrl}
              className="label-xs inline-flex items-center gap-1 rounded-xl border border-border px-3 py-2.5"
            >
              <Plus className="size-3.5" /> Add
            </button>
          </div>
        </div>
        {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
      </div>

      {/* colours */}
      <div className="mt-4 border-t border-border/60 pt-4">
        <p className="label-xs mb-3 text-muted-foreground">Colours</p>
        {colors.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {colors.map((c, i) => {
              const { name, hex } = parseColor(c);
              return (
                <span
                  key={`${c}-${i}`}
                  className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs"
                >
                  <span
                    className="size-4 rounded-full border border-border"
                    style={{ backgroundColor: hex }}
                  />
                  {name}
                  <button
                    type="button"
                    aria-label={`Remove ${name}`}
                    onClick={() => onSave({ colors: colors.filter((_, idx) => idx !== i) })}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="size-3" />
                  </button>
                </span>
              );
            })}
          </div>
        )}
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="color"
            value={swatch}
            onChange={(e) => setSwatch(e.target.value)}
            aria-label="Colour swatch"
            className="size-10 cursor-pointer rounded-lg border border-border bg-background"
          />
          <input
            value={colorDraft}
            onChange={(e) => setColorDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addColor()}
            placeholder="Colour name (e.g. Ecru)"
            className={`${inputClass} max-w-xs`}
          />
          <button
            type="button"
            onClick={addColor}
            className="label-xs inline-flex items-center gap-1 rounded-xl border border-border px-3 py-2.5"
          >
            <Plus className="size-3.5" /> Add colour
          </button>
        </div>
      </div>
    </div>
  );
}
