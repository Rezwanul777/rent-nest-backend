import { Router } from "express";
import { UserRole } from "../../generated/prisma/enums";
import authenticate from "../../middlewares/authentication";
import authorize from "../../middlewares/authorization";
import validateRequest from "../../middlewares/validateRequest";
import { reviewController } from "./review.controller";
import { createReviewSchema } from "./review.validate";
const router = Router();
router.post("/:rentalAgreementId", authenticate, authorize(UserRole.TENANT), validateRequest(createReviewSchema), reviewController.createReview);
router.get("/:propertyId", authenticate, authorize(UserRole.LANDLORD), reviewController.getReviewsByPropertyId);
export const reviewRoutes = router;
//# sourceMappingURL=review.route.js.map