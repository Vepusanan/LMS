# HCI activity: redesign a messy interface

**Project:** Fōcus — Faculty of Computing learning space  
**Institution:** University of Sri Jayewardenepura  
**Prototype:** React + TypeScript, local browser data, no backend  
**Reference date:** Monday 19 October 2026, 09:00 Sri Lanka time  
**Status:** Implemented prototype and evaluation plan. **No participant testing has been conducted or claimed.**

This document follows the supplied `HCI_Messy_Interface_Redesign_Activity.pdf`. Observations come from the seven screenshots in `Exisiting_LMS_Images/` and the accompanying project brief. The visual direction follows the attached Ruslan Kosinov educational dashboard: charcoal navigation, lavender accents, soft cards, compact supporting information. The application is a redesign study, not an official university service.

The activity sheet’s third evaluation task says **course registration**; the supplied implementation brief instead specifies **exam registration**. This prototype implements exam registration. Use the exam task below for this project and disclose this scope substitution to the lecturer. Do not claim that course enrolment is implemented.

## Part A — Investigate the messy interface

| No. | Problem observed                                                                                    | Why it affects users                                                                                                                           |
| --- | --------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | A large home-page photo takes priority over student actions.                                        | Students must scroll before discovering deadlines or work that requires attention; the first screen does not answer their main question.       |
| 2   | Green links, orange headings, promotional cards and social icons compete for attention.             | Similar emphasis on unrelated elements weakens hierarchy and increases visual search effort.                                                   |
| 3   | The examination deadline is buried in a long notice.                                                | Students must read and remember a critical date; they may overlook it and miss an irreversible administrative deadline.                        |
| 4   | Placeholder promotional text, camera graphics and an untranslated footer appear in the public page. | Irrelevant content reduces trust and makes it harder to distinguish genuine course information from unfinished material.                       |
| 5   | Bright guest/cookie actions compete with the weaker login button; a username is pre-filled.         | The primary action is unclear, and students may submit the wrong identifier or expose another person’s details.                                |
| 6   | Dashboard timeline says no action is required while the calendar contains progress-report events.   | Contradictory feedback undermines confidence; students cannot safely rely on the dashboard.                                                    |
| 7   | A large, mostly empty calendar uses truncated event titles.                                         | Space is spent on empty cells while important distinctions between reports are hidden.                                                         |
| 8   | Full-name online-user listings and student edit controls add noise.                                 | Presence information is unnecessary for completing work and raises privacy concerns; editing controls imply permissions students may not have. |
| 9   | Courses from several semesters share one flat, access-sorted grid.                                  | Students must repeatedly search and recall which courses belong to the current semester.                                                       |
| 10  | Course titles are truncated and completion labels lack an explanation.                              | Students can confuse similarly named courses and cannot tell what “0% complete” measures.                                                      |
| 11  | Generic topic names and unexplained files do not reveal learning goals.                             | Students must open resources to understand them; scanability and orientation are poor.                                                         |
| 12  | Quiz answers appear directly beside the quiz without a clear release condition.                     | Students may access answers prematurely or misunderstand assessment rules.                                                                     |
| 13  | A grade table consists mostly of unexplained dashes.                                                | Students cannot distinguish “not graded,” “not submitted,” and missing information.                                                            |
| 14  | Uppercase participant names and stale last-access data dominate the list.                           | Names are harder to scan, and detailed activity history adds little academic value while exposing unnecessary personal information.            |
| 15  | Weak contrast, small controls, no obvious focus treatment and desktop-heavy navigation.             | Low-vision, keyboard and phone users face additional barriers and more accidental interactions.                                                |

### Discussion 1: Which elements compete for attention?

The original hero, orange announcements, coloured guest/cookie buttons, promotional graphics, many course cards, social links and online-user list all demand attention. Their size and colour do not correspond consistently to importance. Fōcus gives navigation a stable dark surface, reserves lavender for selected controls, and pairs warm urgency colours with explicit labels and clock/alert icons. Decorative course art is subordinate to readable titles and progress information.

### Discussion 2: What information should have the highest visual priority?

A student needs to identify the next actionable deadline, any overdue work, today’s classes and unread communications. The dashboard surfaces these through a next-deadline card, an urgency summary, a chronological deadline list, a compact timetable and an unread count. The closed January notice is explicitly closed instead of being presented as a current countdown. Course discovery follows these orientation cues. The mobile layout provides the same key action before the course grid.

