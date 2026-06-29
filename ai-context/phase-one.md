# DonateNow - Project Context

You are helping build **DonateNow**, a modern donation and crowdfunding platform built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**.

## Project Overview

The platform has three main areas:

1. **Public Website**

   * Landing page
   * About
   * Contact
   * Campaign listing
   * Campaign details
   * Donation page (used by donors)

2. **Fundraiser Dashboard**

   * Create and manage campaigns
   * View donations
   * Profile
   * Settings

3. **Admin Dashboard**

   * Manage users
   * Manage fundraisers
   * Manage campaigns
   * Manage donations
   * Platform settings

The current folder structure is intentionally simple:

```
app/
    page.tsx
    about/
    contact/
    campaigns/
    donate/
    admin/
    fundraiser/
```

---

# Current Phase

We are **ONLY building the landing page**.

Do **NOT** create:

* Authentication
* Admin pages
* Fundraiser dashboard
* API routes
* Database
* Backend
* Forms
* Business logic
* Dummy dashboard pages

Only build the public landing page.

---

# Design Reference

A complete design reference already exists inside:

```
ai-context/landing-page/
```

Read everything inside this folder before writing any code.

The landing page should closely match the provided design, including:

* overall layout
* spacing
* typography
* color palette
* component hierarchy
* responsiveness
* animations (where appropriate)
* section ordering
* visual style

Do not redesign or improvise unless something is missing from the reference.

---

# Code Requirements

* Use Next.js App Router.
* Use TypeScript.
* Use Tailwind CSS.
* Build reusable React components.
* Keep components clean and modular.
* Use semantic HTML.
* Make the page fully responsive.
* Follow modern React and Next.js best practices.

Suggested structure:

```
app/
    page.tsx

components/
    landing/
        Navbar.tsx
        Hero.tsx
        Features.tsx
        Campaigns.tsx
        Testimonials.tsx
        CTA.tsx
        Footer.tsx
```

Create additional components only if necessary.

---

# Important

Focus only on producing a high-quality landing page that matches the reference inside `ai-context/landing-page`.

Do not implement any functionality beyond what is required for the landing page.

After the landing page is complete, stop and wait for further instructions. Do not begin implementing the rest of the application until explicitly directed.
also consider having a look on the project-structure.md for the further details if needed.