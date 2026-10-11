# @skylab-kulubu/skylcn-ui

## 0.1.6

### Patch Changes

- 3270c47: Notice takes an `icon` in place of its tone's own, such as a calendar for a deadline; the icon keeps the tone's colour, and without one the tone's icon stays.
- 9eeecf5: The focus ring reads at 3:1 or more on every surface, card washes and hovered controls included: `--ring` goes from 40% to 60% in the dark theme and to an opaque lilac one step darker than the primary colour in the light theme, where it sat under 2:1, so it also stays apart from a primary button or a selected day. A test reads the tokens and checks it, so a surface that overrode the ring for contrast, such as the Keycloak theme, can drop that override.
- 5f05253: StateCard's title is a heading now, an `h2` by default and `level={3}` or `4` inside a section with its own, so a screen reader's heading list reaches an empty, error or permission state; it looks as before, and a card without a title renders no empty heading.
- 0280c68: `TabsNav` gives a page tabs that are links to its own sub-routes: the open route carries `aria-current="page"`, links go through the provider's link component, and on a narrow screen the row scrolls with the open tab kept in view. `PageHeader` takes three optional slots for detail pages: `back` (a link up to the parent page), `cover` (a picture before the title) and `tabs` (a `TabsNav` in place of the divider).
- 5391b2b: `TaskPage` is the frame of a page with one job, such as a sign-in, a door check-in, a certificate check or an account deletion status: the SKY LAB mark on top, the task with its title (the page's one `h1`), description, body and actions, and small links under it. It is centred on a card from `sm` up and fills the width on phones. `icon`, `tone` and `loading` show a state the way `StateCard` does, with the heading read once when a loading state turns into its result; `as="div"` draws it inside a page that already has its main landmark.

  `SkylabMark` moves to its own module, still exported as before, so `sources/task-page.css` and `sources/skylab-mark.css` do not scan the app shell.

- 7eb234b: Add `theme-base.css` and `sources/<component>.css` so an app that renders a few components ships only their CSS. `theme.css` still has Tailwind scan every component (about 17 KB gzip); `theme-base.css` is the same theme without any component, and each `sources/*.css` points Tailwind at one component and the files it imports. An app with Button, NavigationMenu and Drawer goes from about 17 KB to about 8 KB. `theme.css` keeps working as before.

## 0.1.5

### Patch Changes

- fbbab0d: A Button rendered as a link (`render={<a href />}` or a router `Link`) now stays a link: it no longer goes through Base UI's Button, which gave it `role="button"`, so screen readers announce a link with its address. It keeps the button's look and the link's own classes and click handler; `disabled` or `pending` marks it `aria-disabled`, takes it out of the tab order and blocks the click. Pass `nativeButton` to opt back into Base UI's behaviour.

## 0.1.4

### Patch Changes

- 8aed07e: SkylabLoader now lights the mark the way Fatih Naz's forms-frontend loader does: seven groups from the centre out, a shimmer band and a soft halo from 32px, and a diagonal glint along a steel outline from 64px. It never fades below 20% (30% on the light theme), runs a 2.4s cycle in CSS only and holds still under reduced motion. The root is now a `span` that holds the mark; `size`, `state` and `className` work as before.

## 0.1.3

### Patch Changes

- 7549317: Avatar initials sit on a faint tone of their own, picked from the person's name or e-mail, so people in a list tell apart at a glance; `avatarTone` is exported for anything that wants the same tone.
- 2a46fef: A club console's description in the brand switcher wraps onto a second line instead of being cut off.
- 5163227: AppShell's content area is positioned, so a Sparkline or an animated number below the fold no longer stretches the page into a second, empty scroll on wide screens.

## 0.1.2

### Patch Changes

- a51eadc: Calendar's title opens the months of the year, then the years of the decade and the decades of the century, so far dates are a few clicks away; DatePicker and DateTimePicker keep their min and max in these views and in the month arrows.

## 0.1.1

### Patch Changes

- 118b0d2: AppShell closes the phone menu when the window widens to the desktop layout, so the page never stays behind a hidden drawer.
- 14b52cc: Charts take an `emptyMessage` for their empty state, DonutChart can drop its card with `framed={false}`, and a donut whose slices are all zero shows the empty state instead of a blank ring. An empty chart no longer shows its legend or the table switch.
- 50fad43: Add DateTimePicker, a day and a time in one field for things like an event's start.
- c9c7349: The entry points resolve under the `default` condition, so tools that do not ask for `import`, such as Jest, find the package.
- 9ffa894: SidebarGroup takes a `storageKey` to remember whether it was left open, and the Ctrl/⌘+K shortcut no longer fires while typing in a field, as its description promised.
- e2b151d: Content leaving a Swap (a list turning into its loading state, say) can no longer be clicked or focused while it fades out.

## 0.1.0

### Minor Changes

- First release: tokens, dark and light themes, and the components, charts and data table SKY LAB's products share.
