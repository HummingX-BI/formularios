import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Kbd } from '@/ui/components/Kbd';

describe('Kbd', () => {
  it('renders without crashing', () => {
    const { container } = render(<Kbd />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
