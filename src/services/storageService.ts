import { Provider, ProviderSubmission, TelegramWaitlistEntry, ModeratorApplication } from '../types';
import { MOCK_PROVIDERS } from '../data/mockProviders';

export const SCHEMA_VERSION = 2;

const STORAGE_KEYS = {
  SCHEMA_META: 'nairobi_storage_meta_v2',
  DELETED_IDS: 'nairobi_deleted_provider_ids_v2',
  CUSTOM_PROVIDERS: 'nairobi_custom_providers_v2',
  OVERRIDES: 'nairobi_provider_overrides_v2',
  SUBMISSIONS: 'nairobi_provider_submissions_v2',
  WAITLIST: 'nairobi_telegram_waitlist_v2',
  MODERATOR_APPS: 'nairobi_moderator_applications_v2',
  // Legacy key for backwards compatibility migration
  LEGACY_MANAGED: 'nairobi_managed_providers_v1',
  LEGACY_SUBMISSIONS: 'nairobi_provider_submissions',
  LEGACY_WAITLIST: 'nairobi_telegram_waitlist',
  LEGACY_MODERATORS: 'nairobi_moderator_applications'
};

export interface StorageMeta {
  schemaVersion: number;
  lastReconciledAt: string;
}

// Helper for safe localStorage reads
function safeGetItem<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.warn(`[Nairobi Storage] Failed to read ${key}:`, e);
    return defaultValue;
  }
}

// Helper for safe localStorage writes
function safeSetItem<T>(key: string, value: T): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.error(`[Nairobi Storage] Failed to write ${key}:`, e);
    return false;
  }
}

/**
 * Migration from legacy v1 flat array storage to v2 deterministic architecture
 */
function migrateLegacyStorage(): void {
  try {
    const meta = safeGetItem<StorageMeta | null>(STORAGE_KEYS.SCHEMA_META, null);
    if (meta && meta.schemaVersion >= SCHEMA_VERSION) {
      return; // Already migrated
    }

    // Check if legacy managed providers exist
    const legacyRaw = localStorage.getItem(STORAGE_KEYS.LEGACY_MANAGED);
    if (legacyRaw) {
      const parsedLegacy: Provider[] = JSON.parse(legacyRaw);
      if (Array.isArray(parsedLegacy) && parsedLegacy.length > 0) {
        const seedIdSet = new Set(MOCK_PROVIDERS.map((p) => p.id));
        const customItems: Provider[] = [];
        const overrides: Record<string, Partial<Provider>> = {};

        for (const item of parsedLegacy) {
          if (!seedIdSet.has(item.id)) {
            // It's a newly created custom provider
            customItems.push(item);
          } else {
            // Check if it was modified compared to default seed
            const orig = MOCK_PROVIDERS.find((p) => p.id === item.id);
            if (orig && (orig.name !== item.name || orig.phone !== item.phone || orig.description !== item.description || orig.categoryId !== item.categoryId)) {
              overrides[item.id] = item;
            }
          }
        }

        if (customItems.length > 0) {
          safeSetItem(STORAGE_KEYS.CUSTOM_PROVIDERS, customItems);
        }
        if (Object.keys(overrides).length > 0) {
          safeSetItem(STORAGE_KEYS.OVERRIDES, overrides);
        }
      }
    }

    // Migrate legacy submissions if new key is empty
    const legacySubs = localStorage.getItem(STORAGE_KEYS.LEGACY_SUBMISSIONS);
    if (legacySubs && !localStorage.getItem(STORAGE_KEYS.SUBMISSIONS)) {
      localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, legacySubs);
    }

    // Migrate legacy waitlist
    const legacyWait = localStorage.getItem(STORAGE_KEYS.LEGACY_WAITLIST);
    if (legacyWait && !localStorage.getItem(STORAGE_KEYS.WAITLIST)) {
      localStorage.setItem(STORAGE_KEYS.WAITLIST, legacyWait);
    }

    // Migrate legacy moderator apps
    const legacyMods = localStorage.getItem(STORAGE_KEYS.LEGACY_MODERATORS);
    if (legacyMods && !localStorage.getItem(STORAGE_KEYS.MODERATOR_APPS)) {
      localStorage.setItem(STORAGE_KEYS.MODERATOR_APPS, legacyMods);
    }

    // Record v2 schema meta
    safeSetItem<StorageMeta>(STORAGE_KEYS.SCHEMA_META, {
      schemaVersion: SCHEMA_VERSION,
      lastReconciledAt: new Date().toISOString()
    });
  } catch (e) {
    console.warn('[Nairobi Storage] Migration warning:', e);
  }
}

