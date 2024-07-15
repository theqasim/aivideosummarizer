import { NextRequest, NextResponse } from "next/server";
import Tesseract from "tesseract.js";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      throw new Error("No file uploaded");
    }

    // Ensure the file is an image
    const validImageTypes = ["image/png", "image/jpeg", "image/gif"];
    if (!validImageTypes.includes(file.type)) {
      throw new Error(
        "Invalid file type. Please upload a PNG, JPEG, or GIF image.",
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64String = buffer.toString("base64");
    const dataUrl = `data:${file.type};base64,${base64String}`;

    // const worker = Tesseract.createWorker({
    //   logger: (m) => console.log(m), // Optional logger
    // });

    // await worker.load();
    // await worker.loadLanguage("eng");
    // await worker.initialize("eng");
    // const {
    //   data: { text },
    // } = await worker.recognize(dataUrl);
    // await worker.terminate();

    const text = "test";

    return NextResponse.json({
      extractedText: text,
    });
  } catch (error) {
    console.error("Error extracting text:", error);
    return NextResponse.json(
      { error: "Failed to extract text from file." },
      { status: 500 },
    );
  }
}
