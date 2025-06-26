export default function FieldConfigPanel({ elements, selectedElementId, setElements }) {
  const selectedElement = elements.find(el => el.id === selectedElementId);

  const updateField = (key, value) => {
    const updated = elements.map(el =>
      el.id === selectedElementId ? { ...el, [key]: value } : el
    );
    setElements(updated);
  };

  if (!selectedElement) {
    return <div className="text-gray-400 italic">Click a field to configure it</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold mb-4">Field Configuration</h2>

      {/* Common: Label */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
        <input
          type="text"
          value={selectedElement.label || ""}
          onChange={(e) => updateField("label", e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      {/* Type-specific configs */}
      {["text", "number", "date"].includes(selectedElement.type) && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Placeholder</label>
          <input
            type="text"
            value={selectedElement.placeholder || ""}
            onChange={(e) => updateField("placeholder", e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
      )}

      {/* TODO: Add options array for select, radio */}
      {/* TODO: Add required checkbox */}

    </div>
  );
}
