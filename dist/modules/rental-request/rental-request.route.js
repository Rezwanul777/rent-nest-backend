import { Router } from "express";
import { UserRole } from "../../generated/prisma/enums";
import authenticate from "../../middlewares/authentication";
import authorize from "../../middlewares/authorization";
import validateRequest from "../../middlewares/validateRequest";
import { rentalRequestController } from "./rental-request.controller";
import { submitRentalRequestSchema, updateRentalRequestStatusSchema, } from "./rental-request.validation";
const router = Router();
router.post("/", authenticate, authorize(UserRole.TENANT), validateRequest(submitRentalRequestSchema), rentalRequestController.submitRentalRequest);
router.get("/", authenticate, authorize(UserRole.ADMIN, UserRole.LANDLORD, UserRole.TENANT), rentalRequestController.getRentalRequests);
router.patch("/:id", authenticate, authorize(UserRole.LANDLORD), validateRequest(updateRentalRequestStatusSchema), rentalRequestController.updateRentalRequestStatus);
export const rentalRequestRoutes = router;
//# sourceMappingURL=rental-request.route.js.map