import customError from "../types/CustomError";

const throwError = (code: number, originalError: unknown) => {
  const error = new Error(JSON.stringify(originalError)) as customError;
  error.code = code || 500;
  throw error;
};

export default throwError;
