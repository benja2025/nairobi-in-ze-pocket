# TDD — Matrice de Tests & Protocole d'Ingénierie — Nairobi in ze Pocket

> **Standard Appliqué :** Pilier 3 du Context Engineering (TDD under steroids) & Matrice de Recette ICPRA.

---

## 1. Principes du Cycle Red-Green-Refactor

Aucune modification de code métier, d'algorithme de filtrage ou de composant ne peut être intégrée sans validation préalable par un test automatisé :
1. **Étape Rouge (Red) :** Écriture du test unitaire ou de composant spécifiant le comportement attendu. Le test échoue.
2. **Étape Verte (Green) :** Écriture du code minimal satisfaisant le test jusqu'à obtention de `exit_code == 0`.
3. **Étape Refactor & Commit :** Nettoyage du typage TypeScript strict et commit Git atomique conventionnel.

---

## 2. Inventaire des Suites de Tests Existantes

| Fichier de Test | Type | Périmètre Testé | Nombre de Tests | Résultat |
| :--- | :--- | :--- | :--- | :--- |
| `src/tests/FrontendConsistencyGuardian.test.tsx` | Test de Composants & A11y | Quadriptyque Frontend ICPRA : Cibles 44x44px (BottomNav, Header, ProviderCard), Loi des 5 États UI (Loading Skeleton, Empty avec CTA, Error avec Retry, Offline), Accessibilité formulaires et verrouillage DPA 2019. | 8 tests | 8 passed |
| `src/tests/RecommendationFlow.test.tsx` | Test d'Intégration | Cycle de recommandation, modération et promotion dans l'annuaire. | 7 tests | 7 passed |
| `src/tests/CardModificationFlow.test.tsx` | Test d'Intégration | Édition directe et mise à jour dynamique des fiches. | 5 tests | 5 passed |
| `src/tests/directoryFilter.test.ts` | Test Unitaire / Algorithmique | Filtrage sans filtre, par quartier (Lavington), par catégorie (santé), combiné avec recherche textuelle floue, gestion des résultats vides. | 16 tests | 16 passed |
| `src/tests/PersistenceRootCauses.test.ts` | Test Unitaire / Robustesse | Persistance locale, gestion des corruptions et intégrité du cache. | 5 tests | 5 passed |
| `src/tests/SupabaseSync.test.ts` | Test Unitaire & Mock | Synchronisation cloud Supabase et résilience hors-ligne. | 7 tests | 7 passed |
| `src/tests/StorageService.test.ts` | Test Unitaire / Services | CRUD providers, submissions, waitlist et export/import. | 7 tests | 7 passed |
| `src/tests/ProviderCrud.test.ts` | Test Unitaire | Invariants de données prestataires. | 3 tests | 3 passed |
| `src/tests/TelegramIntegration.test.tsx` | Test de Composant | Modal d'annonce et alertes Telegram. | 3 tests | 3 passed |
| `src/tests/EmergencyHub.test.tsx` | Test de Composant | Présence des hôpitaux de référence (Aga Khan, Nairobi Hospital), intégrité des liens d'appel direct `tel:+254203662000`. | 2 tests | 2 passed |
| `src/tests/SubmissionForm.test.tsx` | Test de Composant & Sécurité | Présence des mentions légales Kenya DPA 2019, verrouillage strict du bouton de soumission tant que la case n'est pas cochée. | 2 tests | 2 passed |
| **Total Suite Vitest** | **11 Suites** | **Couverture Frontend, Logique & Contrats Métier** | **65 tests** | **100% passed** |

---

## 3. Matrice de Traçabilité des Exigences (RTM)

| Exigence PRD | Cas de Test Vitest | Assertion Clé |
| :--- | :--- | :--- |
| **REQ-DIR-01 (Filtrage Quartier)** | `directoryFilter.test.ts` (test 2) | `expect(results.every((p) => p.neighborhoodId === 'lavington')).toBe(true)` |
| **REQ-DIR-02 (Filtrage Catégorie)** | `directoryFilter.test.ts` (test 3) | `expect(results.every((p) => p.categoryId === 'sante')).toBe(true)` |
| **REQ-DIR-03 (Fuzzy Search)** | `directoryFilter.test.ts` (test 4) | `expect(results[0].name).toContain('Dubois')` |
| **REQ-SOS-01 (Click-to-Call SOS)** | `EmergencyHub.test.tsx` (test 2) | `expect(agaKhanLink.getAttribute('href')).toContain('203662000')` |
| **REQ-DPA-01 (Consentement DPA)** | `SubmissionForm.test.tsx` (test 2) | `expect(submitBtn).toBeDisabled()` avant clic, actif après |

---

## 4. Commandes de Validation Déterministes

```powershell
# Exécution de la suite de tests unitaires et de composants
npm run test

# Validation du typage strict TypeScript et génération du bundle de production
npm run build
```
