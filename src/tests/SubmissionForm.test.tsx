import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import SubmitPage from '../features/submit/SubmitPage';

describe('SubmitPage Component (TDD & DPA 2019 Compliance)', () => {
  it('renders recommendation form with Kenya DPA 2019 consent requirement', () => {
    render(<SubmitPage onSubmitSuccess={() => {}} />);
    expect(screen.getByText(/Recommander une bonne adresse/i)).toBeInTheDocument();
    expect(screen.getByText(/Kenya Data Protection Act \(DPA\) 2019/i)).toBeInTheDocument();
  });

  it('keeps submit button disabled until mandatory DPA consent is checked', () => {
    render(<SubmitPage onSubmitSuccess={() => {}} />);
    const submitBtn = screen.getByRole('button', { name: /Soumettre pour modération/i });
    expect(submitBtn).toBeDisabled();

    const consentCheckbox = screen.getByRole('checkbox');
    fireEvent.click(consentCheckbox);
    expect(submitBtn).not.toBeDisabled();
  });
});
