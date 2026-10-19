# Quality and verification report

Date: 19 October 2026. These are **implementation checks**, not results from human usability testing.

## Verification scope

- Production build uses TypeScript strict mode, unused-local/parameter checks and Vite bundling.
- Ten Playwright tests cover the five evaluation tasks, course activity/quiz state, search/assistant behaviour, responsive layouts, usability export and automated accessibility.
- Responsive checks inspect dashboard, courses, course content, assignments, timetable, messages, grades, settings and registration at 360, 768, 1024 and 1440px.
- Axe audit checks 15 routes in light and dark themes (30 route/theme combinations), using WCAG 2 A/AA, 2.1 AA and 2.2 AA tags. It includes dashboard, courses, course content, assignments, upload detail, timetable, messages, notifications, registration, settings, grades, participants, help, usability mode and login.
- Additional click audit covers login/reset/password visibility, skip link, sidebar collapse, course filters/sort/views, all detail tabs, resource feedback, participant messaging, read state, help draft/download, preference reset, mobile More/day tabs and 404 recovery.
- Visual review includes desktop, 360px mobile and dark-theme dashboard captures. Screenshots are generated from the implemented app rather than mockups.

## Corrections made during verification

- Fixed relative deadlines to use Sri Lanka calendar days rather than rounding elapsed hours.
- Derived the countdown and assistant due time from the selected assignment.
- Kept validation error descriptions separate from field accessible names.
- Prevented modal focus from resetting on every keystroke.
- Prevented the skip link from being interpreted as a hash-router page.
- Unified course progress calculations across cards, detail headers and filters.
- Increased contrast on pastel labels, the timetable exam card, login artwork and dark-theme surfaces.
- Added a next-action summary above course cards for mobile access.
- Separated usability results by participant ID.

## Final results

| Check                          | Result                                                                   |
| ------------------------------ | ------------------------------------------------------------------------ |
| Playwright suite               | **10/10 passed**; final full run completed in 36.5 seconds.              |
| Responsive overflow            | **36 route/width combinations passed** across 360, 768, 1024 and 1440px. |
| Expanded axe audit             | **0 violations** across 15 routes in both themes, 30 combinations.       |
| Additional click-through audit | **11 workflow groups passed**, **0 uncaught page errors**.               |
| Production compilation         | TypeScript strict checks and Vite production bundling passed.            |

## Evidence

Final automated test/build results are reported in the project handoff. Machine-readable audit details are in `accessibility-audit.json` and `click-audit.json`. Playwright produces a local HTML report and traces for any failing test.

## Limits

No participant testing is claimed. The HCI observation table is intentionally blank. Axe cannot establish full WCAG conformance; real keyboard/screen-reader sessions and phone interaction should follow. Browser speech recognition and microphone permissions require a supported browser and a user-initiated real voice trial. The frozen clock makes this a repeatable prototype, not an official live deadline source. Local-only submissions/messages/registration do not reach university systems.
