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
      <div class="header-text">
        <span class="header-kicker">سامانه رصد تولید</span>
        <h1 class="title">${appConfig.pageTitle}</h1>
        <p class="subtitle">نمای کلی تولید روزانه و آخرین وضعیت فایل اکسل.</p>
      </div>
      <div class="logo" role="img" aria-label="لوگو">${appConfig.companyLogoSvg}</div>
    </header>

    <!-- Primary data visualization card -->
    <section class="card data-card">
      <div class="card-header">
        <div class="card-title">
          <h2>گزارش تولید</h2>
          <p class="hint">آخرین وضعیت تولید به صورت راست‌به‌چپ نمایش داده می‌شود.</p>
        </div>
        <div class="table-legend" aria-label="راهنمای جدول">
          <span class="legend-badge">واپَسین</span>
          <span class="legend-text">جدیدترین ردیف</span>
        </div>
      </div>
      <!-- Empty-state placeholder (toggled by the render pipeline) -->
      <div id="excel-empty" class="empty-state" hidden>
        <p>داده‌ای برای نمایش وجود ندارد. مسیر فایل را بررسی کنید.</p>
      </div>
      <!-- Table container injected by the render pipeline -->
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
