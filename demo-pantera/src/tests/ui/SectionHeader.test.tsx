import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { SectionHeader } from '@/ui/components/SectionHeader';

describe('SectionHeader', () => {
  it('renders without crashing', () => {
    const { container } = render(<SectionHeader />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
