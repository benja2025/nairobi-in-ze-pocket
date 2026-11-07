# Nairobi in ze Pocket — Modèle de Données & Schémas Relationnels

> **Version :** 1.0 — 7 novembre 2026 — Classification : Interne / Conforme Kenya DPA 2019.  
> **Source de Vérité Canonique :** Ce document fixe l'ensemble des entités, contraintes d'intégrité référentielle, cardinalités et politiques de Row Level Security (RLS) PostgreSQL / Supabase.

---

## 1. Principes Directeurs d'Ingénierie de Données

1. **Typage Strict & Intégrité Référentielle :**  
   - Clés primaires générées côté serveur sous forme d'UUID v4 (`gen_random_uuid()`).
   - Timestamps stockés impérativement en UTC avec fuseau horaire (`timestamptz`).
   - Téléphones au standard international strict **E.164** (ex: `+254712345678`).
2. **Conformité Kenya Data Protection Act (DPA) 2019 :**  
   - **Minimisation :** Aucun champ de données privées superflu.
   - **Consentement Formel :** Toute soumission enregistre un booléen vérifié `consent_given = true`.
   - **Droit à l'Oubli & Rectification :** Procédure documentée de désactivation immédiate sur simple demande du prestataire.
   - **Row Level Security (RLS) :** Protection des coordonnées personnelles contre le moissonnage non authentifié.
3. **Architecture Hybride (Online / Offline Fallback) :**  
   - En l'absence de réseau ou sans clés API injectées, le client bascule instantanément sur le pilote local de données mockées (`src/data/mockProviders.ts`, `src/data/mockEmergency.ts`, `src/data/mockGuides.ts`).

---

## 2. Diagramme Entité-Association (ERD)

```text
 ┌────────────────┐          ┌───────────────────────┐          ┌────────────────┐
 │  neighborhoods │ 1      * │       providers       │ *      1 │   categories   │
 ├────────────────┤──────────├───────────────────────┤──────────├────────────────┤
 │ id (PK)        │          │ id (PK)               │          │ id (PK)        │
 │ name           │          │ name                  │          │ name           │
 │ display_order  │          │ specialty             │          │ icon_name      │
 └────────────────┘          │ category_id (FK)      │          │ display_order  │
                             │ neighborhood_id (FK)  │          └────────────────┘
                             │ phone, whatsapp       │
                             │ languages, rating     │
                             │ is_verified           │
                             └───────────┬───────────┘
                                         │ 1
                                         │
                                         │ *
                             ┌───────────┴───────────┐
                             │      submissions      │
                             ├───────────────────────┤
                             │ id (PK)               │
                             │ provider_name         │
                             │ phone                 │
                             │ submitter_name        │
                             │ submitter_email       │
                             │ consent_given (TRUE)  │
                             │ status (pending, ...) │
                             └───────────────────────┘

 ┌────────────────────────┐          ┌────────────────────────┐
 │   emergency_contacts   │          │         guides         │
 ├────────────────────────┤          ├────────────────────────┤
 │ id (PK)                │          │ id (PK)                │
 │ title                  │          │ title, category        │
 │ category (hospital...) │          │ summary, content_md    │
 │ phone, secondary_phone │          │ read_time_minutes      │
 │ is_24_7                │          │ author, updated_at     │
 └────────────────────────┘          └────────────────────────┘
```

---

## 3. Schéma DDL PostgreSQL & Contraintes (Supabase)

