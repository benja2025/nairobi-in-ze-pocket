import { describe, it, expect, beforeEach } from 'vitest';
import { Provider, ProviderSubmission } from '../types';
import { MOCK_PROVIDERS } from '../data/mockProviders';
import { filterProviders } from '../utils/directoryFilter';

describe('Axe 1 - Diagnostic & Épreuve des Causes Racines de Non-Persistance', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  /* =========================================================================
     TEST 1 : Le piège de réinjection des seeds supprimés (Zombie Seeds Resurrection)
     ========================================================================= */
  it('CAUSE 1 : La logique missingSeeds réinjecte les fiches supprimées après rafraîchissement', () => {
    // Étape 1 : Chargement initial
    const initialList: Provider[] = [...MOCK_PROVIDERS];
    const targetToDelete = initialList[0];
    const initialCount = initialList.length;

    // Étape 2 : L'admin supprime la fiche et persiste dans localStorage
    const afterDelete = initialList.filter((p) => p.id !== targetToDelete.id);
    expect(afterDelete.length).toBe(initialCount - 1);
    localStorage.setItem('nairobi_managed_providers_v1', JSON.stringify(afterDelete));

    // Étape 3 : Simulation du rechargement de page (useState initializer dans App.tsx)
    const saved = localStorage.getItem('nairobi_managed_providers_v1');
    const parsed = JSON.parse(saved!);
    const existingIds = new Set(parsed.map((p: Provider) => p.id));
    
    // Reproduction exacte de la logique App.tsx :
    const missingSeeds = MOCK_PROVIDERS.filter((seed) => !existingIds.has(seed.id));
    const reloadedState = missingSeeds.length > 0 ? [...parsed, ...missingSeeds] : parsed;

    // ÉPREUVE DE LA CAUSE RACINE : La fiche supprimée est réapparue !
    expect(missingSeeds.some((s) => s.id === targetToDelete.id)).toBe(true);
    expect(reloadedState.length).toBe(initialCount); // Échec de la suppression permanente
    expect(reloadedState.some((p: Provider) => p.id === targetToDelete.id)).toBe(true);
  });

  /* =========================================================================
     TEST 2 : Le piège de mise à jour des seeds serveur ignorée par le cache client (Stale Seed Cache)
     ========================================================================= */
  it('CAUSE 2 : Un client avec localStorage ne reçoit pas les mises à jour de catégories ou descriptions opérées côté serveur', () => {
    const seedTarget = MOCK_PROVIDERS.find((p) => p.id === 'soins_17') || MOCK_PROVIDERS[0];
    
    // Le client a visité l'app avant le reclassement, sa version locale a categoryId: 'loisirs'
    const staleClientVersion: Provider = {
      ...seedTarget,
      categoryId: 'loisirs' as any // Ancienne catégorie
    };
    
    const clientSavedList = [staleClientVersion];
    localStorage.setItem('nairobi_managed_providers_v1', JSON.stringify(clientSavedList));

    // Côté serveur / code, le seed a été mis à jour vers 'sport'
    const serverUpdatedSeed = { ...seedTarget, categoryId: 'sport' as const };
    const SERVER_SEEDS = [serverUpdatedSeed];

    // Rechargement client
    const saved = localStorage.getItem('nairobi_managed_providers_v1');
    const parsed = JSON.parse(saved!);
    const existingIds = new Set(parsed.map((p: Provider) => p.id));
    
    // Comme parsed contient déjà 'soins_17', missingSeeds ne le détecte pas :
    const missingSeeds = SERVER_SEEDS.filter((seed) => !existingIds.has(seed.id));
    const reloadedState = missingSeeds.length > 0 ? [...parsed, ...missingSeeds] : parsed;

    // ÉPREUVE : Le client reste bloqué sur l'ancienne catégorie obsolète
    const resolvedItem = reloadedState.find((p: Provider) => p.id === seedTarget.id);
    expect(resolvedItem.categoryId).toBe('loisirs'); // Ne reçoit pas 'sport'
    expect(resolvedItem.categoryId).not.toBe(serverUpdatedSeed.categoryId);
  });

  /* =========================================================================
     TEST 3 : Déduplication composite et conflit de nom/catégorie (Name Collision Drop)
     ========================================================================= */
  it('CAUSE 3 : La déduplication composite par nom-catégorie ignore une modification si la casse ou les espaces varient', () => {
    const baseProvider: Provider = {
      id: 'prov-1',
      name: 'Dr Dubois Pédiatre',
      categoryId: 'sante',
      neighborhoodId: 'lavington',
      specialty: 'Pédiatrie',
      description: 'Consultations quotidiennes',
      phone: '+254 700 111 222',
      languages: ['Français'],
      isVerified: true,
      rating: 4.9,
      reviewsCount: 10,
      tags: ['sante']
    };

    // Une soumission communautaire propose une mise à jour d'adresse et de téléphone
    const submissionProvider: Provider = {
      id: 'sub-dubois-new',
      name: 'Dr Dubois Pédiatre ', // Espace insidieux en fin de nom
      categoryId: 'sante',
      neighborhoodId: 'lavington',
      specialty: 'Pédiatrie Générale & Urgences',
      description: 'NOUVELLE ADRESSE : Lavington Mall 2nd Floor',
      phone: '+254 711 999 888', // Nouveau téléphone
      languages: ['Français', 'Anglais'],
      isVerified: false,
      rating: 5.0,
      reviewsCount: 1,
      tags: ['sante']
    };

    // Algorithme de fusion DirectoryPage :
    const baseList = [baseProvider];
    const communityProviders = [submissionProvider];
    const combined = [...baseList, ...communityProviders];
    
    const seen = new Set<string>();
    const deduplicated = combined.filter((p) => {
      const key = `${p.name.toLowerCase().trim()}-${p.categoryId}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // ÉPREUVE : La déduplication a conservé la version originale baseProvider et écrasé silencieusement la mise à jour !
    expect(deduplicated.length).toBe(1);
    expect(deduplicated[0].phone).toBe('+254 700 111 222'); // Ancien téléphone conservé
    expect(deduplicated[0].description).not.toContain('NOUVELLE ADRESSE'); // La recommandation n'apparaît pas
  });

  /* =========================================================================
     TEST 4 : Isolation stricte du LocalStorage (Absence de base synchronisée)
     ========================================================================= */
  it('CAUSE 4 : Le LocalStorage ne synchronise pas les données hors du navigateur courant', () => {
    // Navigateur A : L'utilisateur soumet une recommandation
    const submission: ProviderSubmission = {
      id: 'sub-device-a-1',
      providerName: 'Safari Kenya Tours',
      categoryId: 'loisirs',
      neighborhoodId: 'karen',
      phone: '+254 799 888 777',
      description: 'Agence safari locale recommandée',
      submitterName: 'Sophie M.',
      submitterEmail: 'sophie@gmail.com',
      consentGiven: true,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    // Écriture sur l'environnement A
    localStorage.setItem('nairobi_provider_submissions', JSON.stringify([submission]));
    expect(localStorage.getItem('nairobi_provider_submissions')).toBeTruthy();

    // Simulation de l'environnement B (autre appareil / nouvelle session sans sync cloud)
    const simulatedDeviceB_LocalStorage: Record<string, string> = {};
    const dataOnDeviceB = simulatedDeviceB_LocalStorage['nairobi_provider_submissions'];

    // ÉPREUVE : L'appareil B ne voit absolument rien
    expect(dataOnDeviceB).toBeUndefined();
  });

  /* =========================================================================
     TEST 5 : Perte de données silencieuse en cas d'erreur de Quota ou Storage indisponible
     ========================================================================= */
  it('CAUSE 5 : En cas de Storage indisponible ou corrompu, les données restent éphémères en mémoire et disparaissent au refresh', () => {
    let memoryProviders: Provider[] = [...MOCK_PROVIDERS];
    
    // Simulation d'un échec de quota LocalStorage
    const faultyStorage = {
      setItem: () => {
        throw new Error('QuotaExceededError');
      },
      getItem: () => null
    };

    const newProvider: Provider = {
      id: 'prov-lost-1',
      name: 'Perdu Au Refresh',
      categoryId: 'autres',
      neighborhoodId: 'westlands',
      specialty: 'Service Test',
      description: 'Cette fiche sera perdue si le storage échoue',
      phone: '+254 700 000 001',
      languages: ['Français'],
      isVerified: false,
      rating: 5.0,
      reviewsCount: 1,
      tags: ['autres']
    };

    // Mutation du state React en mémoire
    memoryProviders = [newProvider, ...memoryProviders];
    expect(memoryProviders.some((p) => p.id === 'prov-lost-1')).toBe(true);

    // Tentative de sauvegarde protégée par try/catch
    try {
      faultyStorage.setItem();
    } catch {
      // Le catch ignore silencieusement l'échec
    }

    // Simulation du rechargement de page (initialisation à partir du storage qui a échoué)
    const reloadedAfterCrash = faultyStorage.getItem() ? JSON.parse(faultyStorage.getItem()!) : MOCK_PROVIDERS;

    // ÉPREUVE : La donnée ajoutée a disparu
    expect(reloadedAfterCrash.some((p: Provider) => p.id === 'prov-lost-1')).toBe(false);
  });
});
