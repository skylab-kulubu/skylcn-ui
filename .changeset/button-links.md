---
'@skylab-kulubu/skylcn-ui': patch
---

A Button rendered as a link (`render={<a href />}` or a router `Link`) now stays a link: it no longer goes through Base UI's Button, which gave it `role="button"`, so screen readers announce a link with its address. It keeps the button's look and the link's own classes and click handler; `disabled` or `pending` marks it `aria-disabled`, takes it out of the tab order and blocks the click. Pass `nativeButton` to opt back into Base UI's behaviour.
