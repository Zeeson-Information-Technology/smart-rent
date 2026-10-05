# SmartRent Researcher Concern Retest

**Test date:** 5 October 2026  
**Environments:** Local (`http://localhost:3000`) and Vercel (`https://smartrent-uk.vercel.app`)  
**Build:** `02599d7 Fix tenant attribution and improve dashboard content`

## Summary

The researcher-reported joint-tenant attribution defect and stale login copy are resolved in both environments. Inventory image upload, tenant confirmation persistence, dispute access controls, populated dispute evidence, and tenancy deposits were also retested successfully.

| Test                                             | Local             | Vercel            | Result                                |
| ------------------------------------------------ | ----------------- | ----------------- | ------------------------------------- |
| Landlord, tenant, and admin authentication       | Pass              | Pass              | Pass                                  |
| Corrected login copy                             | Pass              | Pass              | Pass                                  |
| Joint tenant can access shared tenancy           | Pass              | Pass              | Pass                                  |
| Landlord creates inventory item with image       | Pass              | Pass              | Pass                                  |
| Joint tenant sees inventory item                 | Pass              | Pass              | Pass                                  |
| Tenant confirms inventory condition              | Pass              | Pass              | Pass                                  |
| Confirmation persists and is visible to landlord | Pass              | Pass              | Pass                                  |
| Independent responses from two joint tenants     | Previously passed | Previously passed | Existing researcher evidence retained |
| Issue reporter resolves to acting tenant         | Pass              | Pass              | Pass                                  |
| Dispute raiser resolves to acting tenant         | Pass              | Pass              | Pass                                  |
| Primary tenant is returned separately            | Pass              | Pass              | Pass                                  |
| Joint tenant can view shared dispute             | Pass              | Pass              | Pass                                  |
| Tenant cannot edit dispute status/resolution     | Pass (`403`)      | Pass (`403`)      | Pass                                  |
| Landlord can access dispute management           | Pass (`200`)      | Pass (`200`)      | Pass                                  |
| Existing issue evidence is accessible            | Pass              | Pass              | Pass                                  |
| Dispute-specific evidence upload                 | Pass (`201`)      | Pass (`201`)      | Pass                                  |
| Populated dispute evidence metadata/URL          | Pass              | Pass              | Pass                                  |
| Evidence deletion and test cleanup               | Pass (`200`)      | Pass (`200`)      | Pass                                  |
| Refundable deposit visible to landlord           | Pass              | Pass              | Pass                                  |
| Refundable deposit visible to tenant             | Pass              | Pass              | Pass                                  |
| Role-based dashboard summaries                   | Pass              | Pass              | Pass                                  |

## Detailed Findings

### 1. Tenant inventory

A temporary QA inventory item with a PNG image was created through the normal landlord API. The joint tenant could retrieve the item, submit a condition confirmation, and retrieve the saved response. The landlord could see the same tenant-attributed response. The temporary item, acknowledgement, and Cloudinary image were deleted after each environment test.

The second independent joint-tenant response was not recreated because the researcher-owned account credentials were unavailable. The original report already records this scenario as passed with screenshot evidence.

### 2. Joint-tenant attribution

Issue responses now include the acting tenant in `reportedByName`. Dispute responses include the acting user in `raisedByName` and preserve the legal lead tenant separately in `primaryTenantName`. Both local and deployed APIs returned these fields correctly.

### 3. Shared disputes and permissions

The joint tenant could retrieve the shared dispute. A tenant status/resolution update attempt returned `403`. The landlord could retrieve the same dispute with `200`. The original researcher test for a non-participant joint tenant being unable to read another tenant's private conversation remains valid; it was not repeated because the second account password was unavailable.

### 4. Evidence

Existing issue evidence was accessible from the dispute context. A temporary dispute-specific PNG was then uploaded, retrieved with its filename, image type, and Cloudinary URL, and deleted successfully in both environments. The associated test notification was also removed.

Visual image-modal and PDF-new-tab behavior should still be captured manually for dissertation screenshots, because the automated environment did not provide a controllable browser.

### 5. Deposit

A `GBP 1,250` refundable deposit was returned through both landlord and tenant tenancy queries, independently from monthly rent.

## Automated Quality Checks

- Unit tests: 17 passed
- TypeScript: passed
- ESLint: passed with zero warnings
- Next.js production build: passed
- Generated routes: 42

## Reproduction Command

PowerShell example:

```powershell
$env:SMARTRENT_BASE_URL="https://smartrent-uk.vercel.app"
$env:SMARTRENT_DEMO_PASSWORD="<demo-password>"
npm run test:researcher
```

The script creates only clearly labelled temporary inventory/evidence records and removes them after verification.
