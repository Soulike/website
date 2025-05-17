export function createTaskHandlingError(cause: unknown) {
  return new Error('Error when handling task.', {cause});
}
