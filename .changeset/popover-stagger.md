---
'@skylab-kulubu/skylcn-ui': patch
---

PopoverContent takes stagger: its direct children step in one after another from the trigger's side and, on closing, back out the farthest first, the way the account menu's rows do. The panel itself then only fades, without the popups' growth.
