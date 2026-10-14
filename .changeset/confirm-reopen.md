---
'@skylab-kulubu/skylcn-ui': patch
---

ConfirmDialog starts clean on every opening, also when a parent sets `open` again, so an earlier failure no longer shows; an answer that arrives after the reader left a stalled dialog no longer leaves the action pending on the next opening. A parent's `pending` now stalls like an async action, so Cancel never stays locked for good. New `stallMessage` gives the stall line per dialog, and a failure moves the keyboard to Cancel.
