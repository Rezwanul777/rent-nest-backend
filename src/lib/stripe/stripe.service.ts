import config from "../../config";
import { stripe } from "./stripe";
import { CreateCheckoutSessionPayload } from "./stripe.interface";



type CheckoutResponse = {
  id: string;
  url: string | null;
};


const createCheckoutSession = async (payload: CreateCheckoutSessionPayload): Promise<CheckoutResponse> => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        quantity: 1,

        price_data: {
          currency: payload.currency,
          unit_amount: payload.amount * 100,
          product_data: {
            name: `${payload.propertyTitle} - Monthly Rent`,
          },
        },
      },
    ],

    mode: "payment",
    payment_method_types: ["card"],
    success_url: config.stripe_success_url,
    cancel_url: config.stripe_cancel_url,

    customer_email: payload.email,

    metadata: {
      paymentId: payload.paymentId,
      rentalAgreementId: payload.rentalAgreementId,
      rentalRequestId: payload.rentalRequestId,
      tenantId: payload.tenantId,
    },

    payment_intent_data: {
      metadata: {
        paymentId: payload.paymentId,
        rentalAgreementId: payload.rentalAgreementId,
      },
    },
  });

  return session;
};

export const stripeService = {
  createCheckoutSession,
};