import { Router } from "express";
import { UserRole } from "../../generated/prisma/enums";
import authenticate from "../../middlewares/authentication";
import authorize from "../../middlewares/authorization";
import validateRequest from "../../middlewares/validateRequest";
import { createCategorySchema } from "./category.validate";
import { categoryController } from "./category.controller";


const router = Router();

router.post(
  "/",
  authenticate,
  authorize(UserRole.ADMIN),
  validateRequest(createCategorySchema),
  categoryController.createCategory
);



export const categoryRoutes = router;