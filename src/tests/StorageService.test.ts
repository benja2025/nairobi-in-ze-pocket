import { describe, it, expect, beforeEach } from 'vitest';
import {
  loadManagedProviders,
  saveCustomProvider,
  updateManagedProvider,
  deleteManagedProvider,
  resetStorageToDefaults,
  loadSubmissions,
  saveSubmission,
  approveSubmissionInStorage,
  rejectSubmissionInStorage,
  SCHEMA_VERSION
} from '../services/storageService';
import { isSupabaseConfigured, fetchRemoteProviders, syncProviderToCloud, submitRecommendationToCloud } from '../services/supabaseClient';
import { Provider, ProviderSubmission } from '../types';
import { MOCK_PROVIDERS } from '../data/mockProviders';

describe('Phase 1 & Phase 2 : StorageService & Supabase Hybrid Architecture Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  /* =========================================================================
     1. INITIALISATION & SCHEMA VERSION
     ========================================================================= */
  it('initializes clean state and sets SCHEMA_VERSION = 2', () => {
    const providers = loadManagedProviders();
    expect(providers.length).toBe(MOCK_PROVIDERS.length);

    const meta = JSON.parse(localStorage.getItem('nairobi_storage_meta_v2') || '{}');
    expect(meta.schemaVersion).toBe(SCHEMA_VERSION);
    expect(meta.lastReconciledAt).toBeTruthy();
  });

  /* =========================================================================
     2. ÉLIMINATION DES SEEDS ZOMBIES (Tombstones permanent deletion)
     ========================================================================= */
  it('permanently deletes a seed provider and ensures it NEVER resurrects on reload', () => {
    const seedToDelete = MOCK_PROVIDERS[0];
    const initialCount = MOCK_PROVIDERS.length;

    // Delete
    const afterDelete = deleteManagedProvider(seedToDelete.id);
    expect(afterDelete.length).toBe(initialCount - 1);
    expect(afterDelete.some((p) => p.id === seedToDelete.id)).toBe(false);

    // Verify tombstone was stored in localStorage
    const tombstones = JSON.parse(localStorage.getItem('nairobi_deleted_provider_ids_v2') || '[]');
    expect(tombstones).toContain(seedToDelete.id);

    // Simulate page reload (calling loadManagedProviders from scratch)
    const reloaded = loadManagedProviders();
    expect(reloaded.length).toBe(initialCount - 1);
    expect(reloaded.some((p) => p.id === seedToDelete.id)).toBe(false);
  });

  /* =========================================================================
     3. PERSISTANCE DES MODIFICATIONS DE SEEDS (Overrides)
     ========================================================================= */
  it('persists edits on seed providers without breaking the link or losing data on reload', () => {
    const seedToEdit = MOCK_PROVIDERS[1];
    const updated: Provider = {
      ...seedToEdit,
      name: 'Nom Modifié Par Admin',
      phone: '+254 799 111 222',
      description: 'Nouvelle description mise à jour'
    };

    const afterUpdate = updateManagedProvider(updated);
    const found = afterUpdate.find((p) => p.id === seedToEdit.id);
    expect(found?.name).toBe('Nom Modifié Par Admin');
    expect(found?.phone).toBe('+254 799 111 222');

    // Simulate page reload
    const reloaded = loadManagedProviders();
    const reloadedFound = reloaded.find((p) => p.id === seedToEdit.id);
    expect(reloadedFound?.name).toBe('Nom Modifié Par Admin');
    expect(reloadedFound?.phone).toBe('+254 799 111 222');
    expect(reloadedFound?.description).toBe('Nouvelle description mise à jour');
  });

  /* =========================================================================
     4. CRÉATION DE NOUVELLES FICHES CUSTOM
     ========================================================================= */
  it('creates and persists new custom providers at the top of the list', () => {
    const custom: Provider = {
      id: 'custom-prov-999',
      name: 'Nairobi Gourmet Catering',
      categoryId: 'restaurant',
      neighborhoodId: 'karen',
      specialty: 'Traiteur gastronomique français',
      description: 'Buffets et réceptions privées à Karen',
      phone: '+254 722 555 444',
      languages: ['Français', 'Anglais'],
      isVerified: true,
      rating: 5.0,
      reviewsCount: 2,
      tags: ['restaurant', 'karen']
    };

    const afterSave = saveCustomProvider(custom);
    expect(afterSave.some((p) => p.id === 'custom-prov-999')).toBe(true);

    // Simulate page reload
    const reloaded = loadManagedProviders();
    expect(reloaded.some((p) => p.id === 'custom-prov-999')).toBe(true);
    expect(reloaded[0].id).toBe('custom-prov-999'); // Priorité en tête de liste
  });

  /* =========================================================================
     5. WORKFLOW DE SOUMISSION ET PROMOTION EN MODÉRATION
     ========================================================================= */
  it('handles submission creation, approval and promotion to active directory seamlessly', () => {
    const newSubmission: ProviderSubmission = {
      id: 'sub-test-flow-1',
      providerName: 'Chauffeur Alex Nairobi',
      categoryId: 'transports',
      neighborhoodId: 'westlands',
      phone: '+254 733 444 555',
      description: 'Chauffeur privé ponctuel et prudent',
      submitterName: 'Julie B.',
      submitterEmail: 'julie@gmail.com',
      consentGiven: true,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    // 1. Add submission
    const subs = saveSubmission(newSubmission);
    expect(subs.some((s) => s.id === 'sub-test-flow-1')).toBe(true);

    // 2. Approve submission
    const approval = approveSubmissionInStorage('sub-test-flow-1');
    expect(approval.promotedProvider).toBeDefined();
    expect(approval.promotedProvider?.name).toBe('Chauffeur Alex Nairobi');

    // 3. Verify directory now includes promoted provider
    const providers = loadManagedProviders();
    expect(providers.some((p) => p.name === 'Chauffeur Alex Nairobi')).toBe(true);
  });

  /* =========================================================================
     6. RESET TO DEFAULTS
     ========================================================================= */
  it('resets all overrides and deletions back to clean default seeds', () => {
    // Modify and delete
    deleteManagedProvider(MOCK_PROVIDERS[0].id);
    updateManagedProvider({ ...MOCK_PROVIDERS[1], name: 'Overridden' });

    // Reset
    const restored = resetStorageToDefaults();
    expect(restored.length).toBe(MOCK_PROVIDERS.length);
    expect(restored[0].id).toBe(MOCK_PROVIDERS[0].id);
    expect(restored[1].name).toBe(MOCK_PROVIDERS[1].name);
  });

  /* =========================================================================
     7. PHASE 2 : SUPABASE CLIENT OFFLINE-FIRST FALLBACK
     ========================================================================= */
  it('gracefully handles unconfigured/offline Supabase sync without throwing errors', async () => {
    // When no env vars are set, isSupabaseConfigured is false
    expect(typeof isSupabaseConfigured).toBe('boolean');

    const fetchResult = await fetchRemoteProviders();
    expect(fetchResult.isOffline).toBe(true);

    const syncResult = await syncProviderToCloud(MOCK_PROVIDERS[0]);
    expect(syncResult.isOffline).toBe(true);

    const submitResult = await submitRecommendationToCloud({
      id: 'sub-cloud-1',
      providerName: 'Test',
      categoryId: 'sante',
      neighborhoodId: 'gigiri',
      phone: '123',
      description: 'Test',
      submitterName: 'Test',
      submitterEmail: 'test@gmail.com',
      consentGiven: true,
      status: 'pending',
      createdAt: new Date().toISOString()
    });
    expect(submitResult.isOffline).toBe(true);
  });
});
