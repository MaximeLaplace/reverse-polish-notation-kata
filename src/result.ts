type AbstractResult<Status extends string, T> = {
  status: Status;
  map: <U>(mappingFunction: (result: T) => Result<U>) => Result<U>;
};

type Success<T> = AbstractResult<"SUCCESS", T> & {
  result: T;
};

type Error<T> = AbstractResult<"ERROR", T> & {
  reason: string;
};

export type Result<T> = Success<T> | Error<T>;

export const createSuccess = <T>(result: T): Success<T> => ({
  status: "SUCCESS",
  result,
  map: (mappingFunction) => mappingFunction(result),
});

export const createError = <T>(reason: string): Error<T> => ({
  status: "ERROR",
  reason,
  map: () => createError(reason),
});

/*
 * Testing facilities
 */
export const getResult = <U>(result: Result<U>): U => {
  return (result as Success<U>).result;
};
export const getReason = <U>(result: Result<U>): string => {
  return (result as Error<U>).reason;
};
