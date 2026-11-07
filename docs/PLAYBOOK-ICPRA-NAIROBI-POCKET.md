# Playbook Opérationnel d'Ingénierie Logicielle ICPRA & Orchestration Antigravity Remote
# Projet : Nairobi in ze Pocket (Hub PWA & Bot Telegram 24/7)

> **Statut :** Document Maître d'Exploitation et d'Ingénierie (SSOT)  
> **Auteur :** Ben Joseph (Architecte Logiciel ICPRA & Lead Shipper)  
> **Classification :** Confidentiel / Strictement Conforme Kenya DPA 2019  
> **Dernière révision :** 7 novembre 2026

---

## 1. Cadre Général & Philosophie d'Ingénierie

Ce Playbook définit le protocole opérationnel absolu régissant le développement, la maintenance, la recette et le pilotage cloud de l'application **Nairobi in ze Pocket**. Il intègre le standard de l'**Usine Logicielle ICPRA**, la **Doctrine d'Ingénierie Frontend (Anti-Vibe Coding)** et prépare le projet à une supervision distribuée haute cadence via **Antigravity Remote**.

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                   CYCLE D'INGÉNIERIE DÉTERMINISTE ICPRA & ANTIGRAVITY REMOTE                    │
├─────────────────────────┬─────────────────────────┬─────────────────────────┬────────────────────┤
│ 1. CONTRAT (VERROU)     │ 2. TDD LOOP (SANDBOX)   │ 3. MUR DE LA RÉALITÉ    │ 4. CLOUD SHIP      │
│ - AI-PRD.md             │ - Vitest Component TDD  │ - Chaos & Fuzzing       │ - Antigravity      │
│ - DATA-model.md         │ - Strict TypeScript     │ - Offline PWA Check     │   Remote Pipeline  │
│ - api-spec.json         │ - 5 UI States Validation│ - Kenya DPA 2019 Audit  │ - Edge Deployment  │
│ - UX-acceptance.md      │ - Git Commit Atomique   │ - RLS Egress Firewall   │ - Supabase + TG Bot│
└─────────────────────────┴─────────────────────────┴─────────────────────────┴────────────────────┘
```

---

## 2. Le Quadriptyque Contractuel Frontend (Doctrine Anti-Vibe Coding)

Conformément à la politique `FRONTEND_ENGINEERING_DOCTRINE.md`, aucun composant d'interface ne peut être délivré sans respecter les 4 piliers fondamentaux :

### Pilier 1 : Design Tokens & Dimensions Réservées (Zéro CLS)
- **Conteneurs médias et cartes :** Tout bloc visuel (cartes de prestataires, lecteurs de guides, simulateur de bot) **DOIT** réserver son espace vertical avec des classes explicites (`min-h-[...]`, `rounded-2xl`, `p-4 sm:p-5`) pour éradiquer tout décalage d'affichage (Cumulative Layout Shift = 0).
- **Cibles tactiles minimales :** Tous les boutons d'action (`Appeler`, `WhatsApp`, `Maps`, filtres de quartiers, onglets de la `BottomNav`) mesurent au minimum **44 × 44 pixels** pour un usage sans friction au volant ou en situation d'urgence à Nairobi.
- **Tokens HSL :** Utilisation stricte des tokens définis dans `tailwind.config.js` (`slate-950`, `slate-900`, `amber-500`, `french-600`, `sos-600`). Tolérance ZÉRO pour les classes utilitaires inventées hors configuration.

### Pilier 2 : La Loi des 5 États d'Interface (The 5 UI States Law)
Tout composant consommant des données (prestataires, urgences, guides pratiques) doit implémenter et tester ses 5 états :
1. **Loading :** Skeleton loader épousant exactement les dimensions réservées du composant.
2. **Empty :** Vue claire avec illustration bienveillante et bouton d'action d'amorce (CTA *"Proposer une adresse"*).
3. **Success :** Rendu nominal haute fidélité avec transitions fluides Framer Motion.
4. **Error :** Message compréhensible en français naturel, code RFC 7807 discret et bouton *"Réessayer"*.
5. **Offline / Degraded :** Fallback instantané sur le jeu de données local sans rupture de service.

### Pilier 3 : Flux Déterministe d'État & Zéro DOM Hack
- **Bannissement des requêtes sauvages dans `useEffect()` :** Délégation des flux asynchrones à TanStack Query ou au client typé Supabase.
- **Composants contrôlés :** Interdiction absolue de manipuler impérativement le DOM (`document.getElementById`). Tous les formulaires sont contrôlés réactivement par React.

### Pilier 4 : Component-Driven TDD
- Les tests unitaires et de composants Vitest (`@testing-library/react`) sont rédigés **avant** ou conjointement à l'implémentation pour verrouiller le comportement attendu.

---

## 3. Les 4 Phases Verrouillées de l'Usine Logicielle ICPRA

### Phase 1 : Contrat (Le Verrou)
Avant d'écrire la moindre ligne de code, l'agent ou le développeur vérifie l'existence et la cohérence des 6 documents de modélisation :
- `AI-PRD.md` : Critères d'acceptation Gherkin.
- `DATA-model.md` : Schéma PostgreSQL, contraintes et RLS.
- `api-spec.md` & `api-spec.json` : Contrats OpenAPI 3.1 et Webhook Telegram.
- `UX-acceptance.md` : Grille de recette visuelle.
- `TDD.md` : Matrice de traçabilité des exigences.
- `decisions.md` : ADR validés.

### Phase 2 : TDD Loop (La Sandbox Déterministe)
1. Exécution des tests via `npm run test`.
2. Capture automatique de `stderr` et des erreurs TypeScript via `npm run build`.
3. Correction chirurgicale et auto-commit conventionnel (`feat:`, `fix:`, `test:`, `docs:`).

### Phase 3 : Mur de la Réalité (Chaos, Fuzzing & Conformité DPA 2019)
1. **Injection de Payloads Adversariaux :** Test des formulaires avec des chaînes de caractères malformées, caractères spéciaux, injection XSS / SQL.
2. **Contrôle ODPC Kenya :** Vérification formelle que le booléen `consent_given` est à `true` avant tout enregistrement en base.
3. **Audit Offline :** Coupure simulée du réseau dans le Service Worker pour certifier que les urgences SOS sont opérationnelles à 100%.

### Phase 4 : Déploiement Cloud & Recette E2E
1. Génération du bundle optimisé PWA (`dist/`).
2. Déploiement des Edge Functions pour le webhook Telegram.
3. Validation du Lighthouse Score (> 95/100 en Performance, PWA et Accessibilité).

---

## 4. Protocole d'Orchestration avec Antigravity Remote

L'arrivée d'**Antigravity Remote** transforme la gestion du projet en un pipeline cloud asynchrone, distribué et hautement résilient.

### A. Rôles et Responsabilités d'Antigravity Remote
- **Agent Orchestrateur Distant :** Exécute les tâches d'arrière-plan, les audits programmés et la vérification continue des dépendances sans bloquer la machine locale.
- **Worker de Modération Automatisée :** Analyse les soumissions d'artisans avec vérification heuristique des doublons et validation des formats téléphoniques E.164 (+254...).
- **Contrôleur de Santé PWA (Health Probe) :** Teste périodiquement la disponibilité des serveurs Supabase et du webhook Telegram.

### B. Matrice des Secrets Cloud & Variables d'Environnement
Toutes les variables sont injectées de manière hermétique dans Antigravity Remote :

```env
# Application Settings
VITE_APP_NAME="Nairobi in ze Pocket"
VITE_APP_URL="https://nairobi-in-ze-pocket.app"

