# 🏢 RentNest Backend
### A production-ready Rental Management System API

RentNest is a secure and modular backend application built with **Node.js, Express.js, TypeScript, PostgreSQL, Prisma ORM, and Stripe**. It manages the complete rental lifecycle—from property discovery and rental requests to digital agreements, online payments, and verified reviews.

> <p>
  <a href="https://github.com/Rezwanul777/rent-nest-backend">
    <img src="https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github" alt="GitHub Repository" />
  </a>
  <img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge" alt="Project Status" />
  <img src="https://img.shields.io/badge/License-ISC-blue?style=for-the-badge" alt="ISC License" />
</p>

<p>
  <img src="https://img.shields.io/badge/Node.js-24.x-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/TypeScript-7.x-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Express.js-5.x-000000?style=flat-square&logo=express&logoColor=white" alt="Express.js" />
  <img src="https://img.shields.io/badge/Prisma-7.x-2D3748?style=flat-square&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Stripe-635BFF?style=flat-square&logo=stripe&logoColor=white" alt="Stripe" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white" alt="Vercel" />
</p>

**[Overview](#-project-overview) · [Features](#-features) · [Installation](#-installation--setup) · [Workflow](#-business-workflow) · [Deployment](#%EF%B8%8F-deployment)**

</div>

---

## 🌟 Key Highlights

| | Highlight | | Highlight |
| :---: | :--- | :---: | :--- |
| ✅ | Modular backend architecture | ✅ | TypeScript-based development |
| ✅ | Prisma ORM with PostgreSQL | ✅ | JWT authentication system |
| ✅ | Role-based authorization | ✅ | Stripe Checkout integration |
| ✅ | Webhook payment verification | ✅ | Transaction-safe rental workflow |
| ✅ | Searching, filtering, and sorting | ✅ | Production-ready API structure |

---

## 🔗 Quick Links

| Resource | Link |
| :--- | :--- |
| **Backend Repository** | [GitHub Link](https://github.com/Rezwanul777/rent-nest-backend) |
| **Live API** | [Vercel Deployment](https://rnest-backend.vercel.app/) |
| **API Documentation** | [Postman Docs](https://github.com/Rezwanul777/rent-nest-backend/blob/main/RNest-Backend.postman_collection.json) |
| **Demo Video** | [Google Drive](https://drive.google.com/file/d/171O9Lu37FW3t6hwf1VSB0-DVu0dMTh3W/view?usp=sharing) |


### 🔐 Demo Credentials
| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `ayaan.bin@gmail.com` | `admin-nest@123` |

---



## 📑 Table of Contents

- [Project Overview](#-project-overview)
- [Features](#-features)
- [Roles and Permissions](#-roles-and-permissions)
- [Technology Stack](#-technology-stack)
- [Architecture](#-architecture)
- [Installation and Setup](#-installation--setup)
- [Environment Variables](#-environment-variables)
- [Database Management](#-database-management)
- [Running the Project](#-running-the-project)
- [Core Integrations](#-core-integrations)
- [API Overview](#-api-overview)
- [Business Workflow](#-business-workflow)
- [Deployment](#%EF%B8%8F-deployment)
- [Future Improvements](#-future-improvements)
- [Author](#-author)
- [License](#-license)

## 📖 Project Overview

**RentNest** is a RESTful backend application that manages the complete rental-property lifecycle. It handles secure authentication, property listings, rental requests, digital agreements, Stripe payments, reviews, and administrative operations from one modular codebase.

The application follows a clean, domain-oriented modular architecture. Controllers remain focused on HTTP request and response handling, while services contain the main business logic. Reusable query builders provide consistent pagination, searching, filtering, and sorting across the platform.

### Project objectives

- Connect tenants with verified rental properties
- Give landlords ownership-aware property management tools
- Automate rental request approval and agreement creation
- Process payments securely through Stripe Checkout
- Maintain reliable payment state using verified webhooks
- Provide administrators with controlled platform management

## ✨ Features

### Authentication and security

- Tenant and landlord registration
- JWT access and refresh tokens
- HTTP-only authentication cookies
- Bearer-token support for API clients
- Password hashing with `bcryptjs`
- Role-based access control
- Account activation and deactivation

### Category and property management

- Dynamic property-category management
- Landlord-owned property creation and updates
- Property details, rent, location, amenities, rooms, size, and images
- Property availability management
- Ownership-aware access control
- Pagination, searching, filtering, and sorting

### Rental lifecycle

- Tenant rental-request submission
- Duplicate active-request prevention
- Landlord approval and rejection workflow
- Automatic rental-agreement creation
- Lease start and end date calculation
- Transactional rejection of competing requests
- Automatic property-availability updates

### Payments and reviews

- Stripe-hosted Checkout Session
- Raw-body webhook signature verification
- Idempotent webhook event processing
- Payment history for authorized users
- Automatic agreement activation after payment
- Agreement completion or termination
- One verified tenant review per completed agreement

### Administration

- Paginated user management
- Role-based user filtering
- Account-status control
- Category administration
- Platform-wide access to scoped rental records

## 👥 Roles and Permissions

| Capability | Tenant | Landlord | Admin |
| :--- | :---: | :---: | :---: |
| Register and log in | ✅ | ✅ | ✅ |
| Browse properties | ✅ | ✅ | ✅ |
| Submit rental requests | ✅ | — | — |
| Create and manage properties | — | ✅ | — |
| Approve or reject requests | — | ✅ | — |
| View rental agreements | ✅ | ✅ | ✅ |
| Pay for approved agreements | ✅ | — | — |
| Complete or terminate agreements | ✅ | — | — |
| Submit property reviews | ✅ | — | — |
| View authorized payment records | ✅ | ✅ | ✅ |
| Manage users and categories | — | — | ✅ |

## 🛠 Technology Stack

| Layer | Technology |
| :--- | :--- |
| Runtime | Node.js |
| Language | TypeScript |
| Framework | Express.js 5 |
| Database | PostgreSQL |
| ORM | Prisma ORM 7 with PostgreSQL adapter |
| Validation | Zod |
| Authentication | JWT and HTTP-only cookies |
| Password security | bcryptjs |
| Payment gateway | Stripe Checkout and webhooks |
| Development runtime | TSX |
| Hosting | Vercel |

## 🏗 Architecture

The project uses a **domain-oriented modular architecture** with thin controllers, service-based business logic, reusable validation, query builders, and scope-based authorization.

```text
rent-nest-backend/
├── prisma/
│   ├── migrations/                 # Database migration history
│   ├── schema/                     # Split Prisma schema files
│   └── seed.ts                     # Administrator seed
├── src/
│   ├── common/                     # Shared query and pagination helpers
│   ├── config/                     # Environment configuration
│   ├── generated/                  # Generated Prisma Client
│   ├── lib/                        # Prisma and Stripe clients
│   ├── middlewares/                # Auth, validation, errors, and 404
│   ├── modules/
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── category/
│   │   ├── payment/
│   │   ├── property/
│   │   ├── rental-agreement/
│   │   ├── rental-request/
│   │   └── review/
│   ├── types/                      # Shared TypeScript declarations
│   ├── utils/                      # Error, response, JWT, and helpers
│   ├── app.ts                      # Express app and route registration
│   └── server.ts                   # Database connection and startup
├── .env.example
├── .gitignore
├── package.json
├── prisma.config.ts
└── tsconfig.json
```

### Typical module structure

```text
module-name/
├── module.controller.ts            # HTTP request and response handling
├── module.interface.ts             # TypeScript types
├── module.query.ts                 # Filtering, searching, and sorting
├── module.route.ts                 # Endpoint definitions
├── module.service.ts               # Business logic and database operations
└── module.validation.ts            # Zod request validation
```

## 🚀 Installation & Setup

### Prerequisites

- Node.js `20.19+` or `24.x` recommended
- npm
- PostgreSQL database
- Stripe test account for payment testing
- Stripe CLI for local webhook forwarding

### 1. Clone the repository

```bash
git clone https://github.com/Rezwanul777/rent-nest-backend.git
cd rent-nest-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the application

Create a `.env` file in the project root and provide the required environment variables.

### 4. Prepare the database

```bash
npx prisma generate
npx prisma migrate dev
npx prisma db seed
```

### 5. Start the development server

```bash
npm run dev
```

The API will be available at:

```text
http://localhost:5000
```

## 🔑 Environment Variables

```env
NODE_ENV=development
PORT=5000

DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"

BCRYPT_SALT_ROUNDS=10

JWT_ACCESS_SECRET=replace-with-a-long-random-access-secret
JWT_REFRESH_SECRET=replace-with-a-long-random-refresh-secret
JWT_ACCESS_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=7d

APP_URL=http://localhost:3000

STRIPE_SECRET_KEY=sk_test_replace_me
STRIPE_WEBHOOK_SECRET=whsec_replace_me
STRIPE_SUCCESS_URL=http://localhost:3000/payment/success
STRIPE_CANCEL_URL=http://localhost:3000/payment/cancel
```

> [!IMPORTANT]
> Never commit `.env`, database credentials, JWT secrets, Stripe keys, webhook secrets, or production administrator credentials.

## 🗄 Database Management

### Generate Prisma Client

```bash
npx prisma generate
```

### Create and apply a development migration

```bash
npx prisma migrate dev --name your_migration_name
```

### Apply committed migrations in production

```bash
npx prisma migrate deploy
```

### Seed the database

The seed process creates the initial administrator account:

```bash
npx prisma db seed
```

### Open Prisma Studio

```bash
npx prisma studio
```

## 💻 Running the Project

### Development mode

```bash
npm run dev
```

### Production build

```bash
npm run build
npm start
```

### Available scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Start the application in watch mode |
| `npm run build` | Generate Prisma Client and compile TypeScript |
| `npm start` | Start the compiled production server |
| `npm run stripe:webhook` | Forward local Stripe events to the webhook endpoint |

## 🔌 Core Integrations

### Authentication

Protected endpoints support both:

- Bearer tokens in the `Authorization` header
- HTTP-only access-token cookies

```http
Authorization: Bearer <access-token>
```

Refresh tokens are stored in HTTP-only cookies and are used to issue new access tokens securely.

### Stripe integration

The payment module creates Stripe-hosted Checkout Sessions. A verified `checkout.session.completed` webhook marks the payment as paid and activates the corresponding rental agreement.

Run the following command for local webhook testing:

```bash
stripe listen --forward-to localhost:5000/api/payments/webhook
```

Copy the signing secret generated by Stripe CLI into `STRIPE_WEBHOOK_SECRET`, then restart the server.

> [!NOTE]
> The webhook endpoint cannot be tested with an ordinary Postman request because Stripe must generate the `Stripe-Signature` header from the exact raw request body.

## 🔗 API Overview

Base URL:

```text
http://localhost:5000/api
```

| Module | Base endpoint | Main access |
| :--- | :--- | :--- |
| Authentication | `/auth` | Public and authenticated |
| Administration | `/admin` | Admin |
| Categories | `/categories` | Public and Admin |
| Properties | `/properties` | Public, authenticated, and Landlord |
| Rental requests | `/rental-requests` | Tenant, Landlord, and Admin |
| Rental agreements | `/rental-agreements` | Tenant, Landlord, and Admin |
| Payments | `/payments` | Tenant, Landlord, Admin, and Stripe |
| Reviews | `/reviews` | Tenant and Landlord |

### Standard success response

```json
{
  "success": true,
  "message": "Request completed successfully",
  "data": {}
}
```

### Pagination metadata

```json
{
  "page": 1,
  "limit": 10,
  "total": 25,
  "totalPages": 3
}
```

## 🔄 Business Workflow

```mermaid
flowchart LR
    A[Register] --> B[Login]
    B --> C[Landlord creates property]
    C --> D[Tenant submits request]
    D --> E{Landlord decision}
    E -->|Rejected| F[Request closed]
    E -->|Approved| G[Agreement created]
    G --> H[Stripe Checkout]
    H --> I[Webhook verification]
    I --> J[Payment paid]
    J --> K[Agreement active]
    K --> L[Agreement completed]
    L --> M[Tenant review]
```

### Status lifecycle

```text
Rental Request:    PENDING → APPROVED | REJECTED | CANCELLED
Rental Agreement:  PENDING_PAYMENT → ACTIVE → COMPLETED | TERMINATED
Payment:           PENDING → PROCESSING → PAID | FAILED | REFUNDED | CANCELLED
```

## ☁️ Deployment

| Component | Service |
| :--- | :--- |
| Backend API | Vercel |
| Database | PostgreSQL |
| ORM | Prisma ORM |
| Payment processing | Stripe |
| Source control | GitHub |

Recommended production scripts:

```json
{
  "scripts": {
    "build": "prisma generate && tsc",
    "postinstall": "prisma generate"
  },
  "engines": {
    "node": "24.x"
  }
}
```

### Vercel deployment checklist

1. Push the latest project to GitHub.
2. Import the repository into Vercel.
3. Use the repository root as the Root Directory.
4. Set the Build Command to `npm run build`.
5. Leave the Output Directory empty.
6. Add all production environment variables.
7. Deploy and verify the root health endpoint.
8. Register the production Stripe webhook:

```text
https://your-backend-domain.vercel.app/api/payments/webhook
```

9. Add the new endpoint signing secret as `STRIPE_WEBHOOK_SECRET`.
10. Redeploy the application.

## 🔐 Security Considerations

- Keep all credentials outside source control.
- Allow only `TENANT` and `LANDLORD` during public registration.
- Create administrators through a trusted seed or internal workflow.
- Use strong, unique JWT secrets in production.
- Enable HTTPS and secure cookie settings.
- Validate role and resource ownership on protected operations.
- Verify Stripe webhook signatures using the raw request body.
- Rotate every credential that has ever been exposed publicly.

## 📈 Future Improvements

- [ ] Email and rental-status notifications
- [ ] Cloud image-upload integration
- [ ] Advanced administrative analytics dashboard
- [ ] API rate limiting and abuse prevention
- [ ] Forgot-password and password-reset workflow
- [ ] Automated unit and integration testing
- [ ] Structured application logging
- [ ] CI/CD pipeline with automated checks

## 👨‍💻 Author

### Rezwanul Haque

**Backend Developer | MERN Stack Developer**

- GitHub: [@Rezwanul777](https://github.com/Rezwanul777)
- Project: [RentNest Backend](https://github.com/Rezwanul777/rent-nest-backend)

## 📄 License

This project is distributed under the **ISC License** declared in `package.json`.

---

<div align="center">

### Built with Node.js, TypeScript, Express, Prisma, PostgreSQL, and Stripe

If you find this project useful, please consider giving the repository a ⭐

**[Back to top](#-rentnest-backend)**

</div>



👨‍💻 Author

Rezwanul Haque
📄 License

## Rezwanul Haque

**Backend Developer | MERN Stack Developer**





