import { createError, createSuccess, Result } from "./result";
import { createStack, Stack as GenericStack } from "./utils";

const BINARY_OPERATORS = ["+", "-", "*", "/"] as const;
const UNARY_OPERATORS = ["NEGATE", "ABS"] as const;

type BinaryOperator = typeof BINARY_OPERATORS[number];
type UnaryOperator = typeof UNARY_OPERATORS[number];

type Operand = number;

type RpnToken = Operand | BinaryOperator | UnaryOperator;

export type RpnExpression = RpnToken[];

type RpnResult = Result<number>;

type Stack = GenericStack<Operand>;

const mapBinaryOperatorToFunction: Record<BinaryOperator, (a: Operand, b: Operand) => Result<number>> = {
  "+": (a, b) => createSuccess(a + b),
  "-": (a, b) => createSuccess(a - b),
  "*": (a, b) => createSuccess(a * b),
  "/": (a, b) => {
    if (b === 0) {
      return createError("Cannot divide by 0.");
    }

    return createSuccess(a / b);
  },
};

const mapUnaryOperatorsToFunction: Record<UnaryOperator, (a: Operand) => number> = {
  NEGATE: (a) => -1 * a,
  ABS: (a) => Math.abs(a),
};

const isOperand = (token: RpnToken): token is Operand => {
  return typeof token === "number";
};

const isBinaryOperator = (token: RpnToken): token is BinaryOperator => {
  return BINARY_OPERATORS.includes(token as BinaryOperator);
};

const isUnaryOperator = (token: RpnToken): token is UnaryOperator => {
  return UNARY_OPERATORS.includes(token as UnaryOperator);
};

const computeNextOperandStack = (currentStack: Stack, currentToken: BinaryOperator | UnaryOperator): Result<Stack> => {
  if (isUnaryOperator(currentToken)) {
    return currentStack
      .pop()
      .map(({ stack: remainingOperandStack, values: [firstOperand] }) =>
        createSuccess(
          createStack([...remainingOperandStack.getItems(), mapUnaryOperatorsToFunction[currentToken](firstOperand)])
        )
      );
  }

  if (isBinaryOperator(currentToken)) {
    return currentStack
      .pop2()
      .map(({ stack: remainingOperandStack, values: [firstOperand, secondOperand] }) =>
        mapBinaryOperatorToFunction[currentToken](firstOperand, secondOperand).map((result) =>
          createSuccess(createStack([...remainingOperandStack.getItems(), result]))
        )
      );
  }
};

const evaluateRpnExpressionInternal =
  (operandStack: Stack) =>
  (rpnExpression: RpnExpression): RpnResult => {
    if (rpnExpression.length === 0) {
      const tokensLeft = operandStack.getItems();

      if (tokensLeft.length > 1) {
        return createError("Invalid RPN sequence: too many operands.");
      }

      return createSuccess(tokensLeft[0]);
    }

    const [firstToken, ...remainingRpnExpression] = rpnExpression;

    if (isOperand(firstToken)) {
      return evaluateRpnExpressionInternal(createStack([...operandStack.getItems(), firstToken]))(
        remainingRpnExpression
      );
    }

    return computeNextOperandStack(operandStack, firstToken).map((result) =>
      evaluateRpnExpressionInternal(result)(remainingRpnExpression)
    );
  };

export const evaluateRpnExpression = (rpnExpression: RpnExpression) =>
  evaluateRpnExpressionInternal(createStack<Operand>([]))(rpnExpression);
