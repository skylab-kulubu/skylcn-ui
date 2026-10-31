---
'@skylab-kulubu/skylcn-ui': patch
---

The animation features (motion's domMax, about 38 KB gzipped) now load on demand after the first paint instead of in every app's first bundle; components draw at once with motion's light `m` and animate once the features arrive. Notice has its own module, so an app's per-component stylesheet for it no longer scans Meter, Progress and Separator. Page blocks come as a shadcn registry beside the package: sign-in, not-found, list-page, settings-page, form-page and dashboard, built from this package's components, added with `npx shadcn add` from `registry/r`.
