import { Category, Neighborhood, Provider } from '../types';
import SEED_PROVIDERS_RAW from './seedProviders.json';

export const CATEGORIES: Category[] = [
  { id: 'sante', name: 'Santé & Médical', iconName: 'Stethoscope', description: 'Médecins francophones, hôpitaux, dentistes & pédiatres' },
  { id: 'fundis', name: 'Artisans & Fundis', iconName: 'Wrench', description: 'Plomberie, électricité, générateurs, clim & menuiserie' },
  { id: 'it_tech', name: 'IT & Réparation Mobile + Ordinateur', iconName: 'Laptop', description: 'Dépannage informatique, écrans iPhone/Android, Mac & réseaux Wi-Fi' },
  { id: 'education', name: 'Éducation & Écoles', iconName: 'GraduationCap', description: 'Lycée Denis Diderot, crèches & tuteurs francophones' },
  { id: 'transports', name: 'Transports & Chauffeurs', iconName: 'Car', description: 'Chauffeurs privés de confiance, taxis & véhicules' },
  { id: 'restaurant', name: 'Restaurant - Catering - Chef', iconName: 'ChefHat', description: 'Restaurants, traiteurs, chefs privés & gastronomie' },
  { id: 'loisirs', name: 'Loisirs & Safaris', iconName: 'Compass', description: 'Agences safari réceptives, sorties, parcs & culture' },
  { id: 'sport', name: 'Sport', iconName: 'Dumbbell', description: 'Coaching sportif, yoga, fitness, arts martiaux & équitation' },
  { id: 'domestique', name: 'Personnel de Maison', iconName: 'Home', description: 'Agences de placement certifiées, NSSF & SHIF' },
  { id: 'autres', name: 'Autres', iconName: 'MoreHorizontal', description: 'Démarches administratives, visas, soins esthétiques & services divers' }
];

export const NEIGHBORHOODS: Neighborhood[] = [
  { id: 'all', name: 'Tous les quartiers' },
  { id: 'westlands', name: 'Westlands / Spring Valley' },
  { id: 'gigiri', name: 'Gigiri / Runda' },
  { id: 'lavington', name: 'Lavington / Kilimani' },
  { id: 'karen', name: 'Karen / Lang\'ata' }
];

