import { expect, test, type Page } from "@playwright/test";
async function login(page: Page, email = "admin@example.test") {
  await page.goto("/admin/login");
  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="password"]').fill("Browser-test-password-2026");
  await page.getByRole("button", { name: /sign in/i }).click();
  await expect(page).toHaveURL(/\/admin$/);
}

test("public pages render on desktop and mobile without horizontal overflow", async ({ page }) => {
  const failures: string[] = [];
  page.on("pageerror", (error) => failures.push(error.message));
  for (const path of ["/", "/services", "/services/hrms-payroll", "/industries/manufacturing", "/blog", "/about", "/clients", "/careers", "/contact", "/products"]) {
    const response = await page.goto(path);
    expect(response?.status(), path).toBe(200);
    await expect(page.locator("h1")).toBeVisible();
  }
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of ["/", "/services/hrms-payroll", "/blog", "/contact"]) {
    await page.goto(path);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), path).toBe(true);
  }
  expect(failures).toEqual([]);
});

test("contact enquiry retains campaign attribution and reaches the admin pipeline", async ({ page }) => {
  await page.goto("/?utm_source=browser-test&utm_campaign=launch");
  await expect.poll(() => page.evaluate(() => sessionStorage.getItem("novapulse_attribution"))).toContain("browser-test");
  await page.goto("/contact");
  const form = page.locator("form").filter({ has: page.locator('input[name="company"]') });
  await form.locator('[name="name"]').fill("Browser Lead");
  await form.locator('[name="email"]').fill("lead@example.test");
  await form.locator('[name="phone"]').fill("+919876543210");
  await form.locator('[name="company"]').fill("Browser Company");
  await form.locator('button[type="submit"]').click();
  await expect(page.getByText("Request received", { exact: true })).toBeVisible();
  await login(page);
  await page.getByRole("link", { name: "Browser Lead" }).last().click();
  await expect(page.getByText("browser-test", { exact: true })).toBeVisible();
  await page.locator('select[name="status"]').selectOption("qualified");
  await page.getByRole("button", { name: "Update", exact: true }).click();
  await expect.poll(() => page.evaluate(async () => {
    const response = await fetch("/admin/export?status=qualified&query=Browser%20Company");
    return response.text();
  })).toContain("Browser Lead");
  await page.locator('textarea[name="body"]').fill("Follow up after the demo.");
  await page.getByRole("button", { name: /add note/i }).click();
  await expect(page.getByText("Follow up after the demo.", { exact: true })).toBeVisible();
});

test("Blog supports draft, publish, rename, unpublish and deletion", async ({ page }) => {
  await login(page);
  await page.goto("/admin/blog/new");
  await page.locator('[name="title"]').fill("Browser CMS Article");
  await page.locator('[name="slug"]').fill("browser-cms-article");
  await page.locator('textarea[name="description"]').fill("A browser-tested article description for the public website.");
  await page.getByRole("button", { name: "Save draft", exact: true }).click();
  await expect(page).toHaveURL(/\/admin\/blog\/[a-f0-9-]+\?created=1/);
  const editorUrl = page.url();
  expect((await page.request.get("/blog/browser-cms-article")).status()).toBe(404);
  await page.locator('[name="body"]').fill("## First section\n\nThis article verifies that publishing works from the browser through the database to the public site.");
  await page.getByRole("button", { name: "Publish", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Published");
  await expect.poll(async () => (await page.request.get("/blog/browser-cms-article")).status()).toBe(200);
  await page.locator('[name="slug"]').fill("browser-cms-renamed");
  await page.getByRole("button", { name: "Update live post", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Published");
  await expect.poll(async () => (await page.request.get("/blog/browser-cms-article", { maxRedirects: 0 })).status()).toBe(308);
  await page.getByRole("button", { name: "Unpublish (back to draft)", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Draft saved");
  await expect.poll(async () => (await page.request.get("/blog/browser-cms-renamed")).status()).toBe(404);
  expect(await page.locator("form form").count()).toBe(0);
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Delete post", exact: true }).click();
  await expect(page).toHaveURL(/\/admin\/blog$/);
  expect((await page.request.get(editorUrl)).status()).toBe(404);
});

test("Services publish and rename without breaking public navigation", async ({ page }) => {
  await login(page);
  await page.goto("/admin/services/new");
  for (const [name, value] of Object.entries({ name: "Browser Service", slug: "browser-service", eyebrow: "Solutions", title: "Browser Service Page", tagline: "A complete service managed through the CMS.", description: "A browser-tested service description for website visitors.", menuBlurb: "Browser service offering" })) {
    const selector = name === "description" ? 'textarea[name="description"]' : `[name="${name}"]`;
    await page.locator(selector).fill(value);
  }
  // The initial capability row has plain title/body controls inside the Capabilities panel.
  const panel = page.locator("div.rounded-2xl").filter({ has: page.getByText("Capabilities", { exact: true }) }).first();
  await panel.locator('input[placeholder="Statutory payroll"]').fill("Browser capability");
  await panel.locator("textarea").fill("A useful capability described for our customers.");
  await page.getByRole("button", { name: "Publish", exact: true }).click();
  await expect(page).toHaveURL(/\/admin\/services\/[a-f0-9-]+\?created=1/);
  await expect.poll(async () => (await page.request.get("/services/browser-service")).status()).toBe(200);
  await page.locator('[name="slug"]').fill("browser-service-renamed");
  await page.getByRole("button", { name: /update live/i }).click();
  await expect(page.getByRole("status")).toContainText("Published");
  await expect.poll(async () => (await page.request.get("/services/browser-service", { maxRedirects: 0 })).status()).toBe(308);
  await page.getByRole("button", { name: "Unpublish (back to draft)", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Draft saved");
  await expect.poll(async () => (await page.request.get("/services/browser-service-renamed")).status()).toBe(404);
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Delete service", exact: true }).click();
  await expect(page).toHaveURL(/\/admin\/services$/);
});

test("viewers cannot access CMS or upload; unauthenticated maintenance is denied", async ({ page }) => {
  await login(page, "viewer@example.test");
  await expect(page.getByRole("navigation", { name: "Admin sections" }).getByText("Blog")).toHaveCount(0);
  await page.goto("/admin/blog/new");
  await expect(page).toHaveURL(/error=forbidden/);
  await page.goto("/admin/services/new");
  await expect(page).toHaveURL(/error=forbidden/);
  const uploadStatus = await page.evaluate(async () => (await fetch("/api/admin/upload", { method: "POST" })).status);
  expect(uploadStatus).toBe(403);
  expect((await page.request.get("/api/cron/maintenance")).status()).toBe(401);
  const invalidLeadStatus = await page.evaluate(async () => (await fetch("/admin/leads/not-a-uuid")).status);
  expect(invalidLeadStatus).toBe(404);
});
