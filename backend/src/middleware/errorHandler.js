// Centralized error handling middleware

const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  const errorCode = err.code || 'INTERNAL_ERROR';

  console.error(`[${new Date().toISOString()}] Error: ${errorCode}`, {
    status,
    message,
    path: req.path,
    method: req.method,
    tenant_id: req.user?.tenant_id,
    user_id: req.user?.id
  });

  res.status(status).json({
    success: false,
    error: {
      code: errorCode,
      message: message
    }
  });
};

class AppError extends Error {
  constructor(message, status = 500, code = 'APP_ERROR') {
    super(message);
    this.status = status;
    this.code = code;
  }
}

module.exports = { errorHandler, AppError };
