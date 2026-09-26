# SmartRent Testing Checklist

Use this checklist during final QA and Chapter 4 evidence collection. Record the actual result and status after each manual or automated test run.

| Test ID | Module | Test Scenario | Expected Result | Actual Result | Status |
| --- | --- | --- | --- | --- | --- |
| QA-001 | Authentication | Register a new landlord with valid first name, last name, email, password, and role | Account is created, user is redirected to `/login`, and success message is shown | Pending | Pending |
| QA-002 | Authentication | Register with an existing email | Registration is rejected with a clear duplicate email error | Pending | Pending |
| QA-003 | Authentication | Login with valid demo landlord credentials | User is redirected to `/dashboard`; session contains id, name, email, and role | Pending | Pending |
| QA-004 | Authentication | Login with invalid credentials | Login remains on `/login` and displays a clear error | Pending | Pending |
| QA-005 | Authentication | Logout from dashboard topbar/user menu | Session ends and user is redirected to `/login` | Pending | Pending |
| QA-006 | Route Protection | Open `/dashboard` while logged out | User is redirected to `/login` | Pending | Pending |
| QA-007 | Role Access | Open `/properties/new` as tenant | Tenant is blocked from property creation | Pending | Pending |
| QA-008 | Properties | Create a property as landlord | Property is saved and appears in `/properties` | Pending | Pending |
| QA-009 | Properties | Edit a landlord-owned property | Updated values persist and show on property details | Pending | Pending |
| QA-010 | Properties | Delete a landlord-owned property | Confirmation appears; after confirm, property is removed | Pending | Pending |
| QA-011 | Tenancies | Create tenancy for landlord-owned property | Tenancy is saved and linked to selected property and tenant email | Pending | Pending |
| QA-012 | Tenancies | View `/my-tenancy` as assigned tenant | Tenant sees assigned property and lease details | Pending | Pending |
| QA-013 | Tenancies | Edit tenancy as landlord | Updated lease values persist | Pending | Pending |
| QA-014 | Issues | Create issue as tenant | Issue is created and redirects to issue details | Pending | Pending |
| QA-015 | Issues | Smart priority assignment for Water Leak | Priority is automatically set to High | Pending | Pending |
| QA-016 | Issues | Landlord updates issue status | Status update persists and tenant notification is created | Pending | Pending |
| QA-017 | Evidence | Upload supported image to issue | Image uploads to Cloudinary and appears in evidence gallery | Pending | Pending |
| QA-018 | Evidence | Upload unsupported file type | Upload is rejected with clear validation message | Pending | Pending |
| QA-019 | Evidence | Delete evidence | Confirmation appears; after confirm, evidence is removed | Pending | Pending |
| QA-020 | Messaging | Tenant sends issue-linked message to landlord | Message persists, conversation updates, receiver notification is created | Pending | Pending |
| QA-021 | Messaging | Open conversation thread | Messages display in chronological thread with current user aligned right | Pending | Pending |
| QA-022 | Disputes | Raise dispute from issue details | Dispute is created with generated reference and linked issue data | Pending | Pending |
| QA-023 | Disputes | Landlord updates dispute status and notes | Status and resolution notes persist; tenant notification is created | Pending | Pending |
| QA-024 | Notifications | Open notification bell | Unread count and latest five notifications display | Pending | Pending |
| QA-025 | Notifications | Mark all notifications as read | Unread count becomes zero and notifications show read state | Pending | Pending |
| QA-026 | Dashboard | Landlord dashboard real counts | Property, tenancy, issue, dispute, and message counts reflect database records | Pending | Pending |
| QA-027 | Dashboard | Tenant dashboard real counts | Active tenancy, open issues, active disputes, and unread messages reflect tenant records | Pending | Pending |
| QA-028 | Dashboard | Admin dashboard real counts | User, landlord, tenant, property, tenancy, issue, and dispute totals reflect database records | Pending | Pending |
| QA-029 | Security | Landlord requests another landlord property API record | API returns `403` or `404`; no private data is exposed | Pending | Pending |
| QA-030 | Public Website | Navigate all public nav/footer links | Every public page loads with no broken links or layout failures | Pending | Pending |
| QA-031 | Contact | Submit contact form with valid name, email, and message | Message is saved through `/api/contact` and success message is shown | Pending | Pending |
| QA-032 | Contact | Submit contact form with invalid email or short message | Form shows clear validation errors and does not save invalid data | Pending | Pending |
| QA-033 | Joint Tenancy | Create a tenancy with a primary tenant and two additional tenants | Tenancy saves all names, emails, and contact numbers and displays them on tenancy details | Pending | Pending |
| QA-034 | Joint Tenancy | Register or log in using an additional tenant email and open `/my-tenancy` | Joint tenant can view the shared tenancy and property | Pending | Pending |
| QA-035 | Properties | Create and edit a property with a bedroom count | Bedroom count persists and appears on property details | Pending | Pending |
| QA-036 | Inventory | Add and delete an inventory item with an image, condition, quantity, and notes | Item and image persist; confirmed deletion removes both | Pending | Pending |
| QA-037 | Rent Tracking | Save an unpaid or partial rent period and then update the same due date | Status and outstanding balance are correct; the existing period updates without duplication | Pending | Pending |
| QA-038 | Tenant Contacts | Save primary and additional tenant telephone numbers | Contact numbers persist on tenancy details and edit forms | Pending | Pending |
| QA-039 | Profile | Open profile as landlord and tenant | Name, email, and role match the authenticated session; no hard-coded role is displayed | Pending | Pending |
