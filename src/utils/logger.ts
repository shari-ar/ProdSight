type LogPayload = Record<string, unknown> | undefined;

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LOG_PREFIX = '[ProdSight]';

const writeLog = (level: LogLevel, message: string, payload?: LogPayload): void => {
  const entry = payload ? { message, ...payload } : { message };
  const output = `${LOG_PREFIX} ${message}`;

  switch (level) {
    case 'debug':
      console.debug(output, entry);
      break;
    case 'info':
      console.info(output, entry);
      break;
    case 'warn':
      console.warn(output, entry);
      break;
    case 'error':
      console.error(output, entry);
      break;
    default:
      console.log(output, entry);
  }
};

export const logger = {
  debug: (message: string, payload?: LogPayload): void => writeLog('debug', message, payload),
  info: (message: string, payload?: LogPayload): void => writeLog('info', message, payload),
  warn: (message: string, payload?: LogPayload): void => writeLog('warn', message, payload),
  error: (message: string, payload?: LogPayload): void => writeLog('error', message, payload),
};
