# Data Dictionary & Database Schemas: Nairobi in ze Pocket

> **ARCHITECTURE**: PostgreSQL (Supabase) + Row Level Security (RLS) for strict privacy compliance (Kenya DPA 2019).

---

## 1. Database Entity Relationship Diagram (Conceptual)

```
 [categories] 1 --- * [providers] * --- 1 [neighborhoods]
                           |
                           | 1 --- * [reviews]
                           |
                     [submissions] (Pending Admin Moderation)

 [guides] (Knowledge Base Articles)
 [emergency_contacts] (SOS Directory)
 [profiles] (User & Admin Accounts)
```

---

## 2. Table Schemas (SQL DDL)

### A. `neighborhoods`
Stores Nairobi districts and geographical zones.

```sql
CREATE TABLE public.neighborhoods (
  id TEXT PRIMARY KEY, -- e.g. 'westlands', 'gigiri', 'karen'
  name TEXT NOT NULL,  -- e.g. 'Westlands / Spring Valley'
  description TEXT,
  display_order INT DEFAULT 0
);
```

### B. `categories`
Stores main business & service categories.

```sql
CREATE TABLE public.categories (
  id TEXT PRIMARY KEY, -- e.g. 'sante', 'fundis', 'education', 'transports'
  name TEXT NOT NULL,  -- e.g. 'Santé & Urgences Médicales'
  icon_name TEXT NOT NULL, -- Lucide icon identifier e.g. 'Stethoscope'
  description TEXT,
  display_order INT DEFAULT 0
);
```

### C. `providers` (Bonnes Adresses)
Stores verified service providers, artisans (*fundis*), doctors, drivers, restaurants, etc.

