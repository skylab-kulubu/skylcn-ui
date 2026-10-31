import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { axeViolations } from '../test/axe.js';
import { SortableList } from './sortable-list.js';

type Step = { id: string; title: string };
const STEPS: Step[] = [
  { id: 'a', title: 'Kayıt' },
  { id: 'b', title: 'Açılış' },
  { id: 'c', title: 'Atölye' },
];

function Agenda() {
  const [steps, setSteps] = useState(STEPS);
  return (
    <SortableList
      aria-label="Akış"
      items={steps}
      getId={(step) => step.id}
      getLabel={(step) => step.title}
      onReorder={setSteps}
      renderItem={(step) => step.title}
    />
  );
}

const titles = () => screen.getAllByRole('listitem').map((row) => row.textContent);

describe('SortableList', () => {
  it('moves the row whose handle has focus with the arrow keys and says where it went', async () => {
    const user = userEvent.setup();
    render(<Agenda />);
    const handle = screen.getByRole('button', { name: 'Atölye öğesini taşı' });
    expect(handle).toHaveAccessibleDescription('Yukarı ve aşağı ok tuşlarıyla taşı.');

    handle.focus();
    await user.keyboard('{ArrowUp}');
    expect(titles()).toEqual(['Kayıt', 'Atölye', 'Açılış']);
    expect(screen.getByText('Atölye: 3 öğeden 2. sırada')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Atölye öğesini taşı' })).toHaveFocus();

    await user.keyboard('{ArrowUp}{ArrowUp}');
    expect(titles()).toEqual(['Atölye', 'Kayıt', 'Açılış']);
  });

  it('has no axe violations', async () => {
    const { container } = render(<Agenda />);
    expect(await axeViolations(container)).toEqual([]);
  });
});
