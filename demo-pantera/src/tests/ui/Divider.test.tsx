import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Divider } from '@/ui/components/Divider';

describe('Divider', () => {
  it('renders without crashing', () => {
    const { container } = render(<Divider />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
