import fs from "fs";
import path from "path";

export function listFiles(): string[] {
  const dataFolder = path.join(
    process.cwd(),
    "data"
  );

  if (!fs.existsSync(dataFolder)) {
    return [];
  }

  const supportedExtensions = [
    ".xlsx",
    ".xls",
    ".pdf",
    ".docx",
    ".doc",
    ".txt",
    ".csv",
  ];

  return fs
    .readdirSync(dataFolder)
    .filter((fileName) => {
      const extension =
        path.extname(fileName).toLowerCase();

      return supportedExtensions.includes(
        extension
      );
    });
}