```sql
-- Extension pour la génération d'UUID sécurisés
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. Table des Quartiers Résidentiels de Nairobi
-- ============================================================================
CREATE TABLE public.neighborhoods (
  id TEXT PRIMARY KEY, -- 'westlands', 'gigiri', 'lavington', 'karen', 'runda', 'kilimani'
  name TEXT NOT NULL,
  description TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================================
-- 2. Table des Catégories de Services
-- ============================================================================
CREATE TABLE public.categories (
  id TEXT PRIMARY KEY, -- 'sante', 'fundis', 'education', 'transports', 'loisirs', 'domestique'
  name TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  description TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================================
-- 3. Table des Prestataires & Bonnes Adresses Vérifiées
-- ============================================================================
CREATE TABLE public.providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(180) NOT NULL,
  category_id TEXT NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  neighborhood_id TEXT NOT NULL REFERENCES public.neighborhoods(id) ON DELETE RESTRICT,
  specialty VARCHAR(180) NOT NULL,
  description TEXT NOT NULL,
  phone VARCHAR(40) NOT NULL,
  whatsapp VARCHAR(40),
  email VARCHAR(254),
  website VARCHAR(2048),
  address VARCHAR(255),
  languages TEXT[] DEFAULT ARRAY['Français', 'Anglais'] NOT NULL,
  is_verified BOOLEAN DEFAULT true NOT NULL,
  rating NUMERIC(2,1) DEFAULT 5.0 NOT NULL CHECK (rating >= 1.0 AND rating <= 5.0),
  reviews_count INT DEFAULT 1 NOT NULL CHECK (reviews_count >= 0),
  tags TEXT[] DEFAULT ARRAY[]::TEXT[] NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX idx_providers_category ON public.providers(category_id);
CREATE INDEX idx_providers_neighborhood ON public.providers(neighborhood_id);

-- ============================================================================
-- 4. Table des Contacts d'Urgence SOS (Offline-First)
-- ============================================================================
CREATE TABLE public.emergency_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(180) NOT NULL,
  category VARCHAR(32) NOT NULL CHECK (category IN ('hospital', 'ambulance', 'pharmacy', 'embassy', 'security')),
  phone VARCHAR(40) NOT NULL,
  secondary_phone VARCHAR(40),
  neighborhood VARCHAR(80),
  address VARCHAR(255),
  is_24_7 BOOLEAN DEFAULT true NOT NULL,
  notes TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================================
-- 5. Table des Guides d'Installation & Connaissances Expat
-- ============================================================================
CREATE TABLE public.guides (
  id TEXT PRIMARY KEY, -- 'embauche-personnel-domestique', 'choisir-son-quartier-nairobi'
  title VARCHAR(255) NOT NULL,
  category VARCHAR(64) NOT NULL,
  summary TEXT NOT NULL,
  content_md TEXT NOT NULL,
  author VARCHAR(120) DEFAULT 'Nairobi Accueil' NOT NULL,
  read_time_minutes INT DEFAULT 5 NOT NULL,
  icon_name VARCHAR(64) DEFAULT 'FileText' NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================================
-- 6. Table des Soumissions de Recommandations (File de Modération)
-- ============================================================================
CREATE TABLE public.submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_name VARCHAR(180) NOT NULL,
  category_id TEXT NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  neighborhood_id TEXT NOT NULL REFERENCES public.neighborhoods(id) ON DELETE RESTRICT,
  phone VARCHAR(40) NOT NULL,
  description TEXT NOT NULL,
  submitter_name VARCHAR(150) NOT NULL,
  submitter_email VARCHAR(254) NOT NULL,
  consent_given BOOLEAN NOT NULL CHECK (consent_given = true), -- Règle DPA 2019
  status VARCHAR(20) DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================================
-- 7. Table des Profils Utilisateurs & Administrateurs
-- ============================================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(254) NOT NULL UNIQUE,
  full_name VARCHAR(150),
  is_admin BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

---

## 4. Politiques Row Level Security (RLS) & Egress Firewall

```sql
-- Activer RLS sur toutes les tables sans exception
ALTER TABLE public.neighborhoods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Lecture publique pour les éléments vitaux et l'annuaire de consultation
CREATE POLICY "Public Read Neighborhoods" ON public.neighborhoods FOR SELECT USING (true);
CREATE POLICY "Public Read Categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public Read Providers" ON public.providers FOR SELECT USING (true);
CREATE POLICY "Public Read Emergency" ON public.emergency_contacts FOR SELECT USING (true);
CREATE POLICY "Public Read Guides" ON public.guides FOR SELECT USING (true);

-- Soumission : N'importe quel membre ou visiteur peut proposer une fiche SI le consentement DPA est vérifié
CREATE POLICY "Public Insert Submissions" ON public.submissions 
  FOR INSERT WITH CHECK (consent_given = true);

-- Modération : Seuls les administrateurs ont accès en lecture/écriture à la file de modération
CREATE POLICY "Admin All Submissions" ON public.submissions FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true));

-- Seuls les administrateurs peuvent modifier les fiches de l'annuaire et des guides
CREATE POLICY "Admin Modify Providers" ON public.providers FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true));

CREATE POLICY "Admin Modify Guides" ON public.guides FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true));
```
