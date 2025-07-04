export default function DateConfig({ field, updateField }) {
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
    </div>
    )
}