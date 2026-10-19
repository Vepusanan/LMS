import { useState } from "react";
import { Moon, Sun, Monitor, RotateCcw } from "lucide-react";
import { useStore, defaults } from "../hooks/useStore";
import type { Settings as SettingsType } from "../hooks/useStore";
import { PageTitle, Modal } from "../components/UI";
export default function Settings() {
  const { settings, setSettings, notify } = useStore();
  const [reset, setReset] = useState(false);
  function set<K extends keyof SettingsType>(key: K, value: SettingsType[K]) {
    setSettings((v) => ({ ...v, [key]: value }));
  }
  function toggle(key: keyof SettingsType, title: string, description: string) {
    return (
      <label className="setting-row">
        <span>
          <strong>{title}</strong>
          <small>{description}</small>
        </span>
        <input
          className="switch"
          type="checkbox"
          checked={!!settings[key]}
          onChange={(e) => set(key, e.target.checked as never)}
          aria-label={title}
        />
      </label>
    );
  }
  return (
    <>
      <PageTitle
        eyebrow="MAKE YOURSELF AT HOME"
        title="Settings & accessibility"
        description="A learning space that works the way you do. Changes save automatically."
        action={
          <button className="button secondary" onClick={() => setReset(true)}>
            <RotateCcw size={16} />
            Reset to defaults
          </button>
        }
      />
      <div className="settings-grid">
        <section className="panel">
          <h2>Your view</h2>
          <p>Choose what feels comfortable.</p>
          <div className="theme-options">
            {[
              ["light", "Light", Sun],
              ["dark", "Dark", Moon],
              ["system", "System", Monitor],
            ].map(([value, label, Icon]) => {
              const I = Icon as typeof Sun;
              return (
                <button
                  key={String(value)}
                  className={settings.theme === value ? "active" : ""}
                  onClick={() => set("theme", String(value))}
                  aria-pressed={settings.theme === value}
                >
                  <I size={23} />
                  {String(label)}
                </button>
              );
            })}
          </div>
          <label className="setting-row">
            <span>
              <strong>Text size</strong>
              <small>{settings.size}% · Applies throughout the app</small>
            </span>
            <input
              type="range"
              aria-label="Text size"
              min="90"
              max="125"
              step="5"
              value={settings.size}
              onChange={(e) => set("size", Number(e.target.value))}
            />
          </label>
          {toggle(
            "contrast",
            "High contrast",
            "Stronger borders and clearer text.",
          )}
          {toggle(
            "motion",
            "Reduced motion",
            "Keep transitions calm and limit movement.",
          )}
          {toggle(
            "dyslexia",
            "Reading-friendly font",
            "Use spacious, familiar letterforms and extra line height.",
          )}
          <label className="setting-row">
            <span>
              <strong>Navigation language</strong>
              <small>
                Main labels only; course content remains in English.
              </small>
            </span>
            <select
              value={settings.language}
              onChange={(e) => set("language", e.target.value)}
              aria-label="Navigation language"
            >
              <option>English</option>
              <option>සිංහල</option>
              <option>தமிழ்</option>
            </select>
          </label>
        </section>
        <section className="panel">
          <h2>Stay in the loop</h2>
          <p>
            These are local preferences for this prototype. No email or push
            notifications are sent.
          </p>
          {toggle(
            "email",
            "Email digest",
            "Include course updates in your preferred digest.",
          )}
          {toggle(
            "push",
            "Push notifications",
            "Save your preference; this demo never asks for browser permission.",
          )}
          {toggle(
            "digest",
            "Daily digest",
            "Group updates instead of interrupting your day.",
          )}
          {toggle(
            "quiet",
            "Quiet hours",
            "Pause optional reminders during your quiet period.",
          )}
          {settings.quiet && (
            <div className="form-grid quiet-times">
              <label>
                Quiet hours start
                <input
                  type="time"
                  value={settings.quietStart}
                  onChange={(e) => set("quietStart", e.target.value)}
                />
              </label>
              <label>
                Quiet hours end
                <input
                  type="time"
                  value={settings.quietEnd}
                  onChange={(e) => set("quietEnd", e.target.value)}
                />
              </label>
            </div>
          )}
          <h3>Notification categories</h3>
          {toggle(
            "assignments",
            "Assignment reminders",
            "Deadlines and submission updates.",
          )}
          {toggle(
            "announcements",
            "Faculty announcements",
            "Academic and administrative notices.",
          )}
          {toggle(
            "messages",
            "Message notifications",
            "New conversations from your learning community.",
          )}
        </section>
        <section className="panel">
          <h2>Assistant & voice</h2>
          {toggle(
            "spoken",
            "Spoken assistant replies",
            "Read mock assistant replies aloud using your browser.",
          )}
          <p>
            Voice recognition support varies by browser and may use an external
            speech service. Text input is always available. Avoid dictating
            private information.
          </p>
          <p className="fine-print">
            Personalisation is transparent: deadline lists are sorted by date;
            preferences are stored locally. The full notifications center stays
            available, even when optional reminders are muted.
          </p>
        </section>
        <section className="panel">
          <h2>Your data, on this device</h2>
          <p>
            Course progress, drafts, submissions and settings are stored in this
            browser. Files are not uploaded, and your data is not synced between
            devices.
          </p>
          <p>
            Resetting settings will keep your course progress and saved work.
            Clearing your browser storage removes all demo data.
          </p>
        </section>
      </div>
      {reset && (
        <Modal title="Reset preferences?" onClose={() => setReset(false)}>
          <p>
            This restores the default appearance and notification preferences.
            Your course progress and saved work stay intact.
          </p>
          <div className="row">
            <button
              className="button secondary"
              onClick={() => setReset(false)}
            >
              Keep preferences
            </button>
            <button
              className="button primary"
              onClick={() => {
                setSettings(defaults);
                setReset(false);
                notify("Preferences reset to defaults.");
              }}
            >
              Reset preferences
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
