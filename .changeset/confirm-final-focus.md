---
'@skylab-kulubu/skylcn-ui': patch
---

ConfirmDialog takes `finalFocus`, Base UI's own prop, for where focus goes when it closes; `false` leaves focus alone, for an action that also closes the drawer under it and lets the drawer hand focus elsewhere. Without it focus returns to the trigger as before.
