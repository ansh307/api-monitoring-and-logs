export function generateDiffSummary(diff: any[]): string {
  let added = 0,
    removed = 0,
    changed = 0;

  for (const item of diff) {
    if (item.type.includes("added")) added++;
    else if (item.type.includes("removed")) removed++;
    else if (item.type.includes("changed")) changed++;
  }

  const parts = [];
  if (added) parts.push(`➕ ${added} added`);
  if (removed) parts.push(`❌ ${removed} removed`);
  if (changed) parts.push(`🔁 ${changed} changed`);

  return parts.length > 0 ? parts.join(", ") : "No significant changes";
}
