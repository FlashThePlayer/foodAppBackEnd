exports.throwError = (code, message) => {
  const error = new Error(message);
  error.code = code || 500;
  throw error;
};
