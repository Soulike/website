export class SuccessfulServerResponse<TBody> {
  public readonly isSuccessful: true;
  public readonly data: TBody;

  constructor(data: TBody) {
    this.isSuccessful = true;
    this.data = data;
  }
}

export class FailServerResponse {
  public readonly isSuccessful: false;
  public readonly message: string;

  constructor(message: string) {
    this.isSuccessful = false;
    this.message = message;
  }
}

export type ServerResponse<TBody> =
  | SuccessfulServerResponse<TBody>
  | FailServerResponse;
