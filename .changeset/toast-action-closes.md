---
'@skylab-kulubu/skylcn-ui': patch
---

A toast with an action, such as an undo, now closes once the action is taken, so it no longer says the deed is done; calling `preventDefault()` in the click keeps it open.
