-- DonateNow Phase 2 Database Schema
-- Run this script in the Supabase SQL Editor

-- --------------------------------------------------------
-- 1. Create Roles Table
-- --------------------------------------------------------
create table if not exists public.roles (
    id text primary key,
    name text not null unique
);

-- Enable RLS
alter table public.roles enable row level security;

-- Insert initial roles
insert into public.roles (id, name) values 
('admin', 'Administrator'),
('fundraiser', 'Fundraiser')
on conflict (id) do nothing;

-- --------------------------------------------------------
-- 2. Create Profiles Table
-- --------------------------------------------------------
create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    email text not null unique,
    full_name text,
    role text not null references public.roles(id) default 'fundraiser',
    currency text default 'USD' not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- --------------------------------------------------------
-- 3. Create Categories Table
-- --------------------------------------------------------
create table if not exists public.categories (
    id uuid primary key default gen_random_uuid(),
    name text not null unique,
    slug text not null unique,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.categories enable row level security;

-- Insert initial categories
insert into public.categories (name, slug) values
('Education', 'education'),
('Medical', 'medical'),
('Emergency', 'emergency'),
('Disaster Relief', 'disaster-relief'),
('Environment', 'environment')
on conflict (name) do nothing;

-- --------------------------------------------------------
-- 4. Create Campaigns Table
-- --------------------------------------------------------
create table if not exists public.campaigns (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    description text not null,
    target_amount numeric(12, 2) not null check (target_amount > 0),
    raised_amount numeric(12, 2) default 0.00 not null check (raised_amount >= 0),
    category_id uuid references public.categories(id) on delete set null,
    fundraiser_id uuid references public.profiles(id) on delete cascade not null,
    status text default 'draft' not null check (status in ('draft', 'active', 'completed', 'paused')),
    currency text default 'USD' not null,
    image_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    deleted_at timestamp with time zone
);

-- Enable RLS
alter table public.campaigns enable row level security;

-- Index for filtering active campaigns
create index if not exists campaigns_status_deleted_idx on public.campaigns (status, deleted_at);

-- --------------------------------------------------------
-- 5. Create Donations Table
-- --------------------------------------------------------
create table if not exists public.donations (
    id uuid primary key default gen_random_uuid(),
    campaign_id uuid references public.campaigns(id) on delete cascade not null,
    amount numeric(12, 2) not null check (amount > 0),
    donor_name text not null,
    donor_email text not null,
    status text default 'pending' not null check (status in ('pending', 'completed', 'failed')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.donations enable row level security;

-- --------------------------------------------------------
-- 6. Trigger Functions for Automatic Updated At
-- --------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger set_profiles_updated_at
    before update on public.profiles
    for each row execute procedure public.set_updated_at();

create trigger set_campaigns_updated_at
    before update on public.campaigns
    for each row execute procedure public.set_updated_at();

-- --------------------------------------------------------
-- 7. Trigger Function for Auth User -> Profile Sync
-- --------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger as $$
declare
    user_role text;
begin
    user_role := coalesce(new.raw_user_meta_data->>'role', 'fundraiser');
    
    insert into public.profiles (id, email, full_name, role)
    values (
        new.id,
        new.email,
        coalesce(new.raw_user_meta_data->>'full_name', ''),
        user_role
    )
    on conflict (id) do update
    set email = excluded.email,
        full_name = coalesce(excluded.full_name, profiles.full_name),
        role = coalesce(excluded.role, profiles.role);
        
    return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();

-- --------------------------------------------------------
-- 8. Row Level Security Policies
-- --------------------------------------------------------

-- Helper functions to check user roles
create or replace function public.get_user_role()
returns text as $$
declare
    user_role text;
begin
    select role into user_role from public.profiles where id = auth.uid();
    return user_role;
end;
$$ language plpgsql security definer;

-- Roles Policies
create policy "Roles are readable by authenticated users"
    on public.roles for select
    to authenticated
    using (true);

-- Profiles Policies
create policy "Profiles are viewable by admins or self"
    on public.profiles for select
    to authenticated
    using (public.get_user_role() = 'admin' or auth.uid() = id);

create policy "Profiles can be updated by admins or self"
    on public.profiles for update
    to authenticated
    using (public.get_user_role() = 'admin' or auth.uid() = id);

create policy "Profiles can be created by admins"
    on public.profiles for insert
    to authenticated
    with check (public.get_user_role() = 'admin');

create policy "Profiles can be deleted by admins"
    on public.profiles for delete
    to authenticated
    using (public.get_user_role() = 'admin');

-- Categories Policies
create policy "Categories are viewable by anyone"
    on public.categories for select
    using (true);

create policy "Categories can be managed by admins"
    on public.categories for all
    to authenticated
    using (public.get_user_role() = 'admin')
    with check (public.get_user_role() = 'admin');

-- Campaigns Policies
create policy "Active campaigns are viewable by anyone"
    on public.campaigns for select
    using (status = 'active' and deleted_at is null);

create policy "Campaigns are fully readable by admins or fundraiser owner"
    on public.campaigns for select
    to authenticated
    using (public.get_user_role() = 'admin' or fundraiser_id = auth.uid());

create policy "Campaigns can be inserted by fundraisers or admins"
    on public.campaigns for insert
    to authenticated
    with check (
        public.get_user_role() = 'admin' 
        or (public.get_user_role() = 'fundraiser' and fundraiser_id = auth.uid())
    );

create policy "Campaigns can be updated by admins or fundraiser owner"
    on public.campaigns for update
    to authenticated
    using (public.get_user_role() = 'admin' or fundraiser_id = auth.uid())
    with check (public.get_user_role() = 'admin' or fundraiser_id = auth.uid());

create policy "Campaigns can be soft deleted by admins or fundraiser owner"
    on public.campaigns for delete
    to authenticated
    using (public.get_user_role() = 'admin' or fundraiser_id = auth.uid());

-- Donations Policies
create policy "Donations can be inserted by anyone (donors)"
    on public.donations for insert
    with check (true);

create policy "Donations are viewable by admins or fundraiser owner"
    on public.donations for select
    to authenticated
    using (
        public.get_user_role() = 'admin' 
        or campaign_id in (select id from public.campaigns where fundraiser_id = auth.uid())
    );

-- ========================================================
-- 9. Phase 3 - Fundraiser Profiles & Onboarding Tables
-- ========================================================

-- Create Fundraiser Profiles Table
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

-- Create Bank Details Table
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

-- Create Uploaded Documents Table
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

-- Create Block History Table
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

-- Row Level Security Policies
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
-- 10. Supabase Storage Bucket & RLS Policies Setup
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
