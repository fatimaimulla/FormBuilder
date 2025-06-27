export default function TextConfig({ field, updateField }) {
  return (
    <div className="space-y-5">

      {/* Label */}
      <div>
        <label className="block text-md font-medium mb-1">Label</label>
        <input
          type="text"
          value={field.label || ""}
          onChange={(e) => updateField("label", e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

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
            field.required ? 'bg-black' : 'bg-gray-300'
            }`}
            onClick={() => updateField("required", !field.required)}
        >
            <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                field.required ? 'translate-x-6' : 'translate-x-1'
            }`}
            />
        </button>
        <label className="text-md font-medium">Required field</label>
      </div>

      <div className="flex flex-row justify-between gap-4">
        {/* Min Length */}
        <div className="flex-1">
            <label className="block text-md font-medium mb-1">Min Length</label>
            <input
            type="number"
            value={field.minLength || ""}
            onChange={(e) => updateField("minLength", e.target.value)}
            className="w-full border px-3 py-2 rounded"
            min={0}
            />
        </div>

        {/* Max Length */}
        <div className="flex-1">
            <label className="block text-md font-medium mb-1">Max Length</label>
            <input
            type="number"
            value={field.maxLength || ""}
            onChange={(e) => updateField("maxLength", e.target.value)}
            className="w-full border px-3 py-2 rounded"
            min={0}
            />
        </div>
      </div>

      {/* Validation Pattern */}
      <div>
        <label className="block text-md font-medium mb-1">
          Validation Pattern (Regex)
        </label>
        <input
          type="text"
          value={field.pattern || ""}
          onChange={(e) => updateField("pattern", e.target.value)}
          className="w-full border px-3 py-2 rounded"
          placeholder="e.g. ^[a-zA-Z]+$"
        />
      </div>
    </div>
  );
}
