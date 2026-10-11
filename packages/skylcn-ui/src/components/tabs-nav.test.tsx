import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Users } from 'lucide-react';
import { afterEach, describe, expect, it } from 'vitest';
import { SkylcnProvider, type LinkComponentProps } from '../lib/provider.js';
import { axeViolations } from '../test/axe.js';
import { TabsNav, scrollLeftToShow } from './tabs-nav.js';

const items = [
  { href: '/events/e1', label: 'Genel bakış' },
  { href: '/events/e1/participants', label: 'Katılımcılar', icon: Users, badge: 42 },
  { href: '/events/e1/program', label: 'Program' },
];

/** Places the list and its links as a browser would lay them out side by side. */
function layOut(list: HTMLElement, width: number, tabWidth: number) {
  Object.defineProperty(list, 'clientWidth', { configurable: true, value: width });
  list.querySelectorAll('a').forEach((link, index) => {
    Object.defineProperty(link, 'offsetLeft', { configurable: true, value: index * tabWidth });
    Object.defineProperty(link, 'offsetWidth', { configurable: true, value: tabWidth });
  });
}

/** Lays out every list and its links side by side, even links rendered later. */
function layOutAll(width: number, tabWidth: number) {
  const restore = [
    [HTMLUListElement.prototype, 'clientWidth'],
    [HTMLAnchorElement.prototype, 'offsetLeft'],
    [HTMLAnchorElement.prototype, 'offsetWidth'],
  ] as const;
  Object.defineProperty(HTMLUListElement.prototype, 'clientWidth', {
    configurable: true,
    get: () => width,
  });
  Object.defineProperty(HTMLAnchorElement.prototype, 'offsetLeft', {
    configurable: true,
    get(this: HTMLAnchorElement) {
      const links = [...(this.closest('ul')?.querySelectorAll('a') ?? [])];
      return links.indexOf(this) * tabWidth;
    },
  });
  Object.defineProperty(HTMLAnchorElement.prototype, 'offsetWidth', {
    configurable: true,
    get: () => tabWidth,
  });
  return () => {
    for (const [proto, key] of restore) delete (proto as unknown as Record<string, unknown>)[key];
  };
}

let undoLayout: (() => void) | null = null;
afterEach(() => {
  undoLayout?.();
  undoLayout = null;
});

describe('scrollLeftToShow', () => {
  it('leaves the row where it is when the tab is already in view', () => {
    expect(scrollLeftToShow({ scrollLeft: 0, width: 300 }, { left: 100, width: 80 })).toBe(0);
  });

  it('scrolls back so a tab cut off on the left shows whole', () => {
    expect(scrollLeftToShow({ scrollLeft: 200, width: 300 }, { left: 120, width: 80 })).toBe(96);
  });

  it('scrolls on so a tab cut off on the right shows whole', () => {
    expect(scrollLeftToShow({ scrollLeft: 0, width: 300 }, { left: 280, width: 80 })).toBe(84);
  });

  it('never scrolls before the start of the row', () => {
    expect(scrollLeftToShow({ scrollLeft: 40, width: 300 }, { left: 10, width: 80 })).toBe(0);
  });
});

describe('TabsNav', () => {
  it('lists every tab as a link to its own route, not as a tab', () => {
    render(<TabsNav aria-label="Etkinlik" items={items} activeHref="/events/e1" />);
    const nav = screen.getByRole('navigation', { name: 'Etkinlik' });
    expect(within(nav).queryAllByRole('tab')).toHaveLength(0);
    expect(within(nav).queryByRole('tablist')).not.toBeInTheDocument();
    const links = within(nav).getAllByRole('link');
    expect(links.map((link) => link.getAttribute('href'))).toEqual(items.map((item) => item.href));
    expect(within(nav).getByRole('list')).toBeInTheDocument();
  });

  it('marks only the open route as the current page', () => {
    render(<TabsNav aria-label="Etkinlik" items={items} activeHref="/events/e1/program" />);
    expect(screen.getByRole('link', { name: 'Program' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Genel bakış' })).not.toHaveAttribute('aria-current');
    expect(screen.getByRole('link', { name: /Katılımcılar/ })).not.toHaveAttribute('aria-current');
  });

  it('marks no tab when the open route is none of them', () => {
    render(<TabsNav aria-label="Etkinlik" items={items} activeHref="/events/e1/door" />);
    expect(document.querySelector('[aria-current]')).toBeNull();
  });

  it('renders the links through the provider’s link component', () => {
    function RouterLink({ href, ...props }: LinkComponentProps) {
      return <a href={href} data-router="" {...props} />;
    }
    render(
      <SkylcnProvider linkComponent={RouterLink}>
        <TabsNav aria-label="Etkinlik" items={items} activeHref="/events/e1" />
      </SkylcnProvider>,
    );
    for (const link of screen.getAllByRole('link')) expect(link).toHaveAttribute('data-router');
  });

  it('shows a tab’s icon and badge beside its label', () => {
    render(<TabsNav aria-label="Etkinlik" items={items} activeHref="/events/e1" />);
    const link = screen.getByRole('link', { name: 'Katılımcılar 42' });
    expect(link.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('keeps the tabs in the natural tab order, then the actions', async () => {
    const user = userEvent.setup();
    render(
      <TabsNav
        aria-label="Etkinlik"
        items={items}
        activeHref="/events/e1/program"
        actions={<a href="/qr?eventId=e1">Kapı</a>}
      />,
    );
    await user.tab();
    expect(screen.getByRole('link', { name: 'Genel bakış' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('link', { name: /Katılımcılar/ })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('link', { name: 'Program' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('link', { name: 'Kapı' })).toHaveFocus();
  });

  it('scrolls the open tab into the row when it opens out of view', () => {
    const { rerender } = render(
      <TabsNav aria-label="Etkinlik" items={items} activeHref="/events/e1" />,
    );
    const list = screen.getByRole('list');
    layOut(list, 150, 100);
    rerender(<TabsNav aria-label="Etkinlik" items={items} activeHref="/events/e1/program" />);
    expect(list.scrollLeft).toBe(174);
  });

  it('scrolls the open tab into view again when the tabs change around it', () => {
    undoLayout = layOutAll(150, 100);
    const program = items[2]!;
    const { rerender } = render(
      <TabsNav aria-label="Etkinlik" items={[program]} activeHref={program.href} />,
    );
    const list = screen.getByRole('list');
    expect(list.scrollLeft).toBe(0);
    rerender(<TabsNav aria-label="Etkinlik" items={items} activeHref={program.href} />);
    expect(list.scrollLeft).toBe(174);
  });

  it('breaks no accessibility rules', async () => {
    render(
      <TabsNav
        aria-label="Etkinlik"
        items={items}
        activeHref="/events/e1/participants"
        actions={<a href="/qr?eventId=e1">Kapı</a>}
      />,
    );
    expect(await axeViolations()).toEqual([]);
  });
});
