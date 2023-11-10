import * as excel from "exceljs";

import { OCRField, OCRRead, OCRResponse } from "../../types";
import { Keyword } from "./types";

const keywordNonTableSheetMapping: Keyword = {
  bank_name: { field: "BANK_NAME" },
  account_number: { field: "KL_ACC_CARD_NO" },
  account_name: { field: "ACCT_NAME" },
  currency: { field: "CURR_LNG_NM" },
  product_name: { field: "PRODUCT_NAME" },
  beginning_balance: { field: "BEG_BAL", format: "number" },
  total_transaction: { field: "TOTAL_TXN" },
  total_debit_transaction: { field: "TOTAL_TXN_DEBIT", format: "number" },
  total_credit_transaction: { field: "TOTAL_TXN_CREDIT", format: "number" },
  start_period: { field: "START_PERIOD", format: "date" },
  end_period: { field: "END_PERIOD", format: "date" },
};

const keywordTableMapping: Keyword = {
  posting_date: { field: "TGL_POST", format: "date" },
  effective_date: { field: "TGL_EFF", format: "date" },
  description: { field: "TRANS_LONG_NAME" },
  debit_transaction: { field: "TXN_DEBIT", format: "number" },
  credit_transaction: { field: "TXN_CREDIT", format: "number" },
  signed_amount: { field: "SIGNED_AMOUNT", format: "number" },
};

function formatAsDate(ocrText: string): string {
  const parts = ocrText.split("-");

  if (parts.length === 2) {
    const month = String(parseInt(parts[0], 10)).padStart(2, "0");
    const day = String(parseInt(parts[1], 10)).padStart(2, "0");
    return `${day}/${month}`;
  } else if (parts.length === 3) {
    const date = new Date(ocrText);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${day}/${month}/${date.getFullYear()}`;
  } else {
    return ocrText;
  }
}

function formatFieldOCR(
  ocrFieldObject,
  format?: "string" | "date" | "number"
): string {
  const { value } = ocrFieldObject ?? {};

  let ocrText = [null, undefined, ""].includes(value) ? null : value;
  if (ocrText !== null && format === "number") {
    ocrText = parseFloat(ocrText).toFixed(2);
  } else if (ocrText !== null && format === "date") {
    ocrText = formatAsDate(ocrText);
  }

  return ocrText;
}

function beautifySheet(sheet: excel.Worksheet, transactionLength: number) {
  const baseFontStyle = {
    name: "Times New Roman",
    size: 11,
  };
  for (let row = 1; row <= 16; row++) {
    sheet.getCell(`A${row}`).style = {
      font: {
        ...baseFontStyle,
        bold: true,
      },
    };
  }

  const borderStyle: excel.Border = {
    style: "thin",
    color: {
      argb: "FF000000",
    },
  };
  const border: Partial<excel.Borders> = {
    top: borderStyle,
    bottom: borderStyle,
    left: borderStyle,
    right: borderStyle,
  };

  if (transactionLength) {
    for (let column = 1; column <= 6; column++) {
      for (let row = 0; row < transactionLength; row++) {
        sheet.getCell(row + 18, column).style = {
          font: baseFontStyle,
          border,
        };
      }

      sheet.getCell(17, column).style = {
        font: {
          ...baseFontStyle,
          bold: true,
        },
        alignment: {
          horizontal: "center",
        },
        border,
      };
    }
  }

  sheet.columns.forEach((column) => {
    column.style = {
      font: baseFontStyle,
    };
  });

  sheet.columns.forEach((column) => {
    if (column.values) {
      const lengths = column.values.map((v) => (v ? v.toString().length : 0));
      const maxLength = Math.max(
        ...lengths.filter((v) => typeof v === "number")
      );
      column.width = maxLength + 4;
    }
  });
}

export default async function exportToSheet(
  response: OCRResponse,
  documentName: string
): Promise<Buffer> {
  const workbook = new excel.Workbook();

  // truncate limit
  documentName = documentName.slice(0, 31);

  const sheet = workbook.addWorksheet(documentName);
  const rows = [["Extraction Result"], [""], ["File Name", documentName], [""]];

  const read = response.read as OCRRead;

  for (const [key, fieldInfo] of Object.entries(keywordNonTableSheetMapping)) {
    const value = formatFieldOCR(read[key], fieldInfo.format);
    rows.push([fieldInfo.field, value]);
  }

  const transactions = read.transactions as OCRField[];
  if (transactions && transactions.length > 0) {
    rows.push(
      [""],
      [
        "TGL_POST",
        "TGL_EFF",
        "TRANS_LONG_NAME",
        "TXN_DEBIT",
        "TXN_CREDIT",
        "SIGNED_AMOUNT",
      ]
    );

    for (const transaction of transactions) {
      const transactionRow: string[] = [];

      for (const [key, fieldInfo] of Object.entries(keywordTableMapping)) {
        const value = formatFieldOCR(transaction[key], fieldInfo.format);

        transactionRow.push(value);
      }

      rows.push(transactionRow);
    }
  }

  sheet.addRows(rows);
  beautifySheet(sheet, transactions?.length ?? 0);

  const excelBuffer = await workbook.xlsx.writeBuffer();
  return excelBuffer as Buffer;
}
