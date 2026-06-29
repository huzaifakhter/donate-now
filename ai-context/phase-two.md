# Phase 2 - Authentication, Database & Admin Panel

The landing page has been completed.

This phase focuses on building the application's foundation by implementing authentication, database integration, authorization, and the Admin Panel.

---

# Objectives

Complete the following in this phase:

1. Supabase Authentication
2. Supabase Database integration
3. Role-Based Access Control (RBAC)
4. Admin Panel
5. Route protection
6. Initial database schema
7. Admin CRUD foundation

Do **not** begin implementing the Fundraiser module or Donation flow yet.

---

# Technology Stack

Use the following technologies:

* Next.js App Router
* TypeScript
* Tailwind CSS
* shadcn/ui
* Supabase Authentication
* Supabase PostgreSQL
* Row Level Security (RLS)
* RBAC

Do not introduce another authentication provider or ORM.

---

# Environment Variables

Use a proper `.env.local` file for all sensitive configuration.

Do not hardcode any secrets.

Include environment variables for at least:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Create an `.env.example` containing all required variables (without values).

---

# Authentication

Implement complete authentication using Supabase Auth.

Features:

* Login
* Logout
* Forgot Password
* Reset Password
* Session persistence
* Protected routes
* Middleware authentication
* Server-side session validation

Public user registration is **not** required in this phase. Users will initially be created by administrators or directly through Supabase.

---

# User Roles (RBAC)

Implement Role-Based Access Control.

Initial roles:

```text
Admin
Fundraiser
```

Store roles in the database.

Create reusable utilities/hooks for checking permissions.

Protect every `/admin/*` route.

Only Admin users may access the Admin Panel.

Unauthorized users should be redirected appropriately.

Design the RBAC implementation so additional roles and permissions can easily be added later.

---

# Database

Configure Supabase properly.

Create a clean, production-ready database schema.

Suggested tables:

```text
profiles
roles
campaigns
donations
categories
fundraisers
```

Include:

* Primary keys
* Foreign keys
* Created/updated timestamps
* Soft deletes where appropriate
* Proper indexes
* Row Level Security policies

Provide migration files or SQL scripts for the schema.

---

# Supabase Structure

Keep all Supabase logic centralized.

Example:

```text
lib/
    supabase/
        client.ts
        server.ts
        middleware.ts
        auth.ts
```

Avoid duplicate client initialization.

---

# Admin Panel

Implement the complete Admin Dashboard.

Use **shadcn/ui** components wherever appropriate.

The dashboard should feel modern, clean, and production-ready.

Create:

* Responsive Sidebar
* Top Navigation
* User Menu
* Breadcrumbs
* Notifications placeholder
* Logout
* Reusable Page Layout

Routes:

```text
/admin
/admin/users
/admin/fundraisers
/admin/campaigns
/admin/categories
/admin/donations
/admin/reports
/admin/settings
```

---

# Admin Features

Create the foundation for managing:

* Users
* Fundraisers
* Campaigns
* Categories

Each module should include:

* List page
* Search
* Pagination
* Empty state
* Loading state
* Create page
* Edit page
* Delete confirmation

The UI should be production-ready even if advanced business logic is postponed.

---

# UI & Design Requirements

Use **shadcn/ui** as the primary component library for the Admin Panel.

The Admin Panel should visually complement the landing page.

Requirements:

* **Light theme only** (do not implement dark mode)
* Use the **same primary/accent color** from the landing page for:

  * Primary buttons
  * Active navigation items
  * Links
  * Focus states
  * Important UI highlights
* Use neutral colors for backgrounds and cards
* Keep spacing, typography, and border radius consistent with the landing page
* Responsive design for desktop, tablet, and mobile
* Accessible components
* Loading skeletons
* Empty states
* Error states

---

# Code Structure

Keep the project modular.

Example:

```text
app/
components/
lib/
hooks/
services/
types/
utils/
middleware.ts
```

Separate:

* UI
* Business logic
* Database
* Authentication
* Authorization

---

# Code Quality

Requirements:

* Fully typed TypeScript
* Modular components
* Reusable hooks
* Clean architecture
* Responsive design
* Accessibility
* Proper error handling
* Avoid duplicate code

---

# Important

This phase establishes the application's core architecture.

Implement:

* Supabase Authentication
* Supabase Database integration
* Environment configuration
* RBAC
* Protected routes
* Database schema
* Admin Panel
* Admin CRUD foundation

Do **not** implement:

* Fundraiser Dashboard
* Campaign creation workflow
* Donation workflow
* Payment gateway integration
* Public user features

Once these foundational systems and the Admin Panel are complete, stop and wait for the next phase before implementing any additional modules.
