import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { axeViolations } from '../test/axe.js';
import { ActivityHeatmap } from './activity-heatmap.js';

const END = new Date(2026, 9, 31);
const DATA = [
  { date: new Date(2026, 9, 29), count: 4 },
  { date: new Date(2026, 9, 30), count: 1 },
  { date: '2026-10-20T10:00:00', count: 2 },
];

function chart() {
  return render(
    <ActivityHeatmap
      aria-label="Katılım"
      data={DATA}
      weeks={3}
      end={END}
      formatCount={(n) => `${n} katılım`}
    />,
  );
}

describe('ActivityHeatmap', () => {
  it('sums the days and names the busiest one for screen readers', () => {
    chart();
    expect(
      screen.getByRole('img', {
        name: 'Katılım. 7 katılım; 29 Ekim 2026 Perşembe: 4 katılım',
      }),
    ).toBeInTheDocument();
  });

  it('starts weeks on Monday and shades the busiest day darkest', () => {
    const { container } = chart();
    const cells = container.querySelectorAll('[class*="size-2.75"][class*="rounded-xs"]');
    // Three weeks of cells, Monday 12 to Saturday 31, plus the five legend squares
    expect(cells.length).toBe(20 + 5);
    expect(cells[17]!.className).toContain('bg-chart-1 ');
  });

  it('reads the day in focus as the arrow keys move', async () => {
    const user = userEvent.setup();
    chart();
    await user.tab();
    expect(screen.getByText('31 Ekim 2026 Cumartesi: 0 katılım')).toBeInTheDocument();
    await user.keyboard('{ArrowUp}{ArrowUp}');
    expect(screen.getByText('29 Ekim 2026 Perşembe: 4 katılım')).toBeInTheDocument();
    await user.keyboard('{ArrowLeft}');
    expect(screen.getByText('22 Ekim 2026 Perşembe: 0 katılım')).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = chart();
    expect(await axeViolations(container)).toEqual([]);
  });
});
