import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { SegmentedControl } from '@/ui/components/SegmentedControl';

describe('SegmentedControl', () => {
  it('renders without crashing', () => {
    const { container } = render(<SegmentedControl />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
