import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { writeFile } from "node:fs/promises";
const browser = await chromium.launch({ channel: "chrome" });
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
});
const page = await context.newPage();
const results = [];
for (const theme of ["light", "dark"]) {
  for (const route of [
    "/",
    "/courses",
    "/courses/ml?tab=Content",
    "/assignments",
    "/assignments/a1",
    "/timetable",
    "/messages",
    "/notifications",
    "/exam-registration",
    "/settings",
    "/grades",
    "/participants",
    "/help",
    "/usability",
    "/login",
  ]) {
    await page.goto("http://127.0.0.1:5173/#" + route, {
      waitUntil: "networkidle",
    });
    await page.locator("h1,h2").first().waitFor();
    await page.evaluate((theme) => {
      document.documentElement.dataset.theme = theme;
    }, theme);
    const r = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    const violations = r.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      nodes: v.nodes.map((n) => ({
        target: n.target,
        summary: n.failureSummary,
      })),
    }));
    results.push({ theme, route, violations });
    console.log(
      theme,
      route,
      violations.length
        ? JSON.stringify(
            violations.map((v) => ({
              id: v.id,
              nodes: v.nodes.map((n) => n.target),
            })),
          )
        : "PASS",
    );
  }
}
await writeFile(
  "docs/accessibility-audit.json",
  JSON.stringify(results, null, 2),
);
await browser.close();
