# Subscription Module Design

**Status: Implemented**

## Context

The user wants to design a subscription module for their Strapi CMS project. The goal is to brainstorm what tables (content types) and fields are needed — not to implement yet. The user is in plan mode.

**Requirements from user:**
- With invoicing (full invoice/receipt history with amounts, payment dates, downloadable links)
- Replace existing `currency-subscription-tier` table

---

## Current State

- **User model** (`plugin::users-permissions.user`): Has username, email, role, and a relation to `idea`
- **Existing `currency-subscription-tier`** content type: Has `name` (free/paid), `price`, `enabled` — standalone table with no relation to users

---

## Recommended Design: 3 Tables

### 1. `subscription-plan` (collection type)
Replaces the existing `currency-subscription-tier`. Defines available subscription plans.

| Field | Type | Notes |
|-------|------|-------|
| `name` | string | Plan display name (e.g., "Free", "Pro Monthly") |
| `slug` | uid | URL-friendly identifier |
| `tier` | enumeration | `["free", "paid"]` |
| `price` | decimal | Price per billing cycle |
| `billingCycle` | enumeration | `["monthly", "yearly", "lifetime"]`, default `"monthly"` |
| `enabled` | boolean | Is this plan available for purchase? |
| `quota` | integer | Usage limit number, default `10` |
| `stripePriceId` | string | Stripe Price ID (for payment integration) |
| `sortOrder` | integer | For admin ordering |

---

### 2. `subscription` (collection type)
Tracks each user's active or historical subscription.

| Field | Type | Notes |
|-------|------|-------|
| `user` | manyToOne → user | Who owns this subscription |
| `plan` | manyToOne → `subscription-plan` | The plan they're subscribed to |
| `status` | enumeration | `["active", "cancelled", "expired", "trial", "past_due"]` |
| `startDate` | datetime | Subscription start |
| `endDate` | datetime | Current period end / expiration |
| `autoRenew` | boolean | Will it auto-renew? (optional) |
| `cancelledAt` | datetime | When they cancelled (if applicable) |
| `externalSubscriptionId` | string | Stripe/payment provider subscription ID |
| `metadata` | json | Free-form extra data |

---

### 3. `subscription-invoice` (collection type)
Full invoice/receipt history per subscription.

| Field | Type | Notes |
|-------|------|-------|
| `subscription` | manyToOne → subscription | Parent subscription |
| `user` | manyToOne → user | For easier querying |
| `amount` | decimal | Amount charged |
| `currency` | string | e.g., "USD" |
| `status` | enumeration | `["paid", "failed", "refunded"]` |
| `paidAt` | datetime | Payment timestamp |
| `dueDate` | datetime | Invoice due date |
| `externalInvoiceId` | string | Stripe Invoice ID |
| `invoiceUrl` | string | Link to downloadable invoice |
| `description` | string | Line item description |

---

## Summary

| Content Type | Purpose |
|-------------|---------|
| `subscription-plan` | Plan definitions (price, tier, quota) — replaces `currency-subscription-tier` |
| `subscription` | Per-user subscription status and period |
| `subscription-invoice` | Per-payment invoice records |

---

## Implementation Steps

1. ✅ Create `subscription-plan` content type (replaces `currency-subscription-tier`)
2. ✅ Create `subscription` content type
3. ✅ Create `subscription-invoice` content type
4. ✅ Add relations: user → subscription → subscription-plan, user → subscription-invoice

---

## Implementation Notes

- Created 3 content types: `subscription-plan`, `subscription`, `subscription-invoice`
- Added inverse relations to User model (`subscriptions`, `subscriptionInvoices`)
- Added inverse relation to `subscription-plan` (`subscriptions`)
- Added inverse relation to `subscription` (`invoices`)
- The old `currency-subscription-tier` API still exists - can be deleted later if not needed
