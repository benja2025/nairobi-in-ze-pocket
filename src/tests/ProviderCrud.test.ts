import { describe, it, expect } from 'vitest';
import { Provider } from '../types';
import { MOCK_PROVIDERS } from '../data/mockProviders';
import { filterProviders } from '../utils/directoryFilter';

describe('Admin Provider Visual CRUD & Persistence logic', () => {
  it('should support creating a new custom provider and filtering it', () => {
    const customProvider: Provider = {
      id: 'provider-custom-12345',
      name: 'Nairobi Tech Repair Express',
      categoryId: 'it_tech',
      neighborhoodId: 'westlands',
      specialty: 'Réparation MacBook & iPhone express',
      description: 'Technicien certifié Apple avec pièces d\'origine.',
      phone: '+254 711 999 888',
      whatsapp: '+254711999888',
      languages: ['Français', 'Anglais'],
      isVerified: true,
      rating: 5.0,
      reviewsCount: 4,
      tags: ['it_tech', 'westlands', 'MacBook', 'iPhone', 'Express'],
      createdAt: new Date().toISOString()
    };

    const providerList: Provider[] = [customProvider, ...MOCK_PROVIDERS];

    // Search by name
    const matchesName = filterProviders(providerList, 'all', 'all', 'Tech Repair');
    expect(matchesName.length).toBeGreaterThanOrEqual(1);
    expect(matchesName[0].id).toBe('provider-custom-12345');

    // Search by tag / keyword
    const matchesTag = filterProviders(providerList, 'it_tech', ['westlands'], 'macbook');
    expect(matchesTag.some((p) => p.id === 'provider-custom-12345')).toBe(true);
    expect(matchesTag[0].categoryId).toBe('it_tech');
  });

  it('should support updating an existing provider', () => {
    const baseList: Provider[] = [...MOCK_PROVIDERS];
    const target = baseList[0];
    const updated: Provider = {
      ...target,
      name: 'Cabinet Médical Mis à Jour',
      phone: '+254 700 000 000'
    };

    const modifiedList = baseList.map((p) => (p.id === target.id ? updated : p));
    const found = modifiedList.find((p) => p.id === target.id);
    expect(found?.name).toBe('Cabinet Médical Mis à Jour');
    expect(found?.phone).toBe('+254 700 000 000');
  });

  it('should prioritize edited managed provider over raw community submissions', () => {
    const rawSubmissionProvider: Provider = {
      id: 'sub-sample-ben',
      name: 'Ben',
      categoryId: 'it_tech',
      neighborhoodId: 'gigiri',
      specialty: 'Ancienne version non modifiée',
      description: 'Ancienne version non modifiée',
      phone: '+254 700 000 000',
      languages: ['Français'],
      isVerified: false,
      rating: 5.0,
      reviewsCount: 1,
      tags: ['it_tech'],
      createdAt: new Date().toISOString()
    };

    const editedManagedProvider: Provider = {
      id: 'it_tech_ben',
      name: 'Ben',
      categoryId: 'it_tech',
      neighborhoodId: 'gigiri',
      specialty: 'Version Mise à Jour par Admin',
      description: 'Consultant Web & Marketing Digital certifié',
      phone: '+254 712 999 888',
      languages: ['Français', 'Anglais'],
      isVerified: true,
      rating: 5.0,
      reviewsCount: 5,
      tags: ['it_tech', 'Web Design'],
      createdAt: new Date().toISOString()
    };

    // Deduplication rule: baseList (managed) first, then raw submissions
    const combined = [editedManagedProvider, rawSubmissionProvider];
    const seen = new Set<string>();
    const deduplicated = combined.filter((p) => {
      const key = `${p.name.toLowerCase().trim()}-${p.categoryId}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    expect(deduplicated.length).toBe(1);
    expect(deduplicated[0].specialty).toBe('Version Mise à Jour par Admin');
    expect(deduplicated[0].phone).toBe('+254 712 999 888');
    expect(deduplicated[0].isVerified).toBe(true);
  });
});
