import { useState, useEffect } from "react";
import {
  NavLink,
  Link,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  CalendarDays,
  ClipboardList,
  MessageCircle,
  GraduationCap,
  Settings,
  CircleHelp,
  Bell,
  Search,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
  ArrowUpRight,
  LogOut,
  X,
  MoreHorizontal,
  Sparkles,
  Command,
} from "lucide-react";
import { courses, assignments, student } from "../data/seed";
import { useStore, useLocal } from "../hooks/useStore";
import { Modal } from "./UI";
import Assistant, { VoiceButton } from "./Assistant";
const links = [
  ["/", "Dashboard", LayoutDashboard],
  ["/courses", "My courses", BookOpen],
  ["/assignments", "Assignments", ClipboardList],
  ["/timetable", "Timetable", CalendarDays],
  ["/messages", "Messages", MessageCircle],
  ["/grades", "Grades", GraduationCap],
  ["/exam-registration", "Exam registration", ClipboardList],
] as const;
const labels: Record<string, string[]> = {
  English: links.map((x) => x[1]),
  සිංහල: [
    "මුල් පිටුව",
    "පාඨමාලා",
    "පැවරුම්",
    "කාලසටහන",
    "පණිවිඩ",
    "ලකුණු",
    "විභාග ලියාපදිංචිය",
  ],
  தமிழ்: [
    "முகப்பு",
    "பாடங்கள்",
    "பணிகள்",
    "கால அட்டவணை",
    "செய்திகள்",
    "மதிப்பெண்கள்",
    "தேர்வுப் பதிவு",
  ],
};
export default function Layout() {
  const [collapsed, setCollapsed] = useLocal("collapsed", false);
  const [palette, setPalette] = useState(false);
  const [query, setQuery] = useState("");
  const [bell, setBell] = useState(false);
  const [profile, setProfile] = useState(false);
  const [more, setMore] = useState(false);
  const { messages, alerts, toast, setToast, settings, setSession } =
    useStore();
  const location = useLocation();
  const navigate = useNavigate();
  const unread = messages.filter((m) => !m.read).length;
  const count = alerts.filter((n) => !n.read).length;
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setPalette((v) => !v);
      }
      if (e.key === "Escape") {
        setBell(false);
        setProfile(false);
        setMore(false);
      }
    };
    document.addEventListener("keydown", listener);
    return () => document.removeEventListener("keydown", listener);
  }, []);
  useEffect(() => {
    setPalette(false);
    setBell(false);
    setProfile(false);
    setMore(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);
  const results = [
    ...links.map(([to, title]) => ({ to, title, group: "Page" })),
    ...courses.map((c) => ({
      to: "/courses/" + c.id,
      title: c.title,
      group: c.code,
    })),
    ...assignments.map((a) => ({
      to: "/assignments/" + a.id,
      title: a.title,
      group: "Assignment",
    })),
  ].filter((r) => r.title.toLowerCase().includes(query.toLowerCase()));
  function voice(text: string) {
    setQuery(text);
    if (text.toLowerCase().includes("timetable")) navigate("/timetable");
    else if (text.toLowerCase().includes("deadline")) navigate("/assignments");
  }
  return (
    <div className={"app-frame " + (collapsed ? "is-collapsed" : "")}>
      <a
        href="#main"
        className="skip-link"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main")?.focus();
          document.getElementById("main")?.scrollIntoView();
        }}
      >
        Skip to content
      </a>
      <aside className="sidebar">
        <Link className="brand" to="/" aria-label="Fōcus home">
          <span className="brand-mark">
            <BookOpen size={23} />
          </span>
          <span>
            fōcus<span className="brand-dot">.</span>
          </span>
        </Link>
        <div className="sidebar-label">YOUR LEARNING SPACE</div>
        <nav aria-label="Main navigation">
          {links.map(([to, label, Icon], i) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              title={collapsed ? label : undefined}
            >
              <Icon size={19} />
              <span>{(labels[settings.language] || labels.English)[i]}</span>
              {label === "Messages" && unread > 0 && (
                <b className="nav-badge">{unread}</b>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="semester-note">
            <span className="status-dot" /> SEMESTER 05<h3>One step closer.</h3>
            <p>A little progress, every day.</p>
            <Link to="/courses">
              Keep learning <ArrowUpRight size={15} />
            </Link>
            <div className="decor-spark">✳</div>
          </div>
          <NavLink to="/help">
            <CircleHelp size={19} />
            <span>Help & support</span>
          </NavLink>
          <NavLink to="/settings">
            <Settings size={19} />
            <span>Settings</span>
          </NavLink>
          <button
            className="collapse-toggle"
            onClick={() => setCollapsed((v) => !v)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <PanelLeftOpen size={18} />
            ) : (
              <PanelLeftClose size={18} />
            )}
            <span>Collapse sidebar</span>
          </button>
          <div className="university">
            <span>FACULTY OF COMPUTING</span>
            <small>University of Sri Jayewardenepura</small>
          </div>
        </div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <div className="topbar-context">
            Student workspace <span>/</span>{" "}
            <strong>
              {links.find(([to]) =>
                to === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(to),
              )?.[1] || "Learning space"}
            </strong>
          </div>
          <div className="topbar-actions">
            <button className="search-trigger" onClick={() => setPalette(true)}>
              <Search size={16} />
              <span>Search anything…</span>
              <kbd>⌘ K</kbd>
            </button>
            <div className="dropdown-holder">
              <button
                className="icon-button notification-button"
                aria-label={`Notifications, ${count} unread`}
                aria-expanded={bell}
                onClick={() => {
                  setBell((v) => !v);
                  setProfile(false);
                }}
              >
                <Bell size={20} />
                {count > 0 && <i />}
              </button>
              {bell && (
                <div className="dropdown">
                  <h3>
                    Notifications{" "}
                    <span className="chip lavender">{count} unread</span>
                  </h3>
                  {alerts
                    .filter((n) => !n.read)
                    .slice(0, 3)
                    .map((n) => (
                      <Link key={n.id} to={n.to}>
                        <span className="notification-dot" />
                        <div>
                          <strong>{n.title}</strong>
                          <small>{n.priority}</small>
                        </div>
                      </Link>
                    ))}
                  <Link to="/notifications" className="text-link">
                    View notification center <ArrowUpRight size={14} />
                  </Link>
                </div>
              )}
            </div>
            <div className="topbar-divider" />
            <div className="dropdown-holder">
              <button
                className="profile-button"
                aria-label="Open profile menu"
                aria-expanded={profile}
                onClick={() => {
                  setProfile((v) => !v);
                  setBell(false);
                }}
              >
                <span className="avatar self">VN</span>
                <ChevronDown size={14} />
              </button>
              {profile && (
                <div className="dropdown profile-dropdown">
                  <h3>{student.name}</h3>
                  <p>{student.id} · Year 3</p>
                  <Link to="/settings">
                    <Settings size={16} />
                    Account & accessibility
                  </Link>
                  <Link to="/usability">
                    <ClipboardList size={16} />
                    Usability test mode
                  </Link>
                  <button
                    onClick={() => {
                      setSession("");
                      navigate("/login");
                    }}
                  >
                    <LogOut size={16} />
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        <main id="main" tabIndex={-1}>
          <Outlet />
        </main>
        <footer className="app-footer">
          <span>Made for your next big idea.</span>
          <span>
            Faculty of Computing <span className="footer-dot">·</span> Demo · 19
            Oct 2026, 09:00
          </span>
        </footer>
      </div>
      <nav className="bottom-nav" aria-label="Mobile navigation">
        {[links[0], links[1], links[2], links[4]].map(([to, label, Icon]) => (
          <NavLink to={to} end={to === "/"} key={to}>
            <Icon size={20} />
            <span>
              {label === "Dashboard"
                ? "Home"
                : label === "Assignments"
                  ? "Deadlines"
                  : label === "My courses"
                    ? "Courses"
                    : label}
            </span>
          </NavLink>
        ))}
        <button onClick={() => setMore((v) => !v)} aria-expanded={more}>
          <MoreHorizontal size={20} />
          <span>More</span>
        </button>
      </nav>
      {more && (
        <Modal title="More from Fōcus" onClose={() => setMore(false)}>
          <div className="more-links">
            {[
              ...links.slice(3).filter((x) => x[0] !== "/messages"),
              ["/settings", "Settings", Settings],
              ["/help", "Help & support", CircleHelp],
              ["/usability", "Usability test mode", ClipboardList],
            ].map(([to, label]) => (
              <Link key={String(to)} to={String(to)}>
                {String(label)}
                <ArrowUpRight size={16} />
              </Link>
            ))}
          </div>
        </Modal>
      )}
      {palette && (
        <Modal title="Find your next step" onClose={() => setPalette(false)}>
          <div className="search-field">
            <Search size={19} />
            <input
              autoFocus
              aria-label="Search courses and pages"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search courses, assignments, pages…"
            />
            <VoiceButton onResult={voice} />
          </div>
          <p className="fine-print">
            <Command size={12} /> K to open · Esc to close. Voice commands:
            “open timetable”, “next deadline”. Browser voice processing may
            leave your device.
          </p>
          <div className="search-results">
            {results.length ? (
              results.slice(0, 12).map((r) => (
                <Link to={r.to} key={r.to}>
                  <span>
                    <small>{r.group}</small>
                    {r.title}
                  </span>
                  <ArrowUpRight size={17} />
                </Link>
              ))
            ) : (
              <p>No results. Try “Machine Learning” or “Timetable”.</p>
            )}
          </div>
        </Modal>
      )}
      <Assistant />
      {toast && (
        <div className="toast" role="status">
          <Sparkles size={17} />
          <span>{toast.text}</span>
          {toast.undo && (
            <button
              onClick={() => {
                toast.undo?.();
                setToast(null);
              }}
            >
              Undo
            </button>
          )}
          <button
            aria-label="Dismiss notification"
            onClick={() => setToast(null)}
          >
            <X size={17} />
          </button>
        </div>
      )}
    </div>
  );
}
