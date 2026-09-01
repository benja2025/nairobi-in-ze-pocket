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

  it('should verify community source metadata and contributor attribution', () => {
    const withSource = MOCK_PROVIDERS.filter((p) => p.sourceInfo);
    expect(withSource.length).toBeGreaterThan(0);
    expect(withSource[0].sourceInfo?.contributorRevealed).toBe('Marie Élodie C.');
    expect(withSource[0].sourceInfo?.contributorMasked).toBe('Recommandé par un membre');
  });

  it('should return empty list when search query yields no match', () => {
    const results = filterProviders(MOCK_PROVIDERS, 'all', 'all', 'nonexistentproviderxyz');
    expect(results.length).toBe(0);
  });
});

