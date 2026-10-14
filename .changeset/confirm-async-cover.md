---
'@skylab-kulubu/skylcn-ui': patch
---

ConfirmDialog takes an async `onAction`: the dialog stays open with the action pending and Cancel locked until it settles, closes on success and says why inside on a throw (`failureMessage`). If nothing answers within `stallAfter` (25 seconds) it says so and lets the reader leave; a refusal that arrives later goes to `onLateFailure`, for an error toast. A double click runs the action once. New `CoverImage` shows a poster or cover whole in a 16:9 (or square, wide, portrait) frame over a blurred copy of itself, so square and tall posters never leave a grey band; it carries no inline style.
