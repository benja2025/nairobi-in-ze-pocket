import { Provider, ProviderSubmission, CategoryId, NeighborhoodId, SourceBadge, SourceChannel } from '../types';

/**
 * Environment configuration for Supabase
 */
const env = (import.meta as any).env || {};
const SUPABASE_URL = env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

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
  specialty: string;
  description: string;
  phone: string;
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
  source_badge?: string;
  source_channel?: string;
  source_uploaded_at?: string;
  contributor_masked?: string;
  contributor_revealed?: string;
  reliability_score?: number;
  original_notes?: string;
  source_sheet?: string;
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
  updated_at?: string;
}

// Mappers
export function mapRowToProvider(row: SupabaseProviderRow): Provider {
  return {
    id: row.id,
    name: row.name,
    categoryId: row.category_id as CategoryId,
    neighborhoodId: (row.neighborhood_id || 'westlands') as Exclude<NeighborhoodId, 'all'>,
    specialty: row.specialty,
    description: row.description,
    phone: row.phone,
    whatsapp: row.whatsapp,
    email: row.email,
    website: row.website,
    address: row.address,
    languages: row.languages || ['Français', 'Anglais'],
    pricingNotes: row.pricing_notes,
    isVerified: row.is_verified ?? true,
    rating: Number(row.rating || 5.0),
    reviewsCount: Number(row.reviews_count || 1),
    tags: row.tags || [],
    sourceInfo: {
      badge: (row.source_badge || 'WhatsApp Verified') as SourceBadge,
      channel: (row.source_channel || 'whatsapp_group') as SourceChannel,
      uploadedAt: row.source_uploaded_at || row.created_at || new Date().toISOString(),
      contributorMasked: row.contributor_masked || 'Recommandé par un membre',
      contributorRevealed: row.contributor_revealed || 'Marie Élodie C.',
      reliabilityScore: Number(row.reliability_score || 5),
      originalNotes: row.original_notes,
      sourceSheet: row.source_sheet
    },
    createdAt: row.created_at
  };
}

export function mapProviderToRow(p: Provider): SupabaseProviderRow {
  return {
    id: p.id,
    name: p.name,
    category_id: p.categoryId,
    neighborhood_id: p.neighborhoodId,
    specialty: p.specialty,
    description: p.description,
    phone: p.phone,
    whatsapp: p.whatsapp,
    email: p.email,
    website: p.website,
    address: p.address,
    languages: p.languages,
    pricing_notes: p.pricingNotes,
    is_verified: p.isVerified,
    rating: p.rating,
    reviews_count: p.reviewsCount,
    tags: p.tags,
    source_badge: p.sourceInfo?.badge,
    source_channel: p.sourceInfo?.channel,
    source_uploaded_at: p.sourceInfo?.uploadedAt,
    contributor_masked: p.sourceInfo?.contributorMasked,
    contributor_revealed: p.sourceInfo?.contributorRevealed,
    reliability_score: p.sourceInfo?.reliabilityScore,
    original_notes: p.sourceInfo?.originalNotes,
    source_sheet: p.sourceInfo?.sourceSheet,
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
    created_at: s.createdAt || new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

/**
 * Generic REST client helper using standard fetch
 */
async function supabaseRest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<SyncResult<T>> {
  if (!isSupabaseConfigured) {
    return { success: true, isOffline: true };
  }

  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return { success: false, isOffline: true, error: 'Network offline' };
  }

  try {
    const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;
    const headers = {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
      ...(options.headers || {})
    };

    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
      const errText = await response.text();
      return { success: false, isOffline: false, error: errText };
    }

    const data = await response.json();
    return { success: true, isOffline: false, data: data as T };
  } catch (err: any) {
    console.warn('[Supabase Sync] Network error, operating in offline fallback:', err);
    return { success: false, isOffline: true, error: err.message };
  }
}

/* =========================================================================
   PUBLIC API
   ========================================================================= */

export async function fetchRemoteProviders(): Promise<SyncResult<Provider[]>> {
  const result = await supabaseRest<SupabaseProviderRow[]>('providers?select=*&order=created_at.desc');
  if (result.success && result.data) {
    return { ...result, data: result.data.map(mapRowToProvider) };
  }
  return { ...result, data: undefined };
}

export async function syncProviderToCloud(provider: Provider): Promise<SyncResult<Provider>> {
  const row = mapProviderToRow(provider);
  const result = await supabaseRest<SupabaseProviderRow[]>('providers', {
    method: 'POST',
    headers: { 'Prefer': 'resolution=merge-duplicates,return=representation' },
    body: JSON.stringify(row)
  });
  if (result.success && result.data && result.data[0]) {
    return { ...result, data: mapRowToProvider(result.data[0]) };
  }
  return { ...result, data: undefined };
}

export async function deleteRemoteProvider(id: string): Promise<SyncResult<void>> {
  return supabaseRest<void>(`providers?id=eq.${id}`, {
    method: 'DELETE'
  });
}

export async function fetchRemoteSubmissions(): Promise<SyncResult<ProviderSubmission[]>> {
  const result = await supabaseRest<SupabaseSubmissionRow[]>('submissions?select=*&order=created_at.desc');
  if (result.success && result.data) {
    return { ...result, data: result.data.map(mapRowToSubmission) };
  }
  return { ...result, data: undefined };
}

export async function submitRecommendationToCloud(submission: ProviderSubmission): Promise<SyncResult<ProviderSubmission>> {
  const row = mapSubmissionToRow(submission);
  const result = await supabaseRest<SupabaseSubmissionRow[]>('submissions', {
    method: 'POST',
    headers: { 'Prefer': 'resolution=merge-duplicates,return=representation' },
    body: JSON.stringify(row)
  });
  if (result.success && result.data && result.data[0]) {
    return { ...result, data: mapRowToSubmission(result.data[0]) };
  }
  return { ...result, data: undefined };
}

export async function updateRemoteSubmissionStatus(id: string, status: 'approved' | 'rejected'): Promise<SyncResult<void>> {
  return supabaseRest<void>(`submissions?id=eq.${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status, updated_at: new Date().toISOString() })
  });
}
