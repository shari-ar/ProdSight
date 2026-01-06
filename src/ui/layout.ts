import { appConfig } from '../config/runtime';

/**
 * Minimal RTL layout for the Phase 2 scaffold.
 */
export const layout = (): string => `
  <main class="shell">
    <header class="header">
      <span class="logo" role="img" aria-label="لوگو">${appConfig.companyLogoSvg}</span>
      <div>
        <h1 class="title">${appConfig.pageTitle}</h1>
        <p class="subtitle">اسکلت اولیه برای برنامه آفلاین ProdSight</p>
      </div>
    </header>
    <section class="card">
      <h2>وضعیت</h2>
      <p>
        مسیر فایل اکسل: <span class="mono">${appConfig.excelFilePath}</span>
      </p>
      <p>
        بروزرسانی خودکار هر <span class="mono">${appConfig.autoRefreshIntervalMs}</span> میلی ثانیه
      </p>
      <p>
        نمایش <span class="mono">${appConfig.rowsPerPage}</span> ردیف در هر صفحه
      </p>
      <p class="hint">این خروجی یک نمونه مینیمال برای فاز ۲ است.</p>
    </section>
    <section class="card" aria-live="polite">
      <div class="card-header">
        <h2>داده‌های اکسل</h2>
        <span id="excel-status" class="status">در حال بارگذاری...</span>
      </div>
      <p id="excel-summary" class="hint">در انتظار دریافت داده از فایل اکسل.</p>
      <div id="excel-empty" class="empty-state" hidden>
        هنوز داده‌ای برای نمایش وجود ندارد.
      </div>
      <div id="excel-table" class="table-wrapper" hidden></div>
    </section>
  </main>
`;
