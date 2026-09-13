import { createClient, SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';
import { Provider, ProviderSubmission, CategoryId, NeighborhoodId } from '../types';

// Environment credentials (Vite client-side)
const env = (import.meta as any).env || {};
const supabaseUrl: string = env.VITE_SUPABASE_URL || '';
const supabaseAnonKey: string = env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== 'https://your-project-id.supabase.co' &&
    !supabaseUrl.includes('placeholder')
  );
};

export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
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

// ============================================================================
// DATA MAPPERS (TypeScript CamelCase <-> PostgreSQL Snake_Case)
// ============================================================================

export const mapDbToProvider = (row: any): Provider => ({
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
  pricingNotes: row.pricing_notes || undefined,
  languages: Array.isArray(row.languages) ? row.languages : ['Français', 'Anglais'],
  isVerified: Boolean(row.is_verified),
  rating: Number(row.rating) || 5.0,
  reviewsCount: Number(row.reviews_count) || 1,
  tags: Array.isArray(row.tags) ? row.tags : [row.category_id, row.neighborhood_id],
  sourceInfo: row.source_info || undefined,
  createdAt: row.created_at || new Date().toISOString()
});

export const mapProviderToDb = (p: Provider) => ({
  id: p.id,
  name: p.name,
  category_id: p.categoryId,
  neighborhood_id: p.neighborhoodId,
  specialty: p.specialty || '',
  description: p.description || '',
  phone: p.phone || '',
  whatsapp: p.whatsapp || null,
  email: p.email || null,
  website: p.website || null,
  address: p.address || null,
  pricing_notes: p.pricingNotes || null,
  languages: p.languages || ['Français', 'Anglais'],
  is_verified: p.isVerified,
  rating: p.rating || 5.0,
  reviews_count: p.reviewsCount || 1,
  tags: p.tags || [p.categoryId, p.neighborhoodId],
  source_info: p.sourceInfo || null,
  updated_at: new Date().toISOString()
});

export const mapDbToSubmission = (row: any): ProviderSubmission => ({
  id: row.id,
  providerName: row.provider_name,
  categoryId: row.category_id as CategoryId,
  neighborhoodId: row.neighborhood_id as Exclude<NeighborhoodId, 'all'>,
  phone: row.phone,
  description: row.description,
  submitterName: row.submitter_name,
  submitterEmail: row.submitter_email,
  consentGiven: Boolean(row.consent_given),
  status: row.status as 'pending' | 'approved' | 'rejected',
  createdAt: row.created_at
});

export const mapSubmissionToDb = (s: ProviderSubmission) => ({
  id: s.id,
  provider_name: s.providerName,
  category_id: s.categoryId,
  neighborhood_id: s.neighborhoodId,
  phone: s.phone,
  description: s.description,
  submitter_name: s.submitterName,
  submitter_email: s.submitterEmail,
  consent_given: s.consentGiven,
  status: s.status,
  created_at: s.createdAt
});

// ============================================================================
// PROVIDERS CLOUD OPERATIONS
// ============================================================================

export async function fetchCloudProviders(): Promise<Provider[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('providers')
      .select('*')
      .order('is_verified', { ascending: false })
      .order('rating', { ascending: false });

    if (error) {
      console.warn('[Supabase] Error fetching providers:', error.message);
      return null;
    }

    if (data && data.length > 0) {
      return data.map(mapDbToProvider);
    }
    return [];
  } catch (err) {
    console.warn('[Supabase] Exception fetching providers:', err);
    return null;
  }
}

export async function saveCloudProvider(provider: Provider): Promise<boolean> {
  if (!supabase) return false;
  try {
    const row = mapProviderToDb(provider);
    const { error } = await supabase
      .from('providers')
      .upsert(row, { onConflict: 'id' });

    if (error) {
      console.error('[Supabase] Error saving provider:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[Supabase] Exception saving provider:', err);
    return false;
  }
}

export async function deleteCloudProvider(id: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from('providers')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[Supabase] Error deleting provider:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[Supabase] Exception deleting provider:', err);
    return false;
  }
}

