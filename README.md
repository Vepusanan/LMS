# Fōcus — Faculty of Computing LMS redesign

A working, frontend-only learning workspace for the University of Sri Jayewardenepura HCI redesign activity. Built from the original LMS screenshots and the attached educational-dashboard style reference. Charcoal navigation, lavender accents, locally drawn course illustrations, a compact calendar and responsive cards create a coherent learning space.

## Run locally

Requires Node.js 20.19+ or 22.12+ and npm.

```bash
npm install
npm run dev
```

Open the Local URL printed by Vite (normally `http://localhost:5173`). The dashboard opens immediately in demo mode. Visit `/#/login` to try login:

- Student ID: **FC000000**
- Password: **Focus2026!**
- “Continue as guest” also opens the demo workspace.

```bash
npm run build
npm run preview
```

The production output is `dist/`. Serve it over HTTP using `npm run preview` or any static host. Hash routing avoids server-side route rewrites. Opening `dist/index.html` directly with `file://` is not supported by browser ES-module security rules. This is a local project; it has not been deployed to a public service.

## What works

| Screen            | Implemented interactions                                                                                                                                                                                                                                       |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Login             | Empty credential fields, demo credential validation, show/hide password, simulated reset flow, guest entry and dismissible storage notice.                                                                                                                     |
| Dashboard         | Continue-learning links, next deadline/countdown, early urgency summary, date-sorted deadline filters, calendar month/day navigation, timetable links, unread inbox link and closed exam notice.                                                               |
| My courses        | 25 seeded courses, semester grouping, current/in-progress/completed/starred filters, code/title search, name/progress/access sorting, grid/list view and persistent stars.                                                                                     |
| Course detail     | Six working tabs; seven named weekly resources; simulated download feedback; activity completion with undo; quiz submission and answer locking; linked assignments, assessment breakdown, participants and announcements.                                      |
| Assignments       | All four statuses, status filters, list/calendar views, detailed instructions, PDF/DOCX/ZIP validation, 10 MB limit, drag-and-drop/file picker, simulated progress, persistent submission metadata, replace/remove with confirmation and undo before deadline. |
| Timetable         | Week layout, mobile day tabs, current-day indication, previous/next week empty states, Today reset and generated `.ics` download.                                                                                                                              |
| Exam registration | Original deadline displayed as closed; separate practice workflow with validated details, subjects, review, reference confirmation, edit and withdraw/undo; repeat-payment information.                                                                        |
| Messages          | 12 seeded conversations, unread count, search/filter, threads, read/unread, star, delete confirmation/undo, compose validation and local replies.                                                                                                              |
| Notifications     | 16 seeded updates, priority sections, unread/priority filters, per-item read state and action links, mark all read.                                                                                                                                            |
| Grades            | Seeded GPA/credits summary, course selector, assessment weights, sample score/feedback and explicit “Not graded yet” states.                                                                                                                                   |
| Participants      | 28 fictional participants, normal case names, search, role filter, pagination, private profile preview and local compose handoff.                                                                                                                              |
| Settings          | Light/dark/system theme, text-size control, high contrast, reduced motion, reading-friendly font, Sinhala/Tamil main-nav label stubs, local digest/quiet-hour/category preferences, optional spoken replies and reset confirmation.                            |
| Help              | FAQ accordions, validated persistent support draft, downloadable support request, assistant guidance and usability-mode link.                                                                                                                                  |
| Usability mode    | Five task timers, anonymous participant IDs, success/failure/notes, participant-specific stored results and CSV download.                                                                                                                                      |
| Global            | Collapsible desktop sidebar, mobile bottom navigation and More dialog, breadcrumbs, `Ctrl/Cmd+K` command search, notification dropdown, profile menu, accessible modals, Escape, focus return, skip link, toast feedback, 404 and runtime error recovery.      |
| Assistant / voice | Four rule-based intents using current local data, linked answers, suggested prompts, unknown-question fallback, helpful/unhelpful feedback, clear history, human handoff, Web Speech recognition feature detection and optional speech synthesis.              |

Every visible action has an implementation. Downloads for lecture resources intentionally produce a **simulated download toast**, because the actual PDFs/PPTs were not supplied. File, message, reset, support and registration flows explicitly state their local/demo result.

## Important data decisions

