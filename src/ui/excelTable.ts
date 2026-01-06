import type { ExcelData, NormalizedCell, NormalizedRow } from '../data/model';

type ExcelTableElements = {
  status: HTMLElement;
  summary: HTMLElement;
  emptyState: HTMLElement;
  tableWrapper: HTMLElement;
};

const getExcelTableElements = (): ExcelTableElements => {
  const status = document.getElementById('excel-status');
  const summary = document.getElementById('excel-summary');
  const emptyState = document.getElementById('excel-empty');
  const tableWrapper = document.getElementById('excel-table');

  if (!status || !summary || !emptyState || !tableWrapper) {
    throw new Error('Excel table elements are missing from the layout.');
  }

  return { status, summary, emptyState, tableWrapper };
};

const setStatus = (elements: ExcelTableElements, text: string, tone: 'idle' | 'success' | 'error') => {
  elements.status.textContent = text;
  elements.status.classList.remove('status--idle', 'status--success', 'status--error');
  elements.status.classList.add(`status--${tone}`);
};

const formatCell = (value: NormalizedCell): string => {
  if (value === null) {
    return '—';
  }
  if (typeof value === 'number') {
    return new Intl.NumberFormat('fa-IR').format(value);
  }
  return value;
};

const buildTable = (data: ExcelData): HTMLTableElement => {
  const table = document.createElement('table');
  table.className = 'excel-table';

  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  data.headers.forEach((header) => {
    const th = document.createElement('th');
    th.textContent = header;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  data.rows.forEach((row) => {
    tbody.appendChild(buildBodyRow(row, data.headers));
  });
  table.appendChild(tbody);

  return table;
};

const buildBodyRow = (row: NormalizedRow, headers: string[]): HTMLTableRowElement => {
  const tr = document.createElement('tr');
  headers.forEach((header) => {
    const td = document.createElement('td');
    td.textContent = formatCell(row.cells[header] ?? null);
    tr.appendChild(td);
  });
  return tr;
};

export const renderExcelLoadingState = (): void => {
  const elements = getExcelTableElements();
  setStatus(elements, 'در حال بارگذاری...', 'idle');
  elements.summary.textContent = 'در انتظار دریافت داده از فایل اکسل.';
  elements.emptyState.hidden = true;
  elements.tableWrapper.hidden = true;
  elements.tableWrapper.innerHTML = '';
};

export const renderExcelErrorState = (message: string): void => {
  const elements = getExcelTableElements();
  setStatus(elements, 'خطا در بارگذاری', 'error');
  elements.summary.textContent = message;
  elements.emptyState.hidden = false;
  elements.tableWrapper.hidden = true;
  elements.tableWrapper.innerHTML = '';
};

export const renderExcelTable = (data: ExcelData): void => {
  const elements = getExcelTableElements();
  if (data.rows.length === 0) {
    setStatus(elements, 'بدون داده', 'idle');
    elements.summary.textContent = 'هیچ ردیفی در فایل اکسل یافت نشد.';
    elements.emptyState.hidden = false;
    elements.tableWrapper.hidden = true;
    elements.tableWrapper.innerHTML = '';
    return;
  }

  const table = buildTable(data);
  setStatus(elements, 'نمایش داده‌ها', 'success');
  elements.summary.textContent = `نمایش ${data.rows.length} ردیف از فایل اکسل.`;
  elements.emptyState.hidden = true;
  elements.tableWrapper.hidden = false;
  elements.tableWrapper.innerHTML = '';
  elements.tableWrapper.appendChild(table);
};
