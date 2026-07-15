# Kotoze Database Collections

## Version

1.0

---

# Collection Overview

| Collection | Purpose |
|------------|----------|
| roles | System roles |
| users | All platform users |
| vendors | Vendor information |
| categories | Product categories |
| brands | Product brands |
| products | Product master |
| product_images | Product gallery |
| product_variants | Product variants |
| inventories | Current inventory |
| inventory_transactions | Stock movement history |
| orders | Customer orders |
| order_items | Ordered products |
| payments | Payment records |
| returns | Return requests |
| return_items | Returned products |
| refunds | Refund records |
| addresses | Customer addresses |
| carts | Shopping cart |
| cart_items | Cart products |
| wishlists | Wishlist |
| wishlist_items | Wishlist products |
| reviews | Product reviews |
| coupons | Coupon management |
| counters | Auto sequence generation |
| settings | System settings |
| audit_logs | Activity logs |

---

# Collection Dependencies

roles

↓

users

↓

vendors

↓

categories

↓

brands

↓

products

↓

inventories

↓

orders

↓

returns

---

# Collection Creation Order

Phase 1

1. roles
2. users
3. vendors

Phase 2

4. categories
5. brands
6. products

Phase 3

7. inventories
8. inventory_transactions

Phase 4

9. orders
10. order_items
11. payments

Phase 5

12. returns
13. return_items
14. refunds

Phase 6

15. carts
16. wishlists
17. reviews

Phase 7

18. counters
19. settings
20. audit_logs

---

# Database Standards

Every collection must support

- timestamps
- soft delete
- audit fields

---

# Naming Standards

Collections

lowercase plural

Examples

users

products

orders

returns

Models

PascalCase

Examples

User

Product

Order

Return

Fields

camelCase

Examples

firstName

lastName

sellingPrice

createdAt

updatedAt

---

# Relationships

Product

↓

Category

↓

Brand

↓

Inventory

↓

Order Items

↓

Returns

Inventory

↓

Inventory Transactions

Order

↓

Order Items

↓

Payments

↓

Returns

---

# Notes

No duplicate business data.

Single source of truth.

Business identity uses SKU.

Database identity uses MongoDB ObjectId.