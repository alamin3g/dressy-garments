ALTER TABLE public.popup_emails ADD COLUMN IF NOT EXISTS ip text NOT NULL DEFAULT '';
CREATE INDEX IF NOT EXISTS popup_emails_ip_idx ON public.popup_emails (ip);