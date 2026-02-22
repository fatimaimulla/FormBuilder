import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../lib/apiClient";

export default function FormResponsesPage() {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const loadResponses = async () => {
      if (!formId) return;
      setLoading(true);
      setError("");
      try {
        const query = new URLSearchParams({
          page: String(page),
          limit: "20",
          search,
        });
        const res = await apiClient.get(`/forms/${formId}/responses?${query.toString()}`);
        const responseItems = res?.data?.data?.items || [];
        const pagination = res?.data?.data?.pagination || {};
        setItems(responseItems);
        setTotalPages(pagination.totalPages || 1);
      } catch {
        setError("Failed to load responses.");
      } finally {
        setLoading(false);
      }
    };

    loadResponses();
  }, [formId, page, search]);

  const loadResponseDetail = async (responseId) => {
    if (!formId || !responseId) return;
    setDetailLoading(true);
    try {
      const res = await apiClient.get(`/forms/${formId}/responses/${responseId}`);
      setSelectedResponse(res?.data?.data?.response || null);
    } catch {
      setError("Failed to load response detail.");
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Form Responses</h1>
          <button
            onClick={() => navigate("/dashboard/forms")}
            className="px-4 py-2 rounded border text-sm hover:bg-gray-100"
          >
            Back to My Forms
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr,0.9fr] gap-4">
          <div className="bg-white border rounded-lg p-4 space-y-4">
            <div className="flex gap-3">
              <input
                value={search}
                onChange={(e) => {
                  setPage(1);
                  setSearch(e.target.value);
                }}
                placeholder="Search by submitter name or email"
                className="w-full border px-3 py-2 rounded text-sm"
              />
            </div>

            {loading && <p className="text-sm text-gray-600">Loading responses...</p>}
            {error && <p className="text-sm text-red-600">{error}</p>}

            {!loading && !error && items.length === 0 && (
              <p className="text-sm text-gray-600">No responses found.</p>
            )}

            <div className="space-y-2">
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => loadResponseDetail(item.id)}
                  className="w-full text-left border rounded p-3 hover:bg-gray-50"
                >
                  <p className="text-sm font-medium text-gray-900">
                    {item.submittedBy?.name || "Unknown"}
                  </p>
                  <p className="text-xs text-gray-600">{item.submittedBy?.email}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(item.submittedAt).toLocaleString()}
                  </p>
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded border text-sm disabled:opacity-50"
              >
                Previous
              </button>
              <p className="text-xs text-gray-600">
                Page {page} of {totalPages}
              </p>
              <button
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={page >= totalPages}
                className="px-3 py-1.5 rounded border text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>

          <div className="bg-white border rounded-lg p-4">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Response Detail</h2>
            {detailLoading && <p className="text-sm text-gray-600">Loading detail...</p>}
            {!detailLoading && !selectedResponse && (
              <p className="text-sm text-gray-600">Select a response to view details.</p>
            )}
            {!detailLoading && selectedResponse && (
              <div className="space-y-2">
                <p className="text-xs text-gray-600">
                  <span className="font-medium">Submitter:</span>{" "}
                  {selectedResponse.submittedBy?.name} ({selectedResponse.submittedBy?.email})
                </p>
                <p className="text-xs text-gray-600">
                  <span className="font-medium">Submitted:</span>{" "}
                  {new Date(selectedResponse.submittedAt).toLocaleString()}
                </p>
                <pre className="mt-2 bg-gray-50 border rounded p-3 text-xs overflow-auto max-h-[420px]">
                  {JSON.stringify(selectedResponse.answers, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
