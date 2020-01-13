exports.throwError = (code, message, errors) => {
  const error = new Error(message);
  error.code = code || 500;
  if (errors) {
    error.message = errors;
  }
  throw error;
};
