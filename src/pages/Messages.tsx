import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  Search,
  Plus,
  Star,
  Trash2,
  Mail,
  MailOpen,
  Send,
  ArrowUpRight,
} from "lucide-react";
import { useStore } from "../hooks/useStore";
import { PageTitle, Modal, Empty, Chip } from "../components/UI";
export default function Messages() {
  const { messages, setMessages, notify } = useStore();
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState(
    params.get("filter") === "unread" ? "Unread" : "All",
  );
  const [selected, setSelected] = useState<string | null>(null);
  const [compose, setCompose] = useState(!!params.get("compose"));
  const [to, setTo] = useState(params.get("compose") || "");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const current = messages.find((m) => m.id === selected);
  const list = messages.filter(
    (m) =>
      (m.subject + " " + m.sender + " " + m.body)
        .toLowerCase()
        .includes(q.toLowerCase()) &&
      (filter === "Unread" ? !m.read : filter === "Starred" ? m.starred : true),
  );
  function change(id: string, update: { read?: boolean; starred?: boolean }) {
    setMessages((v) => v.map((m) => (m.id === id ? { ...m, ...update } : m)));
  }
  function closeCompose() {
    setCompose(false);
    setParams({});
  }
  return (
    <>
      <PageTitle
        eyebrow="STAY CONNECTED"
        title="Your inbox"
        description="Good conversations move your learning forward."
        action={
          <button className="button primary" onClick={() => setCompose(true)}>
            <Plus size={17} />
            New message
          </button>
        }
      />
      <div className="toolbar">
        <div className="search-field">
          <Search size={18} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Search messages"
            placeholder="Search messages or people…"
          />
        </div>
        <Chip tone="lavender">
          {messages.filter((m) => !m.read).length} unread
        </Chip>
      </div>
      <div className="filter-tabs spacious">
        {["All", "Unread", "Starred"].map((f) => (
          <button
            className={f === filter ? "active" : ""}
            key={f}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>
      <div className="inbox-layout">
        <section className="message-list" aria-label="Messages">
          {list.map((m) => (
            <button
              key={m.id}
              onClick={() => {
                setSelected(m.id);
                change(m.id, { read: true });
              }}
              className={
                "message-item " +
                (!m.read ? "unread " : "") +
                (m.id === selected ? "selected" : "")
              }
            >
              <span className={"avatar " + (m.read ? "neutral" : "lavender")}>
                {m.sender
                  .split(" ")
                  .filter((x) => x !== "Dr.")
                  .map((x) => x[0])
                  .slice(0, 2)
                  .join("")}
              </span>
              <span className="message-summary">
                <span className="spread">
                  <strong>{m.sender}</strong>
                  <small>{m.date}</small>
                </span>
                <b>{m.subject}</b>
                <span>{m.body.slice(0, 76)}…</span>
              </span>
              {!m.read && <i className="notification-dot" />}
              {m.starred && <Star size={13} fill="currentColor" />}
            </button>
          ))}
          {!list.length && (
            <Empty
              title="A little breathing room"
              body="No messages match this view. Try another filter or search."
            />
          )}
        </section>
        <section className="message-thread">
          {current ? (
            <>
              <div className="spread">
                <Chip>
                  {current.sender === "You"
                    ? "Local outgoing message"
                    : "Course conversation"}
                </Chip>
                <div className="row">
                  <button
                    className="icon-button"
                    aria-label={
                      current.starred ? "Unstar message" : "Star message"
                    }
                    onClick={() =>
                      change(current.id, { starred: !current.starred })
                    }
                  >
                    <Star
                      size={18}
                      fill={current.starred ? "currentColor" : "none"}
                    />
                  </button>
                  <button
                    className="icon-button"
                    aria-label={current.read ? "Mark unread" : "Mark read"}
                    onClick={() => {
                      change(current.id, { read: !current.read });
                      notify(
                        current.read
                          ? "Message marked unread."
                          : "Message marked read.",
                      );
                    }}
                  >
                    {current.read ? <Mail size={18} /> : <MailOpen size={18} />}
                  </button>
                  <button
                    className="icon-button"
                    aria-label="Delete message"
                    onClick={() => setDeleting(true)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <h2>{current.subject}</h2>
              <div className="lecturer">
                <span className="avatar tiny lavender">
                  {current.sender[0]}
                </span>
                <strong>{current.sender}</strong> · {current.date}
              </div>
              <p className="message-body">{current.body}</p>
              <button
                className="button secondary"
                onClick={() => {
                  setTo(
                    current.sender === "You"
                      ? "Faculty Office"
                      : current.sender,
                  );
                  setSubject("Re: " + current.subject);
                  setBody("");
                  setCompose(true);
                }}
              >
                Reply <Send size={15} />
              </button>
            </>
          ) : (
            <Empty
              title="Make a little connection"
              body="Choose a conversation to read a message or send a reply."
            />
          )}
        </section>
      </div>
      {compose && (
        <Modal title="New message" onClose={closeCompose}>
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              if (!to.trim() || !subject.trim() || !body.trim()) {
                setError("Add a recipient, subject and message before saving.");
                return;
              }
              setMessages((v) => [
                {
                  id: "m" + Date.now(),
                  sender: "You",
                  subject,
                  body: `To: ${to}\n\n${body}`,
                  read: true,
                  starred: false,
                  date: "Today",
                },
                ...v,
              ]);
              setSubject("");
              setBody("");
              setError("");
              closeCompose();
              notify(
                "Message saved locally. No message was sent outside this demo.",
              );
            }}
          >
            <label>
              To
              <input
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="Lecturer or participant name"
                required
              />
            </label>
            <label>
              Subject
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </label>
            <label>
              Message
              <textarea
                rows={5}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
              />
            </label>
            <p className="field-error" role="alert">
              {error}
            </p>
            <p className="fine-print">
              Demo messaging stays in this browser. No email or university
              message is sent.
            </p>
            <button className="button primary" type="submit">
              <Send size={16} />
              Save demo message
            </button>
          </form>
        </Modal>
      )}
      {deleting && current && (
        <Modal title="Delete this message?" onClose={() => setDeleting(false)}>
          <p>You can undo this action from the confirmation message.</p>
          <div className="row">
            <button
              className="button secondary"
              onClick={() => setDeleting(false)}
            >
              Cancel
            </button>
            <button
              className="button danger"
              onClick={() => {
                const before = messages;
                setMessages((v) => v.filter((m) => m.id !== current.id));
                setSelected(null);
                setDeleting(false);
                notify("Message deleted.", () => setMessages(before));
              }}
            >
              Delete message
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
export function Notifications() {
  const { alerts, setAlerts, notify } = useStore();
  const [filter, setFilter] = useState("All");
  return (
    <>
      <PageTitle
        eyebrow="ONLY WHAT YOU NEED TO KNOW"
        title="Notifications"
        description="Important updates, clearly organised."
        action={
          <button
            className="button primary"
            onClick={() => {
              setAlerts((v) => v.map((n) => ({ ...n, read: true })));
              notify("All notifications marked as read.");
            }}
          >
            Mark all as read
          </button>
        }
      />
      <div className="filter-tabs spacious">
        {["All", "Unread", "Urgent", "Important", "Info"].map((f) => (
          <button
            key={f}
            className={filter === f ? "active" : ""}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>
      {["Urgent", "Important", "Info"].map((priority) => {
        const group = alerts.filter(
          (n) =>
            n.priority === priority &&
            (filter === "All" ||
              (filter === "Unread" && !n.read) ||
              filter === n.priority),
        );
        return group.length ? (
          <section className="notification-group" key={priority}>
            <h2>
              {priority} <Chip>{group.length}</Chip>
            </h2>
            {group.map((n) => (
              <article
                className={"notification-item " + (!n.read ? "unread" : "")}
                key={n.id}
              >
                <span
                  className={
                    "notification-symbol " +
                    (priority === "Urgent"
                      ? "peach"
                      : priority === "Important"
                        ? "lavender"
                        : "mint")
                  }
                >
                  {" "}
                  {priority === "Urgent"
                    ? "!"
                    : priority === "Important"
                      ? "✦"
                      : "i"}
                </span>
                <div className="flex-grow">
                  <h3>{n.title}</h3>
                  <p>{n.body}</p>
                  <Link
                    className="text-link"
                    to={n.to}
                    onClick={() =>
                      setAlerts((v) =>
                        v.map((a) =>
                          a.id === n.id ? { ...a, read: true } : a,
                        ),
                      )
                    }
                  >
                    View details <ArrowUpRight size={14} />
                  </Link>
                </div>
                <button
                  className="icon-button"
                  aria-label={
                    (n.read ? "Mark unread: " : "Mark read: ") + n.title
                  }
                  onClick={() =>
                    setAlerts((v) =>
                      v.map((a) =>
                        a.id === n.id ? { ...a, read: !a.read } : a,
                      ),
                    )
                  }
                >
                  {n.read ? <MailOpen size={18} /> : <Mail size={18} />}
                </button>
              </article>
            ))}
          </section>
        ) : null;
      })}
      {filter === "Unread" && alerts.every((n) => n.read) && (
        <Empty
          title="You’re all caught up"
          body="No unread notifications. New updates will appear here."
        />
      )}
    </>
  );
}
