-- AlterTable
ALTER TABLE "rental_agreements" ADD COLUMN     "status" "RentalAgreementStatus" NOT NULL DEFAULT 'PENDING_PAYMENT';
