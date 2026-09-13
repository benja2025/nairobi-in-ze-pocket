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
});
