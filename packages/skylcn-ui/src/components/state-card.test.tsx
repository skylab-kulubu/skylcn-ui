import { render, screen } from '@testing-library/react';
import { Inbox } from 'lucide-react';
import { describe, expect, it } from 'vitest';
import { axeViolations } from '../test/axe.js';
import { StateCard } from './state-card.js';

describe('StateCard', () => {
  it('names the state with a heading, level 2 unless told otherwise', async () => {
    const { rerender } = render(
      <StateCard icon={Inbox} title="Henüz yanıt yok" description="İlk yanıt burada görünür." />,
    );
    expect(screen.getByRole('heading', { level: 2, name: 'Henüz yanıt yok' })).toBeInTheDocument();
    expect(await axeViolations()).toEqual([]);
    rerender(<StateCard title="Henüz yanıt yok" level={3} />);
    expect(screen.getByRole('heading', { level: 3, name: 'Henüz yanıt yok' })).toBeInTheDocument();
  });

  it('keeps the loading label as a heading inside the live status', () => {
    render(<StateCard loading />);
    expect(screen.getByRole('status')).toContainElement(screen.getByRole('heading', { level: 2 }));
  });

  it('leaves out an empty heading', () => {
    render(<StateCard description="Bir şeyler ters gitti." />);
    expect(screen.queryByRole('heading')).toBeNull();
  });
});
