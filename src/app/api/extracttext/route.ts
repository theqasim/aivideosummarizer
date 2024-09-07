import { NextRequest, NextResponse } from "next/server";
import { getTextExtractor } from "office-text-extractor";

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.getAll("files")[0] as File;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    console.log("File Name:", file.name);

    // Extract the name of the file
    const extractor = getTextExtractor();
    const extractedText = await extractor.extractText({
      input: buffer,
      type: "buffer",
    });

    // console.log("Extracted Powerpoint Text:", powerpointText);

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
