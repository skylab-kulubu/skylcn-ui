# skylcn-ui

The shared design system of SKY LAB's web products: tokens, a theme and components written the shadcn way on top of [Base UI](https://base-ui.com). Decision record: [ADR 0055](https://github.com/skylab-kulubu/e-skylab/blob/main/docs/adr/0055-skylcn-ui-is-the-shared-design-system.md).

## Installation

```sh
pnpm add @skylab-kulubu/skylcn-ui
```

## Usage

Apps on Tailwind 4 import the theme right after Tailwind:

```css
@import 'tailwindcss';
@import '@skylab-kulubu/skylcn-ui/theme.css';
```

```tsx
import { Button, SkylcnProvider, ThemeScript } from '@skylab-kulubu/skylcn-ui';

export default function RootLayout({ children }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        <SkylcnProvider locale="tr">{children}</SkylcnProvider>
      </body>
    </html>
  );
}
```

- The app loads the fonts (Space Grotesk and Space Mono) and binds them to `--skylcn-font-sans` and `--skylcn-font-mono`. Without them the system font is used, which is enough for surfaces such as the Keycloak theme.
- Dark is the default theme; `data-theme="light"` switches to the light one. `useTheme` remembers the choice and changes the theme with a short transition.
- To keep the page from opening in the wrong theme and flashing, `<ThemeScript />` goes in `<head>` and `<html>` gets `suppressHydrationWarning`.
- `SkylcnProvider` sets the language of the built-in texts (`tr` or `en`) and the component used for internal links (`next/link` in Next.js).
- Surfaces without Tailwind take only the tokens: `@skylab-kulubu/skylcn-ui/tokens.css`.

## Entry points

- `@skylab-kulubu/skylcn-ui`: components, motion helpers, the theme and tokens.
- `@skylab-kulubu/skylcn-ui/charts`: charts on Recharts (area, line, bar, donut). An app without charts never loads Recharts.
- `@skylab-kulubu/skylcn-ui/data-table`: the admin table on TanStack Table.
- `@skylab-kulubu/skylcn-ui/theme.css` and `/tokens.css`: the Tailwind theme and plain CSS tokens.

## Components

Every component has live examples in the docs app's playground (`/playground/components`):

- **Actions:** Button, IconButton, IconSwap, CopyButton, SegmentedControl
- **Forms:** Field, Input, Textarea, Select, Combobox, MultiSelect, Checkbox, RadioGroup, Switch, ToggleRow, NumberField, Slider, DatePicker, DateRangePicker, DateTimePicker, Calendar, Dropzone, OTPField
- **Overlays:** Dialog, ConfirmDialog, Drawer (right, left, bottom; closes with a swipe), Popover, PreviewCard, Tooltip, Menu, ContextMenu, Toast, CommandPalette
- **Navigation:** AppShell, SideNav, NavigationMenu, Tabs, Accordion, Stepper, Breadcrumbs, Pagination, PageHeader
- **Data:** DataList, DataTable, ListPanel, Card, StatCard, Badge, StatusDot, Avatar, AvatarGroup, DescriptionList, Timeline, Tree, MonthCalendar, BarList, ProportionBar, TrendBadge, Sparkline, Notice, Banner, BulkBar, Progress, Meter, Kbd, StateCard, StatusPage, Skeleton
- **Motion:** Reveal, Collapse, Swap, AnimatedNumber

The playground also has scenarios, whole pages built from these components, and a page builder for composing a page from blocks and copying its code.

## Principles

- **Accessibility:** Every text meant to be read keeps at least 4.5:1 contrast on every surface; the `faint` tone is only for decoration and disabled states. The focus ring shows at once and is drawn in Windows high contrast mode too. For readers who ask for more contrast, muted text and lines get one step stronger.
- **Motion:** Durations, easings and distances are tokens. With reduced motion, short fades stay and slides and growth go. Animation is used only when it tells where something came from and went, or that its state changed.
- **Mobile:** On touch screens controls grow and text fields are 16px, so iOS does not zoom into them.

## Browser support

Chrome/Edge 113, Safari 17.2 and Firefox 112 or later. The soft fade between themes uses the View Transitions API where the browser has it; elsewhere the theme changes at once.

## Development

```sh
pnpm install
pnpm --filter @skylab-kulubu/skylcn-ui build
pnpm dev        # playground: scenarios and the component library
pnpm typecheck
pnpm lint
pnpm test       # unit and accessibility (axe) tests
```

End-to-end tests run against a production build of the docs app; every page goes through axe and the main interactions are tried:

```sh
pnpm --filter docs build
pnpm --filter docs exec playwright install chromium   # or point PLAYWRIGHT_CHROMIUM_EXECUTABLE at an installed Chromium
pnpm --filter docs e2e
```

The playground can also be built as static files; `DOCS_BASE_PATH` serves it under a sub-path:

```sh
DOCS_EXPORT=1 DOCS_BASE_PATH=/playground pnpm --filter docs build   # output: apps/docs/out
```

Every change comes with a Changesets entry: `pnpm changeset`. Until 1.0 the version follows the 0.x rule:

- **patch** (0.1.0 → 0.1.1): a new component, new optional props or a fix; anything that keeps existing code working.
- **minor** (0.1 → 0.2): a breaking change that needs users to change their code. Ranges such as `^0.1.0` do not pick it up on their own.

Merging the "chore: version packages" pull request that Changesets opens stages the version on npm; it goes live once a maintainer approves it with 2FA under **Staged Packages** on npmjs.com.

## License

[MIT](LICENSE)
