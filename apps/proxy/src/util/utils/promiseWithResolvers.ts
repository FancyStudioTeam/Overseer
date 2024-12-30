export const promiseWithResolvers = <T>(): PromiseWithResolvers<T> => {
  let resolve!: (data: T | PromiseLike<T>) => void;
  // biome-ignore lint/suspicious/noExplicitAny:
  let reject!: (reason?: any) => void;
  const promise = new Promise<T>((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });

  return {
    promise,
    reject,
    resolve,
  };
};

export interface PromiseWithResolvers<T> {
  promise: Promise<T>;
  // biome-ignore lint/suspicious/noExplicitAny:
  reject: (reason?: any) => void;
  resolve: (data: T | PromiseLike<T>) => void;
}
