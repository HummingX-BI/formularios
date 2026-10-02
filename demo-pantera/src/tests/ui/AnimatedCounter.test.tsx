import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { AnimatedCounter } from '@/ui/components/AnimatedCounter';

describe('AnimatedCounter', () => {
  it('renders without crashing', () => {
    const { container } = render(<AnimatedCounter value={100} />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
