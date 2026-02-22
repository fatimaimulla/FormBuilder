import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { ClipboardCopy, ExternalLink, Check } from "lucide-react";
import apiClient from "../lib/apiClient";

export default function PublishModal({ onClose, elements, formId }) {
  const [tab, setTab] = useState("link");
  const [copied, setCopied] = useState(false);
  const [formLink, setFormLink] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const publishForm = async () => {
      try {
        let idToUse = formId;
        if (idToUse) {
          await apiClient.put(`/forms/${idToUse}`, elements);
        } else {
          const createRes = await apiClient.post("/forms", elements);
          idToUse = createRes?.data?.id || createRes?.data?.data?.id;
        }

        if (!idToUse) {
          throw new Error("No form id returned from backend");
        }

        await apiClient.post(`/forms/${idToUse}/publish`);
        const link = `${window.location.origin}/shared?form=${idToUse}`;
        setFormLink(link);
      } catch (err) {
        console.error("Error publishing form:", err);
        setError("Failed to publish form. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    publishForm();
  }, [elements]);

  const handleCopy = () => {
    navigator.clipboard.writeText(formLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleOpen = () => {
    window.open(formLink, "_blank");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 space-y-6 relative">
        <h2 className="text-xl font-semibold">Publish Your Form</h2>
        <p className="text-sm text-gray-500">
          Make your form available to collect responses from users.
        </p>

        {/* Tabs */}
        <div className="flex border rounded overflow-hidden w-full">
          <button
            onClick={() => setTab("link")}
            className={`w-1/2 py-2 text-sm font-medium ${
              tab === "link"
                ? "bg-black text-white"
                : "bg-white text-gray-700"
            }`}
          >
            Share Link
          </button>
          <button
            onClick={() => setTab("qr")}
            className={`w-1/2 py-2 text-sm font-medium ${
              tab === "qr"
                ? "bg-black text-white"
                : "bg-white text-gray-700"
            }`}
          >
            QR Code
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center text-gray-500 text-sm">Publishing form...</div>
        ) : error ? (
          <div className="text-center text-red-600 text-sm">{error}</div>
        ) : tab === "link" ? (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Form URL
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={formLink}
                readOnly
                className="flex-1 border px-3 py-2 rounded text-sm bg-gray-100"
              />
              <button
                onClick={handleCopy}
                className="p-2 border rounded hover:bg-gray-200"
                title="Copy link"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-black" />
                ) : (
                  <ClipboardCopy className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={handleOpen}
                className="p-2 border rounded hover:bg-gray-200"
                title="Open link"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-gray-500">
              Share this link with anyone you want to collect responses from.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-3 pt-2">
            <QRCode value={formLink} size={160} />
            <p className="text-sm text-gray-500">
              Scan this QR code to access the form on mobile devices.
            </p>
          </div>
        )}

        <div className="flex justify-end pt-4">
          <button
            onClick={onClose}
            className="text-sm text-gray-600 hover:underline"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
