import { NextRequest, NextResponse } from "next/server";
import formidable from "formidable";
import { promises as fs } from "fs";
import Tesseract from "tesseract.js";
import path from "path";
import os from "os";

export const config = {
  api: {
    bodyParser: false,
  },
};

const readFile = (req: NextRequest) =>
  new Promise<{ fields: formidable.Fields; files: formidable.Files }>(
    (resolve, reject) => {
      const form = formidable({
        uploadDir: os.tmpdir(),
        keepExtensions: true,
      });
      form.parse(req as any, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    }
  );

export async function POST(req: NextRequest) {
  try {
    const { files } = await readFile(req);
    const file = files.file as unknown as formidable.File;
    const filePath = file.filepath;

    const text = await Tesseract.recognize(filePath, "eng");
    await fs.unlink(filePath); // Clean up uploaded file

    return NextResponse.json({ extractedText: text.data.text });
  } catch (error) {
    return NextResponse.json(
      { error: "Error extracting text from image" },
      { status: 500 }
    );
  }
}
