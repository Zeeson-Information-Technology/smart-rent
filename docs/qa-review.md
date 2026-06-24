# SmartRent QA Review Notes

Date: 2026-06-24

## Route Coverage

Public routes reviewed for presence in the App Router:

- `/`
- `/features`
- `/about`
- `/contact`
- `/privacy`
- `/terms`
- `/security`
- `/login`
- `/register`

Protected routes reviewed for presence in the App Router:

- `/dashboard`
- `/properties`
- `/properties/new`
- `/properties/[id]`
- `/properties/[id]/edit`
- `/tenancies`
- `/tenancies/new`
- `/tenancies/[id]`
- `/tenancies/[id]/edit`
- `/my-tenancy`
- `/issues`
- `/issues/new`
- `/issues/[id]`
- `/messages`
- `/messages/[id]`
- `/disputes`
- `/disputes/new`
- `/disputes/[id]`
- `/notifications`
- `/reports`
- `/profile`
- `/settings`

## Stabilization Updates

- Added a shared dashboard loading skeleton component.
- Applied loading skeletons to properties, tenancies, issues, and disputes lists.
- Added confirmation before deleting notifications.
- Added development seed data script for repeatable demo setup.
- Added testing and screenshot evidence checklists for Chapter 4.
- Updated README with setup, seed, QA, security, and deployment guidance.

## Security Review

- Middleware protects dashboard, property, tenancy, issue, message, dispute, notification, report, profile, settings, document, and user routes.
- API routes validate authenticated sessions before returning protected data.
- Role-specific access is enforced server-side for landlord, tenant, and admin workflows.
- Landlord APIs scope property, tenancy, issue, dispute, and dashboard data to owned properties.
- Tenant APIs scope tenancy, issue, dispute, message, notification, and dashboard data to assigned records.
- Evidence upload validates file type and size server-side before Cloudinary upload.
- Notification APIs restrict all read, update, and delete operations to the current user.
- Server-only secrets remain in `.env.local` and are not exposed as `NEXT_PUBLIC_*` variables.

## Remaining Manual QA

Run the checklist in `docs/testing-checklist.md` using the seeded demo users. Capture screenshots listed in `docs/screenshot-checklist.md` after data has been seeded and the app is running locally.
