"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterApiPage() {
  const [name, setName] = useState("");
  const [openApiUrl, setOpenApiUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/myapis/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, openApiUrl }),
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
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      <h1 className="text-xl font-semibold">Register New API</h1>

      <input
        type="text"
        placeholder="API Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border p-2 rounded"
        required
      />

      <input
        type="url"
        placeholder="OpenAPI Spec URL"
        value={openApiUrl}
        onChange={(e) => setOpenApiUrl(e.target.value)}
        className="w-full border p-2 rounded"
        required
      />

      <button
        type="submit"
        className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Registering..." : "Register API"}
      </button>
    </form>
  );
}
