CREATE TABLE public.popup_emails (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  page text,
  created_at timestamptz not null default now()
);
GRANT INSERT ON public.popup_emails TO anon, authenticated;
GRANT SELECT, DELETE ON public.popup_emails TO authenticated;
GRANT ALL ON public.popup_emails TO service_role;
ALTER TABLE public.popup_emails ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit popup email" ON public.popup_emails FOR INSERT TO anon, authenticated WITH CHECK (char_length(email) between 3 and 255);
CREATE POLICY "Admins can view popup emails" ON public.popup_emails FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete popup emails" ON public.popup_emails FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));