```sql
CREATE TABLE public.providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category_id TEXT REFERENCES public.categories(id) ON DELETE CASCADE,
  neighborhood_id TEXT REFERENCES public.neighborhoods(id) ON DELETE CASCADE,
  specialty TEXT NOT NULL,          -- e.g. "Pédiatre Francophone", "Plombier / Fundi eau"
  description TEXT NOT NULL,
  phone TEXT NOT NULL,              -- Hidden from unauthenticated scraping if needed
  whatsapp TEXT,                    -- International format e.g. '+254712345678'
  email TEXT,
  website TEXT,
  address TEXT,
  languages TEXT[] DEFAULT ARRAY['Français', 'Anglais'],
  pricing_notes TEXT,               -- Indicative prices / rates if provided
  is_verified BOOLEAN DEFAULT true,
  rating NUMERIC(2,1) DEFAULT 5.0,
  reviews_count INT DEFAULT 1,
  
  -- Community Verification & Source Metadata
  source_badge TEXT DEFAULT 'WhatsApp Verified', -- 'WhatsApp Verified' | 'Nairobi Accueil' | 'Ambassade' | 'Direct Submission'
  source_channel TEXT DEFAULT 'whatsapp_group',  -- 'whatsapp_group' | 'nairobi_accueil_member' | 'embassy_list'
  source_uploaded_at TIMESTAMPTZ DEFAULT now(),
  contributor_masked TEXT DEFAULT 'Recommandé par un membre',
  contributor_revealed TEXT DEFAULT 'Marie Élodie C.', -- Revealed only on click/interaction in UI
  reliability_score INT DEFAULT 5,              -- 1 to 5 trust index
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### D. `emergency_contacts` (SOS Hub)
Stores critical emergency contacts available offline.

```sql
CREATE TABLE public.emergency_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,          -- e.g. "The Aga Khan University Hospital"
  category TEXT NOT NULL,       -- 'hospital' | 'ambulance' | 'pharmacy' | 'embassy' | 'security'
  phone TEXT NOT NULL,          -- Primary SOS phone number
  secondary_phone TEXT,
  neighborhood TEXT,
  address TEXT,
  is_24_7 BOOLEAN DEFAULT true,
  notes TEXT,
  display_order INT DEFAULT 0
);
```

### E. `guides` (Knowledge Base)
Stores installation & expat practical guides.

```sql
CREATE TABLE public.guides (
  id TEXT PRIMARY KEY,          -- e.g. 'embauche-personnel-domestique'
  title TEXT NOT NULL,
  category TEXT NOT NULL,       -- 'installation', 'legal', 'sante', 'scolarite', 'transport'
  summary TEXT NOT NULL,
  content_md TEXT NOT NULL,     -- Full markdown content
  author TEXT DEFAULT 'Nairobi Accueil',
  read_time_minutes INT DEFAULT 5,
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### F. `submissions` (Pending Provider Recommendations)
Member-submitted recommendations awaiting admin approval.

```sql
CREATE TABLE public.submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_name TEXT NOT NULL,
  category_id TEXT NOT NULL,
  neighborhood_id TEXT NOT NULL,
  phone TEXT NOT NULL,
  description TEXT NOT NULL,
  submitter_name TEXT NOT NULL,
  submitter_email TEXT NOT NULL,
  consent_given BOOLEAN NOT NULL CHECK (consent_given = true), -- DPA 2019 compliance check
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### G. `profiles`
User profiles with admin flags.

```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 3. Row Level Security (RLS) & DPA 2019 Compliance Rules

```sql
-- Enable RLS on all tables
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Public READ access for general directory, emergency, guides & categories
CREATE POLICY "Public Read Providers" ON public.providers FOR SELECT USING (true);
CREATE POLICY "Public Read Emergency" ON public.emergency_contacts FOR SELECT USING (true);
CREATE POLICY "Public Read Guides" ON public.guides FOR SELECT USING (true);

-- Anyone can submit a recommendation (INSERT)
CREATE POLICY "Public Insert Submissions" ON public.submissions FOR INSERT WITH CHECK (consent_given = true);

-- Only Admins can view/update/delete Submissions
CREATE POLICY "Admin Full Access Submissions" ON public.submissions FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true));

-- Only Admins can INSERT/UPDATE/DELETE Providers & Guides
CREATE POLICY "Admin Modify Providers" ON public.providers FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true));
```

---

## 4. TypeScript Interfaces (`types.ts`)

```typescript
export type CategoryId = 'sante' | 'fundis' | 'it_tech' | 'education' | 'transports' | 'loisirs' | 'sport' | 'domestique' | 'autres';

export type NeighborhoodId = 'all' | 'westlands' | 'gigiri' | 'runda' | 'lavington' | 'karen' | 'kilimani';

export type SourceBadge = 'WhatsApp Verified' | 'Nairobi Accueil' | 'Ambassade' | 'Direct Submission';

export type SourceChannel = 'whatsapp_group' | 'nairobi_accueil_member' | 'embassy_list' | 'direct_submission';

export interface ProviderSourceInfo {
  badge: SourceBadge;
  channel: SourceChannel;
  uploadedAt: string;                 // ISO 8601 string, e.g. "2026-09-01T20:25:00Z"
  contributorMasked: string;          // Default display label: "Recommandé par un membre"
  contributorRevealed: string;        // Revealed on user click/interaction: "Marie Élodie C."
  reliabilityScore: number;           // 1 to 5 trust index
  originalNotes?: string;             // Verbatim remarks from original source sheet
  sourceSheet?: string;               // Original Excel sheet name
}

export interface Provider {
  id: string;
  name: string;
  categoryId: CategoryId;
  neighborhoodId: Exclude<NeighborhoodId, 'all'>;
  specialty: string;
  description: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  address?: string;
  pricingNotes?: string;
  languages: string[];
  isVerified: boolean;
  rating: number;
  reviewsCount: number;
  tags: string[];
  sourceInfo?: ProviderSourceInfo;
  createdAt?: string;
}

export interface EmergencyContact {
  id: string;
  title: string;
  category: 'hospital' | 'ambulance' | 'pharmacy' | 'embassy' | 'security';
  phone: string;
  secondaryPhone?: string;
  neighborhood?: string;
  address?: string;
  is247: boolean;
  notes?: string;
}

export interface Guide {
  id: string;
  title: string;
  category: string;
  summary: string;
  contentMd: string;
  author: string;
  readTimeMinutes: number;
  updatedAt: string;
  iconName: string;
}

export interface ProviderSubmission {
  id?: string;
  providerName: string;
  categoryId: CategoryId;
  neighborhoodId: Exclude<NeighborhoodId, 'all'>;
  phone: string;
  description: string;
  submitterName: string;
  submitterEmail: string;
  consentGiven: boolean;
  status?: 'pending' | 'approved' | 'rejected';
  createdAt?: string;
}
```
