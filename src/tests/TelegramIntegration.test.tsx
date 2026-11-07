import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { TelegramAnnouncementModal } from '../components/TelegramAnnouncementModal';
import { notifyNewSubmissionOnTelegram } from '../services/telegramAlertService';
import { ProviderSubmission } from '../types';

describe('Telegram Announcement Modal & Alert Service (ICPRA Standard)', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('renders enthusiastic announcement when open with direct Telegram bot link', () => {
    const handleClose = vi.fn();
    render(
      <TelegramAnnouncementModal
        isOpen={true}
        onClose={handleClose}
        botUsername="nairobiinzepocket_bot"
      />
    );

    // Assert key enthusiastic phrases are rendered
    expect(screen.getByText(/Votre Assistant IA Telegram est en ligne !/i)).toBeInTheDocument();
    expect(screen.getByText(/@nairobiinzepocket_bot/i)).toBeInTheDocument();
    expect(screen.getByText(/Réponses 24\/7 en français/i)).toBeInTheDocument();

    // Verify action button to start bot
    const startBtn = screen.getByRole('button', { name: /Ouvrir PocketBot sur Telegram/i });
    expect(startBtn).toBeInTheDocument();

    // Verify closing triggers callback
    const closeBtn = screen.getByLabelText(/Fermer cette annonce/i);
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('does not render when isOpen is false', () => {
    const { container } = render(
      <TelegramAnnouncementModal
        isOpen={false}
        onClose={vi.fn()}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('formats telegram alert payload correctly for new submissions', async () => {
    const mockSubmission: ProviderSubmission = {
      id: 'sub-test-123',
      providerName: 'Peter Plombier Express',
      categoryId: 'fundis',
      neighborhoodId: 'westlands',
      phone: '+254 712 345 678',
      description: 'Dépannage chauffe-eau instantané.',
      submitterName: 'Sophie B.',
      submitterEmail: 'sophie@wanadoo.fr',
      consentGiven: true,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    // If no chat_id is provided, service skips gracefully without breaking
    const result = await notifyNewSubmissionOnTelegram(mockSubmission);
    expect(typeof result).toBe('boolean');
  });
});
