import { PaymentProvider, PaymentStatus } from "../../generated/prisma/enums";

export interface CreateCheckoutSessionResponse {
  checkoutUrl: string | null;
}

export type GetPaymentsQuery = {
  page?: string;
  limit?: string;
  sortBy?: "createdAt" | "paidAt";
  sortOrder?: "asc" | "desc";
  status?: PaymentStatus;
  provider?: PaymentProvider;
};