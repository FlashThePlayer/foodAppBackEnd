exports.throwError = (code, originalError) => {
  const error = new Error(JSON.stringify(originalError));
  error.code = code || 500;
  throw error;
};
