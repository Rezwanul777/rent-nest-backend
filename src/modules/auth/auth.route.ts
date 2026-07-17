import { Router } from "express";
import authenticate from "../../middlewares/authentication";
import validateRequest from "../../middlewares/validateRequest";
import { authController } from "./auth.controller";
import { loginSchema, registerSchema } from "./auth.validation";

const router = Router();

router.post(
  "/register",
  validateRequest(registerSchema),
  authController.register,
);



export const authRoutes = router;