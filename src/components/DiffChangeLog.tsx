import React from "react";

type Change = {
  type: string;
  path?: string;
  method?: string;
  message: string;
};

type Props = {
  changes: Change[];
};

const iconMap: Record<string, { icon: string; color: string }> = {
  added: { icon: "➕", color: "text-green-500" },
  removed: { icon: "❌", color: "text-red-500" },
  changed: { icon: "🔁", color: "text-yellow-500" },
};

export default function DiffChangeLog({ changes }: Props) {
  // Group changes by path + method
  const grouped = changes.reduce((acc, change) => {
    const key = `${change.path || "unknown"}-${change.method || "unknown"}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(change);
    return acc;
  }, {} as Record<string, Change[]>);

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([groupKey, groupChanges]) => {
        const [path, method] = groupKey.split("-");
        return (
          <div key={groupKey}>
            <h3 className="text-lg font-semibold text-blue-600">
              🔹 {path} - {method?.toUpperCase()}
            </h3>
            <ul className="ml-4 mt-2 space-y-1">
              {groupChanges.map((change, idx) => {
                const base = change.type.split("-")[0]; // added/removed/changed
                const { icon, color } = iconMap[base] || {
                  icon: "❓",
                  color: "text-gray-400",
                };
                return (
                  <li key={idx} className={`flex items-start gap-2 ${color}`}>
                    <span className="text-xl">{icon}</span>
                    <span className="text-sm">{change.message}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
