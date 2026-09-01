import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MOCK_EMERGENCY_CONTACTS } from '../data/mockEmergency';
import EmergencyPage from '../features/emergency/EmergencyPage';

describe('EmergencyPage Component (TDD)', () => {
  it('renders emergency header and SOS hospital contacts', () => {
    render(<EmergencyPage />);
    expect(screen.getByText(/Urgences SOS Nairobi/i)).toBeInTheDocument();
    expect(screen.getByText(/Aga Khan/i)).toBeInTheDocument();
    expect(screen.getByText(/Nairobi Hospital/i)).toBeInTheDocument();
  });

  it('contains direct click-to-call telephone links for hospitals', () => {
    render(<EmergencyPage />);
    const callLinks = screen.getAllByRole('link', { name: /Appeler/i });
    expect(callLinks.length).toBeGreaterThan(0);
    const agaKhanLink = callLinks.find((link) => link.getAttribute('href')?.includes('203662000'));
    expect(agaKhanLink).toBeDefined();
  });
});
