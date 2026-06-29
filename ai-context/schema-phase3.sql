-- DonateNow Phase 3 Database Schema Migrations
-- Run this script in the Supabase SQL Editor to support fundraiser onboarding and review.

-- 1. Create Fundraiser Profiles Table
create table if not exists public.fundraiser_profiles (
    id uuid primary key references public.profiles(id) on delete cascade,
    org_name text,
    org_type text,
    reg_number text,
    year_established integer,
    website text,
    
    contact_person text,
    phone text,
    country text,
    state text,
    city text,
    address text,
    
    verification_status text not null default 'pending' 
        check (verification_status in ('pending', 'under_review', 'approved', 'rejected', 'blocked_temp', 'blocked_perm')),
    rejection_reason text,
    onboarding_step integer default 1 not null check (onboarding_step >= 1 and onboarding_step <= 5),
    is_submitted boolean default false not null,
    
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.fundraiser_profiles enable row level security;

-- Trigger set_updated_at for fundraiser_profiles
create or replace trigger set_fundraiser_profiles_updated_at
    before update on public.fundraiser_profiles
    for each row execute procedure public.set_updated_at();

-- 2. Create Bank Details Table
create table if not exists public.bank_details (
    fundraiser_id uuid primary key references public.profiles(id) on delete cascade,
    account_holder_name text not null,
    bank_name text not null,
    account_number text not null,
    ifsc_swift text not null,
    branch text not null,
    cheque_file_url text, -- Store URL of uploaded cancelled cheque
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.bank_details enable row level security;

-- Trigger set_updated_at for bank_details
create or replace trigger set_bank_details_updated_at
    before update on public.bank_details
    for each row execute procedure public.set_updated_at();

-- 3. Create Uploaded Documents Table
create table if not exists public.uploaded_documents (
    id uuid primary key default gen_random_uuid(),
    fundraiser_id uuid references public.profiles(id) on delete cascade not null,
    doc_type text not null check (doc_type in ('reg_certificate', 'ngo_certificate', 'tax_reg', 'id_proof', 'address_proof', 'bank_proof')),
    file_url text not null,
    file_name text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.uploaded_documents enable row level security;

-- 4. Create Block History Table
create table if not exists public.block_history (
    id uuid primary key default gen_random_uuid(),
    fundraiser_id uuid references public.profiles(id) on delete cascade not null,
    blocked_by uuid references public.profiles(id) on delete set null,
    block_type text not null check (block_type in ('temporary', 'permanent')),
    reason text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unblocked_at timestamp with time zone,
    unblocked_by uuid references public.profiles(id) on delete set null
);

-- Enable RLS
alter table public.block_history enable row level security;

-- 5. Row Level Security Policies
-- Fundraiser Profiles Policies
create policy "Fundraiser profiles readable by admins or owner"
    on public.fundraiser_profiles for select
    to authenticated
    using (public.get_user_role() = 'admin' or auth.uid() = id);

create policy "Fundraiser profiles updateable by admin or owner before submit"
    on public.fundraiser_profiles for update
    to authenticated
    using (public.get_user_role() = 'admin' or (auth.uid() = id and is_submitted = false))
    with check (public.get_user_role() = 'admin' or auth.uid() = id);

create policy "Fundraiser profiles insertable by owner"
    on public.fundraiser_profiles for insert
    to authenticated
    with check (auth.uid() = id);

-- Bank Details Policies
create policy "Bank details readable by admins or owner"
    on public.bank_details for select
    to authenticated
    using (public.get_user_role() = 'admin' or auth.uid() = fundraiser_id);

create policy "Bank details writeable by owner before submit"
    on public.bank_details for all
    to authenticated
    using (auth.uid() = fundraiser_id)
    with check (auth.uid() = fundraiser_id);

-- Uploaded Documents Policies
create policy "Documents readable by admins or owner"
    on public.uploaded_documents for select
    to authenticated
    using (public.get_user_role() = 'admin' or auth.uid() = fundraiser_id);

create policy "Documents writeable by owner"
    on public.uploaded_documents for all
    to authenticated
    using (auth.uid() = fundraiser_id)
    with check (auth.uid() = fundraiser_id);

-- Block History Policies
create policy "Block history readable by admins or owner"
    on public.block_history for select
    to authenticated
    using (public.get_user_role() = 'admin' or auth.uid() = fundraiser_id);

create policy "Block history manageable by admins only"
    on public.block_history for all
    to authenticated
    using (public.get_user_role() = 'admin')
    with check (public.get_user_role() = 'admin');

-- ========================================================
-- 6. Supabase Storage Bucket & RLS Policies Setup
-- ========================================================

-- Create the private bucket for fundraiser documents
insert into storage.buckets (id, name, public)
values ('fundraiser-documents', 'fundraiser-documents', true)
on conflict (id) do update set public = true;

-- RLS Policies on storage.objects for fundraiser-documents

create policy "Allow fundraisers to upload documents to their own folder"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'fundraiser-documents' 
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Allow fundraisers to view their own documents"
on storage.objects for select
to authenticated
using (
  bucket_id = 'fundraiser-documents' 
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Allow fundraisers to delete their own documents"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'fundraiser-documents' 
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Allow admins to view all documents"
on storage.objects for select
to authenticated
using (
  bucket_id = 'fundraiser-documents' 
  and (select role from public.profiles where id = auth.uid()) = 'admin'
);
