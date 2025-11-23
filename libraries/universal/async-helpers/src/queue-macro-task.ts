export const queueMacroTask: typeof queueMicrotask = (handler) => {
  setTimeout(handler, 0);
};
