import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  Send, 
  Sparkles, 
  X, 
  CheckCircle2, 
  Zap, 
  Heart, 
  ShieldCheck, 
  ArrowRight,
  ExternalLink 
} from 'lucide-react';

interface TelegramAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  botUsername?: string;
}

export const TelegramAnnouncementModal: React.FC<TelegramAnnouncementModalProps> = ({
  isOpen,
  onClose,
  botUsername = 'nairobiinzepocket_bot'
}) => {
  if (!isOpen) return null;

  const telegramUrl = `https://t.me/${botUsername}`;

  const handleOpenTelegram = () => {
    window.open(telegramUrl, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="telegram-modal-title"
      >
        {/* Animated backdrop & card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-amber-500/30 shadow-2xl shadow-amber-500/10 overflow-hidden"
        >
          {/* Ambient Lighting & Glows */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-amber-500/20 via-french-500/15 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-gradient-to-tr from-french-600/20 to-transparent rounded-full blur-2xl pointer-events-none -z-10" />

          {/* Close Button */}
          <button
            onClick={onClose}
            type="button"
            aria-label="Fermer cette annonce"
            className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition-colors border border-slate-700/60 z-10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Badge */}
          <div className="flex items-center space-x-2 mb-4">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/30 shadow-sm shadow-amber-500/10">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
              <span>GRANDE NOUVEAUTÉ • POCKETBOT 24/7</span>
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              Actif & Prêt
            </span>
          </div>

          {/* Bot Avatar + Title */}
          <div className="flex items-start space-x-4 mb-4">
            <div className="relative flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-french-600 p-0.5 shadow-lg shadow-amber-500/25">
              <div className="w-full h-full rounded-2xl bg-slate-900 flex items-center justify-center">
                <Bot className="w-8 h-8 text-amber-400 animate-pulse" />
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-slate-900" />
              </span>
            </div>

            <div className="flex-1 pr-6">
              <h2 
                id="telegram-modal-title"
                className="text-xl sm:text-2xl font-black text-slate-50 tracking-tight leading-tight"
              >
                Votre Assistant IA Telegram est en ligne ! 🎉
              </h2>
              <p className="text-xs text-amber-400 font-mono mt-0.5 font-bold">
                @{botUsername}
              </p>
            </div>
          </div>

          {/* Enthusiastic & Engaging Pitch */}
          <div className="space-y-3 mb-6">
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
              Plus besoin de chercher des heures ! Emportez dès maintenant toute l'entraide de <strong className="text-amber-400">Nairobi in ze Pocket</strong> directement dans votre poche sur <strong>Telegram</strong>.
            </p>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-start space-x-2.5">
                <div className="w-7 h-7 rounded-lg bg-french-600/20 text-french-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-100">Réponses 24/7 en français</h4>
                  <p className="text-[11px] text-slate-400 leading-snug">Artisans (*fundis*), médecins, nounous, écoles à Nairobi.</p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-start space-x-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-100">100% Vérifié & Gratuit</h4>
                  <p className="text-[11px] text-slate-400 leading-snug">Données certifiées par la communauté francophone.</p>
                </div>
              </div>
            </div>

            {/* Micro instruction */}
            <div className="p-2.5 rounded-xl bg-french-950/40 border border-french-500/20 text-[11px] text-french-200 flex items-center space-x-2">
              <span className="text-amber-400 text-sm">💡</span>
              <span>
                Cliquez ci-dessous, appuyez sur <strong>DÉMARRER</strong> (ou envoyez <strong>/start</strong>) et posez n'importe quelle question !
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5">
            <button
              onClick={handleOpenTelegram}
              type="button"
              className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-french-600 via-french-500 to-amber-500 hover:from-french-500 hover:to-amber-400 text-white font-black text-sm tracking-wide transition-all shadow-xl shadow-french-600/30 active:scale-[0.98] flex items-center justify-center space-x-2.5 cursor-pointer border border-white/10"
            >
              <Send className="w-4 h-4" />
              <span>Ouvrir PocketBot sur Telegram (/start)</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={onClose}
              type="button"
              className="w-full py-2.5 px-4 rounded-xl text-slate-400 hover:text-slate-200 text-xs font-semibold transition-colors hover:bg-slate-800/40 text-center cursor-pointer"
            >
              Continuer sur le site web
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TelegramAnnouncementModal;
