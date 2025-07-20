import { useState } from "react";

export default function ImportModal({ onClose, onImport }) {
  const [jsonData, setJsonData] = useState('');

  const handleImportClick = () => {
  try {
    const parsed = JSON.parse(jsonData);
    
    // Allow direct array OR { fields: [...] }
    const fields = Array.isArray(parsed) ? parsed : parsed.fields;

    if (Array.isArray(fields)) {
      onImport(fields);
      onClose();
    } else {
      alert("Invalid format. Expecting an array of fields.");
    }
  } catch (e) {
    alert("Invalid JSON format.");
  }
};

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-xl w-full p-6 relative">
        <h2 className="text-xl font-semibold mb-3">Import Form</h2>
        <p className="text-sm text-gray-500 mb-3">Paste your form JSON below to import it.</p>
        <textarea
          rows={10}
          className="w-full border rounded p-3 text-sm font-mono"
          value={jsonData}
          onChange={(e) => setJsonData(e.target.value)}
          placeholder='{"fields": [...]}'
        />
        <div className="flex justify-end mt-4 space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleImportClick}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            Import
          </button>
        </div>
      </div>
    </div>
  );
}

