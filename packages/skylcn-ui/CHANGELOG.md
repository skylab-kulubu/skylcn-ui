# @skylab-kulubu/skylcn-ui

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
