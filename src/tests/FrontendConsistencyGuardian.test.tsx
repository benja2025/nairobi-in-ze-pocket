import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BottomNav from '../components/layout/BottomNav';
import Header from '../components/layout/Header';
import FilterBar from '../features/directory/FilterBar';
import ProviderCard from '../features/directory/ProviderCard';
import DirectoryPage from '../features/directory/DirectoryPage';
import SubmitPage from '../features/submit/SubmitPage';
import { Provider } from '../types';

const MOCK_SINGLE_PROVIDER: Provider = {
  id: 'test-p1',
  name: 'Test Fundi Nairobi',
  categoryId: 'fundis',
  neighborhoodId: 'westlands',
  specialty: 'Plombier et fuites',
  description: 'Artisan qualifié recommandé pour dépannages urgents.',
  phone: '+254 712 345 678',
  whatsapp: '+254 712 345 678',
  languages: ['Français', 'Anglais'],
  isVerified: true,
  rating: 4.9,
  reviewsCount: 5,
  tags: ['fundis', 'westlands']
};

describe('Frontend Consistency Guardian — Quadriptyque Contractuel ICPRA', () => {
  // Pilier 1 : Cibles Tactiles Minimales (44x44px)
  it('garantit des cibles tactiles minimales de 44x44px sur tous les onglets de la BottomNav', () => {
    const handleTabChange = vi.fn();
    render(<BottomNav activeTab="directory" onTabChange={handleTabChange} />);

    const tabs = screen.getAllByRole('tab');
    expect(tabs.length).toBeGreaterThanOrEqual(6);

    tabs.forEach((tab) => {
      expect(tab.className).toContain('min-h-[44px]');
      expect(tab.className).toContain('min-w-[44px]');
      expect(tab).toHaveAttribute('aria-label');
      expect(tab).toHaveAttribute('aria-selected');
    });
  });

  it("garantit une zone tactile minimale de 44px sur le déclencheur d'urgence SOS du Header", () => {
    const handleOpenSos = vi.fn();
    render(<Header onOpenSos={handleOpenSos} activeTab="directory" />);

    const sosButton = screen.getByRole('button', { name: /urgence sos/i });
    expect(sosButton).toBeInTheDocument();
    expect(sosButton.className).toContain('min-h-[44px]');
  });

  it('garantit des cibles tactiles de 44px sur les filtres et boutons d’action ProviderCard', () => {
    const handleSelect = vi.fn();
    render(<ProviderCard provider={MOCK_SINGLE_PROVIDER} onSelect={handleSelect} />);

    const callLink = screen.getByRole('link', { name: /appeler/i });
    const waLink = screen.getByRole('link', { name: /whatsapp/i });
    const mapsLink = screen.getByRole('link', { name: /maps/i });

    expect(callLink.className).toContain('min-h-[44px]');
    expect(waLink.className).toContain('min-h-[44px]');
    expect(mapsLink.className).toContain('min-h-[44px]');
  });

  // Pilier 2 : Loi des 5 États UI
  it('affiche l’état Loading nominal (Skeleton Loader) sans affaissement de mise en page', () => {
    render(<DirectoryPage onNavigateToSubmit={vi.fn()} isLoading={true} providers={[]} />);

    const loadingContainer = screen.getByTestId('directory-loading-state');
    expect(loadingContainer).toBeInTheDocument();
    // Skeleton renders animated elements
    expect(loadingContainer.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('affiche l’état Empty avec CTA clair et contextualisé en cas de recherche infructueuse', () => {
    const handleNavigate = vi.fn();
    render(<DirectoryPage onNavigateToSubmit={handleNavigate} providers={[]} />);

    const emptyContainer = screen.getByTestId('directory-empty-state');
    expect(emptyContainer).toBeInTheDocument();
    expect(screen.getByText(/aucun résultat trouvé/i)).toBeInTheDocument();

    const addBtn = screen.getByRole('button', { name: /ajouter une adresse/i });
    expect(addBtn.className).toContain('min-h-[44px]');
    fireEvent.click(addBtn);
    expect(handleNavigate).toHaveBeenCalled();
  });

  it('capture l’état Error (RFC 7807) avec un bouton Retry fonctionnel', () => {
    const handleRetry = vi.fn();
    render(
      <DirectoryPage
        onNavigateToSubmit={vi.fn()}
        isError={true}
        errorMessage="Échec de synchronisation avec Supabase."
        onRetry={handleRetry}
      />
    );

    const errorContainer = screen.getByTestId('directory-error-state');
    expect(errorContainer).toBeInTheDocument();
    expect(screen.getByText(/échec de synchronisation avec supabase/i)).toBeInTheDocument();

    const retryBtn = screen.getByRole('button', { name: /réessayer/i });
    expect(retryBtn.className).toContain('min-h-[44px]');
    fireEvent.click(retryBtn);
    expect(handleRetry).toHaveBeenCalledTimes(1);
  });

  it('détecte et signale l’état Offline / Dégradé avec bandeau de continuité de service', () => {
    // Simuler le statut hors-ligne
    const originalOnLine = navigator.onLine;
    Object.defineProperty(navigator, 'onLine', { value: false, configurable: true });

    render(<DirectoryPage onNavigateToSubmit={vi.fn()} providers={[MOCK_SINGLE_PROVIDER]} />);

    const offlineBanner = screen.getByTestId('directory-offline-banner');
    expect(offlineBanner).toBeInTheDocument();
    expect(offlineBanner.textContent).toContain('Mode hors-ligne actif');

    // Restaurer
    Object.defineProperty(navigator, 'onLine', { value: originalOnLine, configurable: true });
  });

  // Pilier 3 : Flux Déterministe & Accessibilité des formulaires
  it('garantit l’hygiène A11y du formulaire de proposition et verrouille la soumission sans consentement DPA 2019', () => {
    render(<SubmitPage onSubmitSuccess={vi.fn()} />);

    const nameInput = screen.getByLabelText(/nom de l'artisan/i);
    const phoneInput = screen.getByLabelText(/téléphone \/ whatsapp/i);
    const consentBox = screen.getByLabelText(/conformité kenya data protection act/i) as HTMLInputElement;
    const submitBtn = screen.getByRole('button', { name: /soumettre pour modération admin/i });

    // Vérifier les attributs obligatoires
    expect(nameInput).toHaveAttribute('id');
    expect(nameInput).toHaveAttribute('name');
    expect(phoneInput).toHaveAttribute('id');
    expect(phoneInput).toHaveAttribute('name');

    // Invariant métier : Le bouton doit être désactivé sans consentement légal
    expect(consentBox.checked).toBe(false);
    expect(submitBtn).toBeDisabled();

    // Activation du consentement
    fireEvent.click(consentBox);
    expect(consentBox.checked).toBe(true);
    expect(submitBtn).not.toBeDisabled();
  });
});
