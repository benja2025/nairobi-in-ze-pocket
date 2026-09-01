import React from 'react';
import { Phone, MessageCircle, MapPin, Star, CheckCircle2, Globe, Mail } from 'lucide-react';
import { Provider } from '../../types';
import { CATEGORIES, NEIGHBORHOODS } from '../../data/mockProviders';
import { motion } from 'framer-motion';

interface ProviderCardProps {
  provider: Provider;
  onSelect: (provider: Provider) => void;
}

export const ProviderCard: React.FC<ProviderCardProps> = ({ provider, onSelect }) => {
  const category = CATEGORIES.find((c) => c.id === provider.categoryId);
  const neighborhood = NEIGHBORHOODS.find((n) => n.id === provider.neighborhoodId);

  const cleanPhone = (provider.phone || '').replace(/\s+/g, '');
  const isCallable = /^[+]?[0-9\s()-]{6,}$/.test((provider.phone || '').trim());
  const hasValidWhatsapp = provider.whatsapp ? /^[+]?[0-9\s()-]{6,}$/.test(provider.whatsapp.trim()) : false;
  const cleanWhatsapp = provider.whatsapp ? provider.whatsapp.replace(/\s+/g, '') : cleanPhone;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="glass-panel provider-card-contain rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:border-white/20 transition-all min-h-[220px]"
    >
      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/25">
              {category?.name || provider.categoryId}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800/80 text-slate-300 border border-white/5">
              {neighborhood?.name.split('/')[0] || provider.neighborhoodId}
            </span>
          </div>

          {provider.isVerified && (
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>Vérifié</span>
            </span>
          )}
        </div>

        {/* Title & Specialty */}
        <h3
          onClick={() => onSelect(provider)}
          className="text-base font-bold text-slate-50 hover:text-amber-400 transition-colors cursor-pointer"
        >
          {provider.name}
        </h3>
        <p className="text-xs font-semibold text-amber-400/90 mb-2">
          {provider.specialty}
        </p>

        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-3">
          {provider.description}
        </p>

        {/* Rating, Languages & Source Badge */}
        <div className="space-y-2 mb-4 pt-2 border-t border-white/5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center space-x-1 text-amber-400 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{provider.rating.toFixed(1)}</span>
              <span className="text-slate-400 font-normal">({provider.reviewsCount})</span>
            </div>
            <div className="text-[11px] text-slate-400 font-medium">
              🗣️ {provider.languages.join(', ')}
            </div>
          </div>

          {/* Verification Source Metadata Badge */}
          {provider.sourceInfo && (
            <div className="flex items-center justify-between text-[11px] pt-1 text-slate-300 bg-slate-900/60 px-2.5 py-1.5 rounded-lg border border-white/5">
              <span className="inline-flex items-center space-x-1 text-emerald-400 font-semibold">
                <span>🛡️ {provider.sourceInfo.badge}</span>
              </span>
              <span className="text-slate-400 text-[10px]">
                {provider.sourceInfo.contributorMasked}
              </span>
            </div>
          )}

          {/* Non-phone information or notice (e.g. Mise à jour : Mars 2025) */}
          {!isCallable && provider.phone && (
            <div className="text-[11px] text-slate-300 bg-slate-850/90 px-2.5 py-1 rounded-lg border border-white/5 flex items-center justify-between">
              <span className="text-amber-400 font-medium">📅 {provider.phone}</span>
            </div>
          )}
        </div>
      </div>

      {/* Touch Action Buttons */}
      <div className={`grid ${isCallable && provider.whatsapp && hasValidWhatsapp ? 'grid-cols-3' : 'grid-cols-2'} gap-2 pt-2`}>
        {isCallable && (
          <a
            href={`tel:${cleanPhone}`}
            className="flex items-center justify-center space-x-1.5 py-2 px-2 rounded-xl bg-french-600/20 hover:bg-french-600/30 text-french-400 border border-french-500/30 text-xs font-semibold transition-all active:scale-95 text-center"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Appeler</span>
          </a>
        )}

        {provider.whatsapp && hasValidWhatsapp && (
          <a
            href={`https://wa.me/${cleanWhatsapp.replace('+', '')}?text=Bonjour,%20je%20vous%20contacte%20via%20Nairobi%20in%20ze%20Pocket`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center space-x-1.5 py-2 px-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 text-xs font-bold transition-all active:scale-95 text-center shadow-sm shadow-emerald-950/40"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>
        )}

        {provider.website && (
          <a
            href={provider.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center space-x-1.5 py-2 px-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-white/10 text-xs font-semibold transition-all active:scale-95 text-center"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Site web</span>
          </a>
        )}

        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            `${provider.name} ${provider.address || provider.neighborhoodId} Nairobi`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center space-x-1.5 py-2 px-2 rounded-xl bg-slate-800/80 hover:bg-slate-750 text-slate-300 border border-white/10 text-xs font-semibold transition-all active:scale-95 text-center"
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Maps</span>
        </a>
      </div>
    </motion.div>
  );
};

export default ProviderCard;
