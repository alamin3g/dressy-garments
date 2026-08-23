CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can read their own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Products -------------------------------------------------------------
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL DEFAULT 'Knitwear',
  moq text NOT NULL DEFAULT '500 pcs',
  status text NOT NULL DEFAULT 'Draft',
  description text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Live products are public"
ON public.products FOR SELECT TO anon, authenticated
USING (status = 'Live' OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage products"
ON public.products FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER products_updated_at BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Inquiries ------------------------------------------------------------
CREATE TABLE public.inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  company text NOT NULL DEFAULT '',
  email text NOT NULL,
  product text NOT NULL DEFAULT '',
  quantity text NOT NULL DEFAULT '',
  message text NOT NULL,
  status text NOT NULL DEFAULT 'New',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.inquiries TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.inquiries TO authenticated;
GRANT ALL ON public.inquiries TO service_role;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit an inquiry"
ON public.inquiries FOR INSERT TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Admins read inquiries"
ON public.inquiries FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update inquiries"
ON public.inquiries FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete inquiries"
ON public.inquiries FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER inquiries_updated_at BEFORE UPDATE ON public.inquiries
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Visitors -------------------------------------------------------------
CREATE TABLE public.visitors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip text NOT NULL DEFAULT '',
  city text NOT NULL DEFAULT 'Unknown',
  region text NOT NULL DEFAULT '',
  country text NOT NULL DEFAULT 'Unknown',
  country_code text NOT NULL DEFAULT '',
  path text NOT NULL DEFAULT '/',
  referrer text NOT NULL DEFAULT '',
  user_agent text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.visitors TO authenticated;
GRANT ALL ON public.visitors TO service_role;
ALTER TABLE public.visitors ENABLE ROW LEVEL SECURITY;
CREATE INDEX visitors_created_at_idx ON public.visitors (created_at DESC);

CREATE POLICY "Admins read visitors"
ON public.visitors FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Site settings --------------------------------------------------------
CREATE TABLE public.site_settings (
  key text PRIMARY KEY,
  value text NOT NULL DEFAULT '',
  label text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Settings are public"
ON public.site_settings FOR SELECT TO anon, authenticated
USING (true);

CREATE POLICY "Admins manage settings"
ON public.site_settings FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.site_settings (key, value, label) VALUES
  ('company_name', 'Dressy Clothing Ltd.', 'Company name'),
  ('contact_email', 'hello@dressy.com', 'Contact email'),
  ('contact_phone', '+880 1700 000000', 'Contact phone'),
  ('head_office', 'Dhaka, Bangladesh', 'Head office'),
  ('monthly_capacity', '5,000,000 pcs', 'Monthly capacity');

INSERT INTO public.products (name, category, moq, status, description, sort_order) VALUES
  ('Heavyweight Hoodie', 'Knitwear', '500 pcs', 'Live', '400 GSM brushed fleece, twin-needle construction.', 1),
  ('Oxford Shirt', 'Woven', '800 pcs', 'Live', 'Yarn-dyed oxford with two-ply collar.', 2),
  ('Cargo Workwear Pant', 'Workwear', '1,000 pcs', 'Draft', 'Ripstop twill with bartacked stress points.', 3),
  ('Organic Cotton Tee', 'Knitwear', '300 pcs', 'Live', 'GOTS certified single jersey, 180 GSM.', 4),
  ('Performance Jacket', 'Outerwear', '600 pcs', 'Review', 'Recycled shell with taped seams.', 5);