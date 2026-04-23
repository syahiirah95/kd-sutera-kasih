import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

export async function GET() {
  const videoPath = path.join(process.cwd(), "assets", "bg", "bg_video.mp4");

  try {
    const videoBuffer = await readFile(videoPath);

    return new NextResponse(videoBuffer, {
      headers: {
        "Cache-Control": "public, max-age=3600",
        "Content-Length": String(videoBuffer.byteLength),
        "Content-Type": "video/mp4",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Venue video not found." },
      { status: 404 },
    );
  }
}
