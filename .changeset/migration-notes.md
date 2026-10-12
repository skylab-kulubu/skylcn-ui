---
'@skylab-kulubu/skylcn-ui': patch
---

Fixes from moving account-center and SkyMail onto skylcn-ui. `useToast().add` keeps errors until closed and toasts with an action (an undo) for ten seconds; on phones an open dialog or drawer sits above the toasts so they never cover its buttons. SkylabLoader carries no inline style (CSP friendly). The focus ring stands off filled buttons by 2px. Notice reserves room for its close button only when it has one and takes `dismissLabel`. TaskPage passes `role`, `aria-*` and other attributes to its root. Textarea inside a Field takes the field's label. SidebarUser keeps an e-mail subtitle in its own case. The README shows `source(none)` with the per-component stylesheets, the feedback rule and the disabled-button note.
