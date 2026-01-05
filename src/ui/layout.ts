import { appConfig } from '../config/runtime';

export const layout = (): string => `
  <main class="shell">
    <header class="header">
      <img class="logo" src="${appConfig.companyLogoBase64}" alt="لوگو" />
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
  </main>
`;
