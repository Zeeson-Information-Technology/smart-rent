# SmartRent QA and Research Testing Guide

This guide is for research reviewers and QA testers validating SmartRent for dissertation evidence and production readiness. It should be used together with:

- `docs/testing-checklist.md`
- `docs/screenshot-checklist.md`
- `docs/qa-review.md`

## 1. Testing Objective

Validate that SmartRent supports the required landlord, tenant, and admin workflows:

- public website navigation
- account registration and login
- role-based route protection
- property CRUD
- tenancy CRUD and tenant assignment
- issue reporting and smart priority assignment
- evidence upload and deletion
- issue-linked messaging
- dispute creation and status tracking
- in-app notifications
- real dashboard analytics

## 2. Test Environment

Recommended local environment:

- Node.js 20 or later
- npm
- MongoDB Atlas test database
- Cloudinary test account
- Local app URL: `http://localhost:3000`

Required environment variables:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<32+ character test secret>
MONGODB_URI=<MongoDB Atlas test database URI>
CLOUDINARY_CLOUD_NAME=<Cloudinary cloud name>
CLOUDINARY_API_KEY=<Cloudinary API key>
CLOUDINARY_API_SECRET=<Cloudinary API secret>
```

Do not use production database credentials during QA unless the test is explicitly a production smoke test.

## 3. Initial Setup

Run:

```bash
npm install
npm run seed
npm run dev
```

The seed script creates repeatable demo data for landlord, tenant, and admin workflows.

## 4. Demo Accounts

| Role | Email | Password | Primary Use |
| --- | --- | --- | --- |
| Landlord | `landlord@smartrent.demo` | `Password123!` | Property, tenancy, issue review, dispute status, messages, dashboard |
| Tenant | `tenant@smartrent.demo` | `Password123!` | My tenancy, issue reporting, evidence upload, messages, disputes |
| Admin | `admin@smartrent.demo` | `Password123!` | Platform-wide dashboard and administrative access review |

## 5. Automated Test Commands

Run these before manual testing:

```bash
npm run test
npm run typecheck
npm run lint
npm run build
```

Record results in `docs/testing-checklist.md`.

Expected result:

- tests pass
- TypeScript has zero errors
- lint has zero warnings/errors
- production build completes

## 6. Public Website Manual Tests

Open each route and verify:

- page loads without console errors
- navigation links work
- layout is responsive on desktop and mobile
- footer links work
- content matches SmartRent branding

Routes:

| Route | Expected Result |
| --- | --- |
| `/` | Landing page loads with hero, features, preview, FAQ, CTA, footer |
| `/features` | Features page loads and navigation remains usable |
| `/about` | About page loads |
| `/contact` | Contact page loads |
| `/privacy` | Privacy page loads |
| `/terms` | Terms page loads |
| `/security` | Security page loads |
| `/login` | Login form loads |
| `/register` | Register form loads |

## 7. Contact Form Backend Test

Use the public `/contact` page before logging in.

Valid submission:

1. Open `/contact`.
2. Enter a valid name, email address, and message of at least 10 characters.
3. Select `Send message`.
4. Confirm a success message appears.
5. Confirm the request to `/api/contact` returns `201`.
6. Confirm the message exists in MongoDB in the `contactmessages` collection.

Invalid submission:

1. Open `/contact`.
2. Enter a valid name.
3. Enter an invalid email address.
4. Enter a message shorter than 10 characters.
5. Select `Send message`.
6. Confirm validation errors are shown.
7. Confirm no message is saved.

## 8. Authentication Tests

| Scenario | Steps | Expected Result |
| --- | --- | --- |
| Register landlord | Go to `/register`, create a landlord account | Redirects to `/login?registered=1`; success message appears |
| Register tenant | Go to `/register`, create a tenant account | Redirects to `/login?registered=1`; success message appears |
| Duplicate registration | Register using an existing email | Clear duplicate email error |
| Login | Login with demo credentials | Redirects to `/dashboard` |
| Logout | Use dashboard user menu logout | Redirects to `/login` |
| Route protection | Open `/dashboard` while logged out | Redirects to `/login` |
| Auth route redirect | Open `/login` while logged in | Redirects to `/dashboard` |

## 9. Role-Based Access Tests

| Role | Allowed | Blocked |
| --- | --- | --- |
| Landlord | `/dashboard`, `/properties`, `/tenancies`, `/issues`, `/messages`, `/disputes`, `/reports`, `/profile`, `/notifications` | Tenant-only `/my-tenancy` workflow should not expose unrelated records |
| Tenant | `/dashboard`, `/my-tenancy`, `/issues`, `/messages`, `/disputes`, `/documents`, `/profile`, `/notifications` | `/properties/new`, `/tenancies/new`, property edit, tenancy edit |
| Admin | Platform-wide dashboard, users, properties, issues, disputes, reports, profile | No tenant/landlord private data should be editable without intended admin route support |

## 10. Landlord Workflow Tests

1. Login as landlord.
2. Open `/dashboard`.
3. Verify real counts for properties, tenancies, issues, disputes, and messages.
4. Open `/properties`.
5. Create a property from `/properties/new`.
6. Open the new property details page.
7. Edit the property.
8. Delete the property and confirm the confirmation prompt appears.
9. Open `/tenancies`.
10. Create a tenancy for an owned property.
11. Open tenancy details and edit tenancy.
12. Open `/issues` and verify tenant-reported issues are visible.
13. Update issue status.
14. Open `/messages` and reply to a tenant.
15. Open `/disputes` and update dispute status/resolution notes.
16. Open notification bell and verify relevant notifications display.

## 11. Tenant Workflow Tests

1. Login as tenant.
2. Open `/dashboard`.
3. Verify active tenancy, open issues, active disputes, and unread messages.
4. Open `/my-tenancy`.
5. Open `/issues/new`.
6. Create issue with category `Water Leak`.
7. Verify priority is automatically assigned as `High`.
8. Upload a supported image or PDF as evidence.
9. Attempt unsupported upload type and verify rejection.
10. Send issue-linked message to landlord.
11. Raise dispute from issue details.
12. Open `/notifications` and verify notifications can be marked read/deleted.

## 12. Admin Workflow Tests

1. Login as admin.
2. Open `/dashboard`.
3. Verify total users, landlords, tenants, properties, tenancies, issues, and disputes.
4. Open accessible admin navigation items.
5. Confirm admin data is platform-wide.
6. Confirm no server errors appear when loading pages.

## 13. API and Security Tests

Use browser behavior first, then optional API tools if available.

| Test | Expected Result |
| --- | --- |
| Logged-out request to protected page | Redirects to `/login` |
| Logged-out API request to protected API | Returns `401` |
| Tenant opens landlord-only create route | Blocked or redirected |
| Landlord requests another landlord record | Returns `403` or `404` |
| Notification API with another user's id | Returns `404` or no mutation |
| Evidence upload over 10 MB | Rejected |
| Unsupported evidence file type | Rejected |
| External callback URL on login | Redirects safely to `/dashboard` or internal route |
| Public contact API with invalid payload | Returns `400` with field validation errors |
| Public contact API with valid payload | Returns `201` and stores a contact message |

## 14. Full Research Walkthrough

Recommended order for research or stakeholder demonstration:

1. Visit `/` and review landing page proposition.
2. Open `/features`, `/about`, `/security`, `/privacy`, and `/terms`.
3. Open `/contact` and submit a valid enquiry.
4. Register a landlord account.
5. Log in as landlord and review dashboard.
6. Create a property.
7. Create a tenancy for a tenant email.
8. Log out.
9. Register or log in as tenant.
10. Open `/my-tenancy`.
11. Create an issue.
12. Confirm smart priority assignment.
13. Upload evidence.
14. Send a message about the issue.
15. Raise a dispute from the issue.
16. Log in as landlord and review the issue, message, dispute, and notifications.
17. Update issue and dispute status.
18. Review dashboard analytics updates.
19. Capture screenshots listed in `docs/screenshot-checklist.md`.

## 15. Screenshot Evidence

Capture screenshots listed in `docs/screenshot-checklist.md`.

Recommended format:

```txt
chapter4/<screenshot-id>-<screen-name>.png
```

Example:

```txt
chapter4/SS-005-landlord-dashboard.png
```

## 16. Console and Network Checks

For every major page:

1. Open browser developer tools.
2. Check Console tab.
3. Check Network tab for failed requests.
4. Record any failed request URL, status code, and visible error message.

Expected result:

- no hydration errors
- no uncaught client exceptions
- no unexpected `500` API responses
- no broken static assets

## 17. Bug Report Template

Use this format when reporting issues:

```md
## Bug Title

Role:
Browser:
Route:
Test ID:

Steps to Reproduce:
1.
2.
3.

Expected Result:

Actual Result:

Console Errors:

Network Errors:

Screenshot/Video:

Severity:
Low / Medium / High / Critical
```

## 18. Completion Criteria

Testing is complete when:

- all automated commands pass
- all checklist rows are marked Pass or documented with known issues
- screenshots are captured
- no critical or high severity defects remain
- production build succeeds
- login, registration, CRUD, uploads, messaging, disputes, notifications, and dashboards work for the correct roles
