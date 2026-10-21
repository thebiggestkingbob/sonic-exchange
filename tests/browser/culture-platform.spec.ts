import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
const pages = [
  "marketplace",
  "index",
  "sonic-now",
  "artists",
  "brands",
  "venues",
  "distribution",
  "facts-show",
  "marketplace/after-hours",
];
for (const width of [1440, 390])
  test(`culture layouts: ${width}px all destinations and existing workspaces`, async ({
    page,
  }) => {
    test.setTimeout(180000);
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    for (const path of pages) {
      await page.goto(`/${path}?look=culture`);
      await expect(page.locator(".culture-platform")).toBeVisible();
      const role =
        path === "artists" || path === "distribution"
          ? "artist"
          : path === "brands"
            ? "brand"
            : path === "venues"
              ? "venue"
              : "visitor";
      await page
        .getByRole("combobox", { name: "Demo role" })
        .selectOption(role);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        path,
      ).toBe(true);
      const audit = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(
        audit.violations.map((v) => ({
          id: v.id,
          nodes: v.nodes.map((n) => ({
            target: n.target,
            summary: n.failureSummary,
          })),
        })),
        path,
      ).toEqual([]);
    }
    expect(errors).toEqual([]);
  });
test("culture navigation preserves redesign, role and sample interaction", async ({
  page,
}) => {
  await page.goto("/design-lab/culture");
  await expect(page.locator(".direction-inline")).toHaveAttribute(
    "href",
    "/sonic-now?look=culture",
  );
  await page.getByRole("link", { name: "Marketplace", exact: true }).click();
  await expect(page).toHaveURL(/marketplace\?look=culture$/);
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "SONIC NOW", exact: true })
    .click();
  await expect(page).toHaveURL(/sonic-now\?look=culture$/);
  await page
    .getByRole("button", { name: "Try sample identification", exact: true })
    .click();
  await expect(
    page.getByRole("region", { name: "Sample identification result" }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "SONIC EXCHANGE home", exact: true })
    .click();
  await expect(page).toHaveURL(/design-lab\/culture$/);
});
test("culture gallery moves, pauses and honours reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/marketplace?look=culture");
  const art = page.locator(".culture-poster-track:visible");
  const first = await art.evaluate((el) => getComputedStyle(el).transform);
  await expect
    .poll(() => art.evaluate((el) => getComputedStyle(el).transform))
    .not.toBe(first);
  await page.getByRole("button", { name: "Pause artwork motion" }).click();
  const stopped = await art.evaluate((el) => getComputedStyle(el).transform);
  await page.waitForTimeout(150);
  expect(await art.evaluate((el) => getComputedStyle(el).transform)).toBe(
    stopped,
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(await art.evaluate((el) => getComputedStyle(el).animationName)).toBe(
    "none",
  );
});
