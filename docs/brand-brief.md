# Brand Brief & Visual Identity: Nairobi in ze Pocket

> **DESIGN PHILOSOPHY**: "French Tech Senior Shipper" — Refined, uncluttered, state-of-the-art UX designed specifically for mobile touch devices, combining Parisian tech elegance with warm Nairobi safari accents.

---

## 1. Color Palette & Design Tokens

The application uses an **HSL-driven design token system** built on top of TailwindCSS variables:

### Primary Slate & Dark Modes (`Slate / Dark Navy`)
- **Background Primary**: `#0F172A` (Slate 900) / `#090D16` (Deep Obsidian)
- **Card Background**: `#1E293B` (Slate 800) with subtle border `#334155` (Slate 700)
- **Text Main**: `#F8FAFC` (Slate 50)
- **Text Muted**: `#94A3B8` (Slate 400)

### Safari Chic Accent Tokens
- **Accent Gold (Nairobi Sunset)**: `#D97706` (Amber 600) / `#F59E0B` (Amber 500)
- **French Tech Blue (Royal Navy)**: `#2563EB` (Blue 600) / `#3B82F6` (Blue 500)
- **Emergency Crimson (SOS Hub)**: `#DC2626` (Red 600) / `#EF4444` (Red 500)
- **Verified Emerald**: `#059669` (Emerald 600) / `#10B981` (Emerald 500)

---

## 2. Typography & Hierarchy

- **Font Family**: Google Font `Plus Jakarta Sans` or `Inter` (sans-serif) for high legibility on high-DPI smartphone displays.
- **Headings**:
  - `H1` (Page Title): `text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-50`
  - `H2` (Section Header): `text-lg sm:text-xl font-bold tracking-tight text-slate-100`
  - `H3` (Card Title): `text-base font-semibold text-slate-100`
- **Body & Captions**:
  - Body: `text-sm text-slate-300 leading-relaxed`
  - Badges/Tags: `text-xs font-medium uppercase tracking-wider`

---

## 3. UI Component Patterns & Rules

### A. Mobile Bottom Navigation Bar (`BottomNav.tsx`)
- Fixed at screen bottom (`fixed bottom-0 left-0 right-0 z-50`).
- Glassmorphism backdrop (`bg-slate-900/90 backdrop-blur-md border-t border-slate-800`).
- 5 items: **Accueil**, **Annuaire**, **Guides**, **PocketBot**, **Profil/Admin**.
- Active tab indicator: Glow highlight with Amber/Blue accent + smooth scale micro-animation.

### B. Directory Provider Card (`ProviderCard.tsx`)
- Clean rounded container (`rounded-2xl bg-slate-800/80 border border-slate-700/60 p-4 shadow-lg`).
- Header: Name, Verified Badge (`VerifiedEmerald`), Category badge, Neighborhood pill.
- Action Buttons Grid: 3 touch-friendly buttons (`Appeler`, `WhatsApp`, `Itinéraire`).
- Rating & Reviews count snippet.

### C. Category & Neighborhood Badges
- Neighborhood badges: Soft pill style (`px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20`).
- Category badges: Soft pill style (`px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20`).

### D. Emergency SOS Cards (`EmergencyCard.tsx`)
- High-visibility red tint (`bg-red-950/40 border border-red-800/60 p-4 rounded-xl`).
- Prominent `Call SOS` button with pulsing icon.

---

## 4. Micro-Animations & Motion Design

- **Framework**: `framer-motion`.
- **Page Transitions**: Smooth fade & slight vertical slide (`initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}`).
- **Button Touch Feedback**: Micro spring scaling on tap (`whileTap={{ scale: 0.96 }}`).
- **Modal & Filter Drawer Slide**: Bottom sheet spring animation on mobile devices.

---

## 5. Forbidden Cliché Tropes (Strict Compliance)

- ❌ No generic dashboard widgets where a clean directory list is required.
- ❌ No purple/violet fonts on dark background.
- ❌ No harsh colored border outlines or blinding neon glows.
- ❌ No untracked, overlapping giant typography.
- ❌ No generic stock placeholders. All sample images use generated SVG placeholders or clean Nairobi photography assets.
