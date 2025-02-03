class ErrorHandler extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
    }
}
export const errorMiddleware = (error, req, res, next) => {
    error.message = error.message || 'An unexpected error occurred. Please try again.';
    error.statusCode = error.statusCode || 500;
    console.error('Error Middleware:', error.message);
    return res.status(error.statusCode).json({
        success: false,
        message: error.message,
    });
};
export default ErrorHandler;