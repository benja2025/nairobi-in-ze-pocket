# Modélisation des Cas d'Utilisation UML — Nairobi in ze Pocket

> **Standard :** Conforme au skill `uml-usecase-designer` (ICPRA Edition) et au formalisme strict OMG UML 2.5.  
> **Traçabilité :** Chaque cas d'utilisation (`UCxx`) est relié aux exigences fonctionnelles du `AI-PRD.md`.

---

## 1. Diagramme des Cas d'Utilisation (Mermaid)

```mermaid
flowchart LR
    %% 1. Définition des Styles Sémantiques
    classDef actor fill:#0F172A,stroke:#3B82F6,stroke-width:2px,color:#F8FAFC;
    classDef usecase fill:#1E293B,stroke:#F59E0B,stroke-width:1.5px,color:#F8FAFC;
    classDef system fill:#090D16,stroke:#475569,stroke-width:1px,stroke-dasharray: 4 4,color:#94A3B8;
    classDef thirdParty fill:#172554,stroke:#2563EB,stroke-width:1.5px,color:#93C5FD;

    %% 2. Acteurs Externes (Strictement en dehors du Système)
    VP["👤 VP: Visiteur Public / Nouvel Arrivant"]:::actor
    MB["👤 MB: Membre Nairobi Accueil"]:::actor
    AD["👤 AD: Modérateur / Administrateur"]:::actor
    BOT["🤖 BOT: PocketBot Assistant"]:::actor

    %% Systèmes Tiers Externes
    EXT_TG["⚙️ API Telegram (Serveurs Officiels)"]:::thirdParty
    EXT_MAPS["⚙️ Services Cartographiques (Google Maps)"]:::thirdParty
    EXT_WA["⚙️ API WhatsApp Web / Mobile"]:::thirdParty

    %% Héritage des Rôles
    MB -->|hérite| VP
    AD -->|hérite| MB

    %% 3. Frontière du Système (System Boundary)
    subgraph AppSystem["Frontière du Système : Nairobi in ze Pocket (PWA & Engine)"]
        direction TB

        subgraph P1["1. Consultation & Urgences (Offline-First)"]
            UC01(["UC01: Déclencher Appel d'Urgence SOS"]):::usecase
            UC02(["UC02: Rechercher et Filtrer les Prestataires"]):::usecase
            UC03(["UC03: Consulter les Fiches Pratiques Expat"]):::usecase
            UC04(["UC04: Lancer l'Itinéraire d'un Prestataire"]):::usecase
            UC05(["UC05: Contacter un Prestataire via WhatsApp"]):::usecase
        end

        subgraph P2["2. Entraide & Modération Communautaire"]
            UC06(["UC06: Soumettre une Recommandation d'Artisan"]):::usecase
            UC06_DPA(["<<include>> Certifier Consentement DPA 2019"]):::usecase
            UC07(["UC07: Modérer la File d'Attente des Soumissions"]):::usecase
            UC08(["UC08: Éditer le Référentiel des Prestataires"]):::usecase
        end

        subgraph P3["3. Assistance Intelligente 24/7"]
            UC09(["UC09: Traiter une Requête Utilisateur 24/7"]):::usecase
            UC10(["UC10: Diffuser le Protocole SOS Prioritaire"]):::usecase
            UC11(["UC11: Simuler une Conversation PocketBot en WebApp"]):::usecase
        end
    end

    %% 4. Liaisons Acteurs -> Cas d'Utilisation
    VP --> UC01
    VP --> UC02
    VP --> UC03
    VP --> UC11

    MB --> UC04
    MB --> UC05
    MB --> UC06

    AD --> UC07
    AD --> UC08

    BOT --> UC09
    BOT --> UC10

    %% 5. Dépendances Dérivées & Systèmes Tiers
    UC06 -.->|<<include>>| UC06_DPA
    UC04 -.-> EXT_MAPS
    UC05 -.-> EXT_WA
    UC09 -.-> EXT_TG
    UC10 -.-> EXT_TG
```

---

## 2. Matrice des Rôles & Traçabilité des Cas d'Utilisation

| Code UC | Libellé Métier du Cas d'Utilisation | Acteur Primaire | Condition Préalable | Exigence PRD |
| :--- | :--- | :--- | :--- | :--- |
| **UC01** | Déclencher un Appel d'Urgence SOS | Visiteur Public (`VP`) | Aucun (Disponible 100% Offline via PWA Service Worker) | REQ-SOS-01 |
| **UC02** | Rechercher et Filtrer les Prestataires | Visiteur Public (`VP`) | Aucune restriction | REQ-DIR-01 / 02 |
| **UC03** | Consulter les Fiches Pratiques Expat | Visiteur Public (`VP`) | Aucune restriction | REQ-GUI-01 |
| **UC04** | Lancer l'Itinéraire d'un Prestataire | Membre (`MB`) | Adresse valide du prestataire | REQ-DIR-03 |
| **UC05** | Contacter un Prestataire via WhatsApp | Membre (`MB`) | Numéro E.164 vérifié | REQ-DIR-03 |
| **UC06** | Soumettre une Recommandation d'Artisan | Membre (`MB`) | Consentement `consent_given=true` obligatoire | REQ-SUB-01 |
| **UC07** | Modérer la File d'Attente des Soumissions | Administrateur (`AD`) | Authentifié avec rôle admin Supabase | REQ-ADM-01 |
| **UC08** | Éditer le Référentiel des Prestataires | Administrateur (`AD`) | Authentifié avec rôle admin Supabase | REQ-ADM-02 |
| **UC09** | Traiter une Requête Utilisateur 24/7 | PocketBot (`BOT`) | Message reçu via Webhook HTTPS | REQ-BOT-01 |
| **UC10** | Diffuser le Protocole SOS Prioritaire | PocketBot (`BOT`) | Mots-clés vitaux détectés dans le prompt | REQ-BOT-02 |
| **UC11** | Simuler une Conversation PocketBot en WebApp | Visiteur Public (`VP`) | Navigateur compatible React | REQ-BOT-03 |
