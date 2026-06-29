structure:
app/
│
├── page.tsx              # Landing
├── about/
├── contact/
├── campaigns/
├── donate/
│   └── [id]/
│
├── admin/
│   ├── page.tsx
│   ├── campaigns/
│   ├── fundraisers/
│   ├── donations/
│   ├── users/
│   └── settings/
│
├── fundraiser/
│   ├── page.tsx
│   ├── campaigns/
│   ├── donations/
│   ├── profile/
│   └── settings/
│
├── api/
├── layout.tsx
└── globals.css

components/
│
├── ui/
├── admin/
├── fundraiser/
└── public/

lib/
├── auth.ts
├── db.ts
├── utils.ts
└── api.ts

types/
hooks/
middleware.ts


routes:
/
/about
/contact
/campaigns
/donate/123

/admin
/admin/campaigns
/admin/users

/fundraiser
/fundraiser/campaigns
/fundraiser/profile