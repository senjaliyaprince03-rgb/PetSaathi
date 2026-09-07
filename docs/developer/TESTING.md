# PetSaathi Comprehensive Testing Guide

## Test Suites Overview

PetSaathi features 200+ automated tests across 3 testing tiers:

### 1. Unit Tests (55 test files, 201 tests)
Runs isolated domain logic, state machines, encryption, and validations with Vitest:
```bash
npm run test
```

### 2. Concurrency & Race-Condition Tests (3 test suites)
Fires simultaneous parallel requests against real database transactions:
- **Double Accept**: 10 simultaneous sitters accepting 1 booking (guarantees exactly 1 winner, 9 x 409s).
- **Double Spend**: 2 parallel bookings spending the last remaining entitlement credit (guarantees exactly 1 confirmation).
- **Webhook Replay**: 5 identical Razorpay capture events fired simultaneously (guarantees exactly 1 capture, 4 x 200 duplicates).
```bash
npm run test:concurrency
```

### 3. AI Retrieval & Grounding Benchmark (30 queries)
Evaluates RAG retrieval precision and model answer quality across 10 specialized domains:
```bash
npm run ai:benchmark
```

### 4. Full Static Typecheck
Validates zero TypeScript errors:
```bash
npm run typecheck
```
