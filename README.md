# 🏢 RentNest Backend

> A production-ready Rental Management System Backend built with Node.js, Express, TypeScript, PostgreSQL, Prisma ORM, and Stripe.

---

## 🔗 Quick Links

| Resource | Link |
| :--- | :--- |
| **Backend Repository** | [GitHub Link](https://github.com/thedev-mohammadali/rent-nest-backend.git) |
| **Live API** | [Render Deployment](https://rent-nest-backend-1.onrender.com/) |
| **API Documentation** | [Postman Docs](https://documenter.getpostman.com/view/29072367/2sBY4LQgiB) |
| **Demo Video** | [Google Drive](https://drive.google.com/file/d/1f0bPzB-JE_i_1FODzWciud64w_VZqTPu/view?usp=sharing) |
| **ERD Diagram** | [DrawSQL](https://drawsql.app/teams/mohammad-ali-thedev/diagrams/rentnest) |

### 🔐 Demo Credentials
| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@rentnest.com` | `Admin123@` |

---

## 📑 Table of Contents

- [Project Overview](#-project-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Installation & Setup](#-installation--setup)
- [Database Management](#-database-management)
- [Running the Project](#-running-the-project)
- [Core Integrations](#-core-integrations)
- [Business Workflow](#-business-workflow)
- [Deployment](#-deployment)
- [Future Improvements](#-future-improvements)

---

## 📖 Project Overview

RentNest is a RESTful backend that manages the complete rental lifecycle. It handles everything from secure authentication and property listings to processing rental requests, managing digital agreements, processing Stripe payments, and handling user reviews and administrative duties.

---

## ✨ Features

- **Robust Authentication:** JWT-based auth with Access & Refresh Tokens.
- **Categorization:** Dynamic category management for properties.
- **Property Management:** Full CRUD operations for rental properties.
- **Rental Requests & Agreements:** Lifecycle management from request to active agreement.
- **Payment Processing:** Secure Stripe Checkout & Webhook integration.
- **Review System:** User feedback and rating mechanisms.
- **Admin Dashboard:** Complete administrative control.
- **Advanced Queries:** Pagination, filtering, searching, and sorting capabilities.

---

## 🛠 Tech Stack

- **Core:** Node.js, Express.js, TypeScript
- **Database:** PostgreSQL (Neon), Prisma ORM
- **Validation:** Zod
- **Security:** JWT (JSON Web Tokens), bcrypt
- **Payments:** Stripe
- **Hosting:** Render

---

## 🏗 Architecture

The project follows a **Domain-Driven Modular Architecture** featuring thin controllers, fat services, reusable query builders, and scope-based authorization.

```text
src/
├── app/
├── common/
├── config/
├── generated/
├── lib/
├── middleware/
├── modules/
│   ├── admin/
│   ├── auth/
│   ├── category/
│   ├── payment/
│   ├── property/
│   ├── rental-agreement/
│   ├── rental-request/
│   └── review/
├── routes/
├── types/
├── utils/
├── app.ts
└── server.ts

🚀 Installation & Setup

    Clone the repository:
    Bash

    git clone [https://github.com/thedev-mohammadali/rent-nest-backend.git](https://github.com/thedev-mohammadali/rent-nest-backend.git)
    cd rent-nest-backend

    Install dependencies:
    Bash

    npm install

    Configure Environment Variables:
    Create a .env file in the root directory and add the following:
    Code snippet

    PORT=
    DATABASE_URL=
    NODE_ENV=
    BCRYPT_SALT_ROUNDS=
    JWT_ACCESS_SECRET=
    JWT_REFRESH_SECRET=
    JWT_ACCESS_EXPIRES_IN=
    JWT_REFRESH_EXPIRES_IN=
    STRIPE_SECRET_KEY=
    STRIPE_WEBHOOK_SECRET=
    STRIPE_SUCCESS_URL=
    STRIPE_CANCEL_URL=

🗄 Database Management

Run Migrations:
Bash

npx prisma migrate dev
npx prisma generate

Seed the Database:
(This creates the default administrator account)
Bash

npx prisma db seed

💻 Running the Project

Development Mode:
Bash

npm run dev

Production Build:
Bash

npm run build
npm start

🔌 Core Integrations
Authentication

Protected endpoints support both:

    Bearer Token in the Authorization header.

    HTTP-only Access Token Cookie.
    (Note: Refresh Tokens are securely stored as HTTP-only cookies).

Stripe Integration

To test webhooks locally, use the Stripe CLI:
Bash

stripe listen --forward-to localhost:5000/api/payments/webhook

API Testing

Please refer to the published Postman Documentation linked at the top for detailed endpoint testing.
🔄 Business Workflow

Register ➔ Login ➔ Create Property ➔ Rental Request ➔ Rental Agreement ➔ Stripe Payment ➔ Agreement Activated ➔ Review
☁️ Deployment

    Backend: Render

    Database: Neon PostgreSQL

    Payments: Stripe

📈 Future Improvements

    [ ] Email Notifications

    [ ] Image Uploads Integration

    [ ] Advanced Dashboard Analytics

    [ ] API Rate Limiting

    [ ] Comprehensive Automated Testing

👨‍💻 Author

Rezwanul Haque
📄 License

This is an educational project developed as part of a backend development assignment.