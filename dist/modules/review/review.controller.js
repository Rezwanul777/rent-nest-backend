import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { reviewService } from "./review.service";
const createReview = catchAsync(async (req, res) => {
    const review = await reviewService.createReview(req.user?.id, req.params.rentalAgreementId, req.body);
    sendResponse(res, {
        statusCode: status.CREATED,
        success: true,
        message: "Review submitted successfully",
        data: review,
    });
});
const getReviewsByPropertyId = catchAsync(async (req, res) => {
    const { meta, reviews } = await reviewService.getReviewsByPropertyId(req.user?.id, req.params.propertyId, req.query);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Reviews retrieved successfully",
        data: { meta, reviews },
    });
});
export const reviewController = {
    createReview,
    getReviewsByPropertyId,
};
//# sourceMappingURL=review.controller.js.map