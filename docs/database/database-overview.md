# Kotoze Database Overview

## Status

Approved

---

# Overview

Kotoze uses MongoDB as the primary database.

The database is designed using a modular architecture to support future scalability.

The platform supports:

- Online Marketplace
- POS / Counter Sales
- Vendor Management
- Inventory Management
- Order Management
- Returns & Refunds
- Analytics

---

# Design Principles

- Single Source of Truth
- Database First Development
- Soft Delete Strategy
- Audit Trail
- Multi-Channel Commerce
- High Scalability
- Modular Collections

---

# Core Modules

## Authentication

- Roles
- Users
- Sessions

---

## Vendor Management

- Vendors
- Vendor Staff

---

## Catalog

- Categories
- Brands
- Products
- Product Images
- Product Variants
- Product Attributes

---

## Inventory

- Warehouses
- Inventory
- Inventory Transactions

---

## Sales

- Orders
- Order Items
- Payments

---

## Returns

- Returns
- Return Items
- Refunds

---

## Customer

- Addresses
- Cart
- Wishlist

---

## Reviews

- Reviews
- Review Images

---

## Marketing

- Coupons
- Notifications
- Banners

---

## System

- Counters
- Settings
- Audit Logs

---

# Database Rules

- Every collection uses timestamps.
- Every business entity supports soft delete.
- Inventory changes are recorded using transactions.
- Completed orders cannot be edited.
- SKU is immutable.
- MongoDB ObjectId is the internal identifier.
- SKU is the business identifier.

---

# Future Expansion

The architecture supports:

- Multiple Warehouses
- Franchise Stores
- Multi Vendor Marketplace
- Mobile Applications
- Wholesale
- International Expansion

---

# Version

1.0