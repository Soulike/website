import {type ServerError} from '@schema/rpc';

/**
 * This Error type represents the access to model is denied by server.
 * Other types of errors, like network errors, are not covered by this type.
 */
export class ModelAccessDeniedError extends Error {
  public readonly serverError: ServerError;

  public constructor(serverError: ServerError) {
    super(serverError.code);
    this.name = 'ModelAccessDeniedError';
    this.serverError = serverError;
  }
}
