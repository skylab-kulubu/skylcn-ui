import type { ComponentType } from 'react';
import { ACTION_FORM_EXAMPLES } from './actions-forms';
import { DATA_EXAMPLES } from './data';
import { FEEDBACK_EXAMPLES } from './feedback';
import { FORM_EXTRA_EXAMPLES } from './form-extra';
import { FOUNDATION_EXAMPLES } from './foundations';
import { INTERACTION_EXAMPLES } from './interaction';
import { OVERLAY_NAVIGATION_EXAMPLES } from './overlays-navigation';

/** The live examples of each library page, by slug. */
export const EXAMPLES: Record<string, ComponentType> = {
  ...FOUNDATION_EXAMPLES,
  ...ACTION_FORM_EXAMPLES,
  ...OVERLAY_NAVIGATION_EXAMPLES,
  ...DATA_EXAMPLES,
  ...INTERACTION_EXAMPLES,
  ...FEEDBACK_EXAMPLES,
  ...FORM_EXTRA_EXAMPLES,
};
