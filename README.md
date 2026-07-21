# 🏢 RentNest Backend

> A production-ready Rental Management System Backend built with Node.js, Express, TypeScript, PostgreSQL, Prisma ORM, and Stripe.

---

## 🔗 Quick Links

| Resource | Link |
| :--- | :--- |
| **Backend Repository** | [GitHub Link](https://github.com/Rezwanul777/rent-nest-backend) |
| **Live API** | [Vercel Deployment](https://rnest-backend.vercel.app/) |
| **API Documentation** | [Postman Docs]() |
| **Demo Video** | [Google Drive](https://drive.google.com/file/d/171O9Lu37FW3t6hwf1VSB0-DVu0dMTh3W/view?usp=sharing) |


### 🔐 Demo Credentials
| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `ayaan.bin@gmail.com` | `admin-nest@123` |

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

    git clone [https://github.com/Rezwanul777/rent-nest-backend)

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

    Backend: Vercel

    Database:  PostgreSQL ORM:PRISMA

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



# 🏢 RentNest Backend

<p align="center">

<img src="https://img.shields.io/badge/Node.js-24-green" />
<img src="https://img.shields.io/badge/Express.js-Backend-black" />
<img src="https://img.shields.io/badge/TypeScript-5-blue" />
<img src="https://img.shields.io/badge/PostgreSQL-Database-blue" />
<img src="https://img.shields.io/badge/Prisma-ORM-purple" />
<img src="https://img.shields.io/badge/Stripe-Payment-purple" />

</p>

## 🚀 Overview

**RentNest** is a scalable rental management platform backend designed to handle the complete rental lifecycle between property owners and tenants.

The system provides secure authentication, property management, rental requests, digital agreements, online payments, reviews, and administrative operations.

Built with a **modular architecture**, this backend focuses on scalability, maintainability, security, and real-world production practices.

---

# 🌟 Key Highlights

✅ Modular Backend Architecture
✅ TypeScript Based Development
✅ Prisma ORM with PostgreSQL
✅ JWT Authentication System
✅ Role-Based Authorization
✅ Stripe Payment Integration
✅ Webhook Based Payment Verification
✅ Advanced Searching & Filtering
✅ Production Ready API Structure

---

# 🔗 Project Links

| Resource           | Link                                             |
| ------------------ | ------------------------------------------------ |
| Backend Repository | https://github.com/Rezwanul777/rent-nest-backend |
| Live API           | https://rnest-backend.vercel.app                 |
| API Documentation  | Postman Documentation                            |
| Demo Video         | Google Drive                                     |

---

# 🏗 System Architecture

```
Client Application
        |
        |
        ↓
Express REST API
        |
        |
        ↓
Service Layer
        |
        |
        ↓
Prisma ORM
        |
        |
        ↓
PostgreSQL Database

```

### Architectural Approach

The project follows:

* Domain Driven Modular Architecture
* Controller-Service-Repository Pattern
* Separation of Business Logic
* Reusable Middleware System
* Centralized Error Handling
* Scalable Folder Structure

---

# 📂 Project Structure

```
src
│
├── modules
│   ├── auth
│   ├── user
│   ├── property
│   ├── category
│   ├── rental-request
│   ├── rental-agreement
│   ├── payment
│   ├── review
│   └── admin
│
├── middleware
├── config
├── routes
├── utils
├── types
├── lib
│
├── app.ts
└── server.ts

```

---

# ✨ Core Features

## 🔐 Authentication & Authorization

* JWT Access Token
* Refresh Token Rotation
* HTTP-only Cookie Security
* Password Encryption
* Role Based Access Control

Supported Roles:

```
ADMIN
LANDLORD
TENANT
```

---

## 🏠 Property Management

Landlords can:

* Create properties
* Update property details
* Delete properties
* Manage availability

Tenants can:

* Browse properties
* Search properties
* Filter properties
* View property details

---

## 📄 Rental Workflow

```
User Registration
        ↓
Authentication
        ↓
Property Listing
        ↓
Rental Request
        ↓
Owner Approval
        ↓
Rental Agreement
        ↓
Stripe Payment
        ↓
Active Rental
        ↓
Review Submission

```

---

## 💳 Payment System

Implemented:

* Stripe Checkout Session
* Secure Payment Processing
* Stripe Webhook Verification
* Payment Status Management

Webhook Flow:

```
Stripe
  |
  ↓
Webhook Endpoint
  |
  ↓
Payment Verification
  |
  ↓
Database Update

```

---

## ⭐ Review System

Features:

* Rating system
* User feedback
* Property reviews
* Review management

---

# 🛠 Technology Stack

## Backend

* Node.js
* Express.js
* TypeScript

## Database

* PostgreSQL
* Prisma ORM

## Security

* JWT
* bcrypt
* Zod Validation

## Payment

* Stripe API

## Deployment

* Vercel
* Neon PostgreSQL

---

# ⚙️ Local Development Setup

### Clone Repository

```bash
git clone https://github.com/Rezwanul777/rent-nest-backend.git

cd rent-nest-backend
```

### Install Packages

```bash
npm install
```

### Environment Setup

Create `.env` file:

```env
PORT=

DATABASE_URL=

JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=

JWT_ACCESS_EXPIRES_IN=
JWT_REFRESH_EXPIRES_IN=

BCRYPT_SALT_ROUNDS=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

STRIPE_SUCCESS_URL=
STRIPE_CANCEL_URL=
```

---

# 🗄 Database Migration

Generate Prisma Client:

```bash
npx prisma generate
```

Run Migration:

```bash
npx prisma migrate dev
```

Seed Database:

```bash
npx prisma db seed
```

---

# 🧪 API Documentation

Complete API documentation is available through Postman.

Includes:

* Authentication APIs
* Property APIs
* Rental APIs
* Payment APIs
* Review APIs
* Admin APIs

---

# 🔒 Security Practices

Implemented:

✅ JWT Authentication
✅ Password Hashing
✅ Request Validation
✅ Role Authorization
✅ Secure Cookies
✅ Environment Variable Protection
✅ Error Handling Middleware

---

# 🚀 Deployment

| Service  | Platform        |
| -------- | --------------- |
| Backend  | Vercel          |
| Database | Neon PostgreSQL |
| ORM      | Prisma          |
| Payment  | Stripe          |

---

# 📈 Future Roadmap

* [ ] Email Notification System
* [ ] Cloud Image Upload
* [ ] Advanced Analytics Dashboard
* [ ] Redis Cache Integration
* [ ] API Rate Limiting
* [ ] Automated Testing
* [ ] Docker Deployment

---

# 👨‍💻 Author

## Rezwanul Haque

**Backend Developer | MERN Stack Developer**

Focused on building scalable and maintainable web applications.

---

# 📄 License

This project is developed for educational and portfolio purposes.
