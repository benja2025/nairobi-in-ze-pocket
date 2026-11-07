# UX Acceptance & Cahier de Recette UI/UX — Nairobi in ze Pocket

> **Standard Appliqué :** `FRONTEND_ENGINEERING_DOCTRINE.md` (ICPRA SSOT).  
> **Objectif :** Garantir une expérience mobile-first d'ingénierie « French Tech Senior Shipper » sans compromis, sans affaissement visuel et avec 60fps constants.

---

## 1. La Loi des 5 États d'Interface (The 5 UI States Law)

Chaque vue et composant de données (`DirectoryPage`, `ProviderCard`, `GuidesPage`, `EmergencyPage`, `BotPage`) doit satisfaire la grille d'acceptation suivante :

| Composant / Vue | 1. Loading (Skeleton) | 2. Empty (avec CTA) | 3. Success (Nominal) | 4. Error (avec Retry) | 5. Offline (Dégradé) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Annuaire (`DirectoryPage`)** | Cartes squelettes aux dimensions exactes (`h-[180px]`). Aucun saut de page. | Message amical : *"Aucun résultat pour cette recherche"* + Bouton CTA *"Proposer une adresse"*. | Rendu haute fidélité, badges dorés/bleus, cibles tactiles >= 44px. | Bannière RFC 7807 avec bouton de rechargement. | Notification discrète *"Mode hors ligne actif : consultation du catalogue local"*. |
| **Urgences SOS (`EmergencyPage`)** | Squelettes rouges réservés (`min-h-[120px]`). | Impossible (liste statique embarquée pré-chargée). | Cartes SOS à fort contraste rouge cramoisi, bouton d'appel direct avec icône pulsante. | Fallback automatique sur les numéros d'urgence bruts E.164. | Fonctionnement à 100% garanti via le Service Worker PWA. |
| **Guides Expat (`GuidesPage`)** | Squelettes des cartes d'articles. | Message *"Aucun guide trouvé"* + réinitialisation du filtre. | Lecture fluide, typographie optimisée, temps de lecture en minutes. | Bouton *"Réessayer le chargement du guide"*. | Consultation des fiches essentielles en cache local. |
| **PocketBot (`BotPage`)** | Indicateur de frappe animant l'icône du bot (`animate-spin` discret). | Écran initial avec bulles de suggestions rapides d'un clic. | Bulles de chat distinctes (utilisateur en bleu royal, bot en ardoise sombre). | Message *"PocketBot n'a pas pu joindre le serveur. Vos urgences restent accessibles ci-dessus."* | Accès direct maintenu aux fiches urgences et annuaire local. |

---

## 2. Invariants d'Ergonomie Mobile & Design Tokens

1. **Cibles Tactiles Minimales (Touch Targets) :**  
   - Tout élément interactif (boutons d'action `Appeler`, `WhatsApp`, `Maps`, filtres par quartier, onglets de la `BottomNav`) doit mesurer au minimum **44 × 44 pixels** ou offrir un espacement équivalent pour éviter les fausses frappes sur smartphone.
2. **Dimensions Réservées (Anti-Layout Shift / CLS = 0) :**  
   - Les cartes de prestataires et conteneurs modaux déclarent des hauteurs minimales et des ratios stricts (`rounded-2xl`, `p-4 sm:p-5`, `backdrop-blur-md`).
3. **Palette & Contraste WCAG AAA :**  
   - Fond d'écran : `bg-slate-950` (`#090D16`) et panneaux `bg-slate-800/80` (`#1E293B`).
   - Textes principaux : `text-slate-50` (`#F8FAFC`) assurant un ratio de contraste supérieur à **12:1** sur le fond ardoise.
   - Accents chaleureux : Ambre doré Safari (`#F59E0B` / `#D97706`) et Bleu French Tech (`#2563EB`).
   - Urgences : Rouge écarlate SOS (`#EF4444` / `#DC2626`).

---

## 3. Matrice de Recette Visuelle & Parcours Utilisateur

| ID | Test Utilisateur | Action Réalisée | Résultat Attendu | Statut |
| :--- | :--- | :--- | :--- | :--- |
| **UX-01** | Premier lancement mobile | Ouverture de l'URL sur Chrome/Edge/Safari mobile | Chargement en < 500ms, proposition d'installation PWA, affichage de l'annuaire. | Conforme |
| **UX-02** | Navigation Bottom Nav | Clic sur les onglets Annuaire, Guides, Urgences, PocketBot, Proposer, Admin | Transition fluide Framer Motion sans scintillement ni rechargement de page. | Conforme |
| **UX-03** | Appel d'urgence SOS | Clic sur le bouton d'en-tête "SOS Urgences" | Basculement immédiat vers l'onglet Urgences avec bouton d'appel direct surdimensionné. | Conforme |
| **UX-04** | Filtrage par quartier | Sélection du bouton "Karen" | Mise à jour instantanée de la grille ne laissant visibles que les prestataires de Karen. | Conforme |
| **UX-05** | Formulaire avec DPA 2019 | Remplissage des champs sans cocher la case de consentement | Le bouton de soumission reste inactif et signale l'obligation légale. | Conforme |
| **UX-06** | Test offline PWA | Passage en mode avion dans les DevTools | L'application reste pleinement fonctionnelle, consultable et les numéros sont accessibles. | Conforme |
