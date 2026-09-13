-- =============================================================================
-- Migration Supabase PostgreSQL : Nairobi in ze Pocket (Realtime Sync & RLS)
-- Compatible avec le Data Dictionary & Conformité Kenya Data Protection Act 2019
-- =============================================================================

-- 1. Table des Catégories
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  description TEXT,
  display_order INT DEFAULT 0
);

-- Insertion des 11 catégories officielles de l'application
INSERT INTO public.categories (id, name, icon_name, description, display_order) VALUES
  ('sante', 'Santé & Médical', 'Stethoscope', 'Médecins francophones, hôpitaux, dentistes & pédiatres', 1),
  ('fundis', 'Artisans & Fundis', 'Wrench', 'Plomberie, électricité, générateurs, clim & menuiserie', 2),
  ('it_tech', 'IT & Réparation Mobile + Ordinateur', 'Laptop', 'Dépannage informatique, écrans iPhone/Android, Mac & réseaux Wi-Fi', 3),
  ('education', 'Éducation & Écoles', 'GraduationCap', 'Lycée Denis Diderot, crèches & tuteurs francophones', 4),
  ('transports', 'Transports & Chauffeurs', 'Car', 'Chauffeurs privés de confiance, taxis & véhicules', 5),
  ('restaurant', 'Restaurant - Catering - Chef', 'ChefHat', 'Restaurants, traiteurs, chefs privés & gastronomie', 6),
  ('loisirs', 'Loisirs & Safaris', 'Compass', 'Agences safari réceptives, sorties, parcs & culture', 7),
  ('sport', 'Sport', 'Dumbbell', 'Coaching sportif, yoga, fitness, arts martiaux & équitation', 8),
  ('animaux', 'Animaux compagnie', 'Dog', 'Vétérinaires, garde d''animaux, pensions & soins animaliers', 9),
  ('domestique', 'Personnel de Maison', 'Home', 'Agences de placement certifiées, NSSF & SHIF', 10),
  ('autres', 'Autres', 'MoreHorizontal', 'Démarches administratives, visas, soins esthétiques & services divers', 11)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  icon_name = EXCLUDED.icon_name,
  description = EXCLUDED.description,
  display_order = EXCLUDED.display_order;

-- 2. Table des Quartiers
CREATE TABLE IF NOT EXISTS public.neighborhoods (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  display_order INT DEFAULT 0
);

INSERT INTO public.neighborhoods (id, name, display_order) VALUES
  ('all', 'Tous les quartiers', 0),
  ('westlands', 'Westlands / Spring Valley', 1),
  ('gigiri', 'Gigiri / Runda', 2),
  ('lavington', 'Lavington / Kilimani', 3),
  ('karen', 'Karen / Lang''ata', 4)
ON CONFLICT (id) DO NOTHING;

-- 3. Table des Fiches Prestataires (Providers)
CREATE TABLE IF NOT EXISTS public.providers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category_id TEXT REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE SET NULL,
  neighborhood_id TEXT REFERENCES public.neighborhoods(id) ON UPDATE CASCADE ON DELETE SET NULL,
  specialty TEXT NOT NULL,
  description TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT,
  email TEXT,
  website TEXT,
  address TEXT,
  languages TEXT[] DEFAULT ARRAY['Français', 'Anglais'],
  pricing_notes TEXT,
  is_verified BOOLEAN DEFAULT true,
  rating NUMERIC(3,1) DEFAULT 5.0,
  reviews_count INT DEFAULT 1,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Métadonnées de Traçabilité & Véracité
  source_badge TEXT DEFAULT 'WhatsApp Verified',
  source_channel TEXT DEFAULT 'whatsapp_group',
  source_uploaded_at TIMESTAMPTZ DEFAULT now(),
  contributor_masked TEXT DEFAULT 'Recommandé par un membre',
  contributor_revealed TEXT DEFAULT 'Marie Élodie C.',
  reliability_score INT DEFAULT 5,
  original_notes TEXT,
  source_sheet TEXT,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index de performance
CREATE INDEX IF NOT EXISTS idx_providers_category ON public.providers(category_id);
CREATE INDEX IF NOT EXISTS idx_providers_neighborhood ON public.providers(neighborhood_id);

-- 4. Table des Recommandations Soumises (Submissions)
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
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_submissions_status ON public.submissions(status);

-- 5. Row Level Security (RLS)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.neighborhoods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Politiques de lecture publique
CREATE POLICY "Public Read Categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public Read Neighborhoods" ON public.neighborhoods FOR SELECT USING (true);
CREATE POLICY "Public Read Providers" ON public.providers FOR SELECT USING (true);
CREATE POLICY "Public Read Submissions" ON public.submissions FOR SELECT USING (true);

-- Politiques d'écriture / modification
CREATE POLICY "Public Insert Submissions" ON public.submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Submissions" ON public.submissions FOR UPDATE USING (true);
CREATE POLICY "Public Delete Submissions" ON public.submissions FOR DELETE USING (true);

CREATE POLICY "Public Insert Providers" ON public.providers FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Providers" ON public.providers FOR UPDATE USING (true);
CREATE POLICY "Public Delete Providers" ON public.providers FOR DELETE USING (true);

-- 6. Activation du Temps Réel Supabase (Realtime Publication)
ALTER PUBLICATION supabase_realtime ADD TABLE public.providers;
ALTER PUBLICATION supabase_realtime ADD TABLE public.submissions;
