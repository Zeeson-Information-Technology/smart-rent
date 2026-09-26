const baseUrl = process.env.SMARTRENT_BASE_URL ?? "https://smartrent-uk.vercel.app";
const password = process.env.SMARTRENT_DEMO_PASSWORD;

if (!password) {
  throw new Error("Set SMARTRENT_DEMO_PASSWORD before running this script.");
}

const users = [
  { role: "landlord", email: process.env.SMARTRENT_LANDLORD_EMAIL ?? "landlord@smartrent.demo" },
  { role: "tenant", email: process.env.SMARTRENT_TENANT_EMAIL ?? "tenant@smartrent.demo" },
  { role: "admin", email: process.env.SMARTRENT_ADMIN_EMAIL ?? "admin@smartrent.demo" },
];

let failures = 0;

for (const expectedUser of users) {
  try {
    const cookieJar = new Map();
    const csrfResponse = await fetch(`${baseUrl}/api/auth/csrf`);
    updateCookies(cookieJar, csrfResponse);
    const { csrfToken } = await csrfResponse.json();

    const loginResponse = await fetch(`${baseUrl}/api/auth/callback/credentials`, {
      method: "POST",
      redirect: "manual",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Cookie: cookieHeader(cookieJar),
      },
      body: new URLSearchParams({
        csrfToken,
        email: expectedUser.email,
        password,
        callbackUrl: `${baseUrl}/dashboard`,
        json: "true",
      }),
    });
    updateCookies(cookieJar, loginResponse);

    const sessionResponse = await authenticatedFetch("/api/auth/session", cookieJar);
    const session = await sessionResponse.json();
    check(Boolean(session?.user?.id), `${expectedUser.role}: authenticated session`);
    check(session?.user?.role === expectedUser.role, `${expectedUser.role}: correct session role`);
    check(session?.user?.email === expectedUser.email, `${expectedUser.role}: correct session email`);

    const dashboardResponse = await authenticatedFetch("/api/dashboard/summary", cookieJar);
    check(dashboardResponse.ok, `${expectedUser.role}: dashboard summary (${dashboardResponse.status})`);

    const profileResponse = await authenticatedFetch("/profile", cookieJar);
    const profileHtml = await profileResponse.text();
    check(profileResponse.ok, `${expectedUser.role}: profile page (${profileResponse.status})`);
    check(profileHtml.includes(capitalize(expectedUser.role)), `${expectedUser.role}: profile contains role label`);

    if (expectedUser.role === "landlord") {
      const [propertyForm, tenancyForm, properties, tenancies] = await Promise.all([
        authenticatedText("/properties/new", cookieJar),
        authenticatedText("/tenancies/new", cookieJar),
        authenticatedJson("/api/properties", cookieJar),
        authenticatedJson("/api/tenancies", cookieJar),
      ]);
      check(propertyForm.includes("Number of bedrooms"), "landlord: bedroom control deployed");
      check(tenancyForm.includes("Primary tenant contact number"), "landlord: phone control deployed");
      check(tenancyForm.includes("Additional tenants"), "landlord: joint tenant control deployed");
      check(Array.isArray(properties.properties), "landlord: property API accessible");
      check(Array.isArray(tenancies.tenancies), "landlord: tenancy API accessible");

      const propertyId = properties.properties?.[0]?.id;
      if (propertyId) {
        const inventory = await authenticatedJson(`/api/properties/${propertyId}/inventory`, cookieJar);
        check(Array.isArray(inventory.items), "landlord: inventory API accessible");
      } else {
        info("landlord: inventory API skipped (no property in demo account)");
      }

      const tenancyId = tenancies.tenancies?.[0]?.id;
      if (tenancyId) {
        const rent = await authenticatedJson(`/api/tenancies/${tenancyId}/rent-payments`, cookieJar);
        check(Array.isArray(rent.payments), "landlord: rent API accessible");
      } else {
        info("landlord: rent API skipped (no tenancy in demo account)");
      }
    }

    if (expectedUser.role === "tenant") {
      const tenancies = await authenticatedJson("/api/tenancies", cookieJar);
      check(Array.isArray(tenancies.tenancies), "tenant: assigned tenancy query accessible");
      const issues = await authenticatedJson("/api/issues", cookieJar);
      check(Array.isArray(issues.issues), "tenant: issue API accessible");
    }

    if (expectedUser.role === "admin") {
      const [properties, tenancies, issues] = await Promise.all([
        authenticatedJson("/api/properties", cookieJar),
        authenticatedJson("/api/tenancies", cookieJar),
        authenticatedJson("/api/issues", cookieJar),
      ]);
      check(Array.isArray(properties.properties), "admin: property API accessible");
      check(Array.isArray(tenancies.tenancies), "admin: tenancy API accessible");
      check(Array.isArray(issues.issues), "admin: issue API accessible");
    }
  } catch (error) {
    failures += 1;
    console.error(`FAIL ${expectedUser.role}: ${error instanceof Error ? error.message : error}`);
  }
}

if (failures > 0) {
  console.error(`\nProduction smoke test failed with ${failures} failure(s).`);
  process.exitCode = 1;
} else {
  console.log("\nProduction smoke test passed.");
}

async function authenticatedFetch(path, cookieJar) {
  const response = await fetch(`${baseUrl}${path}`, { headers: { Cookie: cookieHeader(cookieJar) } });
  updateCookies(cookieJar, response);
  return response;
}

async function authenticatedJson(path, cookieJar) {
  const response = await authenticatedFetch(path, cookieJar);
  if (!response.ok) throw new Error(`${path} returned ${response.status}`);
  return response.json();
}

async function authenticatedText(path, cookieJar) {
  const response = await authenticatedFetch(path, cookieJar);
  if (!response.ok) throw new Error(`${path} returned ${response.status}`);
  return response.text();
}

function updateCookies(cookieJar, response) {
  const setCookies = response.headers.getSetCookie?.() ?? splitSetCookie(response.headers.get("set-cookie"));
  for (const value of setCookies) {
    const [pair] = value.split(";");
    const separator = pair.indexOf("=");
    if (separator > 0) cookieJar.set(pair.slice(0, separator), pair.slice(separator + 1));
  }
}

function splitSetCookie(value) {
  if (!value) return [];
  return value.split(/,(?=\s*[^;,]+=)/);
}

function cookieHeader(cookieJar) {
  return [...cookieJar].map(([name, value]) => `${name}=${value}`).join("; ");
}

function check(condition, label) {
  if (!condition) {
    failures += 1;
    console.error(`FAIL ${label}`);
    return;
  }
  console.log(`PASS ${label}`);
}

function info(label) {
  console.log(`SKIP ${label}`);
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
