import { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Send,
  Mic,
  ThumbsUp,
  ThumbsDown,
  Trash2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { assignments, dueLabel, formatDate, formatTime } from "../data/seed";
import { useLocal, useStore } from "../hooks/useStore";
import { Modal } from "./UI";
type Recognition = {
  lang: string;
  onresult: ((e: { results: { transcript: string }[][] }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};
export function VoiceButton({
  onResult,
}: {
  onResult: (text: string) => void;
}) {
  const { notify } = useStore();
  const [listening, setListening] = useState(false);
  const active = useRef<Recognition | null>(null);
  useEffect(() => () => active.current?.stop(), []);
  function listen() {
    const w = window as unknown as {
      SpeechRecognition?: new () => Recognition;
      webkitSpeechRecognition?: new () => Recognition;
    };
    const C = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!C) {
      notify(
        "Voice is not available in this browser. Please type your request.",
      );
      return;
    }
    const r = new C();
    active.current = r;
    r.lang = "en-US";
    r.onresult = (e) => {
      onResult(e.results[0][0].transcript);
      setListening(false);
    };
    r.onerror = (e) => {
      notify("Microphone: " + e.error + ". You can continue by typing.");
      setListening(false);
    };
    r.onend = () => setListening(false);
    setListening(true);
    try {
      r.start();
    } catch {
      setListening(false);
      notify("Microphone could not start. Please type instead.");
    }
  }
  return (
    <button
      className={"icon-button " + (listening ? "listening" : "")}
      onClick={listen}
      aria-label={listening ? "Listening" : "Use voice input"}
      title="Voice may use your browser’s speech service. Only enable it in a private space."
    >
      <Mic size={18} />
      {listening && <span>Listening…</span>}
    </button>
  );
}
type Chat = {
  role: "user" | "assistant";
  text: string;
  to?: string;
  label?: string;
  rating?: string;
};
export default function Assistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [chat, setChat] = useLocal<Chat[]>("chat", []);
  const { messages, submissions, settings, notify } = useStore();
  const navigate = useNavigate();
  const prompts = [
    "What is my next deadline?",
    "When is my ML lecture?",
    "Show unread messages",
    "How do I register for exams?",
  ];
  function ask(text: string) {
    if (!text.trim()) return;
    const q = text.toLowerCase();
    let answer: Chat = {
      role: "assistant",
      text: "I’m not sure. Try a deadline, timetable, message or exam question, or talk to a human.",
      to: "/help?contact=1",
      label: "Contact support",
    };
    if (q.includes("deadline")) {
      const next = assignments
        .filter(
          (a) =>
            !submissions[a.id] &&
            a.status !== "Submitted" &&
            a.status !== "Overdue",
        )
        .sort((a, b) => a.due.localeCompare(b.due))[0];
      answer = next
        ? {
            role: "assistant",
            text: `Your next deadline is ${next.title}, ${formatDate(next.due)} at ${formatTime(next.due)}. ${dueLabel(next.due)}. There is also an overdue practical assignment to review.`,
            to: "/assignments/" + next.id,
            label: "View assignment",
          }
        : {
            role: "assistant",
            text: "You have no upcoming unsubmitted assignments.",
            to: "/assignments",
            label: "View assignments",
          };
    } else if (q.includes("lecture") || q.includes("timetable")) {
      answer = {
        role: "assistant",
        text: "Your Machine Learning lecture is Monday, 09:00–11:00 in Lecture Hall 02. The demo week starts on 19 October 2026.",
        to: "/timetable",
        label: "Open timetable",
      };
      if (q.includes("open")) navigate("/timetable");
    } else if (q.includes("message"))
      answer = {
        role: "assistant",
        text: `You have ${messages.filter((m) => !m.read).length} unread messages.`,
        to: "/messages?filter=unread",
        label: "Show unread messages",
      };
    else if (q.includes("exam") || q.includes("register"))
      answer = {
        role: "assistant",
        text: "The official notice closed on 23 January 2026 at 13:00. You can explore a clearly labelled practice form: check details, select subjects, review, and confirm. This does not register you with the university.",
        to: "/exam-registration",
        label: "Open exam registration",
      };
    setChat((v) => [...v, { role: "user", text }, answer]);
    setInput("");
    if (settings.spoken && "speechSynthesis" in window) {
      speechSynthesis.cancel();
      speechSynthesis.speak(new SpeechSynthesisUtterance(answer.text));
    }
  }
  return (
    <>
      <button
        className="assistant-launch"
        onClick={() => setOpen(true)}
        aria-label="Open learning assistant"
      >
        <Sparkles size={19} />
        <span>Ask Fōcus</span>
      </button>
      {open && (
        <Modal title="Your learning companion" onClose={() => setOpen(false)}>
          <div className="assistant-intro">
            <span className="assistant-orb">
              <Sparkles />
            </span>
            <h3>A little help to keep you moving.</h3>
            <p>Ask about your courses, deadlines or day.</p>
          </div>
          <div className="notice small">
            Mock AI can make mistakes: verify important dates. Answers use only
            this demo’s course data.
          </div>
          <div className="chat-log" aria-live="polite">
            {chat.map((m, i) => (
              <div className={"chat-bubble " + m.role} key={i}>
                <p>{m.text}</p>
                {m.to && (
                  <Link onClick={() => setOpen(false)} to={m.to}>
                    {m.label} →
                  </Link>
                )}
                {m.role === "assistant" && (
                  <div className="row">
                    <button
                      className="icon-button"
                      aria-label="Helpful answer"
                      aria-pressed={m.rating === "up"}
                      onClick={() => {
                        setChat((v) =>
                          v.map((c, j) =>
                            j === i ? { ...c, rating: "up" } : c,
                          ),
                        );
                        notify("Thanks for your feedback.");
                      }}
                    >
                      <ThumbsUp size={14} />
                    </button>
                    <button
                      className="icon-button"
                      aria-label="Unhelpful answer"
                      aria-pressed={m.rating === "down"}
                      onClick={() => {
                        setChat((v) =>
                          v.map((c, j) =>
                            j === i ? { ...c, rating: "down" } : c,
                          ),
                        );
                        notify("Feedback saved. You can also contact a human.");
                      }}
                    >
                      <ThumbsDown size={14} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="prompt-chips">
            {prompts.map((p) => (
              <button key={p} onClick={() => ask(p)}>
                {p}
              </button>
            ))}
          </div>
          <form
            className="chat-input"
            onSubmit={(e) => {
              e.preventDefault();
              ask(input);
            }}
          >
            <label className="sr-only" htmlFor="chat-input">
              Ask a question
            </label>
            <input
              id="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="What’s on your mind?"
            />
            <VoiceButton onResult={ask} />
            <button className="icon-button primary" aria-label="Send question">
              <Send size={17} />
            </button>
          </form>
          <p className="fine-print">
            Chat stays in this browser. Voice may be processed by your browser’s
            speech provider; do not dictate sensitive information. Mock replies
            cannot replace faculty advice.
          </p>
          <div className="spread">
            <button
              className="text-button"
              onClick={() => {
                setChat([]);
                notify("Chat history cleared.");
              }}
            >
              <Trash2 size={14} />
              Clear chat history
            </button>
            <Link to="/help?contact=1" onClick={() => setOpen(false)}>
              Talk to a human ↗
            </Link>
          </div>
        </Modal>
      )}
    </>
  );
}
