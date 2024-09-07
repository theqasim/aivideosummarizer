import { NextRequest, NextResponse } from "next/server";
import { getTextExtractor } from "office-text-extractor";
import OpenAI from "openai";
import fs from "fs";
import { AssemblyAI } from "assemblyai";

const apiKey = process.env.ASSEMBLYAIAPIKEY || "";
const client = new AssemblyAI({
  apiKey,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const userFile = formData.getAll("files")[0] as File;

    let transcript = await client.transcripts.transcribe({
      audio: userFile,
    });

    // Get the parts of the transcript that were tagged with topics

    console.log("Assembly Transcript:", transcript.text);
    // console.log("Extracted MP3 Text:", extractedText);

    return new NextResponse(
      JSON.stringify({
        extractedText: transcript.text,
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
