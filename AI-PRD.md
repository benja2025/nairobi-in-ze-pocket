# AI-PRD — Nairobi in ze Pocket
## Product Requirements Document Déterministe & Contrat Fonctionnel

> **PILLAR 1 ENFORCEMENT :** Ce document est la source de vérité canonique et contractuelle (SSOT) de l'application « Nairobi in ze Pocket ». Tout code généré, test d'acceptation, schéma de base de données ou agent autonome exécuté via **Antigravity Remote** doit s'y conformer sans déviation.

---

## 1. Contexte & Vision

**Vision en une phrase :**  
Offrir aux résidents francophones et nouveaux arrivants à Nairobi une application PWA ultra-rapide et offline-first couplée à un assistant Telegram IA 24/7, transformant le désordre informel des groupes WhatsApp en un annuaire vérifié géolocalisé, un guide pratique d'installation et un centre d'urgence zéro latence conforme au Kenya Data Protection Act 2019.

---

## 2. Stack Technique Stricte & Déterministe

- **Frontend Core :** React 18.3+ avec TypeScript 5.4+ (Mode strict, zéro `any`).
- **Build Engine & Bundler :** Vite 5.4+ (HMR ultra-rapide, ESBuild, génération SW PWA).
- **Styling Engine :** TailwindCSS 3.4+ avec variables de design tokens HSL (Slate & Safari Chic).
- **Animation & Transitions :** Framer Motion 11.0+.
- **Iconographie :** `lucide-react`.
- **Moteur PWA & Offline :** `vite-plugin-pwa` + `workbox-window` (Précaching des assets et contacts SOS).
- **Gestion de l'État :** React Hooks contrôlés + TanStack Query (React Query) pour les flux asynchrones.
- **Moteur de Test :** Vitest 1.6+ + `@testing-library/react` + `@testing-library/jest-dom` + `jsdom`.
- **Backend & Données :** PostgreSQL 15+ (Supabase) avec Row Level Security (RLS) et `pgvector`.
- **Intégration Bot :** Telegram Bot Webhook Serverless (Node.js / Supabase Edge Functions / grammY).
- **Plateforme d'Orchestration :** **Antigravity Remote** (environnement agentic distribué, sandboxes cloud sécurisées).

---

## 3. Les Acteurs et Rôles Canoniques (RBAC Archetype)

| Acteur / Rôle | Définition & Droits d'Accès |
| :--- | :--- |
| **Visiteur Anonyme / Expat Arrivant** | Accès à la page d'accueil, recherche textuelle, fiches de guides pratiques, contacts d'urgence SOS offline. Les numéros personnels privés des artisans sont masqués jusqu'à authentification. |
| **Membre Authentifié (Nairobi Accueil)** | Accès complet aux fiches détaillées des prestataires (téléphone, WhatsApp direct, Google Maps), soumission de recommandations. |
| **Prestataire / Artisan (« Fundi »)** | Professionnel référencé. Droit de rectification ou de retrait de ses données conformément au Kenya DPA 2019. |
| **Administrateur / Modérateur** | Membre du bureau Nairobi Accueil habilité à valider/rejeter les recommandations soumises, éditer les fiches, bannir un numéro frauduleux. |
| **PocketBot (Agent Telegram)** | Entité logicielle automatisée recevant les webhooks de la messagerie Telegram et répondant 24/7 en s'appuyant strictement sur la base documentaire. |
| **Système / Worker Antigravity Remote** | Processus automatisé exécutant les tests de régression, l'audit de cohérence de données et la synchronisation PWA. |

---

## 4. Spécifications Fonctionnelles & Critères d'Acceptation Gherkin

### Feature 1 : Annuaire des Bonnes Adresses & Filtrage Multicritère

#### Scénario 1.1 : Filtrage combiné par quartier et catégorie
```gherkin
Given l'utilisateur consulte l'onglet "Annuaire"
When il sélectionne le quartier "Lavington"
And il filtre par la catégorie "Santé"
Then l'application affiche uniquement les prestataires médicaux situés à Lavington
And le compteur affiche le nombre exact de résultats correspondants
And aucun prestataire d'une autre catégorie ou d'un autre quartier n'apparaît dans la liste
```

#### Scénario 1.2 : Recherche textuelle instantanée (Fuzzy Search)
```gherkin
Given l'utilisateur est sur l'annuaire
When il saisit "plombier" ou "fuite" dans la barre de recherche
Then la liste se met à jour en moins de 100ms
And le prestataire "John Fundi Plomberie & Fuites" est affiché
And ses tags pertinents sont mis en surbrillance
```

