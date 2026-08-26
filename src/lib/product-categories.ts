import { supabase } from "@/integrations/supabase/client";

export type ProductCategory = {
  id: string;
  name: string;
  image_url: string;
  storage_path: string | null;
  sort_order: number;
};

export const CATEGORY_BUCKET = "category-images";

/** Ten years, so stored links keep working for public visitors. */
const SIGNED_URL_TTL = 60 * 60 * 24 * 365 * 10;

export async function fetchProductCategories(): Promise<ProductCategory[]> {
  const { data, error } = await supabase
    .from("product_categories")
    .select("id,name,image_url,storage_path,sort_order")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as ProductCategory[];
}

export async function uploadCategoryImage(file: File): Promise<{ url: string; path: string }> {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(CATEGORY_BUCKET).upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw error;

  const { data, error: signError } = await supabase.storage
    .from(CATEGORY_BUCKET)
    .createSignedUrl(path, SIGNED_URL_TTL);
  if (signError) throw signError;

  return { url: data.signedUrl, path };
}
