import { useState } from "react";
import { Check, ArrowRight, GraduationCap, CircleAlert } from "lucide-react";
import { Link } from "react-router-dom";
import { courses } from "../data/seed";
import { useLocal, useStore } from "../hooks/useStore";
import { PageTitle, Modal, Chip } from "../components/UI";
const initial = {
  initials: "Vepusanan N.",
  fullName: "",
  registration: "FC000000",
  index: "",
  email: "",
  mobile: "",
  intake: "Proper",
  subjects: [] as string[],
};
export default function Exam() {
  const [data, setData] = useLocal("exam-draft", initial);
  const [record, setRecord] = useLocal<{
    reference: string;
    details: typeof initial;
  } | null>("exam-record", null);
  const [step, setStep] = useState(0);
  const [practice, setPractice] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [withdraw, setWithdraw] = useState(false);
  const { notify } = useStore();
  const fields = [
    ["initials", "Name with initials", "text"],
    ["fullName", "Full name", "text"],
    ["registration", "Registration number", "text"],
    ["index", "Index number", "text"],
    ["email", "Email address", "email"],
    ["mobile", "Mobile number", "tel"],
  ] as const;
  function next() {
    const e: Record<string, string> = {};
    if (step === 0) {
      fields.forEach(([key, label]) => {
        if (!data[key].trim()) e[key] = label + " is required.";
      });
      if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
        e.email = "Enter a valid email address.";
      if (
        data.mobile &&
        !/^(?:\+94|0)\d{9}$/.test(data.mobile.replace(/[\s-]/g, ""))
      )
        e.mobile = "Use 0771234567 or +94771234567.";
      if (data.registration && !/^FC\d{6}$/i.test(data.registration))
        e.registration = "Use the demo format FC followed by 6 digits.";
    }
    if (step === 1 && !data.subjects.length)
      e.subjects = "Choose at least one subject.";
    setErrors(e);
    if (Object.keys(e).length) {
      requestAnimationFrame(() =>
        document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(),
      );
      return;
    }
    setStep((v) => v + 1);
  }
  function confirm() {
    setRecord({
      reference: "DEMO-" + Date.now().toString(36).toUpperCase(),
      details: data,
    });
    setStep(3);
    notify(
      "Practice registration saved locally. No official registration has been made.",
    );
  }
  return (
    <>
      <PageTitle
        eyebrow="YOUR NEXT CHAPTER"
        title="Exam registration"
        description="Clear details. A chance to review. No last-minute surprises."
      />
      <div className="notice warning">
        <CircleAlert size={21} />
        <div>
          <strong>Official registration is closed</strong>
          <p>
            The original notice deadline was Friday, 23 January 2026 at 1:00
            p.m. Sri Lanka time. That date is in the past. Contact the Faculty
            Office for the next official window.
          </p>
        </div>
      </div>
      <div className="two-col">
        <section className="panel">
          {!practice && !record ? (
            <>
              <span className="large-icon lavender">
                <GraduationCap size={34} />
              </span>
              <h2>Get familiar with the process.</h2>
              <p>
                Use a practice form to explore the registration steps. It uses
                demo information, stays in this browser, and does not register
                you for an examination.
              </p>
              <button
                className="button primary"
                onClick={() => setPractice(true)}
              >
                Open practice registration <ArrowRight size={16} />
              </button>
            </>
          ) : record && !practice ? (
            <>
              <Chip tone="mint">
                <Check size={14} />
                Practice registration saved
              </Chip>
              <h2>You’re ready for the real thing.</h2>
              <p>
                Reference: <strong>{record.reference}</strong>
              </p>
              <p>
                {record.details.initials} · {record.details.subjects.length}{" "}
                subjects selected
              </p>
              <div className="notice">
                This is a local practice record. It is not an official
                examination registration.
              </div>
              <div className="row">
                <button
                  className="button secondary"
                  onClick={() => {
                    setData(record.details);
                    setStep(0);
                    setPractice(true);
                  }}
                >
                  Edit practice registration
                </button>
                <button
                  className="text-button danger-text"
                  onClick={() => setWithdraw(true)}
                >
                  Withdraw practice record
                </button>
              </div>
            </>
          ) : (
            <>
              <Chip tone="lavender">
                PRACTICE MODE · No official submission
              </Chip>
              <div className="steps">
                {["Details", "Subjects", "Review", "Confirm"].map((s, i) => (
                  <div className={step >= i ? "active" : ""} key={s}>
                    <span>{step > i ? <Check size={15} /> : i + 1}</span>
                    <small>{s}</small>
                  </div>
                ))}
              </div>
              {step === 0 && (
                <form
                  noValidate
                  onSubmit={(e) => {
                    e.preventDefault();
                    next();
                  }}
                >
                  <h2>First, a few details.</h2>
                  <div className="form-grid">
                    {fields.map(([key, label, type]) => (
                      <label key={key}>
                        {label}
                        <input
                          aria-label={label}
                          type={type}
                          value={data[key]}
                          required
                          aria-invalid={!!errors[key]}
                          aria-describedby={key + "-error"}
                          onChange={(e) =>
                            setData((v) => ({ ...v, [key]: e.target.value }))
                          }
                        />
                        <span className="field-error" id={key + "-error"}>
                          {errors[key]}
                        </span>
                      </label>
                    ))}
                  </div>
                  <label>
                    Intake type
                    <select
                      value={data.intake}
                      onChange={(e) =>
                        setData((v) => ({ ...v, intake: e.target.value }))
                      }
                    >
                      <option>Proper</option>
                      <option>Boat round</option>
                      <option>Batch</option>
                    </select>
                  </label>
                  <button className="button primary" type="submit">
                    Continue to subjects <ArrowRight size={16} />
                  </button>
                </form>
              )}
              {step === 1 && (
                <>
                  <h2>Choose your subjects.</h2>
                  <p>
                    Verify course codes with your faculty before any official
                    application.
                  </p>
                  {courses
                    .filter((c) => c.semester === 5)
                    .map((c) => (
                      <label key={c.id} className="subject-option">
                        <input
                          type="checkbox"
                          checked={data.subjects.includes(c.id)}
                          onChange={(e) =>
                            setData((v) => ({
                              ...v,
                              subjects: e.target.checked
                                ? [...v.subjects, c.id]
                                : v.subjects.filter((s) => s !== c.id),
                            }))
                          }
                        />
                        <span>
                          <strong>{c.title}</strong>
                          <small>{c.code}</small>
                        </span>
                      </label>
                    ))}
                  <p className="field-error" role="alert">
                    {errors.subjects}
                  </p>
                  <div className="row">
                    <button
                      className="button secondary"
                      onClick={() => setStep(0)}
                    >
                      Back
                    </button>
                    <button className="button primary" onClick={next}>
                      Review selection <ArrowRight size={16} />
                    </button>
                  </div>
                </>
              )}
              {step === 2 && (
                <>
                  <h2>One final look.</h2>
                  <dl className="review-grid">
                    {fields.map(([key, label]) => (
                      <div key={key}>
                        <dt>{label}</dt>
                        <dd>{data[key]}</dd>
                      </div>
                    ))}
                    <div>
                      <dt>Intake</dt>
                      <dd>{data.intake}</dd>
                    </div>
                  </dl>
                  <h3>Your subjects</h3>
                  <ul>
                    {courses
                      .filter((c) => data.subjects.includes(c.id))
                      .map((c) => (
                        <li key={c.id}>
                          {c.title} · {c.code}
                        </li>
                      ))}
                  </ul>
                  <div className="notice small">
                    Confirming saves a practice record only. The official
                    January 2026 window is closed.
                  </div>
                  <div className="row">
                    <button
                      className="button secondary"
                      onClick={() => setStep(1)}
                    >
                      Back
                    </button>
                    <button className="button primary" onClick={confirm}>
                      Confirm practice registration <Check size={16} />
                    </button>
                  </div>
                </>
              )}
              {step === 3 && (
                <>
                  <div className="success-art">
                    <Check size={36} />
                  </div>
                  <h2>Practice complete.</h2>
                  <p>
                    Your reference is <strong>{record?.reference}</strong>. This
                    record is saved only in your browser.
                  </p>
                  <button
                    className="button primary"
                    onClick={() => setPractice(false)}
                  >
                    View practice record
                  </button>
                </>
              )}
            </>
          )}
        </section>
        <aside className="stack">
          <div className="panel">
            <h2>Repeat subject payment</h2>
            <p>
              Before paying, contact the Faculty Office to confirm the current
              fee, account details and receipt requirements.
            </p>
            <p>
              Keep a copy of your payment receipt. This prototype does not
              accept or process payments.
            </p>
            <Link className="text-link" to="/help?contact=1">
              Contact Faculty Office →
            </Link>
          </div>
          <div className="panel">
            <h3>Why no countdown?</h3>
            <p>
              The original deadline has passed. A countdown would misleadingly
              imply registration is still available. Practice records can be
              edited or withdrawn at any time.
            </p>
          </div>
        </aside>
      </div>
      {withdraw && (
        <Modal
          title="Withdraw practice registration?"
          onClose={() => setWithdraw(false)}
        >
          <p>
            This removes the local practice record. It does not affect any
            university registration.
          </p>
          <div className="row">
            <button
              className="button secondary"
              onClick={() => setWithdraw(false)}
            >
              Keep record
            </button>
            <button
              className="button danger"
              onClick={() => {
                const previous = record;
                setRecord(null);
                setWithdraw(false);
                setPractice(false);
                setStep(0);
                notify("Practice record withdrawn.", () => setRecord(previous));
              }}
            >
              Withdraw record
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
