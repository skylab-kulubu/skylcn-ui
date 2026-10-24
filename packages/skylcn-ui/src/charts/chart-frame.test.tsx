import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SkylcnProvider } from '../lib/provider.js';
import { ChartFrame, type ChartFrameProps } from './chart-frame.js';

function draw(props: Partial<ChartFrameProps> = {}) {
  return render(
    <SkylcnProvider locale="tr">
      <ChartFrame
        title="Haftalık cevap"
        badge={<span>%+12</span>}
        height={120}
        legend={[]}
        legendShape="rect"
        table={{ head: ['Hafta', 'Cevap'], rows: [['8 Eyl', 12]] }}
        {...props}
      >
        {() => <svg aria-label="Grafik" />}
      </ChartFrame>
    </SkylcnProvider>,
  );
}

describe('ChartFrame', () => {
  it('draws a card around a framed chart, with no rule in its caption', () => {
    const { container } = draw();
    expect(container.querySelector('figure')).toHaveClass('border');
    expect(container.querySelector('[data-slot="chart-rule"]')).toBeNull();
  });

  it('heads an unframed chart like a Section: title, a rule, then the table switch', () => {
    const { container } = draw({ framed: false, description: 'Son 8 hafta' });
    expect(container.querySelector('figure')).not.toHaveClass('border');
    const rule = container.querySelector('[data-slot="chart-rule"]');
    expect(rule).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByText('Haftalık cevap').compareDocumentPosition(rule!)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(
      rule!.compareDocumentPosition(screen.getByRole('button', { name: 'Tablo olarak göster' })),
    ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    // Under the header row, and still part of the caption
    expect(screen.getByText('Son 8 hafta').closest('figcaption')).not.toBeNull();
  });
});
