CREATE TABLE public.product_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  image_url TEXT NOT NULL DEFAULT '',
  storage_path TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT ON public.product_categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_categories TO authenticated;
GRANT ALL ON public.product_categories TO service_role;

ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view product categories"
ON public.product_categories FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admins can manage product categories"
ON public.product_categories FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.product_categories (name, image_url, sort_order) VALUES
  ('Knit', '', 1),
  ('Woven', '', 2),
  ('Outerwear', '', 3),
  ('Fleece', '', 4),
  ('Workwear', '', 5),
  ('Development', '', 6);

CREATE POLICY "Anyone can view category images"
ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'category-images');

CREATE POLICY "Admins can upload category images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'category-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update category images"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'category-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete category images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'category-images' AND public.has_role(auth.uid(), 'admin'));