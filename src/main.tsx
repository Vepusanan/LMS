import { Component, lazy, Suspense } from "react";
import type { ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import { StoreProvider } from "./hooks/useStore";
import Layout from "./components/Layout";
import "./styles/global.css";
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Courses = lazy(() => import("./pages/Courses"));
const CourseDetail = lazy(() =>
  import("./pages/Courses").then((m) => ({ default: m.CourseDetail })),
);
const Participants = lazy(() =>
  import("./pages/Courses").then((m) => ({ default: m.Participants })),
);
const Assignments = lazy(() => import("./pages/Assignments"));
const AssignmentDetail = lazy(() =>
  import("./pages/Assignments").then((m) => ({ default: m.AssignmentDetail })),
);
const Timetable = lazy(() => import("./pages/Timetable"));
const Exam = lazy(() => import("./pages/Exam"));
const Messages = lazy(() => import("./pages/Messages"));
const Notifications = lazy(() =>
  import("./pages/Messages").then((m) => ({ default: m.Notifications })),
);
const Settings = lazy(() => import("./pages/Settings"));
const Grades = lazy(() =>
  import("./pages/Other").then((m) => ({ default: m.Grades })),
);
const Help = lazy(() =>
  import("./pages/Other").then((m) => ({ default: m.Help })),
);
const Usability = lazy(() =>
  import("./pages/Other").then((m) => ({ default: m.Usability })),
);
const Login = lazy(() =>
  import("./pages/Other").then((m) => ({ default: m.Login })),
);
const NotFound = lazy(() =>
  import("./pages/Other").then((m) => ({ default: m.NotFound })),
);
class ErrorBoundary extends Component<
  { children: ReactNode },
  { error: boolean }
> {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  render() {
    return this.state.error ? (
      <div className="empty">
        <h1>Something interrupted your learning space.</h1>
        <p>Your saved work is still in this browser. Reload to try again.</p>
        <button
          className="button primary"
          onClick={() => window.location.reload()}
        >
          Reload workspace
        </button>
      </div>
    ) : (
      this.props.children
    );
  }
}
function Loading() {
  return (
    <div
      className="loading-skeleton"
      role="status"
      aria-label="Loading your learning space"
    >
      <div />
      <div />
      <div />
      <span>Getting your learning space ready…</span>
    </div>
  );
}
createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <StoreProvider>
      <HashRouter>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="courses" element={<Courses />} />
              <Route path="courses/:id" element={<CourseDetail />} />
              <Route path="assignments" element={<Assignments />} />
              <Route path="assignments/:id" element={<AssignmentDetail />} />
              <Route path="timetable" element={<Timetable />} />
              <Route path="exam-registration" element={<Exam />} />
              <Route path="messages" element={<Messages />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="grades" element={<Grades />} />
              <Route path="participants" element={<Participants />} />
              <Route path="settings" element={<Settings />} />
              <Route path="help" element={<Help />} />
              <Route path="usability" element={<Usability />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </HashRouter>
    </StoreProvider>
  </ErrorBoundary>,
);
