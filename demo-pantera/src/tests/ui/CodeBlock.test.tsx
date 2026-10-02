import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { CodeBlock } from '@/ui/components/CodeBlock';

describe('CodeBlock', () => {
  it('renders without crashing', () => {
    const { container } = render(<CodeBlock />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
