---
type: project
status: active
priority: P1
criticality: high
owner: Ben Joseph
casquettes:
  - "Développeur Senior Shipper"
  - "Architecte Logiciel ICPRA"
themes:
  - "French Tech Kenya"
  - "PWA Mobile-First"
  - "Telegram Bot 24/7"
  - "Kenya DPA 2019"
created: 2026-08-16
updated: 2026-11-07
last_reviewed: 2026-11-07
blocked_reason: null
review_frequency: weekly
---

# Nairobi in ze Pocket — Hub Communautaire PWA & Assistant Telegram 24/7

## Intention

Offrir à la communauté francophone expatriée à Nairobi et aux nouveaux arrivants une Progressive Web App (PWA) d'ingénierie supérieure (« French Tech ») couplée à un assistant Telegram IA 24/7, éliminant l'entropie des fils WhatsApp tout en servant de vitrine d'excellence pour un Développeur Senior Shipper.

## Contexte

La métropole de Nairobi accueille plus de 3 000 résidents francophones concentrés sur les quartiers de Westlands, Gigiri, Lavington, Runda et Karen. L'organisation historique de l'information (WhatsApp) génère une entropie critique : les mêmes questions (santé, scolarité Lycée Denis Diderot, fundis plombiers/électriciens, personnel de maison) s'y perdent quotidiennement.
L'association Nairobi Accueil (affiliée FIAFE) dispose d'un site vitrine statique qui ne permet pas une assistance temps réel 24/7 ni un annuaire relationnel géolocalisé offline. Le projet se positionne comme un support privé moderne et rigoureux, respectant strictement le **Kenya Data Protection Act (DPA) 2019**.

## Résultat Attendu

- **Livrable principal :** Application PWA installable offline-first + Assistant Telegram 24/7 (@NairobiInZePocketBot) connecté à la base de connaissances Supabase (pgvector).
- **Définition de fini (DoD) :**
  1. Respect strict du Quadriptyque Contractuel Frontend ICPRA (`FRONTEND_ENGINEERING_DOCTRINE.md`).
  2. Couverture de tests de composants et d'intégration Vitest à 100% sur les parcours nominaux, dégradés et offline.
  3. Contrats de modélisation complets (`AI-PRD.md`, `DATA-model.md`, `api-spec.md`, `UX-acceptance.md`, `TDD.md`, `decisions.md`).
  4. Playbook d'opération et de migration cloud avec **Antigravity Remote** validé.
- **Horizon temporel :** Production Cloud Q4 2026.

## Statut Opérationnel

- **Statut :** `active`
- **Priorité :** `P1`
- **Criticité :** `high`
- **Dernière revue :** 2026-11-07
- **Blocage actuel :** Aucun. Phase de certification des contrats de modélisation et préparation à Antigravity Remote.

## Casquettes Liées

- **Casquette Ingénieur Shipper / Architecte Logiciel :** Garant du respect de l'usine logicielle ICPRA, du TDD et des contrats d'interface.
- **Casquette Lead Développeur Frontend :** Garant de l'anti-vibe coding, des dimensions réservées et de la loi des 5 états UI.

## Projets Liés

- `05_Convertial` : Référence d'architecture ICPRA.
- `11_Ben360` : Référence de doctrine d'ingénierie frontend et de modélisation multi-rôles au Kenya.

## Décisions Clés

- **ADR-001 :** Frontend Vite 5 + React 18 (TypeScript strict) + TailwindCSS + Workbox PWA.
- **ADR-002 :** Backend Supabase (PostgreSQL + RLS + Edge Functions) pour isolation multi-tenant et conformité Kenya DPA 2019.
- **ADR-003 :** Assistant Telegram 24/7 piloté par Webhook Serverless et RAG sur base vectorielle.
- **ADR-004 :** Application du Quadriptyque Contractuel Frontend (Anti-Vibe Coding).
- **ADR-005 :** Workflow d'orchestration distribuée avec **Antigravity Remote**.

## Prochaines Actions

- [x] Vérification de la suite de tests unitaires Vitest existante (9/9 passed).
- [x] Structuration des 7 Cadres de Réutilisation Opérationnelle (`00` à `05`).
- [ ] Rédaction des contrats de modélisation canoniques (`AI-PRD.md`, `DATA-model.md`, `api-spec.md`, `UX-acceptance.md`, `TDD.md`, `decisions.md`).
- [ ] Formalisation des diagrammes de cas d'utilisation UML (RBAC 6 rôles) et architecture.
- [ ] Rédaction du Playbook d'ingénierie ICPRA et d'optimisation Antigravity Remote.
