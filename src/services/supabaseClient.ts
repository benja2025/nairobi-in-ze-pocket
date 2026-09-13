import { createClient, SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';
import { Provider, ProviderSubmission, CategoryId, NeighborhoodId, SourceBadge, SourceChannel } from '../types';

/**
 * Environment configuration for Supabase
 */
const env = (import.meta as any).env || {};
const SUPABASE_URL: string = env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY: string = env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured: boolean = Boolean(
  SUPABASE_URL && 
  SUPABASE_ANON_KEY && 
  SUPABASE_URL !== 'https://your-project-id.supabase.co' &&
  !SUPABASE_URL.includes('placeholder')
);

// Official Supabase client instance
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      },
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      }
    })
  : null;

export interface SyncResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  isOffline: boolean;
}

// Database Row Types (PostgreSQL snake_case)
export interface SupabaseProviderRow {
  id: string;
  name: string;
  category_id: string;
  neighborhood_id: string;
  specialty?: string;
  description?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  address?: string;
  languages?: string[];
  pricing_notes?: string;
  is_verified?: boolean;
  rating?: number;
  reviews_count?: number;
  tags?: string[];
  source_info?: any;
  created_at?: string;
  updated_at?: string;
}

export interface SupabaseSubmissionRow {
  id: string;
  provider_name: string;
  category_id: string;
  neighborhood_id: string;
  phone: string;
  description: string;
  submitter_name: string;
  submitter_email: string;
  consent_given: boolean;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

// Mappers
export function mapRowToProvider(row: SupabaseProviderRow): Provider {
  const parsedSource = row.source_info || {
    badge: 'Nairobi Accueil' as SourceBadge,
    channel: 'direct_submission' as SourceChannel,
    uploadedAt: row.created_at || new Date().toISOString(),
    contributorMasked: 'Recommandé par un membre',
    contributorRevealed: 'Membre vérifié',
    reliabilityScore: 5,
    originalNotes: '',
    sourceSheet: 'Annuaire Cloud'
  };

  return {
    id: row.id,
    name: row.name,
    categoryId: row.category_id as CategoryId,
    neighborhoodId: (row.neighborhood_id || 'westlands') as Exclude<NeighborhoodId, 'all'>,
    specialty: row.specialty || '',
    description: row.description || '',
    phone: row.phone || '',
    whatsapp: row.whatsapp || undefined,
    email: row.email || undefined,
    website: row.website || undefined,
    address: row.address || undefined,
    languages: Array.isArray(row.languages) ? row.languages : ['Français', 'Anglais'],
    pricingNotes: row.pricing_notes || undefined,
    isVerified: row.is_verified ?? true,
    rating: Number(row.rating || 5.0),
    reviewsCount: Number(row.reviews_count || 1),
    tags: Array.isArray(row.tags) ? row.tags : [row.category_id, row.neighborhood_id],
    sourceInfo: parsedSource,
    createdAt: row.created_at || new Date().toISOString()
  };
}

export function mapProviderToRow(p: Provider): SupabaseProviderRow {
  return {
    id: p.id,
    name: p.name,
    category_id: p.categoryId,
    neighborhood_id: p.neighborhoodId,
    specialty: p.specialty || '',
    description: p.description || '',
    phone: p.phone || '',
    whatsapp: p.whatsapp || undefined,
    email: p.email || undefined,
    website: p.website || undefined,
    address: p.address || undefined,
    languages: p.languages || ['Français', 'Anglais'],
    pricing_notes: p.pricingNotes || undefined,
    is_verified: p.isVerified,
    rating: p.rating || 5.0,
    reviews_count: p.reviewsCount || 1,
    tags: p.tags || [p.categoryId, p.neighborhoodId],
    source_info: p.sourceInfo || {
      badge: 'Nairobi Accueil',
      channel: 'direct_submission',
      uploadedAt: new Date().toISOString(),
      contributorMasked: 'Recommandé par un membre',
      contributorRevealed: 'Membre vérifié',
      reliabilityScore: 5,
      originalNotes: '',
      sourceSheet: 'Annuaire'
    },
    updated_at: new Date().toISOString()
  };
}

export function mapRowToSubmission(row: SupabaseSubmissionRow): ProviderSubmission {
  return {
    id: row.id,
    providerName: row.provider_name,
    categoryId: row.category_id as CategoryId,
    neighborhoodId: row.neighborhood_id as Exclude<NeighborhoodId, 'all'>,
    phone: row.phone,
    description: row.description,
    submitterName: row.submitter_name,
    submitterEmail: row.submitter_email,
    consentGiven: row.consent_given,
    status: row.status,
    createdAt: row.created_at
  };
}

export function mapSubmissionToRow(s: ProviderSubmission): SupabaseSubmissionRow {
  return {
    id: s.id || `sub-${Date.now()}`,
    provider_name: s.providerName,
    category_id: s.categoryId,
    neighborhood_id: s.neighborhoodId,
    phone: s.phone,
    description: s.description,
    submitter_name: s.submitterName,
    submitter_email: s.submitterEmail,
    consent_given: s.consentGiven,
    status: s.status || 'pending',
    created_at: s.createdAt || new Date().toISOString()
  };
}

/* =========================================================================
   PUBLIC API
   ========================================================================= */

export async function fetchRemoteProviders(): Promise<SyncResult<Provider[]>> {
  if (!supabase) {
    return { success: true, isOffline: true, data: undefined };
  }

  try {
    const { data, error } = await supabase
      .from('providers')
      .select('*')
      .order('is_verified', { ascending: false })
      .order('rating', { ascending: false });

    if (error) {
      console.warn('[Supabase Sync] Providers query error:', error.message);
      return { success: false, isOffline: false, error: error.message };
    }

    if (data && data.length > 0) {
      return { success: true, isOffline: false, data: data.map(mapRowToProvider) };
    }
    return { success: true, isOffline: false, data: [] };
  } catch (err: any) {
    console.warn('[Supabase Sync] Exception fetching providers:', err);
    return { success: false, isOffline: true, error: err.message };
  }
}

export async function syncProviderToCloud(provider: Provider): Promise<SyncResult<Provider>> {
  if (!supabase) {
    return { success: true, isOffline: true, data: provider };
  }

  try {
    const row = mapProviderToRow(provider);
    const { data, error } = await supabase
      .from('providers')
      .upsert(row, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      console.warn('[Supabase Sync] Error syncing provider:', error.message);
      return { success: false, isOffline: false, error: error.message };
    }

    return { success: true, isOffline: false, data: data ? mapRowToProvider(data) : provider };
  } catch (err: any) {
    console.warn('[Supabase Sync] Exception syncing provider:', err);
    return { success: false, isOffline: true, error: err.message };
  }
}

export async function deleteRemoteProvider(id: string): Promise<SyncResult<void>> {
  if (!supabase) {
    return { success: true, isOffline: true };
  }

  try {
    const { error } = await supabase
      .from('providers')
      .delete()
      .eq('id', id);

    if (error) {
      console.warn('[Supabase Sync] Error deleting provider:', error.message);
      return { success: false, isOffline: false, error: error.message };
    }

    return { success: true, isOffline: false };
  } catch (err: any) {
    console.warn('[Supabase Sync] Exception deleting provider:', err);
    return { success: false, isOffline: true, error: err.message };
  }
}

export async function fetchRemoteSubmissions(): Promise<SyncResult<ProviderSubmission[]>> {
  if (!supabase) {
    return { success: true, isOffline: true, data: undefined };
  }

  try {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[Supabase Sync] Submissions query error:', error.message);
      return { success: false, isOffline: false, error: error.message };
    }

    return {
      success: true,
      isOffline: false,
      data: data ? data.map(mapRowToSubmission) : []
    };
  } catch (err: any) {
    console.warn('[Supabase Sync] Exception fetching submissions:', err);
    return { success: false, isOffline: true, error: err.message };
  }
}

