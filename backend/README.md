# Om Cycle Store Backend

Production-ready backend for a local store management and ecommerce platform serving cycle parts, bicycle accessories, electronics accessories, general products, mobile recharge, and mobile repair services.

## Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT auth with cookies and bearer tokens
- bcryptjs password hashing
- Multer plus Cloudinary image uploads
- Razorpay payment order creation and verification
- Helmet, rate limiting, validation, centralized error handling

## Folder Structure

- `config` Environment, MongoDB, Cloudinary, Razorpay
- `controllers` Request handlers
- `middleware` Auth, upload, validation, errors, rate limiting
- `models` Mongoose schemas
- `routes` Route modules
- `services` Email, payments, uploads, order preparation
- `utils` Helpers, async wrapper, token and error helpers
- `validators` Express Validator schemas
- `uploads` Reserved local upload directory
- `seeds` Demo seed script

## Quick Start

1. Copy `.env.example` to `.env`
2. Install dependencies with `npm install`
3. Seed demo data with `npm run seed`
4. Start the server with `npm run dev`

## Demo Credentials

- Admin: `admin@omcyclestore.com` / `Admin@123`
- Customer: `customer@omcyclestore.com` / `Customer@123`

## Notes

- Product image upload endpoints expect multipart form data with the field name `images`.
- Razorpay routes require valid `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`.
- Forgot-password email delivery requires SMTP credentials.
- Full API route list is documented in [API_DOCS.md](./API_DOCS.md).
