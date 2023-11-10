import * as excel from "exceljs";

import { OCRResponse } from "../types";

export default async function exportToSheet(
  _: OCRResponse,
  documentName: string
): Promise<Buffer> {
  const workbook = new excel.Workbook();
  const sheet = workbook.addWorksheet(documentName);

  const rows = [];

  sheet.addRows(rows);

  const excelBuffer = await workbook.xlsx.writeBuffer();
  return excelBuffer as Buffer;
}
