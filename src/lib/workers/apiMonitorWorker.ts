// lib/workers/monitor-worker.ts
import { Worker } from "bullmq";
import { prisma } from "../prisma";
import { fetchOpenApiSpec, diffSpecs } from "../api-monitor-utils";
import { generateDiffSummary } from "../diff-summary";
import { redis } from "../redis";

export const monitorWorker = new Worker(
  "api-monitor",
  async () => {
    console.log("🔄 Running scheduled API monitor job...");

    const apis = await prisma.api.findMany();

    for (const api of apis) {
      try {
        const latestSpec = await fetchOpenApiSpec(
          api.openApiUrl,
          api.apiKey || undefined
        );
        if (!latestSpec) {
          console.warn(
            `⚠️ Skipping ${api?.name || "No API Name"} — could not fetch spec`
          );
          continue;
        }

        // ✅ Filter paths based on endpoints user has provided
        if (api.endpoints.length > 0 && latestSpec.paths) {
          const filteredPaths: Record<string, any> = {};
          const missing: string[] = [];

          for (const path of api.endpoints) {
            if (latestSpec.paths[path]) {
              filteredPaths[path] = latestSpec.paths[path];
            } else {
              missing.push(path);
            }
          }

          latestSpec.paths = filteredPaths;

          if (missing.length > 0) {
            console.warn(
              `⚠️ Some endpoints not found in ${api.name}:`,
              missing
            );
          }
        }

        const newRaw = JSON.stringify(latestSpec);

        const previousVersion = await prisma.apiVersion.findFirst({
          where: { apiId: api.id },
          orderBy: { createdAt: "desc" },
        });

        // const newRaw = JSON.stringify(latestSpec);
        if (previousVersion?.rawJson === newRaw) continue;

        const newVersion = await prisma.apiVersion.create({
          data: {
            apiId: api.id,
            rawJson: newRaw,
            diffSummary: "",
          },
        });

        if (previousVersion) {
          const diffResult = await diffSpecs(
            JSON.parse(previousVersion.rawJson),
            latestSpec
          );
          const summary = generateDiffSummary(diffResult);

          await prisma.apiDiff.create({
            data: {
              apiId: api.id,
              versionId: newVersion.id,
              diffJson: JSON.stringify(diffResult),
            },
          });

          await prisma.apiVersion.update({
            where: { id: newVersion.id },
            data: { diffSummary: summary },
          });
        } else {
          await prisma.apiDiff.create({
            data: {
              apiId: api.id,
              versionId: newVersion.id,
              diffJson: JSON.stringify([
                { type: "initial", message: "Initial spec imported" },
              ]),
            },
          });

          await prisma.apiVersion.update({
            where: { id: newVersion.id },
            data: { diffSummary: "Initial version imported" },
          });
        }

        console.log(`✅ Checked: ${api.name}`);
      } catch (err) {
        console.error(`❌ Failed to check API ${api.name}:`, err);
      }
    }

    console.log("✅ API monitor job done.");
  },
  { connection: redis }
);
