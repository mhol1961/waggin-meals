# Waggin' Meals Website - User Guide

**Welcome to your new e-commerce platform!** 🐾

This guide will help you understand how to use and manage your Waggin' Meals website. Everything is designed to be simple and intuitive, giving you full control over your business.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Admin Dashboard](#admin-dashboard)
3. [Managing Products](#managing-products)
4. [Order Fulfillment](#order-fulfillment)
5. [Customer Management](#customer-management)
6. [Discount Codes](#discount-codes)
7. [Blog & Content](#blog--content)
8. [Case Studies](#case-studies)
9. [Email Notifications](#email-notifications)
10. [Customer Portal](#customer-portal)
11. [Reports & Analytics](#reports--analytics)
12. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Accessing Your Admin Panel

1. Navigate to: `https://yoursite.com/admin/login`
2. Enter your admin username and password
3. You'll be redirected to the admin dashboard

**Important**: Your admin credentials are stored in the environment variables. Keep them secure and don't share them.

### First Time Setup

After logging in for the first time:
- [ ] Review your product catalog
- [ ] Test placing an order
- [ ] Set up your first discount code
- [ ] Familiarize yourself with the order fulfillment workflow
- [ ] Review email notification settings

---

## Admin Dashboard

### Dashboard Overview

When you log in, you'll see:
- **Quick Stats**: Total orders, revenue, pending orders
- **Recent Orders**: Latest 10 orders for quick access
- **Navigation Menu**: Access all admin features

### Main Navigation

- **Dashboard** - Overview and quick stats
- **Orders** - View and manage all orders
- **Products** - Manage your product catalog
- **Customers** - View customer information
- **Discounts** - Create and manage discount codes
- **Blog** - Manage blog posts
- **Case Studies** - Manage success stories
- **Subscriptions** - Manage recurring orders (coming soon)

---

## Managing Products

### Viewing Your Product Catalog

1. Click **"Products"** in the admin menu
2. You'll see all your products in a list
3. Use search or filters to find specific products

### Product Information

Each product shows:
- Product name and description
- Price
- Inventory status
- Product variants (sizes, flavors)
- Images

### Adding a New Product

1. Click **"Add New Product"**
2. Fill in the product details:
   - **Name**: The product title (e.g., "Chicken & Sweet Potato Bowl")
   - **Description**: Detailed product description
   - **Price**: Base price
   - **SKU**: Stock keeping unit (optional)
   - **Inventory**: Quantity available
3. Add product variants if needed (sizes, flavors)
4. Upload product images
5. Click **"Save Product"**

### Product Variants

If you have products with different sizes or options:
- Go to the product detail page
- Click **"Manage Variants"**
- Add variants with different prices and SKUs
- Example: Small (3 lbs) - $29.99, Medium (5 lbs) - $49.99

### Managing Inventory

To update stock levels:
1. Go to the product page
2. Update the **"Quantity"** field
3. Click **"Save"**

**Tip**: The system tracks inventory automatically when orders are placed.

---

## Order Fulfillment

This is your complete workflow for processing customer orders from placement to delivery.

### Viewing Orders

1. Click **"Orders"** in the admin menu
2. You'll see all orders with:
   - Order number (e.g., WM-20250127-001)
   - Customer name
   - Order total
   - Status (pending, processing, shipped, delivered)
   - Date placed

### Order Statuses Explained

- **Pending** (Yellow) - Order just placed, payment confirmed
- **Processing** (Blue) - You're preparing the order
- **Shipped** (Purple) - Package is in transit
- **Delivered** (Green) - Customer received the order
- **Cancelled** (Red) - Order was cancelled
- **Refunded** (Gray) - Payment was refunded

### Processing an Order (Step-by-Step)

#### Step 1: View Order Details
1. Click on an order to view full details
2. Review:
   - Customer information
   - Shipping address
   - Order items
   - Payment status

#### Step 2: Print Packing Slip
1. Click the **"Print Packing Slip"** dropdown button
2. Choose:
   - **"Preview & Print"** - Review before printing
   - **"Quick Print"** - Print immediately
3. The packing slip includes:
   - Customer shipping address
   - All items with checkboxes to mark as packed
   - Quality check section
   - Signature line

**Tip**: The packing slip is designed for easy warehouse use with checkboxes for each step.

#### Step 3: Update Order Status
1. Click the **"Processing"** status button
2. This lets the customer know you're working on their order

#### Step 4: Pack the Order
- Use the printed packing slip as your guide
- Check off each item as you pack it
- Perform the quality checks
- Sign and date the slip

#### Step 5: Add Tracking Number
1. On the order detail page, find **"Shipping Information"**
2. Click **"Add Tracking"**
3. Select the carrier:
   - USPS (most common)
   - UPS
   - FedEx
   - DHL
4. Enter the tracking number
5. Click **"Add Tracking & Notify Customer"**

**What happens automatically**:
- Order status changes to "Shipped"
- Customer receives email with tracking link
- Tracking number appears on the order page
- Customer can track their package

### After the Order is Delivered

Once the customer receives their order:
1. Manually update status to **"Delivered"** (or leave as "Shipped")
2. The order is complete!

### Order Notes

You can add internal notes to any order:
1. Scroll to **"Order Notes"** section
2. Click **"Edit"**
3. Add your notes (not visible to customers)
4. Click **"Save Notes"**

**Use notes for**:
- Special instructions
- Customer requests
- Issues or concerns
- Follow-up reminders

### Viewing Tracking Information

After adding a tracking number:
- The tracking details appear in a gray box
- Shows tracking number, carrier, and ship date
- **"Track Package"** link opens carrier website
- Customer sees the same information in their account

### Refunds and Cancellations

To cancel an order:
1. Update status to **"Cancelled"**
2. Process refund through your payment processor
3. Add note explaining reason

**Note**: Refund processing is currently manual. The subscription billing automation (coming soon) will handle this automatically.

---

## Customer Management

### Viewing Customers

1. Click **"Customers"** in admin menu
2. View all registered customers
3. See customer order history

### Customer Information

For each customer, you can see:
- Name and email
- Total orders placed
- Total amount spent
- Registration date
- Recent orders

### Customer Communication

**Email**: Click customer email to send them a message
**Orders**: Click to view all orders from that customer

---

## Discount Codes

### Creating Discount Codes

1. Go to **"Discounts"** in admin menu
2. Click **"Create New Discount"**
3. Fill in the details:
   - **Code**: What customers type (e.g., "WELCOME10")
   - **Description**: Internal note about the discount
   - **Type**: Percentage or Fixed Amount
   - **Value**: Amount or percentage off
   - **Minimum Purchase**: Optional minimum order value
   - **Usage Limit**: How many times it can be used
   - **Start Date**: When it becomes active
   - **End Date**: When it expires
4. Click **"Create Discount"**

### Example Discount Codes

**New Customer Welcome**:
- Code: `WELCOME10`
- Type: Percentage
- Value: 10%
- Usage Limit: 1 per customer

**Holiday Sale**:
- Code: `HOLIDAY25`
- Type: Percentage
- Value: 25%
- Start: Dec 1
- End: Dec 31

**Free Shipping**:
- Code: `FREESHIP`
- Type: Fixed Amount
- Value: $10 (typical shipping cost)
- Minimum Purchase: $50

### Managing Existing Discounts

- **Edit**: Click discount to modify details
- **Deactivate**: Turn off without deleting
- **Delete**: Permanently remove (can't be undone)

### Viewing Discount Usage

See how many times each code has been used and total revenue impact.

---

## Blog & Content

### Managing Blog Posts

1. Go to **"Blog"** in admin menu
2. View all published posts

### Creating a Blog Post

1. Click **"New Post"**
2. Fill in:
   - **Title**: Post headline
   - **Slug**: URL-friendly version (auto-generated)
   - **Excerpt**: Short summary
   - **Content**: Full post (supports Markdown)
   - **Featured Image**: Main image URL
   - **Category**: e.g., "Nutrition Tips"
   - **Tags**: Keywords
   - **Status**: Draft or Published
3. Click **"Publish"**

### Editing Blog Posts

1. Click on the post to edit
2. Make your changes
3. Click **"Update"**

**Tip**: Save as "Draft" to preview before publishing.

---

## Case Studies

### Managing Success Stories

1. Go to **"Case Studies"** in admin menu
2. View all case studies

### Creating a Case Study

1. Click **"New Case Study"**
2. Fill in:
   - **Title**: Client name or brief description
   - **Client Name**: Dog owner's name
   - **Dog Name**: The patient's name
   - **Challenge**: What was the problem?
   - **Solution**: How did you help?
   - **Results**: What improved?
   - **Testimonial**: Quote from the client
   - **Image**: Photo of the dog
3. Click **"Publish"**

### Example Case Study

**Title**: "From Itchy to Happy: Bella's Food Sensitivity Journey"
**Dog**: Bella, 3-year-old Golden Retriever
**Challenge**: Chronic itching, digestive issues
**Solution**: Custom elimination diet, fresh food plan
**Results**: Symptoms resolved in 6 weeks
**Testimonial**: "Christie saved Bella's life! She's like a new dog."

---

## Email Notifications

### Automatic Emails Sent by the System

Your website automatically sends these emails:

#### 1. Order Confirmation
- **When**: Customer completes checkout
- **To**: Customer
- **Contains**: Order details, items, total, shipping address

#### 2. Order Shipped
- **When**: You add a tracking number
- **To**: Customer
- **Contains**: Tracking number, carrier, estimated delivery

#### 3. Subscription Created
- **When**: Customer signs up for recurring delivery
- **To**: Customer
- **Contains**: Subscription details, next billing date

#### 4. Newsletter Signup
- **When**: Someone subscribes to your newsletter
- **To**: Subscriber
- **Contains**: Welcome message

### Email Settings

Email configuration is handled through environment variables:
- **From Email**: `noreply@wagginmeals.com`
- **Reply-To**: Your support email
- **Email Service**: Resend (transactional)

---

## Customer Portal

### What Customers Can Do

Your customers have access to:

#### 1. Account Dashboard (`/account`)
- View profile information
- See order history
- Manage subscriptions (coming soon)
- Update payment methods (coming soon)

#### 2. Order History (`/account/orders`)
- View all past orders
- See order status
- Track packages
- Reorder previous purchases

#### 3. Order Details (`/account/orders/[id]`)
- Complete order information
- Tracking details
- Downloadable receipts

### Customer Registration

Customers can create accounts:
1. During checkout (optional)
2. From the login page (`/auth/login`)
3. Via "Create Account" button

**Benefits for customers**:
- Faster checkout
- Order tracking
- Reorder quickly
- Manage subscriptions

---

## Reports & Analytics

### Order Statistics

View key metrics on the admin dashboard:
- **Total Orders**: All time order count
- **Pending Orders**: Orders needing attention
- **Total Revenue**: Lifetime sales
- **Average Order Value**: Revenue / Orders

### Order Reports

Filter orders by:
- Date range
- Status
- Customer
- Product

**Export options** (coming soon):
- CSV download
- Print-friendly reports

### Best Selling Products

See which products are most popular:
- View in Products section
- Sort by units sold
- Track inventory needs

---

## Troubleshooting

### Common Issues & Solutions

#### "I can't log in to the admin panel"

**Check**:
- Are you using the correct URL? `/admin/login`
- Is your username and password correct?
- Try clearing browser cookies
- Make sure CAPS LOCK is off

**Solution**: If you forgot your password, contact your developer to reset it in the environment variables.

---

#### "Orders aren't showing up"

**Check**:
- Are you logged in?
- Check your internet connection
- Try refreshing the page
- Check the order status filters

**Solution**: Orders should appear immediately after checkout. If missing, check the database or contact support.

---

#### "Email notifications aren't sending"

**Check**:
- Is Resend API key configured?
- Check spam/junk folders
- Verify customer email address is correct

**Solution**: Check the server logs for email errors. Verify Resend account is active.

---

#### "Product inventory isn't updating"

**Check**:
- Did you save after making changes?
- Is the product still active?
- Check for duplicate products

**Solution**: Inventory updates automatically when orders are placed. Manual updates require clicking "Save".

---

#### "Customer can't track their package"

**Check**:
- Did you add the tracking number?
- Is the tracking number correct?
- Did you select the right carrier?

**Solution**: Edit the order and verify the tracking number. The tracking link is generated automatically based on the carrier.

---

#### "Discount code isn't working"

**Check**:
- Is the code active?
- Has it expired?
- Has usage limit been reached?
- Does order meet minimum purchase requirement?

**Solution**: Go to Discounts section and verify the code settings. Check start/end dates and usage count.

---

#### "Packing slip won't print"

**Check**:
- Try "Quick Print" option instead of preview
- Check if browser blocked the print dialog
- Try a different browser (Chrome works best)

**Solution**: Click print dropdown → "Quick Print" → allow pop-ups if prompted.

---

### Getting Help

If you encounter issues not covered here:

1. **Check the logs**: Server logs often show error details
2. **Documentation**: Refer to `docs/ORDER_MANAGEMENT_SYSTEM.md` for technical details
3. **Contact developer**: For technical issues or bugs
4. **Database backup**: Regular backups protect your data

---

## Best Practices

### Daily Tasks

- [ ] Check for new orders
- [ ] Process and ship pending orders
- [ ] Respond to customer emails
- [ ] Monitor inventory levels

### Weekly Tasks

- [ ] Review order statistics
- [ ] Check for failed payments
- [ ] Update product descriptions
- [ ] Plan new blog posts

### Monthly Tasks

- [ ] Review and update discount codes
- [ ] Analyze best-selling products
- [ ] Plan new product launches
- [ ] Review customer feedback

---

## Quick Reference

### Important URLs

- **Admin Login**: `/admin/login`
- **Orders**: `/admin/orders`
- **Products**: `/admin/products`
- **Blog**: `/admin/blog`
- **Discounts**: `/admin/discounts`
- **Customer Site**: `/ ` (homepage)
- **Customer Shop**: `/shop`
- **Customer Login**: `/auth/login`

### Keyboard Shortcuts

While in admin panel:
- **Ctrl/Cmd + S**: Save (when editing)
- **Escape**: Close modals
- **Ctrl/Cmd + P**: Print (on order detail)

### Order Status Workflow

```
Pending → Processing → Shipped → Delivered
   ↓          ↓           ↓
Cancelled  Cancelled  Cancelled
   ↓          ↓
Refunded   Refunded
```

---

## What's Coming Next

### Features in Development

1. **Subscription Billing Automation**
   - Automatic recurring charges
   - Failed payment recovery
   - Customer self-service management

2. **Inventory Automation**
   - Low stock alerts
   - Automatic reorder points
   - Supplier integration

3. **Advanced Analytics**
   - Sales trends
   - Customer lifetime value
   - Product performance

4. **Marketing Automation**
   - Abandoned cart recovery
   - Win-back campaigns
   - Product recommendations

5. **Returns & Refunds**
   - Customer return requests
   - Automated refund processing
   - Restocking workflow

---

## Conclusion

You now have complete control over your e-commerce platform! This guide covers the essential features you'll use daily.

**Remember**:
- Customer experience is automated
- Order fulfillment is streamlined
- You have full visibility into your business
- No more Shopify fees!

**Questions?** Refer to the technical documentation in the `docs/` folder or contact your developer.

---

**Last Updated**: January 27, 2025
**Version**: 1.0
