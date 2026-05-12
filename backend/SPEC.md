# OmcycleStore Backend - Technical Specification

## 1. Project Overview

**Project Name:** OmcycleStore Backend
**Type:** RESTful API for E-Commerce Platform
**Core Functionality:** Full backend for local store management with products, services (mobile repair/recharge), cart, orders, payments, and admin management
**Target Users:** Frontend application, Admin panel, Mobile apps

## 2. Technology Stack

- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT with bcryptjs
- **File Upload:** Multer + Cloudinary
- **Payments:** Razorpay
- **Security:** Helmet, CORS, Express Validator, Rate Limiting
- **Logging:** Morgan
- **Environment:** dotenv

## 3. Architecture

### MVC Structure
```
backend/
├── config/          # Database, Cloudinary, Razorpay configs
├── controllers/      # Business logic
├── middleware/      # Auth, validation, error handling
├── models/          # Mongoose schemas
├── routes/          # API route definitions
├── services/        # External service integrations
├── utils/           # Helper functions
├── validators/      # Input validation schemas
├── uploads/        # Temp file storage
└── server.js        # Entry point
```

## 4. API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login (returns JWT)
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Send reset email
- `POST /api/auth/reset-password/:token` - Reset password
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - List products (with filters, pagination, search)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)
- `GET /api/products/featured` - Get featured products
- `GET /api/products/trending` - Get trending products

### Categories
- `GET /api/categories` - List all categories
- `POST /api/categories` - Create category (Admin)
- `PUT /api/categories/:id` - Update category (Admin)
- `DELETE /api/categories/:id` - Delete category (Admin)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update/:itemId` - Update quantity
- `DELETE /api/cart/remove/:itemId` - Remove item
- `DELETE /api/cart/clear` - Clear cart

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update order status (Admin)
- `POST /api/orders/:id/payment` - Verify payment

### Services
- `POST /api/services/repair/book` - Book mobile repair
- `GET /api/services/repair` - Get repair bookings
- `GET /api/services/repair/:id` - Get repair details
- `PUT /api/services/repair/:id/status` - Update repair status (Admin)
- `POST /api/services/recharge/order` - Place recharge order
- `GET /api/services/recharge` - Get recharge orders

### Users (Admin)
- `GET /api/admin/users` - List all users
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user

### Dashboard (Admin)
- `GET /api/admin/dashboard/stats` - Get dashboard stats
- `GET /api/admin/dashboard/sales` - Get sales reports

### Reviews
- `POST /api/reviews` - Add review
- `GET /api/reviews/product/:productId` - Get product reviews

## 5. MongoDB Models

### User
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (hashed),
  phone: String,
  role: String (enum: user, admin),
  avatar: String (Cloudinary URL),
  addresses: [{
    street: String,
    city: String,
    state: String,
    pincode: String,
    isDefault: Boolean
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Product
```javascript
{
  name: String (required),
  slug: String (unique),
  description: String,
  price: Number (required),
  originalPrice: Number,
  category: ObjectId (ref: Category),
  brand: String,
  images: [String],
  stock: Number (default: 0),
  sku: String,
  tags: [String],
  features: [String],
  isFeatured: Boolean (default: false),
  isTrending: Boolean (default: false),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Category
```javascript
{
  name: String (required, unique),
  slug: String (unique),
  description: String,
  image: String (Cloudinary URL),
  parentCategory: ObjectId (ref: Category),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Order
```javascript
{
  user: ObjectId (ref: User),
  items: [{
    product: ObjectId (ref: Product),
    name: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    phone: String
  },
  paymentMethod: String (enum: razorpay, cod),
  paymentStatus: String (enum: pending, paid, failed),
  razorpayOrderId: String,
  razorpayPaymentId: String,
  orderStatus: String (enum: pending, confirmed, shipped, delivered, cancelled),
  totalAmount: Number,
  shippingCost: Number,
  tax: Number,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Cart
```javascript
{
  user: ObjectId (ref: User),
  items: [{
    product: ObjectId (ref: Product),
    quantity: Number,
    price: Number
  }],
  updatedAt: Date
}
```

### ServiceBooking (Mobile Repair)
```javascript
{
  user: ObjectId (ref: User),
  serviceType: String (enum: screen, battery, software, hardware),
  deviceModel: String,
  issue: String,
  estimatedCost: Number,
  status: String (enum: pending, accepted, in_progress, completed, cancelled),
  assignedTechnician: String,
  appointmentDate: Date,
  completedDate: Date,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### RechargePlan
```javascript
{
  operator: String,
  circle: String,
  plans: [{
    amount: Number,
    validity: String,
    data: String,
    talktime: String,
    description: String
  }]
}
```

### RechargeOrder
```javascript
{
  user: ObjectId (ref: User),
  mobileNumber: String,
  operator: String,
  planAmount: Number,
  status: String (enum: pending, success, failed),
  transactionId: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Review
```javascript
{
  user: ObjectId (ref: User),
  product: ObjectId (ref: Product),
  rating: Number (1-5),
  comment: String,
  isApproved: Boolean (default: true),
  createdAt: Date
}
```

## 6. Security Features

- Password hashing with bcryptjs (10 rounds)
- JWT tokens with 7-day expiration
- Role-based access control (user, admin)
- Protected routes middleware
- Admin-only middleware
- Helmet security headers
- CORS configuration
- Rate limiting (100 requests per 15 minutes)
- Input validation with express-validator
- XSS sanitization
- SQL injection prevention (MongoDB sanitization)

## 7. Payment Integration

### Razorpay
- Create order on checkout
- Verify payment signature
- Webhook handling for payment status
- Support for online payment
- Cash on Delivery option

## 8. File Upload

### Cloudinary Integration
- Product images (multiple)
- Category images
- User avatars
- Max file size: 5MB
- Formats: jpg, jpeg, png, webp

## 9. Error Handling

- Centralized error handler middleware
- Custom error class for application errors
- 404 for unknown routes
- 400 for validation errors
- 401 for authentication errors
- 403 for authorization errors
- 500 for server errors

## 10. Seed Data

Pre-populated categories:
1. Cycle Parts
2. Bicycle Accessories
3. Mobile Recharge
4. Mobile Repair
5. Electronics Accessories
6. General Shop

## 11. Acceptance Criteria

- [ ] All API endpoints respond correctly
- [ ] Authentication flow works (register, login, logout)
- [ ] JWT tokens are validated on protected routes
- [ ] Admin routes are protected from regular users
- [ ] Product CRUD operations work
- [ ] Cart operations work correctly
- [ ] Order creation and payment flow works
- [ ] Service booking for repairs works
- [ ] Recharge service orders work
- [ ] File upload to Cloudinary works
- [ ] Error handling returns proper status codes
- [ ] Input validation returns proper errors