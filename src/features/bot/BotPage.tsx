import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  MessageSquare, 
  ShieldCheck, 
  User, 
  Zap, 
  X, 
  CheckCircle2, 
  Clock, 
  BellRing,
  AtSign
} from 'lucide-react';
import { MOCK_PROVIDERS } from '../../data/mockProviders';
import { MOCK_EMERGENCY_CONTACTS } from '../../data/mockEmergency';
import { MOCK_GUIDES } from '../../data/mockGuides';
import { motion, AnimatePresence } from 'framer-motion';

import { Guide, TelegramWaitlistEntry } from '../../types';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

interface BotPageProps {
  onJoinWaitlist?: (entry: TelegramWaitlistEntry) => void;
}

export const BotPage: React.FC<BotPageProps> = ({ onJoinWaitlist }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'bot',
      text: "Jambo ! Je suis PocketBot 🤖, votre assistant IA 24/7 pour Nairobi. Posez-moi vos questions sur les pédiatres, fundis, contrats de nounous ou urgences à n'importe quelle heure du jour ou de la nuit !",
      timestamp: '12:00'
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [telegramHandle, setTelegramHandle] = useState('');
  const [visitorName, setVisitorName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setIsTyping(true);

    // Simulate AI / Knowledge RAG match
    setTimeout(() => {
      let botResponse = generateBotAnswer(query);

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: botResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 700);
  };

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!telegramHandle.trim()) return;

    const newEntry: TelegramWaitlistEntry = {
      id: `waitlist-${Date.now()}`,
      name: visitorName.trim() || undefined,
      telegramHandle: telegramHandle.trim(),
      source: 'Modal PocketBot Telegram',
      createdAt: new Date().toISOString()
    };

    if (onJoinWaitlist) {
      onJoinWaitlist(newEntry);
    }

    setIsSubmitted(true);
  };

  const resetModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setIsSubmitted(false);
      setTelegramHandle('');
      setVisitorName('');
    }, 300);
  };

  const generateBotAnswer = (q: string): string => {
    const lower = q.toLowerCase();

    if (lower.includes('urgence') || lower.includes('hôpital') || lower.includes('hopital') || lower.includes('ambulance') || lower.includes('accident')) {
      const hospital = MOCK_EMERGENCY_CONTACTS[0];
      const hospital2 = MOCK_EMERGENCY_CONTACTS[1];
      return `🚨 URGENCES VITALES NAIROBI :\n• ${hospital.title} : 📞 ${hospital.phone}\n• ${hospital2.title} : 📞 ${hospital2.phone}\n• Ambulances AAR : 📞 +254 722 250 250\n\nN'hésitez pas à cliquer sur l'onglet Urgences pour passer un appel direct SOS.`;
    }

    if (lower.includes('pédiatre') || lower.includes('pediatre') || lower.includes('médecin') || lower.includes('medecin') || lower.includes('santé')) {
      const doctors = MOCK_PROVIDERS.filter((p) => p.categoryId === 'sante');
      return `🩺 Voici les médecins & hôpitaux vérifiés dans notre annuaire :\n\n${doctors
        .map((d) => `• ${d.name} (${d.specialty} à ${d.neighborhoodId}) : 📞 ${d.phone}`)
        .join('\n')}\n\nRetrouvez tous les détails dans l'onglet Annuaire.`;
    }

    if (lower.includes('fundi') || lower.includes('plombier') || lower.includes('électricité') || lower.includes('electricite')) {
      const fundis = MOCK_PROVIDERS.filter((p) => p.categoryId === 'fundis');
      return `🔧 Voici les artisans & fundis recommandés par les membres :\n\n${fundis
        .map((f) => `• ${f.name} (${f.specialty}) : 📞 ${f.phone}`)
        .join('\n')}`;
    }

    if (lower.includes('nounou') || lower.includes('personnel') || lower.includes('contrat') || lower.includes('nssf') || lower.includes('salaire')) {
      const guide = MOCK_GUIDES[0];
      return `📄 Fiche Pratique Personnel de Maison :\nAu Kenya, l'embauche est encadrée par l'Employment Act 2007. Les cotisations obligatoires sont la NSSF (retraite) et SHIF (santé).\n\n💡 Consultez le guide complet "${guide.title}" dans la section Guides de l'app !`;
    }

    if (lower.includes('école') || lower.includes('ecole') || lower.includes('lycée') || lower.includes('lycee') || lower.includes('diderot')) {
      const school = MOCK_PROVIDERS.find((p) => p.id === 'p9');
      return `🏫 Éducation à Nairobi :\n• ${school?.name} : Enseignement homologué AEFE de la maternelle à la terminale à Lavington. 📞 ${school?.phone}\n• Également des tuteurs francophones disponibles dans l'annuaire !`;
    }

    return `🤖 J'ai bien noté votre recherche "${q}".\nNos membres recommandent de consulter l'Annuaire par quartier ou les Guides d'installation. Vous pouvez aussi utiliser le simulateur ci-dessous pour tester d'autres requêtes !`;
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Bot Banner */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6 bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border-amber-500/20">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Assistant Telegram 24/7</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-50 tracking-tight">
              PocketBot Telegram & IA
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
              Un assistant intelligent disponible à toute heure dans Telegram pour répondre à toutes vos questions d'installation et de vie quotidienne à Nairobi.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-french-600 hover:bg-french-500 text-white font-extrabold text-xs transition-all shadow-lg shadow-french-600/30 shrink-0 active:scale-95 border border-french-400/20 cursor-pointer self-start"
          >
            <Send className="w-4 h-4" />
            <span>Ouvrir sur Telegram</span>
          </button>
        </div>
      </div>

      {/* Interactive Web App Simulator Container */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 flex flex-col h-[480px] justify-between border-slate-700/80">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">Simulateur PocketBot</h3>
              <p className="text-[10px] text-emerald-400 font-medium flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping mr-1" />
                En ligne 24/7 • Connecté à la base de données
              </p>
            </div>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">@NairobiInZePocketBot</span>
        </div>

        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3 px-1">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-french-600 text-white rounded-br-none'
                    : 'bg-slate-800/90 text-slate-100 border border-slate-700/80 rounded-bl-none shadow-md'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>
                <div
                  className={`text-[9px] mt-1 text-right ${
                    msg.sender === 'user' ? 'text-french-200' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl rounded-bl-none px-4 py-2.5 text-xs text-slate-400 flex items-center space-x-2">
                <Bot className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                <span>PocketBot recherche dans la base de connaissances...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex items-center space-x-2 overflow-x-auto py-2 border-t border-slate-800 no-scrollbar text-xs">
          <span className="text-[10px] text-slate-500 font-bold shrink-0">Essayer :</span>
          <button
            onClick={() => handleSendMessage('Quel pédiatre francophone appeler ?')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] shrink-0 border border-slate-700"
          >
            🩺 Pédiatre francophone
          </button>
          <button
            onClick={() => handleSendMessage('Quel fundi plombier à Lavington ?')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] shrink-0 border border-slate-700"
          >
            🔧 Fundi plombier
          </button>
          <button
            onClick={() => handleSendMessage('Contrat et NSSF nounou')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] shrink-0 border border-slate-700"
          >
            📄 Contrat Nounou NSSF
          </button>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center space-x-2 pt-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Posez votre question à PocketBot..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
          />
          <button
            type="submit"
            className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold transition-all active:scale-95 shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Telegram Under Development Waitlist Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="glass-panel w-full max-w-md rounded-2xl p-6 sm:p-7 relative bg-slate-900 border border-french-500/30 shadow-2xl space-y-5"
            >
              {/* Close Button */}
              <button
                onClick={resetModal}
                className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors border border-slate-700/50"
                aria-label="Fermer"
              >
                <X className="w-4 h-4" />
              </button>

              {!isSubmitted ? (
                <>
                  {/* Header */}
                  <div className="space-y-2">
                    <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      <Clock className="w-3.5 h-3.5 animate-pulse" />
                      <span>En cours de finalisation</span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-extrabold text-slate-50 tracking-tight flex items-center gap-2">
                      <span>Bot Telegram en développement</span>
                    </h3>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      L'intégration directe de <strong>@NairobiInZePocketBot</strong> sur Telegram est actuellement en phase finale de tests par notre équipe technique.
                    </p>
                  </div>

                  {/* Benefit Card */}
                  <div className="p-3.5 rounded-xl bg-french-950/40 border border-french-500/20 flex items-start space-x-3 text-xs text-french-200">
                    <BellRing className="w-4 h-4 text-french-400 shrink-0 mt-0.5" />
                    <p className="leading-snug">
                      Indiquez votre identifiant Telegram ou votre numéro pour être alerté(e) en priorité dès son ouverture officielle aux résidents !
                    </p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleModalSubmit} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Votre Prénom / Nom <span className="text-slate-500 font-normal">(optionnel)</span>
                      </label>
                      <input
                        type="text"
                        value={visitorName}
                        onChange={(e) => setVisitorName(e.target.value)}
                        placeholder="Ex: Sophie M."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-french-500 focus:ring-1 focus:ring-french-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Votre Telegram (@pseudo ou téléphone) <span className="text-amber-400">*</span>
                      </label>
                      <div className="relative">
                        <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={telegramHandle}
                          onChange={(e) => setTelegramHandle(e.target.value)}
                          placeholder="@mon_pseudo_telegram ou +254 7..."
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-french-500 focus:ring-1 focus:ring-french-500 transition-all"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-end space-x-2.5">
                      <button
                        type="button"
                        onClick={resetModal}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-french-600 hover:bg-french-500 text-white text-xs font-bold transition-all shadow-md shadow-french-600/30 active:scale-95 flex items-center space-x-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Rejoindre la liste prioritaire</span>
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                /* Success State */
                <div className="py-4 text-center space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-lg font-extrabold text-slate-50">
                      C'est bien noté {visitorName ? visitorName : ''} !
                    </h3>
                    <p className="text-xs text-slate-300 max-w-xs mx-auto leading-relaxed">
                      Votre identifiant <span className="font-mono text-french-300 font-semibold">{telegramHandle}</span> a été ajouté à la liste d'accès prioritaire. Vous recevrez une notification privée dès le lancement du bot !
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={resetModal}
                      className="w-full py-2.5 rounded-xl bg-french-600 hover:bg-french-500 text-white text-xs font-bold transition-all shadow-md shadow-french-600/30"
                    >
                      Retourner au simulateur
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BotPage;
