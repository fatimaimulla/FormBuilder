import { Trash2, Plus } from "lucide-react";

export default function RadioConfig({ field, updateField }) {
  // Ensure options array exists
  const options = field.options && field.options.length > 0
    ? field.options
    : [{ label: "Option 1", value: "option-1" }];

  // Initialize options into the field if missing
  if (!field.options || field.options.length === 0) {
    updateField("options", options);
  }

  const updateOption = (index, key, value) => {
    const updated = [...options];
    updated[index][key] = value;
    updateField("options", updated);
  };

  const addOption = () => {
    const newOption = {
      label: "",
      value: `option-${options.length + 1}`,
    };
    updateField("options", [...options, newOption]);
  };

  const removeOption = (index) => {
    const updated = options.filter((_, i) => i !== index);
    updateField("options", updated);
  };

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

      {/* Required Toggle */}
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

      {/* Options Section */}
      <div className="space-y-4">
        <h2 className="text-md font-semibold">Options</h2>

        {/* Options List */}
        <div className="space-y-2">
          {options.map((opt, index) => (
            <div key={index} className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="Option label"
                value={opt.label}
                onChange={(e) =>
                  updateOption(index, "label", e.target.value)
                }
                className="w-[40%] border px-3 py-2 rounded"
              />
              <input
                type="text"
                placeholder="Value"
                value={opt.value}
                onChange={(e) =>
                  updateOption(index, "value", e.target.value)
                }
                className="w-[40%] border px-3 py-2 rounded"
              />
              <button
                onClick={() => removeOption(index)}
                className="text-black"
              >
                <Trash2 className="w-4 h-4 ml-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Add Option Button */}
        <button
          onClick={addOption}
          className="w-full border border-gray-300 text-sm text-black py-2 rounded flex items-center justify-center gap-2 hover:bg-gray-100 transition"
        >
          <Plus className="w-4 h-4 text-black font-semibold" />
          <span className="font-semibold">Add Option</span>
        </button>
      </div>
    </div>
  );
}
