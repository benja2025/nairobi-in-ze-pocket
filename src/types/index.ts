export type CategoryId = 'sante' | 'fundis' | 'it_tech' | 'education' | 'transports' | 'restaurant' | 'loisirs' | 'sport' | 'domestique' | 'autres';

export type NeighborhoodId = 'all' | 'westlands' | 'gigiri' | 'runda' | 'lavington' | 'karen' | 'kilimani';

export type SourceBadge = 'WhatsApp Verified' | 'Nairobi Accueil' | 'Ambassade' | 'Direct Submission';

export type SourceChannel = 'whatsapp_group' | 'nairobi_accueil_member' | 'embassy_list' | 'direct_submission';

export interface ProviderSourceInfo {
  badge: SourceBadge;
  channel: SourceChannel;
  uploadedAt: string;                 // ISO 8601 string, e.g. "2026-09-01T20:25:00Z"
  contributorMasked: string;          // Default display label: "Recommandé par un membre"
  contributorRevealed: string;        // Revealed on user click/interaction: "Marie Élodie C."
  reliabilityScore: number;           // 1 to 5 trust index
  originalNotes?: string;             // Verbatim remarks from original source sheet
  sourceSheet?: string;               // Original Excel sheet name
}

export interface Category {
  id: CategoryId;
  name: string;
  iconName: string;
  description: string;
}

export interface Neighborhood {
  id: NeighborhoodId;
  name: string;
  description?: string;
}

export interface Provider {
  id: string;
  name: string;
  categoryId: CategoryId;
  neighborhoodId: Exclude<NeighborhoodId, 'all'>;
  specialty: string;
  description: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  address?: string;
  pricingNotes?: string;
  languages: string[];
  isVerified: boolean;
  rating: number;
  reviewsCount: number;
  tags: string[];
  sourceInfo?: ProviderSourceInfo;
  createdAt?: string;
}

export interface EmergencyContact {
  id: string;
  title: string;
  category: 'hospital' | 'ambulance' | 'pharmacy' | 'embassy' | 'security';
  phone: string;
  secondaryPhone?: string;
  neighborhood?: string;
  address?: string;
  is247: boolean;
  notes?: string;
}

export interface GuideSection {
  title: string;
  subtitle?: string;
  content: string;
  bulletPoints?: string[];
  tip?: string;
}

export interface Guide {
  id: string;
  title: string;
  category: string;
  summary: string;
  imageUrl?: string;
  author: string;
  readTimeMinutes: number;
  updatedAt: string;
  iconName: string;
  keyTakeaways?: string[];
  sections?: GuideSection[];
  contentMd?: string;
}

export interface ProviderSubmission {
  id?: string;
  providerName: string;
  categoryId: CategoryId;
  neighborhoodId: Exclude<NeighborhoodId, 'all'>;
  phone: string;
  description: string;
  submitterName: string;
  submitterEmail: string;
  consentGiven: boolean;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface TelegramWaitlistEntry {
  id: string;
  name?: string;
  telegramHandle: string;
  source: string;
  createdAt: string;
}

export interface ModeratorApplication {
  id: string;
  fullName: string;
  email: string;
  phoneOrWhatsapp: string;
  neighborhood?: string;
  motivation?: string;
  status: 'pending' | 'reviewed' | 'accepted';
  createdAt: string;
}


