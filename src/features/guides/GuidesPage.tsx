import React, { useState } from 'react';
import { MOCK_GUIDES } from '../../data/mockGuides';
import { Guide } from '../../types';
import { 
  BookOpen, 
  Clock, 
  ChevronRight, 
  Search, 
  X, 
  CheckCircle2, 
  Lightbulb, 
  UserCheck, 
  Calendar,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const GuidesPage: React.FC = () => {
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGuides = MOCK_GUIDES.filter(
    (g) =>
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-24">
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6 bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border-french-500/20">
        <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-french-600/20 text-french-400 border border-french-500/30 mb-2">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Guides d'Installation Expat</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-50 tracking-tight">
          Karibuni Nairobi : Fiches Pratiques & Guides de Vie
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
          Ressources concrètes rédigées par des résidents et professionnels francophones : installation, démarches juridiques, santé, scolarité et logement à Nairobi.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher dans les guides (contrat, NSSF, Denis Diderot, quartier, hôpital...)"
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-french-500 focus:ring-1 focus:ring-french-500 transition-all"
        />
      </div>

      {/* Guides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {filteredGuides.map((guide) => (
          <motion.div
            key={guide.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -3 }}
            onClick={() => setSelectedGuide(guide)}
            className="glass-panel rounded-2xl overflow-hidden cursor-pointer hover:border-french-500/50 transition-all flex flex-col justify-between group shadow-lg shadow-black/20"
          >
            <div>
              {/* Image Banner */}
              {guide.imageUrl && (
                <div className="relative h-44 w-full overflow-hidden bg-slate-800">
                  <img
                    src={guide.imageUrl}
                    alt={guide.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-french-300 border border-french-500/30 text-xs font-semibold">
                    {guide.category}
                  </span>
                </div>
              )}

              <div className="p-5">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2.5">
                  <div className="flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-french-400" />
                    <span>{guide.readTimeMinutes} min de lecture</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{guide.updatedAt}</span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-100 group-hover:text-french-400 transition-colors mb-2.5 leading-snug">
                  {guide.title}
                </h3>
                
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-3">
                  {guide.summary}
                </p>

                {guide.keyTakeaways && guide.keyTakeaways.length > 0 && (
                  <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-[11px] text-slate-300 space-y-1">
                    <div className="flex items-center space-x-1 font-semibold text-french-400">
                      <Sparkles className="w-3 h-3" />
                      <span>Point clé :</span>
                    </div>
                    <p className="line-clamp-2 italic text-slate-300">
                      "{guide.keyTakeaways[0]}"
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-5 pt-0">
              <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-700/50 text-french-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                <span>Consulter le guide complet</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Full Guide Article Modal */}
      <AnimatePresence>
        {selectedGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              className="glass-panel w-full max-w-3xl rounded-2xl relative max-h-[90vh] overflow-y-auto bg-slate-900 border border-french-500/30 shadow-2xl my-auto flex flex-col"
            >
              {/* Header with image */}
              <div className="relative h-56 sm:h-64 w-full bg-slate-800 shrink-0">
                {selectedGuide.imageUrl && (
                  <img
                    src={selectedGuide.imageUrl}
                    alt={selectedGuide.title}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-slate-950/40" />

                {/* Close button */}
                <button
                  onClick={() => setSelectedGuide(null)}
                  className="absolute top-4 right-4 p-2 rounded-xl bg-slate-950/70 text-slate-300 hover:text-white hover:bg-slate-900 backdrop-blur-md transition-colors border border-white/10"
                  aria-label="Fermer"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Badges on hero */}
                <div className="absolute bottom-4 left-5 right-5">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="px-3 py-0.5 rounded-full bg-french-600/90 text-white font-semibold text-xs backdrop-blur-md shadow">
                      {selectedGuide.category}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-900/80 text-slate-300 text-xs backdrop-blur-md border border-slate-700/50 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-french-400" />
                      {selectedGuide.readTimeMinutes} min de lecture
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-900/80 text-slate-300 text-xs backdrop-blur-md border border-slate-700/50 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      Mis à jour le {selectedGuide.updatedAt}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight drop-shadow-md">
                    {selectedGuide.title}
                  </h2>
                </div>
              </div>

              {/* Guide Content Body */}
              <div className="p-5 sm:p-7 space-y-6 overflow-y-auto">
                {/* Introduction / Summary */}
                <div className="p-4 rounded-xl bg-french-950/40 border border-french-500/20 text-sm text-slate-200 leading-relaxed">
                  <p className="font-medium text-french-200">
                    {selectedGuide.summary}
                  </p>
                </div>

                {/* Key Takeaways Card */}
                {selectedGuide.keyTakeaways && selectedGuide.keyTakeaways.length > 0 && (
                  <div className="p-5 rounded-2xl bg-slate-850 border border-slate-700/70 shadow-sm space-y-3">
                    <div className="flex items-center space-x-2 text-french-400 font-bold text-sm">
                      <Sparkles className="w-4 h-4 text-french-400" />
                      <span>Ce qu'il faut retenir en un coup d'œil</span>
                    </div>
                    <ul className="space-y-2 text-xs sm:text-sm text-slate-200">
                      {selectedGuide.keyTakeaways.map((item, idx) => (
                        <li key={idx} className="flex items-start space-x-2.5">
                          <CheckCircle2 className="w-4 h-4 text-french-400 shrink-0 mt-0.5" />
                          <span className="leading-snug">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Structured Sections */}
                {selectedGuide.sections && selectedGuide.sections.length > 0 ? (
                  <div className="space-y-6">
                    {selectedGuide.sections.map((section, sIdx) => (
                      <div key={sIdx} className="space-y-3 pt-2">
                        <h3 className="text-base sm:text-lg font-bold text-slate-100 flex items-center space-x-2">
                          <span className="text-french-400">{section.title}</span>
                        </h3>
                        
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                          {section.content}
                        </p>

                        {section.bulletPoints && section.bulletPoints.length > 0 && (
                          <div className="space-y-2 pl-1">
                            {section.bulletPoints.map((point, pIdx) => (
                              <div key={pIdx} className="flex items-start space-x-2.5 text-xs sm:text-sm text-slate-300">
                                <div className="w-1.5 h-1.5 rounded-full bg-french-400 shrink-0 mt-2" />
                                <span className="leading-relaxed">{point}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {section.tip && (
                          <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs sm:text-sm">
                            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            <div>
                              <strong className="text-amber-300 font-semibold">Conseil pratique : </strong>
                              <span className="text-slate-200">{section.tip}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Fallback if legacy contentMd */
                  <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-line bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                    {selectedGuide.contentMd}
                  </div>
                )}

                {/* Footer and Sign-off */}
                <div className="mt-8 pt-5 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-2.5 text-xs text-slate-400">
                    <UserCheck className="w-4 h-4 text-french-400" />
                    <span>Fiche rédigée par : <strong className="text-slate-200">{selectedGuide.author}</strong></span>
                  </div>
                  <button
                    onClick={() => setSelectedGuide(null)}
                    className="px-5 py-2.5 rounded-xl bg-french-600 hover:bg-french-500 text-white text-xs sm:text-sm font-semibold transition-colors shadow-md shadow-french-600/30 text-center"
                  >
                    Fermer la fiche
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GuidesPage;

