// app/api/monitor/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { fetchOpenApiSpec, diffSpecs } from "@/lib/api-monitor-utils";
import { prisma } from "@/lib/prisma";
import { generateDiffSummary } from "@/lib/diff-summary";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { apiId } = await req.json();

  const api = await prisma.api.findFirst({
    where: { id: apiId, userId },
  });

  if (!api)
    return NextResponse.json({ error: "API not found" }, { status: 404 });

  const latestSpec = await fetchOpenApiSpec(api.openApiUrl);
  if (!latestSpec)
    return NextResponse.json(
      { error: "Failed to fetch OpenAPI spec" },
      { status: 500 }
    );

  const previousVersion = await prisma.apiVersion.findFirst({
    where: { apiId },
    orderBy: { createdAt: "desc" },
  });

  const newRaw = JSON.stringify(latestSpec);

  // Check if new spec is different
  if (previousVersion?.rawJson === newRaw)
    return NextResponse.json({ message: "No changes detected" });

  // Save new version
  const newVersion = await prisma.apiVersion.create({
    data: {
      apiId,
      rawJson: newRaw,
      diffSummary: "", // temporary
    },
  });

  let summaryMessage = "";

  if (previousVersion) {
    const diffResult = await diffSpecs(
      JSON.parse(previousVersion.rawJson),
      latestSpec
    );
    const summary = generateDiffSummary(diffResult);
    summaryMessage = summary;

    await prisma.apiDiff.create({
      data: {
        apiId,
        versionId: newVersion.id,
        diffJson: JSON.stringify(diffResult),
      },
    });

    await prisma.apiVersion.update({
      where: { id: newVersion.id },
      data: { diffSummary: summary },
    });
  } else {
    summaryMessage = "Initial version imported";

    await prisma.apiDiff.create({
      data: {
        apiId,
        versionId: newVersion.id,
        diffJson: JSON.stringify([
          { type: "initial", message: "Initial spec imported" },
        ]),
      },
    });

    await prisma.apiVersion.update({
      where: { id: newVersion.id },
      data: { diffSummary: summaryMessage },
    });
  }

  return NextResponse.json({
    message: "Spec updated",
    summary: summaryMessage,
  });
}
