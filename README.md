# Chads Store - E-commerce Platform

Welcome to Chads Store, a contemporary e-commerce application built to deliver a smooth, engaging, and secure online shopping experience. This project showcases a full-featured platform where users can browse a diverse catalog of products, manage their selections within a dynamic shopping cart, and complete purchases through an integrated payment system.

The primary goal of Chads Store is to provide a robust and user-friendly interface for both customers and potential administrators (though admin features might be future enhancements). It emphasizes a clean design, intuitive navigation, and reliable transaction processing. From user registration and login to adding items to the cart and finalizing payments with Razorpay, every step has been crafted with care to ensure a high-quality user journey.

This application serves as an excellent example of modern web development practices, incorporating a reactive frontend, a flexible BaaS (Backend as a Service) solution with Supabase, and secure serverless functions for sensitive operations.

## Key Features

*   **User Authentication:** Secure sign-up and sign-in functionality for users.
*   **Product Display:** Browse and view product details.
*   **Shopping Cart:** Add products to cart, update quantities, and remove items.
*   **Checkout Process:**
    *   User-friendly form for shipping address, pincode, and order notes.
    *   Pincode validation to check for serviceability.
    *   Option to use current location for shipping address (browser geolocation).
*   **Payment Integration:**
    *   Multiple payment options including Card Payments (via Razorpay) and UPI.
    *   Secure Razorpay integration with client-side handling and server-side signature verification.
    *   Option for Cash on Delivery (COD) as a payment method.
*   **Order Management (Supabase):** Orders and transaction details are stored in a Supabase database.
*   **Responsive Design:** Styled with Tailwind CSS and Shadcn UI components for a consistent experience across devices.

## Tech Stack

This project leverages a modern, robust technology stack to deliver a feature-rich e-commerce experience:

*   **Core Framework:** React with TypeScript, powered by Vite for a fast and optimized development workflow.
*   **User Interface:** Styled with Tailwind CSS for utility-first styling, complemented by Shadcn UI components for a polished and consistent look.
*   **Client-Side Navigation:** Handled by React Router DOM.
*   **Backend Services & Database:** Supabase provides the backend infrastructure, including user authentication, a PostgreSQL database for storing cart items, orders, and transaction details.
*   **Serverless API Functions:** Next.js API routes (located in `pages/api`) are used for dedicated server-side logic, such as payment gateway interactions.
*   **Payment Processing:** Securely integrated with Razorpay for card payments and other methods.
*   **State Management:** Primarily utilizes React Context API for managing global state related to Cart and Authentication.

## Project Setup & Launch

To get Chads Store running on your local machine, follow these streamlined steps:

**1. Obtain the Source Code:**

   Clone the repository to your local system:
   ```bash
   git clone <your-repository-url>
   cd chads-store # Or your project directory name
   ```

**2. Configure Environment Variables:**

   Create a `.env` file in the project root. This file is crucial for connecting to backend services and payment gateways. Populate it with your specific keys:

   ```env
   # Supabase (Backend & Database)
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

   # Razorpay (Payment Gateway)
   VITE_RAZORPAY_KEY_ID=your_razorpay_key_id      # Client-side
   RAZORPAY_KEY_ID=your_razorpay_key_id          # Server-side
   RAZORPAY_KEY_SECRET=your_razorpay_secret      # Server-side
   ```
   *   `VITE_` prefixed variables are used by the client-side application.
   *   Obtain Supabase credentials from your Supabase project dashboard.
   *   Obtain Razorpay credentials from your Razorpay dashboard (use test keys for development).

**3. Install Dependencies & Launch:**

   This project uses `bun` by default, but `npm` is also supported.

   **Using Bun:**
   ```bash
   bun install
   bun run dev
   ```

   **Using NPM:**
   ```bash
   npm install
   npm run dev
   ```

   Once launched, the application will typically be accessible at `http://localhost:5173`.

**Database Schema Note:**
Ensure your Supabase instance is configured with the necessary tables (`users`, `cart_items`, `orders`, `order_items`, `transactions`). Refer to the data structures defined within `src/lib/supabase.ts` if setting up the schema manually.
