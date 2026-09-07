# PetSaathi Local Developer Setup Guide

## Prerequisites
- Node.js >= 20.18.0
- npm >= 10.0.0
- MongoDB Atlas cluster or local MongoDB 6.0+ instance
- Git

## Step-by-Step Installation

1. **Clone repository & enter directory**:
   ```bash
   git clone https://github.com/senjaliyaprince03-rgb/PetSaathi.git
   cd PetSaathi
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Fill in required credentials:
   - `MONGODB_URI`: MongoDB Atlas connection string.
   - `NEXTAUTH_SECRET` / `AUTH_SECRET`: 32+ character random string.
   - `NVIDIA_API_KEY`: NVIDIA NIM AI API key.
   - `RAZORPAY_KEY_ID` & `RAZORPAY_KEY_SECRET`: Razorpay sandbox credentials.

4. **Initialize Database Indexes & Schema Baseline**:
   ```bash
   npm run prisma:generate
   npm run migrate
   ```

5. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Server will start at `http://localhost:3000`.
