import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Select } from '@/ui/components/Select';

describe('Select', () => {
  it('renders without crashing', () => {
    const { container } = render(<Select />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
