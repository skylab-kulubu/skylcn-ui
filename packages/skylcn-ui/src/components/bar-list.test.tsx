import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SkylcnProvider } from '../lib/provider.js';
import { BarList } from './bar-list.js';

describe('BarList', () => {
  it('sizes each bar by its share of the total, in one colour unless the largest is asked for', () => {
    const items = [
      { key: 'a', label: 'Web', value: 30 },
      { key: 'b', label: 'Mobil', value: 10 },
    ];
    const { container, rerender } = render(
      <SkylcnProvider locale="tr">
        <BarList items={items} />
      </SkylcnProvider>,
    );
    const bars = () => container.querySelectorAll<HTMLElement>('[aria-hidden] > span');
    expect(bars()[0]!.style.width).toBe('75%');
    expect(bars()[1]!.style.width).toBe('25%');
    expect(bars()[0]!.style.background).toContain('--chart-1');
    expect(screen.getByText(/%75/)).toBeInTheDocument();
    rerender(
      <SkylcnProvider locale="tr">
        <BarList items={items} highlightTop />
      </SkylcnProvider>,
    );
    expect(bars()[0]!.style.background).toContain('--chart-4');
    expect(bars()[1]!.style.background).toContain('--chart-1');
  });

  it('fills each row to its share with the label inside, as a multiple choice’s answers', () => {
    const { container } = render(
      <SkylcnProvider locale="tr">
        <BarList
          variant="fill"
          max={50}
          items={[
            { key: 'a', label: 'Web', value: 20 },
            { key: 'b', label: 'Robotik', value: 40 },
          ]}
        />
      </SkylcnProvider>,
    );
    expect(container.querySelector('[data-slot="bar-list"]')).toHaveAttribute(
      'data-variant',
      'fill',
    );
    const fills = container.querySelectorAll<HTMLElement>('li [aria-hidden]');
    expect(fills[0]!.style.width).toBe('40%');
    expect(fills[1]!.style.width).toBe('80%');
    expect(screen.getByText('Robotik')).toBeInTheDocument();
    expect(screen.getByText(/%80/)).toBeInTheDocument();
  });
});
