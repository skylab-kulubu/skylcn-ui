import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Award, LayoutDashboard, Users } from 'lucide-react';
import { describe, expect, it } from 'vitest';
import { SkylcnProvider, type LinkComponentProps } from '../lib/provider.js';
import { axeViolations } from '../test/axe.js';
import { SideNav, SideNavLayout, scrollTopToShow, type SideNavSection } from './side-nav.js';

const sections: SideNavSection[] = [
  { items: [{ href: '/events/e1', label: 'Genel bakış', icon: LayoutDashboard }] },
  {
    label: 'Katılım',
    items: [
      { href: '/events/e1/participants', label: 'Katılımcılar', icon: Users, badge: 42 },
      { href: '/events/e1/program', label: 'Program', badge: 0 },
    ],
  },
  {
    label: 'Sonrası',
    items: [{ href: '/events/e1/certificates', label: 'Sertifikalar', icon: Award }],
  },
];

function desktopNav() {
  return screen.getByRole('navigation', { name: 'Etkinlik' });
}

describe('scrollTopToShow', () => {
  it('leaves the panel where it is when the item is already in view', () => {
    expect(scrollTopToShow({ scrollTop: 0, height: 300 }, { top: 100, height: 36 })).toBe(0);
  });

  it('brings an item below the fold to the middle of the panel', () => {
    expect(scrollTopToShow({ scrollTop: 0, height: 300 }, { top: 600, height: 36 })).toBe(468);
  });

  it('brings an item above the fold to the middle, never before the top', () => {
    expect(scrollTopToShow({ scrollTop: 400, height: 300 }, { top: 120, height: 36 })).toBe(0);
    expect(scrollTopToShow({ scrollTop: 800, height: 300 }, { top: 500, height: 36 })).toBe(368);
  });
});

