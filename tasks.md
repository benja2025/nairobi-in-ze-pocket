# Tasks & Roadmap — Nairobi in ze Pocket

## Phase A : Audit Rétrospectif & Contrats de Modélisation ICPRA (Actuel)

- [x] **T-A01 :** Instanciation de l'arborescence des 7 Cadres de réutilisation opérationnelle (`00` à `05`).
- [x] **T-A02 :** Création des fichiers SSOT racine (`project.md`, `sources.md`, `resources.md`, `contacts.md`, `logs.md`).
- [ ] **T-A03 :** Rédaction du contrat formel `AI-PRD.md` (Product Requirements Document avec critères Gherkin et Anti-Goals).
- [ ] **T-A04 :** Rédaction du contrat de modélisation `DATA-model.md` (Schéma relationnel strict, RLS, types TypeScript, conformité Kenya DPA 2019).
- [ ] **T-A05 :** Rédaction de la spécification d'API `api-spec.md` et schéma `api-spec.json` (OpenAPI 3.1 & Telegram Webhook contract).
- [ ] **T-A06 :** Rédaction du registre des décisions d'architecture `decisions.md` (ADR-001 à ADR-006).
- [ ] **T-A07 :** Rédaction de `UX-acceptance.md` (Cahier de recette UI/UX, loi des 5 états, dimensions réservées, cibles tactiles 44px).
- [ ] **T-A08 :** Rédaction de `TDD.md` (Matrice de couverture de tests et protocole Red-Green-Refactor).
- [ ] **T-A09 :** Modélisation formelle des cas d'utilisation UML (`docs/usecases.puml` et Mermaid).

## Phase B : Création du Playbook Opérationnel

- [ ] **T-B01 :** Rédaction du `docs/PLAYBOOK-ICPRA-NAIROBI-POCKET.md` articulant le cycle de développement, la doctrine frontend et les opérations cloud.
- [ ] **T-B02 :** Intégration des règles d'orchestration distribuée avec **Antigravity Remote**.

## Phase C : Alignement Frontend & Hardening Code (Certifié ICPRA)

- [x] **T-C01 :** Mise à niveau des composants d'annuaire et guides pour intégrer formellement les 5 états UI (Loading Skeleton, Empty avec CTA, Error avec Retry, Offline dégradé).
- [x] **T-C02 :** Intégration de flux d'état déterministes et hygiène A11y (cibles tactiles 44x44px, zéro CLS, formulaires stricts DPA 2019, ErrorBoundary).
- [x] **T-C03 :** Exécution et validation de la suite de tests Vitest complète (65 tests unitaires et composants) et certification du build de production Vite/PWA.
