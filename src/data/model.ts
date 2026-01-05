export type NormalizedCell = string | number | null;

export type NormalizedRow = {
  date: Date;
  cells: Record<string, NormalizedCell>;
  sourceRowIndex: number;
};

export type ExcelDataset = {
  headers: string[];
  rows: NormalizedRow[];
};
