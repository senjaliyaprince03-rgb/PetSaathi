# PetSaathi — Owner Inputs & Statutory Requirements Ledger (NEEDS_FROM_OWNER)

This document tracks all business-sensitive values, statutory disclosures, production secrets, and legal metadata that must be provided by the project owner. Per audit rules, placeholder tokens (e.g., `[TO BE COMPLETED: ...]`) are inserted in code and must never be invented by AI.

---

## 1. Statutory Corporate Disclosures (Terms of Service & Invoicing)

| Item | Description | Placeholder in Code | Status | Owner Input |
| :--- | :--- | :--- | :---: | :--- |
| **Registered Legal Entity Name** | Full registered corporate entity name under the Companies Act, 2013 | `[TO BE COMPLETED: Registered Corporate Entity Name]` | PENDING | |
| **Corporate Identification Number (CIN)** | 21-digit alphanumeric CIN issued by the Ministry of Corporate Affairs | `[TO BE COMPLETED: CIN]` | PENDING | |
| **Registered Office Address** | Physical registered corporate address in India | `[TO BE COMPLETED: Registered Office Address]` | PENDING | |
| **GSTIN** | Goods and Services Tax Identification Number for invoicing | `[TO BE COMPLETED: GSTIN]` | PENDING | |

---

## 2. Statutory Grievance Redressal Officer (Rule 4(4) & 5(3)(b) of Consumer Protection E-Commerce Rules 2020)

| Item | Description | Placeholder in Code | Status | Owner Input |
| :--- | :--- | :--- | :---: | :--- |
| **Grievance Officer Name** | Natural person designated as Grievance Officer | `[TO BE COMPLETED: Grievance Officer Name]` | PENDING | |
| **Grievance Officer Designation** | Official corporate title | `[TO BE COMPLETED: Grievance Officer Designation]` | PENDING | |
| **Grievance Officer Phone** | Dedicated direct telephone number for redressal | `[TO BE COMPLETED: Grievance Officer Phone]` | PENDING | |
| **Grievance Officer Email** | Redressal email address | `grievance@petsaathi.in` | PENDING | |
| **Physical Redressal Office** | Physical address for postal grievance notices | `[TO BE COMPLETED: Grievance Redressal Office Address]` | PENDING | |

---

## 3. Production Deployment & Canonical Domain

| Item | Description | Environment Variable | Status | Owner Input |
| :--- | :--- | :--- | :---: | :--- |
| **Final Canonical Production Domain** | Base URL for SEO, canonical tags, OpenGraph, auth callbacks | `NEXT_PUBLIC_APP_URL` | PENDING | (e.g. `https://petsaathi.in` or `https://petsaathi-two.vercel.app`) |

---

## 4. Root Administrator Credentials

| Item | Description | Environment Variable | Status | Owner Input |
| :--- | :--- | :--- | :---: | :--- |
| **Production Admin Email** | Super admin account email for initial root provisioning | `ADMIN_EMAIL` | PENDING | |
| **Production Admin Password** | Strong administrative password (will be hashed) | `ADMIN_PASSWORD` | PENDING | |

---

## 5. Operations & Customer Promises

| Item | Description | Scope | Status | Owner Input |
| :--- | :--- | :--- | :---: | :--- |
| **Official Customer Support Hours** | Uniform support operating hours across marketing and terms | All public pages | PENDING | (e.g. `08:00 AM - 08:00 PM IST` vs `07:00 AM - 10:00 PM IST`) |
| **Official Support Phone** | Inbound customer support telephone number | Footer / Contact | PENDING | |
| **Pet Membership Pricing** | Approved tier prices for club membership | `/partners/membership` | PENDING | Keep as "Pricing coming soon" until approved |
