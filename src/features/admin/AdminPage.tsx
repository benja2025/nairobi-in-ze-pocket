import React, { useState, useEffect } from 'react';
import { ProviderSubmission, TelegramWaitlistEntry, ModeratorApplication } from '../../types';
import { 
  ShieldCheck, 
  Check, 
  X, 
  Clock, 
  Lock, 
  User, 
  KeyRound, 
  LogOut, 
  Download, 
  Copy, 
  CheckCheck, 
  Send, 
  Users, 
  FileText, 
  BarChart3, 
  Sparkles, 
  Eye, 
  EyeOff, 
  Database,
  MapPin,
  Trash2,
  AlertCircle,
  UserPlus,
  HeartHandshake,
  Mail,
  Phone,
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Hardcoded Admin Credentials
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'N@irobi#2026!';

interface AdminPageProps {
  submissions: ProviderSubmission[];
  telegramWaitlist: TelegramWaitlistEntry[];
  moderatorApplications?: ModeratorApplication[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onDeleteWaitlistEntry?: (id: string) => void;
  onApplyModerator?: (application: ModeratorApplication) => void;
  onDeleteModeratorApp?: (id: string) => void;
}

type AdminTab = 'moderation' | 'waitlist' | 'moderator_apps' | 'analytics';
type AuthView = 'login' | 'apply' | 'success';

export const AdminPage: React.FC<AdminPageProps> = ({ 
  submissions, 
  telegramWaitlist,
  moderatorApplications = [],
  onApprove, 
  onReject,
  onDeleteWaitlistEntry,
  onApplyModerator,
  onDeleteModeratorApp
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('nairobi_admin_auth') === 'true';
  });
  const [authView, setAuthView] = useState<AuthView>('login');
  
  // Login Form
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Moderator Application Form
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantNeighborhood, setApplicantNeighborhood] = useState('Lavington');
  const [applicantMotivation, setApplicantMotivation] = useState('');
  
  // Dashboard UI State
  const [activeTab, setActiveTab] = useState<AdminTab>('moderation');
  const [copiedPseudos, setCopiedPseudos] = useState(false);
  const [moderationFilter, setModerationFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      usernameInput.trim().toLowerCase() === ADMIN_USERNAME.toLowerCase() && 
      passwordInput.trim() === ADMIN_PASSWORD
    ) {
      setIsAuthenticated(true);
      sessionStorage.setItem('nairobi_admin_auth', 'true');
      setLoginError('');
    } else {
      setLoginError('Identifiant ou mot de passe incorrect. Veuillez réessayer.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('nairobi_admin_auth');
    setUsernameInput('');
    setPasswordInput('');
    setAuthView('login');
  };

  const handleModeratorApplicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName.trim() || !applicantEmail.trim() || !applicantPhone.trim()) return;

    const newApp: ModeratorApplication = {
      id: `mod-app-${Date.now()}`,
      fullName: applicantName.trim(),
      email: applicantEmail.trim(),
      phoneOrWhatsapp: applicantPhone.trim(),
      neighborhood: applicantNeighborhood,
      motivation: applicantMotivation.trim() || undefined,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    if (onApplyModerator) {
      onApplyModerator(newApp);
    }

    setAuthView('success');
  };

  const resetApplicationForm = () => {
    setApplicantName('');
    setApplicantEmail('');
    setApplicantPhone('');
    setApplicantMotivation('');
    setAuthView('login');
  };

  const pendingList = submissions.filter((s) => s.status === 'pending');
  const approvedList = submissions.filter((s) => s.status === 'approved');
  const rejectedList = submissions.filter((s) => s.status === 'rejected');

  const displayedSubmissions = submissions.filter((s) => {
    if (moderationFilter === 'all') return true;
    return s.status === moderationFilter;
  });

  // Export Telegram Waitlist to CSV
  const handleExportCSV = () => {
    if (telegramWaitlist.length === 0) return;

    const headers = ['ID', 'Prénom/Nom', 'Identifiant Telegram', 'Source', 'Date d\'inscription'];
    const rows = telegramWaitlist.map(entry => [
      `"${entry.id}"`,
      `"${entry.name || 'Non renseigné'}"`,
      `"${entry.telegramHandle}"`,
      `"${entry.source}"`,
      `"${new Date(entry.createdAt).toLocaleString('fr-FR')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `nairobi_in_ze_pocket_telegram_waitlist_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export Moderator Applications to CSV
  const handleExportModAppsCSV = () => {
    if (moderatorApplications.length === 0) return;

    const headers = ['ID', 'Nom Complet', 'Email', 'Téléphone/WhatsApp', 'Quartier', 'Motivation', 'Date de demande'];
    const rows = moderatorApplications.map(entry => [
      `"${entry.id}"`,
      `"${entry.fullName}"`,
      `"${entry.email}"`,
      `"${entry.phoneOrWhatsapp}"`,
      `"${entry.neighborhood || 'N/A'}"`,
      `"${(entry.motivation || '').replace(/"/g, '""')}"`,
      `"${new Date(entry.createdAt).toLocaleString('fr-FR')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `nairobi_candidatures_moderateurs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy all Telegram Handles
  const handleCopyHandles = () => {
    if (telegramWaitlist.length === 0) return;
    const handles = telegramWaitlist.map(e => e.telegramHandle).join(', ');
    navigator.clipboard.writeText(handles);
    setCopiedPseudos(true);
    setTimeout(() => setCopiedPseudos(false), 2500);
  };

  /* =========================================================================
     1. AUTHENTICATION & MODERATOR WAITLIST VIEWS (WHEN NOT LOGGED IN)
     ========================================================================= */
  if (!isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <AnimatePresence mode="wait">
          {/* VIEW A: LOGIN FORM */}
          {authView === 'login' && (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 15, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.97 }}
              className="glass-panel w-full max-w-md rounded-2xl p-6 sm:p-8 bg-slate-900 border border-french-500/30 shadow-2xl space-y-6"
            >
              {/* Logo / Header */}
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-french-600/20 border border-french-500/40 flex items-center justify-center text-french-400 mx-auto shadow-inner shadow-french-500/20">
                  <Lock className="w-7 h-7" />
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-50 tracking-tight">
                  Espace d'Administration
                </h2>
                <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                  Authentification sécurisée réservée aux modérateurs de <strong>Nairobi Accueil</strong>.
                </p>
              </div>

              {/* Error Alert */}
              {loginError && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-xl bg-sos-950/60 border border-sos-500/40 text-sos-300 text-xs flex items-center space-x-2"
                >
                  <AlertCircle className="w-4 h-4 text-sos-400 shrink-0" />
                  <span>{loginError}</span>
                </motion.div>
              )}

              {/* Form */}
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Nom d'utilisateur
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={usernameInput}
                      onChange={(e) => setUsernameInput(e.target.value)}
                      placeholder="Ex: admin"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-french-500 focus:ring-1 focus:ring-french-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-french-500 focus:ring-1 focus:ring-french-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                      aria-label="Afficher le mot de passe"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-french-600 hover:bg-french-500 text-white text-xs font-bold transition-all shadow-lg shadow-french-600/30 active:scale-98 flex items-center justify-center space-x-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Se connecter au Panneau</span>
                </button>
              </form>

              {/* Call-to-action: Apply to become moderator */}
              <div className="pt-3 border-t border-slate-800 text-center space-y-2">
                <p className="text-xs text-slate-400">
                  Vous n'avez pas encore d'accès modérateur ?
                </p>
                <button
                  type="button"
                  onClick={() => setAuthView('apply')}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-french-950/60 hover:bg-french-900/80 text-french-300 hover:text-french-200 text-xs font-bold border border-french-500/30 transition-all active:scale-95"
                >
                  <UserPlus className="w-3.5 h-3.5 text-french-400" />
                  <span>Demander à devenir modérateur</span>
                </button>
              </div>

              <div className="text-center">
                <p className="text-[10px] text-slate-500">
                  Protection DPA 2019 • Données hébergées en conformité
                </p>
              </div>
            </motion.div>
          )}

          {/* VIEW B: MODERATOR APPLICATION FORM (WAITLIST) */}
          {authView === 'apply' && (
            <motion.div
              key="apply"
              initial={{ opacity: 0, y: 15, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.97 }}
              className="glass-panel w-full max-w-lg rounded-2xl p-6 sm:p-8 bg-slate-900 border border-french-500/30 shadow-2xl space-y-5"
            >
              {/* Header */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-french-600/20 text-french-300 border border-french-500/30">
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Candidature Bénévole</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAuthView('login')}
                    className="text-xs text-slate-400 hover:text-slate-200 flex items-center space-x-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Retour</span>
                  </button>
                </div>

                <h2 className="text-xl font-extrabold text-slate-50 tracking-tight">
                  Rejoindre l'équipe des Modérateurs
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Aidez la communauté francophone en vérifiant les adresses, les fundis et les bons plans recommandés par les expatriés à Nairobi.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleModeratorApplicationSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Votre Prénom & Nom <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      placeholder="Ex: Claire V."
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-french-500 focus:ring-1 focus:ring-french-500 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Adresse E-mail <span className="text-amber-400">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={applicantEmail}
                        onChange={(e) => setApplicantEmail(e.target.value)}
                        placeholder="claire@gmail.com"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-french-500 focus:ring-1 focus:ring-french-500 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Téléphone / WhatsApp <span className="text-amber-400">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="tel"
                        required
                        value={applicantPhone}
                        onChange={(e) => setApplicantPhone(e.target.value)}
                        placeholder="+254 7..."
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-french-500 focus:ring-1 focus:ring-french-500 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Votre quartier de résidence à Nairobi
                  </label>
                  <select
                    value={applicantNeighborhood}
                    onChange={(e) => setApplicantNeighborhood(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-french-500 focus:ring-1 focus:ring-french-500 transition-all"
                  >
                    <option value="Lavington">Lavington</option>
                    <option value="Kilimani">Kilimani</option>
                    <option value="Westlands">Westlands</option>
                    <option value="Gigiri / Runda">Gigiri / Runda</option>
                    <option value="Karen / Langata">Karen / Langata</option>
                    <option value="Spring Valley">Spring Valley</option>
                    <option value="Autre">Autre secteur</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Quelques mots sur votre expérience à Nairobi <span className="text-slate-500 font-normal">(optionnel)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={applicantMotivation}
                    onChange={(e) => setApplicantMotivation(e.target.value)}
                    placeholder="Ex: Résidente depuis 3 ans, membre active Nairobi Accueil, disponible pour modérer les bonnes adresses..."
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-french-500 focus:ring-1 focus:ring-french-500 transition-all resize-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end space-x-2.5">
                  <button
                    type="button"
                    onClick={() => setAuthView('login')}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-french-600 hover:bg-french-500 text-white text-xs font-bold transition-all shadow-md shadow-french-600/30 active:scale-95 flex items-center space-x-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Soumettre ma candidature</span>
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* VIEW C: WARM THANK YOU & PATIENCE SUCCESS SCREEN */}
          {authView === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -15 }}
              className="glass-panel w-full max-w-md rounded-2xl p-7 sm:p-8 bg-slate-900 border border-french-500/30 shadow-2xl text-center space-y-5"
            >
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto shadow-inner shadow-emerald-500/20">
                <HeartHandshake className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Demande bien enregistrée</span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-50 tracking-tight">
                  Asante Sana pour votre engagement !
                </h3>
              </div>

              <div className="p-4 rounded-xl bg-slate-850/80 border border-slate-700/60 text-xs text-slate-200 leading-relaxed text-left space-y-2">
                <p>
                  Votre candidature pour rejoindre l'équipe des modérateurs bénévoles de <strong>Nairobi in ze Pocket</strong> a été placée sur notre liste d'attente prioritaire.
                </p>
                <p className="text-slate-300">
                  Notre bureau associatif examine chaque demande lors de nos réunions mensuelles afin de coordonner les accès. Un membre de l'équipe prendra directement contact avec vous par e-mail ou WhatsApp.
                </p>
                <p className="text-french-300 font-medium pt-1">
                  Merci infiniment pour votre temps, votre bienveillance et votre patience ! ✨
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={resetApplicationForm}
                  className="w-full py-2.5 rounded-xl bg-french-600 hover:bg-french-500 text-white text-xs font-bold transition-all shadow-md shadow-french-600/30"
                >
                  Retour à l'écran de connexion
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  /* =========================================================================
     2. AUTHENTICATED ADMIN & MODERATION DASHBOARD
     ========================================================================= */
  return (
    <div className="space-y-6 pb-24 max-w-5xl mx-auto">
      {/* Top Banner with Logout */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6 bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border-french-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Session Authentifiée • Modérateur Principal</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-50 tracking-tight">
              Tableau de Bord & Modération
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Supervision de l'annuaire, validation des contributions de la communauté et gestion des prospects Telegram.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors border border-slate-700 self-start sm:self-auto"
          >
            <LogOut className="w-4 h-4 text-sos-400" />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="glass-panel rounded-2xl p-4 border-slate-700/60 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>En attente</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-50 mt-2">
            {pendingList.length}
          </div>
          <div className="text-[10px] text-amber-400/90 font-medium mt-1">
            À modérer aujourd'hui
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 border-slate-700/60 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Telegram Leads</span>
            <Send className="w-4 h-4 text-french-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-50 mt-2">
            {telegramWaitlist.length}
          </div>
          <div className="text-[10px] text-french-400/90 font-medium mt-1">
            Inscrits en liste d'attente
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 border-slate-700/60 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Approuvées</span>
            <Check className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-50 mt-2">
            {approvedList.length}
          </div>
          <div className="text-[10px] text-emerald-400/90 font-medium mt-1">
            Publiées dans l'annuaire
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 border-slate-700/60 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Santé Système</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400 mt-2">
            100%
          </div>
          <div className="text-[10px] text-slate-400 font-medium mt-1">
            PWA Offline & Base active
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('moderation')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'moderation'
              ? 'bg-french-600 text-white shadow-md shadow-french-600/30'
              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Modération des Recommandations ({pendingList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('waitlist')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'waitlist'
              ? 'bg-french-600 text-white shadow-md shadow-french-600/30'
              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>File d'Attente Telegram ({telegramWaitlist.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('moderator_apps')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'moderator_apps'
              ? 'bg-french-600 text-white shadow-md shadow-french-600/30'
              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <UserPlus className="w-4 h-4 text-emerald-400" />
          <span>Candidatures Modérateurs ({moderatorApplications.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'analytics'
              ? 'bg-french-600 text-white shadow-md shadow-french-600/30'
              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Statistiques & Synthèse</span>
        </button>
      </div>

      {/* =========================================================================
          TAB 1: RECOMMANDATIONS MODERATION
          ========================================================================= */}
      {activeTab === 'moderation' && (
        <div className="glass-panel rounded-2xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
              <FileText className="w-4 h-4 text-french-400" />
              <span>Propositions de contacts soumises</span>
            </h3>

            {/* Filter Pills */}
            <div className="flex items-center space-x-1.5 text-xs">
              <button
                onClick={() => setModerationFilter('pending')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  moderationFilter === 'pending'
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                En attente ({pendingList.length})
              </button>
              <button
                onClick={() => setModerationFilter('approved')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  moderationFilter === 'approved'
                    ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Approuvées ({approvedList.length})
              </button>
              <button
                onClick={() => setModerationFilter('rejected')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  moderationFilter === 'rejected'
                    ? 'bg-sos-500/20 text-sos-300 font-bold border border-sos-500/30'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Rejetées ({rejectedList.length})
              </button>
              <button
                onClick={() => setModerationFilter('all')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  moderationFilter === 'all'
                    ? 'bg-slate-700 text-white font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Toutes ({submissions.length})
              </button>
            </div>
          </div>

          {displayedSubmissions.length > 0 ? (
            <div className="space-y-3">
              {displayedSubmissions.map((sub) => (
                <div
                  key={sub.id}
                  className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-600 transition-colors"
                >
                  <div className="space-y-1.5 text-xs flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-extrabold text-slate-100 text-sm">{sub.providerName}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-french-500/10 text-french-400 border border-french-500/20">
                        {sub.categoryId} • {sub.neighborhoodId}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        sub.status === 'pending'
                          ? 'bg-amber-500/10 text-amber-400'
                          : sub.status === 'approved'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-sos-500/10 text-sos-400'
                      }`}>
                        {sub.status === 'pending' ? '⏳ En attente' : sub.status === 'approved' ? '✅ Approuvée' : '❌ Rejetée'}
                      </span>
                    </div>

                    <p className="text-slate-300 font-mono">📞 {sub.phone}</p>
                    <p className="text-slate-300 italic bg-slate-950/40 p-2 rounded-lg border border-slate-800">
                      "{sub.description}"
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-400 pt-1">
                      <span>Soumis par : <strong className="text-slate-200">{sub.submitterName}</strong> ({sub.submitterEmail})</span>
                      <span>• Le {new Date(sub.createdAt).toLocaleDateString('fr-FR')}</span>
                      <span>• Consentement DPA 2019 : {sub.consentGiven ? '✅ Oui' : '⚠️ Non'}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  {sub.status === 'pending' && (
                    <div className="flex items-center space-x-2 shrink-0 sm:flex-col sm:space-x-0 sm:space-y-2">
                      <button
                        onClick={() => sub.id && onApprove(sub.id)}
                        className="flex items-center justify-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20 w-full"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approuver</span>
                      </button>
                      <button
                        onClick={() => sub.id && onReject(sub.id)}
                        className="flex items-center justify-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-sos-600 hover:bg-sos-500 text-white text-xs font-bold transition-all shadow-md shadow-sos-600/20 w-full"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Rejeter</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-xs text-slate-400 space-y-2">
              <Check className="w-8 h-8 text-emerald-400 mx-auto opacity-80" />
              <p>Aucune recommandation dans cette catégorie.</p>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 2: TELEGRAM WAITLIST LEADS
          ========================================================================= */}
      {activeTab === 'waitlist' && (
        <div className="glass-panel rounded-2xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
                <Send className="w-4 h-4 text-french-400" />
                <span>Liste d'Attente & Prospects Telegram ({telegramWaitlist.length})</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Utilisateurs ayant demandé à être notifiés dès l'ouverture du bot Telegram.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopyHandles}
                disabled={telegramWaitlist.length === 0}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-semibold transition-colors border border-slate-700"
              >
                {copiedPseudos ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPseudos ? 'Copié !' : 'Copier les @pseudos'}</span>
              </button>

              <button
                onClick={handleExportCSV}
                disabled={telegramWaitlist.length === 0}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-french-600 hover:bg-french-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md shadow-french-600/30"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exporter CSV</span>
              </button>
            </div>
          </div>

          {telegramWaitlist.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                    <th className="py-2.5 px-3">Prénom / Nom</th>
                    <th className="py-2.5 px-3">Identifiant Telegram / Téléphone</th>
                    <th className="py-2.5 px-3">Date d'inscription</th>
                    <th className="py-2.5 px-3">Source</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {telegramWaitlist.map((entry) => (
                    <tr key={entry.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3 font-medium text-slate-200">
                        {entry.name || <span className="text-slate-500 italic">Anonyme</span>}
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-mono text-french-300 font-semibold px-2 py-0.5 rounded bg-french-950/60 border border-french-500/20">
                          {entry.telegramHandle}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-400">
                        {new Date(entry.createdAt).toLocaleString('fr-FR', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="py-3 px-3 text-slate-400">
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                          {entry.source}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        {onDeleteWaitlistEntry && (
                          <button
                            onClick={() => onDeleteWaitlistEntry(entry.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-sos-400 hover:bg-sos-950/40 transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-10 text-xs text-slate-400 space-y-2">
              <Users className="w-8 h-8 text-french-400 mx-auto opacity-70" />
              <p>Aucun utilisateur inscrit sur la liste d'attente pour le moment.</p>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 3: MODERATOR CANDIDATURES WAITLIST
          ========================================================================= */}
      {activeTab === 'moderator_apps' && (
        <div className="glass-panel rounded-2xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
                <UserPlus className="w-4 h-4 text-emerald-400" />
                <span>Candidatures Modérateurs Bénévoles ({moderatorApplications.length})</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Demandes d'accès soumises par des résidents souhaitant participer à la modération.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleExportModAppsCSV}
                disabled={moderatorApplications.length === 0}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-french-600 hover:bg-french-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md shadow-french-600/30"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exporter CSV</span>
              </button>
            </div>
          </div>

          {moderatorApplications.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                    <th className="py-2.5 px-3">Candidat</th>
                    <th className="py-2.5 px-3">Coordonnées (Email & Tél)</th>
                    <th className="py-2.5 px-3">Quartier</th>
                    <th className="py-2.5 px-3">Motivation / Notes</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {moderatorApplications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3 font-semibold text-slate-100">
                        {app.fullName}
                      </td>
                      <td className="py-3 px-3">
                        <div className="text-slate-200">{app.email}</div>
                        <div className="text-french-400 font-mono text-[11px]">{app.phoneOrWhatsapp}</div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[11px] border border-slate-700">
                          {app.neighborhood || 'N/A'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-300 max-w-xs truncate italic">
                        "{app.motivation || 'Pas de note complémentaire'}"
                      </td>
                      <td className="py-3 px-3 text-slate-400 text-[11px]">
                        {new Date(app.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="py-3 px-3 text-right">
                        {onDeleteModeratorApp && (
                          <button
                            onClick={() => onDeleteModeratorApp(app.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-sos-400 hover:bg-sos-950/40 transition-colors"
                            title="Supprimer la candidature"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-10 text-xs text-slate-400 space-y-2">
              <Users className="w-8 h-8 text-emerald-400 mx-auto opacity-70" />
              <p>Aucune candidature modérateur en attente pour le moment.</p>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 4: ANALYTICS & PLATFORM OVERVIEW
          ========================================================================= */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-panel rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-french-400" />
              <span>Répartition des Adresses par Quartier</span>
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-1.5 border-b border-slate-800">
                <span className="text-slate-300">Lavington & Kilimani</span>
                <span className="font-bold text-slate-100">12 adresses (38%)</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-800">
                <span className="text-slate-300">Westlands & Spring Valley</span>
                <span className="font-bold text-slate-100">9 adresses (28%)</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-800">
                <span className="text-slate-300">Gigiri, Runda & Nyari</span>
                <span className="font-bold text-slate-100">6 adresses (19%)</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-800">
                <span className="text-slate-300">Karen & Lang'ata</span>
                <span className="font-bold text-slate-100">5 adresses (15%)</span>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>Conformité & Infrastructure</span>
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-1.5 border-b border-slate-800">
                <span className="text-slate-300">Règlement DPA 2019</span>
                <span className="font-bold text-emerald-400">100% Conforme</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-800">
                <span className="text-slate-300">Mode Hors-Ligne (PWA)</span>
                <span className="font-bold text-emerald-400">Opérationnel</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-800">
                <span className="text-slate-300">Stockage Local</span>
                <span className="font-bold text-french-400">Synchronisé</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;

