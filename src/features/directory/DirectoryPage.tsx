import React, { useState, useMemo, lazy, Suspense } from 'react';
import { CategoryId, NeighborhoodId, Provider, ProviderSubmission, SourceBadge } from '../../types';
import { MOCK_PROVIDERS } from '../../data/mockProviders';
import { filterProviders } from '../../utils/directoryFilter';
import ProviderCard from './ProviderCard';
import FilterBar from './FilterBar';
import { Compass, Sparkles, Plus, AlertCircle } from 'lucide-react';

// Lazy load the detailed modal to only fetch it on user demand
const ProviderModal = lazy(() => import('./ProviderModal'));

interface DirectoryPageProps {
  onNavigateToSubmit: () => void;
  submissions?: ProviderSubmission[];
}

export const DirectoryPage: React.FC<DirectoryPageProps> = ({ onNavigateToSubmit, submissions = [] }) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<NeighborhoodId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);

  const [visibleCount, setVisibleCount] = useState(12);

  // Transform community submissions into Provider objects so they appear in the Directory
  const communityProviders: Provider[] = useMemo(() => {
    if (!submissions || submissions.length === 0) return [];
    return submissions
      .filter((s) => s.status !== 'rejected')
      .map((s) => ({
        id: s.id || `sub-${s.createdAt}`,
        name: s.providerName,
        categoryId: s.categoryId,
        neighborhoodId: s.neighborhoodId,
        specialty: s.description.length > 55 ? `${s.description.slice(0, 52)}...` : s.description,
        description: s.description,
        phone: s.phone,
        whatsapp: /^[+]?[0-9\s()-]{6,}$/.test((s.phone || '').trim()) ? s.phone : undefined,
        languages: ['Français', 'Anglais'],
        isVerified: s.status === 'approved',
        rating: 5.0,
        reviewsCount: s.status === 'approved' ? 3 : 1,
        tags: [s.categoryId, s.neighborhoodId, 'Recommandation Communauté'],
        sourceInfo: {
          badge: (s.status === 'approved' ? 'Nairobi Accueil' : 'WhatsApp Verified') as SourceBadge,
          channel: 'direct_submission' as const,
          uploadedAt: s.createdAt,
          contributorMasked: `Recommandé par ${s.submitterName ? s.submitterName.split(' ')[0] : 'un membre'}`,
          contributorRevealed: `${s.submitterName || 'Membre'} (${s.submitterEmail || 'Vérifié'})`,
          reliabilityScore: 5,
          originalNotes: s.description,
          sourceSheet: 'Recommandations Communauté'
        }
      }));
  }, [submissions]);

  const allProviders = useMemo(() => {
    const combined = [...communityProviders, ...MOCK_PROVIDERS];
    const seen = new Set<string>();
    return combined.filter((p) => {
      const key = `${p.name.toLowerCase().trim()}-${p.categoryId}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [communityProviders]);

  const filteredProviders = useMemo(() => {
    return filterProviders(allProviders, selectedCategory, selectedNeighborhood, searchQuery);
  }, [allProviders, selectedCategory, selectedNeighborhood, searchQuery]);

  // Reset visible count on filter/search change
  React.useEffect(() => {
    setVisibleCount(12);
  }, [selectedCategory, selectedNeighborhood, searchQuery]);

  const visibleProviders = useMemo(() => {
    return filteredProviders.slice(0, visibleCount);
  }, [filteredProviders, visibleCount]);

  const loadMoreRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!loadMoreRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + 12, filteredProviders.length));
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [filteredProviders.length]);

  return (
    <div className="space-y-6 pb-24">
      {/* Banner Pitch */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6 bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border-amber-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl" />
        <div className="flex items-start justify-between">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Annuaire Qualité Expat</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-50 tracking-tight">
              Les Bonnes Adresses à Nairobi
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
              Sélection vérifiée d'artisans (*fundis*), médecins francophones, chauffeurs et écoles pour votre installation réussie au Kenya.
            </p>
          </div>

          <button
            onClick={onNavigateToSubmit}
            className="hidden sm:flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-all shadow-md shadow-amber-500/20 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Recommander</span>
          </button>
        </div>
      </div>

      {/* Interactive Filter & Search Controls */}
      <FilterBar
        selectedCategory={selectedCategory}
        selectedNeighborhood={selectedNeighborhood}
        searchQuery={searchQuery}
        onCategoryChange={setSelectedCategory}
        onNeighborhoodChange={setSelectedNeighborhood}
        onSearchChange={setSearchQuery}
      />

      {/* Provider List Header Count */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          {filteredProviders.length} adresse{filteredProviders.length > 1 ? 's' : ''} trouvée{filteredProviders.length > 1 ? 's' : ''}
        </span>
        {(selectedCategory !== 'all' || selectedNeighborhood !== 'all' || searchQuery) && (
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedNeighborhood('all');
              setSearchQuery('');
            }}
            className="text-xs text-amber-400 font-semibold hover:underline"
          >
            Réinitialiser les filtres
          </button>
        )}
      </div>

      {/* Provider Cards Grid */}
      {filteredProviders.length > 0 ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visibleProviders.map((provider) => (
              <ProviderCard
                key={provider.id}
                provider={provider}
                onSelect={setSelectedProvider}
              />
            ))}
          </div>

          {/* Infinite Scroll Trigger Sentinel */}
          {visibleCount < filteredProviders.length && (
            <div ref={loadMoreRef} className="py-6 flex justify-center items-center">
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 bg-slate-900/60 px-4 py-2 rounded-full border border-slate-800">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span>Chargement de la suite ({visibleCount}/{filteredProviders.length})...</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="glass-panel rounded-2xl p-8 text-center space-y-3 my-6">
          <AlertCircle className="w-10 h-10 text-amber-400 mx-auto opacity-80" />
          <h3 className="text-base font-bold text-slate-100">Aucun résultat trouvé</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Aucun contact ne correspond à la recherche "{searchQuery}". Essayez de modifier les filtres ou proposez une nouvelle adresse !
          </p>
          <button
            onClick={onNavigateToSubmit}
            className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs inline-flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter une adresse</span>
          </button>
        </div>
      )}

      {/* Provider Modal Details (Lazy loaded) */}
      {selectedProvider && (
        <Suspense fallback={null}>
          <ProviderModal
            provider={selectedProvider}
            onClose={() => setSelectedProvider(null)}
          />
        </Suspense>
      )}
    </div>
  );
};

export default DirectoryPage;
