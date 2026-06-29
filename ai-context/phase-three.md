# Phase 3 - Fundraiser Authentication, Onboarding & Dashboard

The Admin Panel, Authentication, Database, and RBAC have been completed.

This phase focuses on implementing the complete **Fundraiser Portal**, including registration, onboarding, verification workflow, and campaign management.

---

# Objectives

Implement:

1. Fundraiser Registration
2. Fundraiser Login
3. RBAC-based dashboard routing
4. Multi-step onboarding
5. Legal document uploads
6. Admin verification workflow
7. Fundraiser Dashboard
8. Campaign management
9. Fundraiser status management
10. Admin visibility of all fundraisers and campaigns

---

# Authentication

When a visitor clicks **"Get Started"** on the landing page:

* Redirect them to the Fundraiser Registration page.
* Register using Supabase Authentication.
* Required fields:

  * Email
  * Password
* After successful registration, automatically assign the **Fundraiser** role in the database.
* After login, RBAC should automatically redirect users to the correct dashboard based on their role:

  * Admin → `/admin`
  * Fundraiser → `/fundraiser`

Do not create separate login systems. Continue using the existing Supabase Auth implementation.

---

# Fundraiser Onboarding

Immediately after the first login, the fundraiser must complete a **5-step onboarding process** before accessing the dashboard.

The onboarding should save progress so users can continue later if they leave.

Suggested steps:

### Step 1 — Organization Information

Collect:

* Organization Name
* Organization Type
* Registration Number
* Year Established
* Website (optional)

---

### Step 2 — Contact Information

Collect:

* Contact Person
* Phone Number
* Email
* Country
* State
* City
* Full Address

---

### Step 3 — Legal Documents

Upload documents using Supabase Storage.

Examples:

* Government Registration Certificate
* NGO Certificate (if applicable)
* Tax Registration
* Identity Proof
* Address Proof
* Any additional supporting documents

Store document metadata in the database.

---

### Step 4 — Banking Information

Collect:

* Account Holder Name
* Bank Name
* Account Number
* IFSC / SWIFT
* Branch
* Cancelled Cheque or Bank Proof (upload)

Store securely.

---

### Step 5 — Review & Submit

Display a summary of all entered information.

The fundraiser submits the application for verification.

Once submitted:

* Lock onboarding from further editing unless returned for revision.
* Set verification status to **Pending**.
* Redirect the fundraiser to a "Verification Pending" page.

---

# Verification Status

Fundraisers should have one of the following statuses:

```text
Pending
Under Review
Approved
Rejected
Blocked (Temporary)
Blocked (Permanent)
```

These statuses should be stored in the database.

---

# Pending Verification Experience

Until approved:

* Fundraisers cannot create campaigns.
* They cannot access the full dashboard.
* Display a status page explaining that their application is awaiting review.

If rejected:

Display the rejection reason and allow resubmission if enabled by the administrator.

---

# Admin Review

The Admin Panel should include a dedicated **Fundraiser Verification** section.

The admin can:

* View all submitted onboarding details
* View uploaded documents
* Download documents
* Approve fundraiser
* Reject fundraiser
* Request additional information
* Add internal notes
* Record the reason for rejection

Once approved:

* Verification status becomes **Approved**
* Fundraiser gains access to the full dashboard automatically

---

# Fundraiser Dashboard

Only approved fundraisers can access it.

Create:

```text
/fundraiser

Dashboard

Campaigns

Donations

Analytics

Profile

Settings
```

Use the same design language as the Admin Panel:

* shadcn/ui
* Light theme only
* Same accent color as the landing page
* Responsive
* Professional dashboard layout

---

# Campaign Management

Approved fundraisers can:

* Create campaigns
* Edit campaigns
* Save drafts
* Publish campaigns
* Archive campaigns
* Delete campaigns

Each campaign should belong to exactly one fundraiser.

Campaigns should include an approval/status field if future moderation is required.

---

# Admin Campaign Management

The Admin Panel should display **all campaigns from every fundraiser**.

The admin should be able to:

* View every campaign
* Search campaigns
* Filter by fundraiser
* Filter by status
* View campaign details
* Edit if necessary
* Archive campaigns
* Remove campaigns if required

This is a global management view across the platform.

---

# Fundraiser Management

The Admin should be able to:

* View all fundraisers
* Search
* Filter
* Approve
* Reject
* Temporarily block
* Permanently block
* Unblock temporarily blocked users
* View onboarding details
* View uploaded documents
* View campaigns created by each fundraiser

Blocking a fundraiser should immediately prevent access to the Fundraiser Dashboard.

Blocked users should see an appropriate message when attempting to log in.

---

# Database

Extend the existing schema to support:

* fundraiser_profiles
* verification_status
* uploaded_documents
* bank_details
* onboarding_progress
* campaign ownership
* admin review notes
* block history

Maintain proper relationships, foreign keys, indexes, and Row Level Security (RLS) policies.

---

# File Storage

Use Supabase Storage for all uploaded documents.

Requirements:

* Organized bucket structure
* Secure access policies
* File validation
* Size limits
* Allowed file types
* Document metadata stored in the database

---

# UI Requirements

Continue using:

* shadcn/ui
* Tailwind CSS
* Light theme only
* Same accent color as the landing page
* Responsive layouts
* Loading skeletons
* Empty states
* Error handling
* Accessible components

---

# Important

This phase should implement the complete Fundraiser experience, including:

* Registration
* Login
* RBAC routing
* 5-step onboarding
* Document uploads
* Verification workflow
* Fundraiser dashboard
* Campaign management
* Admin verification
* Admin campaign oversight
* Temporary and permanent blocking

Do **not** implement the donor experience, donation flow, payment gateway, or public campaign interaction in this phase.

After completing this phase, stop and wait for the next implementation phase.
