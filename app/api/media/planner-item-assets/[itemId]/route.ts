import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/auth/server";
import { type PlannerModelFilename } from "@/lib/constants/planner-assets";
import { getPlannerAssetByItemId, getPlannerVariantById } from "@/lib/supabase/planner-assets";

async function getLocalFallbackResponse(filename?: PlannerModelFilename) {
  if (!filename) {
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

export async function GET(
  request: Request,
  context: { params: Promise<{ itemId: string }> },
) {
  const { itemId } = await context.params;
  const { searchParams } = new URL(request.url);
  const variantId = searchParams.get("variantId");
  const plannerAsset = await getPlannerAssetByItemId(itemId);
  const plannerVariant = variantId ? await getPlannerVariantById(variantId) : null;
  const targetVariant = plannerVariant?.itemId === itemId ? plannerVariant : null;
  const storagePath = targetVariant?.modelStoragePath ?? plannerAsset?.modelStoragePath;
  const bucketId = targetVariant?.bucketId ?? plannerAsset?.bucketId;
  const fallbackFilename = (targetVariant?.fallbackModelFilename ??
    plannerAsset?.fallbackModelFilename) as PlannerModelFilename | undefined;

  if (!storagePath || !bucketId) {
    return getLocalFallbackResponse(fallbackFilename);
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return getLocalFallbackResponse(fallbackFilename);
  }

  const { data, error } = await supabase.storage
    .from(bucketId)
    .download(storagePath);

  if (error || !data) {
    return getLocalFallbackResponse(fallbackFilename);
  }

  const assetBuffer = Buffer.from(await data.arrayBuffer());

  return new NextResponse(assetBuffer, {
    headers: {
      "Cache-Control": "public, max-age=3600",
      "Content-Length": String(assetBuffer.byteLength),
      "Content-Type": "model/gltf-binary",
    },
  });
}
