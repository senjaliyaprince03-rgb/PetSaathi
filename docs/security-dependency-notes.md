# Dependency security notes

## 2026-07-18 — Next.js bundled PostCSS advisory

`npm audit` reports three moderate entries that resolve to `next@15.5.20` bundling `postcss@8.4.31`, affected by `GHSA-qx2v-qp2m-jg93` (unescaped `</style>` during CSS stringification).

- The audit proposes downgrading Next.js to 9.3.3, which is not a safe or supported remediation for this Next.js 15 application.
- A scoped npm override to PostCSS 8.5.19 was tested and rejected because Next pins 8.4.31 exactly; npm left the dependency tree invalid.
- PetSaathi does not compile user-authored CSS or inject stored article HTML. CMS content is parsed into allowlisted paragraph, heading and list blocks and rendered as React text.
- Risk remains moderate and accepted temporarily pending an upstream Next.js release that updates its pinned PostCSS dependency.

Release owners must re-run `npm audit`, inspect `npm ls postcss next`, and remove this exception as soon as a compatible Next.js release provides PostCSS 8.5.10 or newer.
