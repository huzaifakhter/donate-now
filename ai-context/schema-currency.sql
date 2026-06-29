-- Add currency column to campaigns table
ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS currency text NOT NULL DEFAULT 'USD';

-- Add currency column to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS currency text NOT NULL DEFAULT 'USD';

-- Update fundraiser-documents bucket to be public so public URLs resolve correctly
UPDATE storage.buckets SET public = true WHERE id = 'fundraiser-documents';
insert into storage.buckets (id, name, public) values ('fundraiser-documents', 'fundraiser-documents', true) on conflict (id) do update set public = true;
