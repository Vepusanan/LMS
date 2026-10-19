import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("next deadline agrees with assignment and supports file validation and submission", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("link", { name: "View assignment", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Neural networks · Practical 03" }),
  ).toBeVisible();
  await expect(page.getByText("20 Oct 2026, 23:59 (Sri Lanka)")).toBeVisible();
  await page.getByLabel("Upload assignment file").setInputFiles({
    name: "bad.exe",
    mimeType: "application/octet-stream",
    buffer: Buffer.from("bad"),
  });
  await expect(page.getByRole("alert")).toContainText("Choose a PDF");
  await page.getByLabel("Upload assignment file").setInputFiles({
    name: "FC000000-practical.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from("%PDF-1.4 demo assignment"),
  });
  await page
    .getByRole("button", { name: "Submit assignment", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Submission recorded" }),
  ).toBeVisible();
  await page.reload();
  await expect(page.getByText("FC000000-practical.pdf")).toBeVisible();
});
test("locate timetable and download an ICS calendar", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Timetable" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Your timetable" }),
  ).toBeVisible();
  await expect(page.getByText("19 – 23 October 2026")).toBeVisible();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export calendar" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toContain(".ics");
  await page.getByRole("button", { name: "Next week" }).click();
  await expect(page.getByText("This week hasn’t been published")).toBeVisible();
  await page.getByRole("button", { name: "Today", exact: true }).click();
  await expect(page.getByText("19 – 23 October 2026")).toBeVisible();
});
test("find exam registration, validate, review and confirm the practice form", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Exam registration" })
    .click();
  await expect(page.getByText("Official registration is closed")).toBeVisible();
  await page
    .getByRole("button", { name: "Open practice registration" })
    .click();
  await page.getByRole("button", { name: "Continue to subjects" }).click();
  await expect(page.getByText("Full name is required.")).toBeVisible();
  await page
    .getByLabel("Full name", { exact: true })
    .fill("Vepusanan Demo Student");
  await page.getByLabel("Index number").fill("CS00000");
  await page
    .getByLabel("Email address", { exact: true })
    .fill("student@example.com");
  await page.getByLabel("Mobile number").fill("0771234567");
  await page.getByRole("button", { name: "Continue to subjects" }).click();
  await page.getByLabel("Machine Learning").check();
  await page.getByRole("button", { name: "Review selection" }).click();
  await expect(
    page.getByRole("heading", { name: "One final look." }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Confirm practice registration" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Practice complete." }),
  ).toBeVisible();
});
test("find unread message, mark unread and delete with undo", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("link", { name: /4 unread messages/ }).click();
  await page
    .getByRole("button", {
      name: /Dr. N. Perera.*Your neural networks practical/,
    })
    .click();
  await expect(
    page.getByRole("heading", { name: "Your neural networks practical" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Mark unread", exact: true }).click();
  await page
    .getByRole("button", { name: "Delete message", exact: true })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Delete message", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText("Message deleted");
  await page.getByRole("button", { name: "Undo", exact: true }).click();
  await page
    .getByRole("button", {
      name: /Dr. N. Perera.*Your neural networks practical/,
    })
    .click();
  await expect(
    page.getByRole("heading", { name: "Your neural networks practical" }),
  ).toBeVisible();
});
test("accessibility and notification preferences persist after reload", async ({
  page,
}) => {
  await page.goto("/#/settings");
  await page.getByRole("button", { name: "Dark", exact: true }).click();
  await page
    .getByRole("checkbox", { name: "High contrast", exact: true })
    .check();
  await page
    .getByRole("checkbox", { name: "Email digest", exact: true })
    .uncheck();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(
    page.getByRole("checkbox", { name: "High contrast", exact: true }),
  ).toBeChecked();
  await expect(
    page.getByRole("checkbox", { name: "Email digest", exact: true }),
  ).not.toBeChecked();
});
test("course completion has undo, quiz unlocks answers, and search narrows courses", async ({
  page,
}) => {
  await page.goto("/#/courses");
  await page.getByRole("textbox", { name: "Search courses" }).fill("Machine");
  await expect(page.locator(".course-card")).toHaveCount(1);
  await page
    .getByRole("link", { name: "Machine Learning", exact: true })
    .click();
  await page.getByRole("button", { name: "Content", exact: true }).click();
  await page
    .getByRole("button", { name: "Mark as done", exact: true })
    .first()
    .click();
  await expect(page.locator(".course-overall")).toContainText("1 of 8");
  await page.getByRole("button", { name: "Undo", exact: true }).click();
  await expect(page.locator(".course-overall")).toContainText("0 of 8");
  await page.getByRole("button", { name: "Start quiz" }).click();
  await page.getByLabel("Labelled examples").check();
  await page.getByRole("button", { name: "Submit quiz" }).click();
  await expect(page.getByText("Unlocked", { exact: true })).toBeVisible();
});
test("command palette traps focus, assistant answers and supports unknown questions", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("heading", { name: /A good day to grow/ }).waitFor();
  await page.keyboard.press("Control+k");
  await expect(
    page.getByRole("dialog", { name: "Find your next step" }),
  ).toBeVisible();
  await page.keyboard.press("Shift+Tab");
  expect(
    await page
      .getByRole("dialog")
      .evaluate((el) => el.contains(document.activeElement)),
  ).toBe(true);
  await page
    .getByRole("textbox", { name: "Search courses and pages" })
    .fill("Timetable");
  await page
    .getByRole("dialog")
    .getByRole("link", { name: /Timetable/ })
    .click();
  await expect(page).toHaveURL(/timetable/);
  await page.getByRole("button", { name: "Open learning assistant" }).click();
  await page
    .getByRole("button", { name: "What is my next deadline?", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toContainText(
    "Your next deadline is Neural networks",
  );
  await page
    .getByRole("textbox", { name: "Ask a question" })
    .fill("Who will win the world cup?");
  await page.getByRole("button", { name: "Send question" }).click();
  await expect(page.getByRole("dialog")).toContainText("I’m not sure");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
});
test("responsive layouts fit 360, 768, 1024 and 1440 widths", async ({
  page,
}) => {
  for (const width of [360, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of [
      "/",
      "/courses",
      "/courses/ml?tab=Content",
      "/assignments",
      "/timetable",
      "/messages",
      "/grades",
      "/settings",
      "/exam-registration",
    ]) {
      await page.goto("/#" + route);
      await expect(page.locator("h1")).toContainText(
        route === "/courses"
          ? "My courses"
          : route.startsWith("/courses/")
            ? "Machine Learning"
            : route === "/assignments"
              ? "Assignments & deadlines"
              : route === "/timetable"
                ? "Your timetable"
                : route === "/messages"
                  ? "Your inbox"
                  : route === "/grades"
                    ? "Your learning, reflected"
                    : route === "/settings"
                      ? "Settings & accessibility"
                      : route === "/exam-registration"
                        ? "Exam registration"
                        : "A good day to grow",
      );
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      );
      expect(overflow, `${route} overflows at ${width}`).toBe(false);
    }
    await page.goto("/");
    await page.getByRole("heading", { name: /A good day to grow/ }).waitFor();
    await page.screenshot({
      path: `docs/screenshots/dashboard-${width}.png`,
      fullPage: true,
    });
  }
});
test("usability mode records a result and exports real observations", async ({
  page,
}) => {
  await page.goto("/#/usability");
  await page
    .getByRole("button", { name: "Start task", exact: true })
    .first()
    .click();
  await page
    .getByLabel("Observations")
    .fill("Automation smoke test only; not a participant finding.");
  await page.getByRole("button", { name: "Success", exact: true }).click();
  await expect(page.getByText(/Success · \d+ seconds/)).toBeVisible();
  const event = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export CSV" }).click();
  expect((await event).suggestedFilename()).toContain(".csv");
});
test("axe finds no serious or critical accessibility issues on primary screens", async ({
  page,
}) => {
  for (const route of [
    "/",
    "/courses",
    "/assignments",
    "/timetable",
    "/messages",
    "/exam-registration",
    "/settings",
    "/login",
  ]) {
    await page.goto("/#" + route);
    await page.locator("h1").waitFor();
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(
      results.violations
        .filter((v) => v.impact === "serious" || v.impact === "critical")
        .map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
      route,
    ).toEqual([]);
  }
});
