# Backend Project

## Overview
Backend application built with Node.js, Express and Prisma ORM.

## Technologies
- Node.js
- Express
- Prisma
- PostgreSQL

## Installation

1. Install dependencies:
   npm install

2. Configure environment variables:
   Create a .env file:

   DATABASE_URL=your_database_connection_string
   JWT_SECRET=your_jwt_secret

3. Run database migrations:
   npx prisma migrate deploy

4. Start development server:
   npm run dev

## Main Features
- JWT Authentication (Access + Refresh Token)
- Refresh Token Rotation
- Multi-tenant structure
- Secure password hashing
- Login attempt tracking

## Production Recommendations
- Enable rate limiting
- Add logging and monitoring
- Use HTTPS
- Protect environment variables
