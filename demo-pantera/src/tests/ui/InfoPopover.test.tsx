import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { InfoPopover } from '@/ui/components/InfoPopover';

describe('InfoPopover', () => {
  it('renders without crashing', () => {
    const { container } = render(<InfoPopover />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
