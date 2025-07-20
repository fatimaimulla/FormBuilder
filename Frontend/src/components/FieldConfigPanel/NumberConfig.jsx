import { useState } from "react";

export default function NumberConfig({ field, updateField }) {
  const [regexInput, setRegexInput] = useState(field.pattern || "");
  const [regexError, setRegexError] = useState("");

  const handleRegexChange = (value) => {
    setRegexInput(value);
    if (value.trim() === "") {
    setRegexError("");
    updateField("pattern", "");
    return;
  }

    const looksLikeRegex = value.length > 1 && /[.*+?|()[\]{}\\]/.test(value);

    if (!looksLikeRegex) {
      setRegexError("This doesn't look like a valid number regex.");
      return;
    }

    try {
      new RegExp(value); // Try compiling it
      setRegexError("");
      updateField("pattern", value); // Save only if valid
    } catch (e) {
      setRegexError("Invalid regular expression syntax.");
    }
  };

  return (
    <div className="space-y-5">
      {/* Placeholder */}
      <div>
        <label className="block text-md font-medium mb-1">Placeholder</label>
        <input
          type="text"
          value={field.placeholder || ""}
          onChange={(e) => updateField("placeholder", e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      {/* Required */}
      <div className="flex items-center justify-start gap-2">
        <button
          type="button"
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
            field.required ? "bg-black" : "bg-gray-300"
          }`}
          onClick={() => updateField("required", !field.required)}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
              field.required ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
        <label className="text-md font-medium">Required field</label>
      </div>

      <div className="flex flex-row justify-between gap-4">
        {/* Min Value */}
        <div className="flex-1">
          <label className="block text-md font-medium mb-1">Min Value</label>
          <input
            type="number"
            value={field.minLength || ""}
            onChange={(e) => updateField("minLength", e.target.value)}
            className="w-full border px-3 py-2 rounded"
            min={0}
          />
        </div>

        {/* Max Value */}
        <div className="flex-1">
          <label className="block text-md font-medium mb-1">Max Value</label>
          <input
            type="number"
            value={field.maxLength || ""}
            onChange={(e) => updateField("maxLength", e.target.value)}
            className="w-full border px-3 py-2 rounded"
            min={0}
          />
        </div>
      </div>

      {/* Validation Pattern (Regex) */}
      <div>
        <label className="block text-md font-medium mb-1">
          Validation Pattern (Regex)
        </label>
        <input
          type="text"
          value={regexInput}
          onChange={(e) => handleRegexChange(e.target.value)}
          className={`w-full border px-3 py-2 rounded ${
            regexError ? "border-red-500" : ""
          }`}
          placeholder="e.g. ^[0-9]+$"
        />
        {regexError && (
          <p className="text-red-500 text-sm mt-1">{regexError}</p>
        )}
      </div>
    </div>
  );
}
