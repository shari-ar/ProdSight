// Centralized test logging hooks to make CI output more diagnostic.
import { afterAll, afterEach, beforeAll } from 'vitest';

const logInfo = (message: string): void => {
  console.info(`[Vitest] ${message}`);
};

const logError = (message: string): void => {
  console.error(`[Vitest] ${message}`);
};

let suiteStartedAt = 0;

beforeAll(() => {
  suiteStartedAt = Date.now();
  logInfo('Test suite started.');
});

afterEach((context) => {
  const status = context.task.result?.state ?? 'unknown';
  if (status === 'fail') {
    const errorMessage = context.task.result?.errors?.[0]?.message ?? 'Unknown error';
    logError(`Failed: ${context.task.name} (${errorMessage}).`);
  }
});

afterAll(() => {
  const durationMs = suiteStartedAt ? Date.now() - suiteStartedAt : 0;
  logInfo(`Test suite finished in ${durationMs}ms.`);
});
