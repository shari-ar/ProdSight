import { describe, expect, it, vi } from 'vitest';
import { logger } from '../../utils/logger';

describe('logger', () => {
  it('routes debug logs to console.debug with prefix', () => {
    const spy = vi.spyOn(console, 'debug').mockImplementation(() => undefined);

    logger.debug('Test message', { payload: true });

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0]).toBe('[ProdSight] Test message');
    expect(spy.mock.calls[0][1]).toEqual({ message: 'Test message', payload: true });
  });

  it('routes errors to console.error', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    logger.error('Boom');

    expect(spy).toHaveBeenCalledWith('[ProdSight] Boom', { message: 'Boom' });
  });
});
