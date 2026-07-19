export interface CreateCheckoutSessionPayload {
  paymentId: string;
  rentalAgreementId: string;
  rentalRequestId: string;
  tenantId: string;
  email: string;

  amount: number;
  currency: string;

  propertyTitle: string;
}