// ============================================================================
// SUBMISSIONS CLOUD OPERATIONS
// ============================================================================

export async function fetchCloudSubmissions(): Promise<ProviderSubmission[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[Supabase] Error fetching submissions:', error.message);
      return null;
    }

    if (data) {
      return data.map(mapDbToSubmission);
    }
    return [];
  } catch (err) {
    console.warn('[Supabase] Exception fetching submissions:', err);
    return null;
  }
}

export async function saveCloudSubmission(submission: ProviderSubmission): Promise<boolean> {
  if (!supabase) return false;
  try {
    const row = mapSubmissionToDb(submission);
    const { error } = await supabase
      .from('submissions')
      .upsert(row, { onConflict: 'id' });

    if (error) {
      console.error('[Supabase] Error saving submission:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[Supabase] Exception saving submission:', err);
    return false;
  }
}

export async function updateCloudSubmissionStatus(
  id: string,
  status: 'approved' | 'rejected'
): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from('submissions')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('[Supabase] Error updating submission status:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[Supabase] Exception updating submission status:', err);
    return false;
  }
}

export async function deleteCloudSubmission(id: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from('submissions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[Supabase] Error deleting submission:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[Supabase] Exception deleting submission:', err);
    return false;
  }
}

// Bulk seed helper to automatically populate empty Supabase instances with MOCK_PROVIDERS
export async function seedCloudIfEmpty(mockProviders: Provider[]): Promise<void> {
  if (!supabase) return;
  try {
    const { count, error } = await supabase
      .from('providers')
      .select('*', { count: 'exact', head: true });

    if (!error && count === 0) {
      console.info('[Supabase] Database is empty. Seeding initial providers to Cloud...');
      const rows = mockProviders.map(mapProviderToDb);
      // Batch insert in chunks of 50
      for (let i = 0; i < rows.length; i += 50) {
        const chunk = rows.slice(i, i + 50);
        await supabase.from('providers').upsert(chunk, { onConflict: 'id' });
      }
      console.info('[Supabase] Successfully seeded initial providers to Cloud.');
    }
  } catch (err) {
    console.warn('[Supabase] Exception during bulk seed:', err);
  }
}

// ============================================================================
// REALTIME SUBSCRIPTION CHANNELS
// ============================================================================

export function subscribeToRealtimeProviders(
  onInsert: (provider: Provider) => void,
  onUpdate: (provider: Provider) => void,
  onDelete: (id: string) => void
): RealtimeChannel | null {
  if (!supabase) return null;

  try {
    const channel = supabase
      .channel('public:providers')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'providers' },
        (payload) => {
          onInsert(mapDbToProvider(payload.new));
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'providers' },
        (payload) => {
          onUpdate(mapDbToProvider(payload.new));
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'providers' },
        (payload) => {
          if (payload.old?.id) {
            onDelete(payload.old.id);
          }
        }
      )
      .subscribe();

    return channel;
  } catch (err) {
    console.warn('[Supabase] Could not subscribe to realtime providers:', err);
    return null;
  }
}

export function subscribeToRealtimeSubmissions(
  onInsert: (submission: ProviderSubmission) => void,
  onUpdate: (submission: ProviderSubmission) => void,
  onDelete: (id: string) => void
): RealtimeChannel | null {
  if (!supabase) return null;

  try {
    const channel = supabase
      .channel('public:submissions')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'submissions' },
        (payload) => {
          onInsert(mapDbToSubmission(payload.new));
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'submissions' },
        (payload) => {
          onUpdate(mapDbToSubmission(payload.new));
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'submissions' },
        (payload) => {
          if (payload.old?.id) {
            onDelete(payload.old.id);
          }
        }
      )
      .subscribe();

    return channel;
  } catch (err) {
    console.warn('[Supabase] Could not subscribe to realtime submissions:', err);
    return null;
  }
}