#### Scénario 1.3 : Déclenchement des actions rapides sur smartphone
```gherkin
Given une fiche prestataire affichée sur mobile
When l'utilisateur clique sur le bouton "Appeler"
Then le composeur téléphonique natif du téléphone s'ouvre avec le numéro formaté E.164
When l'utilisateur clique sur "WhatsApp"
Then l'application ouvre l'API WhatsApp avec un message pré-rempli identifiant l'origine "Nairobi in ze Pocket"
When l'utilisateur clique sur "Maps"
Then l'application lance la navigation Google Maps vers l'adresse exacte du prestataire
```

---

### Feature 2 : Centre d'Urgence SOS Offline-First

#### Scénario 2.1 : Accès immédiat hors connexion
```gherkin
Given un expatrié se trouvant dans une zone sans réseau 4G ou en panne de connectivité
When il ouvre l'application "Nairobi in ze Pocket"
And il clique sur le bouton rouge "SOS Urgences" dans le bandeau ou la barre basse
Then la page des urgences s'affiche instantanément (< 50ms) grâce au cache Service Worker
And les numéros d'urgence de l'Hôpital Aga Khan (+254 20 366 2000), Nairobi Hospital (+254 20 284 5000) et Ambulances AAR sont immédiatement cliquables
```

---

### Feature 3 : Fiches Pratiques & Guides d'Installation

#### Scénario 3.1 : Consultation d'un guide légal kényan
```gherkin
Given un nouvel arrivant souhaitant embaucher une employée de maison
When il consulte l'onglet "Guides"
And il sélectionne "Embaucher du personnel de maison à Nairobi"
Then l'article s'ouvre dans un lecteur fluide et lisible
And les informations légales obligatoires (contrat écrit, NSSF, SHIF, salaire minimum) sont détaillées
And le temps de lecture estimé est affiché
```

---

### Feature 4 : Assistant IA Telegram 24/7 (« PocketBot »)

#### Scénario 4.1 : Réponse déterministe et anti-hallucination
```gherkin
Given un utilisateur interrogeant @NairobiInZePocketBot sur Telegram ou via le simulateur intégré
When il demande "Quel pédiatre francophone appeler à Kilimani ?"
Then le bot extrait de la base de données le contact du Dr. Marc Dubois
And renvoie son numéro de téléphone, sa spécialité et sa localisation
And n'invente aucune coordonnée non validée dans le référentiel
```

#### Scénario 4.2 : Protocole d'alerte vitale prioritaire
```gherkin
Given un utilisateur envoyant un message contenant les mots-clés "urgence", "accident" ou "ambulance"
When le bot reçoit le payload
Then la toute première ligne de sa réponse contient obligatoirement les numéros d'urgence vitale des hôpitaux Aga Khan et Nairobi Hospital
Before toute autre suggestion conversationnelle
```

---

### Feature 5 : Soumission de Recommandation & Conformité DPA 2019

#### Scénario 5.1 : Verrouillage de consentement Kenya DPA 2019
```gherkin
Given un membre remplissant le formulaire de recommandation d'un artisan
When il renseigne le nom, la catégorie, le quartier, le téléphone et son avis
And la case "Conformité Kenya Data Protection Act 2019 : Je certifie avoir obtenu le consentement du prestataire..." n'est PAS cochée
Then le bouton "Soumettre pour modération" demeure strictement désactivé
When l'utilisateur coche la case de consentement
Then le bouton devient actif et la soumission est enregistrée avec le statut "pending"
```

#### Scénario 5.2 : Modération administrative
```gherkin
Given un administrateur connecté sur le panneau d'administration
When il consulte la file d'attente de modération
Then il visualise les soumissions avec l'identité du membre soumissionnaire
When il clique sur "Approuver"
Then le prestataire est injecté dans le référentiel actif de l'annuaire
```

---

## 5. Les Non-Buts (Anti-Goals) — Tolérance Zéro

1. **Pas de passerelle de paiement complexe ni de monétisation agressive :** Le projet est une initiative privée bénévole en support à Nairobi Accueil. Aucun prélèvement publicitaire intrusif.
2. **Pas de réseau social ouvert ni de fil de discussion infini :** Interdiction d'ajouter des fils de commentaires non modérés qui recréeraient l'entropie de WhatsApp.
3. **Pas de stockage de données médicales sensibles :** L'application répertorie les coordonnées professionnelles des praticiens mais ne stocke aucun dossier médical patient.
4. **Pas d'extraction non consentie de contacts (Scraping interdit) :** Conformément à l'ODPC Kenya, les numéros personnels ne sont jamais exposés publiquement à des scrapers tiers.
5. **Pas de manipulation directe du DOM en frontend :** Strict respect de la `FRONTEND_ENGINEERING_DOCTRINE.md`.
