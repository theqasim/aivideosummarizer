// pages/api/extraction.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

async function fetchTranscript(videoID: string, apiKey: string): Promise<any> {
  const response = await fetch(
    `https://youtube-transcriptor.p.rapidapi.com/transcript?video_id=${videoID}&lang=en`,
    {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": "youtube-transcriptor.p.rapidapi.com",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch transcript");
  }

  return response.json();
}

function formatTranscript(transcription: any[]): string {
  return transcription
    .map((entry: { subtitle: string }) => entry.subtitle.replace(/&#39;/g, "'"))
    .join(" ");
}

function extractVideoID(url: string): string | null {
  const regex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\s*[\S]+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

export async function POST(req: NextRequest) {
  if (req.method !== "POST") {
    return new NextResponse(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
    });
  }

  try {
    const body = await req.json();
    const url = body.url;
    const videoID = extractVideoID(url);

    if (!videoID) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid YouTube URL" }),
        { status: 400 }
      );
    }

    const apiKey = process.env.RAPIDAPI_KEY;
    if (typeof apiKey !== "string") {
      throw new Error(
        "RapidAPI key is undefined. Please check your environment variables."
      );
    }

    const data = await fetchTranscript(videoID, apiKey);
    const title = data[0].title;
    const formattedTranscript = formatTranscript(data[0].transcription);

    // Returning the title and formatted transcript
    return new NextResponse(JSON.stringify({ title, formattedTranscript }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to process request" }),
      { status: 500 }
    );
  }
}