import { evaluateRpnExpression, RpnExpression } from ".";
import { getReason, getResult } from "./result";

test("Can perform a basic addition", () => {
  const rpnExpression: RpnExpression = [3, 4, "+"];

  const actual = getResult(evaluateRpnExpression(rpnExpression));

  const expected = 7;

  expect(actual).toEqual(expected);
});

test("Can perform a basic substraction", () => {
  const rpnExpression: RpnExpression = [3, 4, "-"];

  const actual = getResult(evaluateRpnExpression(rpnExpression));

  const expected = -1;

  expect(actual).toEqual(expected);
});

test("Can perform a basic multiplication", () => {
  const rpnExpression: RpnExpression = [3, 4, "*"];

  const actual = getResult(evaluateRpnExpression(rpnExpression));

  const expected = 12;

  expect(actual).toEqual(expected);
});

test("Can perform a basic division", () => {
  const rpnExpression: RpnExpression = [3, 4, "/"];

  const actual = getResult(evaluateRpnExpression(rpnExpression));

  const expected = 0.75;

  expect(actual).toEqual(expected);
});

test("Can add multiple numbers", () => {
  const rpnExpression: RpnExpression = [3, 4, 5, "+", "+"];

  const actual = getResult(evaluateRpnExpression(rpnExpression));

  const expected = 12;

  expect(actual).toEqual(expected);
});

test("Can add multiple numbers - control", () => {
  const rpnExpression: RpnExpression = [3, 4, 5, 1, 3, "+", "+", "+", "+"];

  const actual = getResult(evaluateRpnExpression(rpnExpression));

  const expected = 16;

  expect(actual).toEqual(expected);
});

test("Can perform addition and subtraction", () => {
  const rpnExpression: RpnExpression = [3, 4, "-", 5, "+"];

  const actual = getResult(evaluateRpnExpression(rpnExpression));

  const expected = 4;

  expect(actual).toEqual(expected);
});

describe("Can perform operation with unary operators", () => {
  test("Can perform NEGATE operator", () => {
    const rpnExpression: RpnExpression = [3, "NEGATE"];

    const actual = getResult(evaluateRpnExpression(rpnExpression));

    const expected = -3;

    expect(actual).toEqual(expected);
  });

  test("Can perform ABS operator", () => {
    const rpnExpression: RpnExpression = [-3, "ABS"];

    const actual = getResult(evaluateRpnExpression(rpnExpression));

    const expected = 3;

    expect(actual).toEqual(expected);
  });

  test("Can perform unary operator in complete RPN sequence", () => {
    const rpnExpression: RpnExpression = [-3, "ABS", 4, "+"];

    const actual = getResult(evaluateRpnExpression(rpnExpression));

    const expected = 7;

    expect(actual).toEqual(expected);
  });
});

describe("Inform user when RPN expression is invalid", () => {
  test("When the ratio of operators / operands is invalid", () => {
    const invalidRpnExpression: RpnExpression = [1, 2, 3, "+"];

    const actualReason = getReason(evaluateRpnExpression(invalidRpnExpression));

    const expectedReason = "Invalid RPN sequence: too many operands.";

    expect(expectedReason).toEqual(actualReason);
  });

  test("When there is a division by 0", () => {
    const invalidRpnExpression: RpnExpression = [1, 0, "/"];

    const actualReason = getReason(evaluateRpnExpression(invalidRpnExpression));

    const expectedReason = "Cannot divide by 0.";

    expect(expectedReason).toEqual(actualReason);
  });
});
