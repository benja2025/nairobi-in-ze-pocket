# Registre des Décisions d'Architecture (ADR) — Nairobi in ze Pocket

> **Statut :** Formellement approuvé et actif.  
> **Auteur :** Ben Joseph (Lead Développeur Shipper & Architecte ICPRA).

---

## ADR-001 : Choix de la Stack Frontend PWA (Vite + React + TypeScript + Workbox)

### Statut
Accepté (16 août 2026).

### Contexte
La cible est une communauté mobile francophone à Nairobi (smartphones iOS et Android). Le projet doit servir de vitrine de savoir-faire technique « French Tech » (fluidité 60 fps, micro-animations, temps de chargement inférieur à 500ms, résilience offline lors des coupures réseau).

### Décision
Adopter la stack **Vite 5 + React 18 (TypeScript strict) + TailwindCSS + Workbox PWA**.
- **Conséquences positives :** Vitesse de build instantanée (HMR), typage rigoureux sans dérive, intégration PWA standalone avec icône d'écran d'accueil, coût d'infrastructure nul en hébergement statique.
- **Conséquences négatives / Risques :** Nécessite une discipline stricte sur l'isolation des imports (interdiction d'importer des dépendances de test Node dans le runtime navigateur).

---

## ADR-002 : Conformité Kenya Data Protection Act 2019 & Supabase RLS

### Statut
Accepté (16 août 2026).

### Contexte
L'ODPC (Office of the Data Protection Commissioner) au Kenya applique rigoureusement le Data Protection Act de 2019. La diffusion de numéros de téléphone et coordonnées privées d'artisans ou d'employés de maison sans consentement explicite expose les administrateurs à des sanctions juridiques.

### Décision
1. Implémentation du **Row Level Security (RLS)** sur PostgreSQL/Supabase.
2. Case à cocher obligatoire de consentement lors de toute soumission de recommandation (`consent_given = true`).
3. File de modération isolée (`submissions`) accessible uniquement aux profils administrateurs certifiés de Nairobi Accueil.
4. Masquage des numéros de téléphone personnels aux robots d'indexation publics.

---

## ADR-003 : Architecture Webhook Serverless pour le Bot Telegram

### Statut
Accepté (16 août 2026).

### Contexte
L'assistance doit être disponible 24/7 pour les urgences nocturnes ou les questions immédiates d'expatriés. Faire tourner un serveur Node avec un `long polling` permanent engendre des coûts d'infrastructure, des pannes de socket et une complexité de maintenance inutile pour une association bénévole.

### Décision
Connecter le bot `@NairobiInZePocketBot` via un **Webhook HTTPS Serverless** (Supabase Edge Function / Cloudflare Worker / Vercel API Route) déclenché uniquement à la réception d'un message Telegram, avec authentification par en-tête `X-Telegram-Bot-Api-Secret-Token`.
- **Conséquences positives :** Coût marginal zéro en période d'inactivité, scalabilité instantanée, temps de réponse sous les 300ms.

---

## ADR-004 : Alignement sur le Quadriptyque Contractuel Frontend ICPRA

### Statut
Accepté (7 novembre 2026).

### Contexte
Suite au retour d'expérience du projet `11_Ben360` et aux standards de la politique `FRONTEND_ENGINEERING_DOCTRINE.md`, le vibe coding et les composants ne gérant que le cas nominal (« Happy Path ») sont formellement bannis.

### Décision
Tout composant de rendu de données de l'application Nairobi in ze Pocket doit obligatoirement modéliser les **5 états d'interface** :
1. **Loading :** Skeleton loader épousant exactement les dimensions réservées.
2. **Empty :** Vue explicite avec illustration et appel à l'action (CTA de recommandation).
3. **Success :** Fiches interactives tactiles avec cibles minimum de 44x44px.
4. **Error :** Message clair et bouton de réessai déterministe.
5. **Offline / Degraded :** Fallback instantané sur les données mockées locales.

---

## ADR-005 : Architecture Hybride Offline / Pilote de Données Local

### Statut
Accepté (16 août 2026, consolidé le 7 novembre 2026).

### Contexte
À Nairobi, les coupures de réseau mobile ou les zones blanches (ex: sous-sols de centres commerciaux, routes de safari) sont fréquentes. Un expatrié en situation d'urgence médicale ne peut pas dépendre d'une connexion montante vers Supabase pour appeler une ambulance ou l'Hôpital Aga Khan.

### Décision
Mettre en place un pilote de données hybride : l'application embarque dans son bundle PWA les **30+ fiches de prestataires et l'intégralité des numéros d'urgence SOS**. En cas d'indisponibilité de l'API distante ou en mode déconnecté, l'application fonctionne à 100% sans dégradation de service.

---

## ADR-006 : Orchestration et Déploiement avec Antigravity Remote

### Statut
Accepté (7 novembre 2026).

### Contexte
Le projet entre dans sa phase de scaling et de maintenance continue à distance. L'introduction d'**Antigravity Remote** permet de déléguer l'exécution des tests E2E, le monitoring de conformité DPA et les déploiements cloud à des agents autonomes distants.

### Décision
Adopter **Antigravity Remote** comme plateforme centrale d'ingénierie et d'automatisation cloud, en verrouillant les garde-fous de sécurité, les variables d'environnement distantes et les playbooks déterministes.
