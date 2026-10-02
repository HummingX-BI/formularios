// @ts-nocheck
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Table } from '@/ui/components/Table';

describe('Table', () => {
  it('renders without crashing', () => {
    const { container } = render(<Table />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
