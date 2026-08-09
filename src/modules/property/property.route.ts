import { Router } from "express";
import { UserRole } from "../../generated/prisma/enums";
import authenticate from "../../middlewares/authentication";
import authorize from "../../middlewares/authorization";

import validateRequest from "../../middlewares/validateRequest";

import {
  createPropertySchema,
  updatePropertySchema,
} from "./property.validation";
import { propertyController } from "./property.controller";
import { adminController } from "../admin/admin.controller";
import { adminPropertyAvailabilitySchema } from "../admin/admin.validation";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize(UserRole.LANDLORD),
  validateRequest(createPropertySchema),
  propertyController.createProperty,
);

router.patch(
  "/:propertyId",
  authenticate,
  authorize(UserRole.LANDLORD),
  validateRequest(updatePropertySchema),
  propertyController.updateProperty,
);

router.get(
  "/me/:propertyId",
  authenticate,
  authorize(UserRole.LANDLORD),
  propertyController.getMyPropertyById,
);

router.patch(
  "/:propertyId/availability",
  authenticate,
  authorize(UserRole.LANDLORD),
  propertyController.updatePropertyAvailability,
);

router.get("/",  propertyController.getProperties);

router.get(
  "/me",
  authenticate,
  authorize(UserRole.LANDLORD),
  propertyController.getMyProperties,
);

router.get("/:propertyId", propertyController.getPropertyById);
router.patch(
  "/properties/:propertyId/availability",
  authenticate,
  authorize(UserRole.ADMIN),
  validateRequest(adminPropertyAvailabilitySchema),
  adminController.updatePropertyAvailability,
);

router.delete(
  "/:propertyId",
  authenticate,
  authorize(UserRole.LANDLORD),
  propertyController.deleteProperty,
);






export const propertyRoutes = router;
