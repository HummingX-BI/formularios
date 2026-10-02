import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Stat } from '@/ui/components/Stat';

describe('Stat', () => {
  it('renders without crashing', () => {
    const { container } = render(<Stat />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