### Discussion 3: How might the interface cause errors or frustration?

A misleading “no activities” message could cause a missed report; an incomplete course title could lead to the wrong assignment; an unexplained dash could be interpreted as failure. Truncated notices require extra searching and memory. The redesign uses one assignment dataset, full titles, explicit grade states, inline file/form validation, a registration review step, confirmations, and undo. File metadata is saved only after an explicit submission action, and closing an error does not clear the chosen file or form inputs.

### Discussion 4: Different user perspectives

- **First-year student:** unfamiliar course codes and hidden menus increase the learning burden. Consistent labels, course names beside codes, visible navigation, onboarding copy and the Help FAQ provide recognition cues. The assistant is optional; all tasks also have visible routes.
- **Person with a visual impairment:** pale links, tiny text and colour-only statuses can hide meaning. Adjustable text size, high contrast, themes, explicit labels, focus rings, semantic controls and non-colour status cues reduce barriers. Automated checks are not a substitute for testing with screen readers and people with visual impairments.
- **Student using a phone:** long grids, large calendars and desktop tables require excess scrolling and precision. Bottom navigation, single-column secondary screens, a compact calendar, day-based timetable tabs and grade cards adapt the information. Actual device testing should assess reachability, glare and performance.

## Part B — Apply HCI principles

| Principle                     | Change in our design                                                                                  | Expected benefit                                                                         | Actual implementation                                            |
| ----------------------------- | ----------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Perception                    | Type hierarchy, consistent surfaces, icons paired with labels, full course titles.                    | Easier differentiation of navigation, content and actions.                               | `src/styles/global.css`; Dashboard and Course cards              |
| Attention                     | Next-deadline card, overdue chips, urgency summary; decorative content is limited.                    | Faster recognition of time-sensitive work.                                               | `src/pages/Dashboard.tsx`; Assignments                           |
| Memory                        | Persistent navigation, breadcrumbs, same names across screens; deadline dates remain visible.         | Recognition replaces recalling paths and dates.                                          | `src/components/Layout.tsx`; Course detail and assignment detail |
| Learning                      | Predictable card/list patterns, explicit empty states, concise instructions, FAQs.                    | New students can build a reliable mental model.                                          | `src/pages/Other.tsx`; Help, Login and empty states              |
| Motor behaviour               | Touch-friendly mobile navigation and controls; native form controls; alternatives to drag-and-drop.   | Less precision required; keyboard and touch input remain possible.                       | `src/styles/global.css`; Upload area in `Assignments.tsx`        |
| Feedback                      | Progress bar during local submission, success states, live-region toasts, immediate progress changes. | Students can see that an action registered and understand its outcome.                   | `src/hooks/useStore.tsx`; `Assignments.tsx`; `Courses.tsx`       |
| Error prevention and recovery | File size/type checks, required fields, review before registration, confirm before deletion, undo.    | Prevents avoidable errors and provides a clear recovery path.                            | `Exam.tsx`, `Assignments.tsx`, `Messages.tsx`                    |
| Accessibility and inclusion   | Semantic landmarks, labelled fields, skip link, modal focus management, themes and non-colour states. | Broader access across vision, movement, device and input needs.                          | `UI.tsx`, `Layout.tsx`, `Settings.tsx`, global CSS               |
| User control                  | Search/sort/filter, settings persist, progress undo, editable local registration, clear chat history. | Students can shape the experience and reverse low-risk actions.                          | Courses, Settings, Exam registration and Assistant               |
| Privacy and trust             | Fictional participant names; no last-access history; local-only data and simulation notices.          | Reduces unnecessary disclosure and prevents mistaking a mock action for an official one. | Participants, messages, upload and registration screens          |

## Part C — Evolving HCI technologies

