const success = (res, data = {}, statusCode = 200, message = 'Success') => {
  return res.status(statusCode).json({ status: 'success', message, data });
};

const error = (res, message = 'An error occurred', statusCode = 400) => {
  return res.status(statusCode).json({ status: 'error', message });
};

module.exports = { success, error };
