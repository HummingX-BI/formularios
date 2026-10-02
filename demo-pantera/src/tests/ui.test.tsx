import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DashboardPage } from '@/modules/c01/DashboardPage';

describe('DashboardPage rendering', () => {
  it('renders the construction message', () => {
    render(<DashboardPage />);
    const heading = screen.getByText('Club Azulejo - Panel de administración (en construcción)');
    expect(heading).toBeInTheDocument();
  });
});
