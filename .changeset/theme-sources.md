---
'@skylab-kulubu/skylcn-ui': patch
---

Add `theme-base.css` and `sources/<component>.css` so an app that renders a few components ships only their CSS. `theme.css` still has Tailwind scan every component (about 17 KB gzip); `theme-base.css` is the same theme without any component, and each `sources/*.css` points Tailwind at one component and the files it imports. An app with Button, NavigationMenu and Drawer goes from about 17 KB to about 8 KB. `theme.css` keeps working as before.
