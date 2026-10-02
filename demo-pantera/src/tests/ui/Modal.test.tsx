import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Modal } from '@/ui/components/Modal';

describe('Modal', () => {
  it('renders without crashing', () => {
    const { container } = render(<Modal />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
