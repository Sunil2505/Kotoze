# KAD-001: Multi-Channel Commerce Architecture

## Status

Accepted

---

## Version

1.0

---

## Date

2026-07-13

---

# Context

Kotoze is designed as a complete commerce platform rather than an online marketplace alone.

The platform must support multiple sales channels while maintaining a single source of truth for products, inventory, pricing, customers, and orders.

---

# Decision

Kotoze will use a Multi-Channel Commerce Architecture.

Current Sales Channels

- Online Marketplace
- POS / Counter Sales

Future Sales Channels

- Mobile App
- Wholesale
- B2B Portal
- Social Commerce

---

# Business Rules

## Product Catalog

All channels use the same product catalog.

There will never be separate products for Online and POS.

---

## Inventory

Inventory is shared across every sales channel.

Example

Available Stock = 100

Online Sale = 5

POS Sale = 3

Remaining Stock = 92

Inventory is maintained only once.

---

## Pricing

Pricing engine remains centralized.

Different pricing strategies may be introduced later without changing the product model.

Examples

- Retail Price
- Wholesale Price
- Offer Price
- Customer Group Pricing

---

## Orders

Every completed sale creates an order.

The sales channel is recorded.

Examples

ONLINE

POS

WHOLESALE

---

## Completed Sale Policy

Completed orders cannot be edited.

Allowed

- Return
- Refund
- Exchange (Future)

Not Allowed

- Edit Completed Order
- Delete Completed Order

---

## Returns

Returns always create a separate transaction.

Workflow

Return Request

↓

Inspection

↓

Refund / Replacement

↓

Inventory Update

Original order remains unchanged.

---

## Benefits

- Single Inventory
- Single Product Catalog
- Better Reporting
- Better Audit Trail
- Easier Scaling
- Omni-channel Ready

---

# Consequences

All future modules must follow this architecture.

No module should maintain separate inventory or product information.

---

# Approved

Kotoze Architecture Team    