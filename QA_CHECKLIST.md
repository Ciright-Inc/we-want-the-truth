# QA Checklist — We Want The Truth

Use this list for regression and release sign-off. Mark items Pass/Fail/NA.

## Automated (local)

- [ ] `npm test` — tenant guard utilities (`tests/tenant-guard.test.ts`).
- [ ] `npm run build` — typecheck + lint + compile.
- [ ] `npx prisma validate` — schema valid.

## Tenant and domain

- [ ] `npx prisma db seed` creates `beanvspenn` and `cirightvscentili` with domains and case matter.
- [ ] `TENANT_HOST_MAP` documented; production host rewrites match internal `/t/[slug]` routes.
- [ ] `GET /api/domain/search?domain=` returns stub availability JSON.

## Auth and roles

- [ ] Super admin can sign in at `/super-admin/login` and open `/super-admin` and `/super-admin/tenants`.
- [ ] Non–super-admin cannot access `/super-admin` (middleware 302 to login or 403).
- [ ] Tenant admin can sign in at `/t/{slug}/admin/login` and open dashboard.
- [ ] Tenant admin cannot open `/t/{other}/admin` (403).
- [ ] Public user can register on `/t/{slug}/register` with terms checkbox; duplicate email returns 409.
- [ ] Public user can log in on `/t/{slug}/login` with `tenantSlug` credential binding.

## Public case site (`/t/{slug}`)

- [ ] Case summary from admin/DB renders with **paragraph breaks** (`SummaryParagraphs`).
- [ ] `GET /api/tenants/{slug}/public` returns JSON aligned with the same Prisma read path as the page.
- [ ] Page view POST increments counts (rate limited); tracker fires once per load.
- [ ] Timeline cards use **5-line clamp** when collapsed; Expand/Collapse works.
- [ ] “View full window” opens modal with full text and preserved paragraphs.
- [ ] Timeline item with `videoUrl` shows play/video affordance and **video plays** in card/modal.
- [ ] Video play POST logs `video_id`, `timeline_item_id`, `tenant_id`, user or anonymous session, `seconds_watched`, `completed`.

## Jury

- [ ] Voting requires login; unauthenticated user redirected to login with callback.
- [ ] Vote can be changed (upsert same user + matter).
- [ ] Plaintiff selection uses **green** emphasis; defendant uses **red**; undecided neutral.
- [ ] Aggregate totals respect `showAggregateVotes` and `publicJuryEnabled`.
- [ ] Disclaimer text visible: opinion only, not legal verdict.

## Comments

- [ ] Comment POST rejected when Comment Management add-on inactive (403) — verify on `cirightvscentili`.
- [ ] Comment POST accepted when add-on active — verify on `beanvspenn`; pending vs approved follows `commentModerationDefault`.
- [ ] Only approved comments appear on public page.

## Admin

- [ ] Dashboard metrics match DB counts (views, documents, timeline, evidence, plays, jury breakdown).
- [ ] Comments and Video admin tabs show **upgrade prompt** when add-ons inactive.
- [ ] Sidebar hidden on `/t/{slug}/admin/login`.

## Super admin

- [ ] Overview counts tenants/users/page views.
- [ ] Tenant table lists domains and subscription add-on counts.

## Stripe

- [ ] With keys set, `POST /api/stripe/checkout` returns session URL.
- [ ] Webhook verifies signature; unknown events ignored safely.
- [ ] `customer.subscription.deleted` deactivates add-ons in DB (billing cancellation does not delete tenant content).

## Security

- [ ] Tenant isolation on presign, comments, jury, video-play, page-view APIs.
- [ ] Rate limits return 429 under abuse simulation (adjust thresholds as needed).
- [ ] Audit log entry created on jury vote (sample).

## S3 / files

- [ ] Presign rejects disallowed MIME types.
- [ ] Presign returns 501 when `S3_BUCKET` unset.

## Mobile / UI

- [ ] Marketing and tenant pages usable at 375px width (no horizontal scroll for primary content).
- [ ] Touch targets adequate on primary CTAs.

## GDPR / privacy

- [ ] Privacy page documents rights, deletion/export intent, Stripe, storage, public warning.
- [ ] Terms include disclaimers, ownership, non-liability, takedown, moderation, subscriptions, refunds, domains.
