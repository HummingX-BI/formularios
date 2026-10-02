import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Button } from '@/ui/components/Button';

describe('Button', () => {
  it('renders without crashing', () => {
    const { container } = render(<Button />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
