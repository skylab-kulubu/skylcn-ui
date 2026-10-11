import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SkylcnProvider, type LinkComponentProps } from '../lib/provider.js';
import { axeViolations } from '../test/axe.js';
import { PageHeader } from './page-header.js';
import { TabsNav } from './tabs-nav.js';

const tabs = (
  <TabsNav
    aria-label="Etkinlik"
    activeHref="/events/e1"
    items={[
      { href: '/events/e1', label: 'Genel bakış' },
      { href: '/events/e1/program', label: 'Program' },
    ]}
  />
);

describe('PageHeader', () => {
  it('keeps its title row, divider and toolbar when no new slot is given', () => {
    const { container } = render(
      <PageHeader title="Formlar" description="Paylaşılan formlar." actions={<button>Yeni</button>}>
        <input aria-label="Ara" />
      </PageHeader>,
    );
    expect(screen.getByRole('heading', { level: 1, name: 'Formlar' })).toBeInTheDocument();
    expect(container.querySelector('[data-slot="page-header-divider"]')).not.toBeNull();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(container.querySelector('[data-slot="page-header-cover"]')).toBeNull();
  });

  it('leads with a link back to the parent page, through the provider’s link component', () => {
    function RouterLink({ href, ...props }: LinkComponentProps) {
      return <a href={href} data-router="" {...props} />;
    }
    render(
      <SkylcnProvider linkComponent={RouterLink}>
        <PageHeader title="Gece Kodu 2026" back={{ href: '/events', label: 'Etkinlikler' }} />
      </SkylcnProvider>,
    );
    const back = screen.getByRole('link', { name: 'Etkinlikler' });
    expect(back).toHaveAttribute('href', '/events');
    expect(back).toHaveAttribute('data-router');
    expect(back.compareDocumentPosition(screen.getByRole('heading'))).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });

  it('shows a cover beside the title', () => {
    render(<PageHeader title="Gece Kodu 2026" cover={<img src="/cover.webp" alt="" />} />);
    const cover = document.querySelector('[data-slot="page-header-cover"]');
    expect(cover?.querySelector('img')).toHaveAttribute('src', '/cover.webp');
  });

  it('puts the tabs in place of the divider, above the toolbar', () => {
    const { container } = render(
      <PageHeader title="Gece Kodu 2026" tabs={tabs}>
        <input aria-label="Ara" />
      </PageHeader>,
    );
    expect(container.querySelector('[data-slot="page-header-divider"]')).toBeNull();
    const nav = screen.getByRole('navigation', { name: 'Etkinlik' });
    expect(nav.compareDocumentPosition(screen.getByRole('textbox'))).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });

  it('breaks no accessibility rules with every slot filled', async () => {
    render(
      <PageHeader
        title="Gece Kodu 2026"
        description="12 Ekim, Davutpaşa"
        back={{ href: '/events', label: 'Etkinlikler' }}
        cover={<img src="/cover.webp" alt="" />}
        actions={<button>Düzenle</button>}
        tabs={tabs}
      />,
    );
    expect(await axeViolations()).toEqual([]);
  });
});
