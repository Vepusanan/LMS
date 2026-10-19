import { useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  List,
  CalendarDays,
  UploadCloud,
  FileText,
  X,
  CheckCircle2,
  Clock3,
  ArrowUpRight,
} from "lucide-react";
import {
  assignments,
  courseById,
  formatDate,
  formatTime,
  TODAY,
  dueLabel,
} from "../data/seed";
import { useStore } from "../hooks/useStore";
import { PageTitle, Chip, Empty, Modal } from "../components/UI";
import { MiniCalendar } from "./Dashboard";
export default function Assignments() {
  const [view, setView] = useState("List");
  const [filter, setFilter] = useState("All");
  const { submissions } = useStore();
  const list = assignments
    .map((a) => ({ ...a, status: submissions[a.id] ? "Submitted" : a.status }))
    .filter((a) => filter === "All" || a.status === filter)
    .sort((a, b) => a.due.localeCompare(b.due));
  return (
    <>
      <PageTitle
        eyebrow="MAKE ROOM FOR WHAT MATTERS"
        title="Assignments & deadlines"
        description="A clear picture of what’s done, what’s next, and what needs a little focus."
        action={
          <div className="view-toggle">
            <button
              className={view === "List" ? "active" : ""}
              onClick={() => setView("List")}
            >
              <List size={17} />
              List
            </button>
            <button
              className={view === "Calendar" ? "active" : ""}
              onClick={() => setView("Calendar")}
            >
              <CalendarDays size={17} />
              Calendar
            </button>
          </div>
        }
      />
      <div className="filter-tabs spacious">
        {["All", "Not started", "In progress", "Submitted", "Overdue"].map(
          (f) => (
            <button
              key={f}
              className={f === filter ? "active" : ""}
              aria-pressed={f === filter}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ),
        )}
      </div>
      <div className={view === "Calendar" ? "calendar-assignment-layout" : ""}>
        {view === "Calendar" && (
          <section className="panel">
            <h2>October at a glance</h2>
            <MiniCalendar />
            <p className="fine-print">
              Select a date to open its assignments. Filters apply to the
              adjacent agenda.
            </p>
          </section>
        )}
        <div className="assignment-grid">
          {list.map((a) => (
            <Link
              key={a.id}
              to={"/assignments/" + a.id}
              className="assignment-card"
            >
              <div className="spread">
                <span className={"file-icon " + courseById(a.course).color}>
                  <FileText size={22} />
                </span>
                <Chip
                  tone={
                    a.status === "Overdue"
                      ? "peach"
                      : a.status === "Submitted"
                        ? "mint"
                        : "lavender"
                  }
                >
                  {a.status === "Submitted" ? (
                    <CheckCircle2 size={12} />
                  ) : (
                    <Clock3 size={12} />
                  )}{" "}
                  {a.status}
                </Chip>
              </div>
              <small className="eyebrow">{courseById(a.course).title}</small>
              <h2>{a.title}</h2>
              <p>{a.description}</p>
              <div className="assignment-card-footer">
                <span>
                  {formatDate(a.due)} · {formatTime(a.due)}
                </span>
                <ArrowUpRight size={18} />
              </div>
            </Link>
          ))}
          {!list.length && (
            <Empty
              title="Nothing here right now"
              body="You have no assignments with this status. Switch to All to see your work."
            />
          )}
        </div>
      </div>
    </>
  );
}
export function AssignmentDetail() {
  const { id } = useParams();
  const a = assignments.find((x) => x.id === id);
  const { submissions, setSubmissions, notify } = useStore();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [remove, setRemove] = useState(false);
  const [drag, setDrag] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  if (!a)
    return (
      <Empty
        title="Assignment not found"
        body="Choose an assignment from your deadlines list."
        to="/assignments"
        label="View assignments"
      />
    );
  const locked = +new Date(a.due) < +TODAY;
  const submission = submissions[a.id];
  function choose(f?: File) {
    if (!f) return;
    setError("");
    if (!/\.(pdf|docx|zip)$/i.test(f.name)) {
      setError(
        "Choose a PDF, DOCX or ZIP file. Your current selection has not changed.",
      );
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setError("This file is too large. Choose a file smaller than 10 MB.");
      return;
    }
    if (f.size === 0) {
      setError("This file is empty. Choose a file containing your work.");
      return;
    }
    setFile(f);
    setProgress(0);
  }
  async function submit() {
    if (!file) {
      setError("Choose a file before submitting.");
      return;
    }
    setUploading(true);
    for (let n = 10; n <= 100; n += 10) {
      await new Promise((r) => setTimeout(r, 70));
      setProgress(n);
    }
    setSubmissions((v) => ({
      ...v,
      [a!.id]: { name: file.name, size: file.size, date: TODAY.toISOString() },
    }));
    setUploading(false);
    setFile(null);
    notify("Assignment saved in this browser. This is a demo submission.");
  }
  return (
    <>
      <div className="breadcrumbs">
        <Link to="/assignments">Assignments</Link>
        <span>/</span>
        {a.title}
      </div>
      <PageTitle
        eyebrow={courseById(a.course).title.toUpperCase()}
        title={a.title}
        description={a.description}
        action={
          <Chip tone={locked ? "peach" : submission ? "mint" : "lavender"}>
            {submission ? "Submitted" : dueLabel(a.due)}
          </Chip>
        }
      />
      <div className="two-col">
        <section className="panel">
          <h2>Your submission</h2>
          <p>
            Upload your work and take a moment to review it before submitting.
          </p>
          {locked && (
            <div className="notice">
              The deadline has passed. Uploads and changes are closed.{" "}
              <Link to="/help?contact=1">
                Contact your lecturer through support
              </Link>{" "}
              if you need help.
            </div>
          )}
          {submission && (
            <div className="submission-success">
              <CheckCircle2 size={24} />
              <div>
                <h3>Submission recorded</h3>
                <p>
                  {submission.name} · {(submission.size / 1024).toFixed(1)} KB
                </p>
                <small>
                  Saved locally. No file has been sent to your lecturer.
                </small>
              </div>
              {!locked && (
                <button
                  className="icon-button"
                  aria-label="Remove submission"
                  onClick={() => setRemove(true)}
                >
                  <X size={18} />
                </button>
              )}
            </div>
          )}
          {a.status === "Submitted" && !submission && (
            <div className="notice mint">
              Seeded submission: group-project-report.pdf. The original file is
              not included in the demo.
            </div>
          )}
          {!locked && (
            <>
              <label
                className={"dropzone " + (drag ? "dragging" : "")}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDrag(true);
                }}
                onDragLeave={() => setDrag(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDrag(false);
                  choose(e.dataTransfer.files[0]);
                }}
              >
                <UploadCloud size={36} />
                <strong>
                  {submission
                    ? "Replace your submission"
                    : "Drop your file here"}
                </strong>
                <span>
                  or <u>browse files</u>
                </span>
                <small>PDF, DOCX or ZIP · Up to 10 MB</small>
                <input
                  ref={input}
                  type="file"
                  aria-label="Upload assignment file"
                  accept=".pdf,.docx,.zip"
                  onChange={(e) => choose(e.target.files?.[0])}
                  disabled={uploading}
                  aria-describedby="upload-error"
                />
              </label>
              {file && (
                <div className="selected-file">
                  <FileText size={20} />
                  <span>{file.name}</span>
                  <button
                    className="icon-button"
                    aria-label="Remove selected file"
                    disabled={uploading}
                    onClick={() => {
                      setFile(null);
                      if (input.current) input.current.value = "";
                    }}
                  >
                    <X size={18} />
                  </button>
                </div>
              )}
              <div id="upload-error" className="field-error" role="alert">
                {error}
              </div>
              {uploading && (
                <div aria-live="polite">
                  <progress max="100" value={progress} />
                  <p>Saving your submission… {progress}%</p>
                </div>
              )}
              <button
                className="button primary"
                disabled={!file || uploading}
                onClick={submit}
              >
                {uploading
                  ? "Submitting…"
                  : submission
                    ? "Replace submission"
                    : "Submit assignment"}
                <ArrowUpRight size={16} />
              </button>
              <p className="fine-print">
                The button becomes available when you choose a valid file. This
                prototype stores file metadata only; keep your original work.
              </p>
            </>
          )}
        </section>
        <aside className="panel fit-content">
          <h2>Before you submit</h2>
          <dl className="detail-list">
            <dt>Due date</dt>
            <dd>
              {formatDate(a.due)} 2026, {formatTime(a.due)} (Sri Lanka)
            </dd>
            <dt>Course</dt>
            <dd>{courseById(a.course).title}</dd>
            <dt>Assessment type</dt>
            <dd>{a.type}</dd>
            <dt>Submission guidelines</dt>
            <dd>
              Include your student ID in the filename. Check that your document
              opens correctly and that all references are included.
            </dd>
          </dl>
          <Link className="text-link" to={"/courses/" + a.course}>
            Go to course <ArrowUpRight size={15} />
          </Link>
        </aside>
      </div>
      {remove && (
        <Modal title="Remove this submission?" onClose={() => setRemove(false)}>
          <p>
            You can upload a replacement before the deadline. Your original file
            on your device is unaffected.
          </p>
          <div className="row">
            <button
              className="button secondary"
              onClick={() => setRemove(false)}
            >
              Keep submission
            </button>
            <button
              className="button danger"
              onClick={() => {
                const before = submissions;
                setSubmissions((v) => {
                  const next = { ...v };
                  delete next[a.id];
                  return next;
                });
                setRemove(false);
                notify("Submission removed.", () => setSubmissions(before));
              }}
            >
              Remove submission
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
