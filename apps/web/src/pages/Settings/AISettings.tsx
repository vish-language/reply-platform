import { useEffect, useState } from "react";

import { getAISettings, updateAISettings } from "../../api/ai-settings.api";

export default function AISettings() {
  const [autoReplyEnabled, setAutoReplyEnabled] = useState(false);

  const [tone, setTone] = useState("professional");

  const [language, setLanguage] = useState("English");

  const [instructions, setInstructions] = useState("");

  const [loading, setLoading] = useState(false);

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      const response = await getAISettings();

      const settings = response.data;

      setAutoReplyEnabled(settings.autoReplyEnabled);

      setTone(settings.tone);

      setLanguage(settings.language);

      setInstructions(settings.instructions ?? "");
    }

    loadSettings();
  }, []);

  async function handleSave() {
    setLoading(true);

    await updateAISettings({
      autoReplyEnabled,

      tone,

      language,

      instructions: instructions || null,
    });

    setSaved(true);

    setLoading(false);
  }

  return (
    <div className="max-w-xl">
      <h1
        className="
text-3xl
font-bold
"
      >
        AI Settings
      </h1>

      <div
        className="
mt-8
space-y-6
"
      >
        <div>
          <label
            className="
flex
gap-3
items-center
"
          >
            <input
              type="checkbox"
              checked={autoReplyEnabled}
              onChange={(e) => setAutoReplyEnabled(e.target.checked)}
            />
            Enable Auto Reply
          </label>
        </div>

        <div>
          <label>Tone</label>

          <select
            className="
border
rounded-lg
w-full
p-3
mt-2
"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
          >
            <option value="professional">Professional</option>

            <option value="friendly">Friendly</option>

            <option value="casual">Casual</option>
          </select>
        </div>

        <div>
          <label>Language</label>

          <input
            className="
border
rounded-lg
w-full
p-3
mt-2
"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          />
        </div>

        <div>
          <label>Instructions</label>

          <textarea
            className="
border
rounded-lg
w-full
p-3
mt-2
"
            rows={5}
            value={instructions}
            placeholder="Example: Keep replies short and polite"
            onChange={(e) => setInstructions(e.target.value)}
          />
        </div>

        <button
          disabled={loading}
          onClick={handleSave}
          className="
bg-black
text-white
px-5
py-3
rounded-lg
"
        >
          {loading ? "Saving..." : saved ? "Saved ✓" : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
