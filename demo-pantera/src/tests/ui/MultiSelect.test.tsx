import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { MultiSelect } from '@/ui/components/MultiSelect';

describe('MultiSelect', () => {
  it('renders without crashing', () => {
    const { container } = render(<MultiSelect />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