const IT_TECH_SEED_PROVIDERS: Provider[] = [
  {
    id: 'it_tech_1',
    name: 'Mac & PC Clinic Nairobi (Sarit Centre)',
    categoryId: 'it_tech',
    neighborhoodId: 'westlands',
    specialty: 'Spécialiste Apple Mac, PC Windows, Claviers & Batteries',
    description: 'Centre technique certifié au Sarit Centre. Diagnostic express, réparation cartes mères, remplacement d\'écrans Retina et récupération de disques SSD corrompus.',
    phone: '+254 722 900 111',
    whatsapp: '+254722900111',
    address: 'Sarit Centre, Lower Ground Floor, Karuna Rd, Westlands, Nairobi',
    languages: ['Français', 'Anglais'],
    isVerified: true,
    rating: 4.9,
    reviewsCount: 28,
    tags: ['MacBook', 'PC Windows', 'Récupération Données', 'Westlands', 'Sarit Centre'],
    sourceInfo: {
      badge: 'Nairobi Accueil',
      channel: 'nairobi_accueil_member',
      uploadedAt: '2026-09-01T20:25:00.000Z',
      contributorMasked: 'Recommandé par le bureau',
      contributorRevealed: 'Claire V. (Nairobi Accueil)',
      reliabilityScore: 5,
      originalNotes: 'Service rapide et soigné pour réparer mon MacBook Pro en 24h au Sarit Centre.',
      sourceSheet: 'IT & High Tech'
    }
  },
  {
    id: 'it_tech_2',
    name: 'iRepairs Express Kilimani & Yaya Centre',
    categoryId: 'it_tech',
    neighborhoodId: 'lavington',
    specialty: 'Écrans iPhone, Samsung Galaxy, Batteries & Connecteurs USB-C',
    description: 'Dépannage express de smartphones et tablettes en 45 minutes. Pièces d\'origine garanties, film protecteur hydrogel offert. Technicien francophone disponible sur RDV.',
    phone: '+254 715 444 888',
    whatsapp: '+254715444888',
    address: 'Yaya Centre Shopping Mall, 2nd Floor, Argwings Kodhek Rd, Kilimani, Nairobi',
    languages: ['Français', 'Anglais'],
    isVerified: true,
    rating: 4.8,
    reviewsCount: 35,
    tags: ['iPhone', 'Samsung', 'Écran Cassé', 'Yaya Centre', 'Kilimani'],
    sourceInfo: {
      badge: 'WhatsApp Verified',
      channel: 'whatsapp_group',
      uploadedAt: '2026-09-01T20:25:00.000Z',
      contributorMasked: 'Recommandé par un membre',
      contributorRevealed: 'Marc L.',
      reliabilityScore: 5,
      originalNotes: 'Remplacement de l\'écran de mon iPhone 14 en moins d\'une heure.',
      sourceSheet: 'IT & High Tech'
    }
  },
  {
    id: 'it_tech_3',
    name: 'David Tech Fundi (Réseau Wi-Fi, Starlink & Imprimantes)',
    categoryId: 'it_tech',
    neighborhoodId: 'karen',
    specialty: 'Installation Starlink, Routeurs Mesh Wi-Fi 6, Onduleurs & Domotique',
    description: 'Intervention informatique et réseau à domicile. Spécialiste de l\'installation d\'antennes Starlink, optimisation Wi-Fi multi-étages et sécurisation des box fibre optique.',
    phone: '+254 798 333 222',
    whatsapp: '+254798333222',
    address: 'Karen Shopping Centre & Déplacements dans tout Nairobi (Gigiri, Lavington, Runda)',
    languages: ['Anglais', 'Français', 'Swahili'],
    isVerified: true,
    rating: 5.0,
    reviewsCount: 22,
    tags: ['Starlink', 'Wi-Fi Mesh', 'Réseau Domicile', 'Karen', 'Gigiri'],
    sourceInfo: {
      badge: 'WhatsApp Verified',
      channel: 'whatsapp_group',
      uploadedAt: '2026-09-01T20:25:00.000Z',
      contributorMasked: 'Recommandé par un membre',
      contributorRevealed: 'Julien M.',
      reliabilityScore: 5,
      originalNotes: 'Super efficace pour poser Starlink et configurer le Wi-Fi dans toute la maison et le jardin.',
      sourceSheet: 'IT & High Tech'
    }
  },
  {
    id: 'it_tech_ben',
    name: 'Ben',
    categoryId: 'it_tech',
    neighborhoodId: 'gigiri',
    specialty: 'Bilingue français anglais, +15 ans d\'expérience en création de site internet vitrine et e-commerce, branding & marketing digital.',
    description: 'Bilingue français anglais, +15 ans d\'expérience en création de site internet vitrine et e-commerce, branding & marketing digital.',
    phone: '+254 700 000 000',
    whatsapp: '+254700000000',
    address: 'Gigiri / Runda, Nairobi',
    languages: ['Français', 'Anglais'],
    isVerified: true,
    rating: 5.0,
    reviewsCount: 3,
    tags: ['Web Design', 'E-commerce', 'Branding', 'Gigiri', 'French Tech'],
    sourceInfo: {
      badge: 'Nairobi Accueil',
      channel: 'nairobi_accueil_member',
      uploadedAt: '2026-09-01T20:25:00.000Z',
      contributorMasked: 'Recommandé par Ben',
      contributorRevealed: 'Ben (Membre Nairobi Accueil)',
      reliabilityScore: 5,
      originalNotes: 'Bilingue français anglais, +15 ans d\'expérience en création de site internet vitrine et e-commerce, branding & marketing digital.',
      sourceSheet: 'IT & High Tech'
    }
  }
];

// Combine initial curated seeds with community ingested contacts
export const MOCK_PROVIDERS: Provider[] = [
  ...IT_TECH_SEED_PROVIDERS,
  ...(SEED_PROVIDERS_RAW as unknown as Provider[])
];

