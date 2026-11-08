import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Zap 
} from 'lucide-react';
import { MOCK_PROVIDERS } from '../../data/mockProviders';
import { MOCK_EMERGENCY_CONTACTS } from '../../data/mockEmergency';
import { MOCK_GUIDES } from '../../data/mockGuides';
import { TelegramWaitlistEntry } from '../../types';

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

  const botUsername = 'nairobiinzepocket_bot';
  const telegramUrl = `https://t.me/${botUsername}`;

  const handleOpenTelegram = () => {
    window.open(telegramUrl, '_blank', 'noopener,noreferrer');
  };

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
            type="button"
            onClick={handleOpenTelegram}
            aria-label={`Ouvrir sur Telegram (@${botUsername})`}
            className="flex items-center justify-center space-x-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-gradient-to-r from-french-600 to-amber-500 hover:from-french-500 hover:to-amber-400 text-white font-extrabold text-xs transition-all shadow-lg shadow-french-600/30 shrink-0 active:scale-95 border border-white/10 cursor-pointer self-start"
          >
            <Send className="w-4 h-4" />
            <span>Ouvrir sur Telegram (@{botUsername})</span>
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
          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Voir le bot Telegram @${botUsername}`}
            className="text-[11px] text-amber-400 hover:text-amber-300 font-mono font-bold hover:underline flex items-center space-x-1 min-h-[44px]"
          >
            <span>@{botUsername}</span>
            <span className="text-[10px] text-emerald-400">● En direct</span>
          </a>
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
            type="button"
            onClick={() => handleSendMessage('Quel pédiatre francophone appeler ?')}
            className="px-3 py-2 min-h-[44px] inline-flex items-center rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs shrink-0 border border-slate-700"
          >
            🩺 Pédiatre francophone
          </button>
          <button
            type="button"
            onClick={() => handleSendMessage('Quel fundi plombier à Lavington ?')}
            className="px-3 py-2 min-h-[44px] inline-flex items-center rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs shrink-0 border border-slate-700"
          >
            🔧 Fundi plombier
          </button>
          <button
            type="button"
            onClick={() => handleSendMessage('Contrat et NSSF nounou')}
            className="px-3 py-2 min-h-[44px] inline-flex items-center rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs shrink-0 border border-slate-700"
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
            id="bot-query-input"
            name="botQuery"
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Posez votre question à PocketBot..."
            aria-label="Posez votre question à PocketBot"
            className="flex-1 px-4 py-2.5 min-h-[44px] rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
          />
          <button
            type="submit"
            aria-label="Envoyer le message à PocketBot"
            className="p-2.5 min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold transition-all active:scale-95 shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default BotPage;
