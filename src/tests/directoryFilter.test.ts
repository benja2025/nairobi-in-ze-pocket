import { describe, it, expect } from 'vitest';
import { MOCK_PROVIDERS } from '../data/mockProviders';
import { filterProviders, normalizeText, normalizePhone } from '../utils/directoryFilter';

describe('directoryFilter Logic & High-Precision Search Engine (TDD)', () => {
  // 1. Base & Category Filtering
  it('should return all providers when no filters are applied', () => {
    const results = filterProviders(MOCK_PROVIDERS, 'all', 'all', '');
    expect(results.length).toBe(MOCK_PROVIDERS.length);
    expect(results.length).toBeGreaterThan(150);
  });

  it('should filter providers by category (e.g., sante)', () => {
    const results = filterProviders(MOCK_PROVIDERS, 'sante', 'all', '');
    expect(results.every((p) => p.categoryId === 'sante')).toBe(true);
  });

  it('should filter providers by it_tech category (IT & Réparation Mobile + Ordinateur)', () => {
    const results = filterProviders(MOCK_PROVIDERS, 'it_tech', 'all', '');
    expect(results.length).toBeGreaterThanOrEqual(3);
    expect(results.every((p) => p.categoryId === 'it_tech')).toBe(true);
  });

  // 2. Multi-Neighborhood Filtering
  it('should filter providers by a single neighborhood (e.g., Lavington)', () => {
    const results = filterProviders(MOCK_PROVIDERS, 'all', 'lavington', '');
    expect(results.every((p) => p.neighborhoodId === 'lavington')).toBe(true);
    expect(results.length).toBeGreaterThan(0);
  });

  it('should filter providers across MULTIPLE selected neighborhoods simultaneously (e.g. Westlands + Lavington)', () => {
    const results = filterProviders(MOCK_PROVIDERS, 'all', ['westlands', 'lavington'], '');
    expect(results.length).toBeGreaterThan(0);
    expect(
      results.every((p) => p.neighborhoodId === 'westlands' || p.neighborhoodId === 'lavington')
    ).toBe(true);

    // Verify both neighborhoods are represented in results
    const hasWestlands = results.some((p) => p.neighborhoodId === 'westlands');
    const hasLavington = results.some((p) => p.neighborhoodId === 'lavington');
    expect(hasWestlands).toBe(true);
    expect(hasLavington).toBe(true);
  });

  it('should filter providers across three selected neighborhoods (Gigiri + Karen + Westlands)', () => {
    const results = filterProviders(MOCK_PROVIDERS, 'all', ['gigiri', 'karen', 'westlands'], '');
    expect(results.length).toBeGreaterThan(0);
    expect(
      results.every((p) => ['gigiri', 'karen', 'westlands'].includes(p.neighborhoodId))
    ).toBe(true);
  });

  // 3. High-Precision Keyword Search: Accent & Case Insensitivity
  it('should find providers regardless of accents in search query (e.g., medecin -> Médecin, hopital -> Hôpital)', () => {
    const resultsWithoutAccents = filterProviders(MOCK_PROVIDERS, 'all', 'all', 'medecin');
    const resultsWithAccents = filterProviders(MOCK_PROVIDERS, 'all', 'all', 'médecin');
    expect(resultsWithoutAccents.length).toBeGreaterThan(0);
    expect(resultsWithoutAccents.length).toEqual(resultsWithAccents.length);

    const hopitalResults = filterProviders(MOCK_PROVIDERS, 'all', 'all', 'hopital');
    expect(hopitalResults.length).toBeGreaterThan(0);
    expect(hopitalResults.some((p) => p.name.includes('Hospital') || p.specialty.includes('Hopital') || p.description.includes('hopital'))).toBe(true);
  });

  it('should find providers regardless of uppercase/lowercase styling', () => {
    const lower = filterProviders(MOCK_PROVIDERS, 'all', 'all', 'dentiste');
    const upper = filterProviders(MOCK_PROVIDERS, 'all', 'all', 'DENTISTE');
    const mixed = filterProviders(MOCK_PROVIDERS, 'all', 'all', 'DeNtIsTe');
    expect(lower.length).toEqual(upper.length);
    expect(lower.length).toEqual(mixed.length);
  });

  // 4. Multi-Token / Multi-Word Query Precision
  it('should perform multi-token search finding providers matching all words across fields (e.g., "dr diderot")', () => {
    const results = filterProviders(MOCK_PROVIDERS, 'all', 'all', 'dr diderot');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].name).toContain('Dr Wai Lume');
  });

  it('should find IT specialists matching "mac sarit" or "starlink wifi"', () => {
    const macResults = filterProviders(MOCK_PROVIDERS, 'all', 'all', 'mac sarit');
    expect(macResults.length).toBeGreaterThan(0);
    expect(macResults[0].name).toContain('Mac & PC Clinic');

    const starlinkResults = filterProviders(MOCK_PROVIDERS, 'all', 'all', 'starlink wifi');
    expect(starlinkResults.length).toBeGreaterThan(0);
    expect(starlinkResults[0].name).toContain('David Tech Fundi');
  });

  // 5. Phone Number & Digital Queries
  it('should match phone queries with or without spaces and international prefix', () => {
    const resultsClean = filterProviders(MOCK_PROVIDERS, 'all', 'all', '722900111');
    const resultsFormatted = filterProviders(MOCK_PROVIDERS, 'all', 'all', '+254 722 900 111');
    expect(resultsClean.length).toBeGreaterThan(0);
    expect(resultsClean[0].name).toContain('Mac & PC Clinic');
    expect(resultsFormatted.length).toEqual(resultsClean.length);
  });

  // 6. Deep Search in Address & Contributor Notes
  it('should search into addresses, landmarks and shopping malls (e.g., "Yaya Centre", "Sarit")', () => {
    const yayaResults = filterProviders(MOCK_PROVIDERS, 'all', 'all', 'Yaya Centre');
    expect(yayaResults.length).toBeGreaterThan(0);
    expect(yayaResults.some((p) => p.address?.includes('Yaya') || p.tags.includes('Yaya Centre'))).toBe(true);
  });

  // 7. Combined Category + Multi-Neighborhood + Keyword Search
  it('should precisely combine category + multi-neighborhoods + keyword query', () => {
    const results = filterProviders(
      MOCK_PROVIDERS,
      'it_tech',
      ['westlands', 'lavington'],
      'reparation'
    );
    expect(results.length).toBeGreaterThanOrEqual(2);
    expect(results.every((p) => p.categoryId === 'it_tech')).toBe(true);
    expect(results.every((p) => ['westlands', 'lavington'].includes(p.neighborhoodId))).toBe(true);
  });

  // 8. Helper Normalization Tests
  it('should verify normalizeText strips all diacritics', () => {
    expect(normalizeText('Électricité Générateur Plomberie')).toBe('electricite generateur plomberie');
    expect(normalizeText('Hôpital Pédiatre Kinésithérapeute')).toBe('hopital pediatre kinesitherapeute');
    expect(normalizeText('Lang\'ata Karen Rúnda')).toBe('lang\'ata karen runda');
  });

  it('should verify normalizePhone strips all punctuation', () => {
    expect(normalizePhone('+254 712-345-678')).toBe('254712345678');
    expect(normalizePhone('020 725-776')).toBe('020725776');
  });

  // 9. Edge Cases & Non-matching queries
  it('should return empty list when search query yields no match', () => {
    const results = filterProviders(MOCK_PROVIDERS, 'all', 'all', 'nonexistentqueryxyz999');
    expect(results.length).toBe(0);
  });
});

