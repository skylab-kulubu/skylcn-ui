---
'@skylab-kulubu/skylcn-ui': patch
---

`TabsNav` gives a page tabs that are links to its own sub-routes: the open route carries `aria-current="page"`, links go through the provider's link component, and on a narrow screen the row scrolls with the open tab kept in view. `PageHeader` takes three optional slots for detail pages: `back` (a link up to the parent page), `cover` (a picture before the title) and `tabs` (a `TabsNav` in place of the divider).
