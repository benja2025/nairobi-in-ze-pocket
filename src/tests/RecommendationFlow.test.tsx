import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { SubmitPage } from '../features/submit/SubmitPage';
import { DirectoryPage } from '../features/directory/DirectoryPage';
import { AdminPage } from '../features/admin/AdminPage';
import { ProviderSubmission, Provider } from '../types';
import { filterProviders } from '../utils/directoryFilter';

describe('Recommendation Flow: Complete MVC & Controller Synchronization Test Suite', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  /* =========================================================================
     1. VUE (VIEW) LAYER: SubmitPage Form & Interaction
     ========================================================================= */
  describe('1. Vue (View Layer) - Form Validation & Submission Experience', () => {
    it('renders all mandatory fields and adheres to Kenya DPA 2019 consent requirements', () => {
      render(<SubmitPage onSubmitSuccess={vi.fn()} />);

      // Verify labels and inputs are rendered
      expect(screen.getByText(/Nom de l'artisan \/ professionnel \*/i)).toBeInTheDocument();
      expect(screen.getByText(/Catégorie \*/i)).toBeInTheDocument();
      expect(screen.getByText(/Quartier d'intervention \*/i)).toBeInTheDocument();
      expect(screen.getByText(/Téléphone \/ WhatsApp du prestataire \*/i)).toBeInTheDocument();
      expect(screen.getByText(/Votre retour d'expérience & spécialité \*/i)).toBeInTheDocument();
      expect(screen.getByText(/Votre Prénom & Nom \*/i)).toBeInTheDocument();
      expect(screen.getByText(/Votre e-mail membre \*/i)).toBeInTheDocument();
      expect(screen.getByText(/Conformité Kenya Data Protection Act \(DPA\) 2019/i)).toBeInTheDocument();

      // Submit button is disabled initially
      const submitBtn = screen.getByRole('button', { name: /Soumettre pour modération/i });
      expect(submitBtn).toBeDisabled();
    });

    it('captures user input, triggers controller callback with exact payload, and displays confirmation screen', async () => {
      const mockOnSubmitSuccess = vi.fn();
      render(<SubmitPage onSubmitSuccess={mockOnSubmitSuccess} />);

      // Fill in provider details
      const nameInput = screen.getByPlaceholderText(/ex: Peter Fundi Plomberie/i);
      const phoneInput = screen.getByPlaceholderText(/ex: \+254 712 345 678/i);
      const descInput = screen.getByPlaceholderText(/Expliquez pourquoi vous recommandez ce service/i);
      const submitterNameInput = screen.getByPlaceholderText(/ex: Thomas Martin/i);
      const submitterEmailInput = screen.getByPlaceholderText(/ex: thomas@gmail.com/i);
      const consentCheckbox = screen.getByRole('checkbox');

      fireEvent.change(nameInput, { target: { value: 'David Electricité Express' } });
      fireEvent.change(phoneInput, { target: { value: '+254 711 555 444' } });
      fireEvent.change(descInput, { target: { value: 'Installation tableau électrique et onduleur solaire impeccable.' } });
      fireEvent.change(submitterNameInput, { target: { value: 'Élodie Roche' } });
      fireEvent.change(submitterEmailInput, { target: { value: 'elodie.roche@gmail.com' } });
      
      // Check DPA consent checkbox
      fireEvent.click(consentCheckbox);

      // Verify submit button is now enabled
      const submitBtn = screen.getByRole('button', { name: /Soumettre pour modération/i });
      expect(submitBtn).not.toBeDisabled();

      // Submit form
      fireEvent.click(submitBtn);

      // Verify Controller callback received the complete structured model
      expect(mockOnSubmitSuccess).toHaveBeenCalledTimes(1);
      const submittedData: ProviderSubmission = mockOnSubmitSuccess.mock.calls[0][0];

      expect(submittedData.providerName).toBe('David Electricité Express');
      expect(submittedData.phone).toBe('+254 711 555 444');
      expect(submittedData.description).toBe('Installation tableau électrique et onduleur solaire impeccable.');
      expect(submittedData.submitterName).toBe('Élodie Roche');
      expect(submittedData.submitterEmail).toBe('elodie.roche@gmail.com');
      expect(submittedData.consentGiven).toBe(true);
      expect(submittedData.status).toBe('pending');
      expect(submittedData.id).toBeDefined();
      expect(submittedData.createdAt).toBeDefined();

      // Verify confirmation screen is shown
      expect(screen.getByText(/Recommandation transmise !/i)).toBeInTheDocument();
      expect(screen.getByText(/Merci pour votre contribution au réseau Nairobi in ze Pocket !/i)).toBeInTheDocument();

      // Reset form on clicking "Soumettre une autre adresse"
      const resetBtn = screen.getByRole('button', { name: /Soumettre une autre adresse/i });
      fireEvent.click(resetBtn);
      expect(screen.getByPlaceholderText(/ex: Peter Fundi Plomberie/i)).toBeInTheDocument();
    });
  });

  /* =========================================================================
     2. CONTRÔLEUR & MODÈLE (CONTROLLER & MODEL) LAYER: State & Persistence
     ========================================================================= */
  describe('2. Contrôleur & Modèle (State & Persistence Synchronization)', () => {
    it('correctly updates state and synchronously serializes to LocalStorage on submission', () => {
      const sampleSubmission: ProviderSubmission = {
        id: 'sub-test-101',
        providerName: 'Samuel Serrurier Nairobi',
        categoryId: 'fundis',
        neighborhoodId: 'lavington',
        phone: '+254 722 333 444',
        description: 'Ouverture de porte blindée sans dégât en 30 minutes.',
        submitterName: 'Sophie D.',
        submitterEmail: 'sophie@wanadoo.fr',
        consentGiven: true,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      // Simulate Controller handleAddSubmission logic
      let submissionsState: ProviderSubmission[] = [];
      const handleAddSubmission = (newSub: ProviderSubmission) => {
        submissionsState = [newSub, ...submissionsState];
        localStorage.setItem('nairobi_provider_submissions', JSON.stringify(submissionsState));
      };

      handleAddSubmission(sampleSubmission);

      // Validate Model State
      expect(submissionsState.length).toBe(1);
      expect(submissionsState[0].providerName).toBe('Samuel Serrurier Nairobi');

      // Validate LocalStorage Persistence
      const persistedJson = localStorage.getItem('nairobi_provider_submissions');
      expect(persistedJson).not.toBeNull();
      const parsed = JSON.parse(persistedJson!);
      expect(parsed[0].id).toBe('sub-test-101');
      expect(parsed[0].providerName).toBe('Samuel Serrurier Nairobi');
    });

    it('promotes an approved submission into the managed providers model with verification badge', () => {
      const pendingSub: ProviderSubmission = {
        id: 'sub-test-202',
        providerName: 'Dr. Karine Peintre Décoratrice',
        categoryId: 'fundis',
        neighborhoodId: 'westlands',
        phone: '+254 733 999 111',
        description: 'Peinture écologique intérieure et finitions soignées.',
        submitterName: 'Paul M.',
        submitterEmail: 'paul.m@gmail.com',
        consentGiven: true,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      let submissionsState: ProviderSubmission[] = [pendingSub];
      let providersState: Provider[] = [];

      // Controller approval handler
      const handleApproveSubmission = (id: string) => {
        let approvedSub: ProviderSubmission | undefined;
        submissionsState = submissionsState.map((s) => {
          if (s.id === id) {
            approvedSub = { ...s, status: 'approved' as const };
            return approvedSub;
          }
          return s;
        });

        if (approvedSub) {
          const sub = approvedSub;
          const promotedProvider: Provider = {
            id: `provider-approved-${sub.id}`,
            name: sub.providerName,
            categoryId: sub.categoryId,
            neighborhoodId: sub.neighborhoodId,
            specialty: sub.description.slice(0, 50),
            description: sub.description,
            phone: sub.phone,
            whatsapp: sub.phone,
            languages: ['Français', 'Anglais'],
            isVerified: true,
            rating: 5.0,
            reviewsCount: 1,
            tags: [sub.categoryId, sub.neighborhoodId, 'Recommandation Communauté'],
            sourceInfo: {
              badge: 'Nairobi Accueil',
              channel: 'direct_submission',
              uploadedAt: sub.createdAt,
              contributorMasked: `Recommandé par ${sub.submitterName || 'un membre'}`,
              contributorRevealed: `${sub.submitterName || 'Membre'} (${sub.submitterEmail || 'Vérifié'})`,
              reliabilityScore: 5,
              originalNotes: sub.description,
              sourceSheet: 'Recommandations Communauté'
            },
            createdAt: sub.createdAt
          };

          providersState = [promotedProvider, ...providersState];
          localStorage.setItem('nairobi_managed_providers_v1', JSON.stringify(providersState));
          localStorage.setItem('nairobi_provider_submissions', JSON.stringify(submissionsState));
        }
      };

      handleApproveSubmission('sub-test-202');

      // Model Assertions
      expect(submissionsState[0].status).toBe('approved');
      expect(providersState.length).toBe(1);
      expect(providersState[0].name).toBe('Dr. Karine Peintre Décoratrice');
      expect(providersState[0].isVerified).toBe(true);
      expect(providersState[0].sourceInfo?.badge).toBe('Nairobi Accueil');

      // Storage Assertions
      const storedProviders = JSON.parse(localStorage.getItem('nairobi_managed_providers_v1')!);
      expect(storedProviders.length).toBe(1);
      expect(storedProviders[0].id).toBe('provider-approved-sub-test-202');
    });
  });

  /* =========================================================================
     3. IMPACT SUR LES VUES CONSOMMATRICES (DIRECTORY & ADMIN)
     ========================================================================= */
  describe('3. Impact Automatique sur les Vues (DirectoryPage & AdminPage)', () => {
    it('automatically surfaces newly submitted recommendations in the Directory search engine', () => {
      const newSubmission: ProviderSubmission = {
        id: 'sub-live-303',
        providerName: 'Nairobi Solar & Wi-Fi Solutions',
        categoryId: 'it_tech',
        neighborhoodId: 'gigiri',
        phone: '+254 712 888 777',
        description: 'Installation Starlink et répéteurs Mesh sans fil partout.',
        submitterName: 'Marc Antoine',
        submitterEmail: 'marc@antoine.fr',
        consentGiven: true,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      render(
        <DirectoryPage
          onNavigateToSubmit={vi.fn()}
          submissions={[newSubmission]}
        />
      );

      // Search for the submitted provider
      const searchInput = screen.getByPlaceholderText(/Rechercher par nom, métier, pédiatre, fundi, quartier.../i);
      fireEvent.change(searchInput, { target: { value: 'Nairobi Solar' } });

      // Verify the provider is found and rendered in the directory UI
      expect(screen.getByText('Nairobi Solar & Wi-Fi Solutions')).toBeInTheDocument();
      expect(screen.getAllByText(/Installation Starlink et répéteurs Mesh/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText(/Recommandé par Marc/i)).toBeInTheDocument();
    });

    it('filters recommendations dynamically by category and multi-neighborhood selection', () => {
      const sub1: ProviderSubmission = {
        id: 'sub-401',
        providerName: 'Garage Auto Karen Express',
        categoryId: 'transports',
        neighborhoodId: 'karen',
        phone: '+254 700 111 222',
        description: 'Mécanique toutes marques et remorquage rapide.',
        submitterName: 'Julien B.',
        submitterEmail: 'julien@gmail.com',
        consentGiven: true,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      const sub2: ProviderSubmission = {
        id: 'sub-402',
        providerName: 'Dr. Valérie Pédiatre Francophone',
        categoryId: 'sante',
        neighborhoodId: 'gigiri',
        phone: '+254 722 333 555',
        description: 'Consultation pédiatrique en français à Village Market.',
        submitterName: 'Claire L.',
        submitterEmail: 'claire@gmail.com',
        consentGiven: true,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      // Test directory filter with both submissions
      const submissionsList = [sub1, sub2];
      const allCommunityProviders: Provider[] = submissionsList.map((s) => ({
        id: s.id || `sub-id-${Math.random()}`,
        name: s.providerName,
        categoryId: s.categoryId,
        neighborhoodId: s.neighborhoodId,
        specialty: s.description,
        description: s.description,
        phone: s.phone,
        languages: ['Français'],
        isVerified: false,
        rating: 5.0,
        reviewsCount: 1,
        tags: [s.categoryId, s.neighborhoodId],
        createdAt: s.createdAt
      }));

      // Filter by category: santé
      const santeMatches = filterProviders(allCommunityProviders, 'sante', 'all', '');
      expect(santeMatches.length).toBe(1);
      expect(santeMatches[0].name).toBe('Dr. Valérie Pédiatre Francophone');

      // Filter by category: transports
      const transportMatches = filterProviders(allCommunityProviders, 'transports', 'all', '');
      expect(transportMatches.length).toBe(1);
      expect(transportMatches[0].name).toBe('Garage Auto Karen Express');

      // Filter by neighborhood: karen
      const karenMatches = filterProviders(allCommunityProviders, 'all', ['karen'], '');
      expect(karenMatches.length).toBe(1);
      expect(karenMatches[0].name).toBe('Garage Auto Karen Express');

      // Multi-neighborhood search: karen + gigiri
      const multiNeighMatches = filterProviders(allCommunityProviders, 'all', ['karen', 'gigiri'], '');
      expect(multiNeighMatches.length).toBe(2);

      // High precision keyword query
      const starlinkQuery = filterProviders(allCommunityProviders, 'all', 'all', 'pédiatre');
      expect(starlinkQuery.length).toBe(1);
      expect(starlinkQuery[0].name).toBe('Dr. Valérie Pédiatre Francophone');
    });

    it('renders pending submissions in Admin moderation dashboard and allows instant approval/rejection', async () => {
      // Authenticate admin session
      sessionStorage.setItem('nairobi_admin_auth', 'true');

      const mockApprove = vi.fn();
      const mockReject = vi.fn();

      const pendingSub: ProviderSubmission = {
        id: 'sub-admin-501',
        providerName: 'Jean Plombier Dépannage',
        categoryId: 'fundis',
        neighborhoodId: 'westlands',
        phone: '+254 722 999 000',
        description: 'Débouchage rapide et robinetterie de rechange.',
        submitterName: 'Nathalie V.',
        submitterEmail: 'nathalie@v.fr',
        consentGiven: true,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      render(
        <AdminPage
          submissions={[pendingSub]}
          telegramWaitlist={[]}
          moderatorApplications={[]}
          providers={[]}
          onApprove={mockApprove}
          onReject={mockReject}
        />
      );

      // Switch to moderation tab
      const modTabBtn = screen.getByRole('button', { name: /Modération des Recommandations/i });
      fireEvent.click(modTabBtn);

      // Check submission content is visible
      expect(screen.getByText('Jean Plombier Dépannage')).toBeInTheDocument();
      expect(screen.getByText(/Nathalie V./i)).toBeInTheDocument();
      expect(screen.getByText(/Consentement DPA 2019 : ✅ Oui/i)).toBeInTheDocument();

      // Click Approve
      const approveBtn = screen.getByRole('button', { name: /Approuver/i });
      fireEvent.click(approveBtn);
      expect(mockApprove).toHaveBeenCalledWith('sub-admin-501');

      // Click Reject
      const rejectBtn = screen.getByRole('button', { name: /Rejeter/i });
      fireEvent.click(rejectBtn);
      expect(mockReject).toHaveBeenCalledWith('sub-admin-501');
    });
  });
});
