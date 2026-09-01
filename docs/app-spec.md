# App Specification: Nairobi in ze Pocket (PRD - Product Requirements Document)

> **PILLAR 1 ENFORCEMENT**: This document represents the absolute single source of truth for the project `Nairobi in ze Pocket`. All code, interfaces, data models, and features MUST strictly conform to the specifications set forth in this document.

---

## 1. Executive Summary & Vision

**Nairobi in ze Pocket** is a high-performance, mobile-first Progressive Web App (PWA) coupled with a 24/7 Telegram Assistant, built to empower French-speaking expatriates and newcomers arriving in Nairobi, Kenya. 

Officially conceived as a private initiative supporting the **Nairobi Accueil** association (affiliated with the FIAFE), the application serves a dual purpose:
1. **Product Value**: Eliminate the informational entropy of instant messaging groups (WhatsApp) by offering a structured, instant, offline-capable directory of verified contacts ("bonnes adresses"), installation guides, emergency click-to-call hubs, and an AI-driven 24/7 Telegram chatbot.
2. **Showcase Value**: Stand out as a showcase of **Senior Shipper / French Tech excellence**—featuring fluid 60fps micro-animations, instant search, offline fallback capability, and rigorous compliance with the **Kenya Data Protection Act (DPA) 2019**.

---

## 2. Target Audience & Geographic Context

- **Target Audience**: ~3,000 French-speaking residents in Nairobi, incoming expats, families, parents of students at *Lycée Français Denis Diderot*, and diplomats.
- **Geographic Focus**: Primary Nairobi residential & business hubs:
  - **Westlands / Spring Valley** (Commercial center, dining, services)
  - **Gigiri / Runda** (UN HQ, Embassy hub, international schools)
  - **Lavington / Kilimani** (Residential, accessible services, Denis Diderot proximity)
  - **Karen / Lang'ata** (South-west residential green area, nature, international schools)

---

## 3. Core Modules & Key Capabilities (V1 Scope)

### Module 1: Annuaire des Bonnes Adresses & Recommandations ("Directory Hub")
- **Filtering**: Multi-dimensional instant filters by **Neighborhood** (*Westlands, Gigiri, Runda, Lavington, Karen, Kilimani, All*) and **Category** (*Santé, Éducation & Écoles, Logement & Artisans/Fundis, Transports & Chauffeurs, Loisirs & Safaris, Personnel de maison*).
- **Listing Cards**:
  - Service/Business name, verified badge status, category tag, neighborhood tag, language spoken (e.g. "Français", "Anglais", "Swahili").
  - Direct Action Triggers: `Call Now` (`tel:` link), `WhatsApp Direct` (`https://wa.me/`), `Google Maps Location`.
  - Member rating and brief recommendation snippet.
- **Recommendation Submission Form**: Members can suggest a new provider/artisan. Submissions enter a pending queue in Supabase for admin review before publication.

### Module 2: Guides d'Installation & Base de Connaissances ("Karibuni Guides")
- Structured markdown-rendered articles addressing core expat workflows:
  1. *S'installer à Nairobi* (Logement, baux, quartiers, sécurité des compounds).
  2. *Embaucher du personnel de maison* (Cadre légal kényan, contrats, cotisations NSSF/SHIF/NHIF, salaires usuels).
  3. *Santé & Couverture médicale* (Hôpitaux de référence, médecins francophones, urgences).
  4. *Scolarité & Enfants* (Lycée Denis Diderot, IB & British curriculum schools, crèches).
  5. *Véhicules & Permis kényan* (Achat, dédouanement, conversion du permis, chauffeurs de confiance).
- **Search**: Instant client-side fuzzy search across all guides.

### Module 3: Hub Urgences SOS (Offline-First Emergency Center)
- **Zero-Latency Offline Access**: Always accessible, cached via PWA Service Worker.
- **Direct Click-to-Call SOS Buttons**:
  - *The Aga Khan University Hospital* (Emergency: +254 20 366 2000)
  - *The Nairobi Hospital* (Emergency: +254 20 284 5000 / +254 703 082 000)
  - *MP Shah Hospital* (Emergency: +254 20 429 1000)
  - *Ambulances privées (AAR / St John)*
  - *Pharmacies de garde (Westlands & Kilimani)*
  - *Urgence Ambassade de France / Consulat*
  - *Police & Fire Response*

### Module 4: Chatbot Telegram 24/7 & Assistant IA ("PocketBot")
- **Telegram Bot Integration**: `@NairobiInZePocketBot` (or configured handle).
- **Web App Demo/Trial Tab**: A embedded chat simulator within the PWA interface letting users test the bot's Q&A directly.
- **Bot Core Capabilities**: Answers expat queries at any hour (e.g. *"Quel pédiatre francophone appeler à Kilimani ?"*, *"Comment s'enregistrer à la NSSF pour une nounou ?"*) by searching the vector-embedded directory & knowledge base.

### Module 5: Authentification, Conformité DPA 2019 & Administration
- **Kenya DPA 2019 Compliance**:
  - Full phone numbers and private emails of independent service providers are gated behind member authentication (Magic Link / OTP or verified guest pass) to prevent unauthorized automated scraping.
  - Clear consent disclaimers on recommendation submissions.
  - One-click deletion/rectification request mechanism.
- **Admin Dashboard**: Moderation table to review submitted recommendations, toggle publication, edit provider records, and manage knowledge base articles.

---

## 4. User Journey & Interface Structure

1. **First Launch (Mobile Browser / PWA Prompt)**:
   - App loads under 500ms.
   - PWA banner: *"Installer Nairobi in ze Pocket sur votre écran d'accueil"*.
   - Instant access to emergency numbers and public directory overview.
2. **Navigation (Bottom Nav Bar on Mobile, Header Nav on Desktop)**:
   - 🏠 **Accueil** (Highlights, Quick Search, Emergency Banner, Recent Additions)
   - 📖 **Annuaire** (Filters by Category & Neighborhood, Search bar, Provider Cards)
   - 📚 **Guides** (Installation articles, Legal frameworks, Search)
   - 🤖 **PocketBot** (Telegram integration link & in-app interactive preview)
   - 👤 **Espace Membre / Admin** (Auth status, submission history, admin moderation panel)

---

## 5. Non-Functional Requirements & Performance Benchmarks

- **Lighthouse Performance Score**: > 95/100.
- **Time to Interactive (TTI)**: < 1.0s on standard 4G mobile networks.
- **PWA Capabilities**: Full offline caching of critical assets and emergency contacts via Workbox Service Worker.
- **Responsiveness**: Fluid layout across all viewports (320px mobile to 4K desktop).
