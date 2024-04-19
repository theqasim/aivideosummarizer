// pages/api/extraction.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
export const maxDuration = 300;

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
let longTranscriptLengthStatus = false;

function formatTranscript(transcription: any[]): string | void {
  const totalLength = transcription.reduce((acc, entry) => {
    if (typeof entry.subtitle === "string") {
      return acc + entry.subtitle.length;
    }
    return acc;
  }, 0);

  if (totalLength > 32768) {
    longTranscriptLengthStatus = true;
    console.log("Long Video Transcript Detected: " + totalLength + " / 32768");
  }

  return transcription
    .map((entry: { subtitle: any }) => {
      try {
        return typeof entry.subtitle === "string"
          ? entry.subtitle.replace(/&#39;/g, "'")
          : "Error: Non-string subtitle";
      } catch (error) {
        console.error("Error processing entry:", entry, error);
        return "Error: Exception caught";
      }
    })
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
    console.log(title);
    const formattedTranscript = formatTranscript(data[0].transcription);

    return new NextResponse(
      JSON.stringify({
        title,
        formattedTranscript,
        videoID,
        longTranscriptLengthStatus,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to process request" }),
      { status: 500 }
    );
  }
}
