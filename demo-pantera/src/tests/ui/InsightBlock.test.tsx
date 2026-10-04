import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { InsightBlock } from '@/ui/components/InsightBlock';

describe('InsightBlock', () => {
  it('renders without crashing', () => {
    const { container } = render(<InsightBlock conclusion="test" />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
