/** Cell values after normalization for UI rendering. */
export type NormalizedCell = string | number | null;

/** Canonical row shape with authoritative date data. */
export type NormalizedRow = {
  date: Date;
  cells: Record<string, NormalizedCell>;
};

/** Normalized workbook output used by the UI layer. */
export type ExcelData = {
  headers: string[];
  dateHeader: string;
  rows: NormalizedRow[];
};
