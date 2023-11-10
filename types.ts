export interface OCRField {
  value: string | string[] | number | number[] | { [key: string]: string }[];
  confidence?: number;
  confidence_text?: number;
  polygon?: number[][];
  field_info?: FieldInfo[];
}

export interface FieldInfo {
  field_info_type: string;
  value: string;
}

export interface OCRRead {
  [key: string]:
    | OCRField
    | OCRField[]
    | string
    | string[]
    | number
    | number[]
    | { [key: string]: OCRField | string }[];
}

export interface OCRResponse {
  status: string;
  reason: string;
  read: OCRRead | OCRRead[];
}

export type ExportFn = (
  response: OCRResponse,
  documentName: string
) => Promise<Buffer>;

export interface DirectoryFile {
  name: string;
  content: string;
}

export interface ResultFile extends DirectoryFile {
  buffer: Buffer;
}
