import { EmergencyContact } from '../types';

export const MOCK_EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    id: 'e1',
    title: 'The Aga Khan University Hospital (Urgences)',
    category: 'hospital',
    phone: '+254 20 366 2000',
    secondaryPhone: '+254 703 082 000',
    neighborhood: 'Westlands / Parklands',
    address: '3rd Parklands Ave, Nairobi',
    is247: true,
    notes: 'Hôpital généraliste de référence. Service pédiatrique d\'urgence 24/7 et trauma center.'
  },
  {
    id: 'e2',
    title: 'The Nairobi Hospital (Urgences Principales)',
    category: 'hospital',
    phone: '+254 20 284 5000',
    secondaryPhone: '+254 703 082 000',
    neighborhood: 'Upper Hill / Kilimani',
    address: 'Argwings Kodhek Rd, Nairobi',
    is247: true,
    notes: 'Plateau technique complet, ambulances réanimatrices et urgences pédiatriques.'
  },
  {
    id: 'e3',
    title: 'Ambulances AAR Rescue',
    category: 'ambulance',
    phone: '+254 722 250 250',
    secondaryPhone: '+254 733 600 600',
    is247: true,
    notes: 'Flotte d\'ambulances privées avec paramédicalisatons rapides sur Nairobi.'
  },
  {
    id: 'e4',
    title: 'Urgence Consulaire - Ambassade de France',
    category: 'embassy',
    phone: '+254 0113619636',
    address: 'Peponi Road, Westlands, Nairobi',
    is247: true,
    notes: 'Numéro d\'urgence STRICTEMENT réservé aux ressortissants français en situation de détresse grave (accident, décès, arrestation).'
  },
  {
    id: 'e5',
    title: 'Pharmacie de Garde - Goodlife Westlands',
    category: 'pharmacy',
    phone: '+254 719 333 444',
    neighborhood: 'Westlands',
    address: 'Sarit Centre Ground Floor, Westlands',
    is247: true,
    notes: 'Pharmacie ouverte 24/7 pour délivrance d\'urgence et médicaments pédiatriques.'
  },
  {
    id: 'e6',
    title: 'Police Secours & Fire Response (Kenyata Emergency)',
    category: 'security',
    phone: '999',
    secondaryPhone: '112',
    is247: true,
    notes: 'Ligne directe nationale d\'urgence sécurité et pompiers.'
  }
];
