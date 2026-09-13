import React, { useState } from 'react';
import { CategoryId, NeighborhoodId, ProviderSubmission } from '../../types';
import { CATEGORIES, NEIGHBORHOODS } from '../../data/mockProviders';
import { PlusCircle, ShieldCheck, CheckCircle2, AlertTriangle, Send } from 'lucide-react';
import { motion } from 'framer-motion';

interface SubmitPageProps {
  onSubmitSuccess: (submission: ProviderSubmission) => void;
}

export const SubmitPage: React.FC<SubmitPageProps> = ({ onSubmitSuccess }) => {
  const [formData, setFormData] = useState({
    providerName: '',
    categoryId: 'fundis' as CategoryId,
    neighborhoodId: 'westlands' as Exclude<NeighborhoodId, 'all'>,
    phone: '',
    description: '',
    submitterName: '',
    submitterEmail: '',
    consentGiven: false
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.consentGiven) return;

    const newSubmission: ProviderSubmission = {
      id: Date.now().toString(),
      ...formData,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    onSubmitSuccess(newSubmission);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="glass-panel rounded-2xl p-8 text-center space-y-4 my-8 max-w-lg mx-auto">
        <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-100">Recommandation transmise !</h2>
        <p className="text-xs text-slate-300 leading-relaxed">
          Merci pour votre contribution au réseau Nairobi in ze Pocket ! Votre recommandation a été placée dans la file de modération des administrateurs Nairobi Accueil. Elle sera publiée après vérification des coordonnées.
        </p>
        <button
          onClick={() => {
            setIsSubmitted(false);
            setFormData({
              providerName: '',
              categoryId: 'fundis',
              neighborhoodId: 'westlands',
              phone: '',
              description: '',
              submitterName: '',
              submitterEmail: '',
              consentGiven: false
            });
          }}
          className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
        >
          Soumettre une autre adresse
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24 max-w-2xl mx-auto">
      {/* Header */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6 bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border-amber-500/20">
        <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-2">
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Entraide Communautaire</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-50 tracking-tight">
          Recommander une bonne adresse
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
          Vous connaissez un excellent artisan (*fundis*), chauffeur, médecin ou prestataire à Nairobi ? Proposez sa fiche aux autres membres !
        </p>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-5 sm:p-6 space-y-4">
        <div>
          <label htmlFor="providerName" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
            Nom de l'artisan / professionnel *
          </label>
          <input
            id="providerName"
            name="providerName"
            type="text"
            required
            placeholder="ex: Peter Fundi Plomberie & Fuites"
            value={formData.providerName}
            onChange={(e) => setFormData({ ...formData, providerName: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="categoryId" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
              Catégorie *
            </label>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value as CategoryId })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="neighborhoodId" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
              Quartier d'intervention *
            </label>
            <select
              id="neighborhoodId"
              name="neighborhoodId"
              value={formData.neighborhoodId}
              onChange={(e) => setFormData({ ...formData, neighborhoodId: e.target.value as Exclude<NeighborhoodId, 'all'> })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
            >
              {NEIGHBORHOODS.filter((n) => n.id !== 'all').map((n) => (
                <option key={n.id} value={n.id}>
                  {n.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
            Téléphone / WhatsApp du prestataire *
          </label>
          <input
            id="phone"
            name="phone"
            type="text"
            required
            placeholder="ex: +254 712 345 678"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
            Votre retour d'expérience & spécialité *
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={3}
            placeholder="Expliquez pourquoi vous recommandez ce service (dépannage rapide, ponctualité, tarifs...)"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="pt-2 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="submitterName" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
              Votre Prénom & Nom *
            </label>
            <input
              id="submitterName"
              name="submitterName"
              type="text"
              required
              placeholder="ex: Thomas Martin"
              value={formData.submitterName}
              onChange={(e) => setFormData({ ...formData, submitterName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label htmlFor="submitterEmail" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
              Votre e-mail membre *
            </label>
            <input
              id="submitterEmail"
              name="submitterEmail"
              type="email"
              required
              placeholder="ex: thomas@gmail.com"
              value={formData.submitterEmail}
              onChange={(e) => setFormData({ ...formData, submitterEmail: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Kenya DPA 2019 Consent Checkbox */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-amber-500/20 text-xs text-slate-300 space-y-2">
          <label htmlFor="consentGiven" className="flex items-start space-x-2 cursor-pointer">
            <input
              id="consentGiven"
              name="consentGiven"
              type="checkbox"
              required
              checked={formData.consentGiven}
              onChange={(e) => setFormData({ ...formData, consentGiven: e.target.checked })}
              className="mt-0.5 rounded border-slate-700 text-amber-500 focus:ring-amber-500 shrink-0"
            />
            <span className="text-[11px] leading-relaxed">
              <strong>Conformité Kenya Data Protection Act (DPA) 2019</strong> : Je certifie avoir obtenu le consentement du prestataire pour la publication de ses coordonnées au sein de l'annuaire réservé aux membres de la communauté francophone.
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={!formData.consentGiven}
          className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-extrabold text-xs transition-all shadow-md shadow-amber-500/20 flex items-center justify-center space-x-2"
        >
          <Send className="w-4 h-4" />
          <span>Soumettre pour modération Admin</span>
        </button>
      </form>
    </div>
  );
};

export default SubmitPage;
