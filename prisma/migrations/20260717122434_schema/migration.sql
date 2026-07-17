/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('TENANT', 'LANDLORD', 'ADMIN');

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "categories" (
    "id" UUID NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "slug" VARCHAR(150) NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "properties" (
    "id" UUID NOT NULL,
    "landlord_id" UUID NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT NOT NULL,
    "rent" DECIMAL(10,2) NOT NULL,
    "location" VARCHAR(100) NOT NULL,
    "is_available" BOOLEAN NOT NULL DEFAULT true,
    "amenities" TEXT[],
    "bedrooms" INTEGER,
    "bathrooms" INTEGER,
    "size" DECIMAL(10,2),
    "images" TEXT[],
    "category_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "properties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rental_agreements" (
    "id" UUID NOT NULL,
    "rental_request_id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "property_id" UUID NOT NULL,
    "monthly_rent" DECIMAL(10,2) NOT NULL,
    "duration_in_months" INTEGER NOT NULL,
    "lease_start_date" DATE NOT NULL,
    "lease_end_date" DATE NOT NULL,
    "activated_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "rental_agreements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rental_requests" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "property_id" UUID NOT NULL,
    "tenant_message" TEXT,
    "requested_move_in_date" DATE NOT NULL,
    "duration_in_months" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "rental_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" UUID NOT NULL,
    "rental_agreement_id" UUID NOT NULL,
    "property_id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role" "UserRole" NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE INDEX "categories_name_idx" ON "categories"("name");

-- CreateIndex
CREATE INDEX "properties_location_idx" ON "properties"("location");

-- CreateIndex
CREATE INDEX "properties_category_id_idx" ON "properties"("category_id");

-- CreateIndex
CREATE INDEX "properties_landlord_id_idx" ON "properties"("landlord_id");

-- CreateIndex
CREATE INDEX "properties_is_available_idx" ON "properties"("is_available");

-- CreateIndex
CREATE UNIQUE INDEX "rental_agreements_rental_request_id_key" ON "rental_agreements"("rental_request_id");

-- CreateIndex
CREATE INDEX "rental_agreements_tenant_id_idx" ON "rental_agreements"("tenant_id");

-- CreateIndex
CREATE INDEX "rental_agreements_property_id_idx" ON "rental_agreements"("property_id");

-- CreateIndex
CREATE INDEX "rental_requests_property_id_idx" ON "rental_requests"("property_id");

-- CreateIndex
CREATE INDEX "rental_requests_tenant_id_idx" ON "rental_requests"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_rental_agreement_id_key" ON "reviews"("rental_agreement_id");

-- CreateIndex
CREATE INDEX "reviews_property_id_idx" ON "reviews"("property_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "users_is_active_idx" ON "users"("is_active");

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_landlord_id_fkey" FOREIGN KEY ("landlord_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rental_agreements" ADD CONSTRAINT "rental_agreements_rental_request_id_fkey" FOREIGN KEY ("rental_request_id") REFERENCES "rental_requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rental_agreements" ADD CONSTRAINT "rental_agreements_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rental_agreements" ADD CONSTRAINT "rental_agreements_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rental_requests" ADD CONSTRAINT "rental_requests_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rental_requests" ADD CONSTRAINT "rental_requests_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_rental_agreement_id_fkey" FOREIGN KEY ("rental_agreement_id") REFERENCES "rental_agreements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
