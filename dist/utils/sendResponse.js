const sendResponse = (res, response) => {
    const { statusCode, ...responseBody } = response;
    return res.status(statusCode).json(responseBody);
};
export default sendResponse;
//# sourceMappingURL=sendResponse.js.map