import { NextResponse } from "next/server";

const PORTRAIT_IMAGES = [
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1",
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
  "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
];

const VIDEO_SAMPLES = [
  "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4",
  "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_2mb.mp4",
];

function getAspectDimensions(ratio) {
  const map = {
    "1:1": { width: 500, height: 500 },
    "4:3": { width: 600, height: 450 },
    "16:9": { width: 700, height: 394 },
    "9:16": { width: 450, height: 800 },
  };
  return map[ratio] || map["1:1"];
}

function buildImageUrl(baseUrl, ratio, index) {
  const { width, height } = getAspectDimensions(ratio);
  return `${baseUrl}?w=${width}&h=${height}&fit=crop&sig=${index}`;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      prompt = "",
      type = "image",
      count = 4,
      aspectRatio = "1:1",
      model = "Flux Pro",
    } = body;

    const safeCount = Math.min(Math.max(Number(count) || 4, 1), 8);
    await new Promise((resolve) => setTimeout(resolve, 900));

    if (type === "video") {
      const items = Array.from({ length: Math.min(safeCount, 2) }, (_, index) => ({
        id: `video-${Date.now()}-${index}`,
        type: "video",
        src: VIDEO_SAMPLES[index % VIDEO_SAMPLES.length],
        poster: buildImageUrl(
          PORTRAIT_IMAGES[index % PORTRAIT_IMAGES.length],
          aspectRatio,
          index
        ),
        alt: `Generated video ${index + 1} for: ${prompt.slice(0, 60)}`,
      }));

      return NextResponse.json({ success: true, prompt, model, aspectRatio, type: "video", items });
    }

    const items = Array.from({ length: safeCount }, (_, index) => ({
      id: `image-${Date.now()}-${index}`,
      type: "image",
      src: buildImageUrl(
        PORTRAIT_IMAGES[index % PORTRAIT_IMAGES.length],
        aspectRatio,
        index
      ),
      alt: `Generated image ${index + 1} for: ${prompt.slice(0, 60)}`,
    }));

    return NextResponse.json({ success: true, prompt, model, aspectRatio, type: "image", items });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to generate content." },
      { status: 500 }
    );
  }
}
