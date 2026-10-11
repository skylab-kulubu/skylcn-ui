import { render, screen } from '@testing-library/react';
import { CircleCheck } from 'lucide-react';
import { describe, expect, it } from 'vitest';
import { axeViolations } from '../test/axe.js';
import { TaskPage } from './task-page.js';

describe('TaskPage', () => {
  it('is the main landmark with the title as its one h1', () => {
    render(
      <TaskPage title="Hesap Merkezi’ne giriş yap" description="Kimliğini doğrula.">
        <button type="button">SKY LAB ile giriş yap</button>
      </TaskPage>,
    );
    expect(screen.getAllByRole('main')).toHaveLength(1);
    const headings = screen.getAllByRole('heading', { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent('Hesap Merkezi’ne giriş yap');
  });

  it('names the task by its title and describes it by its description', () => {
    render(<TaskPage title="Kapıda giriş" description="Bilgilerini yaz, girişin kaydedilsin." />);
    const task = screen.getByRole('region', { name: 'Kapıda giriş' });
    expect(task).toHaveAccessibleDescription('Bilgilerini yaz, girişin kaydedilsin.');
  });

  it('leaves the description out of the region when there is none', () => {
    render(<TaskPage title="Kapıda giriş" />);
    expect(screen.getByRole('region', { name: 'Kapıda giriş' })).not.toHaveAttribute(
      'aria-describedby',
    );
  });

  it('renders a div instead of main inside a page that has its own', () => {
    const { container } = render(
      <main>
        <TaskPage as="div" title="Hesap silme durumu" />
      </main>,
    );
    expect(screen.getAllByRole('main')).toHaveLength(1);
    expect(container.querySelector('[data-slot="task-page"]')?.tagName).toBe('DIV');
  });

  it('shows the SKY LAB mark and name above the task, or a brand it is given, or none', () => {
    const { rerender } = render(<TaskPage title="Giriş" />);
    const brand = document.querySelector('[data-slot="task-page-brand"]');
    expect(brand).toHaveTextContent('SKY LAB');
    expect(brand?.querySelector('svg')).toHaveAttribute('aria-hidden');

    rerender(<TaskPage title="Giriş" brand={<span>Hesap Merkezi</span>} />);
    expect(document.querySelector('[data-slot="task-page-brand"]')).toHaveTextContent(
      'Hesap Merkezi',
    );

    rerender(<TaskPage title="Giriş" brand={null} />);
    expect(document.querySelector('[data-slot="task-page-brand"]')).toBeNull();
  });

  it('puts the eyebrow before the title and the actions after the body', () => {
    render(
      <TaskPage
        eyebrow="Etkinlik girişi"
        title="Web atölyesi"
        actions={<button type="button">Giriş yap</button>}
      >
        <label>
          Ad soyad <input />
        </label>
      </TaskPage>,
    );
    const eyebrow = screen.getByText('Etkinlik girişi');
    const title = screen.getByRole('heading', { level: 1 });
    const field = screen.getByLabelText('Ad soyad');
    const action = screen.getByRole('button', { name: 'Giriş yap' });
    const follows = (a: Node, b: Node) =>
      Boolean(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);
    expect(follows(eyebrow, title)).toBe(true);
    expect(follows(title, field)).toBe(true);
    expect(follows(field, action)).toBe(true);
  });

  it('puts the footer links outside the task, under it', () => {
    render(
      <TaskPage title="Giriş" footer={<a href="/gizlilik">Gizlilik</a>}>
        <p>Gövde</p>
      </TaskPage>,
    );
    const task = screen.getByRole('region', { name: 'Giriş' });
    const link = screen.getByRole('link', { name: 'Gizlilik' });
    expect(task).not.toContainElement(link);
    expect(link.closest('footer')).not.toBeNull();
  });

  it('marks the heading busy while loading and drops the icon for the loader', () => {
    const { rerender } = render(
      <TaskPage loading title="Yönlendiriliyor…" icon={CircleCheck} tone="success" />,
    );
    const header = document.querySelector('[data-slot="task-page-header"]');
    expect(header).toHaveAttribute('aria-live', 'polite');
    expect(header).toHaveAttribute('aria-busy', 'true');
    expect(header?.querySelector('[data-slot="skylab-loader"]')).not.toBeNull();
    expect(header?.querySelector('.lucide-circle-check')).toBeNull();

    rerender(<TaskPage title="Hesabın silindi" icon={CircleCheck} tone="success" />);
    expect(header).not.toHaveAttribute('aria-busy');
    expect(header?.querySelector('.lucide-circle-check')).toHaveClass('text-success');
  });

  it('frames the task as a card unless told not to', () => {
    const { rerender } = render(<TaskPage title="Giriş" />);
    const task = () => screen.getByRole('region', { name: 'Giriş' });
    expect(task()).toHaveClass('sm:border');
    rerender(<TaskPage title="Giriş" framed={false} />);
    expect(task()).not.toHaveClass('sm:border');
  });

  it('has no accessibility violations with every slot filled', async () => {
    const { container } = render(
      <TaskPage
        eyebrow="Etkinlik girişi"
        title="Web atölyesi"
        description="Bilgilerini yaz, girişin kaydedilsin."
        icon={CircleCheck}
        tone="brand"
        actions={<button type="button">Giriş yap</button>}
        footer={<a href="/gizlilik">Gizlilik</a>}
      >
        <label>
          Ad soyad <input />
        </label>
      </TaskPage>,
    );
    expect(await axeViolations(container)).toEqual([]);
  });

  it('has no accessibility violations while loading, nested in a page', async () => {
    const { container } = render(
      <main>
        <TaskPage as="div" loading title="Yükleniyor…" align="center" size="lg" />
      </main>,
    );
    expect(await axeViolations(container)).toEqual([]);
  });
});
