import React, { useState, useEffect, Suspense, lazy } from 'react';
import Header from './components/layout/Header';
import BottomNav, { TabType } from './components/layout/BottomNav';
import DirectoryPage from './features/directory/DirectoryPage';
import { PageSkeleton } from './components/DirectorySkeleton';
import ScrollToTop from './components/ScrollToTop';
import { Provider, ProviderSubmission, TelegramWaitlistEntry, ModeratorApplication } from './types';
import { MOCK_PROVIDERS } from './data/mockProviders';
import { motion, AnimatePresence } from 'framer-motion';

// Code-splitting of non-critical views to optimize initial bundle (LCP / TBT)
const GuidesPage = lazy(() => import('./features/guides/GuidesPage'));
const EmergencyPage = lazy(() => import('./features/emergency/EmergencyPage'));
const BotPage = lazy(() => import('./features/bot/BotPage'));
const SubmitPage = lazy(() => import('./features/submit/SubmitPage'));
const AdminPage = lazy(() => import('./features/admin/AdminPage'));
const NotFoundPage = lazy(() => import('./features/NotFoundPage'));


const INITIAL_SUBMISSIONS: ProviderSubmission[] = [
  {
    id: 'sub-sample-1',
    providerName: 'Samuel Électricien Fundi',
    categoryId: 'fundis',
    neighborhoodId: 'westlands',
    phone: '+254 711 222 333',
    description: 'Dépannage rapide d\'un inverter solaire un dimanche soir.',
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

const INITIAL_MODERATOR_APPS: ModeratorApplication[] = [
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

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('directory');

  // Submissions State with LocalStorage Persistence
  const [submissions, setSubmissions] = useState<ProviderSubmission[]>(() => {
    try {
      const saved = localStorage.getItem('nairobi_provider_submissions');
      return saved ? JSON.parse(saved) : INITIAL_SUBMISSIONS;
    } catch {
      return INITIAL_SUBMISSIONS;
    }
  });

  // Telegram Waitlist State with LocalStorage Persistence
  const [telegramWaitlist, setTelegramWaitlist] = useState<TelegramWaitlistEntry[]>(() => {
    try {
      const saved = localStorage.getItem('nairobi_telegram_waitlist');
      return saved ? JSON.parse(saved) : INITIAL_WAITLIST;
    } catch {
      return INITIAL_WAITLIST;
    }
  });

  // Managed Providers State with LocalStorage Persistence
  const [providers, setProviders] = useState<Provider[]>(() => {
    try {
      const saved = localStorage.getItem('nairobi_managed_providers_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Error reading stored providers:', e);
    }
    return MOCK_PROVIDERS;
  });

  // Moderator Applications State with LocalStorage Persistence
  const [moderatorApplications, setModeratorApplications] = useState<ModeratorApplication[]>(() => {
    try {
      const saved = localStorage.getItem('nairobi_moderator_applications');
      return saved ? JSON.parse(saved) : INITIAL_MODERATOR_APPS;
    } catch {
      return INITIAL_MODERATOR_APPS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('nairobi_managed_providers_v1', JSON.stringify(providers));
    } catch (e) {
      console.warn('LocalStorage error on providers:', e);
    }
  }, [providers]);

  useEffect(() => {
    try {
      localStorage.setItem('nairobi_provider_submissions', JSON.stringify(submissions));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [submissions]);

  useEffect(() => {
    try {
      localStorage.setItem('nairobi_telegram_waitlist', JSON.stringify(telegramWaitlist));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [telegramWaitlist]);

  useEffect(() => {
    try {
      localStorage.setItem('nairobi_moderator_applications', JSON.stringify(moderatorApplications));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [moderatorApplications]);

  const handleCreateProvider = (newProvider: Provider) => {
    console.info('[Nairobi Sync] Creating new provider:', newProvider.name, newProvider.id);
    setProviders((prev) => {
      const next = [newProvider, ...prev];
      try {
        localStorage.setItem('nairobi_managed_providers_v1', JSON.stringify(next));
      } catch (e) {
        console.warn('LocalStorage error on create:', e);
      }
      return next;
    });
  };

  const handleUpdateProvider = (updatedProvider: Provider) => {
    console.info('[Nairobi Sync] Updating provider:', updatedProvider.name, updatedProvider.id, updatedProvider);
    setProviders((prev) => {
      let matched = false;
      const next = prev.map((p) => {
        if (p.id === updatedProvider.id) {
          matched = true;
          return updatedProvider;
        }
        return p;
      });

      // If not matched by ID, try matching by name + category
      const finalNext = matched
        ? next
        : prev.some((p) => `${p.name.toLowerCase().trim()}-${p.categoryId}` === `${updatedProvider.name.toLowerCase().trim()}-${updatedProvider.categoryId}`)
        ? prev.map((p) => (`${p.name.toLowerCase().trim()}-${p.categoryId}` === `${updatedProvider.name.toLowerCase().trim()}-${updatedProvider.categoryId}` ? updatedProvider : p))
        : [updatedProvider, ...prev];

      try {
        localStorage.setItem('nairobi_managed_providers_v1', JSON.stringify(finalNext));
        console.info('[Nairobi Sync] Successfully saved updated provider to LocalStorage.');
      } catch (e) {
        console.warn('LocalStorage error on update:', e);
      }
      return finalNext;
    });

    // Also synchronize any existing submission matching this provider
    setSubmissions((prev) => {
      const next = prev.map((s) => {
        if (
          s.id === updatedProvider.id ||
          `${s.providerName.toLowerCase().trim()}-${s.categoryId}` === `${updatedProvider.name.toLowerCase().trim()}-${updatedProvider.categoryId}`
        ) {
          return {
            ...s,
            providerName: updatedProvider.name,
            categoryId: updatedProvider.categoryId,
            neighborhoodId: updatedProvider.neighborhoodId,
            phone: updatedProvider.phone,
            description: updatedProvider.description,
            status: 'approved' as const
          };
        }
        return s;
      });
      try {
        localStorage.setItem('nairobi_provider_submissions', JSON.stringify(next));
      } catch (e) {
        console.warn('LocalStorage error on submission sync:', e);
      }
      return next;
    });
  };

  const handleDeleteProvider = (id: string) => {
    console.info('[Nairobi Sync] Deleting provider:', id);
    setProviders((prev) => {
      const next = prev.filter((p) => p.id !== id);
      try {
        localStorage.setItem('nairobi_managed_providers_v1', JSON.stringify(next));
      } catch (e) {
        console.warn('LocalStorage error on delete:', e);
      }
      return next;
    });

    // Also remove from submissions so it doesn't reappear
    setSubmissions((prev) => {
      const next = prev.filter((s) => s.id !== id && `sub-${s.createdAt}` !== id);
      try {
        localStorage.setItem('nairobi_provider_submissions', JSON.stringify(next));
      } catch (e) {
        console.warn('LocalStorage error on submission delete:', e);
      }
      return next;
    });
  };

  const handleResetDefaultProviders = () => {
    console.info('[Nairobi Sync] Resetting to default mock providers');
    setProviders(MOCK_PROVIDERS);
    try {
      localStorage.removeItem('nairobi_managed_providers_v1');
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  };

  const handleAddSubmission = (newSub: ProviderSubmission) => {
    setSubmissions((prev) => {
      const next = [newSub, ...prev];
      try {
        localStorage.setItem('nairobi_provider_submissions', JSON.stringify(next));
      } catch (e) {
        console.warn('LocalStorage error:', e);
      }
      return next;
    });
  };

  const handleApproveSubmission = (id: string) => {
    console.info('[Nairobi Sync] Approving submission:', id);
    let approvedSub: ProviderSubmission | undefined;
    setSubmissions((prev) => {
      const next = prev.map((s) => {
        if (s.id === id) {
          approvedSub = s;
          return { ...s, status: 'approved' as const };
        }
        return s;
      });
      try {
        localStorage.setItem('nairobi_provider_submissions', JSON.stringify(next));
      } catch (e) {
        console.warn('LocalStorage error:', e);
      }
      return next;
    });

    // Promote approved submission directly into managed providers
    if (approvedSub) {
      const sub = approvedSub;
      const promotedProvider: Provider = {
        id: sub.id || `provider-approved-${Date.now()}`,
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

      setProviders((prev) => {
        const key = `${promotedProvider.name.toLowerCase().trim()}-${promotedProvider.categoryId}`;
        const exists = prev.some((p) => p.id === promotedProvider.id || `${p.name.toLowerCase().trim()}-${p.categoryId}` === key);
        const next = exists
          ? prev.map((p) => (p.id === promotedProvider.id || `${p.name.toLowerCase().trim()}-${p.categoryId}` === key ? promotedProvider : p))
          : [promotedProvider, ...prev];
        try {
          localStorage.setItem('nairobi_managed_providers_v1', JSON.stringify(next));
        } catch (e) {
          console.warn('LocalStorage error:', e);
        }
        return next;
      });
    }
  };

  const handleRejectSubmission = (id: string) => {
    setSubmissions((prev) => {
      const next = prev.map((s) => (s.id === id ? { ...s, status: 'rejected' as const } : s));
      try {
        localStorage.setItem('nairobi_provider_submissions', JSON.stringify(next));
      } catch (e) {
        console.warn('LocalStorage error:', e);
      }
      return next;
    });
  };

  const handleJoinWaitlist = (entry: TelegramWaitlistEntry) => {
    setTelegramWaitlist((prev) => [entry, ...prev]);
  };

  const handleDeleteWaitlistEntry = (id: string) => {
    setTelegramWaitlist((prev) => prev.filter((e) => e.id !== id));
  };

  const handleApplyModerator = (application: ModeratorApplication) => {
    setModeratorApplications((prev) => [application, ...prev]);
  };

  const handleDeleteModeratorApp = (id: string) => {
    setModeratorApplications((prev) => prev.filter((app) => app.id !== id));
  };

  const pendingCount = submissions.filter((s) => s.status === 'pending').length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-amber-500 selection:text-slate-950 relative overflow-x-hidden bg-topo-safari">
      {/* Ambient Warm Safari & Night Sky Light Glows */}
      <div
        className="fixed top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-amber-500/15 via-orange-600/10 to-transparent blur-3xl pointer-events-none -z-10 animate-pulse"
        style={{ animationDuration: '8s' }}
      />
      <div
        className="fixed bottom-[10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-french-600/15 via-blue-700/10 to-transparent blur-3xl pointer-events-none -z-10"
      />
      <div
        className="fixed top-[45%] right-[20%] w-[350px] h-[350px] rounded-full bg-amber-600/5 blur-3xl pointer-events-none -z-10"
      />

      {/* Header Bar */}
      <Header
        activeTab={activeTab}
        onOpenSos={() => setActiveTab('emergency')}
        onGoHome={() => setActiveTab('directory')}
      />

      {/* Main Responsive Viewport with reserved min height to eliminate CLS */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-4 sm:px-6 min-h-[80vh] relative z-10">
        <Suspense fallback={<PageSkeleton />}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
            >
              {activeTab === 'directory' && (
                <DirectoryPage 
                  onNavigateToSubmit={() => setActiveTab('submit')} 
                  submissions={submissions}
                  providers={providers}
                />
              )}
              {activeTab === 'guides' && <GuidesPage />}
              {activeTab === 'emergency' && <EmergencyPage />}
              {activeTab === 'bot' && (
                <BotPage onJoinWaitlist={handleJoinWaitlist} />
              )}
              {activeTab === 'submit' && (
                <SubmitPage onSubmitSuccess={handleAddSubmission} />
              )}
              {activeTab === 'admin' && (
                <AdminPage
                  submissions={submissions}
                  telegramWaitlist={telegramWaitlist}
                  moderatorApplications={moderatorApplications}
                  providers={providers}
                  onApprove={handleApproveSubmission}
                  onReject={handleRejectSubmission}
                  onDeleteWaitlistEntry={handleDeleteWaitlistEntry}
                  onApplyModerator={handleApplyModerator}
                  onDeleteModeratorApp={handleDeleteModeratorApp}
                  onCreateProvider={handleCreateProvider}
                  onUpdateProvider={handleUpdateProvider}
                  onDeleteProvider={handleDeleteProvider}
                  onResetDefaultProviders={handleResetDefaultProviders}
                />
              )}
              {!['directory', 'guides', 'emergency', 'bot', 'submit', 'admin'].includes(activeTab) && (
                <NotFoundPage onGoHome={() => setActiveTab('directory')} />
              )}
            </motion.div>
          </AnimatePresence>
        </Suspense>
      </main>

      {/* Scroll To Top Floating Button */}
      <ScrollToTop />

      {/* Bottom Fixed Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        pendingSubmissionsCount={pendingCount}
      />
    </div>
  );
};

export default App;

