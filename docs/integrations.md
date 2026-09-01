# Integrations & External Services: Nairobi in ze Pocket

> **SYSTEM INTEGRATIONS**: Supabase Backend, Telegram Bot API, PWA Deployment & Webhook Setup.

---

## 1. Supabase Database & Auth Integration

- **Provider**: Supabase (PostgreSQL 15+)
- **Connection SDK**: `@supabase/supabase-js`
- **Fallback Architecture**: When `VITE_SUPABASE_URL` is omitted or unavailable, the application gracefully degrades to **Local Data Driver Mode**, drawing directly from client-side mock datasets (`src/data/`). This allows 100% full offline & offline-first demo capability.

### Client Initialization (`src/lib/supabase.ts`)
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
```

---

## 2. Telegram Bot API Integration (`@NairobiInZePocketBot`)

- **Bot Handle**: `@NairobiInZePocketBot`
- **Primary Mechanism**: Webhook via Supabase Edge Functions or Node serverless endpoint.
- **Webhook Endpoint**: `POST /api/telegram-webhook`

### Telegram Bot Commands
- `/start` : Welcome message + main menu button linking to PWA URL.
- `/urgences` : Returns immediate click-to-call SOS numbers (Aga Khan, Nairobi Hospital, Ambulances).
- `/recherche <query>` : Searches the database for providers or guides (e.g. `/recherche pediatre Kilimani`).
- `/guide` : List top installation guides.

---

## 3. Web & PWA External Triggers

- **Click-to-Call**: `tel:+254712345678` (Invokes smartphone native dialer)
- **WhatsApp Direct**: `https://wa.me/254712345678?text=Bonjour,%20je%20vous%20contacte%20via%20Nairobi%20in%20ze%20Pocket`
- **Google Maps Navigation**: `https://www.google.com/maps/search/?api=1&query={encoded_address_or_coords}`

---

## 4. Kenya Data Protection Officer (ODPC) Compliance Metadata

- **Data Controller**: Private initiative supporting Nairobi Accueil.
- **Data Minimization Policy**: Phone numbers & emails are processed solely for display within the community directory and are never sold or exported to third parties.
- **Rectification/Deletion Handler**: Users can submit removal requests directly via `contact@nairobi-in-ze-pocket.app` or via the in-app submission deletion trigger.
