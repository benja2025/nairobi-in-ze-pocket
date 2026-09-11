import { CategoryId, NeighborhoodId, Provider } from '../types';

/**
 * Normalizes a string by converting to lowercase and stripping accents / diacritical marks.
 * e.g. "Médecin Spécialiste à l'Hôpital" -> "medecin specialiste a l'hopital"
 */
export function normalizeText(text: string): string {
  if (!text) return '';
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/**
 * Strips non-digit characters from phone strings to allow clean numerical fuzzy matching
 */
export function normalizePhone(phone: string): string {
  if (!phone) return '';
  return phone.replace(/[^0-9]/g, '');
}

/**
 * Strips all non-alphanumeric characters for fuzzy matching across punctuation/hyphens.
 * e.g. "Wi-Fi" -> "wifi", "Lang'ata" -> "langata", "E-commerce" -> "ecommerce"
 */
export function stripPunctuation(text: string): string {
  if (!text) return '';
  return normalizeText(text).replace(/[^a-z0-9]/g, '');
}

/**
 * Advanced Provider Filtering with:
 * 1. Multi-neighborhood filtering (array of selected neighborhoods, single id, or 'all')
 * 2. Multi-token, accent-insensitive, punctuation-agnostic, high-precision search
 * 3. Deep search through names, specialties, descriptions, tags, addresses, languages, phones, contributor notes.
 */
export function filterProviders(
  providers: Provider[],
  category: CategoryId | 'all',
  neighborhoods: NeighborhoodId | NeighborhoodId[] | 'all',
  searchQuery: string
): Provider[] {
  // Normalize neighborhood filter into an active filter list
  let activeNeighborhoods: NeighborhoodId[] = [];
  if (Array.isArray(neighborhoods)) {
    activeNeighborhoods = neighborhoods.filter((n) => n !== 'all');
  } else if (neighborhoods && neighborhoods !== 'all') {
    activeNeighborhoods = [neighborhoods];
  }

  const rawQuery = searchQuery.trim();
  const normalizedQuery = normalizeText(rawQuery);
  const searchTokens = normalizedQuery.split(/\s+/).filter(Boolean);

  return providers.filter((provider) => {
    // 1. Category Filter
    const matchesCategory = category === 'all' || provider.categoryId === category;
    if (!matchesCategory) return false;

    // 2. Multi-Neighborhood Filter
    const matchesNeighborhood =
      activeNeighborhoods.length === 0 ||
      activeNeighborhoods.includes(provider.neighborhoodId);
    if (!matchesNeighborhood) return false;

    // 3. High-Precision Keyword / Search Filter
    if (searchTokens.length === 0) return true;

    // Build comprehensive search corpus for this provider
    const rawCorpus = [
      provider.name,
      provider.specialty,
      provider.description,
      provider.address || '',
      provider.neighborhoodId,
      provider.categoryId,
      ...(provider.tags || []),
      ...(provider.languages || []),
      provider.sourceInfo?.originalNotes || '',
      provider.sourceInfo?.contributorRevealed || '',
      provider.sourceInfo?.contributorMasked || '',
      provider.sourceInfo?.badge || ''
    ].join(' ');

    const searchableCorpus = normalizeText(rawCorpus);
    const strippedCorpus = stripPunctuation(rawCorpus);

    const providerPhoneDigits = normalizePhone(provider.phone || '');
    const providerWhatsappDigits = normalizePhone(provider.whatsapp || '');

    // Check if the entire raw query is a phone number (e.g. "+254 722 900 111" or "0722 900 111")
    const phoneQuery = normalizePhone(rawQuery);
    const isFullPhoneSearch = /^[+]?[0-9\s().-]{6,}$/.test(rawQuery.trim());
    if (isFullPhoneSearch && phoneQuery.length >= 6) {
      if (providerPhoneDigits.includes(phoneQuery) || providerWhatsappDigits.includes(phoneQuery)) {
        return true;
      }
    }

    // Every token in the user's search query must match something in the provider corpus or phone digits
    return searchTokens.every((token) => {
      const normalizedToken = normalizeText(token);
      const strippedToken = stripPunctuation(token);
      const isNumericToken = /^[+]?[0-9\s().-]+$/.test(token.trim());
      const tokenDigits = normalizePhone(token);

      // Check standard normalized text
      if (searchableCorpus.includes(normalizedToken)) return true;

      // Check punctuation-stripped text (e.g. "wifi" matching "wi-fi", "langata" matching "lang'ata")
      if (strippedToken && strippedCorpus.includes(strippedToken)) return true;

      // Check phone numbers only if the token itself is formatted as numbers/phone digits
      if (isNumericToken && tokenDigits.length >= 3) {
        if (providerPhoneDigits.includes(tokenDigits) || providerWhatsappDigits.includes(tokenDigits)) {
          return true;
        }
      }

      return false;
    });
  });
}
