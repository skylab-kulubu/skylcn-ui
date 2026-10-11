import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SkylcnProvider } from '../lib/provider.js';
import { DonutChart } from './charts.js';

const answers = [
  { key: 'web', label: 'Web geliştirme', value: 46 },
  { key: 'ai', label: 'Yapay zekâ', value: 38 },
  { key: 'game', label: 'Oyun geliştirme', value: 16 },
];

function draw(props: Partial<Parameters<typeof DonutChart>[0]> = {}) {
  return render(
    <SkylcnProvider locale="tr">
      <DonutChart title="İlgi alanı" data={answers} {...props} />
    </SkylcnProvider>,
  );
}

const row = (label: string) => screen.getByRole('button', { name: new RegExp(label) });

describe('DonutChart', () => {
  it('lists every slice with its count and share of the whole', () => {
    draw();
    expect(within(row('Web geliştirme')).getByText('46')).toBeInTheDocument();
    expect(row('Web geliştirme')).toHaveTextContent('%46');
    expect(row('Oyun geliştirme')).toHaveTextContent('%16');
  });

  it('writes the pointed slice’s share in the hole and the total otherwise', () => {
    draw();
    expect(screen.getByText('Toplam')).toBeInTheDocument();
    fireEvent.mouseEnter(row('Yapay zekâ'));
    expect(screen.getByText('%38')).toBeInTheDocument();
    fireEvent.mouseLeave(row('Yapay zekâ'));
    expect(screen.getByText('Toplam')).toBeInTheDocument();
  });

  it('hides a slice when its row is pressed and keeps at least one', () => {
    draw();
    fireEvent.click(row('Web geliştirme'));
    expect(row('Web geliştirme')).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(row('Yapay zekâ'));
    fireEvent.click(row('Oyun geliştirme'));
    expect(row('Oyun geliştirme')).toHaveAttribute('aria-pressed', 'true');
  });

  it('folds slices past six into Diğer', () => {
    const many = Array.from({ length: 8 }, (_, i) => ({
      key: `k${i}`,
      label: `Seçenek ${i + 1}`,
      value: 10,
    }));
    draw({ data: many });
    expect(row('Diğer')).toHaveTextContent('30');
    expect(screen.queryByRole('button', { name: /Seçenek 7/ })).toBeNull();
  });
});
