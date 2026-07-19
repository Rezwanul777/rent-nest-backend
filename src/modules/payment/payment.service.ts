import status from "http-status";
import Stripe from "stripe";

import { Prisma } from "../../generated/prisma/client";
import {
  PaymentStatus,
  RentalAgreementStatus,
} from "../../generated/prisma/enums";
import { PaymentWhereInput } from "../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

import AppError from "../../utils/AppError";
import { GetPaymentsQuery } from "./payment.interface";
import {
  buildPaymentFilter,
  buildPaymentSorting,
  Scope,
} from "./payment.query";
import { getPagination } from "../../utils/pagination";
import config from "../../config";
import { stripeService } from "../../lib/stripe/stripe.service";
import { stripe } from "../../lib/stripe/stripe";



const listPayments = async (query: GetPaymentsQuery, scope: Scope) => {
  const dataLimit = Number(query.limit);
  const currentPage = Number(query.page);

  const { limit, page, skip } = getPagination(currentPage, dataLimit);

  const andCondition = buildPaymentFilter(query, scope);
  const { sortBy, sortOrder } = buildPaymentSorting(query);

  const payments = await prisma.payment.findMany({
    where: {
      AND: andCondition,
    },
    omit: {
      checkoutUrl: true,
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
    take: limit,
    skip,
  });

  const totalPayments = await prisma.payment.count({
    where: {
      AND: andCondition,
    },
  });

  return {
    meta: {
      page,
      limit,
      total: totalPayments,
      totalPages: Math.ceil(totalPayments / limit),
    },
    payments,
  };
};

const getPaymentById = async (paymentId: string, scope: Scope) => {
  const andCondition: PaymentWhereInput[] = [];

  switch (scope.type) {
    case "TENANT":
      andCondition.push({
        rentalAgreement: {
          tenantId: scope.tenantId,
        },
      });
      break;

    case "LANDLORD":
      andCondition.push({
        rentalAgreement: {
          property: {
            landlordId: scope.landlordId,
          },
        },
      });
      break;
  }

  const payment = await prisma.payment.findFirst({
    where: {
      id: paymentId,
      AND: andCondition,
    },
    omit: {
      checkoutUrl: true,
    },
  });

  if (!payment) {
    throw new AppError(status.NOT_FOUND, "Payment not found");
  }

  return payment;
};



const handleStripeWebhook = async (payload: Buffer, signature: string) => {
  let event: Stripe.Event;
const endpointSecret = config.stripe_webhook_secret;
  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      endpointSecret,
    );
  } catch (error) {
    throw new AppError(
      status.BAD_REQUEST,
      "⚠️ Webhook signature verification failed.",
    );
  }

  const existingEvent = await prisma.stripeWebhookEvent.findUnique({
    where: {
      stripeEventId: event.id,
    },
  });

  if (existingEvent?.processedAt) {
    return;
  }

  await prisma.$transaction(async (tx) => {
    const webhookEvent = await tx.stripeWebhookEvent.create({
      data: {
        stripeEventId: event.id,
        type: event.type,
      },
    });

    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(tx, event.data.object);
        break;
      default:
        console.log(`Unhandled event: ${event.type}`);
    }

    await tx.stripeWebhookEvent.update({
      where: {
        id: webhookEvent.id,
      },
      data: {
        processedAt: new Date(),
      },
    });
  });
};

const createCheckoutSession = async (
  tenantId: string,
  userEmail: string,
  rentalAgreementId: string,
) => {
  const rentalAgreement = await prisma.rentalAgreement.findFirst({
    where: {
      id: rentalAgreementId,
      tenantId,
    },
    include: {
      property: {
        select: {
          title: true,
        },
      },
    },
  });

  if (!rentalAgreement) {
    throw new AppError(status.NOT_FOUND, "Rental agreement not found");
  }

  if (rentalAgreement.status !== RentalAgreementStatus.PENDING_PAYMENT) {
    throw new AppError(
      status.BAD_REQUEST,
      "Payment is not available for this agreement",
    );
  }

  const payment = await prisma.$transaction(async (tx) => {
    const existingPayment = await tx.payment.findFirst({
      where: {
        rentalAgreementId,
        status: {
          in: [PaymentStatus.PENDING, PaymentStatus.PROCESSING],
        },
      },
    });

    if (existingPayment) {
      throw new AppError(
        status.CONFLICT,
        "A payment is already pending for this agreement",
      );
    }
    return tx.payment.create({
      data: {
        rentalAgreementId,
        amount: rentalAgreement.monthlyRent,
        currency: "bdt",
      },
    });
  });

  // const checkoutSession = await stripeService.createCheckoutSession({
  //   paymentId: payment.id,
  //   rentalAgreementId,
  //   rentalRequestId: rentalAgreement.rentalRequestId,
  //   tenantId,
  //   email: userEmail,
  //   currency: payment.currency,
  //   amount: Math.round(Number(payment.amount)),
  //   propertyTitle: rentalAgreement.property.title,
  // });
  
const checkoutSession =
  await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: userEmail,

    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: payment.currency.toLowerCase(),

          unit_amount: Math.round(
            Number(payment.amount) * 100,
          ),

          product_data: {
            name: rentalAgreement.property.title,
          },
        },
      },
    ],

    success_url:
      `${config.app_url}/payment/success` +
      "?session_id={CHECKOUT_SESSION_ID}",

    cancel_url: `${config.app_url}/payment/cancel`,

    metadata: {
      paymentId: payment.id,
      rentalAgreementId,
      rentalRequestId:
        rentalAgreement.rentalRequestId,
      tenantId,
    },
  });
  await prisma.payment.update({
    where: {
      id: payment.id,
    },
    data: {
      stripeSessionId: checkoutSession.id,
      checkoutUrl: checkoutSession.url,
    },
  });

  return {
    checkoutUrl: checkoutSession.url,
  };
};

const handleCheckoutCompleted = async (
  tx: Prisma.TransactionClient,
  session: Stripe.Checkout.Session,
) => {
  const paymentId = session.metadata?.paymentId;

  if (!paymentId) {
    throw new AppError(
      status.BAD_REQUEST,
      "Payment ID missing from Stripe metadata",
    );
  }

  const payment = await tx.payment.findUnique({
    where: {
      id: paymentId,
    },
  });

  if (!payment) {
    throw new AppError(status.NOT_FOUND, "Payment not found");
  }

  if (payment.status === "PAID") {
    return;
  }

  const paidAt = new Date();

  await tx.payment.update({
    where: {
      id: paymentId,
    },
    data: {
      status: "PAID",
      paidAt,
      stripePaymentIntentId: session.payment_intent as string,
    },
  });

  await tx.rentalAgreement.update({
    where: {
      id: payment.rentalAgreementId,
    },
    data: {
      status: "ACTIVE",
      activatedAt: paidAt,
    },
  });
};

export const paymentService = {
  createCheckoutSession,
  handleStripeWebhook,
  listPayments,
  getPaymentById,
};