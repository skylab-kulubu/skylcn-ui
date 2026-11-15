import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProportionBar } from './proportion-bar.js';

describe('ProportionBar', () => {
  it('colours each part by its position unless the part brings its own colour', () => {
    const { container } = render(
      <ProportionBar
        segments={[
          { key: 'registered', label: 'Kayıtlı', value: 3 },
          { key: 'anonymous', label: 'Anonim', value: 1, color: 'var(--skylab-800)' },
        ]}
      />,
    );
    const [registered, anonymous] = container.querySelectorAll<HTMLElement>('[aria-hidden] > span');
    expect(registered?.style.background).toBe('var(--chart-1)');
    expect(anonymous?.style.background).toBe('var(--skylab-800)');
    const legend = screen.getByText('Anonim').previousElementSibling as HTMLElement;
    expect(legend.style.background).toBe('var(--skylab-800)');
  });
});
