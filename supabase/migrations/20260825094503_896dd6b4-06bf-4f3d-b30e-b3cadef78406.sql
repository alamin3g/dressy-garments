DROP POLICY IF EXISTS "Allow all to inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Allow authenticated users to see inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Allow authenticated users to delete inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Allow all to visitors" ON public.visitors;
DROP POLICY IF EXISTS "Allow all to products" ON public.products;
DROP POLICY IF EXISTS "Allow all to site_settings" ON public.site_settings;