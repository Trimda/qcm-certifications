import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Badge } from '@/components/ui/Badge';

describe('Badge', () => {
  it('renders children', () => {
    render(<Badge>SCRUM</Badge>);
    expect(screen.getByText('SCRUM')).toBeInTheDocument();
  });

  it('applies scrum variant class', () => {
    const { container } = render(<Badge variant="scrum">SCRUM</Badge>);
    expect(container.firstChild).toHaveClass('memphis-badge-scrum');
  });

  it('applies admin variant class', () => {
    const { container } = render(<Badge variant="admin">ADMIN</Badge>);
    expect(container.firstChild).toHaveClass('memphis-badge-admin');
  });
});
