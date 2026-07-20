class AppError extends Error {
    statusCode;
    errorDetails;
    constructor(statusCode, message, errorDetails) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        this.errorDetails = errorDetails;
        Error.captureStackTrace?.(this, this.constructor);
    }
}
export default AppError;
//# sourceMappingURL=AppError.js.map