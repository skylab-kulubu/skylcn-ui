import type { ComponentType } from 'react';
import { ACTION_FORM_EXAMPLES } from './actions-forms';
import { DATA_EXAMPLES } from './data';
import { FOUNDATION_EXAMPLES } from './foundations';
import { OVERLAY_NAVIGATION_EXAMPLES } from './overlays-navigation';

/** The live examples of each library page, by slug. */
export const EXAMPLES: Record<string, ComponentType> = {
  ...FOUNDATION_EXAMPLES,
  ...ACTION_FORM_EXAMPLES,
  ...OVERLAY_NAVIGATION_EXAMPLES,
  ...DATA_EXAMPLES,
};
