import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
// External photo availability must not determine the local prototype test result.
test.beforeEach(async ({ page }) => {
  await page.route(
    /https:\/\/(upload\.wikimedia\.org|i\.scdn\.co|is1-ssl\.mzstatic\.com|hiibiza\.b-cdn\.net)\//,
    (route) => route.abort(),
  );
});
async function role(page: Page, r: string) {
  await page.getByRole("combobox", { name: "Demo role" }).selectOption(r);
}
test("INDEX search, filter, sort, pagination, profile, alerts and persistence", async ({
  page,
}) => {
  await page.goto("/index");
  await expect(
    page.getByRole("heading", { name: "The INDEX", exact: true }),
  ).toBeVisible();
  await expect(page.locator("tbody tr")).toHaveCount(5);
  await page.getByRole("button", { name: "Next page" }).click();
  await expect(page.getByText("Showing 6–10 of 12 artists")).toBeVisible();
  await page
    .getByRole("textbox", { name: "Search artists", exact: true })
    .fill("Kabza");
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await page
    .getByRole("button", { name: "View Kabza De Small profile" })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Follow the movement" }).click();
  await expect(
    page.getByRole("button", { name: "Remove alert" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.reload();
  await expect(
    page.getByText("1 artist alert", { exact: false }),
  ).toBeVisible();
  await page
    .getByRole("combobox", { name: "Filter by genre" })
    .selectOption("Afro House");
  await expect(page.locator("tbody tr")).toHaveCount(2);
  await page
    .getByRole("combobox", { name: "Filter by genre" })
    .selectOption("All genres");
  await page
    .getByRole("combobox", { name: "Sort ranking" })
    .selectOption("velocity");
  await expect(page.locator("tbody tr").first()).toContainText("A-Reece");
  await page.getByRole("tab", { name: "Genre velocity" }).click();
  await expect(page.locator(".genre-row")).toHaveCount(6);
  await page.getByRole("tab", { name: "Radio chart" }).click();
  await expect(page.getByText("Imithandazo", { exact: true })).toBeVisible();
});
test("global search passes URL query into INDEX", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open global search" }).click();
  await page
    .getByRole("textbox", { name: "Artist, genre or city" })
    .fill("A-Reece");
  await page.getByRole("button", { name: "Search INDEX" }).click();
  await expect(page).toHaveURL(/q=A-Reece/);
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await expect(page.locator("tbody tr")).toContainText("A-Reece");
});
test("SONIC NOW permission failure, explicit sample result and persisted history", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "mediaDevices", {
      value: {
        getUserMedia: () =>
          Promise.reject(new DOMException("Denied", "NotAllowedError")),
      },
      configurable: true,
    });
  });
  await page.goto("/sonic-now");
  await page.getByRole("button", { name: "Check microphone" }).click();
  await expect(page.locator(".listen-error[role=alert]")).toContainText(
    "permission was denied",
  );
  await page.getByRole("button", { name: "Try sample identification" }).click();
  await expect(
    page.getByRole("region", { name: "Sample identification result" }),
  ).toContainText("Imithandazo");
  await page.reload();
  await expect(page.locator(".history-row")).toHaveCount(1);
  await expect(page.locator(".history-row")).toContainText(
    "sample identification",
  );
});
test("microphone tracks stop when the user stops listening", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const w = window as unknown as { trackStopped: boolean };
    w.trackStopped = false;
    Object.defineProperty(navigator, "mediaDevices", {
      value: {
        getUserMedia: () =>
          Promise.resolve({
            getTracks: () => [
              {
                stop: () => {
                  w.trackStopped = true;
                },
              },
            ],
          }),
      },
      configurable: true,
    });
  });
  await page.goto("/sonic-now");
  await page.getByRole("button", { name: "Check microphone" }).click();
  await expect(
    page.getByText("Microphone active · permission check"),
  ).toBeVisible();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".listen-orb")).toHaveCSS("animation-name", "none");
  await page.getByRole("button", { name: "Stop microphone" }).click();
  expect(
    await page.evaluate(
      () => (window as unknown as { trackStopped: boolean }).trackStopped,
    ),
  ).toBe(true);
});
test("artist gates, payout and ledger export", async ({ page }) => {
  await page.goto("/artists");
  await expect(
    page.getByRole("heading", { name: "Step into the artist workspace." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Explore as artist" }).click();
  await page.getByRole("tab", { name: "Wallet", exact: true }).click();
  await page.getByRole("button", { name: "Request demo payout" }).click();
  await page.getByRole("spinbutton", { name: "Amount (ZAR)" }).fill("500");
  await page.getByRole("button", { name: "Confirm demo payout" }).click();
  await expect(
    page.getByText("Simulated request", { exact: true }),
  ).toBeVisible();
  await expect(page.locator("tbody")).toContainText("Simulated payout request");
  await expect(page.locator("tbody tr")).toHaveCount(2);
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export CSV" }).click();
  expect((await download).suggestedFilename()).toBe("sonic-demo-ledger.csv");
  await page.reload();
  await page.getByRole("tab", { name: "Ledger", exact: true }).click();
  await expect(page.locator("tbody tr")).toHaveCount(2);
});
test("brand offer flows through artist acceptance, escrow and settlement", async ({
  page,
}) => {
  await page.goto("/brands");
  await role(page, "brand");
  await page
    .getByRole("textbox", { name: "Search artists", exact: true })
    .fill("Kabza");
  await page.getByRole("button", { name: "Start a connection" }).click();
  await page
    .getByRole("textbox", { name: "Project name" })
    .fill("Music for a new story");
  await page
    .getByRole("spinbutton", { name: "Offer amount (ZAR)" })
    .fill("2500");
  await page.getByRole("button", { name: "Create demo offer" }).click();
  await page.getByRole("tab", { name: "Offers & agreements" }).click();
  await expect(page.locator(".agreement").first()).toContainText(
    "Music for a new story",
  );
  await page.goto("/artists");
  await role(page, "artist");
  await page.getByRole("tab", { name: "Deals", exact: true }).click();
  await page
    .locator(".agreement")
    .first()
    .getByRole("button", { name: "Accept offer" })
    .click();
  await page.goto("/brands");
  await role(page, "brand");
  await page.getByRole("tab", { name: "Offers & agreements" }).click();
  await page
    .locator(".agreement")
    .first()
    .getByRole("button", { name: "Fund demo escrow" })
    .click();
  await expect(page.locator(".agreement").first()).toContainText(
    "Demo escrow funded",
  );
  await page
    .locator(".agreement")
    .first()
    .getByRole("button", { name: "Complete simulated settlement" })
    .click();
  await expect(page.locator(".agreement").first()).toContainText("completed");
  await page.goto("/artists");
  await role(page, "artist");
  await page.getByRole("tab", { name: "Ledger", exact: true }).click();
  await expect(page.locator("tbody")).toContainText(
    "Simulated license settlement",
  );
});
test("brand verified filter honestly shows no connected verification", async ({
  page,
}) => {
  await page.goto("/brands");
  await role(page, "brand");
  await page.getByRole("checkbox", { name: "Verified only" }).check();
  await expect(
    page.getByRole("heading", { name: "No verified sources are connected." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Reset filters" }).click();
  await expect(page.locator(".discovery-card")).toHaveCount(12);
});
test("venue predictor and booking acceptance, funding and cancellation refund", async ({
  page,
}) => {
  await page.goto("/venues");
  await role(page, "venue");
  await page.getByRole("slider", { name: "Room capacity" }).fill("100");
  await expect(page.locator(".predict-count")).toContainText("100");
  await page
    .getByRole("button", { name: "Request a demo booking" })
    .first()
    .click();
  await page
    .getByRole("textbox", { name: "Show name" })
    .fill("An evening with Kabza");
  await page.getByLabel("Show date").fill("2027-06-01");
  await page.getByRole("spinbutton", { name: "Artist fee (ZAR)" }).fill("4000");
  await page.getByRole("button", { name: "Create demo request" }).click();
  await expect(page.locator(".agreement")).toHaveCount(1);
  await page.goto("/artists");
  await role(page, "artist");
  await page.getByRole("tab", { name: "Deals", exact: true }).click();
  await page
    .locator(".agreement")
    .first()
    .getByRole("button", { name: "Accept offer" })
    .click();
  await page.goto("/venues");
  await role(page, "venue");
  await page.getByRole("tab", { name: "Bookings", exact: true }).click();
  await page.getByRole("button", { name: "Fund demo escrow" }).click();
  await page.getByRole("button", { name: "Cancel agreement" }).click();
  await expect(page.locator(".agreement")).toContainText("cancelled");
  await expect(page.locator(".stat").first()).toContainText("20");
  await expect(
    page.getByRole("button", { name: "Cancel agreement" }),
  ).toHaveCount(0);
});
test("distribution draft, rights validation and simulated DSP delivery", async ({
  page,
}) => {
  await page.goto("/distribution");
  await role(page, "artist");
  await page.getByRole("button", { name: "New release", exact: true }).click();
  await page
    .getByRole("textbox", { name: "Release title" })
    .fill("A New Frequency");
  await page
    .getByRole("combobox", { name: "Genre", exact: true })
    .selectOption("Afro Soul");
  await page.getByLabel("Release date", { exact: true }).fill("2027-06-01");
  await page.getByRole("button", { name: "Continue" }).click();
  await page
    .getByRole("button", { name: "Use clearly labelled demo assets" })
    .click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(
    page.getByText("Confirm you control the recording and artwork rights."),
  ).toBeVisible();
  await page.getByRole("button", { name: "Back", exact: true }).click();
  await page.getByRole("checkbox", { name: /I control the master/ }).check();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Save draft" }).click();
  await expect(page.locator(".release-card")).toContainText("A New Frequency");
  await page.getByRole("button", { name: "Review & submit demo" }).click();
  await page.getByRole("button", { name: "Submit demo release" }).click();
  for (let i = 0; i < 3; i++)
    await page
      .getByRole("button", { name: "Advance simulated delivery" })
      .click();
  await expect(page.locator(".release-card")).toContainText("delivered · demo");
  await expect(page.locator(".dsp")).toHaveCount(3);
  await page.reload();
  await expect(page.locator(".release-card")).toContainText("A New Frequency");
});
test("Facts Show player, episode selection, voting and questions", async ({
  page,
}) => {
  await page.goto("/facts-show");
  await page.getByRole("button", { name: "I’d listen to this" }).click();
  await expect(
    page.getByRole("button", { name: "You’re interested" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page
    .getByRole("textbox", { name: "Your question" })
    .fill("How can independent artists understand their publishing rights?");
  await page.getByRole("button", { name: "Save question" }).click();
  await expect(page.locator(".question-card")).toHaveCount(1);
  const audio = await page
    .locator("audio")
    .evaluate(async (el: HTMLAudioElement) => {
      el.load();
      await el.play();
      return { paused: el.paused, duration: el.duration };
    });
  expect(audio.paused).toBe(false);
  await page.getByRole("button", { name: /EPISODE 02/ }).click();
  await expect(page.locator(".episode-content h2")).toHaveText(
    "Behind the split sheet",
  );
  await page.reload();
  await expect(page.locator(".question-card")).toHaveCount(1);
});
test("integration API reports every external service unconfigured", async ({
  request,
}) => {
  const r = await request.get("/api/integrations");
  expect(r.status()).toBe(200);
  const body = await r.json();
  expect(body.mode).toBe("demo");
  expect(Object.values(body.integrations).every((x) => x === false)).toBe(true);
  const write = await request.post("/api/integrations");
  expect(write.status()).toBe(405);
});
test("keyboard modal focus and mobile navigation", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/index");
  await page.getByRole("button", { name: "Open menu" }).click();
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "SONIC NOW", exact: true })
    .click();
  await expect(page).toHaveURL(/sonic-now/);
  await page.getByRole("button", { name: "Open menu" }).click();
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "INDEX", exact: true })
    .click();
  await page.locator(".table-scroll").evaluate((el) => {
    el.scrollLeft = 180;
  });
  expect(
    await page.locator(".table-scroll").evaluate((el) => el.scrollLeft),
  ).toBeGreaterThan(0);
  await page.getByRole("tab", { name: "Artist rankings" }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(
    page.getByRole("tab", { name: "Genre velocity" }),
  ).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("Home");
  await expect(
    page.getByRole("tab", { name: "Artist rankings" }),
  ).toHaveAttribute("aria-selected", "true");
  await page.getByRole("button", { name: "Meet the artist" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Meet the artist" }),
  ).toBeFocused();
});
for (const viewport of [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 390, height: 844 },
]) {
  test(`responsive screenshots, loaded media and accessibility — ${viewport.name}`, async ({
    page,
  }) => {
    test.setTimeout(90000);
    await page.setViewportSize(viewport);
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    for (const path of [
      "/index",
      "/sonic-now",
      "/artists",
      "/brands",
      "/venues",
      "/distribution",
      "/facts-show",
    ]) {
      await page.goto(path);
      if (path === "/artists" || path === "/distribution")
        await role(page, "artist");
      else if (path === "/brands") await role(page, "brand");
      else if (path === "/venues") await role(page, "venue");
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator("h1")).toBeVisible();
      await expect
        .poll(() =>
          page.evaluate(
            () => document.documentElement.scrollWidth <= window.innerWidth,
          ),
        )
        .toBe(true);
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
      await page.screenshot({
        path: `docs/screenshots/${viewport.name}-${path.slice(1)}.png`,
        fullPage: true,
      });
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(
        results.violations.map((v) => ({
          id: v.id,
          targets: v.nodes.map((n) => n.target),
        })),
        JSON.stringify(
          results.violations.map((v) => ({
            id: v.id,
            nodes: v.nodes.map((n) => ({
              target: n.target,
              summary: n.failureSummary,
            })),
          })),
        ),
      ).toEqual([]);
    }
    expect(errors).toEqual([]);
  });
}

test("South African catalogue exposes real songs, simulated fan signals and safe photo fallback", async ({
  page,
}) => {
  await page.route("https://upload.wikimedia.org/**", (route) => route.abort());
  await page.goto("/index");
  const search = page.getByRole("textbox", {
    name: "Search artists",
    exact: true,
  });
  for (const name of [
    "Kabza De Small",
    "25K",
    "Tyla",
    "A-Reece",
    "DJ Maphorisa",
  ]) {
    await search.fill(name);
    await page.getByRole("button", { name: `View ${name} profile` }).click();
    const dialog = page.getByRole("dialog");
    await expect(
      dialog.getByRole("region", { name: "Song and fan activity" }),
    ).toContainText("invented demo figures");
    await expect(dialog.locator(".song-insight")).toHaveCount(2);
    if (name === "Tyla") {
      await expect(dialog.locator(".profile-cover img")).toHaveAttribute(
        "src",
        "/images/artists/tyla.svg",
      );
    }
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
  }
  await search.fill("Water");
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await expect(page.locator("tbody tr")).toContainText("Tyla");
});
