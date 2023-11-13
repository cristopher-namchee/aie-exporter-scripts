import * as excel from "exceljs";

import { OCRField, OCRResponse } from "../types";

export default async function exportToSheet(
  response: OCRResponse,
  documentName: string
): Promise<Buffer> {
  const workbook = new excel.Workbook();
  // truncate limit
  documentName = documentName.slice(0, 31);

  const sheet = workbook.addWorksheet(documentName);

  const rows: string[][] = [];
  const read = response.read;
  if (!Array.isArray(read)) {
    for (const [key, value] of Object.entries(read)) {
      const val = value as OCRField;

      rows.push([key, JSON.stringify(value)]);
    }
  }

  sheet.addRows(rows);

  const excelBuffer = await workbook.xlsx.writeBuffer();
  return excelBuffer as Buffer;
}
