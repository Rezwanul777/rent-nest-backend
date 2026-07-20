const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
export const getPagination = (page, limit) => {
    const currentPage = Math.max(1, page || 1);
    const currentLimit = Math.max(1, limit || 10);
    const skip = (currentPage - 1) * currentLimit;
    return { page: currentPage, limit: currentLimit, skip };
};
//# sourceMappingURL=pagination.js.map