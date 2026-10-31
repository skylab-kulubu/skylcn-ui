# @skylab-kulubu/skylcn-ui

## 0.2.2

### Patch Changes

- 0b4dafc: New ActivityHeatmap draws days as small squares in week columns, darker the busier, such as attendance over a term or a member's activity. Screen readers hear the total and the busiest day, the arrow keys move along the days while a line under the chart reads the one in focus, and the grid needs no inline style.
- f695763: New CodeBlock shows code with its filename, line numbers, highlighted lines and a copy button, coloured by each language's own light rules with no dependency: JSX tags and props in tsx, keys in json and yaml, properties and at-rules in css, commands, flags and variables in bash, and the keywords and comments of python, go, sql and html, in new `--code-*` colour tokens that keep 4.5:1 in both themes. New CodeComparison sets two versions side by side and marks the lines that went and came, also in words for screen readers; `diffLines` and `tokenizeCode` are exported for other uses.
- 0b4dafc: ConfirmDialog eases its height when an error or a stall note appears instead of jumping, and `DialogBody animateHeight` does the same for a dialog whose content changes, such as a step that swaps in a longer form. Under reduced motion the height still changes at once.
- 0b4dafc: Menus and context menus light the highlighted row with one background that slides from row to row, by pointer or arrow keys, instead of each row lighting up on its own. It lands on the first row in place, takes the destructive tint on destructive rows and jumps under reduced motion.
- 0b4dafc: New OverflowActions keeps as many actions as fit as buttons, in order of importance, and moves the rest into a "⋯" menu at the row's end, so a page header or bulk bar never wraps or spills on a narrow screen. It measures every button out of sight and follows the row's width.
- 133e196: The sidebar slides without stalling on heavy pages: while the panel moves, the page inside holds the width it will end at, so it lays out once instead of on every frame of the slide, and lets go when the slide ends. Reduced motion and phones are untouched.
- 0b4dafc: New RelativeTime says a moment from now, such as "3 saat önce" or "yarın", in the provider's language, kept current by one shared 30-second clock, with the full date and time in a Tooltip on hover (`tooltip` picks the side, `false` uses the title) and the exact moment in its `datetime`. `formatRelativeTime` gives the same words as a string.
- 0b4dafc: New SaveStatus says where an autosaving form's last change stands beside the form: saving, saved for a moment, or failed until the next try, as a polite status line instead of a toast per change. The README's feedback rule names it.
- 133e196: The sidebar lights the row under the pointer with one background that slides from row to row, as menus now do, instead of each row lighting up on its own. Its labels slide a step as they fade into the rail, rows give a little when pressed, and a click along the sidebar's unmarked edge opens or closes it. Menus and the sidebar share the sliding background through one helper.
- aad17d6: DataList: a third press on a sorted column header leaves the rows unsorted, in the order they came, after the first direction and its reverse. `nextDataListSort(current, field, first?)` gives the same cycle to a list that keeps its own sort, and `sort` takes `null` for no sort.
- 0b4dafc: New SortableList puts a list in order by dragging each row by its handle, or with the up and down arrow keys on the focused handle. The other rows glide out of the way with the lazily loaded motion layout, Esc puts a dragged row back, and the new place is said to screen readers.
- f695763: Tree takes `files`, which gives branches a folder that opens with them and leaves an icon by their extension, and `guides`, which draws a line down each level. Rows are indented by a step per level instead of an inline padding, so the tree no longer sets any inline style.

## 0.2.1

### Patch Changes

