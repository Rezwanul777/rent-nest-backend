import { Router } from "express";
import { UserRole } from "../../generated/prisma/enums";
import authenticate from "../../middlewares/authentication";
import authorize from "../../middlewares/authorization";
import { paymentController } from "./payment.controller";
const router = Router();
router.post("/webhook", paymentController.handleStripeWebhook);
router.get("/success", paymentController.successPayment);
router.post("/rental-agreements/:agreementId/checkout", authenticate, authorize(UserRole.TENANT), paymentController.createCheckoutSession);
router.get("/", authenticate, authorize(UserRole.TENANT, UserRole.LANDLORD, UserRole.ADMIN), paymentController.getPayments);
router.get("/:paymentId", authenticate, authorize(UserRole.TENANT, UserRole.LANDLORD, UserRole.ADMIN), paymentController.getPaymentById);
export const paymentRoutes = router;
//# sourceMappingURL=payment.route.js.map