import { MonitorAllButton } from "@/components/MonitorAllButton";
import { MonitorButton } from "@/components/MonitorButton";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) return redirect("/signin");

  const apis = await prisma.api.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">📡 Your APIs</h1>
        <div className="flex gap-2">
          <MonitorAllButton />
          <Link
            href="/dashboard/myapis/register"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            ➕ Register New API
          </Link>
        </div>
      </div>

      {apis.length === 0 ? (
        <p className="text-gray-600">You haven’t registered any APIs yet.</p>
      ) : (
        <ul className="space-y-4">
          {apis.map((api) => (
            <li
              key={api.id}
              className="border rounded p-4 shadow hover:bg-gray-50 transition"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold">{api.name}</h2>
                  <p className="text-sm text-gray-500">{api.openApiUrl}</p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/dashboard/myapis/${api.id}`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View
                  </Link>
                  {/* <form
                    onSubmit={async (e) => {
                      e.preventDefault();

                      const response = await fetch("/api/monitor", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json", // Set content type to JSON
                        },
                        body: JSON.stringify({
                          apiId: api.id, // Send apiId as JSON
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
                  </form> */}
                  <MonitorButton apiId={api.id} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
