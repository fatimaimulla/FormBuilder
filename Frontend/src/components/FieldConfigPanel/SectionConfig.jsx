export default function SectionConfig({ field, updateField }) {
  return (
    <div className="space-y-5">
      

      {/* Description */}
      <div>
        <label className="block text-md font-medium mb-1">Description</label>
        <textarea
          rows={4}
          value={field.description || ""}
          onChange={(e) => updateField("description", e.target.value)}
          className="w-full border px-3 py-2 rounded resize-none"
          placeholder="Add a description..."
        />
      </div>
    </div>
  );
}
