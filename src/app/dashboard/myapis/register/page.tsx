"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterApiPage() {
  const [name, setName] = useState("");
  const [openApiUrl, setOpenApiUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [endpoints, setEndpoints] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/myapis/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, openApiUrl, apiKey, endpoints }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      router.push("/dashboard"); // or wherever you show the APIs
    } else {
      alert(data.error || "Failed to register API");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-6 space-y-6 bg-white rounded-lg shadow-lg"
    >
      <h1 className="text-3xl font-semibold text-center text-gray-800">
        Register New API
      </h1>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            API Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Enter your API name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="openApiUrl"
            className="block text-sm font-medium text-gray-700"
          >
            OpenAPI Spec URL
          </label>
          <input
            id="openApiUrl"
            type="url"
            placeholder="https://your.api/spec"
            value={openApiUrl}
            onChange={(e) => setOpenApiUrl(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="apiKey"
            className="block text-sm font-medium text-gray-700"
          >
            API Key (optional)
          </label>
          <input
            id="apiKey"
            type="text"
            placeholder="Enter API Key (if any)"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label
            htmlFor="endpoints"
            className="block text-sm font-medium text-gray-700"
          >
            Endpoints to Track
          </label>
          <textarea
            id="endpoints"
            placeholder="Comma-separated list like /v1/charges, /users"
            value={endpoints}
            onChange={(e) => setEndpoints(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Registering..." : "Register API"}
      </button>
    </form>
  );
}
