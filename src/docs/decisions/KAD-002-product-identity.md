# KAD-002: Product Identity & SKU Strategy

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

Every product in Kotoze requires a permanent business identity.

This identity must remain unchanged throughout the entire lifecycle of the product.

The system must support Online Marketplace, POS, Inventory Management, Orders, Returns, Analytics, and future integrations without changing product identity.

---

# Decision

Every product shall have two unique identifiers.

1. MongoDB ObjectId
2. SKU (Stock Keeping Unit)

---

# Product Identity

## MongoDB ObjectId

Purpose

Internal database relationship.

Used for:

- References
- Queries
- Database operations

Customers will never see this ID.

---

## SKU

Purpose

Permanent business identity.

Used for:

- Inventory
- Orders
- Returns
- POS
- Barcode
- Reports
- Analytics

Customers may see SKU when required.

---

# SKU Rules

SKU must be

- Unique
- Permanent
- Auto Generated
- Immutable

SKU can never be changed after product creation.

---

# SKU Format

Current Version

KTZ-000001

Examples

KTZ-000001

KTZ-000002

KTZ-000003

Future versions may include category codes.

Example

KTZ-ELC-000001

KTZ-MOB-000001

KTZ-FSH-000001

---

# SKU Generation

SKU generation must use a centralized counter.

The application must never generate SKU using

- Product Count
- Collection Length
- Manual Entry

---

# Counter Collection

Collection

counters

Document

{
    "_id": "product",
    "sequence": 1
}

Workflow

Read Counter

↓

Increment Counter

↓

Generate SKU

↓

Save Product

---

# Product Deletion

Products are never permanently deleted.

Kotoze follows Soft Delete.

Fields

isDeleted

deletedAt

deletedBy

---

# Completed Orders

If a product has already been sold,

its SKU remains permanently reserved.

Deleted products never release their SKU.

SKU reuse is prohibited.

---

# Benefits

- Prevent Duplicate SKU
- Better Audit Trail
- Stable Inventory
- Safe Returns
- Accurate Reporting
- Enterprise Scalability

---

# Consequences

Every module inside Kotoze must use SKU as the business identifier.

MongoDB ObjectId remains an internal identifier only.

---

# Approved

Kotoze Architecture Team