import { Provider, ProviderSubmission } from '../types';

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

/**
 * Generic REST client helper using standard fetch for minimal bundle impact
 */
async function supabaseRest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<SyncResult<T>> {
  if (!isSupabaseConfigured) {
    return { success: true, isOffline: true };
  }

  if (!navigator.onLine) {
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

/**
 * Remote Providers Synchronization (Fetch latest approved from Cloud)
 */
export async function fetchRemoteProviders(): Promise<SyncResult<Provider[]>> {
  return supabaseRest<Provider[]>('providers?select=*&order=created_at.desc');
}

/**
 * Remote Provider Upsert (Push local changes to Cloud when connected)
 */
export async function syncProviderToCloud(provider: Provider): Promise<SyncResult<Provider>> {
  return supabaseRest<Provider>('providers', {
    method: 'POST',
    headers: { 'Prefer': 'resolution=merge-duplicates' },
    body: JSON.stringify(provider)
  });
}

/**
 * Remote Submissions (Post recommendation directly to moderation queue)
 */
export async function submitRecommendationToCloud(submission: ProviderSubmission): Promise<SyncResult<ProviderSubmission>> {
  return supabaseRest<ProviderSubmission>('submissions', {
    method: 'POST',
    body: JSON.stringify(submission)
  });
}
