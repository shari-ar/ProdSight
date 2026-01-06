import { appConfig } from '../config/runtime';
import { logger } from '../utils/logger';

/**
 * RTL Persian layout aligned with the v0.1 UI specification.
 */
// Construct the RTL UI shell with a formal, metadata-free header.
export const layout = (): string => {
  // Log only non-sensitive values for diagnostics.
  logger.info('ui.layout.build', {
    component: 'layout',
    pageTitle: appConfig.pageTitle,
  });

  // Return the full RTL layout as a single HTML template string.
  return `
  <main class="shell">
    <header class="header">
      <div class="logo" role="img" aria-label="لوگو">${appConfig.companyLogoSvg}</div>
      <h1 class="title">${appConfig.pageTitle}</h1>
    </header>

    <!-- Primary data visualization card -->
    <section class="card data-card">
      <!-- Empty-state placeholder (toggled by the render pipeline) -->
      <div id="excel-empty" class="empty-state" hidden>
        <p>داده‌ای برای نمایش وجود ندارد. مسیر فایل را بررسی کنید.</p>
      </div>
      <div id="excel-table" class="table-wrapper" hidden></div>
    </section>

    <!-- Footer status and action controls -->
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
          <!-- Screen-reader-only file input for manual Excel selection -->
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
  </main>
`;
};
