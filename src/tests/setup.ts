// Centralized test logging hooks to make CI output more diagnostic.
import { afterAll, afterEach, beforeAll, beforeEach } from 'vitest';

const log = (message: string): void => {
  console.info(`[Vitest] ${message}`);
};

beforeAll(() => {
  log('Test suite started.');
});

beforeEach((context) => {
  log(`Starting: ${context.task.name}`);
});

afterEach((context) => {
  const status = context.task.result?.state ?? 'unknown';
  log(`Finished: ${context.task.name} (${status}).`);
});

afterAll(() => {
  log('Test suite finished.');
});
