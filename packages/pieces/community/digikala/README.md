# Digikala Piece for Activepieces

Custom integration piece for Digikala platform APIs.

## Authentication

Configure with your Digikala API base URL and API Key from the platform admin portal.

## Actions

| Action | Description |
|--------|-------------|
| **Get Order** | Retrieve order details by ID |
| **Update Order Status** | Change order status (Confirmed, Shipped, Delivered, etc.) |
| **Get Inventory** | Check stock levels for a product SKU |
| **Send Customer Notification** | Send SMS, push, email, or in-app notification |

## Triggers

| Trigger | Description |
|---------|-------------|
| **New Order** | Fires when a new order is placed |
| **Low Stock Alert** | Fires when inventory drops below threshold |

## Usage

1. Add a new connection in Activepieces with your Digikala API credentials
2. Use actions/triggers in your flows to automate Digikala operations
