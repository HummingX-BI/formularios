import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Toast } from '@/ui/components/Toast';

describe('Toast', () => {
  it('renders without crashing', () => {
    const { container } = render(<Toast id="1" title="Test Toast" />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
