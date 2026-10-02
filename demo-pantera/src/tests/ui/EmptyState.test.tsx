import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { EmptyState } from '@/ui/components/EmptyState';

describe('EmptyState', () => {
  it('renders without crashing', () => {
    const { container } = render(<EmptyState />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
