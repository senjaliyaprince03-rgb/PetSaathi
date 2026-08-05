# Dependency security notes

## 2026-08-03 — PostCSS and Sharp advisories resolved

Both application production dependency audits currently report zero known vulnerabilities.

- The primary app uses compatible top-level PostCSS and Sharp releases with scoped npm overrides.
- The nested app pins Next.js 16.2.12, NextAuth 4.24.15, UUID 11.1.1, PostCSS 8.5.19 and Sharp 0.35.3.
- Both production builds passed after the dependency updates.

Release owners must re-run both production audits and builds on every lockfile change. No forced downgrade or broad audit fix is approved.
