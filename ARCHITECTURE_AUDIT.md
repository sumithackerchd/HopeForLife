# HopeForLife Architecture Audit

## 1. Authentication & Role Checking
- **Singleton AuthContext**: The application implements exactly one `AuthProvider` encapsulating all Supabase session state management.
- **Robust Role Resolution**: Role checking is decoupled from JWT metadata and correctly queries the definitive `public.profiles.role` column, mitigating stale claim vulnerabilities.
- **Admin Guarding**: `RouteGuard` implements a strict authorization barrier protecting all `/admin/*` routes. Admin dashboard access validates both authentication presence and `isAdmin === true`.

## 2. Router & Layout Hierarchy
- **Explicit Nested Routing**: `App.tsx` has been sanitized to implement explicit React Router nested routes under `/admin`, fully bound to `AdminLayout`. This eliminates unmounting issues, 404 loops, and the "forever loading" bug by ensuring children map properly into the `<Outlet />`.
- **Async Loading Constraints resolved**: Suspense boundaries now wrap sub-components to handle dynamic lazy loading without stalling rendering.

## 3. Campaign Loading & State Verification
- **Dynamic Search Params**: The donation page securely isolates the campaign context via `useSearchParams()`.
- **Query Hardening**: The Supabase fetch correctly requests `eq('status', 'published')`, filtering out drafts.
- **Graceful Error States**: Missing or invalid campaign slugs successfully trigger a fallback UI instead of crashing React.

## 4. Payment Integrations
- **Razorpay Payload Sync**: Edge function cleanly maps to the `campaign_id`, recording valid transaction telemetry across backend endpoints.
