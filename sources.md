# Sources — 06_NairobiAccueil platform (Nairobi in ze Pocket)

## 1. Source de Vérité Canonique (SSOT)

Les contrats de modélisation à la racine et sous `docs/` constituent l'unique source de vérité officielle du projet :
- `AI-PRD.md` : Exigences fonctionnelles et techniques, critères Gherkin et Anti-Goals.
- `DATA-model.md` : Schémas relationnels PostgreSQL, politiques RLS et conformité Kenya DPA 2019.
- `api-spec.md` : Spécification des endpoints API REST et contrat Webhook Telegram.
- `UX-acceptance.md` : Cahier de recette UI/UX et respect des 5 états d'interface.
- `TDD.md` : Matrice de traçabilité des tests et couverture.
- `decisions.md` : Registre des décisions d'architecture (ADR).
- `docs/PLAYBOOK-ICPRA-NAIROBI-POCKET.md` : Protocole d'ingénierie ICPRA et transition Antigravity Remote.

## 2. Organisation par Cadres de Réutilisation

- **Cadre 1 (Gouvernance & Légal) :** `01_Gouvernance_Legal/` (Kenya Data Protection Act 2019, directives ODPC, statuts Nairobi Accueil / FIAFE).
- **Cadre 2 (Finance & Audit) :** `02_Finance_Audit/` (Cotisations annuelles M-Pesa Nairobi Accueil, coûts d'infrastructure cloud Supabase/Vercel).
- **Cadre 3 (Opérations & Produit) :** `03_Operations_Produit/` (Catalogue des prestataires vérifiés, fiches d'installation rédigées, numéros d'urgence SOS).
- **Cadre 4 (CRM & Commercial) :** `04_CRM_Commercial/` (Pont avec la communauté WhatsApp, configurations du Bot Telegram).
- **Cadre 5 (Marque & Marketing) :** `05_Brand_Marketing/` (Identité visuelle Slate & Safari Chic, assets graphiques, charte PWA).
- **Cadre 6 (Plateforme Digitale & Code) :** `00_PROJECT_CONTROL/` et `src/`.
- **Cadre 0 (Sas de Triage) :** `_Inbox_Staging/`.

## 3. Sources Externes & Références

- Site officiel de l'association partenaire : [Nairobi Accueil – Karibuni](https://nairobi-accueil.org/)
- Fédération de rattachement : [FIAFE](https://www.fiafe.org/accueil/nairobi/)
- Corpus juridique kényan : [Data Protection Act n° 24 de 2019 (ODPC Kenya)](https://www.odpc.go.ke/)
- Plateforme Telegram Bot API : `@NairobiInZePocketBot`
