export type NormalizedCell = string | number | null;

export type NormalizedRow = {
  date: Date;
  cells: Record<string, NormalizedCell>;
};

export type ExcelData = {
  headers: string[];
  dateHeader: string;
  rows: NormalizedRow[];
};
