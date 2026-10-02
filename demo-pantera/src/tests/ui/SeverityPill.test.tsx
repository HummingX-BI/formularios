import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { SeverityPill } from '@/ui/components/SeverityPill';

describe('SeverityPill', () => {
  it('renders without crashing', () => {
    const { container } = render(<SeverityPill />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
