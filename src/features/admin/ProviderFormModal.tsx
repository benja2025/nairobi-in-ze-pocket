import React, { useState, useEffect } from 'react';
import { CategoryId, NeighborhoodId, Provider, SourceBadge } from '../../types';
import { CATEGORIES, NEIGHBORHOODS } from '../../data/mockProviders';
import { 
  X, 
  Save, 
  Sparkles, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Tag, 
  FileText, 
  Check, 
  Star,
  DollarSign
} from 'lucide-react';
import { motion } from 'framer-motion';

interface ProviderFormModalProps {
  isOpen: boolean;
  provider: Provider | null; // null for creation mode, Provider for edit mode
  onClose: () => void;
  onSave: (providerData: Provider) => void;
}

const AVAILABLE_LANGUAGES = ['Français', 'Anglais', 'Swahili', 'Italien', 'Espagnol', 'Allemand'];
const SOURCE_BADGES: SourceBadge[] = ['Nairobi Accueil', 'WhatsApp Verified', 'Ambassade', 'Direct Submission'];

export const ProviderFormModal: React.FC<ProviderFormModalProps> = ({
  isOpen,
  provider,
  onClose,
  onSave
}) => {
  const isEdit = Boolean(provider);

  // Form states
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState<CategoryId>('sante');
  const [neighborhoodId, setNeighborhoodId] = useState<Exclude<NeighborhoodId, 'all'>>('westlands');
  const [specialty, setSpecialty] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [address, setAddress] = useState('');
  const [pricingNotes, setPricingNotes] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['Français', 'Anglais']);
  const [tagsInput, setTagsInput] = useState('');
  const [isVerified, setIsVerified] = useState(true);
  const [rating, setRating] = useState<number>(5.0);
  const [reviewsCount, setReviewsCount] = useState<number>(1);
  const [sourceBadge, setSourceBadge] = useState<SourceBadge>('Nairobi Accueil');
  const [contributorMasked, setContributorMasked] = useState('Recommandé par le bureau');
  const [contributorRevealed, setContributorRevealed] = useState('Admin Nairobi Accueil');
  const [originalNotes, setOriginalNotes] = useState('');

  // Populate form on open or provider change
  useEffect(() => {
    if (provider) {
      setName(provider.name || '');
      setCategoryId(provider.categoryId || 'sante');
      setNeighborhoodId(provider.neighborhoodId || 'westlands');
      setSpecialty(provider.specialty || '');
      setDescription(provider.description || '');
      setPhone(provider.phone || '');
      setWhatsapp(provider.whatsapp || '');
      setEmail(provider.email || '');
      setWebsite(provider.website || '');
      setAddress(provider.address || '');
      setPricingNotes(provider.pricingNotes || '');
      setSelectedLanguages(provider.languages?.length ? provider.languages : ['Français', 'Anglais']);
      setTagsInput(provider.tags ? provider.tags.join(', ') : '');
      setIsVerified(provider.isVerified ?? true);
      setRating(provider.rating ?? 5.0);
      setReviewsCount(provider.reviewsCount ?? 1);
      setSourceBadge(provider.sourceInfo?.badge || 'Nairobi Accueil');
      setContributorMasked(provider.sourceInfo?.contributorMasked || 'Recommandé par un membre');
      setContributorRevealed(provider.sourceInfo?.contributorRevealed || 'Admin Nairobi Accueil');
      setOriginalNotes(provider.sourceInfo?.originalNotes || '');
    } else {
      // Reset for new creation
      setName('');
      setCategoryId('sante');
      setNeighborhoodId('westlands');
      setSpecialty('');
      setDescription('');
      setPhone('+254 ');
      setWhatsapp('');
      setEmail('');
      setWebsite('');
      setAddress('');
      setPricingNotes('');
      setSelectedLanguages(['Français', 'Anglais']);
      setTagsInput('');
      setIsVerified(true);
      setRating(5.0);
      setReviewsCount(1);
      setSourceBadge('Nairobi Accueil');
      setContributorMasked('Recommandé par le bureau');
      setContributorRevealed('Admin Nairobi Accueil');
      setOriginalNotes('');
    }
  }, [provider, isOpen]);

  if (!isOpen) return null;

  const toggleLanguage = (lang: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !description.trim()) return;

    // Parse tags from comma separated string
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    // Auto-generate clean whatsapp if not provided
    const cleanWhatsapp = whatsapp.trim() || phone.replace(/[^0-9+]/g, '');

    const savedProvider: Provider = {
      id: provider?.id || `provider-custom-${Date.now()}`,
      name: name.trim(),
      categoryId,
      neighborhoodId,
      specialty: specialty.trim() || description.slice(0, 50),
      description: description.trim(),
      phone: phone.trim(),
      whatsapp: cleanWhatsapp || undefined,
      email: email.trim() || undefined,
      website: website.trim() || undefined,
      address: address.trim() || undefined,
      pricingNotes: pricingNotes.trim() || undefined,
      languages: selectedLanguages.length ? selectedLanguages : ['Français', 'Anglais'],
      isVerified,
      rating: Number(rating) || 5.0,
      reviewsCount: Number(reviewsCount) || 1,
      tags: tags.length ? tags : [categoryId, neighborhoodId],
      sourceInfo: {
        badge: sourceBadge,
        channel: 'nairobi_accueil_member',
        uploadedAt: provider?.sourceInfo?.uploadedAt || new Date().toISOString(),
        contributorMasked: contributorMasked.trim() || 'Recommandé par un membre',
        contributorRevealed: contributorRevealed.trim() || 'Admin Nairobi Accueil',
        reliabilityScore: 5,
        originalNotes: originalNotes.trim() || undefined,
        sourceSheet: 'Back Office Admin'
      },
      createdAt: provider?.createdAt || new Date().toISOString()
    };

    onSave(savedProvider);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="glass-panel w-full max-w-2xl rounded-2xl bg-slate-900 border border-french-500/30 shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-french-600/20 border border-french-500/30 flex items-center justify-center text-french-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-50 tracking-tight">
                {isEdit ? `Modifier la fiche : ${provider?.name}` : 'Créer une nouvelle fiche Annuaire'}
              </h3>
              <p className="text-xs text-slate-400">
                {isEdit ? 'Mettez à jour les informations visibles dans la PWA' : 'Ajoutez un nouveau contact vérifié directement dans l\'annuaire'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Scrollable Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 custom-scrollbar text-xs">
          
          {/* Section 1: Informations Générales */}
          <div className="space-y-3">
            <h4 className="font-bold text-french-300 uppercase tracking-wider text-[11px] flex items-center space-x-1.5 border-b border-slate-800 pb-1.5">
              <FileText className="w-3.5 h-3.5" />
              <span>1. Informations Générales</span>
            </h4>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Nom du professionnel / Établissement <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Dr. Martin Dupont (Pédiatre) ou Mac & PC Clinic"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-french-500 focus:ring-1 focus:ring-french-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Catégorie <span className="text-amber-400">*</span>
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value as CategoryId)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-slate-100 focus:outline-none focus:border-french-500 focus:ring-1 focus:ring-french-500"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Quartier principal <span className="text-amber-400">*</span>
                </label>
                <select
                  value={neighborhoodId}
                  onChange={(e) => setNeighborhoodId(e.target.value as Exclude<NeighborhoodId, 'all'>)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-slate-100 focus:outline-none focus:border-french-500 focus:ring-1 focus:ring-french-500"
                >
                  {NEIGHBORHOODS.filter((n) => n.id !== 'all').map((neigh) => (
                    <option key={neigh.id} value={neigh.id}>
                      {neigh.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Sous-titre / Spécialité rapide
              </label>
              <input
                type="text"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                placeholder="Ex: Pédiatre francophone, consultations nourrissons & urgences"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-french-500 focus:ring-1 focus:ring-french-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Description détaillée & Recommandation <span className="text-amber-400">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Très bon pédiatre, cabinet moderne, prend le temps d'expliquer en français. Rendez-vous rapide sur WhatsApp."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-french-500 focus:ring-1 focus:ring-french-500 resize-none"
              />
            </div>
          </div>

          {/* Section 2: Coordonnées de Contact & Localisation */}
          <div className="space-y-3 pt-2">
            <h4 className="font-bold text-french-300 uppercase tracking-wider text-[11px] flex items-center space-x-1.5 border-b border-slate-800 pb-1.5">
              <Phone className="w-3.5 h-3.5" />
              <span>2. Coordonnées & Localisation</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Téléphone d'appel <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+254 712 345 678"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-french-500 focus:ring-1 focus:ring-french-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Numéro WhatsApp <span className="text-slate-500 font-normal">(optionnel)</span>
                </label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="Ex: +254712345678"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-french-500 focus:ring-1 focus:ring-french-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Adresse E-mail <span className="text-slate-500 font-normal">(optionnel)</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contact@docteur.co.ke"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-french-500 focus:ring-1 focus:ring-french-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Site Web / Lien <span className="text-slate-500 font-normal">(optionnel)</span>
                </label>
                <div className="relative">
                  <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://..."
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-french-500 focus:ring-1 focus:ring-french-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Adresse physique / Centre commercial / Repère
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ex: Village Market, New Wing 2nd Floor, Limuru Rd, Gigiri"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-french-500 focus:ring-1 focus:ring-french-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Prestations, Tarifs, Langues & Tags */}
          <div className="space-y-3 pt-2">
            <h4 className="font-bold text-french-300 uppercase tracking-wider text-[11px] flex items-center space-x-1.5 border-b border-slate-800 pb-1.5">
              <Tag className="w-3.5 h-3.5" />
              <span>3. Tarifs, Langues & Mots-Clés</span>
            </h4>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Indications tarifaires / Moyens de paiement
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={pricingNotes}
                  onChange={(e) => setPricingNotes(e.target.value)}
                  placeholder="Ex: Consultation 4 500 KES • Prise en charge CFE & Assurance internationale • M-Pesa"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-french-500 focus:ring-1 focus:ring-french-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">
                Langues parlées
              </label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_LANGUAGES.map((lang) => {
                  const isSelected = selectedLanguages.includes(lang);
                  return (
                    <button
                      type="button"
                      key={lang}
                      onClick={() => toggleLanguage(lang)}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                        isSelected
                          ? 'bg-french-600 text-white shadow-sm shadow-french-600/30'
                          : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 text-white stroke-[3]" />}
                      <span>{lang}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Tags & Mots-clés de recherche <span className="text-slate-500 font-normal">(séparés par des virgules)</span>
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Ex: Pédiatre, Bébé, Vaccins, Village Market, Urgence"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-french-500 focus:ring-1 focus:ring-french-500"
              />
            </div>
          </div>

          {/* Section 4: Confiance, Source & Modération */}
          <div className="space-y-3 pt-2">
            <h4 className="font-bold text-french-300 uppercase tracking-wider text-[11px] flex items-center space-x-1.5 border-b border-slate-800 pb-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>4. Modération & Badge de Confiance</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Badge attribué
                </label>
                <select
                  value={sourceBadge}
                  onChange={(e) => setSourceBadge(e.target.value as SourceBadge)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-slate-100 focus:outline-none focus:border-french-500"
                >
                  {SOURCE_BADGES.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Note d'avis (sur 5)
                </label>
                <div className="relative">
                  <Star className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-slate-100 focus:outline-none focus:border-french-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Nombre d'avis
                </label>
                <input
                  type="number"
                  min="1"
                  value={reviewsCount}
                  onChange={(e) => setReviewsCount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-slate-100 focus:outline-none focus:border-french-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Mention publique de recommandation
                </label>
                <input
                  type="text"
                  value={contributorMasked}
                  onChange={(e) => setContributorMasked(e.target.value)}
                  placeholder="Ex: Recommandé par Marie Élodie C."
                  className="w-full px-3 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-slate-100 focus:outline-none focus:border-french-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Identité interne vérifiée (Admin)
                </label>
                <input
                  type="text"
                  value={contributorRevealed}
                  onChange={(e) => setContributorRevealed(e.target.value)}
                  placeholder="Ex: Marie Élodie C. (Nairobi Accueil)"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-slate-100 focus:outline-none focus:border-french-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Notes internes de modération
              </label>
              <input
                type="text"
                value={originalNotes}
                onChange={(e) => setOriginalNotes(e.target.value)}
                placeholder="Ex: Coordonnées vérifiées par téléphone, tarif conforme au standard local."
                className="w-full px-3 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-slate-100 focus:outline-none focus:border-french-500"
              />
            </div>

            {/* Verified Switch Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div>
                <span className="font-bold text-slate-200">Statut de Certification</span>
                <p className="text-[10px] text-slate-400">Affiche le badge doré « Vérifié » sur la fiche dans l'annuaire</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isVerified}
                  onChange={(e) => setIsVerified(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
          </div>

          {/* Footer Submit Buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end space-x-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-french-600 hover:bg-french-500 text-white font-bold transition-all shadow-lg shadow-french-600/30 flex items-center space-x-2 active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>{isEdit ? 'Enregistrer les modifications' : 'Créer et publier la fiche'}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ProviderFormModal;
