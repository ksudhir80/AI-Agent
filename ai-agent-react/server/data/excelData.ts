import XLSX from "xlsx";
import path from "path";

export function readExcelFile(
  fileName: string
) {
  const filePath = path.join(
    process.cwd(),
    "data",
    fileName
  );

  const workbook = XLSX.readFile(filePath);

  const result: Record<string, unknown[]> = {};

  for (const sheetName of workbook.SheetNames) {
    const worksheet =
      workbook.Sheets[sheetName];

    result[sheetName] =
      XLSX.utils.sheet_to_json(worksheet);
  }

  return result;
}