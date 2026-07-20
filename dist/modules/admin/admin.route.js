import { Router } from "express";
import { UserRole } from "../../generated/prisma/enums";
import authenticate from "../../middlewares/authentication";
import authorize from "../../middlewares/authorization";
import validateRequest from "../../middlewares/validateRequest";
import { adminController } from "./admin.controller";
import { updateUserStatusSchema } from "./admin.validation";
const router = Router();
router.get("/users", authenticate, authorize(UserRole.ADMIN), adminController.getAllUsers);
router.patch("/users/:userId", authenticate, authorize(UserRole.ADMIN), validateRequest(updateUserStatusSchema), adminController.updateUserStatus);
export const adminRoutes = router;
//# sourceMappingURL=admin.route.js.map