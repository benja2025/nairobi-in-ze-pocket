import { describe, it, expect } from 'vitest';
import { MOCK_PROVIDERS } from '../data/mockProviders';
import { filterProviders } from '../utils/directoryFilter';

describe('directoryFilter Logic (TDD)', () => {
  it('should return all providers when no filters are applied', () => {
    const results = filterProviders(MOCK_PROVIDERS, 'all', 'all', '');
    expect(results.length).toBe(MOCK_PROVIDERS.length);
    expect(results.length).toBeGreaterThan(150); // Enriched dataset check
  });

  it('should filter providers strictly by neighborhood (e.g., Lavington)', () => {
    const results = filterProviders(MOCK_PROVIDERS, 'all', 'lavington', '');
    expect(results.every((p) => p.neighborhoodId === 'lavington')).toBe(true);
    expect(results.length).toBeGreaterThan(0);
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

  it('should filter providers by sport category (Sport & Fitness)', () => {
    const results = filterProviders(MOCK_PROVIDERS, 'sport', 'all', '');
    expect(results.length).toBeGreaterThanOrEqual(5);
    expect(results.every((p) => p.categoryId === 'sport')).toBe(true);
  });

  it('should filter providers by autres category (Services divers, démarches & soins)', () => {
    const results = filterProviders(MOCK_PROVIDERS, 'autres', 'all', '');
    expect(results.length).toBeGreaterThanOrEqual(10);
    expect(results.every((p) => p.categoryId === 'autres')).toBe(true);
  });

  it('should verify community source metadata and contributor attribution', () => {
    const withSource = MOCK_PROVIDERS.filter((p) => p.sourceInfo);
    expect(withSource.length).toBeGreaterThan(0);
    expect(withSource[0].sourceInfo?.contributorRevealed).toBeTruthy();
    expect(withSource[0].sourceInfo?.contributorMasked).toBeDefined();
  });

  it('should return empty list when search query yields no match', () => {
    const results = filterProviders(MOCK_PROVIDERS, 'all', 'all', 'nonexistentproviderxyz');
    expect(results.length).toBe(0);
  });
});

