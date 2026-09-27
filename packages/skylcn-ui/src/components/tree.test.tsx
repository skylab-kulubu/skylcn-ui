import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../test/axe.js';
import { Tree } from './tree.js';

const nodes = [
  { id: 'board', label: 'Yönetim' },
  {
    id: 'members',
    label: 'Üyeler',
    children: [
      { id: 'weblab', label: 'WebLab' },
      { id: 'skysec', label: 'SkySec' },
    ],
  },
];

describe('Tree', () => {
  it('moves with the arrows, opens with Right and steps out with Left', async () => {
    const user = userEvent.setup();
    render(<Tree aria-label="Gruplar" nodes={nodes} />);
    await user.tab();
    expect(screen.getByRole('treeitem', { name: 'Yönetim' })).toHaveFocus();

    await user.keyboard('{ArrowDown}');
    const members = screen.getByRole('treeitem', { name: 'Üyeler' });
    expect(members).toHaveFocus();
    expect(members).toHaveAttribute('aria-expanded', 'false');

    await user.keyboard('{ArrowRight}');
    expect(members).toHaveAttribute('aria-expanded', 'true');
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('treeitem', { name: 'WebLab' })).toHaveFocus();

    await user.keyboard('{ArrowLeft}');
    expect(members).toHaveFocus();
  });

  it('keeps a single tab stop and reports the pick', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <Tree aria-label="Gruplar" nodes={nodes} defaultExpanded={['members']} onSelect={onSelect} />,
    );
    expect(screen.getAllByRole('treeitem').filter((row) => row.tabIndex === 0)).toHaveLength(1);
    await user.tab();
    await user.keyboard('{End}{Enter}');
    expect(onSelect).toHaveBeenCalledWith('skysec');
    expect(await axeViolations()).toEqual([]);
  });
});
