import type { ExcelData, NormalizedCell, NormalizedRow } from '../data/model';

type ExcelTableElements = {
  status: HTMLElement;
  summary: HTMLElement;
  emptyState: HTMLElement;
  tableWrapper: HTMLElement;
  lastRefresh: HTMLElement;
  refreshButton: HTMLButtonElement;
};

const numberFormatter = new Intl.NumberFormat('fa-IR');
const dateFormatter = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
  dateStyle: 'medium',
});
const dateTimeFormatter = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

const getExcelTableElements = (): ExcelTableElements => {
  const status = document.getElementById('excel-status');
  const summary = document.getElementById('excel-summary');
  const emptyState = document.getElementById('excel-empty');
  const tableWrapper = document.getElementById('excel-table');
  const lastRefresh = document.getElementById('excel-last-refresh');
  const refreshButton = document.getElementById('excel-refresh');

  if (
    !status ||
    !summary ||
    !emptyState ||
    !tableWrapper ||
    !lastRefresh ||
    !(refreshButton instanceof HTMLButtonElement)
  ) {
    throw new Error('Excel table elements are missing from the layout.');
  }

  return { status, summary, emptyState, tableWrapper, lastRefresh, refreshButton };
};

const setStatus = (elements: ExcelTableElements, text: string, tone: 'idle' | 'success' | 'error') => {
  elements.status.textContent = text;
  elements.status.classList.remove('status--idle', 'status--success', 'status--error');
  elements.status.classList.add(`status--${tone}`);
};

const parseIsoDateString = (value: string): Date | null => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const parsed = new Date(year, month - 1, day);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  return parsed;
};

const formatDate = (value: string): string => {
  const parsed = parseIsoDateString(value) ?? new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return dateFormatter.format(parsed);
};

const formatDateTime = (date: Date): string => {
  return dateTimeFormatter.format(date);
};

const formatCell = (value: NormalizedCell, isDateCell: boolean): string => {
  if (value === null) {
    return '—';
  }
  if (typeof value === 'number') {
    return numberFormatter.format(value);
  }
  return isDateCell ? formatDate(value) : value;
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
  const latestTimestamp =
    data.rows.length > 0
      ? Math.max(...data.rows.map((row) => row.date.getTime()))
      : null;

  data.rows.forEach((row) => {
    const isLatest = latestTimestamp !== null && row.date.getTime() === latestTimestamp;
    tbody.appendChild(buildBodyRow(row, data.headers, data.dateHeader, isLatest));
  });
  table.appendChild(tbody);

  return table;
};

const buildBodyRow = (
  row: NormalizedRow,
  headers: string[],
  dateHeader: string,
  isLatest: boolean,
): HTMLTableRowElement => {
  const tr = document.createElement('tr');
  tr.className = isLatest ? 'excel-row excel-row--latest' : 'excel-row';
  headers.forEach((header) => {
    const td = document.createElement('td');
    const isDateCell = header === dateHeader;
    const value = formatCell(row.cells[header] ?? null, isDateCell);

    if (isLatest && isDateCell) {
      const wrapper = document.createElement('div');
      wrapper.className = 'latest-cell';

      const dateSpan = document.createElement('span');
      dateSpan.textContent = value;

      const badge = document.createElement('span');
      badge.className = 'latest-badge';
      badge.textContent = 'واپَسین';

      wrapper.appendChild(dateSpan);
      wrapper.appendChild(badge);
      td.appendChild(wrapper);
    } else {
      td.textContent = value;
    }
    tr.appendChild(td);
  });
  return tr;
};

export const renderExcelLoadingState = (): void => {
  const elements = getExcelTableElements();
  setStatus(elements, 'در حال بارگذاری...', 'idle');
  elements.summary.textContent = 'در انتظار دریافت داده از فایل اکسل.';
  elements.lastRefresh.textContent = '—';
  elements.refreshButton.disabled = true;
  elements.emptyState.classList.remove('empty-state--error');
  elements.emptyState.hidden = true;
  elements.tableWrapper.hidden = true;
  elements.tableWrapper.innerHTML = '';
};

export const renderExcelErrorState = (message: string): void => {
  const elements = getExcelTableElements();
  setStatus(elements, 'خطا در بارگذاری', 'error');
  elements.summary.textContent = message;
  elements.lastRefresh.textContent = '—';
  elements.refreshButton.disabled = false;
  elements.emptyState.classList.add('empty-state--error');
  elements.emptyState.hidden = false;
  elements.tableWrapper.hidden = true;
  elements.tableWrapper.innerHTML = '';
};

export const renderExcelTable = (data: ExcelData): void => {
  const elements = getExcelTableElements();
  if (data.rows.length === 0) {
    setStatus(elements, 'بدون داده', 'idle');
    elements.summary.textContent = 'هیچ ردیفی در فایل اکسل یافت نشد.';
    elements.lastRefresh.textContent = formatDateTime(new Date());
    elements.refreshButton.disabled = false;
    elements.emptyState.classList.remove('empty-state--error');
    elements.emptyState.hidden = false;
    elements.tableWrapper.hidden = true;
    elements.tableWrapper.innerHTML = '';
    return;
  }

  const table = buildTable(data);
  setStatus(elements, 'نمایش داده‌ها', 'success');
  elements.summary.textContent = `نمایش ${data.rows.length} ردیف از فایل اکسل.`;
  elements.lastRefresh.textContent = formatDateTime(new Date());
  elements.refreshButton.disabled = false;
  elements.emptyState.classList.remove('empty-state--error');
  elements.emptyState.hidden = true;
  elements.tableWrapper.hidden = false;
  elements.tableWrapper.innerHTML = '';
  elements.tableWrapper.appendChild(table);
};
