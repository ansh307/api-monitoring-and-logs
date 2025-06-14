// lib/api-monitor-utils.ts
import { exec } from "child_process";
import { writeFile } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";

export async function fetchOpenApiSpec(url: string): Promise<any | null> {
  try {
    console.log("Fetching OpenAPI spec from:", url);
    const response = await fetch(url);
    if (!response.ok) {
      console.error("Non-OK response:", response.status, response.statusText);
      throw new Error("Failed to fetch OpenAPI spec");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching OpenAPI spec:", error);
    return null;
  }
}

export async function runOASDiff(oldSpec: any, newSpec: any): Promise<any> {
  // Write to temp files
  const oldPath = join(tmpdir(), `old-${Date.now()}.json`);
  const newPath = join(tmpdir(), `new-${Date.now()}.json`);
  await writeFile(oldPath, JSON.stringify(oldSpec));
  await writeFile(newPath, JSON.stringify(newSpec));

  return new Promise((resolve, reject) => {
    exec(
      `oasdiff --format json ${oldPath} ${newPath}`,
      (err, stdout, stderr) => {
        if (err) {
          console.error("OASDiff Error:", stderr);
          return reject(err);
        }

        try {
          const diff = JSON.parse(stdout);
          resolve(diff);
        } catch (e) {
          reject(e);
        }
      }
    );
  });
}

function deepDiff(oldObj: any, newObj: any, path: string[] = []): any[] {
  const changes: any[] = [];

  const allKeys = new Set([
    ...Object.keys(oldObj || {}),
    ...Object.keys(newObj || {}),
  ]);

  for (const key of allKeys) {
    const oldVal = oldObj?.[key];
    const newVal = newObj?.[key];
    const fullPath = [...path, key].join(".");

    if (oldVal === undefined) {
      changes.push({
        type: "added-field",
        field: fullPath,
        message: `Field "${fullPath}" was added.`,
      });
    } else if (newVal === undefined) {
      changes.push({
        type: "removed-field",
        field: fullPath,
        message: `Field "${fullPath}" was removed.`,
      });
    } else if (typeof oldVal === "object" && typeof newVal === "object") {
      changes.push(...deepDiff(oldVal, newVal, [...path, key]));
    } else if (oldVal !== newVal) {
      changes.push({
        type: "changed-field",
        field: fullPath,
        message: `Field "${fullPath}" changed from "${oldVal}" to "${newVal}".`,
      });
    }
  }

  return changes;
}

export function diffSpecs(oldSpec: any, newSpec: any): any[] {
  const changes: any[] = [];

  const oldPaths = oldSpec.paths || {};
  const newPaths = newSpec.paths || {};

  const oldPathKeys = Object.keys(oldPaths);
  const newPathKeys = Object.keys(newPaths);

  // 1. Path and method additions/removals
  for (const path of newPathKeys) {
    if (!oldPaths[path]) {
      changes.push({
        type: "added-path",
        path,
        message: `New path "${path}" added.`,
      });
      continue;
    }

    const oldMethods = Object.keys(oldPaths[path]);
    const newMethods = Object.keys(newPaths[path]);

    for (const method of newMethods) {
      if (!oldMethods.includes(method)) {
        changes.push({
          type: "added-method",
          path,
          method,
          message: `New method "${method}" added to "${path}".`,
        });
      }
    }
  }

  for (const path of oldPathKeys) {
    if (!newPaths[path]) {
      changes.push({
        type: "removed-path",
        path,
        message: `Path "${path}" was removed.`,
      });
      continue;
    }

    const oldMethods = Object.keys(oldPaths[path]);
    const newMethods = Object.keys(newPaths[path]);

    for (const method of oldMethods) {
      if (!newMethods.includes(method)) {
        changes.push({
          type: "removed-method",
          path,
          method,
          message: `Method "${method}" was removed from "${path}".`,
        });
      }
    }
  }

  // 2. Parameter changes
  for (const path of Object.keys(newPaths)) {
    for (const method of Object.keys(newPaths[path])) {
      const oldOp = oldPaths?.[path]?.[method];
      const newOp = newPaths?.[path]?.[method];

      if (oldOp && newOp) {
        const oldParams = oldOp.parameters || [];
        const newParams = newOp.parameters || [];

        const oldParamNames = oldParams.map((p: any) => p.name);
        const newParamNames = newParams.map((p: any) => p.name);

        for (const param of newParamNames) {
          if (!oldParamNames.includes(param)) {
            changes.push({
              type: "added-param",
              path,
              method,
              param,
              message: `Parameter "${param}" was added to ${method.toUpperCase()} ${path}.`,
            });
          }
        }

        for (const param of oldParamNames) {
          if (!newParamNames.includes(param)) {
            changes.push({
              type: "removed-param",
              path,
              method,
              param,
              message: `Parameter "${param}" was removed from ${method.toUpperCase()} ${path}.`,
            });
          }
        }
      }
    }
  }

  // 3. Response schema comparison
  for (const path of Object.keys(newPaths)) {
    for (const method of Object.keys(newPaths[path])) {
      const oldOp = oldPaths?.[path]?.[method];
      const newOp = newPaths?.[path]?.[method];

      if (oldOp && newOp) {
        const oldResponses = oldOp.responses || {};
        const newResponses = newOp.responses || {};

        const oldStatusCodes = Object.keys(oldResponses);
        const newStatusCodes = Object.keys(newResponses);

        // Added/removed status codes
        for (const status of newStatusCodes) {
          if (!oldResponses[status]) {
            changes.push({
              type: "added-response",
              path,
              method,
              status,
              message: `Response "${status}" added to ${method.toUpperCase()} ${path}.`,
            });
          }
        }

        for (const status of oldStatusCodes) {
          if (!newResponses[status]) {
            changes.push({
              type: "removed-response",
              path,
              method,
              status,
              message: `Response "${status}" removed from ${method.toUpperCase()} ${path}.`,
            });
          }
        }

        // Deep diff response schemas
        for (const status of newStatusCodes) {
          if (oldResponses[status] && newResponses[status]) {
            const oldSchema =
              oldResponses[status].content?.["application/json"]?.schema || {};
            const newSchema =
              newResponses[status].content?.["application/json"]?.schema || {};

            const diffs = deepDiff(oldSchema, newSchema, [
              `paths.${path}.${method}.responses.${status}.schema`,
            ]);
            changes.push(...diffs);
          }
        }
      }
    }
  }

  return changes;
}
