export enum ViewModelErrorType {
  /** @description Validation failed, e.g., empty input when submitting. */
  VALIDATION_ERROR = 'validation-error',
  /** @description Network request failed. */
  NETWORK_ERROR = 'network-error',
  /** @description Error from model. */
  MODEL_ERROR = 'model-error',
}

/**
 * The error used by view models, following standard JavaScript error pattern,
 * wraps the underlying error into `cause` field.
 */
export abstract class ViewModelError extends Error {
  public readonly type: ViewModelErrorType;
  /** Message for view to show, like a notification. */
  public readonly messageForView: string;

  protected constructor(
    type: ViewModelErrorType,
    messageForView: string,
    cause?: Error,
  ) {
    super('View model error', {cause});
    this.type = type;
    this.messageForView = messageForView;
  }

  public printUnderlyingError(): void {
    console.error(this.cause);
  }
}

export class ViewModelValidationError extends ViewModelError {
  constructor(messageForView: string) {
    super(ViewModelErrorType.VALIDATION_ERROR, messageForView);
  }
}

export class ViewModelNetworkError extends ViewModelError {
  constructor(messageForView: string, cause: Error) {
    super(ViewModelErrorType.NETWORK_ERROR, messageForView, cause);
  }
}

export class ViewModelModelError extends ViewModelError {
  constructor(messageForView: string, cause: Error) {
    super(ViewModelErrorType.MODEL_ERROR, messageForView, cause);
  }
}
