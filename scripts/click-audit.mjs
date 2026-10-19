import { chromium, expect } from "@playwright/test";
import { writeFile } from "node:fs/promises";
const browser = await chromium.launch({ channel: "chrome" });
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
});
const page = await context.newPage();
const errors = [];
const checks = [];
page.on("pageerror", (e) => errors.push(e.message));
async function go(route) {
  await page.goto("http://localhost:5173/#" + route, {
    waitUntil: "networkidle",
  });
}
await go("/login");
await page.getByRole("button", { name: "Log in", exact: true }).click();
await expect(page.getByRole("alert")).toContainText("Use student ID");
await page.getByLabel("Student ID").fill("FC000000");
await page.getByLabel("Password", { exact: true }).fill("Focus2026!");
await page.getByRole("button", { name: "Show password" }).click();
await expect(page.getByLabel("Password", { exact: true })).toHaveAttribute(
  "type",
  "text",
);
await page.getByRole("button", { name: "Forgot password?" }).click();
await page.getByRole("dialog").getByLabel("Email").fill("student@example.com");
await page.getByRole("button", { name: "Request reset" }).click();
await expect(page.getByRole("dialog")).toContainText("Reset request simulated");
await page.keyboard.press("Escape");
await page.getByRole("button", { name: "Log in", exact: true }).click();
await expect(
  page.getByRole("heading", { name: /A good day to grow/ }),
).toBeVisible();
checks.push("Login validation, password visibility, simulated reset and login");
await page.getByRole("link", { name: "Skip to content" }).focus();
await page.keyboard.press("Enter");
await expect(page).toHaveURL(/#\/$/);
await expect(page.locator("main")).toBeFocused();
checks.push("Skip link focuses main without changing hash route");
await page
  .getByRole("button", { name: "Collapse sidebar", exact: true })
  .click();
await expect(page.locator(".app-frame")).toHaveClass(/is-collapsed/);
await page.getByRole("button", { name: "Expand sidebar", exact: true }).click();
checks.push("Sidebar collapse and expand");
await go("/courses");
await page.getByRole("button", { name: "All", exact: true }).click();
await page.getByRole("heading", { name: /Semester 04/ }).click();
await expect(
  page
    .locator(".semester-group")
    .filter({ has: page.getByRole("heading", { name: /Semester 04/ }) }),
).toHaveAttribute("open", "");
await page.getByRole("button", { name: "List view", exact: true }).click();
await expect(page.locator(".course-list-view").first()).toBeVisible();
await page.getByLabel("Sort by").selectOption("Name");
await page.getByRole("button", { name: "Starred", exact: true }).click();
await expect(page.locator(".course-card")).toHaveCount(2);
checks.push("Course filters, sort, list mode and semester expansion");
await go("/courses/ml");
for (const tab of [
  "Content",
  "Assignments",
  "Grades",
  "Participants",
  "Announcements",
  "Overview",
]) {
  await page.getByRole("button", { name: tab, exact: true }).click();
  await expect(
    page.getByRole("button", { name: tab, exact: true }),
  ).toHaveClass("active");
}
await page.getByRole("button", { name: "Content", exact: true }).click();
await page
  .getByRole("button", { name: "Download Introduction to machine learning" })
  .click();
await expect(page.getByRole("status")).toContainText("Simulated download");
checks.push("All course tabs and simulated resource download");
await go("/participants");
await page.getByRole("textbox", { name: "Search participants" }).fill("Amaya");
await page.getByRole("button", { name: /Amaya Fernando/ }).click();
await expect(page.getByRole("dialog")).toContainText("private contact details");
await page.getByRole("link", { name: "Send a course message" }).click();
await page.getByRole("button", { name: "Save demo message" }).click();
await expect(page.getByRole("alert")).toContainText("Add a recipient");
await page.getByRole("dialog").getByLabel("Subject").fill("Study session");
await page
  .getByRole("dialog")
  .getByLabel("Message", { exact: true })
  .fill("Can we review the practice worksheet together?");
await page.getByRole("button", { name: "Save demo message" }).click();
await expect(page.getByRole("status")).toContainText("saved locally");
checks.push("Participant search, private profile and validated local compose");
await go("/notifications");
await page.getByRole("button", { name: "Mark all as read" }).click();
await page.getByRole("button", { name: "Unread", exact: true }).click();
await expect(
  page.getByRole("heading", { name: "You’re all caught up" }),
).toBeVisible();
checks.push("Notification read state and empty unread filter");
await go("/help");
await page
  .getByText("How do I find my next deadline?", { exact: true })
  .click();
await expect(
  page.getByText(
    "Open Dashboard and check Next deadline, or go to Assignments.",
    { exact: false },
  ),
).toBeVisible();
await page.getByRole("button", { name: "Contact support" }).click();
await page.getByLabel("Your name").fill("Demo Student");
await page.getByLabel("Email address").fill("demo@example.com");
await page
  .getByLabel("How can we help?")
  .fill("Please help me understand the practice registration process.");
await page.getByRole("button", { name: "Save support request" }).click();
await expect(page.getByRole("dialog")).toContainText("Your request is ready");
const downloadEvent = page.waitForEvent("download");
await page.getByRole("button", { name: "Download request" }).click();
expect((await downloadEvent).suggestedFilename()).toBe("support-request.txt");
await page.keyboard.press("Escape");
checks.push("FAQ, support draft validation and download");
await go("/settings");
await page.getByRole("checkbox", { name: "Reading-friendly font" }).check();
await expect(page.locator("html")).toHaveAttribute("data-dyslexia", "true");
await page.getByLabel("Navigation language").selectOption("தமிழ்");
await expect(
  page.getByRole("navigation", { name: "Main navigation" }),
).toContainText("முகப்பு");
await page.getByRole("button", { name: "Reset to defaults" }).click();
await page
  .getByRole("button", { name: "Reset preferences", exact: true })
  .click();
await expect(page.locator("html")).toHaveAttribute("data-dyslexia", "false");
checks.push("Reading font, language stub and confirmed settings reset");
await page.setViewportSize({ width: 360, height: 800 });
await go("/");
await page
  .getByRole("navigation", { name: "Mobile navigation" })
  .getByRole("button", { name: "More" })
  .click();
await page.getByRole("dialog").getByRole("link", { name: "Timetable" }).click();
await expect(page.locator("h1")).toHaveText("Your timetable");
await page.getByRole("button", { name: /Tue.*20/ }).click();
await expect(page.locator(".mobile-selected")).toContainText(
  "Computer Security",
);
checks.push("Mobile More navigation and timetable day tabs");
await go("/not-a-real-page");
await page.getByRole("link", { name: "Back to dashboard" }).click();
await expect(
  page.getByRole("heading", { name: /A good day to grow/ }),
).toBeVisible();
checks.push("404 recovery");
expect(errors).toEqual([]);
await writeFile(
  "docs/click-audit.json",
  JSON.stringify({ checks, pageErrors: errors }, null, 2),
);
console.log(JSON.stringify({ checks, pageErrors: errors }, null, 2));
await browser.close();
