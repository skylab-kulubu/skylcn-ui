import { render, screen } from '@testing-library/react';
import type { ComponentType } from 'react';
import { describe, expect, it } from 'vitest';
import Dashboard from '../../../registry/blocks/dashboard/page';
import FormPage from '../../../registry/blocks/form-page/page';
import ListPage from '../../../registry/blocks/list-page/page';
import NotFound from '../../../registry/blocks/not-found/not-found';
import SettingsPage from '../../../registry/blocks/settings-page/page';
import SignIn from '../../../registry/blocks/sign-in/page';
import { SkylcnProvider } from './lib/provider.js';
import { axeViolations } from './test/axe.js';

const BLOCKS: [string, ComponentType, string][] = [
  ['sign-in', SignIn, 'Giriş yap'],
  ['not-found', NotFound, 'Bu sayfa yok'],
  ['list-page', ListPage, 'Üyeler'],
  ['settings-page', SettingsPage, 'Ayarlar'],
  ['form-page', FormPage, 'Hangi alanda çalışmak istersin?'],
  ['dashboard', Dashboard, 'Genel bakış'],
];

describe('registry blocks', () => {
  it.each(BLOCKS)('%s renders with the package and passes axe', async (_, Block, text) => {
    render(
      <SkylcnProvider locale="tr">
        <Block />
      </SkylcnProvider>,
    );
    expect(screen.getAllByText(text).length).toBeGreaterThan(0);
    expect(await axeViolations()).toEqual([]);
  });
});
