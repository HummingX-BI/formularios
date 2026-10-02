import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Tabs } from '@/ui/components/Tabs';

describe('Tabs', () => {
  it('renders without crashing', () => {
    const { container } = render(<Tabs />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
