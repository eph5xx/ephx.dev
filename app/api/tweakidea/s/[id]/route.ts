// app/api/tweakidea/s/[id]/route.ts
// Read-only KV lookup for a saved tweakidea bundle. Feeds both the
// /tweakidea/s/[id] viewer page and the "Download save JSON" button.

import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { SaveRequestSchema } from "@/lib/tweakidea/schema";

const ID_REGEX = /^[A-Za-z0-9_-]{16,32}$/;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!ID_REGEX.test(id)) {
    return NextResponse.json(
      { error: { code: "invalid_id", message: "Invalid save id." } },
      { status: 400 },
    );
  }

  const { env } = getCloudflareContext();
  const raw = await env.TWEAKIDEA_KV.get(id);
  if (raw === null) {
    return NextResponse.json(
      { error: { code: "not_found", message: "Save not found or expired." } },
      { status: 404 },
    );
  }

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return NextResponse.json(
      { error: { code: "corrupt_record", message: "Stored record is corrupt." } },
      { status: 500 },
    );
  }

  const parsed = SaveRequestSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: "corrupt_record", message: "Stored record failed validation." } },
      { status: 500 },
    );
  }

  return NextResponse.json(parsed.data, {
    headers: {
      "content-disposition": `inline; filename="tweakidea-${id}.json"`,
    },
  });
}
