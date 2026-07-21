//#region \0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
//#endregion
let cookie_parser = require("cookie-parser");
cookie_parser = __toESM(cookie_parser, 1);
let express = require("express");
express = __toESM(express, 1);
let cors = require("cors");
cors = __toESM(cors, 1);
let http_status = require("http-status");
http_status = __toESM(http_status, 1);
let zod = require("zod");
zod = __toESM(zod, 1);
let dotenv = require("dotenv");
dotenv = __toESM(dotenv, 1);
let path = require("path");
path = __toESM(path, 1);
require("dotenv/config");
let _prisma_adapter_pg = require("@prisma/adapter-pg");
let node_path = require("node:path");
node_path = __toESM(node_path, 1);
let node_url = require("node:url");
let _prisma_client_runtime_client = require("@prisma/client/runtime/client");
_prisma_client_runtime_client = __toESM(_prisma_client_runtime_client, 1);
let jsonwebtoken = require("jsonwebtoken");
jsonwebtoken = __toESM(jsonwebtoken, 1);
let bcryptjs = require("bcryptjs");
bcryptjs = __toESM(bcryptjs, 1);
let _prisma_client_runtime_index_browser = require("@prisma/client/runtime/index-browser");
_prisma_client_runtime_index_browser = __toESM(_prisma_client_runtime_index_browser, 1);
let stripe = require("stripe");
stripe = __toESM(stripe, 1);
//#region src/utils/sendResponse.ts
const sendResponse = (res, response) => {
	const { statusCode, ...responseBody } = response;
	return res.status(statusCode).json(responseBody);
};
//#endregion
//#region src/middlewares/notFound.ts
const notFound = (req, res) => sendResponse(res, {
	statusCode: http_status.default.NOT_FOUND,
	success: false,
	message: "Route not found",
	errorDetails: [{ message: `${req.method} ${req.originalUrl} does not exist` }]
});
//#endregion
//#region src/config/index.ts
dotenv.default.config({ path: path.default.join(process.cwd(), ".env") });
var config_default = {
	port: process.env.PORT,
	nodeEnv: process.env.NODE_ENV || "development",
	database_url: process.env.DATABASE_URL,
	app_url: process.env.APP_URL,
	bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
	jwt_access_secret: process.env.JWT_ACCESS_SECRET,
	jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
	jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "1d",
	jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
	stripe_secret_key: process.env.STRIPE_SECRET_KEY,
	stripe_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
	stripe_success_url: process.env.STRIPE_SUCCESS_URL,
	stripe_cancel_url: process.env.STRIPE_CANCEL_URL
};
//#endregion
//#region src/utils/AppError.ts
var AppError = class extends Error {
	statusCode;
	errorDetails;
	constructor(statusCode, message, errorDetails) {
		super(message);
		this.statusCode = statusCode;
		this.name = this.constructor.name;
		this.errorDetails = errorDetails;
		Error.captureStackTrace?.(this, this.constructor);
	}
};
//#endregion
//#region src/middlewares/globalErrorHandler.ts
const globalErrorHandler = (error, _req, res, _next) => {
	const errorStack = config_default.nodeEnv === "development" ? error?.stack : void 0;
	if (error instanceof AppError) return sendResponse(res, {
		statusCode: error.statusCode,
		success: false,
		message: error.message,
		errorDetails: error.errorDetails,
		errorStack
	});
	if (error instanceof zod.ZodError) return sendResponse(res, {
		statusCode: http_status.default.BAD_REQUEST,
		success: false,
		message: "Validation error",
		errorDetails: error.issues.map((issue) => ({
			field: issue.path.join("."),
			message: issue.message
		})),
		errorStack
	});
	if (error?.code === "P2002") return sendResponse(res, {
		statusCode: http_status.default.CONFLICT,
		success: false,
		message: "A record with the same unique value already exists",
		errorStack
	});
	if (error?.code === "P2025") return sendResponse(res, {
		statusCode: http_status.default.NOT_FOUND,
		success: false,
		message: "Requested record was not found",
		errorStack
	});
	return sendResponse(res, {
		statusCode: http_status.default.INTERNAL_SERVER_ERROR,
		success: false,
		message: config_default.nodeEnv === "development" ? error?.message || "Something went wrong" : "Something went wrong",
		errorStack
	});
};
//#endregion
//#region src/generated/prisma/internal/class.ts
const config = {
	"previewFeatures": [],
	"clientVersion": "7.8.0",
	"engineVersion": "3c6e192761c0362d496ed980de936e2f3cebcd3a",
	"activeProvider": "postgresql",
	"inlineSchema": "model Category {\n  id   String @id @default(uuid()) @db.Uuid\n  name String @db.VarChar(150)\n  slug String @unique @db.VarChar(150)\n\n  createdAt DateTime @default(now()) @map(\"created_at\") @db.Timestamptz(3)\n  updatedAt DateTime @updatedAt @map(\"updated_at\") @db.Timestamptz(3)\n\n  properties Property[]\n\n  @@index([name])\n  @@map(\"categories\")\n}\n\nenum UserRole {\n  TENANT\n  LANDLORD\n  ADMIN\n}\n\nenum RentalRequestStatus {\n  PENDING\n  APPROVED\n  REJECTED\n  CANCELLED\n}\n\nenum RentalStatus {\n  NOT_STARTED\n  ACTIVE\n  COMPLETED\n  TERMINATED\n}\n\nenum PaymentStatus {\n  PENDING\n  PROCESSING\n  PAID\n  FAILED\n  REFUNDED\n  CANCELLED\n}\n\nenum RentalAgreementStatus {\n  PENDING_PAYMENT\n  ACTIVE\n  COMPLETED\n  TERMINATED\n  CANCELLED\n}\n\nenum PaymentProvider {\n  STRIPE\n}\n\nmodel Payment {\n  id                String          @id @default(uuid()) @db.Uuid\n  rentalAgreementId String          @map(\"rental_agreement_id\") @db.Uuid\n  amount            Decimal         @db.Decimal(10, 2)\n  currency          String          @default(\"usd\") @db.VarChar(20)\n  status            PaymentStatus   @default(PENDING)\n  provider          PaymentProvider @default(STRIPE)\n\n  stripeSessionId       String? @unique @map(\"stripe_session_id\")\n  stripePaymentIntentId String? @unique @map(\"stripe_payment_intent_id\")\n  checkoutUrl           String? @map(\"checkout_url\")\n  failureReason         String? @map(\"failure_reason\")\n  metadata              Json?\n\n  paidAt DateTime? @map(\"paid_at\") @db.Timestamptz(3)\n\n  createdAt DateTime @default(now()) @map(\"created_at\") @db.Timestamptz(3)\n  updatedAt DateTime @updatedAt @map(\"updated_at\") @db.Timestamptz(3)\n\n  rentalAgreement RentalAgreement @relation(fields: [rentalAgreementId], references: [id])\n\n  @@index([rentalAgreementId])\n  @@index([status])\n  @@map(\"payments\")\n}\n\nmodel Property {\n  id          String   @id @default(uuid()) @db.Uuid\n  landlordId  String   @map(\"landlord_id\") @db.Uuid\n  title       String   @db.VarChar(200)\n  description String\n  rent        Decimal  @db.Decimal(10, 2)\n  location    String   @db.VarChar(100)\n  isAvailable Boolean  @default(true) @map(\"is_available\")\n  amenities   String[]\n  bedrooms    Int?\n  bathrooms   Int?\n  size        Decimal? @db.Decimal(10, 2)\n  images      String[]\n  categoryId  String   @map(\"category_id\") @db.Uuid\n\n  createdAt DateTime @default(now()) @map(\"created_at\") @db.Timestamptz(3)\n  updatedAt DateTime @updatedAt @map(\"updated_at\") @db.Timestamptz(3)\n\n  landlord User     @relation(fields: [landlordId], references: [id])\n  category Category @relation(fields: [categoryId], references: [id])\n\n  rentalRequests   RentalRequest[]\n  rentalAgreements RentalAgreement[]\n  reviews          Review[]\n\n  @@index([location])\n  @@index([categoryId])\n  @@index([landlordId])\n  @@index([isAvailable])\n  @@map(\"properties\")\n}\n\nmodel RentalAgreement {\n  id              String @id @default(uuid()) @db.Uuid\n  rentalRequestId String @unique @map(\"rental_request_id\") @db.Uuid\n  tenantId        String @map(\"tenant_id\") @db.Uuid\n  propertyId      String @map(\"property_id\") @db.Uuid\n\n  monthlyRent      Decimal @map(\"monthly_rent\") @db.Decimal(10, 2)\n  durationInMonths Int     @map(\"duration_in_months\")\n\n  leaseStartDate DateTime @map(\"lease_start_date\") @db.Date\n  leaseEndDate   DateTime @map(\"lease_end_date\") @db.Date\n\n  status RentalAgreementStatus @default(PENDING_PAYMENT)\n\n  activatedAt DateTime? @map(\"activated_at\") @db.Timestamptz(3)\n\n  createdAt DateTime @default(now()) @map(\"created_at\") @db.Timestamptz(3)\n  updatedAt DateTime @updatedAt @map(\"updated_at\") @db.Timestamptz(3)\n\n  rentalRequest RentalRequest @relation(fields: [rentalRequestId], references: [id])\n  tenant        User          @relation(fields: [tenantId], references: [id])\n  property      Property      @relation(fields: [propertyId], references: [id])\n\n  payments Payment[]\n  review   Review?\n\n  @@index([tenantId])\n  @@index([propertyId])\n  @@map(\"rental_agreements\")\n}\n\nmodel RentalRequest {\n  id                  String              @id @default(uuid()) @db.Uuid\n  tenantId            String              @map(\"tenant_id\") @db.Uuid\n  propertyId          String              @map(\"property_id\") @db.Uuid\n  status              RentalRequestStatus @default(PENDING)\n  tenantMessage       String?             @map(\"tenant_message\")\n  requestedMoveInDate DateTime            @map(\"requested_move_in_date\") @db.Date\n\n  durationInMonths Int @map(\"duration_in_months\")\n\n  createdAt DateTime @default(now()) @map(\"created_at\") @db.Timestamptz(3)\n  updatedAt DateTime @updatedAt @map(\"updated_at\") @db.Timestamptz(3)\n\n  tenant   User     @relation(fields: [tenantId], references: [id])\n  property Property @relation(fields: [propertyId], references: [id])\n\n  rentalAgreement RentalAgreement?\n\n  @@index([propertyId])\n  @@index([status])\n  @@index([tenantId])\n  @@map(\"rental_requests\")\n}\n\nmodel Review {\n  id                String @id @default(uuid()) @db.Uuid\n  rentalAgreementId String @unique @map(\"rental_agreement_id\") @db.Uuid\n  propertyId        String @map(\"property_id\") @db.Uuid\n  tenantId          String @map(\"tenant_id\") @db.Uuid\n\n  rating  Int\n  comment String?\n\n  createdAt DateTime @default(now()) @map(\"created_at\") @db.Timestamptz(3)\n\n  rentalAgreement RentalAgreement @relation(fields: [rentalAgreementId], references: [id])\n  property        Property        @relation(fields: [propertyId], references: [id])\n  tenant          User            @relation(fields: [tenantId], references: [id])\n\n  @@index([propertyId])\n  @@map(\"reviews\")\n}\n\ngenerator client {\n  provider = \"prisma-client\"\n  output   = \"../../src/generated/prisma\"\n}\n\ndatasource db {\n  provider = \"postgresql\"\n}\n\nmodel StripeWebhookEvent {\n  id String @id @default(uuid()) @db.Uuid\n\n  stripeEventId String @unique @map(\"stripe_event_id\")\n  type          String\n\n  processedAt DateTime? @map(\"processed_at\")\n\n  errorMessage String? @map(\"error_message\")\n\n  createdAt DateTime @default(now()) @map(\"created_at\")\n\n  @@map(\"stripe_webhook_events\")\n}\n\nmodel User {\n  id               String            @id @default(uuid()) @db.Uuid\n  name             String            @db.VarChar(255)\n  email            String            @unique @db.VarChar(255)\n  password         String            @db.VarChar(255)\n  role             UserRole\n  isActive         Boolean           @default(true) @map(\"is_active\")\n  createdAt        DateTime          @default(now()) @map(\"created_at\") @db.Timestamptz(3)\n  updatedAt        DateTime          @updatedAt @map(\"updated_at\") @db.Timestamptz(3)\n  rentalRequests   RentalRequest[]\n  rentalAgreements RentalAgreement[]\n  properties       Property[]\n  reviews          Review[]\n\n  @@index([role])\n  @@index([isActive])\n  @@map(\"users\")\n}\n",
	"runtimeDataModel": {
		"models": {},
		"enums": {},
		"types": {}
	},
	"parameterizationSchema": {
		"strings": [],
		"graph": ""
	}
};
config.runtimeDataModel = JSON.parse("{\"models\":{\"Category\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"slug\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"updated_at\"},{\"name\":\"properties\",\"kind\":\"object\",\"type\":\"Property\",\"relationName\":\"CategoryToProperty\"}],\"dbName\":\"categories\"},\"Payment\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"rentalAgreementId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"rental_agreement_id\"},{\"name\":\"amount\",\"kind\":\"scalar\",\"type\":\"Decimal\"},{\"name\":\"currency\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"status\",\"kind\":\"enum\",\"type\":\"PaymentStatus\"},{\"name\":\"provider\",\"kind\":\"enum\",\"type\":\"PaymentProvider\"},{\"name\":\"stripeSessionId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"stripe_session_id\"},{\"name\":\"stripePaymentIntentId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"stripe_payment_intent_id\"},{\"name\":\"checkoutUrl\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"checkout_url\"},{\"name\":\"failureReason\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"failure_reason\"},{\"name\":\"metadata\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"paidAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"paid_at\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"updated_at\"},{\"name\":\"rentalAgreement\",\"kind\":\"object\",\"type\":\"RentalAgreement\",\"relationName\":\"PaymentToRentalAgreement\"}],\"dbName\":\"payments\"},\"Property\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"landlordId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"landlord_id\"},{\"name\":\"title\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"rent\",\"kind\":\"scalar\",\"type\":\"Decimal\"},{\"name\":\"location\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"isAvailable\",\"kind\":\"scalar\",\"type\":\"Boolean\",\"dbName\":\"is_available\"},{\"name\":\"amenities\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"bedrooms\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"bathrooms\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"size\",\"kind\":\"scalar\",\"type\":\"Decimal\"},{\"name\":\"images\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"categoryId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"category_id\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"updated_at\"},{\"name\":\"landlord\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"PropertyToUser\"},{\"name\":\"category\",\"kind\":\"object\",\"type\":\"Category\",\"relationName\":\"CategoryToProperty\"},{\"name\":\"rentalRequests\",\"kind\":\"object\",\"type\":\"RentalRequest\",\"relationName\":\"PropertyToRentalRequest\"},{\"name\":\"rentalAgreements\",\"kind\":\"object\",\"type\":\"RentalAgreement\",\"relationName\":\"PropertyToRentalAgreement\"},{\"name\":\"reviews\",\"kind\":\"object\",\"type\":\"Review\",\"relationName\":\"PropertyToReview\"}],\"dbName\":\"properties\"},\"RentalAgreement\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"rentalRequestId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"rental_request_id\"},{\"name\":\"tenantId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"tenant_id\"},{\"name\":\"propertyId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"property_id\"},{\"name\":\"monthlyRent\",\"kind\":\"scalar\",\"type\":\"Decimal\",\"dbName\":\"monthly_rent\"},{\"name\":\"durationInMonths\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"duration_in_months\"},{\"name\":\"leaseStartDate\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"lease_start_date\"},{\"name\":\"leaseEndDate\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"lease_end_date\"},{\"name\":\"status\",\"kind\":\"enum\",\"type\":\"RentalAgreementStatus\"},{\"name\":\"activatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"activated_at\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"updated_at\"},{\"name\":\"rentalRequest\",\"kind\":\"object\",\"type\":\"RentalRequest\",\"relationName\":\"RentalAgreementToRentalRequest\"},{\"name\":\"tenant\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"RentalAgreementToUser\"},{\"name\":\"property\",\"kind\":\"object\",\"type\":\"Property\",\"relationName\":\"PropertyToRentalAgreement\"},{\"name\":\"payments\",\"kind\":\"object\",\"type\":\"Payment\",\"relationName\":\"PaymentToRentalAgreement\"},{\"name\":\"review\",\"kind\":\"object\",\"type\":\"Review\",\"relationName\":\"RentalAgreementToReview\"}],\"dbName\":\"rental_agreements\"},\"RentalRequest\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"tenantId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"tenant_id\"},{\"name\":\"propertyId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"property_id\"},{\"name\":\"status\",\"kind\":\"enum\",\"type\":\"RentalRequestStatus\"},{\"name\":\"tenantMessage\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"tenant_message\"},{\"name\":\"requestedMoveInDate\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"requested_move_in_date\"},{\"name\":\"durationInMonths\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"duration_in_months\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"updated_at\"},{\"name\":\"tenant\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"RentalRequestToUser\"},{\"name\":\"property\",\"kind\":\"object\",\"type\":\"Property\",\"relationName\":\"PropertyToRentalRequest\"},{\"name\":\"rentalAgreement\",\"kind\":\"object\",\"type\":\"RentalAgreement\",\"relationName\":\"RentalAgreementToRentalRequest\"}],\"dbName\":\"rental_requests\"},\"Review\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"rentalAgreementId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"rental_agreement_id\"},{\"name\":\"propertyId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"property_id\"},{\"name\":\"tenantId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"tenant_id\"},{\"name\":\"rating\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"comment\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"},{\"name\":\"rentalAgreement\",\"kind\":\"object\",\"type\":\"RentalAgreement\",\"relationName\":\"RentalAgreementToReview\"},{\"name\":\"property\",\"kind\":\"object\",\"type\":\"Property\",\"relationName\":\"PropertyToReview\"},{\"name\":\"tenant\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"ReviewToUser\"}],\"dbName\":\"reviews\"},\"StripeWebhookEvent\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"stripeEventId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"stripe_event_id\"},{\"name\":\"type\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"processedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"processed_at\"},{\"name\":\"errorMessage\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"error_message\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"}],\"dbName\":\"stripe_webhook_events\"},\"User\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"email\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"password\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"role\",\"kind\":\"enum\",\"type\":\"UserRole\"},{\"name\":\"isActive\",\"kind\":\"scalar\",\"type\":\"Boolean\",\"dbName\":\"is_active\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"updated_at\"},{\"name\":\"rentalRequests\",\"kind\":\"object\",\"type\":\"RentalRequest\",\"relationName\":\"RentalRequestToUser\"},{\"name\":\"rentalAgreements\",\"kind\":\"object\",\"type\":\"RentalAgreement\",\"relationName\":\"RentalAgreementToUser\"},{\"name\":\"properties\",\"kind\":\"object\",\"type\":\"Property\",\"relationName\":\"PropertyToUser\"},{\"name\":\"reviews\",\"kind\":\"object\",\"type\":\"Review\",\"relationName\":\"ReviewToUser\"}],\"dbName\":\"users\"}},\"enums\":{},\"types\":{}}");
config.parameterizationSchema = {
	strings: JSON.parse("[\"where\",\"orderBy\",\"cursor\",\"tenant\",\"property\",\"rentalRequest\",\"rentalAgreement\",\"payments\",\"review\",\"_count\",\"rentalRequests\",\"rentalAgreements\",\"properties\",\"reviews\",\"landlord\",\"category\",\"Category.findUnique\",\"Category.findUniqueOrThrow\",\"Category.findFirst\",\"Category.findFirstOrThrow\",\"Category.findMany\",\"data\",\"Category.createOne\",\"Category.createMany\",\"Category.createManyAndReturn\",\"Category.updateOne\",\"Category.updateMany\",\"Category.updateManyAndReturn\",\"create\",\"update\",\"Category.upsertOne\",\"Category.deleteOne\",\"Category.deleteMany\",\"having\",\"_min\",\"_max\",\"Category.groupBy\",\"Category.aggregate\",\"Payment.findUnique\",\"Payment.findUniqueOrThrow\",\"Payment.findFirst\",\"Payment.findFirstOrThrow\",\"Payment.findMany\",\"Payment.createOne\",\"Payment.createMany\",\"Payment.createManyAndReturn\",\"Payment.updateOne\",\"Payment.updateMany\",\"Payment.updateManyAndReturn\",\"Payment.upsertOne\",\"Payment.deleteOne\",\"Payment.deleteMany\",\"_avg\",\"_sum\",\"Payment.groupBy\",\"Payment.aggregate\",\"Property.findUnique\",\"Property.findUniqueOrThrow\",\"Property.findFirst\",\"Property.findFirstOrThrow\",\"Property.findMany\",\"Property.createOne\",\"Property.createMany\",\"Property.createManyAndReturn\",\"Property.updateOne\",\"Property.updateMany\",\"Property.updateManyAndReturn\",\"Property.upsertOne\",\"Property.deleteOne\",\"Property.deleteMany\",\"Property.groupBy\",\"Property.aggregate\",\"RentalAgreement.findUnique\",\"RentalAgreement.findUniqueOrThrow\",\"RentalAgreement.findFirst\",\"RentalAgreement.findFirstOrThrow\",\"RentalAgreement.findMany\",\"RentalAgreement.createOne\",\"RentalAgreement.createMany\",\"RentalAgreement.createManyAndReturn\",\"RentalAgreement.updateOne\",\"RentalAgreement.updateMany\",\"RentalAgreement.updateManyAndReturn\",\"RentalAgreement.upsertOne\",\"RentalAgreement.deleteOne\",\"RentalAgreement.deleteMany\",\"RentalAgreement.groupBy\",\"RentalAgreement.aggregate\",\"RentalRequest.findUnique\",\"RentalRequest.findUniqueOrThrow\",\"RentalRequest.findFirst\",\"RentalRequest.findFirstOrThrow\",\"RentalRequest.findMany\",\"RentalRequest.createOne\",\"RentalRequest.createMany\",\"RentalRequest.createManyAndReturn\",\"RentalRequest.updateOne\",\"RentalRequest.updateMany\",\"RentalRequest.updateManyAndReturn\",\"RentalRequest.upsertOne\",\"RentalRequest.deleteOne\",\"RentalRequest.deleteMany\",\"RentalRequest.groupBy\",\"RentalRequest.aggregate\",\"Review.findUnique\",\"Review.findUniqueOrThrow\",\"Review.findFirst\",\"Review.findFirstOrThrow\",\"Review.findMany\",\"Review.createOne\",\"Review.createMany\",\"Review.createManyAndReturn\",\"Review.updateOne\",\"Review.updateMany\",\"Review.updateManyAndReturn\",\"Review.upsertOne\",\"Review.deleteOne\",\"Review.deleteMany\",\"Review.groupBy\",\"Review.aggregate\",\"StripeWebhookEvent.findUnique\",\"StripeWebhookEvent.findUniqueOrThrow\",\"StripeWebhookEvent.findFirst\",\"StripeWebhookEvent.findFirstOrThrow\",\"StripeWebhookEvent.findMany\",\"StripeWebhookEvent.createOne\",\"StripeWebhookEvent.createMany\",\"StripeWebhookEvent.createManyAndReturn\",\"StripeWebhookEvent.updateOne\",\"StripeWebhookEvent.updateMany\",\"StripeWebhookEvent.updateManyAndReturn\",\"StripeWebhookEvent.upsertOne\",\"StripeWebhookEvent.deleteOne\",\"StripeWebhookEvent.deleteMany\",\"StripeWebhookEvent.groupBy\",\"StripeWebhookEvent.aggregate\",\"User.findUnique\",\"User.findUniqueOrThrow\",\"User.findFirst\",\"User.findFirstOrThrow\",\"User.findMany\",\"User.createOne\",\"User.createMany\",\"User.createManyAndReturn\",\"User.updateOne\",\"User.updateMany\",\"User.updateManyAndReturn\",\"User.upsertOne\",\"User.deleteOne\",\"User.deleteMany\",\"User.groupBy\",\"User.aggregate\",\"AND\",\"OR\",\"NOT\",\"id\",\"name\",\"email\",\"password\",\"UserRole\",\"role\",\"isActive\",\"createdAt\",\"updatedAt\",\"equals\",\"in\",\"notIn\",\"lt\",\"lte\",\"gt\",\"gte\",\"not\",\"contains\",\"startsWith\",\"endsWith\",\"every\",\"some\",\"none\",\"stripeEventId\",\"type\",\"processedAt\",\"errorMessage\",\"rentalAgreementId\",\"propertyId\",\"tenantId\",\"rating\",\"comment\",\"RentalRequestStatus\",\"status\",\"tenantMessage\",\"requestedMoveInDate\",\"durationInMonths\",\"rentalRequestId\",\"monthlyRent\",\"leaseStartDate\",\"leaseEndDate\",\"RentalAgreementStatus\",\"activatedAt\",\"landlordId\",\"title\",\"description\",\"rent\",\"location\",\"isAvailable\",\"amenities\",\"bedrooms\",\"bathrooms\",\"size\",\"images\",\"categoryId\",\"has\",\"hasEvery\",\"hasSome\",\"amount\",\"currency\",\"PaymentStatus\",\"PaymentProvider\",\"provider\",\"stripeSessionId\",\"stripePaymentIntentId\",\"checkoutUrl\",\"failureReason\",\"metadata\",\"paidAt\",\"string_contains\",\"string_starts_with\",\"string_ends_with\",\"array_starts_with\",\"array_ends_with\",\"array_contains\",\"slug\",\"is\",\"isNot\",\"connectOrCreate\",\"upsert\",\"createMany\",\"set\",\"disconnect\",\"delete\",\"connect\",\"updateMany\",\"deleteMany\",\"push\",\"increment\",\"decrement\",\"multiply\",\"divide\"]"),
	graph: "0ARPgAEJDAAA9QEAIJgBAACkAgAwmQEAACcAEJoBAACkAgAwmwEBAAAAAZwBAQDvAQAhogFAAPIBACGjAUAA8gEAIeYBAQAAAAEBAAAAAQAgFwoAAPMBACALAAD0AQAgDQAA9gEAIA4AAKkCACAPAAC6AgAgmAEAALcCADCZAQAAAwAQmgEAALcCADCbAQEA7gEAIaIBQADyAQAhowFAAPIBACHGAQEA7gEAIccBAQDvAQAhyAEBAO8BACHJARAAqwIAIcoBAQDvAQAhywEgAPEBACHMAQAAkwIAIM0BAgC4AgAhzgECALgCACHPARAAuQIAIdABAACTAgAg0QEBAO4BACEICgAA1wMAIAsAANgDACANAADaAwAgDgAAjAQAIA8AAJAEACDNAQAA2wMAIM4BAADbAwAgzwEAANsDACAXCgAA8wEAIAsAAPQBACANAAD2AQAgDgAAqQIAIA8AALoCACCYAQAAtwIAMJkBAAADABCaAQAAtwIAMJsBAQAAAAGiAUAA8gEAIaMBQADyAQAhxgEBAO4BACHHAQEA7wEAIcgBAQDvAQAhyQEQAKsCACHKAQEA7wEAIcsBIADxAQAhzAEAAJMCACDNAQIAuAIAIc4BAgC4AgAhzwEQALkCACHQAQAAkwIAINEBAQDuAQAhAwAAAAMAIAEAAAQAMAIAAAUAIA8DAACpAgAgBAAAqAIAIAYAALYCACCYAQAAtAIAMJkBAAAHABCaAQAAtAIAMJsBAQDuAQAhogFAAPIBACGjAUAA8gEAIbcBAQDuAQAhuAEBAO4BACG8AQAAtQK8ASK9AQEAggIAIb4BQADyAQAhvwECAKYCACEEAwAAjAQAIAQAAIsEACAGAACKBAAgvQEAANsDACAPAwAAqQIAIAQAAKgCACAGAAC2AgAgmAEAALQCADCZAQAABwAQmgEAALQCADCbAQEAAAABogFAAPIBACGjAUAA8gEAIbcBAQDuAQAhuAEBAO4BACG8AQAAtQK8ASK9AQEAggIAIb4BQADyAQAhvwECAKYCACEDAAAABwAgAQAACAAwAgAACQAgFAMAAKkCACAEAACoAgAgBQAArQIAIAcAAK4CACAIAACvAgAgmAEAAKoCADCZAQAACwAQmgEAAKoCADCbAQEA7gEAIaIBQADyAQAhowFAAPIBACG3AQEA7gEAIbgBAQDuAQAhvAEAAKwCxQEivwECAKYCACHAAQEA7gEAIcEBEACrAgAhwgFAAPIBACHDAUAA8gEAIcUBQACBAgAhAQAAAAsAIBIGAACnAgAgmAEAALACADCZAQAADQAQmgEAALACADCbAQEA7gEAIaIBQADyAQAhowFAAPIBACG2AQEA7gEAIbwBAACxAtgBItUBEACrAgAh1gEBAO8BACHZAQAAsgLZASLaAQEAggIAIdsBAQCCAgAh3AEBAIICACHdAQEAggIAId4BAACzAgAg3wFAAIECACEHBgAAigQAINoBAADbAwAg2wEAANsDACDcAQAA2wMAIN0BAADbAwAg3gEAANsDACDfAQAA2wMAIBIGAACnAgAgmAEAALACADCZAQAADQAQmgEAALACADCbAQEAAAABogFAAPIBACGjAUAA8gEAIbYBAQDuAQAhvAEAALEC2AEi1QEQAKsCACHWAQEA7wEAIdkBAACyAtkBItoBAQAAAAHbAQEAAAAB3AEBAIICACHdAQEAggIAId4BAACzAgAg3wFAAIECACEDAAAADQAgAQAADgAwAgAADwAgDQMAAKkCACAEAACoAgAgBgAApwIAIJgBAAClAgAwmQEAABEAEJoBAAClAgAwmwEBAO4BACGiAUAA8gEAIbYBAQDuAQAhtwEBAO4BACG4AQEA7gEAIbkBAgCmAgAhugEBAIICACEBAAAAEQAgAQAAAA0AIAYDAACMBAAgBAAAiwQAIAUAAI0EACAHAACOBAAgCAAAjwQAIMUBAADbAwAgFAMAAKkCACAEAACoAgAgBQAArQIAIAcAAK4CACAIAACvAgAgmAEAAKoCADCZAQAACwAQmgEAAKoCADCbAQEAAAABogFAAPIBACGjAUAA8gEAIbcBAQDuAQAhuAEBAO4BACG8AQAArALFASK_AQIApgIAIcABAQAAAAHBARAAqwIAIcIBQADyAQAhwwFAAPIBACHFAUAAgQIAIQMAAAALACABAAAUADACAAAVACADAAAAAwAgAQAABAAwAgAABQAgBAMAAIwEACAEAACLBAAgBgAAigQAILoBAADbAwAgDQMAAKkCACAEAACoAgAgBgAApwIAIJgBAAClAgAwmQEAABEAEJoBAAClAgAwmwEBAAAAAaIBQADyAQAhtgEBAAAAAbcBAQDuAQAhuAEBAO4BACG5AQIApgIAIboBAQCCAgAhAwAAABEAIAEAABgAMAIAABkAIAEAAAAHACABAAAACwAgAQAAAAMAIAEAAAARACADAAAABwAgAQAACAAwAgAACQAgAwAAAAsAIAEAABQAMAIAABUAIAMAAAARACABAAAYADACAAAZACABAAAABwAgAQAAAAsAIAEAAAARACABAAAAAwAgAQAAAAEAIAkMAAD1AQAgmAEAAKQCADCZAQAAJwAQmgEAAKQCADCbAQEA7gEAIZwBAQDvAQAhogFAAPIBACGjAUAA8gEAIeYBAQDvAQAhAQwAANkDACADAAAAJwAgAQAAKAAwAgAAAQAgAwAAACcAIAEAACgAMAIAAAEAIAMAAAAnACABAAAoADACAAABACAGDAAAiQQAIJsBAQAAAAGcAQEAAAABogFAAAAAAaMBQAAAAAHmAQEAAAABARUAACwAIAWbAQEAAAABnAEBAAAAAaIBQAAAAAGjAUAAAAAB5gEBAAAAAQEVAAAuADABFQAALgAwBgwAAP8DACCbAQEAvgIAIZwBAQC-AgAhogFAAMECACGjAUAAwQIAIeYBAQC-AgAhAgAAAAEAIBUAADEAIAWbAQEAvgIAIZwBAQC-AgAhogFAAMECACGjAUAAwQIAIeYBAQC-AgAhAgAAACcAIBUAADMAIAIAAAAnACAVAAAzACADAAAAAQAgHAAALAAgHQAAMQAgAQAAAAEAIAEAAAAnACADCQAA_AMAICIAAP4DACAjAAD9AwAgCJgBAACjAgAwmQEAADoAEJoBAACjAgAwmwEBAN4BACGcAQEA3wEAIaIBQADiAQAhowFAAOIBACHmAQEA3wEAIQMAAAAnACABAAA5ADAhAAA6ACADAAAAJwAgAQAAKAAwAgAAAQAgAQAAAA8AIAEAAAAPACADAAAADQAgAQAADgAwAgAADwAgAwAAAA0AIAEAAA4AMAIAAA8AIAMAAAANACABAAAOADACAAAPACAPBgAA-wMAIJsBAQAAAAGiAUAAAAABowFAAAAAAbYBAQAAAAG8AQAAANgBAtUBEAAAAAHWAQEAAAAB2QEAAADZAQLaAQEAAAAB2wEBAAAAAdwBAQAAAAHdAQEAAAAB3gGAAAAAAd8BQAAAAAEBFQAAQgAgDpsBAQAAAAGiAUAAAAABowFAAAAAAbYBAQAAAAG8AQAAANgBAtUBEAAAAAHWAQEAAAAB2QEAAADZAQLaAQEAAAAB2wEBAAAAAdwBAQAAAAHdAQEAAAAB3gGAAAAAAd8BQAAAAAEBFQAARAAwARUAAEQAMA8GAAD6AwAgmwEBAL4CACGiAUAAwQIAIaMBQADBAgAhtgEBAL4CACG8AQAAlwPYASLVARAA4gIAIdYBAQC-AgAh2QEAAJgD2QEi2gEBANECACHbAQEA0QIAIdwBAQDRAgAh3QEBANECACHeAYAAAAAB3wFAAIIDACECAAAADwAgFQAARwAgDpsBAQC-AgAhogFAAMECACGjAUAAwQIAIbYBAQC-AgAhvAEAAJcD2AEi1QEQAOICACHWAQEAvgIAIdkBAACYA9kBItoBAQDRAgAh2wEBANECACHcAQEA0QIAId0BAQDRAgAh3gGAAAAAAd8BQACCAwAhAgAAAA0AIBUAAEkAIAIAAAANACAVAABJACADAAAADwAgHAAAQgAgHQAARwAgAQAAAA8AIAEAAAANACALCQAA9QMAICIAAPgDACAjAAD3AwAgNAAA9gMAIDUAAPkDACDaAQAA2wMAINsBAADbAwAg3AEAANsDACDdAQAA2wMAIN4BAADbAwAg3wEAANsDACARmAEAAJoCADCZAQAAUAAQmgEAAJoCADCbAQEA3gEAIaIBQADiAQAhowFAAOIBACG2AQEA3gEAIbwBAACbAtgBItUBEACMAgAh1gEBAN8BACHZAQAAnALZASLaAQEA-gEAIdsBAQD6AQAh3AEBAPoBACHdAQEA-gEAId4BAACdAgAg3wFAAPkBACEDAAAADQAgAQAATwAwIQAAUAAgAwAAAA0AIAEAAA4AMAIAAA8AIAEAAAAFACABAAAABQAgAwAAAAMAIAEAAAQAMAIAAAUAIAMAAAADACABAAAEADACAAAFACADAAAAAwAgAQAABAAwAgAABQAgFAoAALwDACALAAC9AwAgDQAAvgMAIA4AAPQDACAPAAC7AwAgmwEBAAAAAaIBQAAAAAGjAUAAAAABxgEBAAAAAccBAQAAAAHIAQEAAAAByQEQAAAAAcoBAQAAAAHLASAAAAABzAEAALkDACDNAQIAAAABzgECAAAAAc8BEAAAAAHQAQAAugMAINEBAQAAAAEBFQAAWAAgD5sBAQAAAAGiAUAAAAABowFAAAAAAcYBAQAAAAHHAQEAAAAByAEBAAAAAckBEAAAAAHKAQEAAAABywEgAAAAAcwBAAC5AwAgzQECAAAAAc4BAgAAAAHPARAAAAAB0AEAALoDACDRAQEAAAABARUAAFoAMAEVAABaADAUCgAA6QIAIAsAAOoCACANAADrAgAgDgAA8wMAIA8AAOgCACCbAQEAvgIAIaIBQADBAgAhowFAAMECACHGAQEAvgIAIccBAQC-AgAhyAEBAL4CACHJARAA4gIAIcoBAQC-AgAhywEgAMACACHMAQAA4wIAIM0BAgDkAgAhzgECAOQCACHPARAA5QIAIdABAADmAgAg0QEBAL4CACECAAAABQAgFQAAXQAgD5sBAQC-AgAhogFAAMECACGjAUAAwQIAIcYBAQC-AgAhxwEBAL4CACHIAQEAvgIAIckBEADiAgAhygEBAL4CACHLASAAwAIAIcwBAADjAgAgzQECAOQCACHOAQIA5AIAIc8BEADlAgAh0AEAAOYCACDRAQEAvgIAIQIAAAADACAVAABfACACAAAAAwAgFQAAXwAgAwAAAAUAIBwAAFgAIB0AAF0AIAEAAAAFACABAAAAAwAgCAkAAO4DACAiAADxAwAgIwAA8AMAIDQAAO8DACA1AADyAwAgzQEAANsDACDOAQAA2wMAIM8BAADbAwAgEpgBAACSAgAwmQEAAGYAEJoBAACSAgAwmwEBAN4BACGiAUAA4gEAIaMBQADiAQAhxgEBAN4BACHHAQEA3wEAIcgBAQDfAQAhyQEQAIwCACHKAQEA3wEAIcsBIADhAQAhzAEAAJMCACDNAQIAlAIAIc4BAgCUAgAhzwEQAJUCACHQAQAAkwIAINEBAQDeAQAhAwAAAAMAIAEAAGUAMCEAAGYAIAMAAAADACABAAAEADACAAAFACABAAAAFQAgAQAAABUAIAMAAAALACABAAAUADACAAAVACADAAAACwAgAQAAFAAwAgAAFQAgAwAAAAsAIAEAABQAMAIAABUAIBEDAACdAwAgBAAAtAMAIAUAAJwDACAHAACeAwAgCAAAnwMAIJsBAQAAAAGiAUAAAAABowFAAAAAAbcBAQAAAAG4AQEAAAABvAEAAADFAQK_AQIAAAABwAEBAAAAAcEBEAAAAAHCAUAAAAABwwFAAAAAAcUBQAAAAAEBFQAAbgAgDJsBAQAAAAGiAUAAAAABowFAAAAAAbcBAQAAAAG4AQEAAAABvAEAAADFAQK_AQIAAAABwAEBAAAAAcEBEAAAAAHCAUAAAAABwwFAAAAAAcUBQAAAAAEBFQAAcAAwARUAAHAAMBEDAACFAwAgBAAAswMAIAUAAIQDACAHAACGAwAgCAAAhwMAIJsBAQC-AgAhogFAAMECACGjAUAAwQIAIbcBAQC-AgAhuAEBAL4CACG8AQAAgQPFASK_AQIA0AIAIcABAQC-AgAhwQEQAOICACHCAUAAwQIAIcMBQADBAgAhxQFAAIIDACECAAAAFQAgFQAAcwAgDJsBAQC-AgAhogFAAMECACGjAUAAwQIAIbcBAQC-AgAhuAEBAL4CACG8AQAAgQPFASK_AQIA0AIAIcABAQC-AgAhwQEQAOICACHCAUAAwQIAIcMBQADBAgAhxQFAAIIDACECAAAACwAgFQAAdQAgAgAAAAsAIBUAAHUAIAMAAAAVACAcAABuACAdAABzACABAAAAFQAgAQAAAAsAIAYJAADpAwAgIgAA7AMAICMAAOsDACA0AADqAwAgNQAA7QMAIMUBAADbAwAgD5gBAACLAgAwmQEAAHwAEJoBAACLAgAwmwEBAN4BACGiAUAA4gEAIaMBQADiAQAhtwEBAN4BACG4AQEA3gEAIbwBAACNAsUBIr8BAgCEAgAhwAEBAN4BACHBARAAjAIAIcIBQADiAQAhwwFAAOIBACHFAUAA-QEAIQMAAAALACABAAB7ADAhAAB8ACADAAAACwAgAQAAFAAwAgAAFQAgAQAAAAkAIAEAAAAJACADAAAABwAgAQAACAAwAgAACQAgAwAAAAcAIAEAAAgAMAIAAAkAIAMAAAAHACABAAAIADACAAAJACAMAwAAtgMAIAQAANIDACAGAAC3AwAgmwEBAAAAAaIBQAAAAAGjAUAAAAABtwEBAAAAAbgBAQAAAAG8AQAAALwBAr0BAQAAAAG-AUAAAAABvwECAAAAAQEVAACEAQAgCZsBAQAAAAGiAUAAAAABowFAAAAAAbcBAQAAAAG4AQEAAAABvAEAAAC8AQK9AQEAAAABvgFAAAAAAb8BAgAAAAEBFQAAhgEAMAEVAACGAQAwDAMAAKwDACAEAADQAwAgBgAArQMAIJsBAQC-AgAhogFAAMECACGjAUAAwQIAIbcBAQC-AgAhuAEBAL4CACG8AQAAqgO8ASK9AQEA0QIAIb4BQADBAgAhvwECANACACECAAAACQAgFQAAiQEAIAmbAQEAvgIAIaIBQADBAgAhowFAAMECACG3AQEAvgIAIbgBAQC-AgAhvAEAAKoDvAEivQEBANECACG-AUAAwQIAIb8BAgDQAgAhAgAAAAcAIBUAAIsBACACAAAABwAgFQAAiwEAIAMAAAAJACAcAACEAQAgHQAAiQEAIAEAAAAJACABAAAABwAgBgkAAOQDACAiAADnAwAgIwAA5gMAIDQAAOUDACA1AADoAwAgvQEAANsDACAMmAEAAIcCADCZAQAAkgEAEJoBAACHAgAwmwEBAN4BACGiAUAA4gEAIaMBQADiAQAhtwEBAN4BACG4AQEA3gEAIbwBAACIArwBIr0BAQD6AQAhvgFAAOIBACG_AQIAhAIAIQMAAAAHACABAACRAQAwIQAAkgEAIAMAAAAHACABAAAIADACAAAJACABAAAAGQAgAQAAABkAIAMAAAARACABAAAYADACAAAZACADAAAAEQAgAQAAGAAwAgAAGQAgAwAAABEAIAEAABgAMAIAABkAIAoDAAD2AgAgBAAA1wIAIAYAANYCACCbAQEAAAABogFAAAAAAbYBAQAAAAG3AQEAAAABuAEBAAAAAbkBAgAAAAG6AQEAAAABARUAAJoBACAHmwEBAAAAAaIBQAAAAAG2AQEAAAABtwEBAAAAAbgBAQAAAAG5AQIAAAABugEBAAAAAQEVAACcAQAwARUAAJwBADAKAwAA9AIAIAQAANQCACAGAADTAgAgmwEBAL4CACGiAUAAwQIAIbYBAQC-AgAhtwEBAL4CACG4AQEAvgIAIbkBAgDQAgAhugEBANECACECAAAAGQAgFQAAnwEAIAebAQEAvgIAIaIBQADBAgAhtgEBAL4CACG3AQEAvgIAIbgBAQC-AgAhuQECANACACG6AQEA0QIAIQIAAAARACAVAAChAQAgAgAAABEAIBUAAKEBACADAAAAGQAgHAAAmgEAIB0AAJ8BACABAAAAGQAgAQAAABEAIAYJAADfAwAgIgAA4gMAICMAAOEDACA0AADgAwAgNQAA4wMAILoBAADbAwAgCpgBAACDAgAwmQEAAKgBABCaAQAAgwIAMJsBAQDeAQAhogFAAOIBACG2AQEA3gEAIbcBAQDeAQAhuAEBAN4BACG5AQIAhAIAIboBAQD6AQAhAwAAABEAIAEAAKcBADAhAACoAQAgAwAAABEAIAEAABgAMAIAABkAIAmYAQAAgAIAMJkBAACuAQAQmgEAAIACADCbAQEAAAABogFAAPIBACGyAQEAAAABswEBAO8BACG0AUAAgQIAIbUBAQCCAgAhAQAAAKsBACABAAAAqwEAIAmYAQAAgAIAMJkBAACuAQAQmgEAAIACADCbAQEA7gEAIaIBQADyAQAhsgEBAO8BACGzAQEA7wEAIbQBQACBAgAhtQEBAIICACECtAEAANsDACC1AQAA2wMAIAMAAACuAQAgAQAArwEAMAIAAKsBACADAAAArgEAIAEAAK8BADACAACrAQAgAwAAAK4BACABAACvAQAwAgAAqwEAIAabAQEAAAABogFAAAAAAbIBAQAAAAGzAQEAAAABtAFAAAAAAbUBAQAAAAEBFQAAswEAIAabAQEAAAABogFAAAAAAbIBAQAAAAGzAQEAAAABtAFAAAAAAbUBAQAAAAEBFQAAtQEAMAEVAAC1AQAwBpsBAQC-AgAhogFAAMECACGyAQEAvgIAIbMBAQC-AgAhtAFAAIIDACG1AQEA0QIAIQIAAACrAQAgFQAAuAEAIAabAQEAvgIAIaIBQADBAgAhsgEBAL4CACGzAQEAvgIAIbQBQACCAwAhtQEBANECACECAAAArgEAIBUAALoBACACAAAArgEAIBUAALoBACADAAAAqwEAIBwAALMBACAdAAC4AQAgAQAAAKsBACABAAAArgEAIAUJAADcAwAgIgAA3gMAICMAAN0DACC0AQAA2wMAILUBAADbAwAgCZgBAAD4AQAwmQEAAMEBABCaAQAA-AEAMJsBAQDeAQAhogFAAOIBACGyAQEA3wEAIbMBAQDfAQAhtAFAAPkBACG1AQEA-gEAIQMAAACuAQAgAQAAwAEAMCEAAMEBACADAAAArgEAIAEAAK8BADACAACrAQAgDwoAAPMBACALAAD0AQAgDAAA9QEAIA0AAPYBACCYAQAA7QEAMJkBAADHAQAQmgEAAO0BADCbAQEAAAABnAEBAO8BACGdAQEAAAABngEBAO8BACGgAQAA8AGgASKhASAA8QEAIaIBQADyAQAhowFAAPIBACEBAAAAxAEAIAEAAADEAQAgDwoAAPMBACALAAD0AQAgDAAA9QEAIA0AAPYBACCYAQAA7QEAMJkBAADHAQAQmgEAAO0BADCbAQEA7gEAIZwBAQDvAQAhnQEBAO8BACGeAQEA7wEAIaABAADwAaABIqEBIADxAQAhogFAAPIBACGjAUAA8gEAIQQKAADXAwAgCwAA2AMAIAwAANkDACANAADaAwAgAwAAAMcBACABAADIAQAwAgAAxAEAIAMAAADHAQAgAQAAyAEAMAIAAMQBACADAAAAxwEAIAEAAMgBADACAADEAQAgDAoAANMDACALAADUAwAgDAAA1QMAIA0AANYDACCbAQEAAAABnAEBAAAAAZ0BAQAAAAGeAQEAAAABoAEAAACgAQKhASAAAAABogFAAAAAAaMBQAAAAAEBFQAAzAEAIAibAQEAAAABnAEBAAAAAZ0BAQAAAAGeAQEAAAABoAEAAACgAQKhASAAAAABogFAAAAAAaMBQAAAAAEBFQAAzgEAMAEVAADOAQAwDAoAAMICACALAADDAgAgDAAAxAIAIA0AAMUCACCbAQEAvgIAIZwBAQC-AgAhnQEBAL4CACGeAQEAvgIAIaABAAC_AqABIqEBIADAAgAhogFAAMECACGjAUAAwQIAIQIAAADEAQAgFQAA0QEAIAibAQEAvgIAIZwBAQC-AgAhnQEBAL4CACGeAQEAvgIAIaABAAC_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-QEAIbUBAQD6AQAhCwkAAPwBACAiAAD_AQAgIwAA_wEAIKQBQAAAAAGlAUAAAAAFpgFAAAAABacBQAAAAAGoAUAAAAABqQFAAAAAAaoBQAAAAAGrAUAA_gEAIQ4JAAD8AQAgIgAA_QEAICMAAP0BACCkAQEAAAABpQEBAAAABaYBAQAAAAWnAQEAAAABqAEBAAAAAakBAQAAAAGqAQEAAAABqwEBAPsBACGsAQEAAAABrQEBAAAAAa4BAQAAAAEOCQAA_AEAICIAAP0BACAjAAD9AQAgpAEBAAAAAaUBAQAAAAWmAQEAAAAFpwEBAAAAAagBAQAAAAGpAQEAAAABqgEBAAAAAasBAQD7AQAhrAEBAAAAAa0BAQAAAAGuAQEAAAABCKQBAgAAAAGlAQIAAAAFpgECAAAABacBAgAAAAGoAQIAAAABqQECAAAAAaoBAgAAAAGrAQIA_AEAIQukAQEAAAABpQEBAAAABaYBAQAAAAWnAQEAAAABqAEBAAAAAakBAQAAAAGqAQEAAAABqwEBAP0BACGsAQEAAAABrQEBAAAAAa4BAQAAAAELCQAA_AEAICIAAP8BACAjAAD_AQAgpAFAAAAAAaUBQAAAAAWmAUAAAAAFpwFAAAAAAagBQAAAAAGpAUAAAAABqgFAAAAAAasBQAD-AQAhCKQBQAAAAAGlAUAAAAAFpgFAAAAABacBQAAAAAGoAUAAAAABqQFAAAAAAaoBQAAAAAGrAUAA_wEAIQmYAQAAgAIAMJkBAACuAQAQmgEAAIACADCbAQEA7gEAIaIBQADyAQAhsgEBAO8BACGzAQEA7wEAIbQBQACBAgAhtQEBAIICACEIpAFAAAAAAaUBQAAAAAWmAUAAAAAFpwFAAAAAAagBQAAAAAGpAUAAAAABqgFAAAAAAasBQAD_AQAhC6QBAQAAAAGlAQEAAAAFpgEBAAAABacBAQAAAAGoAQEAAAABqQEBAAAAAaoBAQAAAAGrAQEA_QEAIawBAQAAAAGtAQEAAAABrgEBAAAAAQqYAQAAgwIAMJkBAACoAQAQmgEAAIMCADCbAQEA3gEAIaIBQADiAQAhtgEBAN4BACG3AQEA3gEAIbgBAQDeAQAhuQECAIQCACG6AQEA-gEAIQ0JAADkAQAgIgAA5AEAICMAAOQBACA0AACGAgAgNQAA5AEAIKQBAgAAAAGlAQIAAAAEpgECAAAABKcBAgAAAAGoAQIAAAABqQECAAAAAaoBAgAAAAGrAQIAhQIAIQ0JAADkAQAgIgAA5AEAICMAAOQBACA0AACGAgAgNQAA5AEAIKQBAgAAAAGlAQIAAAAEpgECAAAABKcBAgAAAAGoAQIAAAABqQECAAAAAaoBAgAAAAGrAQIAhQIAIQikAQgAAAABpQEIAAAABKYBCAAAAASnAQgAAAABqAEIAAAAAakBCAAAAAGqAQgAAAABqwEIAIYCACEMmAEAAIcCADCZAQAAkgEAEJoBAACHAgAwmwEBAN4BACGiAUAA4gEAIaMBQADiAQAhtwEBAN4BACG4AQEA3gEAIbwBAACIArwBIr0BAQD6AQAhvgFAAOIBACG_AQIAhAIAIQcJAADkAQAgIgAAigIAICMAAIoCACCkAQAAALwBAqUBAAAAvAEIpgEAAAC8AQirAQAAiQK8ASIHCQAA5AEAICIAAIoCACAjAACKAgAgpAEAAAC8AQKlAQAAALwBCKYBAAAAvAEIqwEAAIkCvAEiBKQBAAAAvAECpQEAAAC8AQimAQAAALwBCKsBAACKArwBIg-YAQAAiwIAMJkBAAB8ABCaAQAAiwIAMJsBAQDeAQAhogFAAOIBACGjAUAA4gEAIbcBAQDeAQAhuAEBAN4BACG8AQAAjQLFASK_AQIAhAIAIcABAQDeAQAhwQEQAIwCACHCAUAA4gEAIcMBQADiAQAhxQFAAPkBACENCQAA5AEAICIAAJECACAjAACRAgAgNAAAkQIAIDUAAJECACCkARAAAAABpQEQAAAABKYBEAAAAASnARAAAAABqAEQAAAAAakBEAAAAAGqARAAAAABqwEQAJACACEHCQAA5AEAICIAAI8CACAjAACPAgAgpAEAAADFAQKlAQAAAMUBCKYBAAAAxQEIqwEAAI4CxQEiBwkAAOQBACAiAACPAgAgIwAAjwIAIKQBAAAAxQECpQEAAADFAQimAQAAAMUBCKsBAACOAsUBIgSkAQAAAMUBAqUBAAAAxQEIpgEAAADFAQirAQAAjwLFASINCQAA5AEAICIAAJECACAjAACRAgAgNAAAkQIAIDUAAJECACCkARAAAAABpQEQAAAABKYBEAAAAASnARAAAAABqAEQAAAAAakBEAAAAAGqARAAAAABqwEQAJACACEIpAEQAAAAAaUBEAAAAASmARAAAAAEpwEQAAAAAagBEAAAAAGpARAAAAABqgEQAAAAAasBEACRAgAhEpgBAACSAgAwmQEAAGYAEJoBAACSAgAwmwEBAN4BACGiAUAA4gEAIaMBQADiAQAhxgEBAN4BACHHAQEA3wEAIcgBAQDfAQAhyQEQAIwCACHKAQEA3wEAIcsBIADhAQAhzAEAAJMCACDNAQIAlAIAIc4BAgCUAgAhzwEQAJUCACHQAQAAkwIAINEBAQDeAQAhBKQBAQAAAAXSAQEAAAAB0wEBAAAABNQBAQAAAAQNCQAA_AEAICIAAPwBACAjAAD8AQAgNAAAmQIAIDUAAPwBACCkAQIAAAABpQECAAAABaYBAgAAAAWnAQIAAAABqAECAAAAAakBAgAAAAGqAQIAAAABqwECAJgCACENCQAA_AEAICIAAJcCACAjAACXAgAgNAAAlwIAIDUAAJcCACCkARAAAAABpQEQAAAABaYBEAAAAAWnARAAAAABqAEQAAAAAakBEAAAAAGqARAAAAABqwEQAJYCACENCQAA_AEAICIAAJcCACAjAACXAgAgNAAAlwIAIDUAAJcCACCkARAAAAABpQEQAAAABaYBEAAAAAWnARAAAAABqAEQAAAAAakBEAAAAAGqARAAAAABqwEQAJYCACEIpAEQAAAAAaUBEAAAAAWmARAAAAAFpwEQAAAAAagBEAAAAAGpARAAAAABqgEQAAAAAasBEACXAgAhDQkAAPwBACAiAAD8AQAgIwAA_AEAIDQAAJkCACA1AAD8AQAgpAECAAAAAaUBAgAAAAWmAQIAAAAFpwECAAAAAagBAgAAAAGpAQIAAAABqgECAAAAAasBAgCYAgAhCKQBCAAAAAGlAQgAAAAFpgEIAAAABacBCAAAAAGoAQgAAAABqQEIAAAAAaoBCAAAAAGrAQgAmQIAIRGYAQAAmgIAMJkBAABQABCaAQAAmgIAMJsBAQDeAQAhogFAAOIBACGjAUAA4gEAIbYBAQDeAQAhvAEAAJsC2AEi1QEQAIwCACHWAQEA3wEAIdkBAACcAtkBItoBAQD6AQAh2wEBAPoBACHcAQEA-gEAId0BAQD6AQAh3gEAAJ0CACDfAUAA-QEAIQcJAADkAQAgIgAAogIAICMAAKICACCkAQAAANgBAqUBAAAA2AEIpgEAAADYAQirAQAAoQLYASIHCQAA5AEAICIAAKACACAjAACgAgAgpAEAAADZAQKlAQAAANkBCKYBAAAA2QEIqwEAAJ8C2QEiDwkAAPwBACAiAACeAgAgIwAAngIAIKQBgAAAAAGnAYAAAAABqAGAAAAAAakBgAAAAAGqAYAAAAABqwGAAAAAAeABAQAAAAHhAQEAAAAB4gEBAAAAAeMBgAAAAAHkAYAAAAAB5QGAAAAAAQykAYAAAAABpwGAAAAAAagBgAAAAAGpAYAAAAABqgGAAAAAAasBgAAAAAHgAQEAAAAB4QEBAAAAAeIBAQAAAAHjAYAAAAAB5AGAAAAAAeUBgAAAAAEHCQAA5AEAICIAAKACACAjAACgAgAgpAEAAADZAQKlAQAAANkBCKYBAAAA2QEIqwEAAJ8C2QEiBKQBAAAA2QECpQEAAADZAQimAQAAANkBCKsBAACgAtkBIgcJAADkAQAgIgAAogIAICMAAKICACCkAQAAANgBAqUBAAAA2AEIpgEAAADYAQirAQAAoQLYASIEpAEAAADYAQKlAQAAANgBCKYBAAAA2AEIqwEAAKIC2AEiCJgBAACjAgAwmQEAADoAEJoBAACjAgAwmwEBAN4BACGcAQEA3wEAIaIBQADiAQAhowFAAOIBACHmAQEA3wEAIQkMAAD1AQAgmAEAAKQCADCZAQAAJwAQmgEAAKQCADCbAQEA7gEAIZwBAQDvAQAhogFAAPIBACGjAUAA8gEAIeYBAQDvAQAhDQMAAKkCACAEAACoAgAgBgAApwIAIJgBAAClAgAwmQEAABEAEJoBAAClAgAwmwEBAO4BACGiAUAA8gEAIbYBAQDuAQAhtwEBAO4BACG4AQEA7gEAIbkBAgCmAgAhugEBAIICACEIpAECAAAAAaUBAgAAAASmAQIAAAAEpwECAAAAAagBAgAAAAGpAQIAAAABqgECAAAAAasBAgDkAQAhFgMAAKkCACAEAACoAgAgBQAArQIAIAcAAK4CACAIAACvAgAgmAEAAKoCADCZAQAACwAQmgEAAKoCADCbAQEA7gEAIaIBQADyAQAhowFAAPIBACG3AQEA7gEAIbgBAQDuAQAhvAEAAKwCxQEivwECAKYCACHAAQEA7gEAIcEBEACrAgAhwgFAAPIBACHDAUAA8gEAIcUBQACBAgAh5wEAAAsAIOgBAAALACAZCgAA8wEAIAsAAPQBACANAAD2AQAgDgAAqQIAIA8AALoCACCYAQAAtwIAMJkBAAADABCaAQAAtwIAMJsBAQDuAQAhogFAAPIBACGjAUAA8gEAIcYBAQDuAQAhxwEBAO8BACHIAQEA7wEAIckBEACrAgAhygEBAO8BACHLASAA8QEAIcwBAACTAgAgzQECALgCACHOAQIAuAIAIc8BEAC5AgAh0AEAAJMCACDRAQEA7gEAIecBAAADACDoAQAAAwAgEQoAAPMBACALAAD0AQAgDAAA9QEAIA0AAPYBACCYAQAA7QEAMJkBAADHAQAQmgEAAO0BADCbAQEA7gEAIZwBAQDvAQAhnQEBAO8BACGeAQEA7wEAIaABAADwAaABIqEBIADxAQAhogFAAPIBACGjAUAA8gEAIecBAADHAQAg6AEAAMcBACAUAwAAqQIAIAQAAKgCACAFAACtAgAgBwAArgIAIAgAAK8CACCYAQAAqgIAMJkBAAALABCaAQAAqgIAMJsBAQDuAQAhogFAAPIBACGjAUAA8gEAIbcBAQDuAQAhuAEBAO4BACG8AQAArALFASK_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_AwAwHQAAwwMAMOkBAADAAwAw6gEAAMEDADDrAQAAwgMAIOwBAAD7AgAw7QEAAPsCADDuAQAA-wIAMO8BAAD7AgAw8AEAAMQDADDxAQAA_gIAMAscAADYAgAwHQAA3QIAMOkBAADZAgAw6gEAANoCADDrAQAA2wIAIOwBAADcAgAw7QEAANwCADDuAQAA3AIAMO8BAADcAgAw8AEAAN4CADDxAQAA3wIAMAscAADGAgAwHQAAywIAMOkBAADHAgAw6gEAAMgCADDrAQAAyQIAIOwBAADKAgAw7QEAAMoCADDuAQAAygIAMO8BAADKAgAw8AEAAMwCADDxAQAAzQIAMAgEAADXAgAgBgAA1gIAIJsBAQAAAAGiAUAAAAABtgEBAAAAAbcBAQAAAAG5AQIAAAABugEBAAAAAQIAAAAZACAcAADVAgAgAwAAABkAIBwAANUCACAdAADSAgAgARUAANAEADANAwAAqQIAIAQAAKgCACAGAACnAgAgmAEAAKUCADCZAQAAEQAQmgEAAKUCADCbAQEAAAABogFAAPIBACG2AQEAAAABtwEBAO4BACG4AQEA7gEAIbkBAgCmAgAhugEBAIICACECAAAAGQAgFQAA0gIAIAIAAADOAgAgFQAAzwIAIAqYAQAAzQIAMJkBAADOAgAQmgEAAM0CADCbAQEA7gEAIaIBQADyAQAhtgEBAO4BACG3AQEA7gEAIbgBAQDuAQAhuQECAKYCACG6AQEAggIAIQqYAQAAzQIAMJkBAADOAgAQmgEAAM0CADCbAQEA7gEAIaIBQADyAQAhtgEBAO4BACG3AQEA7gEAIbgBAQDuAQAhuQECAKYCACG6AQEAggIAIQabAQEAvgIAIaIBQADBAgAhtgEBAL4CACG3AQEAvgIAIbkBAgDQAgAhugEBANECACEF7AECAAAAAfMBAgAAAAH0AQIAAAAB9QECAAAAAfYBAgAAAAEB7AEBAAAAAQgEAADUAgAgBgAA0wIAIJsBAQC-AgAhogFAAMECACG2AQEAvgIAIbcBAQC-AgAhuQECANACACG6AQEA0QIAIQUcAADIBAAgHQAAzgQAIOkBAADJBAAg6gEAAM0EACDvAQAAFQAgBRwAAMYEACAdAADLBAAg6QEAAMcEACDqAQAAygQAIO8BAAAFACAIBAAA1wIAIAYAANYCACCbAQEAAAABogFAAAAAAbYBAQAAAAG3AQEAAAABuQECAAAAAboBAQAAAAEDHAAAyAQAIOkBAADJBAAg7wEAABUAIAMcAADGBAAg6QEAAMcEACDvAQAABQAgEgoAALwDACALAAC9AwAgDQAAvgMAIA8AALsDACCbAQEAAAABogFAAAAAAaMBQAAAAAHHAQEAAAAByAEBAAAAAckBEAAAAAHKAQEAAAABywEgAAAAAcwBAAC5AwAgzQECAAAAAc4BAgAAAAHPARAAAAAB0AEAALoDACDRAQEAAAABAgAAAAUAIBwAALgDACADAAAABQAgHAAAuAMAIB0AAOcCACABFQAAxQQAMBcKAADzAQAgCwAA9AEAIA0AAPYBACAOAACpAgAgDwAAugIAIJgBAAC3AgAwmQEAAAMAEJoBAAC3AgAwmwEBAAAAAaIBQADyAQAhowFAAPIBACHGAQEA7gEAIccBAQDvAQAhyAEBAO8BACHJARAAqwIAIcoBAQDvAQAhywEgAPEBACHMAQAAkwIAIM0BAgC4AgAhzgECALgCACHPARAAuQIAIdABAACTAgAg0QEBAO4BACECAAAABQAgFQAA5wIAIAIAAADgAgAgFQAA4QIAIBKYAQAA3wIAMJkBAADgAgAQmgEAAN8CADCbAQEA7gEAIaIBQADyAQAhowFAAPIBACHGAQEA7gEAIccBAQDvAQAhyAEBAO8BACHJARAAqwIAIcoBAQDvAQAhywEgAPEBACHMAQAAkwIAIM0BAgC4AgAhzgECALgCACHPARAAuQIAIdABAACTAgAg0QEBAO4BACESmAEAAN8CADCZAQAA4AIAEJoBAADfAgAwmwEBAO4BACGiAUAA8gEAIaMBQADyAQAhxgEBAO4BACHHAQEA7wEAIcgBAQDvAQAhyQEQAKsCACHKAQEA7wEAIcsBIADxAQAhzAEAAJMCACDNAQIAuAIAIc4BAgC4AgAhzwEQALkCACHQAQAAkwIAINEBAQDuAQAhDpsBAQC-AgAhogFAAMECACGjAUAAwQIAIccBAQC-AgAhyAEBAL4CACHJARAA4gIAIcoBAQC-AgAhywEgAMACACHMAQAA4wIAIM0BAgDkAgAhzgECAOQCACHPARAA5QIAIdABAADmAgAg0QEBAL4CACEF7AEQAAAAAfMBEAAAAAH0ARAAAAAB9QEQAAAAAfYBEAAAAAEC7AEBAAAABPIBAQAAAAUF7AECAAAAAfMBAgAAAAH0AQIAAAAB9QECAAAAAfYBAgAAAAEF7AEQAAAAAfMBEAAAAAH0ARAAAAAB9QEQAAAAAfYBEAAAAAEC7AEBAAAABPIBAQAAAAUSCgAA6QIAIAsAAOoCACANAADrAgAgDwAA6AIAIJsBAQC-AgAhogFAAMECACGjAUAAwQIAIccBAQC-AgAhyAEBAL4CACHJARAA4gIAIcoBAQC-AgAhywEgAMACACHMAQAA4wIAIM0BAgDkAgAhzgECAOQCACHPARAA5QIAIdABAADmAgAg0QEBAL4CACEFHAAAowQAIB0AAMMEACDpAQAApAQAIOoBAADCBAAg7wEAAAEAIAscAACgAwAwHQAApQMAMOkBAAChAwAw6gEAAKIDADDrAQAAowMAIOwBAACkAwAw7QEAAKQDADDuAQAApAMAMO8BAACkAwAw8AEAAKYDADDxAQAApwMAMAscAAD3AgAwHQAA_AIAMOkBAAD4AgAw6gEAAPkCADDrAQAA-gIAIOwBAAD7AgAw7QEAAPsCADDuAQAA-wIAMO8BAAD7AgAw8AEAAP0CADDxAQAA_gIAMAscAADsAgAwHQAA8AIAMOkBAADtAgAw6gEAAO4CADDrAQAA7wIAIOwBAADKAgAw7QEAAMoCADDuAQAAygIAMO8BAADKAgAw8AEAAPECADDxAQAAzQIAMAgDAAD2AgAgBgAA1gIAIJsBAQAAAAGiAUAAAAABtgEBAAAAAbgBAQAAAAG5AQIAAAABugEBAAAAAQIAAAAZACAcAAD1AgAgAwAAABkAIBwAAPUCACAdAADzAgAgARUAAMEEADACAAAAGQAgFQAA8wIAIAIAAADOAgAgFQAA8gIAIAabAQEAvgIAIaIBQADBAgAhtgEBAL4CACG4AQEAvgIAIbkBAgDQAgAhugEBANECACEIAwAA9AIAIAYAANMCACCbAQEAvgIAIaIBQADBAgAhtgEBAL4CACG4AQEAvgIAIbkBAgDQAgAhugEBANECACEFHAAAvAQAIB0AAL8EACDpAQAAvQQAIOoBAAC-BAAg7wEAAMQBACAIAwAA9gIAIAYAANYCACCbAQEAAAABogFAAAAAAbYBAQAAAAG4AQEAAAABuQECAAAAAboBAQAAAAEDHAAAvAQAIOkBAAC9BAAg7wEAAMQBACAPAwAAnQMAIAUAAJwDACAHAACeAwAgCAAAnwMAIJsBAQAAAAGiAUAAAAABowFAAAAAAbgBAQAAAAG8AQAAAMUBAr8BAgAAAAHAAQEAAAABwQEQAAAAAcIBQAAAAAHDAUAAAAABxQFAAAAAAQIAAAAVACAcAACbAwAgAwAAABUAIBwAAJsDACAdAACDAwAgARUAALsEADAUAwAAqQIAIAQAAKgCACAFAACtAgAgBwAArgIAIAgAAK8CACCYAQAAqgIAMJkBAAALABCaAQAAqgIAMJsBAQAAAAGiAUAA8gEAIaMBQADyAQAhtwEBAO4BACG4AQEA7gEAIbwBAACsAsUBIr8BAgCmAgAhwAEBAAAAAcEBEACrAgAhwgFAAPIBACHDAUAA8gEAIcUBQACBAgAhAgAAABUAIBUAAIMDACACAAAA_wIAIBUAAIADACAPmAEAAP4CADCZAQAA_wIAEJoBAAD-AgAwmwEBAO4BACGiAUAA8gEAIaMBQADyAQAhtwEBAO4BACG4AQEA7gEAIbwBAACsAsUBIr8BAgCmAgAhwAEBAO4BACHBARAAqwIAIcIBQADyAQAhwwFAAPIBACHFAUAAgQIAIQ-YAQAA_gIAMJkBAAD_AgAQmgEAAP4CADCbAQEA7gEAIaIBQADyAQAhowFAAPIBACG3AQEA7gEAIbgBAQDuAQAhvAEAAKwCxQEivwECAKYCACHAAQEA7gEAIcEBEACrAgAhwgFAAPIBACHDAUAA8gEAIcUBQACBAgAhC5sBAQC-AgAhogFAAMECACGjAUAAwQIAIbgBAQC-AgAhvAEAAIEDxQEivwECANACACHAAQEAvgIAIcEBEADiAgAhwgFAAMECACHDAUAAwQIAIcUBQACCAwAhAewBAAAAxQECAewBQAAAAAEPAwAAhQMAIAUAAIQDACAHAACGAwAgCAAAhwMAIJsBAQC-AgAhogFAAMECACGjAUAAwQIAIbgBAQC-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_AQIAAAABAgAAAAkAIBwAALUDACADAAAACQAgHAAAtQMAIB0AAKsDACABFQAArwQAMA8DAACpAgAgBAAAqAIAIAYAALYCACCYAQAAtAIAMJkBAAAHABCaAQAAtAIAMJsBAQAAAAGiAUAA8gEAIaMBQADyAQAhtwEBAO4BACG4AQEA7gEAIbwBAAC1ArwBIr0BAQCCAgAhvgFAAPIBACG_AQIApgIAIQIAAAAJACAVAACrAwAgAgAAAKgDACAVAACpAwAgDJgBAACnAwAwmQEAAKgDABCaAQAApwMAMJsBAQDuAQAhogFAAPIBACGjAUAA8gEAIbcBAQDuAQAhuAEBAO4BACG8AQAAtQK8ASK9AQEAggIAIb4BQADyAQAhvwECAKYCACEMmAEAAKcDADCZAQAAqAMAEJoBAACnAwAwmwEBAO4BACGiAUAA8gEAIaMBQADyAQAhtwEBAO4BACG4AQEA7gEAIbwBAAC1ArwBIr0BAQCCAgAhvgFAAPIBACG_AQIApgIAIQibAQEAvgIAIaIBQADBAgAhowFAAMECACG4AQEAvgIAIbwBAACqA7wBIr0BAQDRAgAhvgFAAMECACG_AQIA0AIAIQHsAQAAALwBAgoDAACsAwAgBgAArQMAIJsBAQC-AgAhogFAAMECACGjAUAAwQIAIbgBAQC-AgAhvAEAAKoDvAEivQEBANECACG-AUAAwQIAIb8BAgDQAgAhBRwAAKUEACAdAACtBAAg6QEAAKYEACDqAQAArAQAIO8BAADEAQAgBxwAAK4DACAdAACxAwAg6QEAAK8DACDqAQAAsAMAIO0BAAALACDuAQAACwAg7wEAABUAIA8DAACdAwAgBAAAtAMAIAcAAJ4DACAIAACfAwAgmwEBAAAAAaIBQAAAAAGjAUAAAAABtwEBAAAAAbgBAQAAAAG8AQAAAMUBAr8BAgAAAAHBARAAAAABwgFAAAAAAcMBQAAAAAHFAUAAAAABAgAAABUAIBwAAK4DACADAAAACwAgHAAArgMAIB0AALIDACARAAAACwAgAwAAhQMAIAQAALMDACAHAACGAwAgCAAAhwMAIBUAALIDACCbAQEAvgIAIaIBQADBAgAhowFAAMECACG3AQEAvgIAIbgBAQC-AgAhvAEAAIEDxQEivwECANACACHBARAA4gIAIcIBQADBAgAhwwFAAMECACHFAUAAggMAIQ8DAACFAwAgBAAAswMAIAcAAIYDACAIAACHAwAgmwEBAL4CACGiAUAAwQIAIaMBQADBAgAhtwEBAL4CACG4AQEAvgIAIbwBAACBA8UBIr8BAgDQAgAhwQEQAOICACHCAUAAwQIAIcMBQADBAgAhxQFAAIIDACEFHAAApwQAIB0AAKoEACDpAQAAqAQAIOoBAACpBAAg7wEAAAUAIAMcAACnBAAg6QEAAKgEACDvAQAABQAgCgMAALYDACAGAAC3AwAgmwEBAAAAAaIBQAAAAAGjAUAAAAABuAEBAAAAAbwBAAAAvAECvQEBAAAAAb4BQAAAAAG_AQIAAAABAxwAAKUEACDpAQAApgQAIO8BAADEAQAgAxwAAK4DACDpAQAArwMAIO8BAAAVACASCgAAvAMAIAsAAL0DACANAAC-AwAgDwAAuwMAIJsBAQAAAAGiAUAAAAABowFAAAAAAccBAQAAAAHIAQEAAAAByQEQAAAAAcoBAQAAAAHLASAAAAABzAEAALkDACDNAQIAAAABzgECAAAAAc8BEAAAAAHQAQAAugMAINEBAQAAAAEB7AEBAAAABAHsAQEAAAAEAxwAAKMEACDpAQAApAQAIO8BAAABACAEHAAAoAMAMOkBAAChAwAw6wEAAKMDACDvAQAApAMAMAQcAAD3AgAw6QEAAPgCADDrAQAA-gIAIO8BAAD7AgAwBBwAAOwCADDpAQAA7QIAMOsBAADvAgAg7wEAAMoCADAPBAAAtAMAIAUAAJwDACAHAACeAwAgCAAAnwMAIJsBAQAAAAGiAUAAAAABowFAAAAAAbcBAQAAAAG8AQAAAMUBAr8BAgAAAAHAAQEAAAABwQEQAAAAAcIBQAAAAAHDAUAAAAABxQFAAAAAAQIAAAAVACAcAADHAwAgAwAAABUAIBwAAMcDACAdAADGAwAgARUAAKIEADACAAAAFQAgFQAAxgMAIAIAAAD_AgAgFQAAxQMAIAubAQEAvgIAIaIBQADBAgAhowFAAMECACG3AQEAvgIAIbwBAACBA8UBIr8BAgDQAgAhwAEBAL4CACHBARAA4gIAIcIBQADBAgAhwwFAAMECACHFAUAAggMAIQ8EAACzAwAgBQAAhAMAIAcAAIYDACAIAACHAwAgmwEBAL4CACGiAUAAwQIAIaMBQADBAgAhtwEBAL4CACG8AQAAgQPFASK_AQIA0AIAIcABAQC-AgAhwQEQAOICACHCAUAAwQIAIcMBQADBAgAhxQFAAIIDACEPBAAAtAMAIAUAAJwDACAHAACeAwAgCAAAnwMAIJsBAQAAAAGiAUAAAAABowFAAAAAAbcBAQAAAAG8AQAAAMUBAr8BAgAAAAHAAQEAAAABwQEQAAAAAcIBQAAAAAHDAUAAAAABxQFAAAAAAQoEAADSAwAgBgAAtwMAIJsBAQAAAAGiAUAAAAABowFAAAAAAbcBAQAAAAG8AQAAALwBAr0BAQAAAAG-AUAAAAABvwECAAAAAQIAAAAJACAcAADRAwAgAwAAAAkAIBwAANEDACAdAADPAwAgARUAAKEEADACAAAACQAgFQAAzwMAIAIAAACoAwAgFQAAzgMAIAibAQEAvgIAIaIBQADBAgAhowFAAMECACG3AQEAvgIAIbwBAACqA7wBIr0BAQDRAgAhvgFAAMECACG_AQIA0AIAIQoEAADQAwAgBgAArQMAIJsBAQC-AgAhogFAAMECACGjAUAAwQIAIbcBAQC-AgAhvAEAAKoDvAEivQEBANECACG-AUAAwQIAIb8BAgDQAgAhBRwAAJwEACAdAACfBAAg6QEAAJ0EACDqAQAAngQAIO8BAAAFACAKBAAA0gMAIAYAALcDACCbAQEAAAABogFAAAAAAaMBQAAAAAG3AQEAAAABvAEAAAC8AQK9AQEAAAABvgFAAAAAAb8BAgAAAAEDHAAAnAQAIOkBAACdBAAg7wEAAAUAIAQcAADIAwAw6QEAAMkDADDrAQAAywMAIO8BAACkAwAwBBwAAL8DADDpAQAAwAMAMOsBAADCAwAg7wEAAPsCADAEHAAA2AIAMOkBAADZAgAw6wEAANsCACDvAQAA3AIAMAQcAADGAgAw6QEAAMcCADDrAQAAyQIAIO8BAADKAgAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUcAACXBAAgHQAAmgQAIOkBAACYBAAg6gEAAJkEACDvAQAAxAEAIAMcAACXBAAg6QEAAJgEACDvAQAAxAEAIAAAAAAABRwAAJIEACAdAACVBAAg6QEAAJMEACDqAQAAlAQAIO8BAAAVACADHAAAkgQAIOkBAACTBAAg7wEAABUAIAAAAAscAACABAAwHQAAhAQAMOkBAACBBAAw6gEAAIIEADDrAQAAgwQAIOwBAADcAgAw7QEAANwCADDuAQAA3AIAMO8BAADcAgAw8AEAAIUEADDxAQAA3wIAMBIKAAC8AwAgCwAAvQMAIA0AAL4DACAOAAD0AwAgmwEBAAAAAaIBQAAAAAGjAUAAAAABxgEBAAAAAccBAQAAAAHIAQEAAAAByQEQAAAAAcoBAQAAAAHLASAAAAABzAEAALkDACDNAQIAAAABzgECAAAAAc8BEAAAAAHQAQAAugMAIAIAAAAFACAcAACIBAAgAwAAAAUAIBwAAIgEACAdAACHBAAgARUAAJEEADACAAAABQAgFQAAhwQAIAIAAADgAgAgFQAAhgQAIA6bAQEAvgIAIaIBQADBAgAhowFAAMECACHGAQEAvgIAIccBAQC-AgAhyAEBAL4CACHJARAA4gIAIcoBAQC-AgAhywEgAMACACHMAQAA4wIAIM0BAgDkAgAhzgECAOQCACHPARAA5QIAIdABAADmAgAgEgoAAOkCACALAADqAgAgDQAA6wIAIA4AAPMDACCbAQEAvgIAIaIBQADBAgAhowFAAMECACHGAQEAvgIAIccBAQC-AgAhyAEBAL4CACHJARAA4gIAIcoBAQC-AgAhywEgAMACACHMAQAA4wIAIM0BAgDkAgAhzgECAOQCACHPARAA5QIAIdABAADmAgAgEgoAALwDACALAAC9AwAgDQAAvgMAIA4AAPQDACCbAQEAAAABogFAAAAAAaMBQAAAAAHGAQEAAAABxwEBAAAAAcgBAQAAAAHJARAAAAABygEBAAAAAcsBIAAAAAHMAQAAuQMAIM0BAgAAAAHOAQIAAAABzwEQAAAAAdABAAC6AwAgBBwAAIAEADDpAQAAgQQAMOsBAACDBAAg7wEAANwCADAGAwAAjAQAIAQAAIsEACAFAACNBAAgBwAAjgQAIAgAAI8EACDFAQAA2wMAIAgKAADXAwAgCwAA2AMAIA0AANoDACAOAACMBAAgDwAAkAQAIM0BAADbAwAgzgEAANsDACDPAQAA2wMAIAQKAADXAwAgCwAA2AMAIAwAANkDACANAADaAwAgBAMAAIwEACAEAACLBAAgBgAAigQAIL0BAADbAwAgAAQDAACMBAAgBAAAiwQAIAYAAIoEACC6AQAA2wMAIAEMAADZAwAgDpsBAQAAAAGiAUAAAAABowFAAAAAAcYBAQAAAAHHAQEAAAAByAEBAAAAAckBEAAAAAHKAQEAAAABywEgAAAAAcwBAAC5AwAgzQECAAAAAc4BAgAAAAHPARAAAAAB0AEAALoDACAQAwAAnQMAIAQAALQDACAFAACcAwAgCAAAnwMAIJsBAQAAAAGiAUAAAAABowFAAAAAAbcBAQAAAAG4AQEAAAABvAEAAADFAQK_AQIAAAABwAEBAAAAAcEBEAAAAAHCAUAAAAABwwFAAAAAAcUBQAAAAAECAAAAFQAgHAAAkgQAIAMAAAALACAcAACSBAAgHQAAlgQAIBIAAAALACADAACFAwAgBAAAswMAIAUAAIQDACAIAACHAwAgFQAAlgQAIJsBAQC-AgAhogFAAMECACGjAUAAwQIAIbcBAQC-AgAhuAEBAL4CACG8AQAAgQPFASK_AQIA0AIAIcABAQC-AgAhwQEQAOICACHCAUAAwQIAIcMBQADBAgAhxQFAAIIDACEQAwAAhQMAIAQAALMDACAFAACEAwAgCAAAhwMAIJsBAQC-AgAhogFAAMECACGjAUAAwQIAIbcBAQC-AgAhuAEBAL4CACG8AQAAgQPFASK_AQIA0AIAIcABAQC-AgAhwQEQAOICACHCAUAAwQIAIcMBQADBAgAhxQFAAIIDACELCgAA0wMAIAsAANQDACANAADWAwAgmwEBAAAAAZwBAQAAAAGdAQEAAAABngEBAAAAAaABAAAAoAECoQEgAAAAAaIBQAAAAAGjAUAAAAABAgAAAMQBACAcAACXBAAgAwAAAMcBACAcAACXBAAgHQAAmwQAIA0AAADHAQAgCgAAwgIAIAsAAMMCACANAADFAgAgFQAAmwQAIJsBAQC-AgAhnAEBAL4CACGdAQEAvgIAIZ4BAQC-AgAhoAEAAL8CoAEioQEgAMACACGiAUAAwQIAIaMBQADBAgAhCwoAAMICACALAADDAgAgDQAAxQIAIJsBAQC-AgAhnAEBAL4CACGdAQEAvgIAIZ4BAQC-AgAhoAEAAL8CoAEioQEgAMACACGiAUAAwQIAIaMBQADBAgAhEwsAAL0DACANAAC-AwAgDgAA9AMAIA8AALsDACCbAQEAAAABogFAAAAAAaMBQAAAAAHGAQEAAAABxwEBAAAAAcgBAQAAAAHJARAAAAABygEBAAAAAcsBIAAAAAHMAQAAuQMAIM0BAgAAAAHOAQIAAAABzwEQAAAAAdABAAC6AwAg0QEBAAAAAQIAAAAFACAcAACcBAAgAwAAAAMAIBwAAJwEACAdAACgBAAgFQAAAAMAIAsAAOoCACANAADrAgAgDgAA8wMAIA8AAOgCACAVAACgBAAgmwEBAL4CACGiAUAAwQIAIaMBQADBAgAhxgEBAL4CACHHAQEAvgIAIcgBAQC-AgAhyQEQAOICACHKAQEAvgIAIcsBIADAAgAhzAEAAOMCACDNAQIA5AIAIc4BAgDkAgAhzwEQAOUCACHQAQAA5gIAINEBAQC-AgAhEwsAAOoCACANAADrAgAgDgAA8wMAIA8AAOgCACCbAQEAvgIAIaIBQADBAgAhowFAAMECACHGAQEAvgIAIccBAQC-AgAhyAEBAL4CACHJARAA4gIAIcoBAQC-AgAhywEgAMACACHMAQAA4wIAIM0BAgDkAgAhzgECAOQCACHPARAA5QIAIdABAADmAgAg0QEBAL4CACEImwEBAAAAAaIBQAAAAAGjAUAAAAABtwEBAAAAAbwBAAAAvAECvQEBAAAAAb4BQAAAAAG_AQIAAAABC5sBAQAAAAGiAUAAAAABowFAAAAAAbcBAQAAAAG8AQAAAMUBAr8BAgAAAAHAAQEAAAABwQEQAAAAAcIBQAAAAAHDAUAAAAABxQFAAAAAAQWbAQEAAAABnAEBAAAAAaIBQAAAAAGjAUAAAAAB5gEBAAAAAQIAAAABACAcAACjBAAgCwsAANQDACAMAADVAwAgDQAA1gMAIJsBAQAAAAGcAQEAAAABnQEBAAAAAZ4BAQAAAAGgAQAAAKABAqEBIAAAAAGiAUAAAAABowFAAAAAAQIAAADEAQAgHAAApQQAIBMKAAC8AwAgDQAAvgMAIA4AAPQDACAPAAC7AwAgmwEBAAAAAaIBQAAAAAGjAUAAAAABxgEBAAAAAccBAQAAAAHIAQEAAAAByQEQAAAAAcoBAQAAAAHLASAAAAABzAEAALkDACDNAQIAAAABzgECAAAAAc8BEAAAAAHQAQAAugMAINEBAQAAAAECAAAABQAgHAAApwQAIAMAAAADACAcAACnBAAgHQAAqwQAIBUAAAADACAKAADpAgAgDQAA6wIAIA4AAPMDACAPAADoAgAgFQAAqwQAIJsBAQC-AgAhogFAAMECACGjAUAAwQIAIcYBAQC-AgAhxwEBAL4CACHIAQEAvgIAIckBEADiAgAhygEBAL4CACHLASAAwAIAIcwBAADjAgAgzQECAOQCACHOAQIA5AIAIc8BEADlAgAh0AEAAOYCACDRAQEAvgIAIRMKAADpAgAgDQAA6wIAIA4AAPMDACAPAADoAgAgmwEBAL4CACGiAUAAwQIAIaMBQADBAgAhxgEBAL4CACHHAQEAvgIAIcgBAQC-AgAhyQEQAOICACHKAQEAvgIAIcsBIADAAgAhzAEAAOMCACDNAQIA5AIAIc4BAgDkAgAhzwEQAOUCACHQAQAA5gIAINEBAQC-AgAhAwAAAMcBACAcAAClBAAgHQAArgQAIA0AAADHAQAgCwAAwwIAIAwAAMQCACANAADFAgAgFQAArgQAIJsBAQC-AgAhnAEBAL4CACGdAQEAvgIAIZ4BAQC-AgAhoAEAAL8CoAEioQEgAMACACGiAUAAwQIAIaMBQADBAgAhCwsAAMMCACAMAADEAgAgDQAAxQIAIJsBAQC-AgAhnAEBAL4CACGdAQEAvgIAIZ4BAQC-AgAhoAEAAL8CoAEioQEgAMACACGiAUAAwQIAIaMBQADBAgAhCJsBAQAAAAGiAUAAAAABowFAAAAAAbgBAQAAAAG8AQAAALwBAr0BAQAAAAG-AUAAAAABvwECAAAAAQsKAADTAwAgDAAA1QMAIA0AANYDACCbAQEAAAABnAEBAAAAAZ0BAQAAAAGeAQEAAAABoAEAAACgAQKhASAAAAABogFAAAAAAaMBQAAAAAECAAAAxAEAIBwAALAEACALAwAAtgMAIAQAANIDACCbAQEAAAABogFAAAAAAaMBQAAAAAG3AQEAAAABuAEBAAAAAbwBAAAAvAECvQEBAAAAAb4BQAAAAAG_AQIAAAABAgAAAAkAIBwAALIEACANmwEBAAAAAaIBQAAAAAGjAUAAAAABvAEAAADYAQLVARAAAAAB1gEBAAAAAdkBAAAA2QEC2gEBAAAAAdsBAQAAAAHcAQEAAAAB3QEBAAAAAd4BgAAAAAHfAUAAAAABAwAAAMcBACAcAACwBAAgHQAAtwQAIA0AAADHAQAgCgAAwgIAIAwAAMQCACANAADFAgAgFQAAtwQAIJsBAQC-AgAhnAEBAL4CACGdAQEAvgIAIZ4BAQC-AgAhoAEAAL8CoAEioQEgAMACACGiAUAAwQIAIaMBQADBAgAhCwoAAMICACAMAADEAgAgDQAAxQIAIJsBAQC-AgAhnAEBAL4CACGdAQEAvgIAIZ4BAQC-AgAhoAEAAL8CoAEioQEgAMACACGiAUAAwQIAIaMBQADBAgAhAwAAAAcAIBwAALIEACAdAAC6BAAgDQAAAAcAIAMAAKwDACAEAADQAwAgFQAAugQAIJsBAQC-AgAhogFAAMECACGjAUAAwQIAIbcBAQC-AgAhuAEBAL4CACG8AQAAqgO8ASK9AQEA0QIAIb4BQADBAgAhvwECANACACELAwAArAMAIAQAANADACCbAQEAvgIAIaIBQADBAgAhowFAAMECACG3AQEAvgIAIbgBAQC-AgAhvAEAAKoDvAEivQEBANECACG-AUAAwQIAIb8BAgDQAgAhC5sBAQAAAAGiAUAAAAABowFAAAAAAbgBAQAAAAG8AQAAAMUBAr8BAgAAAAHAAQEAAAABwQEQAAAAAcIBQAAAAAHDAUAAAAABxQFAAAAAAQsKAADTAwAgCwAA1AMAIAwAANUDACCbAQEAAAABnAEBAAAAAZ0BAQAAAAGeAQEAAAABoAEAAACgAQKhASAAAAABogFAAAAAAaMBQAAAAAECAAAAxAEAIBwAALwEACADAAAAxwEAIBwAALwEACAdAADABAAgDQAAAMcBACAKAADCAgAgCwAAwwIAIAwAAMQCACAVAADABAAgmwEBAL4CACGcAQEAvgIAIZ0BAQC-AgAhngEBAL4CACGgAQAAvwKgASKhASAAwAIAIaIBQADBAgAhowFAAMECACELCgAAwgIAIAsAAMMCACAMAADEAgAgmwEBAL4CACGcAQEAvgIAIZ0BAQC-AgAhngEBAL4CACGgAQAAvwKgASKhASAAwAIAIaIBQADBAgAhowFAAMECACEGmwEBAAAAAaIBQAAAAAG2AQEAAAABuAEBAAAAAbkBAgAAAAG6AQEAAAABAwAAACcAIBwAAKMEACAdAADEBAAgBwAAACcAIBUAAMQEACCbAQEAvgIAIZwBAQC-AgAhogFAAMECACGjAUAAwQIAIeYBAQC-AgAhBZsBAQC-AgAhnAEBAL4CACGiAUAAwQIAIaMBQADBAgAh5gEBAL4CACEOmwEBAAAAAaIBQAAAAAGjAUAAAAABxwEBAAAAAcgBAQAAAAHJARAAAAABygEBAAAAAcsBIAAAAAHMAQAAuQMAIM0BAgAAAAHOAQIAAAABzwEQAAAAAdABAAC6AwAg0QEBAAAAARMKAAC8AwAgCwAAvQMAIA4AAPQDACAPAAC7AwAgmwEBAAAAAaIBQAAAAAGjAUAAAAABxgEBAAAAAccBAQAAAAHIAQEAAAAByQEQAAAAAcoBAQAAAAHLASAAAAABzAEAALkDACDNAQIAAAABzgECAAAAAc8BEAAAAAHQAQAAugMAINEBAQAAAAECAAAABQAgHAAAxgQAIBADAACdAwAgBAAAtAMAIAUAAJwDACAHAACeAwAgmwEBAAAAAaIBQAAAAAGjAUAAAAABtwEBAAAAAbgBAQAAAAG8AQAAAMUBAr8BAgAAAAHAAQEAAAABwQEQAAAAAcIBQAAAAAHDAUAAAAABxQFAAAAAAQIAAAAVACAcAADIBAAgAwAAAAMAIBwAAMYEACAdAADMBAAgFQAAAAMAIAoAAOkCACALAADqAgAgDgAA8wMAIA8AAOgCACAVAADMBAAgmwEBAL4CACGiAUAAwQIAIaMBQADBAgAhxgEBAL4CACHHAQEAvgIAIcgBAQC-AgAhyQEQAOICACHKAQEAvgIAIcsBIADAAgAhzAEAAOMCACDNAQIA5AIAIc4BAgDkAgAhzwEQAOUCACHQAQAA5gIAINEBAQC-AgAhEwoAAOkCACALAADqAgAgDgAA8wMAIA8AAOgCACCbAQEAvgIAIaIBQADBAgAhowFAAMECACHGAQEAvgIAIccBAQC-AgAhyAEBAL4CACHJARAA4gIAIcoBAQC-AgAhywEgAMACACHMAQAA4wIAIM0BAgDkAgAhzgECAOQCACHPARAA5QIAIdABAADmAgAg0QEBAL4CACEDAAAACwAgHAAAyAQAIB0AAM8EACASAAAACwAgAwAAhQMAIAQAALMDACAFAACEAwAgBwAAhgMAIBUAAM8EACCbAQEAvgIAIaIBQADBAgAhowFAAMECACG3AQEAvgIAIbgBAQC-AgAhvAEAAIEDxQEivwECANACACHAAQEAvgIAIcEBEADiAgAhwgFAAMECACHDAUAAwQIAIcUBQACCAwAhEAMAAIUDACAEAACzAwAgBQAAhAMAIAcAAIYDACCbAQEAvgIAIaIBQADBAgAhowFAAMECACG3AQEAvgIAIbgBAQC-AgAhvAEAAIEDxQEivwECANACACHAAQEAvgIAIcEBEADiAgAhwgFAAMECACHDAUAAwQIAIcUBQACCAwAhBpsBAQAAAAGiAUAAAAABtgEBAAAAAbcBAQAAAAG5AQIAAAABugEBAAAAAQIJAAsMBgIGCQAKCh8ECyAFDSEHDgADDwABBQkACQoKBAsWBQwXAg0aBwMDAAMEAAIGDAUGAwADBAACBQAEBxAGCBIHCQAIAQYABQMDAAMEAAIGAAUBBxMABAobAAscAAwdAA0eAAMKIgALIwANJAABDCUAAAAAAwkAECIAESMAEgAAAAMJABAiABEjABIBBgAFAQYABQUJABciABojABs0ABg1ABkAAAAAAAUJABciABojABs0ABg1ABkCDgADDwABAg4AAw8AAQUJACAiACMjACQ0ACE1ACIAAAAAAAUJACAiACMjACQ0ACE1ACIDAwADBAACBQAEAwMAAwQAAgUABAUJACkiACwjAC00ACo1ACsAAAAAAAUJACkiACwjAC00ACo1ACsCAwADBAACAgMAAwQAAgUJADIiADUjADY0ADM1ADQAAAAAAAUJADIiADUjADY0ADM1ADQDAwADBAACBgAFAwMAAwQAAgYABQUJADsiAD4jAD80ADw1AD0AAAAAAAUJADsiAD4jAD80ADw1AD0AAAADCQBFIgBGIwBHAAAAAwkARSIARiMARwAAAwkATCIATSMATgAAAAMJAEwiAE0jAE4QAgERJgESKQETKgEUKwEWLQEXLwwYMA0ZMgEaNAwbNQ4eNgEfNwEgOAwkOw8lPBMmPQYnPgYoPwYpQAYqQQYrQwYsRQwtRhQuSAYvSgwwSxUxTAYyTQYzTgw2URY3Uhw4UwI5VAI6VQI7VgI8VwI9WQI-Www_XB1AXgJBYAxCYR5DYgJEYwJFZAxGZx9HaCVIaQVJagVKawVLbAVMbQVNbwVOcQxPciZQdAVRdgxSdydTeAVUeQVVegxWfShXfi5YfwRZgAEEWoEBBFuCAQRcgwEEXYUBBF6HAQxfiAEvYIoBBGGMAQxijQEwY44BBGSPAQRlkAEMZpMBMWeUATdolQEHaZYBB2qXAQdrmAEHbJkBB22bAQdunQEMb54BOHCgAQdxogEMcqMBOXOkAQd0pQEHdaYBDHapATp3qgFAeKwBQXmtAUF6sAFBe7EBQXyyAUF9tAFBfrYBDH-3AUKAAbkBQYEBuwEMggG8AUODAb0BQYQBvgFBhQG_AQyGAcIBRIcBwwFIiAHFAQOJAcYBA4oByQEDiwHKAQOMAcsBA40BzQEDjgHPAQyPAdABSZAB0gEDkQHUAQySAdUBSpMB1gEDlAHXAQOVAdgBDJYB2wFLlwHcAU8"
};
async function decodeBase64AsWasm(wasmBase64) {
	const { Buffer } = await import("node:buffer");
	const wasmArray = Buffer.from(wasmBase64, "base64");
	return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
	getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
	getQueryCompilerWasmModule: async () => {
		const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
		return await decodeBase64AsWasm(wasm);
	},
	importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
	return _prisma_client_runtime_client.getPrismaClient(config);
}
_prisma_client_runtime_client.Extensions.getExtensionContext;
_prisma_client_runtime_client.NullTypes.DbNull, _prisma_client_runtime_client.NullTypes.JsonNull, _prisma_client_runtime_client.NullTypes.AnyNull;
_prisma_client_runtime_client.makeStrictEnum({
	ReadUncommitted: "ReadUncommitted",
	ReadCommitted: "ReadCommitted",
	RepeatableRead: "RepeatableRead",
	Serializable: "Serializable"
});
_prisma_client_runtime_client.Extensions.defineExtension;
//#endregion
//#region src/generated/prisma/enums.ts
const UserRole = {
	TENANT: "TENANT",
	LANDLORD: "LANDLORD",
	ADMIN: "ADMIN"
};
const RentalRequestStatus = {
	PENDING: "PENDING",
	APPROVED: "APPROVED",
	REJECTED: "REJECTED",
	CANCELLED: "CANCELLED"
};
const PaymentStatus = {
	PENDING: "PENDING",
	PROCESSING: "PROCESSING",
	PAID: "PAID",
	FAILED: "FAILED",
	REFUNDED: "REFUNDED",
	CANCELLED: "CANCELLED"
};
const RentalAgreementStatus = {
	PENDING_PAYMENT: "PENDING_PAYMENT",
	ACTIVE: "ACTIVE",
	COMPLETED: "COMPLETED",
	TERMINATED: "TERMINATED",
	CANCELLED: "CANCELLED"
};
const PaymentProvider = { STRIPE: "STRIPE" };
//#endregion
//#region src/generated/prisma/client.ts
globalThis["__dirname"] = node_path.dirname((0, node_url.fileURLToPath)(require("url").pathToFileURL(__filename).href));
//#endregion
//#region src/lib/prisma.ts
const prisma = new (getPrismaClientClass())({ adapter: new _prisma_adapter_pg.PrismaPg({ connectionString: `${process.env.DATABASE_URL}` }) });
//#endregion
//#region src/utils/catchAsync.ts
const catchAsync = (fn) => {
	return async (req, res, next) => {
		try {
			await fn(req, res, next);
		} catch (error) {
			next(error);
		}
	};
};
//#endregion
//#region src/utils/jwt.ts
const createAccessToken = (payload) => jsonwebtoken.default.sign(payload, config_default.jwt_access_secret, { expiresIn: config_default.jwtAccessExpiresIn });
const createRefreshToken = (payload) => jsonwebtoken.default.sign(payload, config_default.jwt_refresh_secret, { expiresIn: config_default.jwtRefreshExpiresIn });
const verifyAccessToken = (token) => jsonwebtoken.default.verify(token, config_default.jwt_access_secret);
const verifyRefreshToken = (token) => jsonwebtoken.default.verify(token, config_default.jwt_refresh_secret);
//#endregion
//#region src/middlewares/authentication.ts
const authenticate = catchAsync(async (req, _res, next) => {
	const header = req.headers.authorization;
	const token = header?.startsWith("Bearer ") ? header.split(" ")[1] : req.cookies?.accessToken;
	if (!token) throw new AppError(http_status.default.UNAUTHORIZED, "Please login to continue");
	const decoded = verifyAccessToken(token);
	const user = await prisma.user.findUnique({
		where: { id: decoded.userId },
		select: {
			id: true,
			name: true,
			email: true,
			role: true,
			isActive: true
		}
	});
	if (!user) throw new AppError(http_status.default.UNAUTHORIZED, "User no longer exists");
	if (!user.isActive) throw new AppError(http_status.default.FORBIDDEN, "Your account is inactive");
	req.user = user;
	next();
});
//#endregion
//#region src/middlewares/validateRequest.ts
const validateRequest = (schema) => (req, _res, next) => {
	try {
		req.body = schema.parse(req.body);
		next();
	} catch (error) {
		next(error);
	}
};
//#endregion
//#region src/modules/auth/auth.service.ts
const register$1 = async (payload) => {
	const { name, email, password, role } = payload;
	if (await prisma.user.findUnique({ where: { email } })) throw new AppError(http_status.default.CONFLICT, "User already exists with this email");
	const hashedPassword = await bcryptjs.default.hash(password, Number(config_default.bcrypt_salt_rounds));
	return prisma.user.create({
		data: {
			name,
			email,
			password: hashedPassword,
			role
		},
		omit: {
			password: true,
			createdAt: true,
			updatedAt: true
		}
	});
};
const login = async (payload) => {
	const { email, password } = payload;
	const user = await prisma.user.findUnique({
		where: { email },
		select: {
			id: true,
			name: true,
			email: true,
			password: true,
			role: true,
			isActive: true
		}
	});
	if (!user) throw new AppError(http_status.default.UNAUTHORIZED, "Invalid credentials", [{ message: "Email or Password didn't match" }]);
	if (!await bcryptjs.default.compare(password, user.password)) throw new AppError(http_status.default.UNAUTHORIZED, "Invalid credentials", [{ message: "Email or Password didn't match" }]);
	if (!user.isActive) throw new AppError(http_status.default.FORBIDDEN, "Account is not active. Please contact support.");
	const tokenPayload = {
		userId: user.id,
		role: user.role
	};
	const accessToken = createAccessToken(tokenPayload);
	const refreshToken = createRefreshToken(tokenPayload);
	return {
		user: await prisma.user.findUnique({
			where: { email: payload.email },
			omit: { password: true }
		}),
		accessToken,
		refreshToken
	};
};
const refreshAccessToken = async (payload) => {
	const verifiedRefreshToken = verifyRefreshToken(payload);
	const user = await prisma.user.findUnique({
		where: { id: verifiedRefreshToken.userId },
		select: {
			id: true,
			isActive: true,
			role: true
		}
	});
	if (!user) throw new AppError(http_status.default.UNAUTHORIZED, "Authentication required. Please login to continue");
	if (!user.isActive) throw new AppError(http_status.default.UNAUTHORIZED, "Account is inactive. Please contact support");
	return createAccessToken({
		userId: user.id,
		role: user.role
	});
};
const getMe$1 = async (userId) => {
	const result = await prisma.user.findUnique({
		where: { id: userId },
		omit: { password: true }
	});
	if (!result) throw new AppError(404, "User not found!");
	return result;
};
const authService = {
	register: register$1,
	login,
	refreshAccessToken,
	getMe: getMe$1
};
const authController = {
	register: catchAsync(async (req, res) => {
		const registeredUserData = await authService.register(req.body);
		sendResponse(res, {
			statusCode: http_status.default.CREATED,
			success: true,
			message: "User created successfully",
			data: registeredUserData
		});
	}),
	loginUser: catchAsync(async (req, res) => {
		const result = await authService.login(req.body);
		res.cookie("accessToken", result.accessToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "development" ? false : true,
			sameSite: "strict"
		});
		res.cookie("refreshToken", result.refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "development" ? false : true,
			sameSite: "strict"
		});
		sendResponse(res, {
			statusCode: http_status.default.OK,
			success: true,
			message: "User logged in successfully!",
			data: {
				user: result.user,
				accessToken: result.accessToken
			}
		});
	}),
	refreshToken: catchAsync(async (req, res) => {
		const token = req.cookies.refreshToken;
		if (!token) throw new AppError(401, "Refresh token is missing!");
		const result = await authService.refreshAccessToken(token);
		res.cookie("accessToken", result, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict"
		});
		sendResponse(res, {
			statusCode: http_status.default.OK,
			success: true,
			message: "Token refreshed successfully",
			data: { refreshed: true }
		});
	}),
	getMe: catchAsync(async (req, res) => {
		await authService.getMe(req.user.id);
		sendResponse(res, {
			statusCode: http_status.default.OK,
			success: true,
			message: "User data retrieved successfully",
			data: req.user
		});
	}),
	logout: catchAsync(async (_req, res) => {
		res.clearCookie("accessToken", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict"
		});
		res.clearCookie("refreshToken", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "development" ? false : true,
			sameSite: "strict"
		});
		sendResponse(res, {
			statusCode: http_status.default.OK,
			success: true,
			message: "Logged out successfully"
		});
	})
};
//#endregion
//#region src/modules/auth/auth.validation.ts
const registerSchema = zod.z.object({
	name: zod.z.string({ error: (issue) => issue.input == null ? "Name is required" : "Name must be a string" }).trim().min(3, "Name must be at least 3 characters").max(255, "Name cannot exceed 255 characters"),
	email: zod.z.email({ error: (issue) => issue.input == null ? "Email is required" : "Please provide a valid email" }),
	password: zod.z.string("Password is required").min(8, "Password must be at least 8 characters").max(255, "Password cannot exceed 255 characters"),
	role: zod.z.enum([UserRole.TENANT, UserRole.LANDLORD], { error: (issue) => issue.input == null ? "Role is required" : "Invalid role! Role can either be TENANT or LANDLORD" })
});
const loginSchema = zod.z.object({
	email: zod.z.email({ error: (issue) => issue.input == null ? "Email is required" : "Please provide a valid email" }),
	password: zod.z.string("Password is required").trim().min(1, "Password is required")
});
//#endregion
//#region src/modules/auth/auth.route.ts
const router$7 = (0, express.Router)();
router$7.post("/register", validateRequest(registerSchema), authController.register);
router$7.post("/login", validateRequest(loginSchema), authController.loginUser);
router$7.get("/me", authenticate, authController.getMe);
router$7.post("/logout", authenticate, authController.logout);
router$7.post("/refresh-token", authController.refreshToken);
const authRoutes = router$7;
//#endregion
//#region src/middlewares/authorization.ts
const authorize = (...roles) => (req, _res, next) => {
	if (!req.user) throw new AppError(http_status.default.UNAUTHORIZED, "Please login to continue");
	if (!roles.includes(req.user.role)) throw new AppError(http_status.default.FORBIDDEN, "You are not allowed to perform this action");
	next();
};
//#endregion
//#region src/utils/validateEnum.ts
const isValidEnumValue = (enumObject, value) => {
	return Object.values(enumObject).includes(value);
};
//#endregion
//#region src/modules/admin/admin.service.ts
const getAllUsers$1 = async (query) => {
	const limit = Math.max(1, Number(query.limit) || 10);
	const page = Math.max(1, Number(query.page) || 1);
	const skip = (page - 1) * limit;
	const sortBy = query.sortBy && ["createdAt", "updatedAt"].includes(query.sortBy) ? query.sortBy : "createdAt";
	const sortOrder = query.sortOrder && ["asc", "desc"].includes(query.sortOrder) ? query.sortOrder : "desc";
	const andCondition = [];
	const { isActive, role } = query;
	if (typeof isActive !== "undefined") {
		if (!["true", "false"].includes(isActive)) throw new AppError(http_status.default.BAD_REQUEST, "isActive must be true or false");
		andCondition.push({ isActive: isActive === "true" ? true : false });
	}
	if (role) {
		if (!isValidEnumValue(UserRole, role)) throw new AppError(http_status.default.BAD_REQUEST, "Invalid Role");
		andCondition.push({ role });
	}
	const users = await prisma.user.findMany({
		where: { AND: andCondition },
		omit: { password: true },
		orderBy: { [sortBy]: sortOrder },
		take: limit,
		skip
	});
	const totalUsers = await prisma.user.count({ where: { AND: andCondition } });
	return {
		meta: {
			page,
			limit,
			total: totalUsers,
			totalPages: Math.ceil(totalUsers / limit)
		},
		users
	};
};
const updateUserStatus$1 = async (userId, payload) => {
	const user = await prisma.user.findUnique({ where: { id: userId } });
	if (!user) throw new AppError(http_status.default.NOT_FOUND, "User not found");
	if (user.isActive === payload.isActive) throw new AppError(http_status.default.CONFLICT, "User is already updated");
	return prisma.user.update({
		where: { id: userId },
		data: { isActive: payload.isActive },
		omit: { password: true }
	});
};
const adminService = {
	getAllUsers: getAllUsers$1,
	updateUserStatus: updateUserStatus$1
};
const adminController = {
	getAllUsers: catchAsync(async (req, res) => {
		const { meta, users } = await adminService.getAllUsers(req.query);
		sendResponse(res, {
			statusCode: http_status.status.OK,
			success: true,
			message: "Users retrieved successfully",
			data: {
				meta,
				users
			}
		});
	}),
	updateUserStatus: catchAsync(async (req, res) => {
		const user = await adminService.updateUserStatus(req.params.userId, req.body);
		sendResponse(res, {
			statusCode: http_status.status.OK,
			success: true,
			message: `User ${user.isActive ? "unbanned" : "banned"} successfully`,
			data: user
		});
	})
};
//#endregion
//#region src/modules/admin/admin.validation.ts
const updateUserStatusSchema = zod.default.object({ isActive: zod.default.boolean({ error: (issue) => issue.input == null ? "Active status is required" : "Status can only be true or false" }) });
//#endregion
//#region src/modules/admin/admin.route.ts
const router$6 = (0, express.Router)();
router$6.get("/users", authenticate, authorize(UserRole.ADMIN), adminController.getAllUsers);
router$6.patch("/users/:userId", authenticate, authorize(UserRole.ADMIN), validateRequest(updateUserStatusSchema), adminController.updateUserStatus);
const adminRoutes = router$6;
//#endregion
//#region src/modules/category/category.validate.ts
const createCategorySchema = zod.default.object({ name: zod.default.string({ error: (issue) => issue.input == null ? "Category name is required" : "Category name must be a string" }).trim().min(1, "Category name cannot be empty").max(150, "Category name cannot exceed 150 characters") });
//#endregion
//#region src/utils/slug.ts
const createSlug = (name) => {
	return name.trim().toLowerCase().replace(/\s+/g, "-");
};
//#endregion
//#region src/modules/category/category.service.ts
const createCategory$1 = async (payload) => {
	const slug = createSlug(payload.name);
	if (await prisma.category.findFirst({ where: { slug } })) throw new AppError(http_status.default.CONFLICT, "Category already exists");
	return prisma.category.create({ data: {
		name: payload.name,
		slug
	} });
};
const getAllCategories$1 = async () => {
	return prisma.category.findMany({ orderBy: { name: "asc" } });
};
const updateCategory$1 = async (categoryId, payload) => {
	if (!await prisma.category.findUnique({ where: { id: categoryId } })) throw new AppError(http_status.default.NOT_FOUND, "Category not found");
	const slug = createSlug(payload.name);
	if (await prisma.category.findFirst({ where: { slug } })) throw new AppError(http_status.default.CONFLICT, "Category already exists with that name");
	return prisma.category.update({
		where: { id: categoryId },
		data: {
			name: payload.name,
			slug
		}
	});
};
const categoryService = {
	createCategory: createCategory$1,
	getAllCategories: getAllCategories$1,
	updateCategory: updateCategory$1
};
const categoryController = {
	createCategory: catchAsync(async (req, res) => {
		const category = await categoryService.createCategory(req.body);
		sendResponse(res, {
			statusCode: http_status.status.CREATED,
			success: true,
			message: "Category created successfully",
			data: category
		});
	}),
	getAllCategories: catchAsync(async (req, res) => {
		const categories = await categoryService.getAllCategories();
		sendResponse(res, {
			statusCode: http_status.status.OK,
			success: true,
			message: "Categories retrieved successfully",
			data: categories
		});
	}),
	updateCategory: catchAsync(async (req, res) => {
		const category = await categoryService.updateCategory(req.params.categoryId, req.body);
		sendResponse(res, {
			statusCode: http_status.status.OK,
			success: true,
			message: "Category updated successfully",
			data: category
		});
	})
};
//#endregion
//#region src/modules/category/category.route.ts
const router$5 = (0, express.Router)();
router$5.post("/", authenticate, authorize(UserRole.ADMIN), validateRequest(createCategorySchema), categoryController.createCategory);
router$5.get("/", categoryController.getAllCategories);
router$5.patch("/:categoryId", authenticate, authorize(UserRole.ADMIN), validateRequest(createCategorySchema), categoryController.updateCategory);
const categoryRoutes = router$5;
_prisma_client_runtime_index_browser.NullTypes.DbNull, _prisma_client_runtime_index_browser.NullTypes.JsonNull, _prisma_client_runtime_index_browser.NullTypes.AnyNull;
_prisma_client_runtime_index_browser.makeStrictEnum({
	ReadUncommitted: "ReadUncommitted",
	ReadCommitted: "ReadCommitted",
	RepeatableRead: "RepeatableRead",
	Serializable: "Serializable"
});
//#endregion
//#region src/modules/property/property.validation.ts
const createPropertySchema = zod.default.object({
	title: zod.default.string("Title is required").trim().min(5, "Title must be at least 5 characters").max(150, "Title cannot exceed 150 characters"),
	description: zod.default.string("Description is required").trim().min(20, "Description must be at least 20 characters"),
	rent: zod.default.number("Rent is required").positive("Rent must be greater than 0"),
	location: zod.default.string("Location is required").trim().min(2, "Location must be at least 2 characters").max(100, "Location cannot exceed 100 characters"),
	amenities: zod.default.array(zod.default.string().trim()).optional(),
	bedrooms: zod.default.number().int("Bedrooms must be a whole number").positive("Bedrooms must be greater than 0").optional(),
	bathrooms: zod.default.number().int("Bathrooms must be a whole number").positive("Bathrooms must be greater than 0").optional(),
	size: zod.default.number().positive("Size must be greater than 0").optional(),
	images: zod.default.array(zod.default.url("Image must be a valid URL")).optional(),
	categoryId: zod.default.uuid({ error: (issue) => issue.input == null ? "Category is required" : "Invalid category id" })
});
const updatePropertySchema = zod.default.object({
	title: zod.default.string().trim().min(5, "Title must be at least 5 characters").max(200, "Title cannot exceed 200 characters").optional(),
	description: zod.default.string().trim().min(20, "Description must be at least 20 characters").optional(),
	rent: zod.default.number().positive("Rent must be greater than 0").optional(),
	location: zod.default.string().trim().min(2, "Location must be at least 2 characters").max(100, "Location cannot exceed 100 characters").optional(),
	amenities: zod.default.array(zod.default.string().trim()).optional(),
	bedrooms: zod.default.number().int("Bedrooms must be a whole number").positive("Bedrooms must be greater than 0").optional(),
	bathrooms: zod.default.number().int("Bathrooms must be a whole number").positive("Bathrooms must be greater than 0").optional(),
	size: zod.default.number().positive("Size must be greater than 0").optional(),
	images: zod.default.array(zod.default.url("Image must be a valid URL")).optional(),
	categoryId: zod.default.uuid("Invalid category id").optional()
}).refine((data) => Object.keys(data).length > 0, { message: "At least one field is required" });
zod.default.object({ status: zod.default.enum([RentalRequestStatus.APPROVED, RentalRequestStatus.REJECTED], { error: (issue) => issue.input == null ? "Status is required" : "Invalid status! Status can either be APPROVED or REJECTED" }) });
//#endregion
//#region src/utils/pagination.ts
const getPagination = (page, limit) => {
	const currentPage = Math.max(1, page || 1);
	const currentLimit = Math.max(1, limit || 10);
	return {
		page: currentPage,
		limit: currentLimit,
		skip: (currentPage - 1) * currentLimit
	};
};
//#endregion
//#region src/modules/property/property.query.ts
const SORTABLE_FIELDS$3 = [
	"createdAt",
	"rent",
	"title",
	"updatedAt"
];
const SORT_ORDERS$4 = ["asc", "desc"];
const buildPropertySorting = (query) => {
	return {
		sortBy: query.sortBy && SORTABLE_FIELDS$3.includes(query.sortBy) ? query.sortBy : "createdAt",
		sortOrder: query.sortOrder && SORT_ORDERS$4.includes(query.sortOrder) ? query.sortOrder : "desc"
	};
};
const buildPropertyFilters = (query, scope) => {
	const { categoryId, isAvailable, location, search, minRent, maxRent } = query;
	const andCondition = [];
	switch (scope.type) {
		case "PUBLIC":
			andCondition.push({ isAvailable: true });
			break;
		case "LANDLORD":
			andCondition.push({ landlordId: scope.landlordId });
			break;
	}
	if (categoryId) andCondition.push({ categoryId });
	if (scope.type !== "PUBLIC" && typeof isAvailable !== "undefined") andCondition.push({ isAvailable: isAvailable === "true" ? true : false });
	if (location) andCondition.push({ location: {
		contains: location,
		mode: "insensitive"
	} });
	if (minRent) andCondition.push({ rent: { gte: Number(minRent) } });
	if (maxRent) andCondition.push({ rent: { lte: Number(maxRent) } });
	if (search) andCondition.push({ OR: [
		{ location: {
			contains: search,
			mode: "insensitive"
		} },
		{ title: {
			contains: search,
			mode: "insensitive"
		} },
		{ description: {
			contains: search,
			mode: "insensitive"
		} },
		{ category: { name: {
			contains: search,
			mode: "insensitive"
		} } }
	] });
	return andCondition;
};
//#endregion
//#region src/modules/property/property.service.ts
const createProperty$1 = async (landlordId, payload) => {
	if (!await prisma.category.findUnique({ where: { id: payload.categoryId } })) throw new AppError(http_status.default.BAD_REQUEST, "Category not found");
	return prisma.property.create({ data: {
		landlordId,
		...payload
	} });
};
const getPropertyById$1 = async (propertyId) => {
	const property = await prisma.property.findUnique({
		where: {
			id: propertyId,
			isAvailable: true
		},
		include: { reviews: true }
	});
	if (!property) throw new AppError(http_status.default.NOT_FOUND, "Property not found");
	return property;
};
const getMyPropertyById$1 = async (propertyId, landlordId) => {
	const property = await prisma.property.findFirst({ where: {
		id: propertyId,
		landlordId
	} });
	if (!property) throw new AppError(http_status.default.NOT_FOUND, "Property not found");
	return property;
};
const updateProperty$1 = async (propertyId, landlordId, payload) => {
	if (!await prisma.property.findFirst({ where: {
		id: propertyId,
		landlordId
	} })) throw new AppError(http_status.default.NOT_FOUND, "Property not found");
	if (payload.categoryId) {
		if (!await prisma.category.findUnique({ where: { id: payload.categoryId } })) throw new AppError(http_status.default.BAD_REQUEST, "Category not found");
	}
	return prisma.property.update({
		where: {
			id: propertyId,
			landlordId
		},
		data: payload
	});
};
const updatePropertyAvailability$1 = async (propertyId, landlordId) => {
	const property = await prisma.property.findFirst({ where: {
		id: propertyId,
		landlordId
	} });
	if (!property) throw new AppError(http_status.default.NOT_FOUND, "Property not found");
	const updateAvailabilityStatus = !property.isAvailable;
	return prisma.property.update({
		where: {
			id: propertyId,
			landlordId
		},
		data: { isAvailable: updateAvailabilityStatus },
		select: { isAvailable: true }
	});
};
const listProperties = async (query, scope) => {
	const dataLimit = Number(query.limit);
	const { limit, page, skip } = getPagination(Number(query.page), dataLimit);
	const andCondition = buildPropertyFilters(query, scope);
	const { sortBy, sortOrder } = buildPropertySorting(query);
	const listings = await prisma.property.findMany({
		where: { AND: andCondition },
		include: { category: { select: {
			id: true,
			name: true
		} } },
		omit: { categoryId: true },
		orderBy: { [sortBy]: sortOrder },
		take: limit,
		skip
	});
	const propertyCount = await prisma.property.count({ where: { AND: andCondition } });
	return {
		meta: {
			page,
			limit,
			total: propertyCount,
			totalPages: Math.ceil(propertyCount / limit)
		},
		listings
	};
};
const deleteProperty$1 = async (propertyId) => {
	const propertyExists = await prisma.property.findUniqueOrThrow({ where: { id: propertyId } });
	await prisma.property.delete({ where: { id: propertyExists.id } });
	return null;
};
const propertyService = {
	createProperty: createProperty$1,
	getMyPropertyById: getMyPropertyById$1,
	getPropertyById: getPropertyById$1,
	updateProperty: updateProperty$1,
	updatePropertyAvailability: updatePropertyAvailability$1,
	listProperties,
	deleteProperty: deleteProperty$1
};
const propertyController = {
	createProperty: catchAsync(async (req, res) => {
		const landlordId = req.user?.id;
		if (!landlordId) throw new Error("Landlord ID is required");
		const listing = await propertyService.createProperty(landlordId, req.body);
		sendResponse(res, {
			statusCode: http_status.default.CREATED,
			success: true,
			message: "Property listing created successfully",
			data: listing
		});
	}),
	getPropertyById: catchAsync(async (req, res) => {
		const property = await propertyService.getPropertyById(req.params.propertyId);
		sendResponse(res, {
			statusCode: http_status.default.OK,
			success: true,
			message: "Property retreived successfully",
			data: property
		});
	}),
	getMyPropertyById: catchAsync(async (req, res) => {
		const landlordId = req.user?.id;
		const propertyId = req.params.propertyId;
		const property = await propertyService.getMyPropertyById(propertyId, landlordId);
		sendResponse(res, {
			statusCode: http_status.default.OK,
			success: true,
			message: "Property retrieved successfully",
			data: property
		});
	}),
	updateProperty: catchAsync(async (req, res) => {
		const landlordId = req.user?.id;
		const propertyId = req.params.propertyId;
		const updatedListing = await propertyService.updateProperty(propertyId, landlordId, req.body);
		sendResponse(res, {
			statusCode: http_status.default.OK,
			success: true,
			message: "Property updated successfully",
			data: updatedListing
		});
	}),
	updatePropertyAvailability: catchAsync(async (req, res) => {
		const landlordId = req.user?.id;
		const propertyId = req.params.propertyId;
		const propertyStatus = await propertyService.updatePropertyAvailability(propertyId, landlordId);
		sendResponse(res, {
			statusCode: http_status.default.OK,
			success: true,
			message: `Property status updated to ${propertyStatus.isAvailable} successfully`
		});
	}),
	getMyProperties: catchAsync(async (req, res) => {
		const { meta, listings } = await propertyService.listProperties(req.query, {
			type: "LANDLORD",
			landlordId: req.user?.id
		});
		sendResponse(res, {
			statusCode: http_status.default.OK,
			success: true,
			message: "Properties retreived successfully",
			data: {
				listings,
				meta
			}
		});
	}),
	getProperties: catchAsync(async (req, res) => {
		const scope = req.user?.role === "ADMIN" ? { type: "ADMIN" } : { type: "PUBLIC" };
		const { meta, listings } = await propertyService.listProperties(req.query, scope);
		sendResponse(res, {
			statusCode: http_status.default.OK,
			success: true,
			message: "Properties retreived successfully",
			data: {
				listings,
				meta
			}
		});
	}),
	deleteProperty: catchAsync(async (req, res) => {
		const propertyId = req.params.propertyId;
		await propertyService.deleteProperty(propertyId);
		sendResponse(res, {
			statusCode: http_status.default.OK,
			success: true,
			message: "Property deleted successfully"
		});
	})
};
//#endregion
//#region src/modules/property/property.route.ts
const router$4 = (0, express.Router)();
router$4.post("/", authenticate, authorize(UserRole.LANDLORD), validateRequest(createPropertySchema), propertyController.createProperty);
router$4.patch("/:propertyId", authenticate, authorize(UserRole.LANDLORD), validateRequest(updatePropertySchema), propertyController.updateProperty);
router$4.get("/me/:propertyId", authenticate, authorize(UserRole.LANDLORD), propertyController.getMyPropertyById);
router$4.patch("/:propertyId/availability", authenticate, authorize(UserRole.LANDLORD), propertyController.updatePropertyAvailability);
router$4.get("/", authenticate, propertyController.getProperties);
router$4.get("/me", authenticate, authorize(UserRole.LANDLORD), propertyController.getMyProperties);
router$4.get("/:propertyId", propertyController.getPropertyById);
router$4.delete("/:propertyId", authenticate, authorize(UserRole.LANDLORD), propertyController.deleteProperty);
const propertyRoutes = router$4;
//#endregion
//#region src/modules/rental-request/rental-request.query.ts
const SORTABLE_FIELDS$2 = [
	"createdAt",
	"durationInMonths",
	"requestedMoveInDate"
];
const SORT_ORDERS$3 = ["asc", "desc"];
const buildRentalRequestSorting = (query) => {
	return {
		sortBy: query.sortBy && SORTABLE_FIELDS$2.includes(query.sortBy) ? query.sortBy : "createdAt",
		sortOrder: query.sortOrder && SORT_ORDERS$3.includes(query.sortOrder) ? query.sortOrder : "desc"
	};
};
const buildRentalRequestFilters = (query, scope) => {
	const andCondition = [];
	switch (scope.type) {
		case "LANDLORD":
			andCondition.push({ property: { landlordId: scope.landlordId } });
			break;
		case "TENANT":
			andCondition.push({ tenantId: scope.tenantId });
			break;
	}
	if (query.status) {
		if (!isValidEnumValue(RentalRequestStatus, query.status)) throw new AppError(http_status.default.BAD_REQUEST, "Invalid rental request status");
		andCondition.push({ status: query.status });
	}
	return andCondition;
};
//#endregion
//#region src/modules/rental-request/rental-request.service.ts
const submitRentalRequest$1 = async (tenantId, payload) => {
	const { propertyId, tenantMessage, requestedMoveInDate, durationInMonths } = payload;
	if (!await prisma.property.findFirst({ where: {
		id: propertyId,
		isAvailable: true
	} })) throw new AppError(http_status.default.NOT_FOUND, "Property is not available");
	if (await prisma.rentalRequest.findFirst({ where: {
		tenantId,
		propertyId,
		status: { in: ["PENDING", "APPROVED"] }
	} })) throw new AppError(http_status.default.CONFLICT, "You already have an active rental request for this property");
	return prisma.rentalRequest.create({
		data: {
			tenantId,
			propertyId,
			tenantMessage,
			requestedMoveInDate,
			durationInMonths
		},
		include: { property: true }
	});
};
const listRentalRequests = async (query, scope) => {
	const pagination = getPagination(Number(query.page), Number(query.limit));
	const { sortBy, sortOrder } = buildRentalRequestSorting(query);
	const andCondition = buildRentalRequestFilters(query, scope);
	const requests = await prisma.rentalRequest.findMany({
		where: { AND: andCondition },
		include: {
			tenant: { select: {
				id: true,
				name: true,
				email: true
			} },
			property: { select: {
				id: true,
				title: true,
				location: true,
				rent: true
			} }
		},
		orderBy: { [sortBy]: sortOrder },
		take: pagination.limit,
		skip: pagination.skip
	});
	const totalRequests = await prisma.rentalRequest.count({ where: { AND: andCondition } });
	return {
		meta: {
			page: pagination.page,
			limit: pagination.limit,
			total: totalRequests,
			totalPages: Math.ceil(totalRequests / pagination.limit)
		},
		requests
	};
};
const updateRentalRequestStatus$1 = async (landlordId, requestId, payload) => {
	const rentalRequest = await prisma.rentalRequest.findFirst({
		where: {
			id: requestId,
			property: { landlordId }
		},
		include: { property: { select: { id: true } } }
	});
	if (!rentalRequest) throw new AppError(http_status.default.NOT_FOUND, "Rental request not found");
	if (rentalRequest.status !== RentalRequestStatus.PENDING) throw new AppError(http_status.default.BAD_REQUEST, "Only pending rental requests can be updated");
	if (payload.status === RentalRequestStatus.REJECTED) return (await prisma.rentalRequest.update({
		where: { id: requestId },
		data: { status: RentalRequestStatus.REJECTED },
		select: { status: true }
	})).status;
	return await prisma.$transaction(async (tx) => {
		const { id: rentalRequestId, tenantId, propertyId, durationInMonths, requestedMoveInDate, status, property } = await tx.rentalRequest.update({
			where: { id: requestId },
			data: { status: RentalRequestStatus.APPROVED },
			include: { property: true }
		});
		const leaseStartDate = new Date(requestedMoveInDate);
		const leaseEndDate = new Date(leaseStartDate);
		leaseEndDate.setMonth(leaseEndDate.getMonth() + durationInMonths);
		leaseEndDate.setDate(leaseEndDate.getDate() - 1);
		await tx.rentalAgreement.create({ data: {
			rentalRequestId,
			tenantId,
			propertyId,
			monthlyRent: property.rent,
			durationInMonths,
			leaseStartDate,
			leaseEndDate
		} });
		await tx.rentalRequest.updateMany({
			where: {
				propertyId,
				status: RentalRequestStatus.PENDING,
				id: { not: requestId }
			},
			data: { status: RentalRequestStatus.REJECTED }
		});
		await tx.property.update({
			where: { id: propertyId },
			data: { isAvailable: false }
		});
		return status;
	});
};
const rentalRequestService = {
	updateRentalRequestStatus: updateRentalRequestStatus$1,
	submitRentalRequest: submitRentalRequest$1,
	listRentalRequests
};
//#endregion
//#region src/modules/rental-request/rental-request.controller.ts
const submitRentalRequest = catchAsync(async (req, res) => {
	const rentalData = await rentalRequestService.submitRentalRequest(req.user?.id, req.body);
	sendResponse(res, {
		statusCode: http_status.default.CREATED,
		success: true,
		message: "Rental request submitted successfully",
		data: rentalData
	});
});
const getRentalRequests = catchAsync(async (req, res) => {
	const scope = getRentalRequestScope(req.user);
	const { meta, requests } = await rentalRequestService.listRentalRequests(req.query, scope);
	sendResponse(res, {
		statusCode: http_status.default.OK,
		success: true,
		message: "Rental requests retreived successfully",
		data: {
			meta,
			requests
		}
	});
});
const updateRentalRequestStatus = catchAsync(async (req, res) => {
	const landlordId = req.user?.id;
	const updatedStatus = await rentalRequestService.updateRentalRequestStatus(landlordId, req.params.id, req.body);
	sendResponse(res, {
		statusCode: http_status.default.OK,
		success: true,
		message: `Rental requests status updated to ${updatedStatus} successfully`
	});
});
function getRentalRequestScope(user) {
	switch (user.role) {
		case UserRole.TENANT: return {
			type: "TENANT",
			tenantId: user.id
		};
		case UserRole.LANDLORD: return {
			type: "LANDLORD",
			landlordId: user.id
		};
		case UserRole.ADMIN: return { type: "ADMIN" };
	}
}
const rentalRequestController = {
	updateRentalRequestStatus,
	submitRentalRequest,
	getRentalRequests
};
//#endregion
//#region src/modules/rental-request/rental-request.validation.ts
const submitRentalRequestSchema = zod.z.object({
	propertyId: zod.z.uuid({ error: (issue) => issue.input == null ? "Property ID is required" : "Invalid property ID" }),
	tenantMessage: zod.z.string().trim().min(3, "Message must be at least 3 characters").optional(),
	requestedMoveInDate: zod.z.coerce.date({ error: (issue) => issue.input == null ? "Date is requried" : "Invalid date" }),
	durationInMonths: zod.z.coerce.number({ error: (issue) => issue.input == null ? "Duration in months is required" : "Invalid duration" }).int("Duration must be a whole number").min(1, "Duration must be minimum 1 months").max(36, "Duration cannot exceed 36 months")
});
const updateRentalRequestStatusSchema = zod.z.object({ status: zod.z.enum([RentalRequestStatus.APPROVED, RentalRequestStatus.REJECTED], { error: (issue) => issue.input == null ? "Status is required" : "Invalid status! Status can either be APPROVED or REJECTED" }) });
//#endregion
//#region src/modules/rental-request/rental-request.route.ts
const router$3 = (0, express.Router)();
router$3.post("/", authenticate, authorize(UserRole.TENANT), validateRequest(submitRentalRequestSchema), rentalRequestController.submitRentalRequest);
router$3.get("/", authenticate, authorize(UserRole.ADMIN, UserRole.LANDLORD, UserRole.TENANT), rentalRequestController.getRentalRequests);
router$3.patch("/:id", authenticate, authorize(UserRole.LANDLORD), validateRequest(updateRentalRequestStatusSchema), rentalRequestController.updateRentalRequestStatus);
const rentalRequestRoutes = router$3;
//#endregion
//#region src/modules/rental-agreement/rental-agreement.query.ts
const SORTABLE_FIELDS$1 = [
	"createdAt",
	"leaseStartDate",
	"leaseEndDate",
	"updatedAt",
	"activatedAt"
];
const SORT_ORDERS$2 = ["asc", "desc"];
const buildRentalAgreementSorting = (query) => {
	return {
		sortBy: query.sortBy && SORTABLE_FIELDS$1.includes(query.sortBy) ? query.sortBy : "createdAt",
		sortOrder: query.sortOrder && SORT_ORDERS$2.includes(query.sortOrder) ? query.sortOrder : "desc"
	};
};
const buildRentalAgreementFilters = (query, scope) => {
	const andCondition = [];
	switch (scope.type) {
		case "LANDLORD":
			andCondition.push({ property: { landlordId: scope.landlordId } });
			break;
		case "TENANT":
			andCondition.push({ tenantId: scope.tenantId });
			break;
	}
	if (query.status) {
		if (!isValidEnumValue(RentalAgreementStatus, query.status)) throw new AppError(http_status.default.BAD_REQUEST, "Invalid status query");
		andCondition.push({ status: query.status });
	}
	return andCondition;
};
//#endregion
//#region src/modules/rental-agreement/rental-agreement.service.ts
const listRentalAgreements = async (query, scope) => {
	const pagination = getPagination(Number(query.page), Number(query.limit));
	const { sortBy, sortOrder } = buildRentalAgreementSorting(query);
	const andCondition = buildRentalAgreementFilters(query, scope);
	const agreements = await prisma.rentalAgreement.findMany({
		where: { AND: andCondition },
		select: {
			id: true,
			tenant: { select: {
				id: true,
				name: true
			} },
			property: { select: {
				id: true,
				title: true
			} },
			status: true,
			activatedAt: true,
			leaseStartDate: true,
			leaseEndDate: true,
			createdAt: true,
			updatedAt: true
		},
		orderBy: { [sortBy]: sortOrder },
		take: pagination.limit,
		skip: pagination.skip
	});
	const totalAgreements = await prisma.rentalAgreement.count({ where: { AND: andCondition } });
	return {
		meta: {
			page: pagination.page,
			limit: pagination.limit,
			total: totalAgreements,
			totalPages: Math.ceil(totalAgreements / pagination.limit)
		},
		agreements
	};
};
const updateRentalAgreementStatus$1 = async (tenantId, rentalAgreementId, payload) => {
	if (![RentalAgreementStatus.COMPLETED, RentalAgreementStatus.TERMINATED].includes(payload.status)) throw new AppError(http_status.default.BAD_REQUEST, "Invalid rental agreement status");
	if (!await prisma.rentalAgreement.findFirst({ where: {
		id: rentalAgreementId,
		tenantId,
		status: "ACTIVE"
	} })) throw new AppError(http_status.default.NOT_FOUND, "No agreement found to update");
	return prisma.rentalAgreement.update({
		where: { id: rentalAgreementId },
		data: { status: payload.status },
		select: { status: true }
	});
};
const rentalAgreementService = {
	listRentalAgreements,
	updateRentalAgreementStatus: updateRentalAgreementStatus$1
};
//#endregion
//#region src/modules/rental-agreement/rental-agreement.controller.ts
function getRentalAgreementScope(user) {
	switch (user.role) {
		case UserRole.TENANT: return {
			type: "TENANT",
			tenantId: user.id
		};
		case UserRole.LANDLORD: return {
			type: "LANDLORD",
			landlordId: user.id
		};
		case UserRole.ADMIN: return { type: "ADMIN" };
	}
}
const rentalAgreementcontroller = {
	getRentalAgreements: catchAsync(async (req, res) => {
		const user = req.user;
		if (!user) throw new Error("Authentication required");
		const scope = getRentalAgreementScope(user);
		const { meta, agreements } = await rentalAgreementService.listRentalAgreements(req.query, scope);
		sendResponse(res, {
			statusCode: http_status.default.OK,
			success: true,
			message: `Rental agreements retreived successfully`,
			data: {
				meta,
				agreements
			}
		});
	}),
	updateRentalAgreementStatus: catchAsync(async (req, res) => {
		const user = req.user;
		if (!user) throw new Error("Authentication required");
		const updatedData = await rentalAgreementService.updateRentalAgreementStatus(user.id, req.params.agreementId, req.body);
		sendResponse(res, {
			statusCode: http_status.default.OK,
			success: true,
			message: `Rental agreement status updated to ${updatedData.status} successfully`
		});
	})
};
//#endregion
//#region src/modules/rental-agreement/rental-agreement.validation.ts
const updateRentalAgreementStatusSchema = zod.default.object({ status: zod.default.enum([RentalAgreementStatus.TERMINATED, RentalAgreementStatus.COMPLETED], { error: (issue) => issue.input == null ? "Status is required" : "Invalid status! Status can either be TERMINATED or COMPLETED" }) });
//#endregion
//#region src/modules/rental-agreement/rental-agreement.route.ts
const router$2 = (0, express.Router)();
router$2.get("/", authenticate, authorize(UserRole.LANDLORD, UserRole.TENANT, UserRole.ADMIN), rentalAgreementcontroller.getRentalAgreements);
router$2.patch("/:agreementId/update", authenticate, authorize(UserRole.TENANT), validateRequest(updateRentalAgreementStatusSchema), rentalAgreementcontroller.updateRentalAgreementStatus);
const rentalAgreementRoutes = router$2;
//#endregion
//#region src/modules/review/review.service.ts
const SORT_ORDERS$1 = ["asc", "desc"];
const createReview$1 = async (tenantId, rentalAgreementId, payload) => {
	const validRentalAgreement = await prisma.rentalAgreement.findFirst({ where: {
		id: rentalAgreementId,
		tenantId,
		status: { in: [RentalAgreementStatus.COMPLETED, RentalAgreementStatus.TERMINATED] }
	} });
	if (!validRentalAgreement) throw new AppError(http_status.default.NOT_FOUND, "No reviewable rental agreement was found");
	if (await prisma.review.findUnique({ where: { rentalAgreementId } })) throw new AppError(http_status.default.CONFLICT, "Review already submitted for this agreement");
	return prisma.review.create({
		data: {
			...payload,
			tenantId,
			rentalAgreementId,
			propertyId: validRentalAgreement.propertyId
		},
		select: {
			id: true,
			rating: true,
			comment: true,
			tenant: { select: { name: true } },
			property: { select: {
				id: true,
				title: true
			} }
		}
	});
};
const getReviewsByPropertyId$1 = async (landlordId, propertyId, query) => {
	const limit = Math.max(1, Number(query.limit) || 10);
	const page = Math.max(1, Number(query.page) || 1);
	const skip = (page - 1) * limit;
	const sortBy = query.sortBy && ["createdAt"].includes(query.sortBy) ? query.sortBy : "createdAt";
	const sortOrder = query.sortOrder && SORT_ORDERS$1.includes(query.sortOrder) ? query.sortOrder : "desc";
	const reviews = await prisma.review.findMany({
		where: {
			propertyId,
			property: { landlordId }
		},
		select: {
			id: true,
			rating: true,
			comment: true,
			createdAt: true,
			tenant: { select: {
				id: true,
				name: true
			} },
			property: { select: {
				id: true,
				title: true
			} }
		},
		orderBy: { [sortBy]: sortOrder },
		take: limit,
		skip
	});
	const totalReviews = await prisma.review.count({ where: {
		propertyId,
		property: { landlordId }
	} });
	return {
		meta: {
			page,
			limit,
			total: totalReviews,
			totalPages: Math.ceil(totalReviews / limit)
		},
		reviews
	};
};
const reviewService = {
	createReview: createReview$1,
	getReviewsByPropertyId: getReviewsByPropertyId$1
};
const reviewController = {
	createReview: catchAsync(async (req, res) => {
		const review = await reviewService.createReview(req.user?.id, req.params.rentalAgreementId, req.body);
		sendResponse(res, {
			statusCode: http_status.default.CREATED,
			success: true,
			message: "Review submitted successfully",
			data: review
		});
	}),
	getReviewsByPropertyId: catchAsync(async (req, res) => {
		const { meta, reviews } = await reviewService.getReviewsByPropertyId(req.user?.id, req.params.propertyId, req.query);
		sendResponse(res, {
			statusCode: http_status.default.OK,
			success: true,
			message: "Reviews retrieved successfully",
			data: {
				meta,
				reviews
			}
		});
	})
};
//#endregion
//#region src/modules/review/review.validate.ts
const createReviewSchema = zod.default.object({
	rating: zod.default.number("Rating is required").int("Rating should be a whole number").min(1, "Rating should be at least 1").max(5, "Rating can be maximum 5"),
	comment: zod.default.string().optional()
});
//#endregion
//#region src/modules/review/review.route.ts
const router$1 = (0, express.Router)();
router$1.post("/:rentalAgreementId", authenticate, authorize(UserRole.TENANT), validateRequest(createReviewSchema), reviewController.createReview);
router$1.get("/:propertyId", authenticate, authorize(UserRole.LANDLORD), reviewController.getReviewsByPropertyId);
const reviewRoutes = router$1;
//#endregion
//#region src/modules/payment/payment.query.ts
const SORTABLE_FIELDS = ["createdAt", "paidAt"];
const SORT_ORDERS = ["asc", "desc"];
const buildPaymentSorting = (query) => {
	return {
		sortBy: query.sortBy && SORTABLE_FIELDS.includes(query.sortBy) ? query.sortBy : "createdAt",
		sortOrder: query.sortOrder && SORT_ORDERS.includes(query.sortOrder) ? query.sortOrder : "desc"
	};
};
const buildPaymentFilter = (query, scope) => {
	const andCondition = [];
	switch (scope.type) {
		case "TENANT":
			andCondition.push({ rentalAgreement: { tenantId: scope.tenantId } });
			break;
		case "LANDLORD":
			andCondition.push({ rentalAgreement: { property: { landlordId: scope.landlordId } } });
			break;
	}
	if (query.status) {
		if (!isValidEnumValue(PaymentStatus, query.status)) throw new AppError(http_status.default.BAD_REQUEST, "Invalid status", [{
			field: "status",
			message: `Please choose status from: ${Object.keys(PaymentStatus)}`
		}]);
		andCondition.push({ status: query.status });
	}
	if (query.provider) {
		if (!isValidEnumValue(PaymentProvider, query.provider)) throw new AppError(http_status.default.BAD_REQUEST, "Invalid provider", [{
			field: "status",
			message: `Please choose provider from: ${Object.keys(PaymentProvider)}`
		}]);
		andCondition.push({ provider: query.provider });
	}
	return andCondition;
};
//#endregion
//#region src/lib/stripe/stripe.ts
const stripe$1 = new stripe.default(config_default.stripe_secret_key);
//#endregion
//#region src/modules/payment/payment.service.ts
const listPayments = async (query, scope) => {
	const dataLimit = Number(query.limit);
	const { limit, page, skip } = getPagination(Number(query.page), dataLimit);
	const andCondition = buildPaymentFilter(query, scope);
	const { sortBy, sortOrder } = buildPaymentSorting(query);
	const payments = await prisma.payment.findMany({
		where: { AND: andCondition },
		omit: { checkoutUrl: true },
		orderBy: { [sortBy]: sortOrder },
		take: limit,
		skip
	});
	const totalPayments = await prisma.payment.count({ where: { AND: andCondition } });
	return {
		meta: {
			page,
			limit,
			total: totalPayments,
			totalPages: Math.ceil(totalPayments / limit)
		},
		payments
	};
};
const getPaymentById$1 = async (paymentId, scope) => {
	const andCondition = [];
	switch (scope.type) {
		case "TENANT":
			andCondition.push({ rentalAgreement: { tenantId: scope.tenantId } });
			break;
		case "LANDLORD":
			andCondition.push({ rentalAgreement: { property: { landlordId: scope.landlordId } } });
			break;
	}
	const payment = await prisma.payment.findFirst({
		where: {
			id: paymentId,
			AND: andCondition
		},
		omit: { checkoutUrl: true }
	});
	if (!payment) throw new AppError(http_status.default.NOT_FOUND, "Payment not found");
	return payment;
};
const handleStripeWebhook$1 = async (payload, signature) => {
	let event;
	const endpointSecret = config_default.stripe_webhook_secret;
	try {
		event = stripe$1.webhooks.constructEvent(payload, signature, endpointSecret);
	} catch (error) {
		throw new AppError(http_status.default.BAD_REQUEST, "⚠️ Webhook signature verification failed.");
	}
	if ((await prisma.stripeWebhookEvent.findUnique({ where: { stripeEventId: event.id } }))?.processedAt) return;
	await prisma.$transaction(async (tx) => {
		const webhookEvent = await tx.stripeWebhookEvent.create({ data: {
			stripeEventId: event.id,
			type: event.type
		} });
		switch (event.type) {
			case "checkout.session.completed":
				await handleCheckoutCompleted(tx, event.data.object);
				break;
			default: console.log(`Unhandled event: ${event.type}`);
		}
		await tx.stripeWebhookEvent.update({
			where: { id: webhookEvent.id },
			data: { processedAt: /* @__PURE__ */ new Date() }
		});
	});
};
const createCheckoutSession$1 = async (tenantId, userEmail, rentalAgreementId) => {
	const rentalAgreement = await prisma.rentalAgreement.findFirst({
		where: {
			id: rentalAgreementId,
			tenantId
		},
		include: { property: { select: { title: true } } }
	});
	if (!rentalAgreement) throw new AppError(http_status.default.NOT_FOUND, "Rental agreement not found");
	if (rentalAgreement.status !== RentalAgreementStatus.PENDING_PAYMENT) throw new AppError(http_status.default.BAD_REQUEST, "Payment is not available for this agreement");
	const payment = await prisma.$transaction(async (tx) => {
		if (await tx.payment.findFirst({ where: {
			rentalAgreementId,
			status: { in: [PaymentStatus.PENDING, PaymentStatus.PROCESSING] }
		} })) throw new AppError(http_status.default.CONFLICT, "A payment is already pending for this agreement");
		return tx.payment.create({ data: {
			rentalAgreementId,
			amount: rentalAgreement.monthlyRent,
			currency: "bdt"
		} });
	});
	const checkoutSession = await stripe$1.checkout.sessions.create({
		mode: "payment",
		payment_method_types: ["card"],
		customer_email: userEmail,
		line_items: [{
			quantity: 1,
			price_data: {
				currency: payment.currency.toLowerCase(),
				unit_amount: Math.round(Number(payment.amount) * 100),
				product_data: { name: rentalAgreement.property.title }
			}
		}],
		success_url: `${config_default.app_url}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
		cancel_url: `${config_default.app_url}/payment/cancel`,
		metadata: {
			paymentId: payment.id,
			rentalAgreementId,
			rentalRequestId: rentalAgreement.rentalRequestId,
			tenantId
		}
	});
	await prisma.payment.update({
		where: { id: payment.id },
		data: {
			stripeSessionId: checkoutSession.id,
			checkoutUrl: checkoutSession.url
		}
	});
	return { checkoutUrl: checkoutSession.url };
};
const handleCheckoutCompleted = async (tx, session) => {
	const paymentId = session.metadata?.paymentId;
	if (!paymentId) throw new AppError(http_status.default.BAD_REQUEST, "Payment ID missing from Stripe metadata");
	const payment = await tx.payment.findUnique({ where: { id: paymentId } });
	if (!payment) throw new AppError(http_status.default.NOT_FOUND, "Payment not found");
	if (payment.status === "PAID") return;
	const paidAt = /* @__PURE__ */ new Date();
	await tx.payment.update({
		where: { id: paymentId },
		data: {
			status: "PAID",
			paidAt,
			stripePaymentIntentId: session.payment_intent
		}
	});
	await tx.rentalAgreement.update({
		where: { id: payment.rentalAgreementId },
		data: {
			status: "ACTIVE",
			activatedAt: paidAt
		}
	});
};
const paymentService = {
	createCheckoutSession: createCheckoutSession$1,
	handleStripeWebhook: handleStripeWebhook$1,
	listPayments,
	getPaymentById: getPaymentById$1
};
//#endregion
//#region src/modules/payment/payment.controller.ts
const getPayments = catchAsync(async (req, res) => {
	const scope = getPaymentScope(req.user);
	const { meta, payments } = await paymentService.listPayments(req.query, scope);
	sendResponse(res, {
		statusCode: http_status.default.OK,
		success: true,
		message: "Payments retrieved successfully",
		data: {
			meta,
			payments
		}
	});
});
const getPaymentById = catchAsync(async (req, res) => {
	const scope = getPaymentScope(req.user);
	const payment = await paymentService.getPaymentById(req.params.paymentId, scope);
	sendResponse(res, {
		statusCode: http_status.default.OK,
		success: true,
		message: "Payment retrieved successfully",
		data: payment
	});
});
const handleStripeWebhook = catchAsync(async (req, res) => {
	await paymentService.handleStripeWebhook(req.body, req.headers["stripe-signature"]);
	sendResponse(res, {
		statusCode: http_status.default.OK,
		success: true,
		message: "Webhook received"
	});
});
const createCheckoutSession = catchAsync(async (req, res) => {
	const checkoutSession = await paymentService.createCheckoutSession(req.user?.id, req.user?.email, req.params.agreementId);
	sendResponse(res, {
		statusCode: http_status.default.OK,
		success: true,
		message: "Checkout session created successfully",
		data: checkoutSession
	});
});
const successPayment = catchAsync(async (req, res) => {
	sendResponse(res, {
		statusCode: http_status.default.OK,
		success: true,
		message: "Payment Successful"
	});
});
function getPaymentScope(user) {
	switch (user.role) {
		case UserRole.TENANT: return {
			type: "TENANT",
			tenantId: user.id
		};
		case UserRole.LANDLORD: return {
			type: "LANDLORD",
			landlordId: user.id
		};
		case UserRole.ADMIN: return { type: "ADMIN" };
	}
}
const paymentController = {
	createCheckoutSession,
	handleStripeWebhook,
	getPayments,
	getPaymentById,
	successPayment
};
//#endregion
//#region src/modules/payment/payment.route.ts
const router = (0, express.Router)();
router.post("/webhook", paymentController.handleStripeWebhook);
router.get("/success", paymentController.successPayment);
router.post("/rental-agreements/:agreementId/checkout", authenticate, authorize(UserRole.TENANT), paymentController.createCheckoutSession);
router.get("/", authenticate, authorize(UserRole.TENANT, UserRole.LANDLORD, UserRole.ADMIN), paymentController.getPayments);
router.get("/:paymentId", authenticate, authorize(UserRole.TENANT, UserRole.LANDLORD, UserRole.ADMIN), paymentController.getPaymentById);
const paymentRoutes = router;
//#endregion
//#region src/app.ts
const app = (0, express.default)();
app.use("/api/payments/webhook", express.default.raw({ type: "application/json" }));
app.use(express.default.json());
app.use((0, cookie_parser.default)());
app.use((0, express.urlencoded)({ extended: true }));
app.use((0, cors.default)());
app.get("/", (req, res) => {
	res.status(200).json({ message: "Welcome to RNest backend" });
});
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/rental-requests", rentalRequestRoutes);
app.use("/api/rental-agreements", rentalAgreementRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/payments", paymentRoutes);
app.use(notFound);
app.use(globalErrorHandler);
//#endregion
//#region src/server.ts
const PORT = config_default.port ? parseInt(config_default.port) : 5e3;
const main = async () => {
	try {
		app.listen(PORT, () => {
			console.log(`Server running on port ${PORT}`);
		});
		await prisma.$connect();
		console.log(`Database connected successfully.`);
	} catch (error) {
		console.log(error);
		await prisma.$disconnect();
		process.exit(1);
	}
};
main();
//#endregion