/**
 * Loads the complete reconciled list of providers.
 * Merges: MOCK_PROVIDERS (seeds) - Deleted IDs + Overrides + Custom Providers
 */
export function loadManagedProviders(): Provider[] {
  migrateLegacyStorage();

  const deletedIds = new Set(safeGetItem<string[]>(STORAGE_KEYS.DELETED_IDS, []));
  const overrides = safeGetItem<Record<string, Partial<Provider>>>(STORAGE_KEYS.OVERRIDES, {});
  const customProviders = safeGetItem<Provider[]>(STORAGE_KEYS.CUSTOM_PROVIDERS, []);

  // 1. Process default seed providers (filter out tombstones and apply overrides)
  const activeSeeds: Provider[] = [];
  for (const seed of MOCK_PROVIDERS) {
    if (deletedIds.has(seed.id)) {
      continue; // Excluded by tombstone
    }
    const override = overrides[seed.id];
    if (override) {
      activeSeeds.push({ ...seed, ...override });
    } else {
      activeSeeds.push(seed);
    }
  }

  // 2. Custom created providers (guarantee unique deterministic IDs)
  const seenIds = new Set<string>();
  const result: Provider[] = [];

  // Custom providers take top priority
  for (const p of customProviders) {
    if (!deletedIds.has(p.id) && !seenIds.has(p.id)) {
      seenIds.add(p.id);
      result.push(p);
    }
  }

  // Then active seed providers
  for (const p of activeSeeds) {
    if (!seenIds.has(p.id)) {
      seenIds.add(p.id);
      result.push(p);
    }
  }

  return result;
}

/**
 * Creates or inserts a new provider into custom storage
 */
export function saveCustomProvider(newProvider: Provider): Provider[] {
  const customProviders = safeGetItem<Provider[]>(STORAGE_KEYS.CUSTOM_PROVIDERS, []);
  
  // Remove if already exists with same ID
  const filtered = customProviders.filter((p) => p.id !== newProvider.id);
  const nextCustom = [newProvider, ...filtered];
  safeSetItem(STORAGE_KEYS.CUSTOM_PROVIDERS, nextCustom);

  // Remove from deleted tombstones if it was previously deleted
  const deletedIds = safeGetItem<string[]>(STORAGE_KEYS.DELETED_IDS, []);
  if (deletedIds.includes(newProvider.id)) {
    safeSetItem(STORAGE_KEYS.DELETED_IDS, deletedIds.filter((id) => id !== newProvider.id));
  }

  return loadManagedProviders();
}

/**
 * Updates an existing provider (records override if seed, or updates custom item)
 */
export function updateManagedProvider(updated: Provider): Provider[] {
  const seedItem = MOCK_PROVIDERS.find((p) => p.id === updated.id);
  
  if (seedItem) {
    // It's a seed provider: store modification in overrides
    const overrides = safeGetItem<Record<string, Partial<Provider>>>(STORAGE_KEYS.OVERRIDES, {});
    overrides[updated.id] = updated;
    safeSetItem(STORAGE_KEYS.OVERRIDES, overrides);
  } else {
    // It's a custom provider: update in custom list
    const customProviders = safeGetItem<Provider[]>(STORAGE_KEYS.CUSTOM_PROVIDERS, []);
    const exists = customProviders.some((p) => p.id === updated.id);
    const nextCustom = exists
      ? customProviders.map((p) => (p.id === updated.id ? updated : p))
      : [updated, ...customProviders];
    safeSetItem(STORAGE_KEYS.CUSTOM_PROVIDERS, nextCustom);
  }

  return loadManagedProviders();
}

/**
 * Deletes a provider permanently (records tombstone so seeds never resurrect)
 */
