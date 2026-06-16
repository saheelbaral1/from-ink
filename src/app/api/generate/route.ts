import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getSupabaseAdmin, BUCKET } from "@/lib/supabase";

export const maxDuration = 120;

const MODEL = "gemini-3.1-flash-image";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

const PROMPT =
  "Transform this child's drawing into a beautiful children's storybook watercolor illustration. " +
  "Preserve the original composition, subject matter, and character placement, but render it with rich watercolor textures, " +
  "soft color gradients, and a polished illustrated style — as if it appeared in a high-quality picture book. " +
  "Generate the image in a vertical portrait orientation with a 4:5 aspect ratio (taller than wide), " +
  "suitable for printing as a 40×50 cm poster.";

interface GeminiPart {
  text?: string;
  inlineData?: { mimeType: string; data: string };
}

interface GeminiResponse {
  candidates?: Array<{
    content?: { parts?: GeminiPart[] };
    finishReason?: string;
  }>;
  error?: { message: string; code: number };
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "GEMINI_API_KEY is not configured" }, { status: 500 });
  }

  let imageBase64: string;
  let mimeType: string;

  try {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Image must be under 10 MB" }, { status: 400 });
    }
    mimeType = file.type || "image/jpeg";
    const buffer = await file.arrayBuffer();
    imageBase64 = Buffer.from(buffer).toString("base64");
  } catch {
    return NextResponse.json({ error: "Failed to read uploaded file" }, { status: 400 });
  }

  // 1. Call Gemini
  const body = {
    contents: [
      {
        role: "user",
        parts: [
          { inlineData: { mimeType, data: imageBase64 } },
          { text: PROMPT },
        ],
      },
    ],
    generationConfig: {
      responseModalities: ["IMAGE", "TEXT"],
      imageConfig: {
        aspectRatio: "4:5",
      },
    },
  };

  let geminiRes: Response;
  try {
    geminiRes = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Network error reaching Gemini API";
    console.error("[/api/generate] fetch error:", message);
    return NextResponse.json({ error: message }, { status: 502 });
  }

  let data: GeminiResponse;
  try {
    data = (await geminiRes.json()) as GeminiResponse;
  } catch {
    return NextResponse.json(
      { error: `Gemini API returned non-JSON (HTTP ${geminiRes.status})` },
      { status: 502 },
    );
  }

  if (!geminiRes.ok || data.error) {
    const detail = data.error?.message ?? `Gemini API error (HTTP ${geminiRes.status})`;
    console.error("[/api/generate] API error:", detail);
    return NextResponse.json({ error: detail }, { status: 502 });
  }

  const parts = data.candidates?.[0]?.content?.parts ?? [];
  const imagePart = parts.find((p) => p.inlineData?.data);

  if (!imagePart?.inlineData?.data) {
    const textPart = parts.find((p) => p.text);
    const detail = textPart?.text ?? "No image returned by the model";
    console.error("[/api/generate] no image in response:", detail);
    return NextResponse.json({ error: detail }, { status: 502 });
  }

  const outputMime = imagePart.inlineData.mimeType ?? "image/png";
  const ext = outputMime.split("/")[1] ?? "png";
  const outputBuffer = Buffer.from(imagePart.inlineData.data, "base64");

  // 2. Upload to Supabase storage
  let storageUrl: string;
  try {
    const supabase = getSupabaseAdmin();

    // Create bucket if it doesn't exist yet (no-op if already present)
    await supabase.storage.createBucket(BUCKET, {
      public: true,
      fileSizeLimit: 20 * 1024 * 1024,
    });

    const filename = `${randomUUID()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(filename, outputBuffer, { contentType: outputMime, upsert: false });

    if (uploadError && uploadError.message !== "The resource already exists") {
      throw new Error(uploadError.message);
    }

    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(filename);
    storageUrl = urlData.publicUrl;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Supabase upload failed";
    console.error("[/api/generate] storage error:", message);
    return NextResponse.json({ error: `Storage error: ${message}` }, { status: 502 });
  }

  return NextResponse.json({ storageUrl });
}
