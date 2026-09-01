import { Guide } from '../types';

export const MOCK_GUIDES: Guide[] = [
  {
    id: 'embauche-personnel-domestique',
    title: 'Embaucher du personnel de maison à Nairobi : Cadre légal et conseils pratiques',
    category: 'Juridique & Quotidien',
    summary: 'Contrat de travail, grille des salaires, cotisations sociales NSSF et SHIF, et bonnes pratiques pour instaurer une relation de confiance.',
    imageUrl: '/images/guides/domestic_staff.jpg',
    author: 'Pôle Juridique & Entraide — Nairobi Accueil',
    readTimeMinutes: 6,
    updatedAt: '15 août 2026',
    iconName: 'FileText',
    keyTakeaways: [
      'Toujours formaliser la relation par un contrat écrit en anglais avec période d’essai de 2 mois.',
      'Le salaire moyen d’usage se situe entre 18 000 et 30 000 KES selon les responsabilités et le logement.',
      'L’enregistrement aux cotisations de santé SHIF et de retraite NSSF est une obligation légale de l’employeur.',
      'Exiger un extrait de casier judiciaire kényan (Certificate of Good Conduct) récent avant toute embauche.'
    ],
    sections: [
      {
        title: '1. Cadre légal et réglementation du travail',
        content: 'Au Kenya, l’emploi de personnel domestique (aide ménagère, garde d’enfants, cuisinier ou jardinier) est régi par le Employment Act de 2007. La durée légale du travail est fixée à 52 heures par semaine au maximum, généralement réparties sur 5 jours ou 5 jours et demi. Tout dépassement d’horaires doit faire l’objet d’une compensation ou d’une rémunération en heures supplémentaires.',
        bulletPoints: [
          'Durée hebdomadaire standard : 45 à 52 heures selon la formule (interne ou externe)',
          'Congés annuels payés : 21 jours ouvrés par an après un an de service continu',
          'Période d’essai : 2 mois maximum, avec préavis court de 7 jours pendant cette période'
        ]
      },
      {
        title: '2. Déclarations et cotisations sociales obligatoires',
        content: 'En tant qu’employeur privé, vous êtes tenu d’enregistrer votre employé auprès des deux caisses nationales de protection sociale dès le premier mois de travail. Les démarches s’effectuent en ligne de manière simple :',
        bulletPoints: [
          'NSSF (National Social Security Fund) : Cotisation retraite partagée entre l’employeur et le salarié, payable chaque mois via le portail officiel.',
          'SHIF (Social Health Insurance Fund) : Couverture médicale universelle remplaçant l’ancienne NHIF, garantissant l’accès aux soins hospitaliers.',
          'Reçu de paie mensuel : Remettez un bulletin de salaire clair précisant les déductions et le versement net.'
        ],
        tip: 'Conservez une copie numérique de chaque bordereau de paiement NSSF et SHIF pour éviter tout litige lors du solde de tout compte.'
      },
      {
        title: '3. Recrutement et vérification des références',
        content: 'Le bouche-à-oreille au sein de la communauté francophone et les recommandations directes de familles expatriées sur le départ constituent le moyen le plus sûr de trouver du personnel qualifié et fiable.',
        bulletPoints: [
          'Certificate of Good Conduct : Demandez l’original de ce document officiel délivré par la DCI (Direction des Enquêtes Criminelles).',
          'Contrôle téléphonique : Contactez personnellement au moins deux anciens employeurs pour évaluer la ponctualité, la fiabilité et le contact avec les enfants.',
          'Période d’adaptation : Prévoyez une à deux semaines de transmission en double si vous succédez à une famille.'
        ],
        tip: 'Rédigez ensemble un planning quotidien clair des tâches pour aligner sereinement les attentes mutuelles dès la première semaine.'
      }
    ]
  },
  {
    id: 'choisir-son-quartier-nairobi',
    title: 'Où s’installer à Nairobi ? Le comparatif complet des quartiers pour familles',
    category: 'Installation & Logement',
    summary: 'Westlands, Lavington, Gigiri, Karen ou Runda : analyse des temps de trajet, de la proximité des écoles et du cadre de vie.',
    imageUrl: '/images/guides/neighborhoods.jpg',
    author: 'Équipe Accueil & Mobilité — Nairobi Accueil',
    readTimeMinutes: 8,
    updatedAt: '22 juillet 2026',
    iconName: 'MapPin',
    keyTakeaways: [
      'Lavington et Kilimani offrent la meilleure proximité avec le Lycée Français Denis Diderot.',
      'Gigiri, Runda et Nyari sont parfaits pour les diplomates et fonctionnaires onusiens (UNEP / UN-Habitat).',
      'Karen propose un cadre verdoyant et paisible avec de grands jardins, idéal pour les amoureux de nature.',
      'Calculez vos temps de trajet aux heures de pointe avant de signer un bail de longue durée.'
    ],
    sections: [
      {
        title: '1. Lavington, Kilimani et Riverside : Le cœur francophone',
        content: 'Ces quartiers centraux et arborés sont particulièrement recherchés par les familles françaises en raison de leur accès direct au Lycée Français Denis Diderot. On y trouve un équilibre parfait entre dynamisme urbain et quiétude résidentielle.',
        bulletPoints: [
          'Points forts : Écoles françaises et internationales, restaurants, galeries marchandes comme The Junction et Lavington Mall.',
          'Types de logements : Maisons de ville en lotissements sécurisés (gated communities) et résidences d’appartements modernes avec piscine et groupe électrogène de secours.'
        ]
      },
      {
        title: '2. Gigiri, Runda et Nyari : Le pôle diplomatique et onusien',
        content: 'Situés dans le nord verdoyant de Nairobi, ces quartiers haut de gamme accueillent l’ensemble des ambassades, le complexe des Nations Unies ainsi que l’International School of Kenya (ISK) et la German School.',
        bulletPoints: [
          'Points forts : Sécurité renforcée, espaces verts généreux, forêt de Karura à proximité immédiate pour les balades du week-end.',
          'Types de logements : Grandes propriétés individuelles privées et villas de grand standing avec vastes jardins.'
        ],
        tip: 'La proximité avec la forêt de Karura offre un accès direct à des sentiers sécurisés pour la course à pied, le vélo et les pique-niques en famille.'
      },
      {
        title: '3. Karen et Langata : Le charme d’un village au pied des Ngong Hills',
        content: 'Karen offre une atmosphère champêtre unique avec ses grands arbres, ses écuries et ses centres commerciaux à ciel ouvert comme The Hub Karen. Ce secteur est très prisé par ceux qui recherchent l’espace et le calme.',
        bulletPoints: [
          'Points forts : Cadre de vie exceptionnel, proximité du Parc National de Nairobi et de la Brookhouse School.',
          'À anticiper : Le temps de transport vers le centre-ville et Westlands peut être dense aux heures de pointe du matin.'
        ]
      },
      {
        title: '4. Westlands et Spring Valley : La vie citadine trépidante',
        content: 'Véritable centre d’affaires et de loisirs de Nairobi, Westlands convient particulièrement aux jeunes couples et aux professionnels souhaitant être au cœur de l’animation.',
        bulletPoints: [
          'Points forts : Accès direct à l’autoroute Express Way, grands centres commerciaux (Sarit Centre, Westgate Mall), vie nocturne et hôpital Aga Khan.',
          'Types de logements : Nouveaux complexes résidentiels haut de gamme avec services intégrés.'
        ]
      }
    ]
  },
  {
    id: 'sante-hospitalisation-nairobi',
    title: 'Santé et prise en charge médicale à Nairobi : Le guide complet',
    category: 'Santé & Urgences',
    summary: 'Infrastructures hospitalières de référence, protocoles d’admission, assurances expatriés et numéros essentiels à garder sous la main.',
    imageUrl: '/images/guides/healthcare.jpg',
    author: 'Dr. Marc Dubois — Médecin référent',
    readTimeMinutes: 5,
    updatedAt: '28 août 2026',
    iconName: 'ShieldAlert',
    keyTakeaways: [
      'Nairobi compte plusieurs hôpitaux privés accrédités aux standards internationaux (The Aga Khan, Nairobi Hospital).',
      'Une garantie de prise en charge d’assurance ou une empreinte bancaire est exigée à l’admission.',
      'Conservez toujours les numéros d’urgence et d’ambulance enregistrés dans vos contacts rapides.',
      'Souscrivez une assurance expatrié complète incluant le rapatriement sanitaire et le tiers payant hospitalier.'
    ],
    sections: [
      {
        title: '1. Établissements hospitaliers de premier plan',
        content: 'Nairobi constitue le centre médical de référence pour toute l’Afrique de l’Est. Les grands hôpitaux privés disposent de plateaux techniques modernes, de services d’urgences 24/7 et d’équipes médicales formées à l’international.',
        bulletPoints: [
          'The Aga Khan University Hospital (Parklands) : Urgences générales et pédiatriques de pointe, réanimation, cardiologie et unité d’oncologie.',
          'The Nairobi Hospital (Upper Hill & antennes de consultation Karen / Galleria) : Excellent pôle de chirurgie, maternité réputée et consultations spécialisées.',
          'MP Shah Hospital (Parklands) : Hôpital de confiance doté d’urgences réactives et de spécialistes réputés.'
        ]
      },
      {
        title: '2. Modalités d’admission et formalités financières',
        content: 'Contrairement au système public européen, les hôpitaux privés kényans demandent systématiquement une vérification de solvabilité avant toute hospitalisation non vitale :',
        bulletPoints: [
          'Prise en charge directe (Direct Billing) : Présentez votre carte d’assurance internationale (CFE, MSH International, April, Henner, Cigna, Allianz). Si l’hôpital a un accord de tiers payant, la prise en charge est immédiate.',
          'Caution ou empreinte bancaire : En l’absence d’accord direct préalable, une provision par carte de crédit est demandée, avec remboursement ultérieur par votre assureur.',
          'Urgences vitales : Les équipes soignantes stabilisent le patient immédiatement en priorité.'
        ],
        tip: 'Photographiez et gardez sur votre téléphone votre carte d’assuré et le numéro direct du plateau d’assistance 24/7 de votre assurance.'
      },
      {
        title: '3. Pharmacies et médicaments d’usage courant',
        content: 'On trouve facilement les médicaments essentiels dans les grandes chaînes de pharmacies à Nairobi (Goodlife Pharmacy, Haltons, Portal Pharmacy).',
        bulletPoints: [
          'Disponibilité : Les pharmacies des centres commerciaux sont ouvertes 7j/7 jusqu’à 20h ou 21h.',
          'Ordonnances : Pensez à faire transcrire vos ordonnances françaises avec les dénominations communes internationales (DCI des molécules).'
        ]
      }
    ]
  }
];

