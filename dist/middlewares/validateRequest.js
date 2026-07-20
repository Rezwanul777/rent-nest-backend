const validateRequest = (schema) => (req, _res, next) => {
    try {
        req.body = schema.parse(req.body);
        next();
    }
    catch (error) {
        next(error);
    }
};
export default validateRequest;
//# sourceMappingURL=validateRequest.js.map