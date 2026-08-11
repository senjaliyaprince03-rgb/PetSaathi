# PetSaathi

PetSaathi is a full-stack Next.js application that connects pet parents with pet sitters.

## Features
- **Authentication**: Password-less OTP and Google OAuth via custom MongoDB-backed auth.
- **Roles**: Distinct flows for Customers, Partners (Sitters), and Admins.
- **Search**: Leaflet map integration for location-based search.
- **Payments**: Razorpay integration for bookings and subscriptions.

## Local Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/petsaathi/petsaathi.git
   cd petsaathi
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Copy `.env.example` to `.env.local` and fill in the values.
   ```bash
   cp .env.example .env.local
   ```

4. **Database Setup**
   Ensure you have a MongoDB instance running or use MongoDB Atlas.
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the Development Server**
   ```bash
   npm run dev
   ```

## Environment Variables
See `.env.example` for the required keys.

## Deployment
See `docs/DEPLOYMENT.md` for instructions on deploying to Vercel.

## Troubleshooting
See `docs/RUNBOOK.md` for incident response and runbook procedures.
