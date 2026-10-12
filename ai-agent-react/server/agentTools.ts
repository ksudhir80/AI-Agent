import {
  searchCustomer,
  getCustomerPolicy,
} from "./customerTool";

import {
  readExcelFile,
} from "./data/excelData";

import {
  listFiles,
} from "./fileTools";
import {
  readPdfFile,
} from "./pdfData";


import fs from "fs";
import path from "path";
import { execFile } from "child_process";
import { promisify } from "util";
import mammoth from "mammoth";

const execFileAsync = promisify(execFile);

const DATA_FOLDER = path.join(process.cwd(), "data");


async function readDocumentFile(fileName: string) {
  const filePath = path.join(DATA_FOLDER, fileName);

  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${fileName}`);
  }

  const extension = path.extname(fileName).toLowerCase();

  // ------------------------------------
  // DOCX
  // ------------------------------------

  if (extension === ".docx") {
    const result = await mammoth.extractRawText({
      path: filePath,
    });

    return {
      fileName,
      fileType: "docx",
      text: result.value,
    };
  }

  // ------------------------------------
  // DOC
  // ------------------------------------

  if (extension === ".doc") {
    const outputDir = path.join(
      DATA_FOLDER,
      "converted"
    );

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, {
        recursive: true,
      });
    }

    await execFileAsync(
      "C:\\Program Files\\LibreOffice\\program\\soffice.exe",
      [
        "--headless",
        "--convert-to",
        "docx",
        "--outdir",
        outputDir,
        filePath,
      ]
    );

    const convertedFile = path.join(
      outputDir,
      `${path.basename(fileName, ".doc")}.docx`
    );

    if (!fs.existsSync(convertedFile)) {
      throw new Error(
        "DOC file conversion failed."
      );
    }

    const result = await mammoth.extractRawText({
      path: convertedFile,
    });

    return {
      fileName,
      fileType: "doc",
      text: result.value,
    };
  }

  throw new Error(
    `Unsupported document type: ${extension}`
  );
}

export async function executeTool(
  toolName: string,
  toolArguments: string
) {
  const args = JSON.parse(
    toolArguments || "{}"
  );

  switch (toolName) {

    case "searchCustomer":
      return searchCustomer(
        args.name
      );

    case "getCustomerPolicy":
      return getCustomerPolicy(
        args.customerId
      );

    case "readExcelFile":
      return readExcelFile(
        args.fileName
      );
case "readPdfFile":
  return readPdfFile(
    args.fileName,
    args.password
  );
case "readDocumentFile":
  return readDocumentFile(
    args.fileName
  );
    case "listFiles":
      return listFiles();

    default:
      throw new Error(
        `Unknown tool: ${toolName}`
      );
  }
}