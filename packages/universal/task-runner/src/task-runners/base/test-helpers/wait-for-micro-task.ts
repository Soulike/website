export async function waitForMicroTask() {
  return new Promise<void>((resolve) => {
    queueMicrotask(() => {
      queueMicrotask(() => {
        resolve();
      });
    });
  });
}
