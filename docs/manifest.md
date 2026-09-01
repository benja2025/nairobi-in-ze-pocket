# Manifest & Technical Architecture: Nairobi in ze Pocket

> **CONTEXT ENGINEERING**: Technical stack declaration, module compartmentalization (Pillar 2), and AI Prompt Guardrails (Pillar 4).

---

## 1. Technical Stack & Build Infrastructure

- **Frontend Core**: React 18+ with TypeScript (Strict mode enabled)
- **Build Tooling**: Vite 5+ (Fast HMR, ESBuild bundling)
- **Styling Engine**: TailwindCSS 3+ with `@tailwindcss/typography` plugin
- **Icons & Visuals**: `lucide-react`
- **Animations**: `framer-motion`
- **PWA Caching**: `vite-plugin-pwa` + `workbox-window`
- **State & Data Fetching**: Zustand / React Context + TanStack Query (or Supabase Client SDK)
- **Testing Engine**: Vitest + `@testing-library/react` + `@testing-library/jest-dom`
- **Backend & Database**: Supabase (PostgreSQL 15+, Auth, RLS, Storage)
- **Bot Engine**: Telegram Bot Webhook (Node.js / Supabase Edge Functions + `grammy` or native `fetch` Telegram API)

---

## 2. Compartmentalization & Architecture Boundaries (Pillar 2)

To enable multi-agent or isolated feature development without regression, the codebase is strictly segregated into isolated modules:

```
src/
├── components/          # Reusable Pure UI Components (No direct API state)
│   ├── ui/              # Button, Input, Modal, Badge, Card, Spinner
│   ├── layout/          # Header, BottomNav, Footer, Container
│   └── icons/           # App SVG Branding Icons
├── features/            # Feature-based compartmentalized modules
│   ├── directory/       # ProviderCard, FilterBar, NeighborhoodSelector, ProviderModal
│   ├── guides/          # GuideCard, GuideReader, SearchGuides
│   ├── emergency/       # EmergencySosCard, SOSCallButton, EmergencyList
│   ├── bot/             # TelegramBotWidget, ChatSimulator
│   ├── submit/          # SubmissionForm, ConsentDisclaimer
│   └── admin/           # ModerationTable, ContentEditor
├── data/                # Mock seed data (30+ Nairobi providers, guides, emergency contacts)
├── lib/                 # Supabase client, Telegram API client, PWA helpers
├── types/               # TypeScript global domain interfaces
└── tests/               # Unit, Integration & Component Tests
```

### Module Egress & Security Firewalls
- **`components/ui`**: ZERO dependencies on `features/` or `lib/supabase`. Pure presentational props only.
- **`data/`**: Pure immutable TypeScript mock datasets used for offline fallback and local development/testing without live keys.
- **`lib/telegram.ts`**: Isolated webhook & API client. Does not mutate client-side state directly.

---

## 3. LLM Prompt Guardrails & Bot Safety System Instructions (Pillar 4)

When the **PocketBot** (Telegram Bot or In-App Assistant) processes user inquiries, it MUST operate strictly under the following system prompt constraints:

```markdown
### SYSTEM PROMPT CONSTRAINTS FOR POCKETBOT
1. **ROLE**: You are "PocketBot", the 24/7 AI Assistant for the expat app "Nairobi in ze Pocket" (in support of Nairobi Accueil).
2. **TONE**: Helpful, welcoming, concise, professional, warm, French-speaking.
3. **GROUNDING & TRUTHFULNESS**:
   - You MUST ground your answers ONLY in the provided Nairobi knowledge base (guides, emergency contacts, verified directory).
   - If a provider, contact, or emergency number is NOT in the database, explicitly state: *"Je n'ai pas ce contact spécifique vérifié dans notre annuaire. N'hésite pas à demander sur le groupe WhatsApp ou à soumettre une recommandation dans l'app."*
   - NEVER fabricate phone numbers, medical advice, or legal contracts.
4. **EMERGENCY RESPONSE PROTOCOL**:
   - If the user query contains keywords related to medical emergencies, accidents, or police (e.g., "urgence", "hôpital", "accident", "ambulance", "police"), IMMEDIATELY output the direct phone numbers for **The Aga Khan University Hospital (+254 20 366 2000)** and **The Nairobi Hospital (+254 20 284 5000)** as the very first line of your response.
5. **DPA 2019 PRIVACY GUARDRAIL**:
   - Do NOT output private personal addresses or unverified personal phone numbers of individuals. Direct users to the authenticated PWA directory.
```

---

## 4. Environment Variables Specification (`.env.example`)

```env
# Application Settings
VITE_APP_NAME="Nairobi in ze Pocket"
VITE_APP_URL="https://nairobi-in-ze-pocket.app"

# Supabase Credentials (Optional for local Mock mode)
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-key"

# Telegram Bot Integration
TELEGRAM_BOT_TOKEN="your-telegram-bot-token"
TELEGRAM_BOT_HANDLE="@NairobiInZePocketBot"
```