- **Frozen demo clock:** 19 October 2026 at 09:00, Asia/Colombo. Dates, relative labels, the countdown and submission cutoff use this reference, not the host machine’s current clock. The countdown changes when the next assignment changes; it is not a real-time academic deadline service.
- **Closed original exam notice:** 23 January 2026, 13:00 has already passed. No replacement official deadline was invented. The practice form can be edited/withdrawn at any time and never registers a student with the university.
- **Task wording conflict:** the HCI PDF says “course registration”; the supplied project brief says “exam registration.” The app implements exam registration and the HCI document discloses the substitution. Course enrolment is not implemented.
- **Duplicate course code:** the supplied dataset uses CCS3062 for both Machine Learning and Computer Security. Both visible codes are preserved; internal course IDs differ. A course-detail note explains this.
- **Progress:** Machine Learning begins with zero of eight local activities. Other courses retain supplied/seeded baseline progress; completing the eight demo activities advances the remaining portion. Cards, detail headers, filtering and sorting use the same calculation. Historical scores, GPA, streak and study-hour chart are illustrative.
- **Timetable export:** exported events use Sri Lanka local floating times; import them into a calendar configured for Sri Lanka. Only the seeded week is exported.

## Persistence and boundaries

All data is seeded in `src/data/seed.ts`; user changes are stored under `focus-*` localStorage keys. There is no backend, real authentication, university integration, external API request, messaging delivery, payment processing or remote file storage. The application’s assets are local CSS/SVG icons and system fonts. No external image/font request is required.

Uploads store **filename, size and submission date only**, never file contents. Keep your original files. Notifications/email/push switches store preferences; they cannot send notifications. Assignment reminder copy respects category, digest and quiet-hour preferences while essential deadlines remain visible. The full notification center is never hidden.

Browser speech recognition may use a browser-managed external speech service and requires browser support/permission. Text alternatives remain available. Speech recognition accuracy and actual microphone access were not tested automatically. Sinhala/Tamil options translate the main navigation labels only. Reading-friendly mode uses Verdana, not a bundled specialist font.

Browser storage does not sync across devices and is not appropriate for confidential records. To start with fresh demo data, use a separate browser profile or clear this site’s browser storage. Settings Reset changes preferences only; it preserves coursework and messages. New usability participant IDs have separate result sets. Export before sharing a device.

## Verification

```bash
npm test
```

The Playwright configuration uses an installed Google Chrome (`channel: 'chrome'`). If Chrome is unavailable, install Chromium with `npx playwright install chromium` and remove `channel: 'chrome'` from `playwright.config.ts`. Tests start/reuse Vite on port 5173. The HTML report is in `playwright-report/`.

Ten browser tests cover:

1. Next deadline, file validation and persisted submission.
2. Timetable discovery, week controls and ICS export.
3. Registration discovery, validation, review and practice confirmation.
4. Unread message discovery, delete and undo.
5. Accessibility/notification settings persistence.
6. Course search, completion undo and quiz answer unlocking.
7. Command search, modal keyboard containment and assistant fallback.
8. Nine screens at **360, 768, 1024 and 1440px** with no horizontal overflow.
9. Usability timing/results and CSV export.
10. Axe checks for serious/critical issues on primary screens.

Additional repeatable audits (start `npm run dev` first):

```bash
node scripts/audit.mjs
node scripts/click-audit.mjs
```

- `docs/accessibility-audit.json`: axe WCAG 2 A/AA, 2.1 AA and 2.2 AA checks across 15 routes in light and dark themes.
- `docs/click-audit.json`: additional interaction coverage and browser exception log.
- `docs/QA_REPORT.md`: scope and final results.
- `docs/screenshots/`: rendered responsive and dark-theme captures.

Automated checks are **not** participant usability results or complete accessibility certification. Screen-reader testing, real device ergonomics and voice recognition still need human evaluation.

## HCI deliverables

- [Completed activity and evaluation protocol](docs/HCI_ACTIVITY.md): Parts A–E, exact discussion/reflection questions, draft outlines and blank observation table.
- [Design rationale](docs/DESIGN_RATIONALE.md): concise before/after decisions.
- [10-slide presentation outline](docs/PRESENTATION_OUTLINE.md).
- In-app evaluation workspace: `/#/usability`.

## Project layout

```text
src/
  components/       Layout, shared UI, assistant and voice input
  data/seed.ts      Demo courses, deadlines, timetable, people and notices
  hooks/useStore.tsx Persistent local state and preferences
  pages/            Route screens and workflows
  styles/global.css Tokens, light/dark themes and responsive layouts
  main.tsx          Lazy route loading and error boundary
scripts/            Accessibility and interaction audits
tests/              Ten Playwright browser tests
docs/               HCI deliverables, QA results and screenshots
```

The original screenshots and activity PDF are preserved unchanged. Source files have been formatted for review. The app uses React 19, TypeScript, Vite, React Router and Lucide icons.
