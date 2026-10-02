import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ErrorState } from '@/ui/components/ErrorState';

describe('ErrorState', () => {
  it('renders without crashing', () => {
    const { container } = render(<ErrorState />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
