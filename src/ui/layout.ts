import { appConfig } from '../config/runtime';
import { logger } from '../utils/logger';

/**
 * RTL Persian layout aligned with the v0.1 UI specification.
 */
// Construct the RTL UI shell with localized numbers baked into the header metadata.
export const layout = (): string => {
  const numberFormatter = new Intl.NumberFormat('fa-IR');
  const rowsPerPage = numberFormatter.format(appConfig.rowsPerPage);
  const refreshInterval = numberFormatter.format(appConfig.autoRefreshIntervalMs);

  logger.info('Building RTL layout shell.', {
    title: appConfig.pageTitle,
    rowsPerPage: appConfig.rowsPerPage,
    refreshIntervalMs: appConfig.autoRefreshIntervalMs,
  });

  return `
  <main class="shell">
    <header class="header">
      <div class="logo" role="img" aria-label="لوگو">${appConfig.companyLogoSvg}</div>
      <div class="header-text">
        <h1 class="title">${appConfig.pageTitle}</h1>
        <p class="subtitle">پایش برنامه تولید با داده‌های اکسل (آفلاین)</p>
      </div>
      <div class="header-meta">
        <div class="meta-item">
          <span class="meta-label">مسیر فایل</span>
          <span class="meta-value mono">${appConfig.excelFilePath}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">بازه بروزرسانی</span>
          <span class="meta-value mono">${refreshInterval} میلی‌ثانیه</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">ردیف در صفحه</span>
          <span class="meta-value mono">${rowsPerPage}</span>
        </div>
      </div>
    </header>

    <section class="card status-card" aria-live="polite">
      <div class="status-line">
        <div class="status-info">
          <div class="status-time">
            <span class="meta-label">آخرین بروزرسانی</span>
            <span id="excel-last-refresh" class="meta-value mono">—</span>
          </div>
          <span id="excel-status" class="status status--idle">در حال بارگذاری...</span>
        </div>
        <div class="status-actions">
          <button id="excel-refresh" class="secondary-button" type="button" disabled>
            بروزرسانی دستی
          </button>
          <button id="excel-browse" class="primary-button" type="button">
            انتخاب فایل اکسل
          </button>
          <input
            id="excel-file-input"
            class="sr-only"
            type="file"
            accept=".xlsx,.xls"
          />
        </div>
      </div>
      <p id="excel-summary" class="hint">در انتظار دریافت داده از فایل اکسل.</p>
    </section>

    <section class="card data-card">
      <div class="card-header">
        <div>
          <h2>گزارش تولید</h2>
          <p class="hint">آخرین وضعیت تولید به صورت راست‌به‌چپ نمایش داده می‌شود.</p>
        </div>
        <div class="table-legend">
          <span class="legend-badge">واپَسین</span>
          <span class="legend-text">جدیدترین ردیف</span>
        </div>
      </div>
      <div id="excel-empty" class="empty-state" hidden>
        <p>داده‌ای برای نمایش وجود ندارد. مسیر فایل را بررسی کنید.</p>
      </div>
      <div id="excel-table" class="table-wrapper" hidden></div>
    </section>
  </main>
`;
};
