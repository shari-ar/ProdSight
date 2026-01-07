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
  <main class="mx-auto flex min-h-full w-full max-w-[1200px] flex-col gap-7 px-4 pb-12 pt-8 sm:px-6 lg:px-12">
    <header class="grid items-center gap-5 rounded-[20px] border border-indigo-100/70 bg-gradient-to-br from-white via-slate-50 to-indigo-50 px-6 py-5 shadow-[0_18px_40px_rgba(24,37,79,0.12)] sm:grid-cols-[auto_1fr]">
      <div class="grid h-[72px] w-[72px] place-items-center rounded-[18px] border border-indigo-200/60 bg-gradient-to-br from-indigo-50 to-white" role="img" aria-label="لوگو"></div>
      <h1 class="text-[clamp(22px,3vw,30px)] font-bold text-slate-900">${appConfig.pageTitle}</h1>
    </header>

    <!-- Primary data visualization card -->
    <section class="w-full rounded-[18px] border border-slate-200/70 bg-white p-6 shadow-[0_16px_36px_rgba(31,42,68,0.1)]">
      <!-- Empty-state placeholder (toggled by the render pipeline) -->
      <div
        id="excel-empty"
        class="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-5 py-4 text-center text-sm text-slate-500"
        hidden
      >
        <p>داده‌ای برای نمایش وجود ندارد. مسیر فایل را بررسی کنید.</p>
      </div>
      <div
        id="excel-table"
        class="overflow-x-auto rounded-[14px] border border-slate-200 bg-white shadow-inner"
        hidden
      ></div>
    </section>

    <!-- Footer status and action controls -->
    <section
      class="w-full rounded-[18px] border border-slate-200/70 border-t-indigo-200/70 bg-gradient-to-br from-white to-slate-50 p-6 shadow-[0_16px_36px_rgba(31,42,68,0.1)]"
      aria-live="polite"
    >
      <div class="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div class="flex flex-col gap-2">
          <div class="flex flex-col gap-0.5">
            <span class="text-xs font-semibold text-slate-500">آخرین بروزرسانی</span>
            <span id="excel-last-refresh" class="direction-ltr text-sm text-slate-900">—</span>
          </div>
          <span
            id="excel-status"
            class="inline-flex w-fit items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600"
          >
            در حال بارگذاری...
          </span>
        </div>
        <div class="flex flex-wrap gap-3">
          <button
            id="excel-refresh"
            class="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-[0_6px_12px_rgba(31,42,68,0.08)] transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300 disabled:cursor-not-allowed disabled:opacity-60"
            type="button"
            disabled
          >
            بروزرسانی دستی
          </button>
          <button
            id="excel-browse"
            class="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_8px_16px_rgba(63,92,232,0.25)] transition hover:from-indigo-600 hover:to-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300"
            type="button"
          >
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
    </section>
  </main>
`;
};
