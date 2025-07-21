import PreviewRenderer from "../functions/previewRender";
import { useState } from "react";

export default function FormPreview({ elements }) {
  const [formData, setFormData] = useState({});

  const handleFormDataChange = (id, value) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);
    // You can extend this to actually process the data
  };

  const commonInputClass = "border rounded px-4 py-2 w-full bg-white text-sm";

  const withLabelWrapper = (element, label, required) => (
    <div className="flex flex-col gap-3">
      <label className="block font-semibold text-sm text-gray-700">
        {label} {required && <span style={{ color: 'red' }}>*</span>}
      </label>
      {element}
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold mb-4">Form Preview</h2>
      <div className="border rounded-md">
        <form className="space-y-4 p-5" onSubmit={handleSubmit}>
          <PreviewRenderer
            elements={elements}
            formData={formData}
            onChange={handleFormDataChange}
            withLabelWrapper={withLabelWrapper}
            commonInputClass={commonInputClass}
          />
          <button className="w-full bg-black text-white rounded p-2">Submit</button>
        </form>
      </div>
    </div>
  );
}
