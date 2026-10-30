import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Stepper, Timeline } from './display-extra.js';

describe('Timeline', () => {
  it('marks the current step with its number and draws the steps still to come dashed', () => {
    const { container } = render(
      <Timeline
        items={[
          { id: 'a', title: 'Başvuru alındı', tone: 'success' },
          { id: 'b', title: 'Değerlendirme', marker: 2, current: true, tone: 'brand' },
          { id: 'c', title: 'Sonuç', upcoming: true },
        ]}
      />,
    );
    const current = screen.getByText('Değerlendirme').closest('li')!;
    expect(current).toHaveAttribute('aria-current', 'step');
    expect(within(current).getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Sonuç')).toHaveClass('text-muted-foreground');
    // The upcoming step's mark and the line leading to it
    expect(container.querySelectorAll('.border-dashed')).toHaveLength(2);
  });
});

describe('Stepper', () => {
  it('ticks done steps, rings the current one and draws a step that may not come dashed', () => {
    const { container } = render(
      <Stepper
        current={1}
        steps={[
          { id: 'a', label: 'Başvuru' },
          { id: 'b', label: 'Görev' },
          { id: 'c', label: 'Mülakat', uncertain: true },
        ]}
      />,
    );
    const steps = container.querySelectorAll('li');
    expect(steps[1]).toHaveAttribute('aria-current', 'step');
    expect(steps[0]!.querySelector('svg')).not.toBeNull();
    expect(within(steps[2] as HTMLElement).getByText('3')).toHaveClass('border-dashed');
  });
});
