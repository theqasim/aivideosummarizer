import { NextRequest, NextResponse } from "next/server";
import { getTextExtractor } from "office-text-extractor";

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

export async function POST(request: NextRequest) {
  try {
    const { userUrl } = await request.json();
    console.log("userUrl", userUrl);
    const extractor = getTextExtractor();
    const extractedText = await extractor.extractText({
      input: userUrl,
      type: "url",
    });

    console.log("extractedText", extractedText);

    return new NextResponse(
      JSON.stringify({
        extractedText,
      }),
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error extracting text:", error);
    return NextResponse.json(
      { error: "Failed to extract text from file." },
      { status: 500 },
    );
  }
}
