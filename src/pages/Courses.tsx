import { useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  Search,
  LayoutGrid,
  List,
  ChevronDown,
  Star,
  Download,
  Check,
  LockKeyhole,
  FileText,
  ArrowUpRight,
  Users,
} from "lucide-react";
import {
  courses,
  courseById,
  courseProgress,
  lessons,
  assignments,
  formatDate,
  notices,
  participants,
} from "../data/seed";
import { useStore } from "../hooks/useStore";
import {
  CourseCard,
  Empty,
  PageTitle,
  Progress,
  Chip,
  Modal,
} from "../components/UI";
export default function Courses() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("Current");
  const [sort, setSort] = useState("Last accessed");
  const [list, setList] = useState(false);
  const { stars, done } = useStore();
  const progress = (id: string, _p: number) =>
    courseProgress(courseById(id), done);
  const filtered = courses
    .filter(
      (c) =>
        (c.title + " " + c.code).toLowerCase().includes(query.toLowerCase()) &&
        (filter === "Current"
          ? c.semester === 5
          : filter === "In progress"
            ? progress(c.id, c.progress) > 0 && progress(c.id, c.progress) < 100
            : filter === "Completed"
              ? progress(c.id, c.progress) === 100
              : filter === "Starred"
                ? stars.includes(c.id)
                : true),
    )
    .sort((a, b) =>
      sort === "Name"
        ? a.title.localeCompare(b.title)
        : sort === "Progress"
          ? progress(b.id, b.progress) - progress(a.id, a.progress)
          : a.access - b.access,
    );
  return (
    <>
      <PageTitle
        eyebrow="A LITTLE PROGRESS, EVERY DAY"
        title="My courses"
        description="Your next big idea starts here. Let’s keep learning."
        action={<Chip tone="lavender">Semester 05 · 8 active courses</Chip>}
      />
      <div className="toolbar">
        <div className="search-field">
          <Search size={18} />
          <input
            aria-label="Search courses"
            placeholder="Find a course or course code…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <label className="sort-label">
          Sort by
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option>Last accessed</option>
            <option>Name</option>
            <option>Progress</option>
          </select>
        </label>
        <div className="view-toggle">
          <button
            aria-label="Grid view"
            aria-pressed={!list}
            className={!list ? "active" : ""}
            onClick={() => setList(false)}
          >
            <LayoutGrid size={18} />
          </button>
          <button
            aria-label="List view"
            aria-pressed={list}
            className={list ? "active" : ""}
            onClick={() => setList(true)}
          >
            <List size={18} />
          </button>
        </div>
      </div>
      <div className="filter-tabs spacious">
        {["Current", "All", "In progress", "Completed", "Starred"].map((f) => (
          <button
            key={f}
            className={f === filter ? "active" : ""}
            onClick={() => setFilter(f)}
            aria-pressed={f === filter}
          >
            {f === "Starred" && <Star size={14} />} {f}
          </button>
        ))}
      </div>
      {filtered.length ? (
        [5, 4, 3, 2, 1].map((s) => {
          const group = filtered.filter((c) => c.semester === s);
          return group.length ? (
            <details
              className="semester-group"
              key={s + "-" + filter + "-" + query}
              open={s === 5 || !!query || filter === "Starred"}
            >
              <summary>
                <h2>
                  Semester {String(s).padStart(2, "0")}{" "}
                  <span>
                    {s === 5 ? "CURRENT SEMESTER" : group.length + " COURSES"}
                  </span>
                </h2>
                <ChevronDown size={18} />
              </summary>
              <div className={list ? "course-list-view" : "course-grid"}>
                {group.map((c) => (
                  <CourseCard key={c.id} course={c} />
                ))}
              </div>
            </details>
          ) : null;
        })
      ) : (
        <Empty
          title="No matching courses"
          body="Try another search or switch to All courses."
        />
      )}
    </>
  );
}
export function CourseDetail() {
  const { id = "ml" } = useParams();
  const c = courses.find((c) => c.id === id);
  const [params, setParams] = useSearchParams();
  const tab = params.get("tab") || "Overview";
  const { done, setDone, notify } = useStore();
  const [quiz, setQuiz] = useState(false);
  const [answer, setAnswer] = useState("");
  if (!c)
    return (
      <Empty
        title="Course not found"
        body="This course may have moved. Return to your course list."
        to="/courses"
        label="Browse courses"
      />
    );
  const completed = done.filter((d) => d.startsWith(id + "-")).length;
  const progress = courseProgress(c, done);
  function toggle(key: string) {
    const before = done;
    setDone((v) =>
      v.includes(key) ? v.filter((x) => x !== key) : [...v, key],
    );
    notify(
      done.includes(key)
        ? "Activity marked incomplete."
        : "Activity completed. Your progress is updated.",
      () => setDone(before),
    );
  }
  return (
    <>
      <div className="breadcrumbs">
        <Link to="/courses">My courses</Link>
        <span>/</span>
        {c.title}
      </div>
      <div className={"course-detail-banner " + c.color}>
        <div>
          <Chip>
            {c.code} · Semester {String(c.semester).padStart(2, "0")}
          </Chip>
          <h1>{c.title}</h1>
          <p>
            {c.lecturer} <span>·</span> Faculty of Computing
          </p>
        </div>
        <div className="course-overall">
          <strong>{progress}%</strong>
          <span>
            {completed} of 8 activities completed
            {id !== "ml" ? " · plus recorded progress" : ""}
          </span>
          <Progress value={progress} />
        </div>
      </div>
      <div className="page-tabs">
        {[
          "Overview",
          "Content",
          "Assignments",
          "Grades",
          "Participants",
          "Announcements",
        ].map((t) => (
          <button
            key={t}
            className={tab === t ? "active" : ""}
            onClick={() => setParams({ tab: t })}
          >
            {t}
          </button>
        ))}
      </div>
      {tab === "Overview" && (
        <div className="two-col">
          <section className="panel">
            <h2>A foundation for what’s next.</h2>
            <p>
              {id === "ml"
                ? "Explore how machines learn from data. Build, evaluate and improve models through practical examples, guided readings and hands-on exercises."
                : `Build a strong foundation in ${c.title.toLowerCase()} with guided readings, practical exercises and weekly discussions.`}
            </p>
            <h3>What you’ll learn</h3>
            <ul className="check-list">
              <li>Understand core concepts and apply them to real problems.</li>
              <li>Evaluate approaches and explain your decisions.</li>
              <li>
                Collaborate on practical work and communicate your findings.
              </li>
            </ul>
            <Link className="button primary" to={`?tab=Content`}>
              Explore course content <ArrowUpRight size={16} />
            </Link>
          </section>
          <section className="panel">
            <h2>Your course essentials</h2>
            <p>Lecturer: {c.lecturer}</p>
            <p>Assessment: practicals 30% · quiz 20% · final exam 50%</p>
            <p>Resources: seven weekly lessons and a practice quiz</p>
            <Link className="text-link" to="/timetable">
              Find your next class →
            </Link>
            <p className="fine-print">
              Course codes follow the supplied dataset. Machine Learning and
              Computer Security share CCS3062; confirm official codes with the
              faculty.
            </p>
          </section>
        </div>
      )}
      {tab === "Content" && (
        <div className="panel">
          <h2>Make progress, one week at a time.</h2>
          <p>
            Read the lesson, try the examples, then mark the activity as
            complete.
          </p>
          {(id === "ml"
            ? lessons
            : [
                "Core concepts & foundations",
                "Methods & tools",
                "Practical applications",
                "Worked examples",
                "Applied problem solving",
                "Review & evaluation",
                "Independent exploration",
              ]
          ).map((lesson, i) => (
            <div className="lesson" key={lesson}>
              <span className="file-icon">
                <FileText size={23} />
              </span>
              <div className="flex-grow">
                <h3>
                  Week {i + 1}: {lesson}
                </h3>
                <p>
                  {i % 2 ? "PPT" : "PDF"} · {(1.2 + i * 0.3).toFixed(1)} MB ·
                  Recommended by {19 + i} Oct
                </p>
              </div>
              <button
                className="icon-button"
                aria-label={"Download " + lesson}
                onClick={() =>
                  notify(
                    "Simulated download: " +
                      lesson +
                      ". No lecture file is hosted in this demo.",
                  )
                }
              >
                <Download size={18} />
              </button>
              <button
                className={
                  "button " +
                  (done.includes(id + "-" + i) ? "done" : "secondary")
                }
                onClick={() => toggle(id + "-" + i)}
              >
                {done.includes(id + "-" + i) ? (
                  <>
                    <Check size={15} />
                    Done
                  </>
                ) : (
                  "Mark as done"
                )}
              </button>
            </div>
          ))}
          <div className="lesson">
            <span className="file-icon lavender">
              <FileText size={23} />
            </span>
            <div className="flex-grow">
              <h3>{id === "ml" ? "ML Quiz" : "Knowledge check"}</h3>
              <p>Practice · 1 question · Answers unlock after submission</p>
            </div>
            <button className="button primary" onClick={() => setQuiz(true)}>
              {done.includes(id + "-quiz") ? "Retake quiz" : "Start quiz"}
            </button>
          </div>
          <div className="lesson">
            <LockKeyhole size={22} />
            <div className="flex-grow">
              <h3>Quiz answers</h3>
              <p>
                {done.includes(id + "-quiz")
                  ? "Supervised learning uses labelled examples to learn a mapping between inputs and outputs."
                  : "Complete the quiz to unlock the answer explanation."}
              </p>
            </div>
            <Chip tone={done.includes(id + "-quiz") ? "mint" : "neutral"}>
              {done.includes(id + "-quiz") ? "Unlocked" : "Locked"}
            </Chip>
          </div>
        </div>
      )}
      {tab === "Assignments" && (
        <div className="panel">
          {assignments.filter((a) => a.course === id).length ? (
            assignments
              .filter((a) => a.course === id)
              .map((a) => (
                <Link
                  className="deadline-row"
                  key={a.id}
                  to={"/assignments/" + a.id}
                >
                  <FileText />
                  <div className="flex-grow">
                    <strong>{a.title}</strong>
                    <p>{formatDate(a.due)}</p>
                  </div>
                  <ArrowUpRight size={18} />
                </Link>
              ))
          ) : (
            <Empty
              title="No assignments posted yet"
              body="New assignments will appear here and in your deadlines list."
            />
          )}
        </div>
      )}
      {tab === "Grades" && <CourseGrades courseId={id} />}{" "}
      {tab === "Participants" && <Participants />}
      {tab === "Announcements" && (
        <div className="stack">
          {notices.map((n) => (
            <article className="panel" key={n.title}>
              <Chip tone="lavender">{n.priority}</Chip>
              <h2>{n.title}</h2>
              <p>{n.body}</p>
              <Link className="text-link" to={n.to}>
                View details <ArrowUpRight size={14} />
              </Link>
            </article>
          ))}
        </div>
      )}
      {quiz && (
        <Modal title="Practice knowledge check" onClose={() => setQuiz(false)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!answer) return;
              setDone((v) =>
                v.includes(id + "-quiz") ? v : [...v, id + "-quiz"],
              );
              setQuiz(false);
              notify(
                answer === "labelled"
                  ? "Correct! Answers are now unlocked."
                  : "Quiz submitted. Review the unlocked explanation.",
              );
            }}
          >
            <fieldset>
              <legend>
                What does supervised learning use to train a model?
              </legend>
              {[
                ["labelled", "Labelled examples"],
                ["random", "Only random numbers"],
                ["none", "No training data"],
              ].map(([value, label]) => (
                <label className="check-row" key={value}>
                  <input
                    type="radio"
                    name="answer"
                    value={value}
                    required
                    onChange={() => setAnswer(value)}
                  />
                  {label}
                </label>
              ))}
            </fieldset>
            <button className="button primary" type="submit">
              Submit quiz
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}
export function CourseGrades({ courseId = "ml" }: { courseId?: string }) {
  return (
    <section className="panel">
      <h2>Assessment breakdown</h2>
      <p>
        {courseById(courseId).title} · Scores appear after your lecturer
        releases feedback.
      </p>
      <div className="responsive-table">
        <table>
          <thead>
            <tr>
              <th>Assessment</th>
              <th>Weight</th>
              <th>Score</th>
              <th>Feedback</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Practical work</td>
              <td>30%</td>
              <td>24 / 30</td>
              <td>
                Good implementation. Explain your model choices in more detail.
              </td>
            </tr>
            <tr>
              <td>Quiz</td>
              <td>20%</td>
              <td>Not graded yet</td>
              <td>
                Your practice quiz does not contribute to the official grade.
              </td>
            </tr>
            <tr>
              <td>Final examination</td>
              <td>50%</td>
              <td>Not graded yet</td>
              <td>Results will be released after the examination.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="fine-print">
        Illustrative scores only. The university’s official academic record is
        authoritative.
      </p>
    </section>
  );
}
export function Participants() {
  const [q, setQ] = useState("");
  const [role, setRole] = useState("All roles");
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<
    (typeof participants)[number] | null
  >(null);
  const list = participants.filter(
    (p) =>
      p.name.toLowerCase().includes(q.toLowerCase()) &&
      (role === "All roles" || role === p.role),
  );
  return (
    <section className="panel">
      <div className="section-heading">
        <h2>Learning, together</h2>
        <Chip>
          <Users size={14} /> {participants.length} participants
        </Chip>
      </div>
      <div className="toolbar">
        <div className="search-field">
          <Search size={18} />
          <input
            placeholder="Search participants…"
            aria-label="Search participants"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(0);
            }}
          />
        </div>
        <select
          aria-label="Filter role"
          value={role}
          onChange={(e) => {
            setRole(e.target.value);
            setPage(0);
          }}
        >
          <option>All roles</option>
          <option>Student</option>
          <option>Teaching assistant</option>
        </select>
      </div>
      <div className="participant-grid">
        {list.slice(page * 8, page * 8 + 8).map((p) => (
          <button
            className="participant"
            key={p.id}
            onClick={() => setSelected(p)}
          >
            <span className="avatar lavender">
              {p.name
                .split(" ")
                .map((s) => s[0])
                .join("")}
            </span>
            <span>
              <strong>{p.name}</strong>
              <small>
                {p.role} · {p.group}
              </small>
            </span>
            <ArrowUpRight size={16} />
          </button>
        ))}
      </div>
      {!list.length && (
        <Empty
          title="No participants found"
          body="Try a different name or role."
        />
      )}
      <div className="pagination">
        <button
          className="button secondary"
          disabled={page === 0}
          onClick={() => setPage((p) => p - 1)}
        >
          Previous
        </button>
        <span>
          Page {page + 1} of {Math.max(1, Math.ceil(list.length / 8))}
        </span>
        <button
          className="button secondary"
          disabled={(page + 1) * 8 >= list.length}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
      <p className="fine-print">
        Only course roles and study groups are shared. Private contact details
        and activity history are hidden.
      </p>
      {selected && (
        <Modal title="Course profile" onClose={() => setSelected(null)}>
          <span className="avatar lavender">{selected.name[0]}</span>
          <h3>{selected.name}</h3>
          <p>
            {selected.role} · {selected.group}
          </p>
          <p>
            This member’s private contact details and activity history are not
            shared.
          </p>
          <Link
            className="button primary"
            to={"/messages?compose=" + encodeURIComponent(selected.name)}
          >
            Send a course message
          </Link>
        </Modal>
      )}
    </section>
  );
}
