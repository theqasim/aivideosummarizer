import { NextRequest, NextResponse } from "next/server";
import { getTextExtractor } from "office-text-extractor";
import OpenAI from "openai";
import fs from "fs";

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

export async function POST(request: NextRequest) {
  try {
    const openai = new OpenAI();

    const formData = await request.formData();
    const userFile = formData.getAll("files")[0] as File;

    const transcription = await openai.audio.transcriptions.create({
      file: userFile,
      model: "whisper-1",
    });

    const extractedText = transcription.text;

    // console.log("Extracted MP3 Text:", extractedText);

    return new NextResponse(
      JSON.stringify({
        extractedText,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error extracting text:", error);
    return NextResponse.json(
      { error: "Failed to extract text from file." },
      { status: 500 }
    );
  }
}
