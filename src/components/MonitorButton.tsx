"use client";

export const MonitorButton = ({ apiId }: { apiId: string }) => {
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();

        const response = await fetch("/api/monitor", {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Set content type to JSON
          },
          body: JSON.stringify({
            apiId, // Send apiId as JSON
          }),
        });

        const result = await response.json();
        if (result.error) {
          alert(result.error);
        } else {
          alert(result.message || "API monitoring started!");
        }
      }}
    >
      <button
        type="submit"
        className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
      >
        Monitor
      </button>
    </form>
  );
};
