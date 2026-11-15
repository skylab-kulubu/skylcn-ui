import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SegmentedControl } from './segmented-control.js';

describe('SegmentedControl', () => {
  const options = [
    { value: '24h', label: '24 saat' },
    { value: '7d', label: '7 gün' },
  ];

  it('comes in a 24px size for a switch inside a row of text', () => {
    const { container } = render(
      <SegmentedControl
        aria-label="Aralık"
        size="sm"
        options={options}
        value="7d"
        onValueChange={() => undefined}
      />,
    );
    expect(container.querySelector('[data-slot="segmented-control"]')).toHaveAttribute(
      'data-size',
      'sm',
    );
    expect(screen.getByRole('button', { name: '7 gün' })).toHaveClass('h-4.5');
  });
});