| Technology                              | User problem addressed                                               | Expected benefit                                                                               | Risk / limitation                                                                              | Mitigation in the prototype                                                                                                                                                                                |
| --------------------------------------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Conversational assistant                | Students may know their goal but not which page contains the answer. | Natural-language access to deadlines, ML lecture time, unread count and registration guidance. | A mock recogniser can misunderstand intent; replies may encourage overreliance.                | Rule-based answers from seed/state data only, linked destinations, “I’m not sure” fallback, visible accuracy notice, feedback controls and human handoff.                                                  |
| Voice interaction                       | Typing may be difficult or inconvenient for some users.              | Voice commands for timetable navigation and deadline queries; optional spoken replies.         | Support varies; recognition errors, ambient privacy and external browser speech processing.    | Feature detection, visible listening/error feedback, text alternatives, opt-in speech output and a privacy warning. Actual recognition must be verified in a supported browser with microphone permission. |
| Personalisation / context-aware support | Uniform notifications and unprioritised work can overwhelm students. | Date-sorted work, “Due tomorrow” cues, saved preferred view/accessibility settings.            | Over-filtering could hide important work; local preferences do not deliver real notifications. | All updates remain available in the notifications center; digest/quiet-hour/category settings are explicit local preferences, optional dashboard reminders respect them. No server delivery is claimed.    |
| Responsive web interaction              | Students move between laptop and phone.                              | A coherent experience with bottom tabs, day tabs and card-based grade details.                 | A visually fitting page can still be difficult to use with touch or assistive technology.      | Automated viewport checks, focus and semantic checks, followed by real device and participant evaluation.                                                                                                  |

## Part D — Design planning and implementation

### Target users and context

Undergraduate computing students, including new students learning university processes, students with accessibility needs, and returning students reviewing previous semesters. Typical contexts include a laptop during study and a phone while moving between classes. Seeded identity is **Vepusanan N., FC000000, Year 3 BSc Computer Science**; no real credentials are required.

### Platform

Responsive web application with React, TypeScript, Vite and hash routing. LocalStorage persists settings, messages, assignment metadata, completion markers, chat and practice records. The prototype has no backend, university integration, API requests, authentication security, email service or upload storage. Optional browser speech recognition can involve a browser-managed external service.

### Key principles and visual direction

Prioritise recognition over recall, clear hierarchy, honest feedback, error prevention, visible recovery and user control. The supplied new-style reference takes precedence over the older green/orange theme. Charcoal and lavender establish the principal visual identity; muted green indicates positive states; warm peach indicates urgency. Locally constructed CSS/Lucide course illustrations avoid meaningless image placeholders and external asset dependencies.

### Chosen technologies

A rule-based conversational assistant, Web Speech API feature detection, local preference personalisation, responsive CSS and browser-generated ICS/CSV downloads. These technologies are justified by findability and access needs, not novelty alone.

### Main layout and navigation

Desktop: persistent charcoal sidebar, search/notification/profile top bar, central workspace, compact dashboard support rail. Mobile: sticky top bar, Home/Courses/Deadlines/Messages/More bottom tabs; secondary pages use full width. `Ctrl/Cmd+K` opens global search. Deep routes provide breadcrumbs and return links. Modals close with Escape and constrain focus while open.

### Screen inventory

| Route                  | Screen                              | Main tasks                                                                                                              |
| ---------------------- | ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `/#/login`             | Login                               | Validate demo credentials, toggle password, simulated reset, guest entry, dismiss storage notice.                       |
| `/#/`                  | Dashboard                           | Identify next/overdue work, continue learning, inspect classes and calendar, open unread messages.                      |
| `/#/courses`           | My courses                          | Search code/title, filter, sort, star, switch grid/list, expand older semesters.                                        |
| `/#/courses/:id`       | Course detail                       | Overview, weekly resources, completion/undo, quiz and locked answers, assignments, grades, participants, announcements. |
| `/#/assignments`       | Assignments                         | Status filtering, list/calendar view and full due dates.                                                                |
| `/#/assignments/:id`   | Assignment detail                   | Validate/select file, simulate submission, replace/remove before due date.                                              |
| `/#/timetable`         | Timetable                           | Desktop week/mobile day views, week navigation, return to current week, ICS export.                                     |
| `/#/exam-registration` | Exam registration                   | Read closed official notice; complete, review, edit/withdraw a local practice record.                                   |
| `/#/messages`          | Inbox                               | Search/read/unread/star, delete/undo, compose and reply locally.                                                        |
| `/#/notifications`     | Notifications                       | Filter by priority/unread; mark read; follow action links.                                                              |
| `/#/grades`            | Grades                              | Select course and inspect weights, sample scores and explanations.                                                      |
| `/#/participants`      | Participants                        | Search, role filter, pagination, privacy-limited profile. Also available inside courses.                                |
| `/#/settings`          | Settings/accessibility              | Theme, text size, contrast, motion, reading font, nav-language stubs, notification preferences.                         |
| `/#/help`              | Help/support                        | FAQs, draft support request, local download, human handoff.                                                             |
| `/#/usability`         | Usability mode                      | Anonymous ID, per-task timing, outcome/notes and CSV export.                                                            |
| Any unknown route      | 404                                 | Actionable route back to dashboard.                                                                                     |
| Across routes          | Assistant / search / error boundary | Goal-based help, searchable navigation and recoverable runtime error state.                                             |

