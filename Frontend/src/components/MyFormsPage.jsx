import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../lib/apiClient";

export default function MyFormsPage() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadForms = async () => {
      try {
        const res = await apiClient.get("/forms/mine?limit=50&sortBy=updatedAt&order=desc");
        const items = res?.data?.data?.items || [];
        setForms(items);
      } catch (err) {
        setError("Failed to load your forms.");
      } finally {
        setLoading(false);
      }
    };

    loadForms();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">My Forms</h1>
          <button
            onClick={() => navigate("/build-forms")}
            className="px-4 py-2 rounded bg-black text-white text-sm hover:bg-gray-700"
          >
            Create New Form
          </button>
        </div>

        {loading && <p className="text-sm text-gray-600">Loading forms...</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}

        {!loading && !error && forms.length === 0 && (
          <div className="bg-white border rounded p-6 text-sm text-gray-600">
            No forms created yet.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {forms.map((form) => (
            <div key={form.id} className="bg-white border rounded-lg p-5 space-y-4">
              <div>
                <p className="text-sm text-gray-500">Form ID</p>
                <p className="text-sm font-medium text-gray-900 break-all">{form.id}</p>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <span className="px-2 py-1 rounded bg-gray-100 text-gray-700 uppercase">
                  {form.status}
                </span>
                <span className="text-gray-600">{form.fieldCount} fields</span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => navigate(`/build-forms?form=${form.id}`)}
                  className="px-3 py-2 rounded border text-sm hover:bg-gray-100"
                >
                  Edit
                </button>
                <button
                  onClick={() => navigate(`/dashboard/forms/${form.id}/responses`)}
                  className="px-3 py-2 rounded bg-black text-white text-sm hover:bg-gray-700"
                >
                  Responses
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
