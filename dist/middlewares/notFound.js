import httpStatus from "http-status";
import sendResponse from "../utils/sendResponse";
const notFound = (req, res) => sendResponse(res, {
    statusCode: httpStatus.NOT_FOUND,
    success: false,
    message: "Route not found",
    errorDetails: [{ message: `${req.method} ${req.originalUrl} does not exist` }],
});
export default notFound;
//# sourceMappingURL=notFound.js.map