### Navigation map

```text
Login / Guest entry
└── Dashboard
    ├── Courses → Course detail
    │   ├── Overview / Content → Complete activity / Quiz → Answers
    │   ├── Assignments → Assignment detail → Local submission
    │   ├── Grades / Participants → Profile → Compose message
    │   └── Announcements → Exam registration / Help
    ├── Assignments ↔ Calendar → Assignment detail
    ├── Timetable → Course detail / ICS download
    ├── Messages → Thread → Reply / Read / Star / Delete + Undo
    ├── Grades → Course assessment summary
    ├── Exam registration → Details → Subjects → Review → Practice confirmation
    ├── Notifications → Related course, assignment, registration or help
    ├── Settings → Live preferences / Reset
    └── Help → FAQ / Support draft / Usability test mode
Global: Search (Ctrl/Cmd+K) → route; Assistant → linked answer / human support
Profile: Settings / Usability mode / Log out
Mobile More: Timetable / Grades / Exam registration / Settings / Help / Usability
```

### Date and content decisions

- The supplied notice closed **23 January 2026 at 13:00**; the prototype date is **19 October 2026**. The notice remains closed. A visibly separate practice form allows evaluation without inventing a new official deadline.
- Dashboard and assignment dates come from the same seed. The two progress reports are 23 and 30 October. Countdown values use the frozen demo date/time so tests are repeatable.
- Two courses share CCS3062 in the supplied brief. Unique internal IDs prevent collisions, while visible codes preserve the source and an explanatory note asks students to verify official identifiers.
- The sheet does not supply lecture PDFs. Download controls explicitly simulate a download instead of pretending that actual course materials exist.

## Part E — Evaluate the redesign

### Evaluation plan

Recruit 3–5 consenting students from another group, including someone unfamiliar with this LMS. Where feasible include a keyboard-only user and test a phone-sized display. Do not claim disability coverage without relevant participants. Use fictional data and anonymous IDs. Explain that the interface, not the student, is being tested. Ask permission before taking notes; do not record audio/video without specific consent.

Use `/#/usability` in a moderator tab. Open the workspace in a second tab, preferably on a separate display/device. Start a task timer when the instruction finishes. Do not reveal navigation labels beyond what the task naturally requires. Let the student think aloud without coaching. Stop timing at the success criterion, abandonment or a pre-agreed 120-second limit. Note assistance separately; assisted completion is not independent success. Export the CSV after each participant before starting a new session. Reload the participant workspace to receive saved changes made in another tab.

Collect task success, time, wrong turns, assistance, navigation path, quotes and a short 1–5 ease rating. Compare against the original screenshots through a guided findability walkthrough; screenshots cannot establish equivalent interactive task times. If comparing performance, build or use a functioning baseline and counterbalance task order. Automated browser results establish implementation behaviour only, not usability improvement.

### Five-task test script

| Task              | Read to participant                                                                                                                         | Independent success criterion                                                                                         | Starting state                | Observe                                                                                               |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ----------------------------- | ----------------------------------------------------------------------------------------------------- |
| 1. Next deadline  | “You want to plan your next study session. Find the next upcoming assignment deadline and tell me the title and due time.”                  | Neural networks Practical 03, 20 Oct 2026, 23:59 Sri Lanka time. Student distinguishes it from the overdue practical. | Dashboard, fresh demo state.  | Which cue is noticed; date/time comprehension; confusion about overdue work.                          |
| 2. Timetable      | “You are getting ready for class. Find when and where your Machine Learning lecture takes place.”                                           | Monday 09:00–11:00, Lecture Hall 02.                                                                                  | Dashboard.                    | Sidebar vs search/assistant; mobile More discovery; interpretation of current week.                   |
| 3. Registration   | “You want to check how to register for your exams. Find the registration page and tell me whether official registration is currently open.” | Opens Exam registration and states that January window is closed; recognises practice mode is not official.           | Dashboard.                    | Deadline visibility; practice/official distinction; wrong assumption that a record is an application. |
| 4. Unread message | “A lecturer has sent you a message you have not read. Find and open it.”                                                                    | Opens an initially unread lecturer message and understands the read indicator change.                                 | Dashboard, seed unread state. | Meaning of badge and unread indicator; route taken; whether preview suffices.                         |
| 5. Preference     | “Make the learning space more comfortable by changing a notification or accessibility preference of your choice.”                           | Changes a preference, observes its effect and can locate it after reload.                                             | Dashboard.                    | Discovery; label comprehension; visibility of automatic saving.                                       |

