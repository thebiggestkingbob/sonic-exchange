import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test.beforeEach(async ({ page }) => {
  await page.route(
    /https:\/\/(upload\.wikimedia\.org|i\.scdn\.co|is1-ssl\.mzstatic\.com|hiibiza\.b-cdn\.net)\//,
    (route) => route.abort(),
  );
});
test("Home separates landing from INDEX and routes to new and established destinations", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "A new world",
  );
  await page
    .getByRole("link", { name: "Explore Marketplace", exact: true })
    .click();
  await expect(page).toHaveURL(/\/marketplace$/);
  await page.goto("/index?q=Tyla");
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await expect(page.locator("tbody tr")).toContainText("Tyla");
});
test("marketplace filters, sorting, saved crate and real demo preview", async ({
  page,
}) => {
  await page.goto("/marketplace");
  await expect(page.locator(".market-asset-card")).toHaveCount(6);
  await page
    .getByRole("combobox", { name: "Marketplace genre" })
    .selectOption("Amapiano");
  await expect(page.locator(".market-asset-card")).toHaveCount(1);
  await page
    .getByRole("button", { name: "Save After Hours in Jozi", exact: true })
    .click();
  await page.reload();
  await page.getByRole("button", { name: "Saved (1)", exact: true }).click();
  await expect(page.locator(".market-asset-card")).toHaveCount(1);
  await page
    .getByRole("button", { name: "Preview After Hours in Jozi" })
    .click();
  const audio = page.locator(".market-preview-player audio");
  await expect
    .poll(() =>
      audio.evaluate((a: HTMLAudioElement) => a.duration > 0 && !a.paused),
    )
    .toBe(true);
  await page.getByRole("button", { name: "Close audio preview" }).click();
  await expect(page.locator(".market-preview-player")).toHaveCount(0);
  await page.getByRole("button", { name: "Saved (1)", exact: true }).click();
  await page.getByRole("combobox", { name: "Sort assets" }).selectOption("low");
  await expect(page.locator(".market-asset-card").first()).toContainText(
    "Durban Motion",
  );
  await page
    .getByRole("textbox", { name: "Search marketplace" })
    .fill("no such title");
  await expect(
    page.getByRole("heading", { name: "A little too specific?" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Clear all filters" }).click();
  await expect(page.locator(".market-asset-card")).toHaveCount(6);
});
test("asset detail preserves rights selection through checkout, offers and browser persistence", async ({
  page,
}) => {
  await page.goto("/marketplace/after-hours");
  await page
    .getByRole("button", { name: "Master rights", exact: true })
    .click();
  await expect(page.locator(".purchase-price")).toContainText("34");
  await page.getByRole("button", { name: "Try demo checkout" }).click();
  await expect(
    page.getByRole("button", { name: "Confirm demo purchase" }),
  ).toBeDisabled();
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Confirm demo purchase" }).click();
  await expect(page.getByRole("dialog")).toContainText(
    "Master rights · Demo purchase",
  );
  await page.keyboard.press("Escape");
  await page.reload();
  await page
    .getByRole("button", { name: "Master rights", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "View in demo collection" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Make a demo offer" }).click();
  await page
    .getByRole("spinbutton", { name: "Your offer (ZAR)" })
    .fill("10000");
  await page
    .getByRole("textbox", { name: "Tell us about your project" })
    .fill("A short film about the Johannesburg music scene.");
  await page.getByRole("button", { name: "Save demo offer" }).click();
  await expect(page.getByRole("dialog")).toContainText(
    "Pending locally, not sent",
  );
  await page.keyboard.press("Escape");
  await page.getByRole("tab", { name: "Usage rights", exact: true }).click();
  await expect(page.getByRole("tabpanel")).toContainText(
    "No real rights are offered or transferred",
  );
  await page.getByRole("tab", { name: "Earnings potential" }).click();
  await page.getByRole("slider").fill("10");
  await expect(page.locator(".scenario-result")).toContainText("85");
  await page.getByRole("tab", { name: "Stems & files" }).click();
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download demo information" }).click();
  expect((await download).suggestedFilename()).toBe(
    "after-hours-demo-manifest.json",
  );
  await page.getByRole("button", { name: "INTERACTIVE DEMO" }).click();
  await page.getByRole("button", { name: "Reset demo", exact: true }).click();
  await page.getByRole("button", { name: /My collection/ }).click();
  await expect(page.getByRole("dialog")).toContainText("Licences (0)");
});
for (const size of [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 390, height: 844 },
]) {
  test(`new screens load without overflow or accessibility violations — ${size.name}`, async ({
    page,
  }) => {
    test.setTimeout(120000);
    await page.setViewportSize(size);
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    for (const path of ["/", "/marketplace", "/marketplace/after-hours"]) {
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
      const result = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(
        result.violations.map((v) => ({
          id: v.id,
          nodes: v.nodes.map((n) => ({
            target: n.target,
            detail: n.failureSummary,
          })),
        })),
      ).toEqual([]);
      await page.screenshot({
        path: `docs/next-chapter/${size.name}-${path === "/" ? "home" : path.split("/").at(-1)}.png`,
        fullPage: true,
      });
    }
    expect(errors).toEqual([]);
  });
}
test("invalid marketplace URL shows a real not-found page", async ({
  page,
}) => {
  const response = await page.goto("/marketplace/not-an-asset");
  expect(response?.status()).toBe(404);
});
