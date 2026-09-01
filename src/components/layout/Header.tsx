import React from 'react';
import { Compass, ShieldCheck, PhoneCall, Sparkles } from 'lucide-react';

interface HeaderProps {
  onOpenSos: () => void;
  activeTab: string;
  onGoHome?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSos, activeTab, onGoHome }) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-3 sm:px-6">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        {/* Brand & Logo (Clickable Home Action) */}
        <button
          onClick={onGoHome}
          type="button"
          aria-label="Retour à l'accueil"
          className="flex items-center space-x-3 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-xl transition-transform active:scale-95"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-safari-600 via-amber-500 to-french-600 shadow-md shadow-amber-500/20 group-hover:shadow-amber-500/40 group-hover:scale-105 transition-all">
            <Compass className="w-5 h-5 text-white animate-pulse" />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-slate-50 group-hover:text-amber-300 transition-colors">
                Nairobi <span className="text-amber-400">in ze Pocket</span>
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-french-600/20 text-french-400 border border-french-500/30">
                French Tech
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium hidden xs:block group-hover:text-slate-300 transition-colors">
              Communauté & Annuaire Expat • Nairobi Accueil
            </p>
          </div>
        </button>

        {/* Action Header Buttons */}
        <div className="flex items-center space-x-2">
          {/* Quick SOS Trigger */}
          <button
            onClick={onOpenSos}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-sos-600/20 hover:bg-sos-600/30 text-sos-400 border border-sos-600/40 text-xs font-semibold transition-all active:scale-95 shadow-sm shadow-sos-600/10"
            title="Numéros d'Urgence SOS"
          >
            <PhoneCall className="w-3.5 h-3.5 animate-bounce" />
            <span>SOS Urgences</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
