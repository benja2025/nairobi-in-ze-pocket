import React from 'react';
import { Compass, ShieldAlert, ArrowLeft, Home, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface NotFoundPageProps {
  onGoHome: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onGoHome }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="glass-panel max-w-lg w-full rounded-3xl p-8 sm:p-10 border-amber-500/20 relative overflow-hidden shadow-2xl shadow-slate-950/80"
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-1/2 translate-x-1/2 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Minimalist 404 Badge */}
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/25 mb-6">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
          <span>Hors Piste • Erreur 404</span>
        </div>

        {/* Compass Graphic with Pulse */}
        <div className="relative mx-auto mb-6 flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-tr from-safari-600/30 via-amber-500/20 to-french-600/30 border border-white/10 shadow-lg shadow-amber-500/10">
          <Compass className="w-10 h-10 text-amber-400 animate-spin" style={{ animationDuration: '24s' }} />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500" />
          </span>
        </div>

        {/* Headline & Subtle Humor for bypassers */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-50 tracking-tight mb-2">
          Vous êtes sortis du périmètre !
        </h2>
        
        <p className="text-sm text-slate-300 leading-relaxed mb-6 max-w-md mx-auto">
          Même la boussole de Karura Forest ne retrouve pas cette destination. Nairobi in ze Pocket est une application communautaire bien balisée.
        </p>

        {/* Micro-notice DPA / Sécurité */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 text-[11px] text-slate-400 mb-8 flex items-center justify-center space-x-2">
          <span>🔒 Accès certifié et protégé par la communauté Nairobi Accueil</span>
        </div>

        {/* Action Button */}
        <button
          onClick={onGoHome}
          type="button"
          className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span>Retourner à l'annuaire</span>
        </button>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
