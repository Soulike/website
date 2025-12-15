import signale from 'signale';

export const SERVER = {
  PORT: 4000,
  USERNAME: 'Soulike',
  PASSWORD: 'Soulike@Database',

  SUCCESS_LOGGER: signale.success,
  WARN_LOGGER: signale.warn,
  ERROR_LOGGER: signale.error,
};