export function deleteManagedProvider(id: string): Provider[] {
  // 1. Add to tombstone deleted IDs
  const deletedIds = safeGetItem<string[]>(STORAGE_KEYS.DELETED_IDS, []);
  if (!deletedIds.includes(id)) {
    safeSetItem(STORAGE_KEYS.DELETED_IDS, [...deletedIds, id]);
  }

  // 2. Remove from custom providers if present
  const customProviders = safeGetItem<Provider[]>(STORAGE_KEYS.CUSTOM_PROVIDERS, []);
  if (customProviders.some((p) => p.id === id)) {
    safeSetItem(STORAGE_KEYS.CUSTOM_PROVIDERS, customProviders.filter((p) => p.id !== id));
  }

  // 3. Remove from overrides if present
  const overrides = safeGetItem<Record<string, Partial<Provider>>>(STORAGE_KEYS.OVERRIDES, {});
  if (overrides[id]) {
    delete overrides[id];
    safeSetItem(STORAGE_KEYS.OVERRIDES, overrides);
  }

  return loadManagedProviders();
}

/**
 * Resets all overrides, custom additions, and tombstones back to clean defaults
 */
export function resetStorageToDefaults(): Provider[] {
  try {
    localStorage.removeItem(STORAGE_KEYS.DELETED_IDS);
    localStorage.removeItem(STORAGE_KEYS.CUSTOM_PROVIDERS);
    localStorage.removeItem(STORAGE_KEYS.OVERRIDES);
    localStorage.removeItem(STORAGE_KEYS.LEGACY_MANAGED);
    safeSetItem<StorageMeta>(STORAGE_KEYS.SCHEMA_META, {
      schemaVersion: SCHEMA_VERSION,
      lastReconciledAt: new Date().toISOString()
    });
  } catch (e) {
    console.warn('[Nairobi Storage] Reset error:', e);
  }
  return [...MOCK_PROVIDERS];
}

/* =========================================================================
   SUBMISSIONS REPOSITORY
   ========================================================================= */

const INITIAL_SUBMISSIONS: ProviderSubmission[] = [
  {
    id: 'sub-sample-1',
    providerName: 'Samuel Électricien Fundi',
    categoryId: 'fundis',
    neighborhoodId: 'westlands',
    phone: '+254 711 222 333',
    description: "Dépannage rapide d'un inverter solaire un dimanche soir.",
    submitterName: 'Claire V.',
    submitterEmail: 'claire@gmail.com',
    consentGiven: true,
    status: 'pending',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    id: 'sub-sample-2',
    providerName: 'Dr. Anne-Sophie Dupont (Dentiste)',
    categoryId: 'sante',
    neighborhoodId: 'gigiri',
    phone: '+254 722 888 999',
    description: 'Cabinet dentaire moderne à Village Market, parfait avec les enfants.',
    submitterName: 'Marc L.',
    submitterEmail: 'marc.l@wanadoo.fr',
    consentGiven: true,
    status: 'pending',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
  }
];

export function loadSubmissions(): ProviderSubmission[] {
  migrateLegacyStorage();
  return safeGetItem<ProviderSubmission[]>(STORAGE_KEYS.SUBMISSIONS, INITIAL_SUBMISSIONS);
}

export function saveSubmission(newSub: ProviderSubmission): ProviderSubmission[] {
  const current = loadSubmissions();
  const next = [newSub, ...current.filter((s) => s.id !== newSub.id)];
  safeSetItem(STORAGE_KEYS.SUBMISSIONS, next);
  return next;
}

