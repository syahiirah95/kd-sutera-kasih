import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import {
  LOCAL_PLANNER_MODEL_FILENAMES,
  type PlannerModelFilename,
} from "@/lib/constants/planner-assets";

const ALLOWED_PLANNER_ASSETS = new Set(LOCAL_PLANNER_MODEL_FILENAMES);

export async function GET(
  _request: Request,
  context: { params: Promise<{ filename: string }> },
) {
  const { filename } = await context.params;

  if (!ALLOWED_PLANNER_ASSETS.has(filename as PlannerModelFilename)) {
    return NextResponse.json(
      { error: "Planner asset not found." },
      { status: 404 },
    );
  }

  const assetPath = path.join(process.cwd(), "public", "planner-assets", filename);

  try {
    const assetBuffer = await readFile(assetPath);

    return new NextResponse(assetBuffer, {
      headers: {
        "Cache-Control": "public, max-age=3600",
        "Content-Length": String(assetBuffer.byteLength),
        "Content-Type": "model/gltf-binary",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Planner asset not found." },
      { status: 404 },
    );
  }
}
