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
  loadWaitlist,
  saveWaitlistEntry,
  deleteWaitlistEntryFromStorage,
  loadModeratorApplications,
  saveModeratorApplication,
  deleteModeratorApplicationFromStorage
} from './services/storageService';
import {
  isSupabaseConfigured,
  fetchRemoteProviders,
  syncProviderToCloud,
  deleteRemoteProvider,
  fetchRemoteSubmissions,
  submitRecommendationToCloud,
  updateRemoteSubmissionStatus
} from './services/supabaseClient';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('directory');

  // Submissions State with Deterministic Storage Persistence
  const [submissions, setSubmissions] = useState<ProviderSubmission[]>(() => loadSubmissions());

  // Telegram Waitlist State with Deterministic Storage Persistence
  const [telegramWaitlist, setTelegramWaitlist] = useState<TelegramWaitlistEntry[]>(() => loadWaitlist());

  // Managed Providers State with Deterministic Storage Persistence
  const [providers, setProviders] = useState<Provider[]>(() => loadManagedProviders());

  // Moderator Applications State with Deterministic Storage Persistence
  const [moderatorApplications, setModeratorApplications] = useState<ModeratorApplication[]>(() => loadModeratorApplications());

  // Real-time Cloud Synchronization on mount
  useEffect(() => {
    if (isSupabaseConfigured) {
      console.info('[Supabase Sync] Fetching latest remote providers and submissions...');
      fetchRemoteProviders().then((res) => {
        if (res.success && res.data && res.data.length > 0) {
          console.info(`[Supabase Sync] Received ${res.data.length} providers from cloud.`);
          setProviders(res.data);
        }
      });
      fetchRemoteSubmissions().then((res) => {
        if (res.success && res.data && res.data.length > 0) {
          console.info(`[Supabase Sync] Received ${res.data.length} submissions from cloud.`);
          setSubmissions(res.data);
        }
      });
    }
  }, []);

  const handleCreateProvider = (newProvider: Provider) => {
    console.info('[Nairobi Storage] Creating new provider:', newProvider.name, newProvider.id);
    const updatedList = saveCustomProvider(newProvider);
    setProviders(updatedList);
    // Background Cloud Sync
    syncProviderToCloud(newProvider).catch((e) => console.warn('[Supabase Sync] Create error:', e));
  };

  const handleUpdateProvider = (updatedProvider: Provider) => {
    console.info('[Nairobi Storage] Updating provider:', updatedProvider.name, updatedProvider.id);
    const updatedList = updateManagedProvider(updatedProvider);
    setProviders(updatedList);
    // Background Cloud Sync
    syncProviderToCloud(updatedProvider).catch((e) => console.warn('[Supabase Sync] Update error:', e));

    // Also synchronize any submission linked to this provider
    setSubmissions((prev) => {
      const next = prev.map((s) => {
        if (s.id === updatedProvider.id) {
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
      return next;
    });
  };

  const handleDeleteProvider = (id: string) => {
    console.info('[Nairobi Storage] Deleting provider:', id);
    const updatedList = deleteManagedProvider(id);
    setProviders(updatedList);
    // Background Cloud Sync
    deleteRemoteProvider(id).catch((e) => console.warn('[Supabase Sync] Delete error:', e));
  };

  const handleResetDefaultProviders = () => {
    console.info('[Nairobi Storage] Resetting to default clean seeds');
    const resetList = resetStorageToDefaults();
    setProviders(resetList);
  };

  const handleAddSubmission = (newSub: ProviderSubmission) => {
    console.info('[Nairobi Storage] Adding new submission:', newSub.providerName);
    const nextSubs = saveSubmission(newSub);
    setSubmissions(nextSubs);
    // Background Cloud Sync
    submitRecommendationToCloud(newSub).catch((e) => console.warn('[Supabase Sync] Submission error:', e));
  };

  const handleApproveSubmission = (id: string) => {
    console.info('[Nairobi Storage] Approving submission:', id);
    const result = approveSubmissionInStorage(id);
    setSubmissions(result.submissions);
    if (result.promotedProvider) {
      setProviders(loadManagedProviders());
      syncProviderToCloud(result.promotedProvider).catch((e) => console.warn('[Supabase Sync] Promote error:', e));
    }
    updateRemoteSubmissionStatus(id, 'approved').catch((e) => console.warn('[Supabase Sync] Status error:', e));
  };

  const handleRejectSubmission = (id: string) => {
    console.info('[Nairobi Storage] Rejecting submission:', id);
    const nextSubs = rejectSubmissionInStorage(id);
    setSubmissions(nextSubs);
    updateRemoteSubmissionStatus(id, 'rejected').catch((e) => console.warn('[Supabase Sync] Status error:', e));
  };

  const handleJoinWaitlist = (entry: TelegramWaitlistEntry) => {
    const nextList = saveWaitlistEntry(entry);
    setTelegramWaitlist(nextList);
  };

  const handleDeleteWaitlistEntry = (id: string) => {
    const nextList = deleteWaitlistEntryFromStorage(id);
    setTelegramWaitlist(nextList);
  };

  const handleApplyModerator = (application: ModeratorApplication) => {
    const nextList = saveModeratorApplication(application);
    setModeratorApplications(nextList);
  };

  const handleDeleteModeratorApp = (id: string) => {
    const nextList = deleteModeratorApplicationFromStorage(id);
    setModeratorApplications(nextList);
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

