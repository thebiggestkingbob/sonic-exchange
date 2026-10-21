import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
for (const width of [1440, 390]) {
  test(`light kinetic review: ${width}px landing and workspaces`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    for (const path of [
      "/design-lab/kinetic-light",
      "/marketplace?look=kinetic-light",
      "/marketplace/after-hours?look=kinetic-light",
      "/index?look=kinetic-light",
      "/artists?look=kinetic-light",
      "/sonic-now?look=kinetic-light",
      "/brands?look=kinetic-light",
      "/venues?look=kinetic-light",
      "/distribution?look=kinetic-light",
      "/facts-show?look=kinetic-light",
    ]) {
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      if (path.includes("look="))
        await expect(page.locator("html")).toHaveAttribute(
          "data-look",
          "kinetic-light",
        );
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        path,
      ).toBe(true);
      const result = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(
        result.violations.map((v) => ({
          id: v.id,
          nodes: v.nodes.map((n) => n.target),
        })),
        path,
      ).toEqual([]);
    }
    expect(errors).toEqual([]);
  });
}
test("light landing opens the existing artist workspace with the chosen style", async ({
  page,
}) => {
  await page.goto("/design-lab/kinetic-light");
  await page
    .getByRole("button", { name: "I’m an artist", exact: true })
    .click();
  await page.getByRole("link", { name: "Try the artist workspace" }).click();
  await expect(page).toHaveURL(/\/artists\?look=kinetic-light$/);
  await expect(page.getByRole("combobox", { name: "Demo role" })).toHaveValue(
    "artist",
  );
  await expect(page.locator("html")).toHaveAttribute(
    "data-look",
    "kinetic-light",
  );
});
