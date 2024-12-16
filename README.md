# Invoice Generator Backend

This is the backend for the Invoice Generator application. It is built using Node.js, Express, and MongoDB.

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Middleware](#middleware)
- [Models](#models)
- [Controllers](#controllers)
- [Error Handling](#error-handling)

## Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/ViragJain3010/Leviatin_Backend
    cd backend
    ```

2. Install the dependencies:

    ```sh
    npm install
    ```

## Configuration

Create a `.env` file in the root directory and add the following environment variables:

```env
PORT=5000
MONGODB_URI=YOUR_DATABASE_URI
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
BASE_URL=http://localhost:5000
```

## Running the Application

To start the application in development mode, run:

```sh
npm run dev
```

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Sign up a new user
- `POST /api/auth/login` - Log in an existing user
- `GET /api/auth/validate-token` - Validate a JWT token

### Products

- `GET /api/products` - Get all products for the authenticated user
- `POST /api/products` - Add a new product for the authenticated user

### Invoice

- `GET /api/invoice/generate` - Generate an invoice PDF for the authenticated user

## Middleware

- [authMiddleware](src/middleware/auth.middleware.js) - Middleware to authenticate requests using JWT

## Models

- User - User model
- Product - Product model

## Controllers

- auth.controller.js - Handles authentication-related operations
- product.controller.js - Handles product-related operations
- invoice.controller.js - Handles invoice generation

## Error Handling
The application uses a custom error handler middleware to handle errors and send appropriate responses.