import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SkylcnProvider } from '../lib/provider.js';
import { BarList } from './bar-list.js';

describe('BarList', () => {
  it('sizes each bar by its share of the total and marks the largest', () => {
    const { container } = render(
      <SkylcnProvider locale="tr">
        <BarList
          items={[
            { key: 'a', label: 'Web', value: 30 },
            { key: 'b', label: 'Mobil', value: 10 },
          ]}
        />
      </SkylcnProvider>,
    );
    const bars = container.querySelectorAll<HTMLElement>('[aria-hidden] > span');
    expect(bars[0]!.style.width).toBe('75%');
    expect(bars[1]!.style.width).toBe('25%');
    expect(bars[0]!.style.background).toContain('--chart-tone-4');
    expect(bars[1]!.style.background).toContain('--chart-tone-1');
    expect(screen.getByText(/%75/)).toBeInTheDocument();
  });
});
