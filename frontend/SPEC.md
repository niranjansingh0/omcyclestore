# OmniStore - E-Commerce Frontend Specification

## 1. Project Overview

**Project Name:** OmcycleStore
**Type:** Full Frontend E-Commerce Web Application
**Core Functionality:** A premium e-commerce platform inspired by Amazon/Flipkart with full shopping experience including product browsing, cart management, wishlist, user authentication, and checkout flow.
**Target Users:** Online shoppers looking for a modern, fast, and responsive shopping experience.

## 2. Technology Stack

- **Framework:** React.js 18 with Vite
- **Styling:** Tailwind CSS 3.4
- **State Management:** Redux Toolkit
- **Routing:** React Router DOM v6
- **HTTP Client:** Axios
- **Animations:** Framer Motion
- **Carousel:** Swiper.js
- **Icons:** Lucide React, React Icons

## 3. UI/UX Specification

### Color Palette

**Light Mode:**
- Primary: `#FF6B35` (Vibrant Orange)
- Primary Dark: `#E55A2B`
- Secondary: `#1E3A5F` (Deep Navy)
- Accent: `#00D9A5` (Mint Green)
- Background: `#FFFFFF`
- Surface: `#F8FAFC`
- Text Primary: `#0F172A`
- Text Secondary: `#64748B`
- Border: `#E2E8F0`
- Success: `#10B981`
- Warning: `#F59E0B`
- Error: `#EF4444`

**Dark Mode:**
- Primary: `#FF6B35`
- Secondary: `#3B82F6`
- Background: `#0F172A`
- Surface: `#1E293B`
- Text Primary: `#F8FAFC`
- Text Secondary: `#94A3B8`

### Typography

- **Font Family:** "Inter", system-ui, sans-serif
- **Headings:** Font weight 700
- **Body:** Font weight 400-500
- **Font Sizes:**
  - H1: 2.5rem (40px)
  - H2: 2rem (32px)
  - H3: 1.5rem (24px)
  - H4: 1.25rem (20px)
  - Body: 1rem (16px)
  - Small: 0.875rem (14px)
  - XSmall: 0.75rem (12px)

### Responsive Breakpoints

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Layout Structure

- Max container width: 1440px
- Navbar height: 72px (desktop), 64px (mobile)
- Footer: Full width, dark themed

## 4. Page Structure

### 4.1 Layout Components
- **MainLayout:** Wraps all public pages with Navbar/Footer
- **AdminLayout:** Wraps admin pages with sidebar navigation

### 4.2 Pages

1. **Home Page** (`/`)
   - Hero banner slider (Swiper.js)
   - Featured products carousel
   - Trending products section
   - Category grid
   - Deal of the day section
   - Newsletter signup

2. **Product Listing Page** (`/products`)
   - Search bar with filters
   - Category filter sidebar
   - Price range slider
   - Sort dropdown (price, popularity, rating)
   - Grid/List view toggle
   - Pagination
   - Product cards with lazy loading

3. **Product Details Page** (`/product/:id`)
   - Image gallery with zoom
   - Multiple product images
   - Product info (title, price, description)
   - Rating stars display
   - Add to cart / Wishlist buttons
   - Reviews section
   - Related products carousel

4. **Cart Page** (`/cart`)
   - Cart items list with quantity controls
   - Price summary
   - Coupon code input
   - Checkout button

5. **Wishlist Page** (`/wishlist`)
   - Saved products grid
   - Move to cart action
   - Remove from wishlist

6. **Checkout Page** (`/checkout`)
   - Shipping address form
   - Order summary
   - Payment method selection (UI only)

7. **Login Page** (`/login`)
   - Email/password form
   - Social login buttons (UI)
   - Remember me checkbox

8. **Register Page** (`/register`)
   - Full registration form
   - Terms acceptance

9. **User Profile Page** (`/profile`)
   - Profile information
   - Edit profile form
   - Address book

10. **Order History Page** (`/orders`)
    - Order list with status
    - Order details

11. **Admin Dashboard** (`/admin`)
    - Overview stats
    - Recent orders
    - Product management table
    - Analytics charts (UI)

## 5. Component Specifications

### Navbar
- Logo (left)
- Search bar (center, expandable on mobile)
- Icons: Cart (with badge), Wishlist, Profile, Menu (mobile)
- Sticky on scroll with shadow
- Transparent on hero, solid on scroll

### Footer
- 4-column layout: About, Quick Links, Categories, Contact
- Social media links
- Newsletter signup
- Copyright text

### ProductCard
- Image with hover zoom effect
- Title, price, original price (if discounted)
- Rating stars
- Quick action buttons (add to cart, wishlist)
- Discount badge

### CategoryCard
- Icon/Image
- Category name
- Item count
- Hover effect with scale

### HeroSlider
- Full-width images
- Auto-play with pagination
- Text overlay with CTA button

### FilterSidebar
- Category checkboxes
- Price range slider
- Rating filter
- Clear filters button

### Modals
- Login/Register modal
- Quick view modal
- Confirmation modal

## 6. State Management (Redux)

### Slices

1. **authSlice**
   - user: { id, name, email, avatar }
   - isAuthenticated: boolean
   - loading: boolean

2. **cartSlice**
   - items: [{ productId, quantity, price }]
   - totalItems: number
   - totalPrice: number

3. **wishlistSlice**
   - items: [productId]

4. **productSlice**
   - products: []
   - categories: []
   - loading: boolean
   - filters: { category, priceRange, sort }

5. **themeSlice**
   - mode: 'light' | 'dark'

## 7. Animations (Framer Motion)

- Page transitions: fade + slide
- Card hover: scale(1.02) + shadow
- Button hover: scale(1.05)
- Modal: fade + scale
- Skeleton pulse animation
- Stagger children on list load

## 8. Dummy Data

### Categories
- Electronics
- Fashion
- Home & Living
- Sports & Fitness
- Books & Media
- Beauty & Health

### Products (50+ items)
Each product includes:
- id, name, description, price, originalPrice
- images[], category, brand
- rating, reviewCount
- inStock, tags[]

## 9. Acceptance Criteria

- [ ] All pages load without errors
- [ ] Responsive on mobile, tablet, desktop
- [ ] Dark/Light mode toggle works
- [ ] Cart add/remove/update works
- [ ] Wishlist add/remove works
- [ ] Product filtering and sorting works
- [ ] Search returns relevant results
- [ ] Animations are smooth (60fps)
- [ ] No console errors
- [ ] All images load properly