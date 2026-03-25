import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ProgressBar } from '@/components/ui/ProgressBar';

describe('ProgressBar', () => {
  it('renders with correct aria attributes', () => {
    render(<ProgressBar current={3} total={10} />);
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toHaveAttribute('aria-valuenow', '3');
    expect(progressbar).toHaveAttribute('aria-valuemax', '10');
  });

  it('shows correct fraction text', () => {
    render(<ProgressBar current={2} total={5} />);
    expect(screen.getByText('2/5')).toBeInTheDocument();
  });

  it('shows 0% width when current is 0', () => {
    render(<ProgressBar current={0} total={5} />);
    const fill = document.querySelector('.memphis-progress-fill') as HTMLElement;
    expect(fill.style.width).toBe('0%');
  });
});
