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
}
