-- =========================================================================
-- NAIROBI IN ZE POCKET - SCHÉMA DE BASE DE DONNÉES CLOUD SUPABASE (POSTGRESQL)
-- =========================================================================
-- Instructions : 
-- 1. Rendez-vous sur votre tableau de bord Supabase (https://app.supabase.com)
-- 2. Ouvrez l'onglet "SQL Editor" dans le menu de gauche
-- 3. Créez une "New query", collez l'intégralité de ce script et cliquez sur "Run"
-- =========================================================================

-- 1. Table : Fiches de Prestataires & Adresses de l'Annuaire (providers)
CREATE TABLE IF NOT EXISTS public.providers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category_id TEXT NOT NULL,
  neighborhood_id TEXT NOT NULL,
  specialty TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  whatsapp TEXT,
  email TEXT,
  website TEXT,
  address TEXT,
  pricing_notes TEXT,
  languages JSONB NOT NULL DEFAULT '["Français", "Anglais"]'::jsonb,
  is_verified BOOLEAN NOT NULL DEFAULT true,
  rating NUMERIC(3, 1) NOT NULL DEFAULT 5.0,
  reviews_count INTEGER NOT NULL DEFAULT 1,
  tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  source_info JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index pour des recherches et filtres ultra-rapides
CREATE INDEX IF NOT EXISTS idx_providers_category ON public.providers(category_id);
CREATE INDEX IF NOT EXISTS idx_providers_neighborhood ON public.providers(neighborhood_id);
CREATE INDEX IF NOT EXISTS idx_providers_verified ON public.providers(is_verified);
CREATE INDEX IF NOT EXISTS idx_providers_name_trgm ON public.providers USING gin (to_tsvector('french', name || ' ' || specialty || ' ' || description));

-- 2. Table : Recommandations Communautaires en attente de modération (submissions)
CREATE TABLE IF NOT EXISTS public.submissions (
  id TEXT PRIMARY KEY,
  provider_name TEXT NOT NULL,
  category_id TEXT NOT NULL,
  neighborhood_id TEXT NOT NULL,
  phone TEXT NOT NULL,
  description TEXT NOT NULL,
  submitter_name TEXT NOT NULL,
  submitter_email TEXT NOT NULL,
  consent_given BOOLEAN NOT NULL DEFAULT true,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_submissions_status ON public.submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON public.submissions(created_at DESC);

-- 3. Table : File d'attente Telegram Bot (telegram_waitlist)
CREATE TABLE IF NOT EXISTS public.telegram_waitlist (
  id TEXT PRIMARY KEY,
  name TEXT,
  telegram_handle TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'web_app',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Table : Candidatures Modérateurs Bénévoles (moderator_applications)
CREATE TABLE IF NOT EXISTS public.moderator_applications (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_or_whatsapp TEXT NOT NULL,
  neighborhood TEXT,
  motivation TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================================================
-- ACTIVATION DE LA SÉCURITÉ ROW LEVEL SECURITY (RLS)
-- =========================================================================
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.telegram_waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moderator_applications ENABLE ROW LEVEL SECURITY;

-- Politiques pour 'providers' :
-- Tout le monde peut lire les fiches
CREATE POLICY "Lecture publique des fiches de l'annuaire"
  ON public.providers FOR SELECT
  USING (true);

-- L'écriture/modification/suppression est autorisée
CREATE POLICY "Gestion des fiches de l'annuaire"
  ON public.providers FOR ALL
  USING (true)
  WITH CHECK (true);

-- Politiques pour 'submissions' :
-- N'importe quel membre peut soumettre une recommandation
CREATE POLICY "Création publique de recommandation"
  ON public.submissions FOR INSERT
  WITH CHECK (true);

-- Lecture et mise à jour des recommandations
CREATE POLICY "Gestion des soumissions"
  ON public.submissions FOR ALL
  USING (true)
  WITH CHECK (true);

-- Politiques pour 'telegram_waitlist' & 'moderator_applications'
CREATE POLICY "Inscription waitlist"
  ON public.telegram_waitlist FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Candidature modérateur"
  ON public.moderator_applications FOR ALL
  USING (true)
  WITH CHECK (true);

-- =========================================================================
-- ACTIVATION DU TEMPS RÉEL (SUPABASE REALTIME)
-- =========================================================================
-- Permet aux téléphones et navigateurs connectés de recevoir instantanément
-- les fiches créées, modifiées ou approuvées sans rafraîchir la page
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR TABLE 
    public.providers, 
    public.submissions,
    public.telegram_waitlist,
    public.moderator_applications;
COMMIT;

-- =========================================================================
-- GRAINE INITIALE : FICHE CERTIFIÉE BEN & PREMIÈRES ADRESSES CLÉS
-- =========================================================================
INSERT INTO public.providers (
  id, name, category_id, neighborhood_id, specialty, description, phone, whatsapp, 
  languages, is_verified, rating, reviews_count, tags, source_info
) VALUES 
(
  'it_tech_ben',
  'Ben',
  'it_tech',
  'gigiri',
  'Bilingue français anglais, +15 ans d''expérience en création de site internet vitrine et e-commerce, branding & marketing digital',
  'Bilingue français anglais, +15 ans d''expérience en création de site internet vitrine et e-commerce, branding & marketing digital.',
  '+254 700 000 000',
  '+254700000000',
  '["Français", "Anglais"]'::jsonb,
  true,
  5.0,
  3,
  '["it_tech", "gigiri", "Site Internet", "Web", "Marketing", "Création de site"]'::jsonb,
  jsonb_build_object(
    'badge', 'Nairobi Accueil',
    'channel', 'nairobi_accueil_member',
    'uploadedAt', NOW()::text,
    'contributorMasked', 'Recommandé par Ben',
    'contributorRevealed', 'Ben (Directeur IT & Web)',
    'reliabilityScore', 5,
    'originalNotes', 'Fiche certifiée Nairobi Accueil',
    'sourceSheet', 'Annuaire Officiel'
  )
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  specialty = EXCLUDED.specialty,
  description = EXCLUDED.description,
  updated_at = NOW();

-- Notification de fin
SELECT 'Configuration Supabase terminée avec succès pour Nairobi in ze Pocket !' as resultat;
