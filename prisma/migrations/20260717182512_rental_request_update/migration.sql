-- CreateEnum
CREATE TYPE "RentalRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "RentalStatus" AS ENUM ('NOT_STARTED', 'ACTIVE', 'COMPLETED', 'TERMINATED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PROCESSING', 'PAID', 'FAILED', 'REFUNDED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "RentalAgreementStatus" AS ENUM ('PENDING_PAYMENT', 'ACTIVE', 'COMPLETED', 'TERMINATED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('STRIPE');

-- AlterTable
ALTER TABLE "rental_requests" ADD COLUMN     "status" "RentalRequestStatus" NOT NULL DEFAULT 'PENDING';

-- CreateIndex
CREATE INDEX "rental_requests_status_idx" ON "rental_requests"("status");
