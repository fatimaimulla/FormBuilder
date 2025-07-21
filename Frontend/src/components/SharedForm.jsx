import { useEffect, useState } from "react";
import PreviewRenderer from "../functions/previewRender";

export default function SharedForm() {
  const [elements, setElements] = useState([]);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const formId = query.get("form");

    if (!formId) {
      setError("No form ID found in the URL.");
      return;
    }

    const fetchForm = async () => {
      try {
        const res = await fetch(`https://formb-tk0d.onrender.com/forms/${formId}`);
        if (!res.ok) {
          throw new Error("Form not found");
        }

        const data = await res.json();
        setElements(data.form); // Assuming backend sends { form: [...] }
      } catch (err) {
        console.error("Error fetching form:", err);
        setError("Failed to load form. It might have been deleted or doesn't exist.");
      }
    };

    fetchForm();
  }, []);

  const handleChange = (id, value) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Form submitted successfully! (Check console for data)");
  };

  const commonInputClass = "border px-4 py-2 rounded w-full bg-white text-sm";
  const withLabelWrapper = (el, label, required) => (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {el}
    </div>
  );

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 text-center">
        <p className="text-red-600 text-lg font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
        <form className="space-y-9" onSubmit={handleSubmit}>
          <PreviewRenderer
            elements={elements}
            formData={formData}
            onChange={handleChange}
            commonInputClass={commonInputClass}
            withLabelWrapper={withLabelWrapper}
          />
          <div className="flex gap-5">
            <button
              type="reset"
              className="flex-1 bg-white text-black py-2 rounded border border-gray-300 hover:bg-gray-100">
              Reset
            </button>
            <button
              type="submit"
              className="flex-1 bg-black text-white py-2 rounded hover:bg-gray-700">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
