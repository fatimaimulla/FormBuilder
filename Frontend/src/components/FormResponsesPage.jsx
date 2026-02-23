import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../lib/apiClient";

function formatDateTime(value) {
  if (!value) return "-";
  return new Date(value).toLocaleString();
}

function isEmailField(field) {
  const label = String(field?.label || "").trim().toLowerCase();
  return label === "email" || label === "e-mail";
}

function normalizeAnswerValue(rawValue) {
  if (Array.isArray(rawValue)) return rawValue.join(", ");
  if (rawValue === null || rawValue === undefined || rawValue === "") return "-";
  if (typeof rawValue === "object") return JSON.stringify(rawValue);
  return String(rawValue);
}

export default function FormResponsesPage() {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState("");
  const [detailError, setDetailError] = useState("");
  const [search, setSearch] = useState("");
  const [draftSearch, setDraftSearch] = useState("");
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [selectedResponseId, setSelectedResponseId] = useState("");
  const [detailLoading, setDetailLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [fieldMeta, setFieldMeta] = useState([]);
  const [showAllResponsesTable, setShowAllResponsesTable] = useState(false);
  const [allTableLoading, setAllTableLoading] = useState(false);
  const [allTableError, setAllTableError] = useState("");
  const [allTableRows, setAllTableRows] = useState([]);
  const [responseDetailCache, setResponseDetailCache] = useState({});

  const visibleFieldMeta = useMemo(
    () => fieldMeta.filter((field) => !isEmailField(field)),
    [fieldMeta]
  );

  useEffect(() => {
    setResponseDetailCache({});
    setSelectedResponse(null);
    setSelectedResponseId("");
    setDetailError("");
    setShowAllResponsesTable(false);
    setAllTableRows([]);
    setAllTableError("");
  }, [formId]);

  useEffect(() => {
    const loadFormMeta = async () => {
      if (!formId) return;
      try {
        const res = await apiClient.get(`/forms/${formId}/mine`);
        const config = res?.data?.data?.form?.config || [];
        const normalized = Array.isArray(config)
          ? config
              .filter((field) => field && field.type !== "section")
              .map((field) => ({
                id: String(field.id),
                label: field.label || String(field.id),
              }))
          : [];
        setFieldMeta(normalized);
      } catch {
        setFieldMeta([]);
      }
    };

    loadFormMeta();
  }, [formId]);

  useEffect(() => {
    const loadResponses = async () => {
      if (!formId) return;
      setLoading(true);
      setListError("");
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
        setTotal(pagination.total || 0);
        setTotalPages(pagination.totalPages || 1);
        if (responseItems.length === 0) {
          setSelectedResponse(null);
          setSelectedResponseId("");
        }
      } catch {
        setListError("Failed to load responses.");
      } finally {
        setLoading(false);
      }
    };

    loadResponses();
  }, [formId, page, search]);

  const loadResponseDetail = async (responseId) => {
    if (!formId || !responseId) return;
    const cached = responseDetailCache[responseId];
    if (cached) {
      setSelectedResponseId(responseId);
      setSelectedResponse(cached);
      setDetailError("");
      return;
    }

    setDetailLoading(true);
    setDetailError("");
    setSelectedResponseId(responseId);
    try {
      const res = await apiClient.get(`/forms/${formId}/responses/${responseId}`);
      const response = res?.data?.data?.response || null;
      setSelectedResponse(response);
      if (response) {
        setResponseDetailCache((prev) => ({ ...prev, [responseId]: response }));
      }
    } catch {
      setDetailError("Failed to load response detail.");
    } finally {
      setDetailLoading(false);
    }
  };

  useEffect(() => {
    if (!formId || items.length === 0) return;
    let cancelled = false;

    const missingIds = items
      .map((item) => item.id)
      .filter((id) => !responseDetailCache[id]);

    if (missingIds.length === 0) return;

    Promise.allSettled(
      missingIds.map(async (id) => {
        const res = await apiClient.get(`/forms/${formId}/responses/${id}`);
        return { id, response: res?.data?.data?.response || null };
      })
    ).then((results) => {
      if (cancelled) return;
      const merged = {};
      results.forEach((result) => {
        if (result.status === "fulfilled" && result.value.response) {
          merged[result.value.id] = result.value.response;
        }
      });
      if (Object.keys(merged).length > 0) {
        setResponseDetailCache((prev) => ({ ...prev, ...merged }));
      }
    });

    return () => {
      cancelled = true;
    };
  }, [formId, items, responseDetailCache]);

  const detailRows = useMemo(() => {
    if (!selectedResponse) return [];

    const answers = selectedResponse.answers || {};
    const rows = [];

    visibleFieldMeta.forEach((field) => {
      const value = normalizeAnswerValue(answers[field.id]);
      rows.push({
        label: field.label,
        value,
      });
    });

    return rows;
  }, [selectedResponse, visibleFieldMeta]);

  const loadAllResponsesTable = async () => {
    if (!formId) return;
    setAllTableLoading(true);
    setAllTableError("");
    try {
      let currentPage = 1;
      let localTotalPages = 1;
      const allItems = [];

      while (currentPage <= localTotalPages) {
        const query = new URLSearchParams({
          page: String(currentPage),
          limit: "100",
          search: "",
        });
        const res = await apiClient.get(`/forms/${formId}/responses?${query.toString()}`);
        const itemsOnPage = res?.data?.data?.items || [];
        const pagination = res?.data?.data?.pagination || {};
        localTotalPages = pagination.totalPages || 1;
        allItems.push(...itemsOnPage);
        currentPage += 1;
      }

      const detailResponses = await Promise.all(
        allItems.map(async (item) => {
          if (responseDetailCache[item.id]) {
            return responseDetailCache[item.id];
          }
          const res = await apiClient.get(`/forms/${formId}/responses/${item.id}`);
          return res?.data?.data?.response || null;
        })
      );

      const cacheUpdates = {};
      detailResponses.forEach((response) => {
        if (response?.id) {
          cacheUpdates[response.id] = response;
        }
      });
      if (Object.keys(cacheUpdates).length > 0) {
        setResponseDetailCache((prev) => ({ ...prev, ...cacheUpdates }));
      }

      const normalizedRows = detailResponses
        .filter(Boolean)
        .map((response) => {
          const answers = response.answers || {};
          const mappedAnswers = {};

          visibleFieldMeta.forEach((field) => {
            mappedAnswers[field.id] = normalizeAnswerValue(answers[field.id]);
          });

          return {
            id: response.id,
            submitterDetail: `${response.submittedBy?.name || "Unknown"} (${response.submittedBy?.email || "-"})`,
            answers: mappedAnswers,
          };
        });

      setAllTableRows(normalizedRows);
      setShowAllResponsesTable(true);
    } catch {
      setAllTableError("Failed to load full response table.");
    } finally {
      setAllTableLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Form Responses</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={loadAllResponsesTable}
              disabled={allTableLoading || loading || total === 0}
              className="px-4 py-2 rounded bg-black text-white text-sm hover:bg-gray-700 disabled:opacity-50"
            >
              {allTableLoading ? "Loading..." : "View All Responses Table"}
            </button>
            <button
              onClick={() => navigate("/dashboard/forms")}
              className="px-4 py-2 rounded border text-sm hover:bg-gray-100"
            >
              Back to My Forms
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr,0.9fr] gap-4">
          <div className="bg-white border rounded-lg p-4 space-y-4">
            <form
              className="flex gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                setPage(1);
                setSearch(draftSearch.trim());
              }}
            >
              <input
                value={draftSearch}
                onChange={(e) => setDraftSearch(e.target.value)}
                placeholder="Search by submitter name or email"
                className="w-full border px-3 py-2 rounded text-sm"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded border text-sm hover:bg-gray-100"
              >
                Search
              </button>
            </form>

            <div className="flex items-center justify-between text-xs text-gray-600">
              <p>{total} total responses</p>
              {search && (
                <button
                  onClick={() => {
                    setDraftSearch("");
                    setSearch("");
                    setPage(1);
                  }}
                  className="underline"
                >
                  Clear search
                </button>
              )}
            </div>

            {loading && <p className="text-sm text-gray-600">Loading responses...</p>}
            {listError && <p className="text-sm text-red-600">{listError}</p>}

            {!loading && !listError && items.length === 0 && (
              <p className="text-sm text-gray-600">No responses found.</p>
            )}

            <div className="space-y-2">
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => loadResponseDetail(item.id)}
                  className={`w-full text-left border rounded p-3 hover:bg-gray-50 ${
                    selectedResponseId === item.id ? "border-black bg-gray-50" : ""
                  }`}
                >
                  <p className="text-sm font-medium text-gray-900">
                    {item.submittedBy?.name || "Unknown"}
                  </p>
                  <p className="text-xs text-gray-600">{item.submittedBy?.email}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDateTime(item.submittedAt)}
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
            {!detailLoading && detailError && (
              <p className="text-sm text-red-600">{detailError}</p>
            )}
            {!detailLoading && !selectedResponse && (
              <p className="text-sm text-gray-600">Select a response to view details.</p>
            )}

            {!detailLoading && selectedResponse && (
              <div className="space-y-3">
                <p className="text-xs text-gray-600">
                  <span className="font-medium">Submitter:</span>{" "}
                  {selectedResponse.submittedBy?.name} ({selectedResponse.submittedBy?.email})
                </p>
                <p className="text-xs text-gray-600">
                  <span className="font-medium">Submitted:</span>{" "}
                  {formatDateTime(selectedResponse.submittedAt)}
                </p>

                <div className="overflow-hidden border rounded">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left px-3 py-2 font-medium text-gray-700">Field</th>
                        <th className="text-left px-3 py-2 font-medium text-gray-700">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detailRows.map((row) => (
                        <tr key={row.label} className="border-b last:border-b-0">
                          <td className="px-3 py-2 text-gray-900">{row.label}</td>
                          <td className="px-3 py-2 text-gray-700">{String(row.value)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {allTableError && (
          <div className="mt-4 text-sm text-red-600">{allTableError}</div>
        )}

        {showAllResponsesTable && (
          <div className="mt-6 bg-white border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900">All Responses (Tabular)</h3>
              <button
                onClick={() => setShowAllResponsesTable(false)}
                className="text-sm text-gray-600 hover:underline"
              >
                Hide
              </button>
            </div>

            {allTableRows.length === 0 ? (
              <p className="text-sm text-gray-600">No responses available for tabular view.</p>
            ) : (
              <div className="overflow-auto border rounded">
                <table className="w-full text-sm min-w-[760px]">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left px-3 py-2 font-medium text-gray-700">Submitter Detail</th>
                      {visibleFieldMeta.map((field) => (
                        <th key={field.id} className="text-left px-3 py-2 font-medium text-gray-700">
                          {field.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {allTableRows.map((row) => (
                      <tr key={row.id} className="border-b last:border-b-0">
                        <td className="px-3 py-2 text-gray-900">{row.submitterDetail}</td>
                        {visibleFieldMeta.map((field) => (
                          <td key={`${row.id}-${field.id}`} className="px-3 py-2 text-gray-700">
                            {row.answers[field.id] || "-"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