export function approveSubmissionInStorage(id: string): { submissions: ProviderSubmission[]; promotedProvider?: Provider } {
  const current = loadSubmissions();
  let approvedSub: ProviderSubmission | undefined;

  const nextSubmissions = current.map((s) => {
    if (s.id === id) {
      approvedSub = s;
      return { ...s, status: 'approved' as const };
    }
    return s;
  });

  safeSetItem(STORAGE_KEYS.SUBMISSIONS, nextSubmissions);

  if (approvedSub) {
    const sub = approvedSub;
    const promoted: Provider = {
      id: sub.id || `prov-appr-${Date.now()}`,
      name: sub.providerName,
      categoryId: sub.categoryId,
      neighborhoodId: sub.neighborhoodId,
      specialty: sub.description.length > 55 ? `${sub.description.slice(0, 52)}...` : sub.description,
      description: sub.description,
      phone: sub.phone,
      whatsapp: /^[+]?[0-9\s()-]{6,}$/.test((sub.phone || '').trim()) ? sub.phone : undefined,
      languages: ['Français', 'Anglais'],
      isVerified: true,
      rating: 5.0,
      reviewsCount: 1,
      tags: [sub.categoryId, sub.neighborhoodId, 'Recommandation Communauté'],
      sourceInfo: {
        badge: 'Nairobi Accueil',
        channel: 'direct_submission',
        uploadedAt: sub.createdAt,
        contributorMasked: `Recommandé par ${sub.submitterName ? sub.submitterName.split(' ')[0] : 'un membre'}`,
        contributorRevealed: `${sub.submitterName || 'Membre'} (${sub.submitterEmail || 'Vérifié'})`,
        reliabilityScore: 5,
        originalNotes: sub.description,
        sourceSheet: 'Recommandations Communauté'
      },
      createdAt: sub.createdAt
    };

    saveCustomProvider(promoted);
    return { submissions: nextSubmissions, promotedProvider: promoted };
  }

  return { submissions: nextSubmissions };
}

export function rejectSubmissionInStorage(id: string): ProviderSubmission[] {
  const current = loadSubmissions();
  const next = current.map((s) => (s.id === id ? { ...s, status: 'rejected' as const } : s));
  safeSetItem(STORAGE_KEYS.SUBMISSIONS, next);
  return next;
}

/* =========================================================================
   WAITLIST & MODERATOR REPOSITORIES
   ========================================================================= */

const INITIAL_WAITLIST: TelegramWaitlistEntry[] = [
  {
    id: 'waitlist-demo-1',
    name: 'Élodie Bertrand',
    telegramHandle: '@elodie_nbo',
    source: 'Modal PocketBot Telegram',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
  },
  {
    id: 'waitlist-demo-2',
    name: 'Julien Morel',
    telegramHandle: '+254 712 345 678',
    source: 'Modal PocketBot Telegram',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
  }
];

const INITIAL_MODERATORS: ModeratorApplication[] = [
  {
    id: 'mod-app-sample-1',
    fullName: 'Stéphane Renault',
    email: 's.renault@gmail.com',
    phoneOrWhatsapp: '+254 728 111 222',
    neighborhood: 'Gigiri / Runda',
    motivation: 'Expatrié depuis 4 ans, je connais bien les fundis et artisans fiables du secteur nord de Nairobi.',
    status: 'pending',
    createdAt: new Date(Date.now() - 3600000 * 36).toISOString()
  }
];

export function loadWaitlist(): TelegramWaitlistEntry[] {
  return safeGetItem<TelegramWaitlistEntry[]>(STORAGE_KEYS.WAITLIST, INITIAL_WAITLIST);
}

export function saveWaitlistEntry(entry: TelegramWaitlistEntry): TelegramWaitlistEntry[] {
  const current = loadWaitlist();
  const next = [entry, ...current.filter((e) => e.id !== entry.id)];
  safeSetItem(STORAGE_KEYS.WAITLIST, next);
  return next;
}

export function deleteWaitlistEntryFromStorage(id: string): TelegramWaitlistEntry[] {
  const current = loadWaitlist();
  const next = current.filter((e) => e.id !== id);
  safeSetItem(STORAGE_KEYS.WAITLIST, next);
  return next;
}

export function loadModeratorApplications(): ModeratorApplication[] {
  return safeGetItem<ModeratorApplication[]>(STORAGE_KEYS.MODERATOR_APPS, INITIAL_MODERATORS);
}

export function saveModeratorApplication(app: ModeratorApplication): ModeratorApplication[] {
  const current = loadModeratorApplications();
  const next = [app, ...current.filter((a) => a.id !== app.id)];
  safeSetItem(STORAGE_KEYS.MODERATOR_APPS, next);
  return next;
}

export function deleteModeratorApplicationFromStorage(id: string): ModeratorApplication[] {
  const current = loadModeratorApplications();
  const next = current.filter((a) => a.id !== id);
  safeSetItem(STORAGE_KEYS.MODERATOR_APPS, next);
  return next;
}
