import React, { useState } from 'react';
import { X, Phone, MessageCircle, MapPin, Star, CheckCircle2, Mail, Globe, Shield, AlertTriangle } from 'lucide-react';
import { Provider } from '../../types';
import { CATEGORIES, NEIGHBORHOODS } from '../../data/mockProviders';
import { motion, AnimatePresence } from 'framer-motion';

interface ProviderModalProps {
  provider: Provider | null;
  onClose: () => void;
}

export const ProviderModal: React.FC<ProviderModalProps> = ({ provider, onClose }) => {
  const [showContributor, setShowContributor] = useState(false);

  if (!provider) return null;

  const category = CATEGORIES.find((c) => c.id === provider.categoryId);
  const neighborhood = NEIGHBORHOODS.find((n) => n.id === provider.neighborhoodId);

  const cleanPhone = (provider.phone || '').replace(/\s+/g, '');
  const isCallable = /^[+]?[0-9\s()-]{6,}$/.test((provider.phone || '').trim());
  const hasValidWhatsapp = provider.whatsapp ? /^[+]?[0-9\s()-]{6,}$/.test(provider.whatsapp.trim()) : false;
  const cleanWhatsapp = provider.whatsapp ? provider.whatsapp.replace(/\s+/g, '') : cleanPhone;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="glass-panel w-full max-w-lg rounded-2xl p-6 relative max-h-[90vh] overflow-y-auto"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-slate-700/50 text-slate-400 hover:text-slate-100 hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badges */}
          <div className="flex items-center space-x-2 mb-3">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/25">
              {category?.name}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800/80 text-slate-300 border border-white/5">
              📍 {neighborhood?.name}
            </span>
            {provider.isVerified && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Vérifié Nairobi Accueil</span>
              </span>
            )}
          </div>

          {/* Header Title */}
          <h2 className="text-xl font-bold text-slate-50 mb-1">{provider.name}</h2>
          <p className="text-sm font-semibold text-amber-400 mb-4">{provider.specialty}</p>

          {/* Rating */}
          <div className="flex items-center space-x-2 mb-4 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center text-amber-400 font-bold text-base">
              <Star className="w-4 h-4 fill-amber-400 mr-1" />
              <span>{provider.rating.toFixed(1)}</span>
            </div>
            <span className="text-xs text-slate-400">({provider.reviewsCount} avis de membres vérifiés)</span>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">À propos</h4>
            <p className="text-sm text-slate-200 leading-relaxed bg-slate-900/40 p-3 rounded-xl border border-slate-800">
              {provider.description}
            </p>
          </div>

          {/* Details & Address */}
          <div className="space-y-2.5 text-xs text-slate-300 mb-6">
            {isCallable && (
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-semibold text-slate-200">{provider.phone}</span>
              </div>
            )}
            {provider.address && (
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>{provider.address}</span>
              </div>
            )}
            {provider.email && (
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{provider.email}</span>
              </div>
            )}
            {provider.website && (
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-slate-400 shrink-0" />
                <a href={provider.website} target="_blank" rel="noopener noreferrer" className="text-french-400 hover:underline">
                  {provider.website}
                </a>
              </div>
            )}
          </div>
          {/* Community Source & Verification Box */}
          {provider.sourceInfo && (
            <div className="mb-6 p-3.5 rounded-xl bg-slate-900/80 border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="inline-flex items-center space-x-1.5 font-bold text-emerald-400">
                  <Shield className="w-4 h-4" />
                  <span>Badge : {provider.sourceInfo.badge}</span>
                </span>
                <span className="text-[11px] text-slate-400">
                  Upload : {new Date(provider.sourceInfo.uploadedAt).toLocaleDateString('fr-FR')}
                </span>
              </div>

              {/* Click to Reveal Contributor */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Source de recommandation :</span>
                <button
                  type="button"
                  onClick={() => setShowContributor((prev) => !prev)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 font-semibold border border-amber-500/30 transition-all text-xs flex items-center space-x-1"
                >
                  <span>{showContributor ? `👤 ${provider.sourceInfo.contributorRevealed}` : '👁️ Voir qui a recommandé'}</span>
                </button>
              </div>

              {provider.pricingNotes && (
                <div className="text-[11px] text-slate-300 pt-1 border-t border-slate-800">
                  💰 <span className="font-semibold text-amber-400">Tarifs / Notes :</span> {provider.pricingNotes}
                </div>
              )}
            </div>
          )}

          {/* DPA 2019 Disclaimer Banner */}
          <div className="mb-6 p-3 rounded-xl bg-slate-900/80 border border-amber-500/20 text-[11px] text-slate-400 flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong>Conformité Kenya DPA 2019</strong> : Coordonnées certifiées par la communauté Nairobi Accueil. Diffusion réservée à un usage privé.
            </span>
          </div>

          {/* Primary Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {isCallable ? (
              <a
                href={`tel:${cleanPhone}`}
                className="flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-french-600 hover:bg-french-700 text-white font-bold text-sm transition-all shadow-md shadow-french-600/20"
              >
                <Phone className="w-4 h-4" />
                <span>Appeler</span>
              </a>
            ) : (
              <div className="flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-slate-800 text-slate-300 font-medium text-xs border border-slate-750">
                <span>📅 {provider.phone}</span>
              </div>
            )}

            {provider.whatsapp && hasValidWhatsapp && (
              <a
                href={`https://wa.me/${cleanWhatsapp.replace('+', '')}?text=Bonjour,%20je%20vous%20contacte%20via%20Nairobi%20in%20ze%20Pocket`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all shadow-md shadow-emerald-600/20"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Ouvrir WhatsApp</span>
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProviderModal;
