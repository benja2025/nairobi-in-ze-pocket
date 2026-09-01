# Feature Backlog & Engineering Roadmap: Nairobi in ze Pocket

> **ENFORCEMENT OF PILLARS 3 & 5**:
> - **Pillar 3 (TDD)**: Every task MUST follow the Red-Green-Refactor cycle. Tests are written FIRST, confirmed FAILING, then implemented until PASSING.
> - **Pillar 5 (Aggressive Versioning)**: Commit after each test cycle with conventional commit syntax (`feat:`, `fix:`, `test:`, `docs:`).

---

## Task Progress Summary

- [ ] **Phase 1: Project Setup & Core Design System Scaffold**
- [ ] **Phase 2: Data Models & Mock Datasets (30+ Nairobi Contacts)**
- [ ] **Phase 3: Module 1 — Annuaire des Bonnes Adresses (Directory & Filters)**
- [x] **Phase 4: Module 2 — Guides d'Installation & Knowledge Base (Images, Human-Editorial & Structured UI)**
- [ ] **Phase 5: Module 3 — Hub Urgences SOS (Offline-First)**
- [x] **Phase 6: Module 4 — Chatbot Telegram & Interactive Simulator (with Early-Access Waitlist Modal)**
- [x] **Phase 7: Module 5 — Formulaire de Soumission & Espace Admin Authentifié (Modération + Telegram Waitlist + Export CSV)**
- [ ] **Phase 8: PWA Service Worker & Offline Caching**
- [ ] **Phase 9: Final E2E Testing, Lighthouse Audit & Polish**

---

## Detailed Task Breakdown

### Phase 1: Project Setup & Core Design System Scaffold
- [ ] **Task 1.1: Vite + React + TypeScript + Tailwind Setup**
  - Initialize project with Vite React-TS template.
  - Configure TailwindCSS with custom HSL Slate & Amber tokens (`tailwind.config.js`).
  - Configure Vitest testing environment.
- [ ] **Task 1.2: Base Layout & Bottom Navigation Bar**
  - Write test `BottomNav.test.tsx` verifying navigation items.
  - Implement `BottomNav.tsx`, `Header.tsx`, and `Layout.tsx` with mobile glassmorphism.

### Phase 2: Data Models & Mock Datasets (30+ Nairobi Contacts)
- [ ] **Task 2.1: Types Definition & Mock Data Seed**
  - Define `types/index.ts` (Provider, Category, Neighborhood, EmergencyContact, Guide).
  - Create `data/mockProviders.ts` with 30+ real-world verified Nairobi contacts:
    - *Hôpital Aga Khan, Nairobi Hospital, Pédiatres, Dentistes francophones*.
    - *Fundis électriciens, plombiers, techniciens générateur/solaire*.
    - *Chauffeurs de confiance, déménageurs, gardiennage*.
    - *Lycée Français Denis Diderot, crèches, professeurs particuliers*.
  - Create `data/mockEmergency.ts` and `data/mockGuides.ts`.

### Phase 3: Module 1 — Annuaire des Bonnes Adresses (Directory & Filters)
- [ ] **Task 3.1: Directory Filtering & Search Logic (TDD)**
  - Write test `directoryFilter.test.ts` checking filter by Category and Neighborhood.
  - Implement `FilterBar.tsx`, `NeighborhoodSelector.tsx`, `SearchBar.tsx`.
- [ ] **Task 3.2: Provider Cards & Detail Modal**
  - Write test `ProviderCard.test.tsx` for `tel:`, `wa.me`, and Google Maps triggers.
  - Implement `ProviderCard.tsx` and `ProviderModal.tsx`.

### Phase 4: Module 2 — Guides d'Installation & Knowledge Base
- [ ] **Task 4.1: Guides Overview & Reader Component (TDD)**
  - Write test `GuideReader.test.tsx` for markdown rendering and reading time calculation.
  - Implement `GuideCard.tsx` and `GuideReader.tsx` (Embauche personnel de maison, Scolarité, Santé).

### Phase 5: Module 3 — Hub Urgences SOS (Offline-First)
- [ ] **Task 5.1: SOS Emergency Hub Component (TDD)**
  - Write test `EmergencyHub.test.tsx` verifying instant click-to-call buttons for Aga Khan, Nairobi Hospital, Ambulances, Embassy.
  - Implement `EmergencyHub.tsx` with high-visibility SOS crimson branding.

### Phase 6: Module 4 — Chatbot Telegram & Interactive Simulator
- [ ] **Task 6.1: Interactive PocketBot Chat Simulator & Telegram Widget**
  - Write test `PocketBotSimulator.test.tsx` checking query matching against mock knowledge base.
  - Implement `PocketBotWidget.tsx` with direct link to launch `@NairobiInZePocketBot` + in-app trial interface.

### Phase 7: Module 5 — Formulaire de Soumission & Espace Admin
- [ ] **Task 7.1: Recommendation Submission Form with DPA 2019 Consent (TDD)**
  - Write test `SubmissionForm.test.tsx` ensuring mandatory DPA 2019 consent checkbox.
  - Implement `SubmissionForm.tsx`.
- [ ] **Task 7.2: Admin Moderation Panel**
  - Write test `AdminPanel.test.tsx` for approving/rejecting submitted recommendations.
  - Implement `AdminPanel.tsx`.

### Phase 8: PWA Caching & Offline Capabilities
- [ ] **Task 8.1: Workbox Service Worker Configuration**
  - Configure `vite-plugin-pwa` for offline asset & emergency page caching.
  - Verify manifest icons, theme color `#0F172A`, and PWA install prompt.
