import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { KpiCard } from '@/ui/components/KpiCard';

describe('KpiCard', () => {
  it('renders without crashing', () => {
    const { container } = render(<KpiCard title='Test' value={10} />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
