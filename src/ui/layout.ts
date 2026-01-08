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
  <!-- Application shell wrapper sets overall spacing and max width -->
  <main class="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-7 px-4 pb-12 pt-8 sm:px-6 lg:px-8">
    <!-- Branded header card -->
    <header class="grid items-center gap-5 rounded-2xl border border-red-200/70 bg-gradient-to-br from-white via-rose-50 to-red-50 px-6 py-5 shadow-xl sm:grid-cols-[auto_1fr]">
      <div class="grid h-16 w-16 place-items-center rounded-2xl border border-red-200/60 bg-gradient-to-br from-red-50 to-white" role="img" aria-label="لوگو"></div>
      <h1 class="text-balance text-2xl font-bold text-slate-900 sm:text-[clamp(22px,3vw,30px)]">${appConfig.pageTitle}</h1>
    </header>

    <!-- Primary data visualization card -->
    <section class="w-full rounded-2xl border border-red-100/70 bg-white p-6 shadow-lg">
      <!-- Empty-state placeholder (toggled by the render pipeline) -->
      <div
        id="excel-empty"
        class="rounded-xl border border-dashed border-red-100 bg-rose-50 px-5 py-4 text-center text-sm text-rose-500"
        hidden
      >
        <p>داده‌ای برای نمایش وجود ندارد. مسیر فایل را بررسی کنید.</p>
      </div>
      <div
        id="excel-table"
        class="overflow-x-auto rounded-xl border border-red-100 bg-white shadow-inner"
        hidden
      ></div>
    </section>

    <!-- Footer status and action controls -->
    <section
      class="w-full rounded-2xl border border-red-100/70 border-t-red-200/70 bg-gradient-to-br from-white to-rose-50 p-6 shadow-lg"
      aria-live="polite"
    >
      <!-- Status summary + user actions -->
      <div class="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-6">
        <div class="flex flex-col gap-2">
          <div class="flex flex-col gap-0.5">
            <span class="text-xs font-semibold text-rose-500">آخرین بروزرسانی</span>
            <span id="excel-last-refresh" class="direction-ltr text-sm text-slate-900">—</span>
          </div>
          <!-- Status badge colors are updated dynamically in excelTable.ts -->
          <span
            id="excel-status"
            class="inline-flex w-fit items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-sm font-medium text-red-600"
          >
            در حال بارگذاری...
          </span>
        </div>
        <!-- Action buttons remain accessible and keyboard navigable -->
        <div class="flex flex-wrap gap-3">
          <button
            id="excel-refresh"
            class="inline-flex items-center justify-center rounded-lg border border-red-100 bg-white px-4 py-2 text-sm font-semibold text-red-700 shadow-sm transition hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-300 disabled:cursor-not-allowed disabled:opacity-60"
            type="button"
            disabled
          >
            بروزرسانی دستی
          </button>
          <button
            id="excel-browse"
            class="inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-300"
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
