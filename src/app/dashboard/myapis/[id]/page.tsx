// src/app/dashboard/myapis/[id]/page.tsx

import { ApiChangeLog } from "@/components/ApiChangeLog";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import React from "react";
import Link from "next/link";

// Explicit type for MyApiPageProps
interface MyApiPageProps {
  params: {
    id: string;
  };
}

export default async function MyApiPage({ params }: MyApiPageProps) {
  // Ensure params.id is awaited before using it
  const { id } = await params;

  const api = await prisma.api.findUnique({
    where: {
      id: id, // Now you can safely use the awaited `params.id`
    },
    include: {
      versions: {
        orderBy: { createdAt: "desc" },
        include: {
          ApiDiff: {
            orderBy: { createdAt: "desc" },
          },
        },
      },
    },
  });

  // If no API is found, show the "not found" page
  if (!api) return notFound();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">{api.name}</h1>
      <p className="text-gray-600 mb-4">
        Monitored URL: <span className="text-blue-600">{api.openApiUrl}</span>
      </p>
      <p className="text-sm text-gray-500 mb-8">
        Created at: {new Date(api.createdAt).toLocaleString()}
      </p>

      <h2 className="text-xl font-semibold mb-2">API Versions</h2>
      {api.versions.length === 0 ? (
        <p className="text-gray-500">No versions found.</p>
      ) : (
        <div className="space-y-4">
          {api.versions.map((version) => (
            <div
              key={version.id}
              className="border p-4 rounded-lg bg-white shadow-sm"
            >
              <p className="font-medium text-gray-800">
                Version ID:{" "}
                <span className="text-sm text-gray-600">{version.id}</span>
              </p>
              <p className="text-sm text-gray-500">
                Created at: {new Date(version.createdAt).toLocaleString()}
              </p>
              <p className="mt-2 text-gray-700">
                Summary:{" "}
                <span className="text-sm">
                  {version.diffSummary || "No summary available"}
                </span>
              </p>

              {version.ApiDiff.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">
                    Diffs:
                  </h3>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    {/* {version.ApiDiff.map((diff) => (
                      <li key={diff.id}>
                        <Link
                          href={`/diff/${diff.id}`}
                          className="text-blue-500 underline"
                        >
                          View Diff ({new Date(diff.createdAt).toLocaleString()}
                          )
                        </Link>
                      </li>
                    ))} */}
                    {version.ApiDiff.map((diff) => (
                      <div key={diff.id} className="mb-2">
                        <p className="text-xs text-gray-500 mb-1">
                          {new Date(diff.createdAt).toLocaleString()}
                        </p>
                        <ApiChangeLog changes={JSON.parse(diff.diffJson)} />
                      </div>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
