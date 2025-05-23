import signale from 'signale';

export class Logger {
  public static info(log: string) {
    signale.info(log);
  }

  public static warning(log: string) {
    signale.warn(log);
  }

  public static error(log: string) {
    signale.error(log);
  }

  public static success(log: string) {
    signale.success(log);
  }

  public static dispatcherError(
    path: string,
    httpMethod: string,
    error: unknown,
  ) {
    const errorWrapper = new Error(`Error when ${httpMethod} ${path}`, {
      cause: error,
    });
    signale.error(errorWrapper.stack);
  }
}
