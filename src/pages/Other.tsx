import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  Eye,
  EyeOff,
  BookOpen,
  LifeBuoy,
  Play,
  Square,
  Download,
  X,
} from "lucide-react";
import { courses } from "../data/seed";
import { useLocal, useStore } from "../hooks/useStore";
import { PageTitle, Chip, Modal, download, Empty } from "../components/UI";
import { CourseGrades } from "./Courses";
export function Grades() {
  const [id, setId] = useState("ml");
  return (
    <>
      <PageTitle
        eyebrow="MORE THAN A NUMBER"
        title="Your learning, reflected"
        description="Understand your progress and find your next opportunity to grow."
      />
      <div className="grade-stats">
        <div className="panel lavender">
          <span>Cumulative GPA</span>
          <strong>
            3.62 <small>/ 4.00</small>
          </strong>
          <Chip>Illustrative academic record</Chip>
        </div>
        <div className="panel">
          <span>Credits completed</span>
          <strong>
            72 <small>/ 120</small>
          </strong>
          <p>Across completed semesters</p>
        </div>
        <div className="panel">
          <span>This semester</span>
          <strong>
            08 <small>courses</small>
          </strong>
          <p>Final results not released yet</p>
        </div>
      </div>
      <label className="course-select">
        Course
        <select value={id} onChange={(e) => setId(e.target.value)}>
          {courses.slice(0, 8).map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
      </label>
      <CourseGrades courseId={id} />
    </>
  );
}
const faqs = [
  [
    "How do I find my next deadline?",
    "Open Dashboard and check Next deadline, or go to Assignments. Overdue work is clearly labelled and the calendar uses the same dates.",
  ],
  [
    "How do I submit an assignment?",
    "Open an assignment, choose a PDF, DOCX or ZIP file under 10 MB, then select Submit assignment. In this prototype only the filename and size are saved in your browser.",
  ],
  [
    "Can I register for my exams here?",
    "The original January 2026 registration window is closed. Exam registration includes a practice form, which does not make an official application. Contact the Faculty Office for current registration instructions.",
  ],
  [
    "Where are my grades?",
    "Open Grades to see a course assessment breakdown. “Not graded yet” means a lecturer has not released a result. All scores in this prototype are illustrative.",
  ],
  [
    "How do I make the text easier to read?",
    "Open Settings & accessibility to adjust text size, enable high contrast, change the reading font or use dark mode. All changes apply immediately.",
  ],
  [
    "Is my information private?",
    "Your prototype data stays in your browser’s localStorage. No files or messages are sent. Your browser’s optional voice recognition may use a speech provider; avoid dictating private information.",
  ],
];
export function Help() {
  const [params] = useSearchParams();
  const [contact, setContact] = useState(params.has("contact"));
  const [sent, setSent] = useState(false);
  const [name, setName] = useLocal("support-name", "");
  const [email, setEmail] = useLocal("support-email", "");
  const [message, setMessage] = useLocal("support-message", "");
  const [error, setError] = useState("");
  return (
    <>
      <PageTitle
        eyebrow="YOU DON’T HAVE TO FIGURE IT OUT ALONE"
        title="A little help, whenever you need it."
        description="Find an answer, ask your companion, or reach out to a human."
      />
      <div className="two-col">
        <section className="panel">
          <h2>Frequently asked questions</h2>
          {faqs.map(([q, a]) => (
            <details className="faq" key={q}>
              <summary>
                {q}
                <ChevronDown size={17} />
              </summary>
              <p>{a}</p>
            </details>
          ))}
        </section>
        <aside className="stack">
          <section className="panel lavender">
            <LifeBuoy size={32} />
            <h2>Real questions. Human help.</h2>
            <p>
              Some things are better discussed with a person. Prepare a support
              request for the Faculty Office.
            </p>
            <button
              className="button dark"
              onClick={() => {
                setContact(true);
                setSent(false);
              }}
            >
              Contact support <ArrowUpRight size={16} />
            </button>
          </section>
          <section className="panel">
            <h2>Meet your learning companion</h2>
            <p>
              Use the “Ask Fōcus” button to ask about deadlines, your timetable,
              unread messages or exam registration.
            </p>
            <p className="fine-print">
              Rule-based assistance can misunderstand a question. Verify
              important dates with your faculty. Your conversations stay in this
              browser.
            </p>
          </section>
          <Link to="/usability" className="panel text-link">
            Run a usability session <ArrowUpRight size={18} />
          </Link>
        </aside>
      </div>
      {contact && (
        <Modal
          title={sent ? "Support request saved" : "Talk to a human"}
          onClose={() => setContact(false)}
        >
          {sent ? (
            <>
              <div className="success-art">
                <Check size={32} />
              </div>
              <h3>Your request is ready.</h3>
              <p>
                Saved locally as a draft. This prototype cannot send it to the
                Faculty Office. Download a copy and share it through your
                university’s official support channel.
              </p>
              <button
                className="button primary"
                onClick={() =>
                  download(
                    "support-request.txt",
                    `Name: ${name}\nEmail: ${email}\n\n${message}`,
                  )
                }
              >
                <Download size={16} />
                Download request
              </button>
            </>
          ) : (
            <form
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                if (
                  !name.trim() ||
                  !message.trim() ||
                  !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
                ) {
                  setError(
                    "Add your name, a valid email address, and a short description.",
                  );
                  return;
                }
                localStorage.setItem(
                  "focus-support",
                  JSON.stringify({ name, email, message }),
                );
                setSent(true);
              }}
            >
              <label>
                Your name
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </label>
              <label>
                Email address
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
              <label>
                How can we help?
                <textarea
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </label>
              <p className="field-error" role="alert">
                {error}
              </p>
              <p className="fine-print">
                No support request is sent outside this demo.
              </p>
              <button type="submit" className="button primary">
                Save support request
              </button>
            </form>
          )}
        </Modal>
      )}
    </>
  );
}
const tasks = [
  "Find the next deadline",
  "Locate the timetable",
  "Find exam registration",
  "Find an unread message",
  "Change a notification or accessibility preference",
];
type Result = {
  participant: string;
  task: number;
  seconds: number;
  outcome: string;
  notes: string;
};
export function Usability() {
  const [results, setResults] = useLocal<Result[]>("usability-results", []);
  const [active, setActive] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [notes, setNotes] = useState("");
  const [participant, setParticipant] = useLocal("test-participant", "P01");
  const currentResults = results.filter((r) => r.participant === participant);
  useEffect(() => {
    if (active === null) return;
    const start = Date.now();
    const timer = setInterval(
      () => setElapsed(Math.floor((Date.now() - start) / 1000)),
      250,
    );
    return () => clearInterval(timer);
  }, [active]);
  function finish(outcome: string) {
    if (active === null) return;
    setResults((v) => [
      ...v.filter((r) => r.task !== active || r.participant !== participant),
      { participant, task: active, seconds: elapsed, outcome, notes },
    ]);
    setActive(null);
    setNotes("");
  }
  function exportResults() {
    const cell = (s: string) => '"' + s.replace(/"/g, '""') + '"';
    download(
      "focus-usability-" + participant + ".csv",
      "Participant,Task,Seconds,Outcome,Notes\r\n" +
        currentResults
          .map((r) =>
            [participant, tasks[r.task], String(r.seconds), r.outcome, r.notes]
              .map(cell)
              .join(","),
          )
          .join("\r\n"),
      "text/csv",
    );
  }
  return (
    <>
      <PageTitle
        eyebrow="OBSERVE. LISTEN. LEARN."
        title="Usability test mode"
        description="Run the five evaluation tasks with another student. Record real observations, never assumptions."
        action={
          <button
            className="button primary"
            onClick={exportResults}
            disabled={!currentResults.length}
          >
            <Download size={16} />
            Export CSV
          </button>
        }
      />
      <div className="notice">
        Ask for consent before starting. Use an anonymous participant ID. Open
        the app in a second tab so this timer can remain running.
      </div>
      <div className="toolbar">
        <label>
          Participant ID
          <input
            disabled={active !== null}
            value={participant}
            onChange={(e) => setParticipant(e.target.value)}
            aria-label="Participant ID"
          />
        </label>
        <a
          className="button secondary"
          href="#/"
          target="_blank"
          rel="noreferrer"
        >
          Open test workspace <ArrowUpRight size={16} />
        </a>
      </div>
      <div className="panel">
        {tasks.map((task, i) => {
          const result = currentResults.find((r) => r.task === i);
          return (
            <div className="test-task" key={task}>
              <span className="task-number">
                {result ? <Check size={17} /> : i + 1}
              </span>
              <div className="flex-grow">
                <h3>{task}</h3>
                <p>
                  {result
                    ? `${result.outcome} · ${result.seconds} seconds · ${result.notes || "No notes"}`
                    : "Not yet observed"}
                </p>
              </div>
              <button
                className="button secondary"
                disabled={active !== null}
                onClick={() => {
                  setElapsed(0);
                  setActive(i);
                }}
              >
                <Play size={14} />
                {result ? "Run again" : "Start task"}
              </button>
            </div>
          );
        })}
      </div>
      {active !== null && (
        <section className="panel timer-panel" aria-live="polite">
          <Chip tone="lavender">TASK {active + 1} IN PROGRESS</Chip>
          <h2>{tasks[active]}</h2>
          <strong className="timer">
            {String(Math.floor(elapsed / 60)).padStart(2, "0")}:
            {String(elapsed % 60).padStart(2, "0")}
          </strong>
          <label>
            Observations
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Record hesitations, wrong turns, comments and assistance given."
            />
          </label>
          <div className="row">
            <button
              className="button primary"
              onClick={() => finish("Success")}
            >
              <Check size={16} />
              Success
            </button>
            <button
              className="button secondary"
              onClick={() => finish("Failed")}
            >
              <Square size={15} />
              Failed
            </button>
            <button className="text-button" onClick={() => setActive(null)}>
              Cancel task
            </button>
          </div>
        </section>
      )}
      <p className="fine-print">
        Results persist separately for each participant ID on this device.
        Export each session before sharing the device. A task counts as
        successful only when completed without moderator assistance; document
        any help in notes.
      </p>
    </>
  );
}
export function Login() {
  const navigate = useNavigate();
  const { setSession } = useStore();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [forgot, setForgot] = useState(false);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [cookie, setCookie] = useLocal("cookie", false);
  return (
    <div className="login-page">
      <section className="login-art">
        <Link className="brand" to="/">
          <span className="brand-mark">
            <BookOpen />
          </span>
          fōcus.
        </Link>
        <div>
          <span className="eyebrow">FACULTY OF COMPUTING</span>
          <h2>
            A little focus.
            <br />A world of
            <br />
            possibility<span>✳</span>
          </h2>
          <p>
            Your courses, your community, your next chapter.
            <br />
            All in one thoughtful space.
          </p>
        </div>
        <small>University of Sri Jayewardenepura</small>
      </section>
      <section className="login-form">
        <div className="login-form-inner">
          <Chip tone="lavender">YOUR LEARNING SPACE</Chip>
          <h1>Good to see you.</h1>
          <p>Sign in and pick up where you left off.</p>
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              if (
                id.trim().toUpperCase() !== "FC000000" ||
                password !== "Focus2026!"
              ) {
                setError(
                  "Use student ID FC000000 and password Focus2026! for this demo.",
                );
                return;
              }
              setSession("student");
              navigate("/");
            }}
          >
            <label>
              Student ID
              <input
                autoComplete="username"
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="Enter your student ID"
                aria-invalid={!!error}
                aria-describedby="login-error"
                required
              />
            </label>
            <label>
              Password
              <div className="password-field">
                <input
                  autoComplete="current-password"
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  aria-invalid={!!error}
                  aria-describedby="login-error"
                />
                <button
                  type="button"
                  className="icon-button"
                  aria-label={show ? "Hide password" : "Show password"}
                  onClick={() => setShow((v) => !v)}
                >
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>
            <button
              type="button"
              className="text-button forgot"
              onClick={() => {
                setForgot(true);
                setSent(false);
              }}
            >
              Forgot password?
            </button>
            <p className="field-error" role="alert" id="login-error">
              {error}
            </p>
            <button className="button primary full-width" type="submit">
              Log in <ArrowUpRight size={18} />
            </button>
          </form>
          <div className="demo-credentials">
            <strong>Take a look around</strong>
            <p>
              Demo ID: <code>FC000000</code>
              <br />
              Password: <code>Focus2026!</code>
            </p>
          </div>
          <button
            className="text-button guest"
            onClick={() => {
              setSession("guest");
              navigate("/");
            }}
          >
            Continue as guest →
          </button>
        </div>
      </section>
      {!cookie && (
        <div className="cookie-banner">
          <p>
            This demo uses browser storage to remember your progress and
            preferences. No tracking cookies.
          </p>
          <button
            className="icon-button"
            aria-label="Dismiss cookie notice"
            onClick={() => setCookie(true)}
          >
            <X size={20} />
          </button>
        </div>
      )}
      {forgot && (
        <Modal
          title={sent ? "Reset request simulated" : "Forgot your password?"}
          onClose={() => setForgot(false)}
        >
          {sent ? (
            <>
              <div className="success-art">
                <Check />
              </div>
              <p>
                If this were a connected LMS, reset instructions would be sent
                to {email}. This demo does not send email. You can use the demo
                credentials to log in.
              </p>
            </>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <p>Enter your university email address.</p>
              <label>
                Email
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <button className="button primary">Request reset</button>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
}
export function NotFound() {
  return (
    <>
      <PageTitle
        eyebrow="A SMALL DETOUR"
        title="This page is taking a study break."
      />
      <Empty
        title="Let’s get you back on track"
        body="The link may have changed or the page may no longer exist."
        to="/"
      />
    </>
  );
}
