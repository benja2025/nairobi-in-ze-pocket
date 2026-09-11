import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { AdminPage } from '../features/admin/AdminPage';
import { ProviderFormModal } from '../features/admin/ProviderFormModal';
import { DirectoryPage } from '../features/directory/DirectoryPage';
import { Provider } from '../types';
import { MOCK_PROVIDERS } from '../data/mockProviders';

describe('Card Modification Flow: Complete MVC & Persistence Unit Test Suite', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    sessionStorage.setItem('nairobi_admin_auth', 'true');
    vi.clearAllMocks();
  });

  const testProviderBen: Provider = {
    id: 'it_tech_ben',
    name: 'Ben',
    categoryId: 'it_tech',
    neighborhoodId: 'gigiri',
    specialty: 'Bilingue français anglais, +15 ans d\'expérience en création de site internet',
    description: 'Bilingue français anglais, +15 ans d\'expérience en création de site internet vitrine et e-commerce, branding & marketing digital.',
    phone: '+254 700 000 000',
    whatsapp: '+254700000000',
    languages: ['Français', 'Anglais'],
    isVerified: true,
    rating: 5.0,
    reviewsCount: 3,
    tags: ['it_tech', 'gigiri', 'Site Internet', 'Web'],
    sourceInfo: {
      badge: 'Nairobi Accueil',
      channel: 'nairobi_accueil_member',
      uploadedAt: '2026-03-01T10:00:00.000Z',
      contributorMasked: 'Recommandé par Ben',
      contributorRevealed: 'Ben (Directeur IT)',
      reliabilityScore: 5,
      originalNotes: 'Prestation validée',
      sourceSheet: 'Back Office'
    },
    createdAt: '2026-03-01T10:00:00.000Z'
  };

  /* =========================================================================
     1. VUE (VIEW) LAYER: ProviderFormModal Editing Behavior
     ========================================================================= */
  describe('1. Vue (View Layer) - ProviderFormModal Population & User Input', () => {
    it('pre-fills all form fields from the selected card when in edit mode', () => {
      render(
        <ProviderFormModal
          isOpen={true}
          provider={testProviderBen}
          onClose={vi.fn()}
          onSave={vi.fn()}
        />
      );

      // Verify modal title
      expect(screen.getByText(/Modifier la fiche : Ben/i)).toBeInTheDocument();

      // Verify pre-filled inputs
      const nameInput = screen.getByDisplayValue('Ben') as HTMLInputElement;
      expect(nameInput).toBeInTheDocument();

      const phoneInput = screen.getByDisplayValue('+254 700 000 000') as HTMLInputElement;
      expect(phoneInput).toBeInTheDocument();

      const specialtyInput = screen.getByDisplayValue(testProviderBen.specialty) as HTMLInputElement;
      expect(specialtyInput).toBeInTheDocument();

      const descriptionInput = screen.getByDisplayValue(testProviderBen.description) as HTMLTextAreaElement;
      expect(descriptionInput).toBeInTheDocument();
    });

    it('submits updated values and calls onSave with complete updated Provider entity', () => {
      const mockOnSave = vi.fn();
      const mockOnClose = vi.fn();

      render(
        <ProviderFormModal
          isOpen={true}
          provider={testProviderBen}
          onClose={mockOnClose}
          onSave={mockOnSave}
        />
      );

      const nameInput = screen.getByDisplayValue('Ben');
      const phoneInput = screen.getByDisplayValue('+254 700 000 000');
      const descInput = screen.getByDisplayValue(testProviderBen.description);

      // Modify values in the form
      fireEvent.change(nameInput, { target: { value: 'Ben Web & SEO Expert' } });
      fireEvent.change(phoneInput, { target: { value: '+254 712 345 678' } });
      fireEvent.change(descInput, { target: { value: 'Expert création Shopify & WordPress, refonte UX et hébergement rapide.' } });

      // Click save button
      const saveBtn = screen.getByRole('button', { name: /Enregistrer les modifications/i });
      fireEvent.click(saveBtn);

      expect(mockOnSave).toHaveBeenCalledTimes(1);
      const savedPayload: Provider = mockOnSave.mock.calls[0][0];

      expect(savedPayload.id).toBe('it_tech_ben'); // Keeps same ID
      expect(savedPayload.name).toBe('Ben Web & SEO Expert');
      expect(savedPayload.phone).toBe('+254 712 345 678');
      expect(savedPayload.description).toBe('Expert création Shopify & WordPress, refonte UX et hébergement rapide.');
      expect(savedPayload.categoryId).toBe('it_tech');
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  /* =========================================================================
     2. CONTRÔLEUR (CONTROLLER) LAYER: Update Handler & Storage Synchronization
     ========================================================================= */
  describe('2. Contrôleur (Controller Layer) - Update Handler & Persistence', () => {
    it('correctly modifies provider in state array and writes directly to LocalStorage', () => {
      let providersState: Provider[] = [testProviderBen, ...MOCK_PROVIDERS.slice(0, 5)];

      const handleUpdateProvider = (updatedProvider: Provider) => {
        let matched = false;
        const next = providersState.map((p) => {
          if (p.id === updatedProvider.id) {
            matched = true;
            return updatedProvider;
          }
          return p;
        });

        const finalNext = matched
          ? next
          : providersState.some((p) => `${p.name.toLowerCase().trim()}-${p.categoryId}` === `${updatedProvider.name.toLowerCase().trim()}-${updatedProvider.categoryId}`)
          ? providersState.map((p) => (`${p.name.toLowerCase().trim()}-${p.categoryId}` === `${updatedProvider.name.toLowerCase().trim()}-${updatedProvider.categoryId}` ? updatedProvider : p))
          : [updatedProvider, ...providersState];

        providersState = finalNext;
        localStorage.setItem('nairobi_managed_providers_v1', JSON.stringify(finalNext));
      };

      const updatedBen: Provider = {
        ...testProviderBen,
        name: 'Ben Digital Studio',
        phone: '+254 799 111 222',
        specialty: 'Studio Web & Mobile à Nairobi'
      };

      handleUpdateProvider(updatedBen);

      // Verify in-memory state
      const foundInState = providersState.find((p) => p.id === 'it_tech_ben');
      expect(foundInState?.name).toBe('Ben Digital Studio');
      expect(foundInState?.phone).toBe('+254 799 111 222');
      expect(foundInState?.specialty).toBe('Studio Web & Mobile à Nairobi');

      // Verify LocalStorage persistence
      const stored = JSON.parse(localStorage.getItem('nairobi_managed_providers_v1')!);
      const foundInStorage = stored.find((p: Provider) => p.id === 'it_tech_ben');
      expect(foundInStorage.name).toBe('Ben Digital Studio');
      expect(foundInStorage.phone).toBe('+254 799 111 222');
    });
  });

  /* =========================================================================
     3. MODÈLE & VUES CONSOMMATRICES: AdminPage & DirectoryPage Instant Reflection
     ========================================================================= */
  describe('3. Modèle & Vues Consommatrices - Live UI Update in Admin & Directory', () => {
    it('opens modal from Admin card Modifier button and triggers onUpdateProvider', () => {
      const mockUpdate = vi.fn();

      render(
        <AdminPage
          submissions={[]}
          telegramWaitlist={[]}
          moderatorApplications={[]}
          providers={[testProviderBen]}
          onApprove={vi.fn()}
          onReject={vi.fn()}
          onUpdateProvider={mockUpdate}
        />
      );

      // Verify Ben card is in the admin grid
      expect(screen.getByText('Ben')).toBeInTheDocument();
      expect(screen.getByText(/700 000 000/)).toBeInTheDocument();

      // Click "Modifier" on the card
      const editBtn = screen.getByRole('button', { name: /Modifier/i });
      fireEvent.click(editBtn);

      // Verify modal is open with pre-filled title
      expect(screen.getByText(/Modifier la fiche : Ben/i)).toBeInTheDocument();

      // Edit name
      const nameInput = screen.getByDisplayValue('Ben');
      fireEvent.change(nameInput, { target: { value: 'Ben Fullstack Tech' } });

      // Save
      const saveBtn = screen.getByRole('button', { name: /Enregistrer les modifications/i });
      fireEvent.click(saveBtn);

      // Verify Controller handler received updated entity
      expect(mockUpdate).toHaveBeenCalledTimes(1);
      expect(mockUpdate.mock.calls[0][0].name).toBe('Ben Fullstack Tech');
      expect(mockUpdate.mock.calls[0][0].id).toBe('it_tech_ben');
    });

    it('immediately reflects updated provider details in DirectoryPage search', () => {
      const updatedBen: Provider = {
        ...testProviderBen,
        name: 'Ben Informatique & Web',
        phone: '+254 788 444 333',
        specialty: 'Dépannage Mac/PC et Développement Web'
      };

      render(
        <DirectoryPage
          onNavigateToSubmit={vi.fn()}
          submissions={[]}
          providers={[updatedBen]}
        />
      );

      // Search by new name
      const searchInput = screen.getByPlaceholderText(/Rechercher par nom, métier, pédiatre, fundi, quartier.../i);
      fireEvent.change(searchInput, { target: { value: 'Ben Informatique' } });

      // Check the updated card is rendered
      expect(screen.getByText('Ben Informatique & Web')).toBeInTheDocument();
      expect(screen.getByText('Dépannage Mac/PC et Développement Web')).toBeInTheDocument();
    });
  });
});
