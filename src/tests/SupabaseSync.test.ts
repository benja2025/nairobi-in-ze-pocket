import { describe, it, expect, vi } from 'vitest';
import {
  mapRowToProvider,
  mapProviderToRow,
  mapRowToSubmission,
  mapSubmissionToRow,
  SupabaseProviderRow,
  SupabaseSubmissionRow
} from '../services/supabaseClient';
import { Provider, ProviderSubmission } from '../types';

describe('Supabase Client & Data Synchronization Layer', () => {
  const sampleProvider: Provider = {
    id: 'it_tech_ben',
    name: 'Ben',
    categoryId: 'it_tech',
    neighborhoodId: 'gigiri',
    specialty: 'Bilingue français anglais, +15 ans d\'expérience en création de site internet',
    description: 'Bilingue français anglais, +15 ans d\'expérience en création de site internet vitrine et e-commerce, branding & marketing digital.',
    phone: '+254 700 000 000',
    whatsapp: '+254700000000',
    email: 'ben@nairobi-tech.co.ke',
    website: 'https://nairobi-tech.co.ke',
    address: 'Gigiri / Runda, Nairobi',
    pricingNotes: 'Sur devis transparent',
    languages: ['Français', 'Anglais'],
    isVerified: true,
    rating: 5.0,
    reviewsCount: 4,
    tags: ['it_tech', 'gigiri', 'Site Internet', 'Web'],
    sourceInfo: {
      badge: 'Nairobi Accueil',
      channel: 'direct_submission',
      uploadedAt: '2026-03-01T10:00:00.000Z',
      contributorMasked: 'Recommandé par Ben',
      contributorRevealed: 'Ben (Directeur IT)',
      reliabilityScore: 5,
      originalNotes: 'Validé bureau',
      sourceSheet: 'Annuaire Officiel'
    },
    createdAt: '2026-03-01T10:00:00.000Z'
  };

  it('maps Provider model to PostgreSQL Supabase snake_case row correctly', () => {
    const row: SupabaseProviderRow = mapProviderToRow(sampleProvider);

    expect(row.id).toBe('it_tech_ben');
    expect(row.name).toBe('Ben');
    expect(row.category_id).toBe('it_tech');
    expect(row.neighborhood_id).toBe('gigiri');
    expect(row.phone).toBe('+254 700 000 000');
    expect(row.whatsapp).toBe('+254700000000');
    expect(row.email).toBe('ben@nairobi-tech.co.ke');
    expect(row.website).toBe('https://nairobi-tech.co.ke');
    expect(row.is_verified).toBe(true);
    expect(row.rating).toBe(5.0);
    expect(row.reviews_count).toBe(4);
    expect(row.languages).toEqual(['Français', 'Anglais']);
    expect(row.tags).toContain('Site Internet');
    expect(row.source_info?.badge).toBe('Nairobi Accueil');
  });

  it('maps PostgreSQL Supabase row back to strongly typed Provider model with zero data loss', () => {
    const row = mapProviderToRow(sampleProvider);
    const restoredProvider = mapRowToProvider(row);

    expect(restoredProvider.id).toBe(sampleProvider.id);
    expect(restoredProvider.name).toBe(sampleProvider.name);
    expect(restoredProvider.categoryId).toBe(sampleProvider.categoryId);
    expect(restoredProvider.neighborhoodId).toBe(sampleProvider.neighborhoodId);
    expect(restoredProvider.phone).toBe(sampleProvider.phone);
    expect(restoredProvider.isVerified).toBe(true);
    expect(restoredProvider.rating).toBe(5.0);
    expect(restoredProvider.sourceInfo?.badge).toBe('Nairobi Accueil');
    expect(restoredProvider.sourceInfo?.contributorMasked).toBe('Recommandé par Ben');
  });

  it('maps ProviderSubmission to Supabase row and back correctly', () => {
    const submission: ProviderSubmission = {
      id: 'sub-cloud-101',
      providerName: 'Garage Auto Express Nairobi',
      categoryId: 'transports',
      neighborhoodId: 'karen',
      phone: '+254 711 333 444',
      description: 'Mécanique express et révision 4x4 avant safari.',
      submitterName: 'Claire L.',
      submitterEmail: 'claire@wanadoo.fr',
      consentGiven: true,
      status: 'pending',
      createdAt: '2026-09-01T12:00:00.000Z'
    };

    const row = mapSubmissionToRow(submission);
    expect(row.id).toBe('sub-cloud-101');
    expect(row.provider_name).toBe('Garage Auto Express Nairobi');
    expect(row.category_id).toBe('transports');
    expect(row.neighborhood_id).toBe('karen');
    expect(row.status).toBe('pending');
    expect(row.consent_given).toBe(true);

    const restoredSubmission = mapRowToSubmission(row);
    expect(restoredSubmission.id).toBe(submission.id);
    expect(restoredSubmission.providerName).toBe(submission.providerName);
    expect(restoredSubmission.submitterName).toBe('Claire L.');
    expect(restoredSubmission.consentGiven).toBe(true);
    expect(restoredSubmission.status).toBe('pending');
  });

  it('strictly excludes non-existent PostgreSQL columns to prevent PostgREST 400 errors', () => {
    const providerRow = mapProviderToRow(sampleProvider) as any;
    // These columns were historically sent and caused Supabase PostgREST 400 Bad Request
    expect(providerRow.contributor_masked).toBeUndefined();
    expect(providerRow.contributor_revealed).toBeUndefined();
    expect(providerRow.source_badge).toBeUndefined();
    expect(providerRow.source_channel).toBeUndefined();
    expect(providerRow.source_uploaded_at).toBeUndefined();
    expect(providerRow.reliability_score).toBeUndefined();
    expect(providerRow.original_notes).toBeUndefined();
    expect(providerRow.source_sheet).toBeUndefined();

    // Source info must be encapsulated as a clean JSONB object
    expect(providerRow.source_info).toBeDefined();
    expect(providerRow.source_info.badge).toBe('Nairobi Accueil');

    const submission: ProviderSubmission = {
      id: 'sub-test-schema',
      providerName: 'Test Schema',
      categoryId: 'sante',
      neighborhoodId: 'westlands',
      phone: '+254 700 000 000',
      description: 'Test description',
      submitterName: 'Tester',
      submitterEmail: 'test@test.com',
      consentGiven: true,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    const submissionRow = mapSubmissionToRow(submission) as any;
    // Submissions table does not have updated_at column
    expect(submissionRow.updated_at).toBeUndefined();
    expect(submissionRow.id).toBe('sub-test-schema');
  });

  it('handles null, partial, or missing source_info with safe defaults', () => {
    const rawRow: SupabaseProviderRow = {
      id: 'p_raw_01',
      name: 'Dr. Martin',
      category_id: 'sante',
      neighborhood_id: 'gigiri',
      phone: '+254 711 000 111',
      source_info: null
    };

    const parsed = mapRowToProvider(rawRow);
    expect(parsed.name).toBe('Dr. Martin');
    expect(parsed.sourceInfo).toBeDefined();
    expect(parsed.sourceInfo?.badge).toBe('Nairobi Accueil');
    expect(parsed.sourceInfo?.reliabilityScore).toBe(5);
    expect(parsed.languages).toEqual(['Français', 'Anglais']);
    expect(parsed.tags).toEqual(['sante', 'gigiri']);
  });

  it('preserves special characters, French accents, apostrophes, and emojis', () => {
    const complexProvider: Provider = {
      id: 'artisan_ébé_01',
      name: "L'Ébéniste d'Art & Déco — Karen 🛠️",
      categoryId: 'fundis',
      neighborhoodId: 'karen',
      specialty: 'Rénovation de meubles anciens & marqueterie fine (100% fait-main)',
      description: "Travaux d'ébénisterie d'exception, vernis au tampon & restauration de mobilier colonial. Contact : l'ébéniste@bois-art.ke",
      phone: '+254 722 888 999',
      whatsapp: '+254722888999',
      email: "contact@l'ébéniste.co.ke",
      website: "https://www.l'ébéniste.co.ke",
      address: "Ngong Road, Karen, Près de l'école française",
      pricingNotes: "Devis gratuit sous 48h / Acompte de 30% à la commande",
      languages: ['Français', 'Anglais', 'Swahili'],
      isVerified: true,
      rating: 4.9,
      reviewsCount: 12,
      tags: ['fundis', 'karen', 'Ébéniste', 'Fait-main', 'Meubles d’exception'],
      sourceInfo: {
        badge: 'Nairobi Accueil',
        channel: 'nairobi_accueil_member',
        uploadedAt: '2026-09-13T16:00:00.000Z',
        contributorMasked: 'Hélène d’Orléans',
        contributorRevealed: 'Hélène d’Orléans (Présidente Commission Entraide)',
        reliabilityScore: 5,
        originalNotes: "Recommandé chaleureusement par l'équipe",
        sourceSheet: 'Annuaire Officiel'
      },
      createdAt: '2026-09-13T16:00:00.000Z'
    };

    const row = mapProviderToRow(complexProvider);
    expect(row.name).toBe("L'Ébéniste d'Art & Déco — Karen 🛠️");
    expect(row.languages).toContain('Swahili');

    const restored = mapRowToProvider(row);
    expect(restored.name).toBe("L'Ébéniste d'Art & Déco — Karen 🛠️");
    expect(restored.description).toContain("Travaux d'ébénisterie d'exception");
    expect(restored.sourceInfo?.contributorMasked).toBe('Hélène d’Orléans');
  });

  it('generates deterministic default identifiers when submission ID is absent', () => {
    const subWithoutId: ProviderSubmission = {
      providerName: 'Auto Repair Test',
      categoryId: 'transports',
      neighborhoodId: 'westlands',
      phone: '+254 700 111 222',
      description: 'Dépannage rapide',
      submitterName: 'Anonymous',
      submitterEmail: 'anon@test.com',
      consentGiven: true,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const row = mapSubmissionToRow(subWithoutId);
    expect(row.id).toMatch(/^sub-\d+/);
    expect(row.provider_name).toBe('Auto Repair Test');
  });
});
