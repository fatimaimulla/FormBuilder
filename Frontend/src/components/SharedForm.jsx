import { useEffect, useState } from "react";
import PreviewRenderer from "../functions/previewRender";
import { CircleAlert } from 'lucide-react';
import { useAuth } from "../auth/AuthContext";
import apiClient from "../lib/apiClient";
import GoogleSignInButton from "./auth/GoogleSignInButton";

export default function SharedForm() {
  const { isAuthenticated, user, setSession, logout } = useAuth();
  const [elements, setElements] = useState([]);
  const [formId, setFormId] = useState(null);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const requestedFormId = query.get("form");

    if (!requestedFormId) {
      setError("No form ID found in the URL.");
      return;
    }
    setFormId(requestedFormId);

    const fetchForm = async () => {
      try {
        const res = await apiClient.get(`/forms/${requestedFormId}`);
        const formConfig = res?.data?.form || res?.data?.data?.form;
        setElements(Array.isArray(formConfig) ? formConfig : []);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formId) {
      setSubmitError("Form ID is missing.");
      return;
    }

    if (!isAuthenticated) {
      setSubmitError("Please sign in with Google before submitting.");
      return;
    }

    setSubmitting(true);
    setSubmitError("");
    setSubmitSuccess("");
    try {
      await apiClient.post(`/forms/${formId}/responses`, {
        answers: formData,
      });
      setSubmitSuccess("Form submitted successfully.");
      setFormData({});
    } catch (err) {
      const message =
        err?.response?.data?.message || "Failed to submit form. Please try again.";
      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetConfirmed = () => {
    setFormData({});
    setShowResetConfirm(false);
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
        {!isAuthenticated ? (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Login Required</h2>
            <p className="text-sm text-gray-600">
              Please sign in with Google before filling and submitting this form.
            </p>
            <div className="flex justify-center">
              <GoogleSignInButton
                onCredential={async (idToken) => {
                  setAuthLoading(true);
                  setAuthError("");
                  try {
                    const result = await apiClient.post("/auth/google", { idToken });
                    const accessToken = result?.data?.data?.accessToken;
                    const submitter = result?.data?.data?.user;
                    if (!accessToken || !submitter) {
                      throw new Error("Invalid login response");
                    }
                    setSession({ accessToken, user: submitter });
                  } catch {
                    setAuthError("Google sign-in failed. Please try again.");
                  } finally {
                    setAuthLoading(false);
                  }
                }}
                onError={(message) => setAuthError(message)}
                width={320}
              />
            </div>
            {authLoading && <p className="text-sm text-center text-gray-600">Signing you in...</p>}
            {authError && <p className="text-sm text-center text-red-600">{authError}</p>}
          </div>
        ) : (
        <>
        <div className="flex items-center justify-between mb-4 border-b pb-3">
          <div>
            <p className="text-xs text-gray-500">Submitting as</p>
            <p className="text-sm font-medium text-gray-900">{user?.name || user?.email}</p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="text-sm text-gray-600 hover:underline"
          >
            Switch account
          </button>
        </div>
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
              type="button"
              className="flex-1 bg-white text-black py-2 rounded border border-gray-300 hover:bg-gray-100"
              onClick={() => setShowResetConfirm(true)}
            >
              Reset
            </button>
            <button
              type="submit"
              className={`flex-1 py-2 rounded text-white ${
                submitting ? "bg-gray-500 cursor-not-allowed" : "bg-black hover:bg-gray-700"
              }`}
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
        {submitSuccess && (
          <p className="text-sm text-green-600 mt-4">{submitSuccess}</p>
        )}
        {submitError && (
          <p className="text-sm text-red-600 mt-4">{submitError}</p>
        )}
        </>
        )}
      </div>

      {showResetConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-[90%] max-w-sm space-y-5 text-center">
            <div className="flex gap-2">
              <CircleAlert/>
              <p className="text-black">Are you sure you want to reset all entered data?</p>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-black px-6 py-2 rounded"
                onClick={() => setShowResetConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="bg-black hover:bg-gray-800 text-white px-7 py-2 rounded"
                onClick={handleResetConfirmed}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
