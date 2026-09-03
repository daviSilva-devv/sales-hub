# Sales Hub

A portfolio-safe business operations demo that models the handoff between retail ordering, B2B intent capture, commercial pricing, operations and billing.

The project is based on a real operational workflow, but this public version uses only synthetic customers, products, prices and identifiers. No employer, customer or production data is included.

## Why this project exists

Many internal workflows are not a single CRUD screen. Different teams own different decisions, some information only becomes available later, and invalid state changes can create operational errors.

Sales Hub turns that kind of workflow into an explicit system:

```text
Retail order  ->  Preparing  ->  Ready  ->  Delivered

B2B request   ->  Waiting pricing  ->  Pricing
              ->  Ready for billing -> Billing -> Invoiced
```

For B2B orders, the customer intentionally submits the request without a price. Commercial staff add negotiated values and operational details before the order is handed to billing.

## Main surfaces

- `/totem/varejo` - touch-first retail ordering with promotions and coupons
- `/totem/cliente` - B2B customer flow with catalog and no public prices
- `/operacao/varejo` - retail preparation queue
- `/comercial` - B2B pricing and release workflow
- `/faturamento` - billing handoff and finalization queue
- `/admin` - demo catalog, customers, coupons and operational overview

## Engineering decisions

### State machine outside the UI

Valid transitions live in `src/domain/order-machine.ts`. Components request transitions; they do not invent workflow rules. Terminal states such as `INVOICED`, `DELIVERED` and `CANCELLED` cannot move forward accidentally.

### Business rules as testable functions

Pricing, coupon normalization and discounts are kept outside React components so they can be exercised independently by unit tests.

### Browser-only demo persistence

The public demo intentionally uses `localStorage`. It proves the workflow without pretending to be production infrastructure.

### Cross-tab synchronization

`BroadcastChannel` notifies other open views when an order changes, while the browser `storage` event acts as a complementary synchronization path.

## Architecture

```text
app/                  routes + UI composition
components/           shared presentation

domain/
  order-machine.ts    workflow transitions
  types.ts            domain contracts

data/
  seed.ts             synthetic demo data

lib/
  demo-store.ts       local persistence + synchronization
  pricing.ts          pricing and coupon rules
  format.ts           presentation helpers
```

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the workflow boundaries and state diagrams.

## Stack

- Next.js 16
- React 19
- TypeScript
- CSS
- Vitest

## Run locally

Requires Node.js 20.9+.

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

Useful checks:

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

## Public-repository boundary

This repository is an anonymized case study. It intentionally does not contain production credentials, customer records, internal company documents, private pricing tables or external billing integrations.

The public version demonstrates workflow modeling and interaction design; it is not presented as production-ready infrastructure.
