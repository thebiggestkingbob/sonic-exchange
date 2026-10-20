import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
const paths = [
  "/index",
  "/sonic-now",
  "/artists",
  "/brands",
  "/venues",
  "/distribution",
  "/facts-show",
];
for (const look of ["midnight", "studio", "ocean"]) {
  test(`real screens preserve layout and accessible colours — ${look}`, async ({
    page,
  }) => {
    test.setTimeout(120000);
    await page.route(
      /https:\/\/(upload\.wikimedia\.org|i\.scdn\.co|is1-ssl\.mzstatic\.com|hiibiza\.b-cdn\.net)\//,
      (route) => route.abort(),
    );
    await page.setViewportSize({ width: 1440, height: 1000 });
    for (const path of paths) {
      await page.goto(path);
      if (["/artists", "/distribution", "/brands", "/venues"].includes(path)) {
        await page
          .getByRole("combobox", { name: "Demo role" })
          .selectOption(
            path === "/brands"
              ? "brand"
              : path === "/venues"
                ? "venue"
                : "artist",
          );
      }
      const before = await page.locator("main").boundingBox();
      await page.goto(`${path}?look=${look}`);
      await expect(page.locator("html")).toHaveAttribute("data-look", look);
      await expect(
        page.getByRole("complementary", { name: "Visual style comparison" }),
      ).toBeVisible();
      expect(await page.locator("main").boundingBox()).toEqual(before);
      await expect
        .poll(() =>
          page
            .locator("img")
            .evaluateAll((imgs) =>
              imgs.every(
                (i) =>
                  (i as HTMLImageElement).complete &&
                  (i as HTMLImageElement).naturalWidth > 0,
              ),
            ),
        )
        .toBe(true);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(
        results.violations.map((v) => ({
          id: v.id,
          nodes: v.nodes.map((n) => ({
            target: n.target,
            detail: n.failureSummary,
          })),
        })),
      ).toEqual([]);
      await page.screenshot({
        path: `docs/style-review/${look}-${path.slice(1)}.png`,
        fullPage: true,
      });
    }
    await page.goto(`/index?look=${look}`);
    await page.setViewportSize({ width: 390, height: 844 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: `docs/style-review/${look}-mobile-index.png`,
      fullPage: true,
    });
    await page.getByRole("button", { name: "Current", exact: true }).click();
    await expect(page.locator("html")).toHaveAttribute("data-look", "original");
    await page.getByRole("button", { name: "Close colour review" }).click();
    await expect(
      page.getByRole("complementary", { name: "Visual style comparison" }),
    ).toHaveCount(0);
  });
}
