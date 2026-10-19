import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowRight,
  Clock3,
  BookOpen,
  CheckCheck,
  Flame,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  MapPin,
  BellRing,
  Sparkles,
  CircleCheck,
  CircleAlert,
} from "lucide-react";
import {
  assignments,
  courses,
  timetable,
  courseById,
  formatDate,
  dueLabel,
  TODAY,
} from "../data/seed";
import { useStore } from "../hooks/useStore";
import { SectionTitle, CourseCard, Chip, Empty } from "../components/UI";
export function Deadlines({ compact = false }: { compact?: boolean }) {
  const [filter, setFilter] = useState("All");
  const { submissions } = useStore();
  const list = assignments
    .map((a) => ({ ...a, status: submissions[a.id] ? "Submitted" : a.status }))
    .filter((a) =>
      filter === "Done"
        ? a.status === "Submitted"
        : filter === "Overdue"
          ? a.status === "Overdue"
          : filter === "This week"
            ? a.status !== "Submitted" &&
              +new Date(a.due) >= +TODAY &&
              +new Date(a.due) < +TODAY + 7 * 86400000
            : a.status !== "Submitted",
    )
    .sort((a, b) => a.due.localeCompare(b.due));
  return (
    <>
      <div className="filter-tabs" aria-label="Deadline filters">
        {["All", "This week", "Overdue", "Done"].map((f) => (
          <button
            key={f}
            className={filter === f ? "active" : ""}
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
          >
            {f}
          </button>
        ))}
      </div>
      <div className="deadline-list">
        {(compact ? list.slice(0, 3) : list).map((a) => (
          <Link className="deadline-row" key={a.id} to={"/assignments/" + a.id}>
            <div
              className={
                "deadline-icon " +
                (a.status === "Overdue" ? "peach" : courseById(a.course).color)
              }
            >
              {a.status === "Overdue" ? (
                <CircleAlert size={20} />
              ) : a.status === "Submitted" ? (
                <CircleCheck size={20} />
              ) : (
                <ClipboardIcon />
              )}
            </div>
            <div className="deadline-copy">
              <strong>{a.title}</strong>
              <small>
                {courseById(a.course).title} <span>·</span> {formatDate(a.due)}
              </small>
            </div>
            <Chip
              tone={
                a.status === "Overdue"
                  ? "peach"
                  : a.status === "Submitted"
                    ? "mint"
                    : dueLabel(a.due) === "Due tomorrow"
                      ? "peach"
                      : "neutral"
              }
            >
              <Clock3 size={12} />
              {a.status === "Submitted" ? "Submitted" : dueLabel(a.due)}
            </Chip>
            <ChevronRight size={16} />
          </Link>
        ))}
        {!list.length && (
          <Empty
            title="You’re all caught up"
            body="No deadlines in this view. Try another filter."
          />
        )}
      </div>
    </>
  );
}
function ClipboardIcon() {
  return <BookOpen size={19} />;
}
export function MiniCalendar() {
  const [month, setMonth] = useState(9);
  const [selected, setSelected] = useState(19);
  const first = (new Date(2026, month, 1).getDay() + 6) % 7;
  const length = new Date(2026, month + 1, 0).getDate();
  const active = assignments.filter(
    (a) =>
      new Date(a.due).getMonth() === month &&
      new Date(a.due).getDate() === selected,
  );
  return (
    <div className="mini-calendar">
      <div className="calendar-heading">
        <button
          aria-label="Previous month"
          className="icon-button"
          onClick={() => {
            setMonth((m) => m - 1);
            setSelected(1);
          }}
        >
          <ChevronLeft size={16} />
        </button>
        <strong>
          {new Date(2026, month, 1).toLocaleDateString("en", {
            month: "long",
            year: "numeric",
          })}
        </strong>
        <button
          aria-label="Next month"
          className="icon-button"
          onClick={() => {
            setMonth((m) => m + 1);
            setSelected(1);
          }}
        >
          <ChevronRight size={16} />
        </button>
      </div>
      <div className="calendar-grid">
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <span className="day-label" key={"d" + i}>
            {d}
          </span>
        ))}
        {Array.from({ length: first }, (_, i) => (
          <span key={"blank" + i} />
        ))}
        {Array.from({ length }, (_, i) => {
          const day = i + 1;
          const event = assignments.some(
            (a) =>
              new Date(a.due).getMonth() === month &&
              new Date(a.due).getDate() === day,
          );
          return (
            <button
              className={
                (selected === day ? "selected " : "") +
                (month === 9 && day === 19 ? "today" : "")
              }
              key={day}
              aria-label={`${day} ${new Date(2026, month, 1).toLocaleDateString("en", { month: "long" })}${event ? ", assignment due" : ""}`}
              onClick={() => setSelected(day)}
            >
              {day}
              {event && <i />}
            </button>
          );
        })}
      </div>
      {selected !== 19 || month !== 9 ? (
        <div className="calendar-selection">
          {active.length ? (
            active.map((a) => (
              <Link key={a.id} to={"/assignments/" + a.id}>
                {a.title} ↗
              </Link>
            ))
          ) : (
            <span>No deadlines on this day.</span>
          )}
        </div>
      ) : (
        <div className="calendar-key">
          <i /> Assignment due <span className="today-key" /> Today
        </div>
      )}
    </div>
  );
}
export default function Dashboard() {
  const { submissions, done, messages, settings } = useStore();
  const next = assignments
    .filter(
      (a) =>
        a.status !== "Submitted" &&
        a.status !== "Overdue" &&
        !submissions[a.id],
    )
    .sort((a, b) => a.due.localeCompare(b.due))[0];
  const currentTime = "09:00";
  const quietNow =
    settings.quiet &&
    (settings.quietStart <= settings.quietEnd
      ? currentTime >= settings.quietStart && currentTime < settings.quietEnd
      : currentTime >= settings.quietStart || currentTime < settings.quietEnd);
  const remaining = next
    ? Math.max(0, Math.floor((+new Date(next.due) - +TODAY) / 60000))
    : 0;
  const clock = [
    Math.floor(remaining / 1440),
    Math.floor((remaining % 1440) / 60),
    remaining % 60,
  ].map((n) => String(n).padStart(2, "0"));
  return (
    <div className="dashboard">
      <div className="dashboard-main">
        <div className="greeting">
          <div className="eyebrow">
            MONDAY, 19 OCTOBER 2026 <span className="tiny-sun">✳</span>
          </div>
          <h1>
            A good day to grow, Vepusanan<span className="purple-text">.</span>
          </h1>
          <p>Let’s turn a little focus into your next big thing.</p>
        </div>
        <div className="welcome-card">
          <div className="welcome-content">
            <span className="welcome-tag">
              <span /> YOUR LEARNING, IN FOCUS
            </span>
            <h2>
              Small steps.
              <br />
              Extraordinary possibilities.
            </h2>
            <p>
              You’ve got this. Pick up where you left off
              <br className="desktop-only" /> and make today count.
            </p>
            <Link to="/courses/ml" className="button dark">
              Continue learning <ArrowUpRight size={17} />
            </Link>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="hero-ring ring-back" />
            <div className="hero-ring ring-front" />
            <div className="hero-sphere" />
            <span className="hero-star star-a">✳</span>
            <span className="hero-star star-b">✦</span>
            <span className="floating-note">
              <Sparkles size={14} /> A little better, every day
            </span>
          </div>
        </div>
        <div className="priority-nudge">
          <Clock3 size={18} />
          <div>
            <strong>
              {next
                ? `${dueLabel(next.due)}: ${next.title}`
                : "Your upcoming work is complete."}
            </strong>
            <p>
              {next
                ? `${formatDate(next.due)}, ${new Date(next.due).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Colombo" })} · Sri Lanka time`
                : "A little room for your next idea."}
            </p>
          </div>
          <div className="nudge-actions">
            {next && (
              <Link to={"/assignments/" + next.id}>
                Open <ArrowUpRight size={13} />
              </Link>
            )}
            <Link to="/assignments">1 overdue</Link>
          </div>
        </div>
        {settings.assignments && (
          <p className="preference-note">
            {quietNow
              ? "Quiet hours · Optional reminders are paused. Your deadlines stay visible."
              : settings.digest
                ? "Daily overview · Your reminders are grouped."
                : `Assignment reminder · ${next ? dueLabel(next.due) : "No upcoming work"}.`}{" "}
            <Link to="/settings">Manage preferences</Link>
          </p>
        )}
        <div className="stat-grid">
          <div className="stat-card">
            <span className="stat-icon lavender">
              <BookOpen size={20} />
            </span>
            <div>
              <span>Active courses</span>
              <strong>
                08 <small>this semester</small>
              </strong>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon mint">
              <CheckCheck size={20} />
            </span>
            <div>
              <span>Activities completed</span>
              <strong>
                {12 + done.length + Object.keys(submissions).length}{" "}
                <small className="green-text">keep it up ↗</small>
              </strong>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon peach">
              <Flame size={20} />
            </span>
            <div>
              <span>Learning streak</span>
              <strong>
                05 <small>days in a row</small>
              </strong>
            </div>
          </div>
        </div>
        <section className="dashboard-section">
          <SectionTitle
            title="Continue learning"
            to="/courses"
            label="All courses"
          />
          <div className="dashboard-course-grid">
            {courses.slice(0, 4).map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        </section>
        <section className="dashboard-section deadlines-section">
          <SectionTitle
            title="What’s coming up"
            to="/assignments"
            label="All assignments"
          />
          <Deadlines compact />
        </section>
        <Link className="exam-strip" to="/exam-registration">
          <span className="stat-icon lavender">
            <BellRing size={20} />
          </span>
          <div>
            <strong>Examination registration</strong>
            <p>
              January registration is closed. View the notice & practice form.
            </p>
          </div>
          <ArrowUpRight size={20} />
        </Link>
      </div>
      <aside className="right-rail">
        <div className="rail-date">
          <div>
            <h2>Your day, at a glance</h2>
            <p>A little structure. A lot of possibility.</p>
          </div>
          <CalendarDays size={19} />
        </div>
        <MiniCalendar />
        <section className="rail-section">
          <SectionTitle title="Today’s schedule" to="/timetable" label="View" />
          <div className="schedule-list">
            {timetable
              .filter((t) => t.day === 0)
              .map((t, i) => (
                <Link
                  to={"/courses/" + t.course}
                  className={"schedule-card " + (i === 0 ? "current" : "")}
                  key={t.course}
                >
                  <div className="schedule-time">
                    <span>
                      {t.time} – {t.end}
                    </span>
                    <Chip tone={i === 0 ? "mint" : "lavender"}>
                      {i === 0 ? "● Now" : t.type}
                    </Chip>
                  </div>
                  <h3>{courseById(t.course).title}</h3>
                  <p>
                    <MapPin size={13} />
                    {t.room}
                  </p>
                </Link>
              ))}
          </div>
        </section>
        <section className="next-card">
          <span className="next-label">
            <Clock3 size={14} /> NEXT DEADLINE
          </span>
          <h3>{next ? next.title : "You’re all caught up"}</h3>
          <p>
            {next ? courseById(next.course).title : "No upcoming assignments."}
          </p>
          {next && (
            <>
              <div className="countdown">
                <div>
                  <strong>{clock[0]}</strong>
                  <small>DAYS</small>
                </div>
                <span>:</span>
                <div>
                  <strong>{clock[1]}</strong>
                  <small>HOURS</small>
                </div>
                <span>:</span>
                <div>
                  <strong>{clock[2]}</strong>
                  <small>MINS</small>
                </div>
              </div>
              <Link to={"/assignments/" + next.id}>
                View assignment <ArrowRight size={16} />
              </Link>
            </>
          )}
        </section>
        <section className="rail-section">
          <SectionTitle
            title="Your learning rhythm"
            to="/grades"
            label="Insights"
          />
          <div
            className="activity-chart"
            role="img"
            aria-label="Illustrative study activity: Monday 2 hours, Tuesday 3.5, Wednesday 2.5, Thursday 4, Friday 3, Saturday 1.5, Sunday 2.5. Seeded example."
          >
            {[42, 72, 52, 85, 63, 32, 54].map((v, i) => (
              <div className="activity-column" key={i}>
                <div className="bar-track">
                  <span
                    style={{ height: v + "%" }}
                    className={i === 3 ? "highlight" : ""}
                  />
                </div>
                <small>{["M", "T", "W", "T", "F", "S", "S"][i]}</small>
              </div>
            ))}
          </div>
          <div className="activity-legend">
            <span>
              <i /> Study hours · sample week
            </span>
            <strong>19 hrs</strong>
          </div>
        </section>
        <Link className="inbox-nudge" to="/messages?filter=unread">
          <span className="avatar tiny lavender">✉</span>
          <div>
            <strong>
              {messages.filter((m) => !m.read).length} unread messages
            </strong>
            <small>A quick check keeps you in the loop.</small>
          </div>
          <ArrowUpRight size={16} />
        </Link>
        <div className="rail-quote">
          “The beautiful thing about learning is
          <br />
          that nobody can take it away from you.”<span>— B. B. King</span>
        </div>
      </aside>
    </div>
  );
}
