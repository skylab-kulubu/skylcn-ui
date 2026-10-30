import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../test/axe.js';
import { Combobox, MultiSelect, Slider } from './form-extra.js';

const universities = [
  { value: 'ytu', label: 'Yıldız Teknik' },
  { value: 'itu', label: 'İstanbul Teknik' },
];

describe('Combobox list motion', () => {
  it('rises its rows on opening, then settles so a search only fades rows in', async () => {
    const user = userEvent.setup();
    render(
      <Combobox
        aria-label="Üniversite"
        items={[...universities, { value: 'odtu', label: 'Orta Doğu Teknik' }]}
        value={null}
        onValueChange={() => undefined}
      />,
    );
    const input = screen.getByRole('combobox', { name: 'Üniversite' });
    await user.click(input);
    await user.keyboard('{ArrowDown}');
    await screen.findByRole('option', { name: 'Orta Doğu Teknik' });
    const rows = document.querySelector('.list-rows')!;
    expect(rows).not.toHaveAttribute('data-settled');
    await waitFor(() => expect(rows).toHaveAttribute('data-settled'), { timeout: 2000 });

    await user.type(input, 'orta');
    expect(await screen.findByRole('option', { name: 'Orta Doğu Teknik' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'Yıldız Teknik' })).toBeNull();
    expect(document.querySelector('.list-rows')).toHaveAttribute('data-settled');
  });
});

describe('Combobox', () => {
  it('offers what was typed as a new choice and hands it to onCreate', async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn();
    const onValueChange = vi.fn();
    render(
      <Combobox
        aria-label="Üniversite"
        items={universities}
        value={null}
        onValueChange={onValueChange}
        onCreate={onCreate}
      />,
    );
    await user.type(screen.getByRole('combobox', { name: 'Üniversite' }), 'Boğaziçi');
    await user.click(await screen.findByRole('option', { name: 'Yeni oluştur: “Boğaziçi”' }));
    expect(onCreate).toHaveBeenCalledWith('Boğaziçi');
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('offers nothing new for a name already in the list, whatever its case', async () => {
    const user = userEvent.setup();
    render(
      <Combobox
        aria-label="Üniversite"
        items={universities}
        value={null}
        onValueChange={() => undefined}
        onCreate={() => undefined}
      />,
    );
    await user.type(screen.getByRole('combobox', { name: 'Üniversite' }), 'yıldız teknik');
    expect(await screen.findByRole('option', { name: 'Yıldız Teknik' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: /Yeni oluştur/ })).toBeNull();
  });

  it('shows a server search as given and says while one is out', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(
      <Combobox
        aria-label="Kişi"
        items={[
          { value: 'a', label: 'Ayşe Demir' },
          { value: 'b', label: 'Barış Kaya' },
        ]}
        value={null}
        onValueChange={() => undefined}
        onSearch={onSearch}
        loading
      />,
    );
    await user.type(screen.getByRole('combobox', { name: 'Kişi' }), 'zz');
    expect(onSearch).toHaveBeenLastCalledWith('zz');
    // Base UI keeps a live region of its own, so the row is found by its words
    expect((await screen.findByText('Aranıyor…')).closest('[role="status"]')).not.toBeNull();
    expect(screen.getByRole('option', { name: 'Ayşe Demir' })).toBeInTheDocument();
  });

  it('shows a read-only value without the clear and open buttons', () => {
    render(
      <Combobox
        aria-label="Üniversite"
        items={universities}
        value="ytu"
        onValueChange={() => undefined}
        readOnly
      />,
    );
    expect(screen.getByRole('combobox', { name: 'Üniversite' })).toHaveValue('Yıldız Teknik');
    expect(screen.queryByRole('button', { name: 'Listeyi aç' })).toBeNull();
  });
});

function Teams({
  onChange,
  onCreate,
}: {
  onChange?: (value: string[]) => void;
  onCreate?: (label: string) => void;
}) {
  const [value, setValue] = useState<string[]>(['ytu']);
  return (
    <Combobox
      multiple
      aria-label="Üniversiteler"
      items={universities}
      value={value}
      onValueChange={(next) => {
        setValue(next);
        onChange?.(next);
      }}
      onCreate={onCreate}
    />
  );
}

describe('Combobox with several picks', () => {
  it('keeps picks as chips, adds from the list and removes from a chip', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Teams onChange={onChange} />);
    expect(screen.getByRole('button', { name: 'Yıldız Teknik çıkar' })).toBeInTheDocument();
    await user.type(screen.getByRole('combobox', { name: 'Üniversiteler' }), 'İst');
    await user.click(await screen.findByRole('option', { name: 'İstanbul Teknik' }));
    expect(onChange).toHaveBeenLastCalledWith(['ytu', 'itu']);
    await user.click(screen.getByRole('button', { name: 'Yıldız Teknik çıkar' }));
    expect(onChange).toHaveBeenLastCalledWith(['itu']);
  });

  it('offers what was typed as a new pick', async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn();
    const onChange = vi.fn();
    render(<Teams onCreate={onCreate} onChange={onChange} />);
    await user.type(screen.getByRole('combobox', { name: 'Üniversiteler' }), 'Boğaziçi');
    await user.click(await screen.findByRole('option', { name: 'Yeni oluştur: “Boğaziçi”' }));
    expect(onCreate).toHaveBeenCalledWith('Boğaziçi');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('still answers to its MultiSelect name', () => {
    render(
      <MultiSelect
        aria-label="Etiketler"
        items={universities}
        value={['itu']}
        onValueChange={() => undefined}
      />,
    );
    expect(screen.getByRole('button', { name: 'İstanbul Teknik çıkar' })).toBeInTheDocument();
  });

  it('breaks no accessibility rules with its list open', async () => {
    const user = userEvent.setup();
    render(<Teams />);
    await user.click(screen.getByRole('button', { name: 'Listeyi aç' }));
    await screen.findByRole('option', { name: 'İstanbul Teknik' });
    expect(await axeViolations(document.body)).toEqual([]);
  });
});

describe('Slider', () => {
  it('writes words under both ends of the track', () => {
    render(<Slider label="Memnuniyet" defaultValue={5} min={1} max={10} ends={['Hiç', 'Çok']} />);
    expect(screen.getByText('Hiç')).toBeInTheDocument();
    expect(screen.getByText('Çok')).toBeInTheDocument();
  });
});
