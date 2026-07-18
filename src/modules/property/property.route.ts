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

const router = Router();

router.post(
  "/",
  authenticate,
  authorize(UserRole.LANDLORD),
  validateRequest(createPropertySchema),
  propertyController.createProperty,
);




export const propertyRoutes = router;