# Om Cycle Store API

Base URL: `http://localhost:5000/api`

## Authentication

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `POST /auth/forgot-password`
- `POST /auth/reset-password/:token`
- `GET /auth/me`

## Products and Categories

- `GET /products`
  Query params: `search`, `category`, `minPrice`, `maxPrice`, `sort`, `page`, `limit`
- `GET /products/:id`
- `POST /products` Admin or manager, multipart field: `images`
- `PATCH /products/:id` Admin or manager
- `PATCH /products/:id/stock` Admin or manager
- `DELETE /products/:id` Admin or manager
- `GET /categories`
- `POST /categories` Admin or manager
- `PATCH /categories/:id` Admin or manager
- `DELETE /categories/:id` Admin or manager

## Reviews

- `GET /products/:productId/reviews`
- `POST /products/:productId/reviews`
- `DELETE /products/:productId/reviews/:id`

## Cart

- `GET /cart`
- `POST /cart`
- `PATCH /cart/:itemId`
- `DELETE /cart/:itemId`
- `DELETE /cart`

## Orders and Payments

- `POST /orders/checkout/summary`
- `POST /orders`
- `GET /orders`
- `GET /orders/:id`
- `GET /orders/track/:orderNumber`
- `POST /orders/:id/verify-payment`

### Place order payload

```json
{
  "paymentMethod": "razorpay",
  "shippingAddress": {
    "fullName": "Demo Customer",
    "phone": "9876543201",
    "line1": "12 Market Road",
    "city": "Bengaluru",
    "state": "Karnataka",
    "postalCode": "560001",
    "country": "India"
  }
}
```

## Service Bookings

- `GET /services/recharge-plans`
- `POST /services/recharge-plans` Admin or manager
- `PATCH /services/recharge-plans/:id` Admin or manager
- `DELETE /services/recharge-plans/:id` Admin or manager
- `GET /services/history`
- `GET /services/track/:bookingNumber`
- `POST /services/repair-bookings`
- `POST /services/recharge-bookings`
- `PATCH /services/bookings/:id/status` Admin or manager

## Users

- `PATCH /users/me`
- `GET /users` Admin or manager
- `PATCH /users/:id` Admin or manager

## Admin

- `GET /admin/dashboard`
- `GET /admin/orders`
- `PATCH /admin/orders/:id`
- `GET /admin/inventory`
- `GET /admin/sales-report`
