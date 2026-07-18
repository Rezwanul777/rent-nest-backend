import { Router } from "express";
import { UserRole } from "../../generated/prisma/enums";
import authenticate from "../../middlewares/authentication";
import authorize from "../../middlewares/authorization";
import validateRequest from "../../middlewares/validateRequest";
import { rentalAgreementcontroller } from "./rental-agreement.controller";
import { updateRentalAgreementStatusSchema } from "./rental-agreement.validation";

const router = Router();

router.get(
  "/",
  authenticate,
  authorize(UserRole.LANDLORD, UserRole.TENANT, UserRole.ADMIN),
  rentalAgreementcontroller.getRentalAgreements,
);

router.patch(
  "/:agreementId/update",
  authenticate,
  authorize(UserRole.TENANT),
  validateRequest(updateRentalAgreementStatusSchema),
  rentalAgreementcontroller.updateRentalAgreementStatus,
);

export const rentalAgreementRoutes = router;