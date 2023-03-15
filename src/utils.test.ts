import { getResult, getReason } from "./result";
import { createStack } from "./utils";

test("can create an empty stack", () => {
  const stack = createStack([]);

  const actual = stack.getItems();

  const expected = [];

  expect(actual).toEqual(expected);
});

test("can push an element to an empty stack", () => {
  //GIVEN
  const stack = createStack([]);

  //WHEN
  const nextStack = stack.push(1);
  const actual = nextStack.getItems();

  // THEN
  expect(actual).toEqual([1]);
  expect(stack.getItems()).toEqual([]);
});

test("can pop an element of a stack", () => {
  //GIVEN
  const stack = createStack([1, 2]);

  //WHEN
  const { stack: nextStack, values } = getResult(stack.pop());

  // THEN
  expect(values[0]).toEqual(2);
  expect(stack.getItems()).toEqual([1, 2]);
  expect(nextStack.getItems()).toEqual([1]);
});

test("can pop two elements of a stack", () => {
  //GIVEN
  const stack = createStack([1, 2, 3]);

  //WHEN
  const { stack: nextStack, values } = getResult(stack.pop2());

  // THEN
  expect(values).toEqual([2, 3]);
  expect(nextStack.getItems()).toEqual([1]);
  expect(stack.getItems()).toEqual([1, 2, 3]);
});

test("when popping an empty stack, returns same stack and value is undefined", () => {
  //GIVEN
  const stack = createStack([]);

  //WHEN
  const reason = getReason(stack.pop());

  // THEN
  expect(reason).toEqual("Not enough elements to pop.");
});
