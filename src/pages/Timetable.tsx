import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Download,
  MapPin,
  Clock3,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { timetable, courseById } from "../data/seed";
import { PageTitle, Chip, download, Empty } from "../components/UI";
import { useStore } from "../hooks/useStore";
export default function Timetable() {
  const [day, setDay] = useState(0);
  const [week, setWeek] = useState(0);
  const { notify } = useStore();
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  function exportCalendar() {
    const escape = (s: string) =>
      s
        .replace(/\\/g, "\\\\")
        .replace(/;/g, "\\;")
        .replace(/,/g, "\\,")
        .replace(/\n/g, "\\n");
    const body = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Focus//LMS Demo//EN",
      "CALSCALE:GREGORIAN",
      ...timetable.flatMap((t, i) => [
        "BEGIN:VEVENT",
        `UID:focus-20261019-${i}@lms.demo`,
        "DTSTAMP:20261019T033000Z",
        `DTSTART:202610${19 + t.day}T${t.time.replace(":", "")}00`,
        `DTEND:202610${19 + t.day}T${t.end.replace(":", "")}00`,
        `SUMMARY:${escape(courseById(t.course).title + " - " + t.type)}`,
        `LOCATION:${escape(t.room)}`,
        "DESCRIPTION:Demo timetable. Floating times are Sri Lanka local time.",
        "END:VEVENT",
      ]),
      "END:VCALENDAR",
    ].join("\r\n");
    download("focus-timetable-19-oct-2026.ics", body, "text/calendar");
    notify("Timetable exported. Times are Sri Lanka local time.");
  }
  return (
    <>
      <PageTitle
        eyebrow="A LITTLE STRUCTURE GOES A LONG WAY"
        title="Your timetable"
        description="Find your next class, make space for your best work."
        action={
          <button className="button primary" onClick={exportCalendar}>
            <Download size={17} />
            Export calendar
          </button>
        }
      />
      <div className="timetable-toolbar">
        <div className="row">
          <button
            className="icon-button"
            aria-label="Previous week"
            onClick={() => setWeek((v) => v - 1)}
          >
            <ChevronLeft size={18} />
          </button>
          <h2>
            {week === 0
              ? "19 – 23 October 2026"
              : `Week of ${new Date(2026, 9, 19 + week * 7).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`}
          </h2>
          <button
            className="icon-button"
            aria-label="Next week"
            onClick={() => setWeek((v) => v + 1)}
          >
            <ChevronRight size={18} />
          </button>
        </div>
        <button
          className="button secondary"
          onClick={() => {
            setWeek(0);
            setDay(0);
          }}
        >
          Today
        </button>
      </div>
      <div className="timetable-legend">
        <Chip tone="mint">Lecture</Chip>
        <Chip tone="lavender">Lab</Chip>
        <Chip tone="peach">Exam</Chip>
        <span>All times in Sri Lanka · UTC+05:30</span>
      </div>
      {week === 0 ? (
        <>
          <div className="mobile-day-tabs">
            {days.map((d, i) => (
              <button
                key={d}
                className={day === i ? "active" : ""}
                onClick={() => setDay(i)}
              >
                {d.slice(0, 3)}
                <span>{19 + i}</span>
              </button>
            ))}
          </div>
          <div className="timetable-grid">
            {days.map((d, i) => (
              <section
                className={
                  "day-column " +
                  (i === day ? "mobile-selected " : "") +
                  (i === 0 ? "is-today" : "")
                }
                key={d}
              >
                <header>
                  <span>{d}</span>
                  <strong>{19 + i}</strong>
                  {i === 0 && <Chip tone="lavender">Today</Chip>}
                </header>
                {timetable
                  .filter((t) => t.day === i)
                  .map((t) => (
                    <Link
                      to={"/courses/" + t.course}
                      className={
                        "class-block " +
                        (t.type === "Lecture"
                          ? "mint"
                          : t.type === "Lab"
                            ? "lavender"
                            : "peach")
                      }
                      key={t.time}
                    >
                      <Chip>{t.type}</Chip>
                      <h3>{courseById(t.course).title}</h3>
                      <p>
                        <Clock3 size={13} />
                        {t.time} – {t.end}
                      </p>
                      <p>
                        <MapPin size={13} />
                        {t.room}
                      </p>
                      <small>{courseById(t.course).lecturer}</small>
                    </Link>
                  ))}
                <div className="free-time">Room to focus.</div>
              </section>
            ))}
          </div>
        </>
      ) : (
        <Empty
          title="This week hasn’t been published"
          body="The demo timetable covers 19–23 October 2026. Use Today to return to your current week."
        />
      )}
    </>
  );
}
