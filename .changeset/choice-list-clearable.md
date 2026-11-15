---
'@skylab-kulubu/skylcn-ui': patch
---

ChoiceList takes `clearable` for a single answer that can be taken back: pressing the chosen option again, or Space on it, calls `onValueChange(null)`, so an optional question can be left empty again.
