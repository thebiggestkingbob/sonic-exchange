import { test, expect } from "@playwright/test";
test.beforeEach(async ({ page }) => {
  await page.route(
    /https:\/\/(upload\.wikimedia\.org|i\.scdn\.co|is1-ssl\.mzstatic\.com|hiibiza\.b-cdn\.net)\//,
    (route) => route.abort(),
  );
});
test("first-time guide explains the product and opens the chosen workspace", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Show me around" }).click();
  await expect(page).toHaveURL(/#how-it-works$/);
  await expect(
    page.getByRole("heading", { name: "New here? Follow the sound." }),
  ).toBeVisible();
  await page.getByRole("button", { name: /I make music/ }).click();
  await expect(
    page.getByRole("heading", { name: "Your sound. Your next chapter." }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Try the artist workspace" }).click();
  await expect(page).toHaveURL(/\/artists$/);
  await expect(page.getByRole("combobox", { name: "Demo role" })).toHaveValue(
    "artist",
  );
  await page.goto("/");
  await page
    .locator("summary")
    .filter({ hasText: "Is this a live marketplace?" })
    .click();
  await expect(page.locator("details[open]")).toContainText("no money moves");
});
test("motion can be paused and reduced-motion preference keeps sculpture static", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const canvas = page.locator(".sound-world-surface canvas");
  await expect
    .poll(() => canvas.evaluate((c: HTMLCanvasElement) => c.width))
    .toBeGreaterThan(100);
  const first = await canvas.evaluate((c: HTMLCanvasElement) => c.toDataURL());
  await expect
    .poll(() => canvas.evaluate((c: HTMLCanvasElement) => c.toDataURL()))
    .not.toBe(first);
  await page.getByRole("button", { name: "Pause visual motion" }).click();
  await expect(
    page.getByRole("button", { name: "Resume visual motion" }),
  ).toHaveAttribute("aria-pressed", "true");
  const paused = await canvas.evaluate((c: HTMLCanvasElement) => c.toDataURL());
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        let count = 0;
        function wait() {
          if (++count === 12) resolve();
          else requestAnimationFrame(wait);
        }
        requestAnimationFrame(wait);
      }),
  );
  expect(await canvas.evaluate((c: HTMLCanvasElement) => c.toDataURL())).toBe(
    paused,
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  await expect
    .poll(() => canvas.evaluate((c: HTMLCanvasElement) => c.width))
    .toBeGreaterThan(100);
  const still = await canvas.evaluate((c: HTMLCanvasElement) => c.toDataURL());
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        let count = 0;
        function wait() {
          if (++count === 12) resolve();
          else requestAnimationFrame(wait);
        }
        requestAnimationFrame(wait);
      }),
  );
  expect(await canvas.evaluate((c: HTMLCanvasElement) => c.toDataURL())).toBe(
    still,
  );
});
