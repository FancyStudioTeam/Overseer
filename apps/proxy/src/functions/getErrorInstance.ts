/**
 * Gets or creates an error instance from an exception.
 * @param exception - The exception to get the error instance.
 * @returns The existing or created error instance.
 */
export const getErrorInstance = (exception: unknown): Error => {
  if (exception instanceof Error) {
    return exception;
  }

  /** Since "Error" constructor does not accept "unknown" as a parameter type, cast it as a string. */
  const error = new Error(String(exception));

  return error;
};
