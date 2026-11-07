# Nairobi in ze Pocket — Spécification d'API & Contrat Webhook Telegram

> **Version :** 1.0 — 7 novembre 2026 — OpenAPI 3.1 & Telegram Bot API v7+.  
> **Norme d'Erreur :** RFC 7807 (`application/problem+json`).

---

## 1. Vue d'Ensemble & Principes d'Ingénierie

L'API est conçue pour être servie soit via **Supabase Edge Functions** (Deno/TypeScript), soit via un proxy API Node.js léger en amont d'Antigravity Remote.
Toutes les réponses d'erreur respectent le standard IETF RFC 7807 :
```json
{
  "type": "https://nairobi-in-ze-pocket.app/errors/validation-error",
  "title": "Erreur de validation des données",
  "status": 422,
  "detail": "Le consentement Kenya DPA 2019 est obligatoire.",
  "instance": "/api/submissions"
}
```

---

## 2. Endpoints REST Publics & Sécurisés

### A. `GET /api/providers`
Récupération filtrée des prestataires de l'annuaire.

- **Paramètres de requête (Query Params) :**
  - `category` (optionnel) : `sante` | `fundis` | `education` | `transports` | `loisirs` | `domestique`
  - `neighborhood` (optionnel) : `westlands` | `gigiri` | `lavington` | `karen` | `runda` | `kilimani`
  - `q` (optionnel) : terme de recherche textuelle libre.
- **Réponse nominale (200 OK) :**
  ```json
  [
    {
      "id": "p1",
      "name": "Dr. Marc Dubois - Pédiatre",
      "categoryId": "sante",
      "neighborhoodId": "lavington",
      "specialty": "Pédiatrie & Médecine Générale Francophone",
      "description": "Pédiatre conventionné...",
      "phone": "+254 712 345 678",
      "whatsapp": "+254712345678",
      "email": "dr.dubois@nairobi-health.co.ke",
      "languages": ["Français", "Anglais"],
      "isVerified": true,
      "rating": 4.9,
      "reviewsCount": 42,
      "tags": ["Pédiatre", "Francophone", "Urgence Enfant"]
    }
  ]
  ```

---

### B. `GET /api/emergency`
Récupération des contacts d'urgence vitale pour synchronisation PWA.

- **Réponse nominale (200 OK) :**
  ```json
  [
    {
      "id": "e1",
      "title": "The Aga Khan University Hospital (Urgences)",
      "category": "hospital",
      "phone": "+254 20 366 2000",
      "secondaryPhone": "+254 703 082 000",
      "neighborhood": "Westlands / Parklands",
      "address": "3rd Parklands Ave, Nairobi",
      "is247": true,
      "notes": "Hôpital généraliste de référence..."
    }
  ]
  ```

---

### C. `POST /api/submissions`
Soumission d'une nouvelle recommandation de prestataire.

- **Headers :** `Content-Type: application/json`
- **Corps de la requête (Request Body) :**
  ```json
  {
    "providerName": "John Fundi Plomberie",
    "categoryId": "fundis",
    "neighborhoodId": "lavington",
    "phone": "+254 721 112 233",
    "description": "Plombier d'urgence réactif, intervention un dimanche matin.",
    "submitterName": "Sophie Bernard",
    "submitterEmail": "sophie.b@gmail.com",
    "consentGiven": true
  }
  ```
- **Réponse nominale (201 Created) :**
  ```json
  {
    "status": "success",
    "message": "Recommandation soumise pour modération.",
    "submissionId": "f47ac10b-58cc-4372-a567-0e02b2c3d479"
  }
  ```
- **Erreur si `consentGiven !== true` (422 Unprocessable Entity) :**
  ```json
  {
    "type": "https://nairobi-in-ze-pocket.app/errors/consent-required",
    "title": "Consentement DPA 2019 Manquant",
    "status": 422,
    "detail": "Conformément au Kenya Data Protection Act 2019, vous devez certifier avoir obtenu le consentement du prestataire."
  }
  ```

---

## 3. Contrat Webhook Telegram (`POST /api/telegram-webhook`)

Le bot Telegram officiel `@NairobiInZePocketBot` est synchronisé via un webhook serverless chiffré par secret token HTTP.

- **Headers obligatoires :**
  - `X-Telegram-Bot-Api-Secret-Token` : Clé secrète validant que la requête émane exclusivement des serveurs officiels de Telegram.
- **Payload d'événement (Telegram Update) :**
  ```json
  {
    "update_id": 1000284,
    "message": {
      "message_id": 42,
      "from": {
        "id": 987654321,
        "is_bot": false,
        "first_name": "Jean",
        "language_code": "fr"
      },
      "chat": {
        "id": 987654321,
        "type": "private"
      },
      "date": 1786882000,
      "text": "Où trouver un bon pédiatre francophone ?"
    }
  }
  ```

### Protocole de Routage Déterministe du Bot :
1. **`/start` :** Message de bienvenue chaleureux, présentation de Nairobi in ze Pocket et bouton de lancement PWA (`InlineKeyboardMarkup` avec WebApp URL).
2. **`/urgences` ou mots-clés vitaux (*"urgence", "hôpital", "accident", "ambulance"*) :**  
   Déclenchement immédiat du **Protocole SOS Prioritaire** avec les numéros directs de l'Aga Khan (+254 20 366 2000) et Nairobi Hospital (+254 20 284 5000).
3. **Recherche sémantique / vectorielle :**  
   Recherche dans la table `providers` et `guides` pour formuler une réponse factuelle, sourcée et sans hallucination.
4. **Fallback si inexistant :**  
   *"Je n'ai pas ce contact spécifique vérifié dans notre annuaire. N'hésite pas à demander sur le groupe WhatsApp ou à soumettre une recommandation dans l'app."*
