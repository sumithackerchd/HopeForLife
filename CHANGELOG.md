# Changelog

## [1.0.0]
### Fixed
- Fixed unmounting/re-mounting bugs in Admin Dashboard by correctly nesting router configurations and importing `AdminLayout`.
- Resolved Vite HMR 504 Gateway Timeouts by force-pre-bundling `@radix-ui` dependencies in `vite.config.ts`.
- Replaced dynamic lazy loading with static imports for critical views (like `Donate.tsx` and the `NotFound` fallback) to prevent remote chunk resolution errors.
- Consolidated `supabase` initialization by deleting duplicate `src/db/supabase.ts` implementations, enforcing the singleton in `src/lib`.
- Fixed Admin signout placement in sidebar configuration.
### Added
- Created formal `.md` audit tracking documents for post-deployment monitoring.
