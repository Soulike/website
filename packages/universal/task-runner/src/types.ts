interface TaskSuccessResult<T> {
  error: null;
  result: T;
}

interface TaskFailureResult {
  error: Error;
  result: null;
}

interface TaskCancelResult {
  error: null;
  result: null;
}

export type TaskResult<T> =
  | TaskSuccessResult<T>
  | TaskFailureResult
  | TaskCancelResult;
