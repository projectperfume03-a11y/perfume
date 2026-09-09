# Aster Parfums

Premium perfume commerce application built as a React/Vite customer storefront and a NestJS/Mongoose REST API.

## Stack

- Frontend: React, Vite, JSX, React Router, Axios, Lucide React
- Backend: NestJS, TypeScript, Mongoose, MongoDB, JWT, class-validator
- Storage: MongoDB for application data and Cloudinary for product media

## Run locally

1. Copy `backend/.env.example` to `backend/.env` and set MongoDB, JWT, and admin values.
2. Copy `frontend/.env.example` to `frontend/.env`.
3. Start the API with `cd backend; npm install; npm run start:dev`.
4. Start the storefront with `cd frontend; npm install; npm run dev`.

The customer app runs at `http://localhost:5173` and the API at `http://localhost:5000/api`.

## API foundation

- `GET /api/products` supports pagination, search, category, brand, gender, fragrance family, price, and sorting parameters.
- `GET /api/products/slug/:slug` returns an active product.
- `POST /api/cart/calculate` validates current product prices before calculating a cart estimate.
- `POST /api/orders` validates current products and stores immutable price snapshots.
- `POST /api/auth/login` returns a JWT for the configured admin account.

The storefront includes the full customer browsing, detail, cart, and contact flow. Product and order data are now modeled behind the API boundary so the remaining admin resources can be added without changing the customer UI contract.

## Security

Never commit `.env` files. Use a long random JWT secret, a bcrypt admin password hash, restrictive production CORS origins, and Cloudinary credentials only on the backend.
