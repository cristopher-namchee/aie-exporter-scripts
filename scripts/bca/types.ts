export interface Keyword {
  [key: string]: {
    field: string;
    format?: "string" | "date" | "number";
    delimiter?: string;
    segment?: number | string;
    padding_char?: string;
    expected_length?: number;
  };
}
