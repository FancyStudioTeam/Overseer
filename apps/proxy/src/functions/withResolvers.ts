/**
 * Creates a promise with its resolve and reject functions.
 * @returns An object containing a promise with its resolve and reject functions.
 */
export const withResolvers = <Value>(): WithResolvers<Value> => {
  let rejectFunction!: (reason?: unknown) => void;
  let resolveFunction!: (data: Value | PromiseLike<Value>) => void;
  const promise = new Promise<Value>((resolve, reject) => {
    rejectFunction = reject;
    resolveFunction = resolve;
  });

  return {
    promise,
    reject: rejectFunction,
    resolve: resolveFunction,
  };
};

export interface WithResolvers<Value> {
  /** The original promise. */
  promise: Promise<Value>;
  /** The promise reject function. */
  reject: (reason?: unknown) => void;
  /** The promise resolve function. */
  resolve: (data: Value | PromiseLike<Value>) => void;
}