describe('SideNav', () => {
  it('keeps the old shape working: sections of links with labels and badges', () => {
    render(
      <SideNav
        aria-label="Klasörler"
        activeHref="#inbox"
        sections={[{ items: [{ href: '#inbox', label: 'Gelen kutusu', badge: 12 }] }]}
      />,
    );
    const nav = screen.getByRole('navigation', { name: 'Klasörler' });
    expect(within(nav).getByRole('link', { name: 'Gelen kutusu 12' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  it('marks only the open page as the current page', () => {
    render(<SideNav aria-label="Etkinlik" sections={sections} activeHref="/events/e1/program" />);
    const nav = desktopNav();
    expect(within(nav).getByRole('link', { name: /Program/ })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(nav.querySelectorAll('[aria-current]')).toHaveLength(1);
  });

  it('draws the open page’s fill with its bar, and only there', () => {
    render(<SideNav aria-label="Etkinlik" sections={sections} activeHref="/events/e1/program" />);
    const marks = desktopNav().querySelectorAll('[data-slot="side-nav-active"]');
    expect(marks).toHaveLength(1);
    expect(marks[0]!.closest('a')).toHaveAttribute('href', '/events/e1/program');
    expect(marks[0]!.firstElementChild).toHaveClass('bg-primary');
  });

  it('shows an item’s icon hidden from screen readers, tinted on the open page', () => {
    render(
      <SideNav aria-label="Etkinlik" sections={sections} activeHref="/events/e1/participants" />,
    );
    const nav = desktopNav();
    const open = within(nav).getByRole('link', { name: 'Katılımcılar 42' });
    const icon = open.querySelector('svg');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
    expect(icon).toHaveClass('text-primary');
    const other = within(nav).getByRole('link', { name: 'Genel bakış' }).querySelector('svg');
    expect(other).not.toHaveClass('text-primary');
  });

  it('writes a count of zero, and nothing when there is no count', () => {
    render(<SideNav aria-label="Etkinlik" sections={sections} activeHref="/events/e1" />);
    const nav = desktopNav();
    expect(within(nav).getByRole('link', { name: 'Program 0' })).toBeInTheDocument();
    expect(within(nav).getByRole('link', { name: 'Sertifikalar' })).toBeInTheDocument();
  });

  it('names each section’s list by its heading', () => {
    render(<SideNav aria-label="Etkinlik" sections={sections} activeHref="/events/e1" />);
    const nav = desktopNav();
    expect(within(nav).getByRole('list', { name: 'Katılım' })).toBeInTheDocument();
    expect(within(nav).getByRole('list', { name: 'Sonrası' })).toBeInTheDocument();
    // The heading is a label, not a link or a button
    expect(within(nav).queryByRole('link', { name: 'Katılım' })).not.toBeInTheDocument();
  });

  it('divides every section after the first with a rule', () => {
    render(<SideNav aria-label="Etkinlik" sections={sections} activeHref="/events/e1" />);
    const parts = desktopNav().querySelectorAll('[data-slot="side-nav-section"]');
    expect(parts).toHaveLength(3);
    expect(parts[0]).not.toHaveClass('border-t');
    expect(parts[1]).toHaveClass('border-t');
    expect(parts[2]).toHaveClass('border-t');
  });

  it('moves between links with the arrow keys, Home and End', async () => {
    const user = userEvent.setup();
    render(<SideNav aria-label="Etkinlik" sections={sections} activeHref="/events/e1" />);
    const nav = desktopNav();
    const link = (name: RegExp) => within(nav).getByRole('link', { name });
    await user.tab();
    expect(link(/Genel bakış/)).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(link(/Katılımcılar/)).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(link(/Program/)).toHaveFocus();
    await user.keyboard('{ArrowUp}');
    expect(link(/Katılımcılar/)).toHaveFocus();
    await user.keyboard('{End}');
    expect(link(/Sertifikalar/)).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(link(/Sertifikalar/)).toHaveFocus();
    await user.keyboard('{Home}');
    expect(link(/Genel bakış/)).toHaveFocus();
  });

  it('keeps every link in the natural tab order', async () => {
    const user = userEvent.setup();
    render(<SideNav aria-label="Etkinlik" sections={sections} activeHref="/events/e1" />);
    const nav = desktopNav();
    for (const name of [/Genel bakış/, /Katılımcılar/, /Program/, /Sertifikalar/]) {
      await user.tab();
      expect(within(nav).getByRole('link', { name })).toHaveFocus();
    }
  });

  it('narrows the list by name and drops sections left empty', async () => {
    const user = userEvent.setup();
    render(
      <SideNav aria-label="Etkinlik" sections={sections} activeHref="/events/e1" searchable />,
    );
    const nav = desktopNav();
    await user.type(within(nav).getByRole('searchbox'), 'sert');
    expect(
      within(nav)
        .getAllByRole('link')
        .map((link) => link.textContent),
    ).toEqual(['Sertifikalar']);
    expect(within(nav).queryByRole('list', { name: 'Katılım' })).not.toBeInTheDocument();
  });

  it('renders the links through the provider’s link component', () => {
    function RouterLink({ href, ...props }: LinkComponentProps) {
      return <a href={href} data-router="" {...props} />;
    }
    render(
      <SkylcnProvider linkComponent={RouterLink}>
        <SideNav aria-label="Etkinlik" sections={sections} activeHref="/events/e1" />
      </SkylcnProvider>,
    );
    for (const link of within(desktopNav()).getAllByRole('link')) {
      expect(link).toHaveAttribute('data-router');
    }
  });

  it('names the open page and its icon on the phone button, and opens the same menu', async () => {
    const user = userEvent.setup();
    render(
      <SideNav aria-label="Etkinlik" sections={sections} activeHref="/events/e1/certificates" />,
    );
    const trigger = screen.getByRole('button', { name: 'Etkinlik · Sertifikalar' });
    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
    expect(trigger.querySelector('svg.text-primary')).not.toBeNull();
    await user.click(trigger);
    const drawer = await screen.findByRole('dialog');
    const nav = within(drawer).getByRole('navigation', { name: 'Etkinlik' });
    expect(within(nav).getByRole('link', { name: 'Sertifikalar' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(within(nav).getByRole('list', { name: 'Katılım' })).toBeInTheDocument();
    expect(nav.querySelectorAll('[data-slot="side-nav-active"]')).toHaveLength(1);
  });

  it('breaks no accessibility rules', async () => {
    render(
      <SideNavLayout
        nav={
          <SideNav
            aria-label="Etkinlik"
            sections={sections}
            activeHref="/events/e1/participants"
            searchable
          />
        }
      >
        <p>İçerik</p>
      </SideNavLayout>,
    );
    expect(await axeViolations()).toEqual([]);
  });
});
