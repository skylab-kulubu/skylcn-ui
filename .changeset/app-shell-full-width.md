---
'@skylab-kulubu/skylcn-ui': patch
---

AppShell no longer holds a page to a 1600px reading width: every page takes the content panel's full width, as list pages in AppShellFill already did. A page that reads better narrow sets its own max-width.
