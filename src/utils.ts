import { createError, createSuccess, Result } from "./result";

export type Stack<T> = {
  push: (element: T) => Stack<T>;
  pop: () => Result<{
    stack: Stack<T>;
    values: [T];
  }>;
  pop2: () => Result<{
    stack: Stack<T>;
    values: [T, T];
  }>;
  getItems: () => T[];
};

const NOT_ENOUGH_ELEMENTS_TO_POP = "Not enough elements to pop.";

export const createStack = <T>(items: T[]): Stack<T> => {
  return {
    push: (element: T) => createStack([...items, element]),
    getItems: () => items,
    pop: () => {
      const nextItems = [...items];

      if (nextItems.length === 0) {
        return createError(NOT_ENOUGH_ELEMENTS_TO_POP);
      }

      const value = nextItems.pop();

      return createSuccess({
        values: [value],
        stack: createStack(nextItems),
      });
    },
    pop2: () => {
      return createStack(items)
        .pop()
        .map(({ stack: intermediateStack, values: [secondValue] }) => {
          return intermediateStack.pop().map(({ stack: finalStack, values: [firstValue] }) => {
            return createSuccess({
              values: [firstValue, secondValue],
              stack: finalStack,
            });
          });
        });
    },
  };
};
