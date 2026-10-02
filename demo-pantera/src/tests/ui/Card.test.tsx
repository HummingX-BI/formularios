import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Card } from '@/ui/components/Card';

describe('Card', () => {
  it('renders without crashing', () => {
    const { container } = render(<Card />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
