import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Drawer } from '@/ui/components/Drawer';

describe('Drawer', () => {
  it('renders without crashing', () => {
    const { container } = render(<Drawer />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
