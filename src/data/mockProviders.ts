import { Category, Neighborhood, Provider } from '../types';
import SEED_PROVIDERS_RAW from './seedProviders.json';

export const CATEGORIES: Category[] = [
  { id: 'sante', name: 'Santé & Médical', iconName: 'Stethoscope', description: 'Médecins francophones, hôpitaux, dentistes & pédiatres' },
  { id: 'fundis', name: 'Artisans & Fundis', iconName: 'Wrench', description: 'Plomberie, électricité, générateurs, clim & menuiserie' },
  { id: 'education', name: 'Éducation & Écoles', iconName: 'GraduationCap', description: 'Lycée Denis Diderot, crèches & tuteurs francophones' },
  { id: 'transports', name: 'Transports & Chauffeurs', iconName: 'Car', description: 'Chauffeurs privés de confiance, taxis & véhicules' },
  { id: 'loisirs', name: 'Loisirs & Safaris', iconName: 'Compass', description: 'Agences safari réceptives, clubs de sport & culture' },
  { id: 'domestique', name: 'Personnel de Maison', iconName: 'Home', description: 'Agences de placement certifiées, NSSF & SHIF' }
];

export const NEIGHBORHOODS: Neighborhood[] = [
  { id: 'all', name: 'Tous les quartiers' },
  { id: 'westlands', name: 'Westlands / Spring Valley' },
  { id: 'gigiri', name: 'Gigiri / Runda' },
  { id: 'lavington', name: 'Lavington / Kilimani' },
  { id: 'karen', name: 'Karen / Lang\'ata' }
];

// Combine initial curated seeds with community ingested contacts
export const MOCK_PROVIDERS: Provider[] = SEED_PROVIDERS_RAW as unknown as Provider[];

