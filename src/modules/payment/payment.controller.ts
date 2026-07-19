import status from "http-status";
import { UserRole } from "../../generated/prisma/enums";

import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { Scope } from "./payment.query";
import { paymentService } from "./payment.service";
import { AuthenticatedUser } from "../../types/AuthenticatedUser";

const getPayments = catchAsync(async (req, res) => {
  const scope = getPaymentScope(req.user!);
  const { meta, payments } = await paymentService.listPayments(
    req.query,
    scope,
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Payments retrieved successfully",
    
    data:{meta, payments},
  });
});

const getPaymentById = catchAsync(async (req, res) => {
  const scope = getPaymentScope(req.user!);

  const payment = await paymentService.getPaymentById(
    req.params.paymentId as string,
    scope,
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Payment retrieved successfully",
    data: payment,
  });
});

const handleStripeWebhook = catchAsync(async (req, res) => {
  await paymentService.handleStripeWebhook(
    req.body,
    req.headers["stripe-signature"] as string,
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Webhook received",
  });
});

const createCheckoutSession = catchAsync(async (req, res) => {
  const checkoutSession = await paymentService.createCheckoutSession(
    req.user?. id as string,
    req.user?. email as string,
    req.params.agreementId as string,
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Checkout session created successfully",
    data: checkoutSession,
  });
});

const successPayment = catchAsync(async (req, res) => {
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Payment Successful",
  });
});

function getPaymentScope(user: AuthenticatedUser): Scope {
  switch (user.role) {
    case UserRole.TENANT:
      return {
        type: "TENANT",
        tenantId: user.id,
      };

    case UserRole.LANDLORD:
      return {
        type: "LANDLORD",
        landlordId: user.id,
      };

    case UserRole.ADMIN:
      return {
        type: "ADMIN",
      };
  }
}

export const paymentController = {
  createCheckoutSession,
  handleStripeWebhook,
  getPayments,
  getPaymentById,
  successPayment,
};