export async function submitRecommendationToCloud(submission: ProviderSubmission): Promise<SyncResult<ProviderSubmission>> {
  if (!supabase) {
    return { success: true, isOffline: true, data: submission };
  }

  try {
    const row = mapSubmissionToRow(submission);
    const { data, error } = await supabase
      .from('submissions')
      .upsert(row, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      console.warn('[Supabase Sync] Error submitting recommendation:', error.message);
      return { success: false, isOffline: false, error: error.message };
    }

    return {
      success: true,
      isOffline: false,
      data: data ? mapRowToSubmission(data) : submission
    };
  } catch (err: any) {
    console.warn('[Supabase Sync] Exception submitting recommendation:', err);
    return { success: false, isOffline: true, error: err.message };
  }
}

export async function updateRemoteSubmissionStatus(id: string, status: 'approved' | 'rejected'): Promise<SyncResult<void>> {
  if (!supabase) {
    return { success: true, isOffline: true };
  }

  try {
    const { error } = await supabase
      .from('submissions')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.warn('[Supabase Sync] Error updating submission status:', error.message);
      return { success: false, isOffline: false, error: error.message };
    }

    return { success: true, isOffline: false };
  } catch (err: any) {
    console.warn('[Supabase Sync] Exception updating submission status:', err);
    return { success: false, isOffline: true, error: err.message };
  }
}

/**
 * Realtime Subscriptions via Supabase Channels
 */
export function subscribeToCloudChanges(callbacks: {
  onProviderChange?: (provider: Provider, eventType: 'INSERT' | 'UPDATE' | 'DELETE') => void;
  onSubmissionChange?: (submission: ProviderSubmission, eventType: 'INSERT' | 'UPDATE' | 'DELETE') => void;
}): RealtimeChannel | null {
  if (!supabase) return null;

  try {
    const channel = supabase
      .channel('public:nairobi_sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'providers' },
        (payload) => {
          if (!callbacks.onProviderChange) return;
          if (payload.eventType === 'DELETE') {
            callbacks.onProviderChange({ id: payload.old?.id } as Provider, 'DELETE');
          } else if (payload.new) {
            callbacks.onProviderChange(mapRowToProvider(payload.new as SupabaseProviderRow), payload.eventType as any);
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'submissions' },
        (payload) => {
          if (!callbacks.onSubmissionChange) return;
          if (payload.eventType === 'DELETE') {
            callbacks.onSubmissionChange({ id: payload.old?.id } as ProviderSubmission, 'DELETE');
          } else if (payload.new) {
            callbacks.onSubmissionChange(mapRowToSubmission(payload.new as SupabaseSubmissionRow), payload.eventType as any);
          }
        }
      )
      .subscribe();

    return channel;
  } catch (e) {
    console.warn('[Supabase Sync] Could not initialize realtime channel:', e);
    return null;
  }
}
