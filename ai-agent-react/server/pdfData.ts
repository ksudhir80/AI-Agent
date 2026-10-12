import fs from "fs";
import path from "path";
import { PDFParse } from "pdf-parse";

export async function readPdfFile(
  fileName: string,
  password?: string
): Promise<string> {
  const filePath = path.join(
    process.cwd(),
    "data",
    fileName
  );

  if (!fs.existsSync(filePath)) {
    throw new Error(
      `PDF file not found: ${fileName}`
    );
  }

  const fileBuffer =
    fs.readFileSync(filePath);

 const parser = new PDFParse({
  data: fileBuffer,
  password,
});

  const pdfData =
    await parser.getText();

  return pdfData.text;
}