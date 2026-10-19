import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import {
  X,
  ArrowUpRight,
  Star,
  ArrowRight,
  BookOpen,
  BrainCircuit,
  Code2,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { Link } from "react-router-dom";
import { courseProgress } from "../data/seed";
import type { Course } from "../data/seed";
import { useStore } from "../hooks/useStore";
export function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const prev = document.activeElement as HTMLElement;
    const el = ref.current;
    el?.querySelector<HTMLElement>("button,input,select,textarea")?.focus();
    const listener = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const all = Array.from(
          el?.querySelectorAll<HTMLElement>(
            'button:not([disabled]),a[href],input:not([disabled]),select,textarea,[tabindex="0"]',
          ) || [],
        );
        const first = all[0],
          last = all.at(-1);
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
      prev?.focus();
    };
  }, []);
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        ref={ref}
      >
        <div className="section-heading">
          <h2>{title}</h2>
          <button
            className="icon-button"
            aria-label="Close dialog"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
export function PageTitle({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="page-title">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action}
    </div>
  );
}
export function SectionTitle({
  title,
  to,
  label = "View all",
}: {
  title: string;
  to?: string;
  label?: string;
}) {
  return (
    <div className="section-heading">
      <h2>{title}</h2>
      {to && (
        <Link className="text-link" to={to}>
          {label}
          <ArrowUpRight size={15} />
        </Link>
      )}
    </div>
  );
}
export function Progress({ value }: { value: number }) {
  return (
    <div
      className="progress-track"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Course completion"
    >
      <span style={{ width: value + "%" }} />
    </div>
  );
}
export function CourseArt({ course }: { course: Course }) {
  const Icon =
    course.id === "ml"
      ? BrainCircuit
      : course.id === "algo"
        ? Code2
        : course.id === "security"
          ? ShieldCheck
          : Smartphone;
  return (
    <div className={"course-art " + course.color} aria-hidden="true">
      <div className="art-grid" />
      <span className="art-label">
        {course.id === "ml"
          ? "THINK. TRAIN. TRANSFORM."
          : course.id === "algo"
            ? "MAKE COMPLEX, SIMPLE."
            : course.id === "security"
              ? "BUILD A SAFER WORLD."
              : "IDEAS IN YOUR POCKET."}
      </span>
      <div className="art-orbit orbit-one" />
      <div className="art-orbit orbit-two" />
      <div className="art-object">
        <Icon strokeWidth={1.1} />
      </div>
      <span className="art-bottom">
        FACULTY OF COMPUTING <ArrowUpRight size={12} />
      </span>
    </div>
  );
}
export function CourseCard({ course }: { course: Course }) {
  const { stars, setStars, done } = useStore();
  const value = courseProgress(course, done);
  return (
    <article className="course-card">
      <Link to={"/courses/" + course.id} aria-label={"Open " + course.title}>
        <CourseArt course={course} />
      </Link>
      <button
        className={"star-button " + (stars.includes(course.id) ? "active" : "")}
        aria-label={
          (stars.includes(course.id) ? "Unstar " : "Star ") + course.title
        }
        onClick={() =>
          setStars((v) =>
            v.includes(course.id)
              ? v.filter((x) => x !== course.id)
              : [...v, course.id],
          )
        }
      >
        <Star
          size={16}
          fill={stars.includes(course.id) ? "currentColor" : "none"}
        />
      </button>
      <div className="course-card-body">
        <div className="course-meta">
          <span>{course.code}</span>
          <span>Semester {String(course.semester).padStart(2, "0")}</span>
        </div>
        <Link className="course-name" to={"/courses/" + course.id}>
          {course.title}
        </Link>
        <div className="lecturer">
          <span className="avatar tiny">
            {course.lecturer.split(" ")[1]?.[0]}
            {course.lecturer.split(" ").at(-1)?.[0]}
          </span>
          {course.lecturer}
        </div>
        <div className="progress-label">
          <span>
            {value === 0
              ? "Ready to begin"
              : value === 100
                ? "Completed"
                : "Your progress"}
          </span>
          <strong>{value}%</strong>
        </div>
        <Progress value={value} />
      </div>
    </article>
  );
}
export function Empty({
  title,
  body,
  to,
  label = "Back to dashboard",
}: {
  title: string;
  body: string;
  to?: string;
  label?: string;
}) {
  return (
    <div className="empty">
      <BookOpen size={32} />
      <h3>{title}</h3>
      <p>{body}</p>
      {to && (
        <Link className="button primary" to={to}>
          {label}
          <ArrowRight size={16} />
        </Link>
      )}
    </div>
  );
}
export function Chip({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: string;
}) {
  return <span className={"chip " + tone}>{children}</span>;
}
export function download(name: string, body: string, type = "text/plain") {
  const url = URL.createObjectURL(new Blob([body], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