# Supabase Credentials (Cloud Production)
VITE_SUPABASE_URL="https://<project-ref>.supabase.co"
VITE_SUPABASE_ANON_KEY="<public-anon-key>"
SUPABASE_SERVICE_ROLE_KEY="<secret-service-role-key>"

# Telegram Bot Integration
TELEGRAM_BOT_TOKEN="<bot-token-from-botfather>"
TELEGRAM_BOT_SECRET_TOKEN="<high-entropy-secret-token>"
TELEGRAM_BOT_HANDLE="@NairobiInZePocketBot"
```

### C. La Gate de Validation Avant Promotion en Production (Cloud Gate)
Avant qu'Antigravity Remote ne valide une mise en production :
1. `npm run test` doit retourner **0 échec**.
2. `npm run build` (tsc + vite) doit compiler avec **0 warning bloquant**.
3. Le validateur de cas d'utilisation `validate_usecase_diagram.py` doit afficher **PASSED**.
4. Aucune fuite de données personnelles ne doit être détectée dans les logs.

---

## 5. Runbook d'Urgence & Procédures de Dépannage (Troubleshooting)

### Incident 1 : Écran Blanc au Rechargement du Navigateur
- **Cause Racine :** Service Worker désynchronisé ou conflit d'importation dans le code client.
- **Procédure de Résolution :**
  1. Ouvrir DevTools (`F12` / `Ctrl+Shift+I`) > Onglet Application / Stockage.
  2. Cliquer sur **Unregister** sur le Service Worker et **Clear site data**.
  3. Recharger avec `Ctrl + F5`.

### Incident 2 : Le Bot Telegram Ne Répond Plus
- **Cause Racine :** Secret token révoqué ou timeout sur la fonction Edge serverless.
- **Procédure de Résolution :**
  1. Vérifier le statut du webhook via `https://api.telegram.org/bot<TOKEN>/getWebhookInfo`.
  2. Vérifier les logs d'erreurs de la fonction Edge Supabase.
  3. Réinitialiser le webhook avec `setWebhook` en réinjectant le `secret_token`.

### Incident 3 : Demande de Retrait d'un Artisan (Droit à l'oubli ODPC)
- **Procédure de Résolution :**
  1. L'administrateur bascule `is_verified` à `false` ou supprime l'enregistrement dans la table `providers`.
  2. Invalidation immédiate du cache PWA lors de la synchronisation suivante.
  3. Consignation de l'action dans `00_PROJECT_CONTROL/audits/DPA_DELETION_LOG.md`.