- 3a25bf2: The animation features (motion's domMax, about 38 KB gzipped) now load on demand after the first paint instead of in every app's first bundle; components draw at once with motion's light `m` and animate once the features arrive. Notice has its own module, so an app's per-component stylesheet for it no longer scans Meter, Progress and Separator. Page blocks come as a shadcn registry beside the package: sign-in, not-found, list-page, settings-page, form-page and dashboard, built from this package's components, added with `npx shadcn add` from `registry/r`.

## 0.2.0

### Minor Changes

- 37b0c17: Building blocks for forms people fill in: box controls in three sizes set once with ControlSizeProvider, Field as a numbered question, ChoiceList, ChoiceMatrix, FileUpload and TimePicker, Combobox and Select that create, search and pick several, and a ConfirmDialog that spells out what happens.

### Patch Changes

- 4617cf0: A pending Button centres its SkylabLoader again; the loader had no size, so it stretched over the button and its mark sat in the top-left corner.
- 2ff14a7: New CheckboxCard and RadioCard draw an option as a bordered row, and new ChoiceList lays out a question's options as cards: round marks take one answer, square marks (`multiple`) several. The cards stand as tall as the box controls of their size, and a checked radio fills with the brand purple like a checked checkbox.
- ae66d70: New ChoiceMatrix asks rows by columns: one choice per row with radios, or several with `multiple`, a clear button on each answered row, only the unanswered rows marked while invalid, and each row stacked with its choices on phones.
- 54527e6: Combobox can create what was typed (`onCreate`), search on the server (`onSearch`, `loading`), show a locked value (`readOnly`) and take several picks as removable chips (`multiple`); MultiSelect is now Combobox multiple under its old name. Combobox and NumberField take `size`. The list rises in order as it opens and eases its height as a search narrows it.
- 5978f42: ConfirmDialog lists what happens (`consequences`) beside what stays (`unaffected`), can ask for a typed phrase (`confirmText`) that ticks once it matches and confirms on Enter, and can hold its action for `delay` seconds behind a draining line. It takes an `icon` in a new header band with a close button, opens wide when it carries a summary or a phrase, and rises as a sheet on phones.
- c181f54: ConfirmDialog takes `finalFocus`, Base UI's own prop, for where focus goes when it closes; `false` leaves focus alone, for an action that also closes the drawer under it and lets the drawer hand focus elsewhere. Without it focus returns to the trigger as before.
- 69c066a: Box controls come in three sizes: sm 32px, md 36px (the default) and lg 38px, taller on touch screens, set per control or once for a whole form with the new ControlSizeProvider. Input (`inputSize`), Textarea and SearchInput take them, with a see-through fill, rounder corners above sm and a lilac focus ring. Input grows from 32px to 36px by default.
- badb19a: Field takes `variant="question"` with `number`, `required` and `hint` for forms people fill in; Textarea counts its characters with `showCount`; read-only Inputs and Textareas are filled so they read as set; and errors use a softer red.
- c2d1744: New FileUpload and FileRow show files through the states the app sets: uploading with progress, scanning, ready, failed with retry and rejected, each removable. Dropzone gains a compact 64px variant, an invalid state, an id for a Field's label, a visible keyboard focus and a steady brand tint while a file is over it.
- 432b6a1: New FilterButton opens a filter panel and says how many filters are on; new ActiveFilters shows the filters that are on as chips that each take one off, with a way to clear them all.
- 5737ae1: IconButton shows its label in a Tooltip on hover and keyboard focus instead of the browser's title. `tooltip` picks the side, or `false` falls back to the title inside parts that bring their own.
- 466b838: The calendar moves like forms' calendar: months slide, the month and year views slide in vertically with a blur, and picker panels rise into place. Its header is a plain row, it always shows six weeks, the chosen day is tinted and today has a dot. New TimePicker picks hours and minutes from two columns; DateTimePicker uses the same columns; DatePicker gains Bugün and Temizle; and the picker triggers take `size` and a 26px `variant="pill"`.
- 83f36c7: `Section` can fold away by its title: `collapsible` turns the title into a button with a turning chevron, open by default, with `defaultOpen`, `open` and `onOpenChange` for control.
- ec9dfbc: Select takes `action`, a command row at the end of the list; `size`; a 26px `variant="pill"` for dense rows; and `multiple`, which ticks several options in a list that stays open and shows them as chips, or a count once they do not fit. Its list opens with the pickers' motion, rows rising in order.
- 3cabb4d: Slider takes `ends`, words under the two ends of the track, such as a scale's lowest and highest answer.
- 3538d32: A framed StatCard is now a compact tile with its mark beside the label and figure. `href` makes the whole figure a link, `dot` puts a state dot before the label and `valueTone` colours the figure.
- 4a3aaa7: Timeline marks are rounded squares with medium-weight titles; `marker` shows a number in the mark, `current` rings the step happening now, `upcoming` draws a step still to come dashed, and there is an `info` tone. Stepper steps take `uncertain` for a step that may not come.
- 0a22dae: A toast with an action, such as an undo, now closes once the action is taken, so it no longer says the deed is done; calling `preventDefault()` in the click keeps it open.
- 2eeefe4: ToggleRow shows its children under the row while the switch is on, such as the settings the switch unlocks, and takes `checkedTitle` for a row that says its state, such as consent.

## 0.1.11

### Patch Changes

- bcddb32: `AppShellFill` lets a page take the content panel's full height from md, as a flex column, so a list scrolls inside it with its paging held at the foot; on phones the page scrolls as before.
- 62671aa: AppShell no longer holds a page to a 1600px reading width: every page takes the content panel's full width, as list pages in AppShellFill already did. A page that reads better narrow sets its own max-width.
- a164c1e: Avatar stays round by default, and the README says why: the shape tells a person from the rounded-square interface around it and from teams, groups and events in the same lists, faces and initials sit better in a circle, and it is what GitHub, Fluent, Atlassian and Linear do. `shape="square"` stays for a tile that stands for a team or a service. Where a round avatar sits among rounded squares it matches them in box size, border and ring tokens and vertical centre instead of changing shape. The sidebar's account row and AvatarGroup's "+N" are round too.
- b1db161: Area and line charts always show their first and last dates, pulled in from the plot's edges when they would spill, where the first one used to drop out. Their points are smaller and drop the outline in the card's colour, which showed as a halo once a chart sat outside its card. The first chart colour, which a single series takes, leans halfway to the brand's own lilac (`--chart-1` is `#dcbef2` in dark and `#8c5fc7` in light), so it reads on brand; BarList's first bar, the Sparkline dot and the first avatar tint follow it.
- 96a43ce: An unframed chart (`framed={false}`) heads itself like a Section: a quiet title with its badge, a hairline running to the table switch and any actions, and the description under that row. Framed charts are unchanged.
- 90aa2eb: A chart's loading skeleton is now as tall as its plot, so nothing below it moves when the data arrives, such as a chart drawn a moment later inside a panel that is opening.
- d5fe092: DataList draws itself from `rows` and column definitions: give each column its `header` (or a spoken `label`), `cell`, `sortable`, `interactive` and `className`, and the header, rows, skeleton (`loading`) and empty state (`empty`) follow, in the columns' order; adding or dropping a column is one entry in the array. A column with a `sortValue` sorts the rows in place, text A to Z first, figures and dates largest first, empty values last either way, starting from `defaultSort` unless the page keeps `sort` itself; rows that arrive sorted, such as one page from a server, leave `sortValue` out. Rows link through `rowHref`, act through `onRowSelect` or open a panel across the list's width through `renderPanel`, with a chevron column at the start, `canExpand` per row and the open row's id kept by the list (`expandedId`, `onExpandedChange`) or by the page, such as in the address. `fill` lets the list take the height left in a flex column and scroll its rows under the header from md up. A column's `width` can change by breakpoint (`{ base: 'auto', lg: '5rem' }`). Column headers drop the spaced capitals for plain small text. A list now comes in as one quick, even wave when it first fills, top to bottom within 150ms however many rows there are, instead of 60ms a row with every row past the eighth landing at once; DataListBody numbers its rows itself, so `DataListRow`'s `index` does nothing and is deprecated. A list drawn from `rows` redraws a row only when its row, the columns or its open state change, so typing, opening a row or a parent's render leaves the other rows alone (keep `columns` stable and rebuild it when what the cells read changes); rows measure their places for the sort glide only when their order changes, and sorting reuses one collator. `useDataListPanelOpened` tells a panel's content when the panel has finished opening, so heavy content such as a chart can wait for it and the motion stays smooth; the headers are not drawn again when a row opens. Lists put together from parts keep working, and their `DataListHeader`, `DataListColumnHeader` and `DataListCell` now render nothing for a column the list does not have, so columns can come and go at run time; the row link moves past interactive columns instead of being clipped inside one. `DataListRow` takes `expanded`, `onExpandedChange` and `panel`, and now wraps its grid row and panel in one element, which takes the row's `className`, `style` and other props. New parts: `DataListActions` for quick actions that open out on hover or focus where there is a mouse and always show on touch screens (`hoverFrom` to start at a breakpoint), `DataListTitle` for a title with a line under it and an icon or avatar before it, `DataListExpander` for the chevron, and `DataListFooter` for the count and paging under a list, which stays at the bottom of the screen while a long list scrolls.
- b076499: Hovered and open rows in DataList, List and DataTable now stand out in the light theme as clearly as in dark. They take the new `--row-highlight` wash (`bg-row-highlight`) instead of the card's: 4% in light, where the card's 2% barely showed, and 3% in dark as before.
- 963c8de: The sidebar's active item is easier to find in the light theme. In light, its highlight is now a raised piece of the page with a hairline edge, where the grey one had sat too close to the hover wash; dark keeps its wash. The new `--sidebar-active` and `--elevation-sidebar-active` tokens (`bg-sidebar-active`, `shadow-sidebar-active`) control it. An active item one level down, which has no highlight under it, now takes the brand colour for its label as well as its icon.
- dbe7086: SkylabLoader takes a `variant`: `reveal`, the default, as before; `radiate`, the loader before 0.1.4, lighting each path by its distance from the centre; and `pulse`, the whole mark breathing, for small quiet places. All three are CSS only with no inline style and hold still under reduced motion.
- a7d1f89: PageHeader draws its divider beside the title instead of under it, the way a Section draws its rule, so a page title and the sections under it read alike. The actions now sit at the end of that row, after the divider, with the description and meta under it; with tabs there is still no divider.
- 2867285: `Section` divides a page into regions without a frame: a title, a hairline running to the end of its header and an optional action such as a link or button, then the content. It groups a dashboard by space and lines where a Card would box each part. Size it like any box; given a height, its content takes what the header leaves.
- 8dffecb: The account row is smaller and squarer: a 28px rounded-square avatar on the icon column, the name and a second line in plain case, its menu opening upwards from the foot of the sidebar. Collapsing to the rail and back no longer remounts the sidebar: every icon keeps its place on one column, the text fades out before the width moves and fades in as it lands, and groups fold with the sidebar and unfold with the text in CSS alone, with no measuring from script mid-animation; only the parts that look different on the rail render again. A remembered collapsed sidebar opens collapsed instead of animating shut, and with reduced motion the width and group heights change at once. SidebarItem takes `children`, a level of items under it, such as an open form's pages under the form. Menu labels, the account row's second line and section names drop the spaced capitals. The console menu loses its visible heading and keeps the name for screen readers. The account and console menus step their rows in from the trigger and back out to it, the farthest first, through the new `stagger-items` utility, then shrink into the trigger's corner. Popups (menus, tooltips, popovers) now animate their scale and slide as designed: the transition listed `transform`, which Tailwind 4's scale and translate utilities do not use, so both had jumped. Tooltip takes `onOpenChange`.
- 92f4bef: Collapse puts its content on a layer of its own while the height moves, from the first frame, so the content is painted once and only clipped as it opens or closes instead of painted again on every frame; the layer goes once it settles, keeping text crisp. It takes `onSettle`, called when the content has finished opening or closing. BarList, ProportionBar and AnimatedNumber share one number formatter per locale instead of building one for every figure, which made a panel full of bars slow to open and a running number build one each frame.
- b13f186: `StatCard` takes `framed={false}` to set a figure straight into a Section or a row of figures, without the card's border, fill and padding; its lines then sit closer, so each figure still reads as one. Its label is now plain text instead of letter-spaced capitals, framed or not, and so is the label of `Stat`, the figure beside a PageHeader's title.

## 0.1.10

### Patch Changes

- 4dd6cbf: ConfirmDialog takes an async `onAction`: the dialog stays open with the action pending and Cancel locked until it settles, closes on success and says why inside on a throw (`failureMessage`). If nothing answers within `stallAfter` (25 seconds) it says so and lets the reader leave; a refusal that arrives later goes to `onLateFailure`, for an error toast. A double click runs the action once. New `CoverImage` shows a poster or cover whole in a 16:9 (or square, wide, portrait) frame over a blurred copy of itself, so square and tall posters never leave a grey band; it carries no inline style.
- cfbb8b1: ConfirmDialog starts clean on every opening, also when a parent sets `open` again, so an earlier failure no longer shows; an answer that arrives after the reader left a stalled dialog no longer leaves the action pending on the next opening. A parent's `pending` now stalls like an async action, so Cancel never stays locked for good. New `stallMessage` gives the stall line per dialog, and a failure moves the keyboard to Cancel.

## 0.1.9

### Patch Changes

- 1430864: Fixes from moving account-center and SkyMail onto skylcn-ui. `useToast().add` keeps errors until closed and toasts with an action (an undo) for ten seconds; on phones an open dialog or drawer sits above the toasts so they never cover its buttons. SkylabLoader carries no inline style (CSP friendly). The focus ring stands off filled buttons by 2px. Notice reserves room for its close button only when it has one and takes `dismissLabel`. TaskPage passes `role`, `aria-*` and other attributes to its root. Textarea inside a Field takes the field's label. SidebarUser keeps an e-mail subtitle in its own case. The README shows `source(none)` with the per-component stylesheets, the feedback rule and the disabled-button note.

## 0.1.8

### Patch Changes

- 7cfa164: The chart colours `--chart-1` to `--chart-8` are now one lilac family, light and deep in turn, so every chart (multi-series bars, lines and areas included), ProportionBar, Sparkline and the avatars' initials take the club's colours. The eight distinct colours move to `--chart-categorical-1` to `8`; charts take them with `palette="categorical"` (now on AreaChart, LineChart and BarChart too). 0.1.7's `--chart-tone-1` to `5` stay as names for the first five.

## 0.1.7

### Patch Changes

- a6c6c67: Charts take forms-frontend's look. DonutChart draws its slices in one lilac family (new `--chart-tone-1…5` tokens, one set per theme), parted by small gaps, with a list beside the ring giving each slice's count and share; pointing at a slice or a row (or focusing the row) brings it forward and writes its share in the hole, and pressing a row hides the slice. `palette="categorical"` keeps the eight distinct colours for unrelated groups. BarList bars are thicker and the largest value is drawn in the deep tone. A lone series in BarChart, AreaChart and LineChart takes the light lilac, and a single-series BarChart brings the pointed bar forward and dims the rest; compact bars are wider.

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
