import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
for (const direction of ["liquid", "kinetic", "chrome"]) {
  test(`${direction}: animation moves, pauses and respects reduced motion`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto(`/design-lab/${direction}`);
    const sculpture = page.locator(
      direction === "liquid"
        ? ".blob-a:visible"
        : direction === "kinetic"
          ? ".gallery-one:visible"
          : ".ring-one:visible",
    );
    const first = await sculpture.evaluate(
      (el) => getComputedStyle(el).transform,
    );
    await expect
      .poll(() => sculpture.evaluate((el) => getComputedStyle(el).transform))
      .not.toBe(first);
    await page
      .getByRole("button", { name: "Pause motion", exact: true })
      .click();
    await expect(
      page.getByRole("button", { name: "Resume motion", exact: true }),
    ).toHaveAttribute("aria-pressed", "true");
    const paused = await sculpture.evaluate(
      (el) => getComputedStyle(el).transform,
    );
    await page.evaluate(
      () =>
        new Promise<void>((resolve) => {
          let count = 0;
          function frame() {
            if (++count === 10) resolve();
            else requestAnimationFrame(frame);
          }
          requestAnimationFrame(frame);
        }),
    );
    expect(
      await sculpture.evaluate((el) => getComputedStyle(el).transform),
    ).toBe(paused);
    await page.emulateMedia({ reducedMotion: "reduce" });
    expect(
      await sculpture.evaluate((el) => getComputedStyle(el).animationName),
    ).toBe("none");
  });
  test(`${direction}: role entry and platform navigation work`, async ({
    page,
  }) => {
    await page.goto(`/design-lab/${direction}`);
    await page
      .getByRole("button", { name: "I’m an artist", exact: true })
      .click();
    await expect(
      page.getByRole("heading", { name: "Build your next chapter." }),
    ).toBeVisible();
    await page.getByRole("link", { name: "Try the artist workspace" }).click();
    await expect(page).toHaveURL(/\/artists$/);
    await expect(page.getByRole("combobox", { name: "Demo role" })).toHaveValue(
      "artist",
    );
    await page.goto(`/design-lab/${direction}`);
    await page
      .getByRole("button", { name: "Is this a live music marketplace?" })
      .click();
    await expect(page.locator("#question-2")).toContainText("No money moves");
  });
  for (const viewport of [
    { name: "desktop", width: 1440, height: 1000 },
    { name: "mobile", width: 390, height: 844 },
  ]) {
    test(`${direction}: ${viewport.name} is responsive and accessible`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.emulateMedia({ reducedMotion: "reduce" });
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto(`/design-lab/${direction}`);
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
        path: `docs/design-directions/${direction}-${viewport.name}.png`,
        fullPage: true,
      });
      expect(errors).toEqual([]);
    });
  }
}
test("comparison page links to all three separate design studies", async ({
  page,
}) => {
  await page.goto("/design-lab");
  await expect(page.locator(".design-lab-card")).toHaveCount(3);
  await page.locator(".lab-chrome").click();
  await expect(page).toHaveURL(/\/design-lab\/chrome$/);
  await page
    .getByRole("complementary", { name: "Design comparison" })
    .getByRole("link", { name: /Liquid Universe/ })
    .click();
  await expect(page).toHaveURL(/\/design-lab\/liquid$/);
});
