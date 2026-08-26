import { supabase } from "@/integrations/supabase/client";

export const PRODUCT_BUCKET = "product-images";

/** Ten years, so stored links keep working for public visitors. */
const SIGNED_URL_TTL = 60 * 60 * 24 * 365 * 10;

export async function uploadProductImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(PRODUCT_BUCKET).upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw error;

  const { data, error: signError } = await supabase.storage
    .from(PRODUCT_BUCKET)
    .createSignedUrl(path, SIGNED_URL_TTL);
  if (signError) throw signError;

  return data.signedUrl;
}

/** "Ecru #efe6d4" / "#ff0000" / "navy" -> { name, hex } */
export function parseColor(value: string): { name: string; hex: string } {
  const hexMatch = value.match(/#([0-9a-f]{3}|[0-9a-f]{6})\b/i);
  const hex = hexMatch ? hexMatch[0] : value.trim();
  const name = value.replace(/#([0-9a-f]{3}|[0-9a-f]{6})\b/i, "").trim() || hex;
  return { name, hex };
}
