import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axeViolations } from '../test/axe.js';
import { StatCard } from './card.js';

describe('StatCard', () => {
  it('draws its card unless told to set the figure straight into the page', () => {
    const { container, rerender } = render(
      <StatCard label="Toplam form" value="128" hint="Sistemdeki tüm formlar" />,
    );
    expect(container.querySelector('[data-slot="stat-card"]')).toHaveClass('border', 'bg-card');

    rerender(
      <StatCard label="Toplam form" value="128" hint="Sistemdeki tüm formlar" framed={false} />,
    );
    const figure = container.querySelector('[data-slot="stat-card"]');
    expect(figure).not.toHaveClass('border');
    expect(figure).not.toHaveClass('p-4');
    expect(screen.getByText('128')).toBeInTheDocument();
    expect(screen.getByText('Sistemdeki tüm formlar')).toBeInTheDocument();
  });

  it('becomes a link with a state dot and a coloured value when asked', () => {
    const { container } = render(
      <StatCard
        label="Bekleyen onay"
        value="17"
        href="/reviews"
        dot="warning"
        valueTone="warning"
      />,
    );
    expect(screen.getByRole('link')).toHaveAttribute('href', '/reviews');
    expect(container.querySelector('[data-slot="status-dot"]')).not.toBeNull();
    expect(screen.getByText('17')).toHaveClass('text-warning');
  });

  it('writes its label as plain text, not letter-spaced capitals', () => {
    render(<StatCard label="Bekleyen onay" value="17" />);
    expect(screen.getByText('Bekleyen onay')).not.toHaveClass('uppercase');
  });

  it('breaks no accessibility rules, framed or not', async () => {
    render(
      <>
        <StatCard label="Toplam cevap" value="4.213" delta="+12" deltaTone="positive" />
        <StatCard label="Şablon" value="6" hint="Sana ait" framed={false} />
      </>,
    );
    expect(await axeViolations()).toEqual([]);
  });
});
