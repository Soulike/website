export const queueMacroTask: typeof queueMicrotask = (handler) => {
  setTimeout(handler);
};
