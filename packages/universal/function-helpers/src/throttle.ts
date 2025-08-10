export type ThrottleCallback<ParamsT extends unknown[], ReturnT = void> = (
  ...args: ParamsT
) => ReturnT;

export function throttle<ParamsT extends unknown[], ReturnT>(
  delay: number,
  callback: ThrottleCallback<ParamsT, ReturnT>,
  parameters: ParamsT,
): ThrottleCallback<[], ReturnT> {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastReturnValue: ReturnT;
  return () => {
    if (timeoutId !== null) {
      return lastReturnValue;
    }
    lastReturnValue = callback(...parameters);

    timeoutId = setTimeout(() => {
      timeoutId = null;
    }, delay);
    return lastReturnValue;
  };
}
