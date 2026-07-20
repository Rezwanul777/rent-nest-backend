import { Router } from "express";
import authenticate from "../../middlewares/authentication";
import validateRequest from "../../middlewares/validateRequest";
import { authController } from "./auth.controller";
import { loginSchema, registerSchema } from "./auth.validation";
const router = Router();
router.post("/register", validateRequest(registerSchema), authController.register);
router.post("/login", validateRequest(loginSchema), authController.loginUser);
router.get("/me", authenticate, authController.getMe);
router.post("/logout", authenticate, authController.logout);
router.post("/refresh-token", authController.refreshToken);
export const authRoutes = router;
//# sourceMappingURL=auth.route.js.map