### Blank observation table — complete after actual testing

| Participant | Task | Time (s) | Outcome (independent / assisted / failed) | What the tester did or struggled with | Quote / ease rating | Change we would make |
| ----------- | ---- | -------- | ----------------------------------------- | ------------------------------------- | ------------------- | -------------------- |
|             | 1    |          |                                           |                                       |                     |                      |
|             | 2    |          |                                           |                                       |                     |                      |
|             | 3    |          |                                           |                                       |                     |                      |
|             | 4    |          |                                           |                                       |                     |                      |
|             | 5    |          |                                           |                                       |                     |                      |

### Discussion: usability improvement or appearance only?

**Not yet established through participant evidence.** The prototype has plausible improvements in findability, date consistency, validation and recovery. Automated tests can demonstrate that workflows complete and settings persist, but they cannot demonstrate reduced confusion, anxiety or cognitive load. After testing, compare task success, hesitation, wrong turns and comments. A participant who admires the visuals but cannot distinguish official registration from practice exposes an HCI failure regardless of visual quality. Use the blank table to justify revisions and retest them.

## Knowledge reflection — DRAFT outlines to personalise

These are **draft answer outlines**, not claims about tests that have occurred. Replace evidence prompts with your own observations and writing.

### 1. Which human capability or limitation most influenced your redesign, and why?

- Candidate focus: limited attention and working memory during busy academic routines.
- Explain how competing announcements and flat course lists demand recall and scanning.
- Connect visible navigation, full titles, consistent dates and the next-deadline cue to recognition.
- Add a personal example from the original interface and a real observation from Task 1.
- Consider an alternative influence such as motor precision or low vision based on the actual testers.

### 2. Which HCI principle had the greatest effect on usability? Give one example.

- Candidate principle: feedback and error recovery, or attention depending on observed results.
- Example: a rejected upload explains acceptable types without erasing the current selection; successful submission shows progress and a confirmation.
- Contrast this with the original ambiguous completion/grade indicators.
- Add a specific task observation, not an assumed benefit.

### 3. How did the chosen emerging technologies improve interaction? What risks did they introduce?

- Explain the assistant’s shortcut from a goal (“next deadline”) to a linked page.
- Explain voice as an alternative input method, not a replacement for visible navigation.
- Discuss misunderstanding, reliance, speech privacy and browser support.
- Connect each risk to a visible mitigation and note where mitigation is incomplete.
- Use actual assistant/voice trial evidence if available; otherwise label it untested.

### 4. What did user testing reveal that your team had not anticipated?

- **Leave the conclusion blank until testing.**
- Record participant ID, task, exact behaviour and quote.
- Explain why the behaviour differed from the team’s expectation.
- Distinguish an isolated preference from a recurring or severe usability problem.
- Identify the resulting design change and a retest criterion.

### 5. If you redesigned the interface again, what would you change and why?

- Prioritise revisions by severity, frequency and affected users.
- Potential research questions: are mobile More destinations discoverable, are pastel cards readable in glare, and is the closed/practice registration distinction sufficiently clear?
- Choose the revision from real findings rather than assuming these are confirmed problems.
- State what would change, the expected task benefit, and how the next test would verify it.

### Lecturer’s closing question: latest AI but confused, anxious or dependent users — good HCI?

- Position: technological novelty alone does not establish good HCI.
- Evaluate effectiveness, efficiency, accessibility, autonomy, trust and emotional impact.
- An assistant that hides navigation or gives overconfident dates can make an attractive system less usable.
- Good support should communicate uncertainty, explain its limits, preserve alternatives and allow human help.
- A carefully scoped mock assistant can be appropriate if it meets real goals; a sophisticated model can be inappropriate if it undermines control.
- Conclude with evidence from your evaluation and acknowledge remaining uncertainty.
