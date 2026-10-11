---
'@skylab-kulubu/skylcn-ui': patch
---

`TaskPage` is the frame of a page with one job, such as a sign-in, a door check-in, a certificate check or an account deletion status: the SKY LAB mark on top, the task with its title (the page's one `h1`), description, body and actions, and small links under it. It is centred on a card from `sm` up and fills the width on phones. `icon`, `tone` and `loading` show a state the way `StateCard` does, with the heading read once when a loading state turns into its result; `as="div"` draws it inside a page that already has its main landmark.

`SkylabMark` moves to its own module, still exported as before, so `sources/task-page.css` and `sources/skylab-mark.css` do not scan the app shell.
