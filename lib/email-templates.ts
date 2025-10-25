interface OrderItem {
  product_name: string;
  variant_title: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface ShippingAddress {
  first_name: string;
  last_name: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

interface OrderEmailData {
  order_number: string;
  customer_first_name: string;
  customer_email: string;
  items: OrderItem[];
  subtotal: number;
  shipping_cost: number;
  tax: number;
  total: number;
  shipping_address: ShippingAddress;
  created_at: string;
}

export function generateOrderConfirmationEmail(order: OrderEmailData): { subject: string; html: string; text: string } {
  const subject = `Order Confirmation #${order.order_number} - Waggin Meals`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333333;
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background-color: #a5b5eb;
      padding: 30px 20px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 28px;
    }
    .content {
      padding: 40px 30px;
    }
    .order-info {
      background-color: #f9f9f9;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 30px;
    }
    .order-number {
      font-size: 24px;
      font-weight: bold;
      color: #a5b5eb;
      margin-bottom: 10px;
    }
    .section-title {
      font-size: 18px;
      font-weight: bold;
      color: #333333;
      margin-top: 30px;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 2px solid #a5b5eb;
    }
    .item {
      display: flex;
      justify-content: space-between;
      padding: 15px 0;
      border-bottom: 1px solid #eeeeee;
    }
    .item:last-child {
      border-bottom: none;
    }
    .item-details {
      flex: 1;
    }
    .item-name {
      font-weight: bold;
      color: #333333;
      margin-bottom: 5px;
    }
    .item-variant {
      color: #666666;
      font-size: 14px;
    }
    .item-quantity {
      color: #999999;
      font-size: 14px;
    }
    .item-price {
      font-weight: bold;
      color: #333333;
      white-space: nowrap;
    }
    .totals {
      background-color: #f9f9f9;
      padding: 20px;
      border-radius: 8px;
      margin-top: 20px;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
    }
    .total-row.grand-total {
      font-size: 20px;
      font-weight: bold;
      padding-top: 15px;
      margin-top: 10px;
      border-top: 2px solid #a5b5eb;
    }
    .address-box {
      background-color: #f9f9f9;
      padding: 20px;
      border-radius: 8px;
      line-height: 1.8;
    }
    .footer {
      background-color: #333333;
      color: #ffffff;
      padding: 30px;
      text-align: center;
      font-size: 14px;
    }
    .footer a {
      color: #a5b5eb;
      text-decoration: none;
    }
    .button {
      display: inline-block;
      padding: 15px 30px;
      background-color: #a5b5eb;
      color: #ffffff;
      text-decoration: none;
      border-radius: 8px;
      font-weight: bold;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🐾 Waggin' Meals</h1>
    </div>

    <div class="content">
      <div class="order-info">
        <div class="order-number">Order #${order.order_number}</div>
        <p style="margin: 0; color: #666666;">
          Thank you for your order, ${order.customer_first_name}! We're excited to help nourish your furry friend.
        </p>
      </div>

      <p>
        Your order has been confirmed and will be processed shortly. You'll receive another email when your items ship.
      </p>

      <div class="section-title">Order Summary</div>
      <div style="margin-bottom: 20px;">
        ${order.items.map(item => `
          <div class="item">
            <div class="item-details">
              <div class="item-name">${item.product_name}</div>
              ${item.variant_title ? `<div class="item-variant">${item.variant_title}</div>` : ''}
              <div class="item-quantity">Quantity: ${item.quantity}</div>
            </div>
            <div class="item-price">$${item.total_price.toFixed(2)}</div>
          </div>
        `).join('')}
      </div>

      <div class="totals">
        <div class="total-row">
          <span>Subtotal:</span>
          <span>$${order.subtotal.toFixed(2)}</span>
        </div>
        <div class="total-row">
          <span>Shipping:</span>
          <span>$${order.shipping_cost.toFixed(2)}</span>
        </div>
        <div class="total-row">
          <span>Tax:</span>
          <span>$${order.tax.toFixed(2)}</span>
        </div>
        <div class="total-row grand-total">
          <span>Total:</span>
          <span>$${order.total.toFixed(2)}</span>
        </div>
      </div>

      <div class="section-title">Shipping Address</div>
      <div class="address-box">
        ${order.shipping_address.first_name} ${order.shipping_address.last_name}<br>
        ${order.shipping_address.address_line1}<br>
        ${order.shipping_address.address_line2 ? `${order.shipping_address.address_line2}<br>` : ''}
        ${order.shipping_address.city}, ${order.shipping_address.state} ${order.shipping_address.postal_code}<br>
        ${order.shipping_address.country}
      </div>

      <div style="text-align: center; margin-top: 30px;">
        <p>Questions about your order?</p>
        <a href="https://wagginmeals.com/contact" class="button">Contact Us</a>
      </div>
    </div>

    <div class="footer">
      <p>
        <strong>Waggin' Meals</strong><br>
        Premium Dog Nutrition<br>
        <a href="https://wagginmeals.com">wagginmeals.com</a>
      </p>
      <p style="margin-top: 20px; font-size: 12px; color: #999999;">
        This is an automated email. Please do not reply directly to this message.
      </p>
    </div>
  </div>
</body>
</html>
  `;

  const text = `
Order Confirmation #${order.order_number} - Waggin Meals

Thank you for your order, ${order.customer_first_name}!

Your order has been confirmed and will be processed shortly. You'll receive another email when your items ship.

ORDER SUMMARY
-------------
${order.items.map(item =>
  `${item.product_name}${item.variant_title ? ` - ${item.variant_title}` : ''}
Quantity: ${item.quantity}
Price: $${item.total_price.toFixed(2)}`
).join('\n\n')}

TOTALS
------
Subtotal: $${order.subtotal.toFixed(2)}
Shipping: $${order.shipping_cost.toFixed(2)}
Tax: $${order.tax.toFixed(2)}
Total: $${order.total.toFixed(2)}

SHIPPING ADDRESS
----------------
${order.shipping_address.first_name} ${order.shipping_address.last_name}
${order.shipping_address.address_line1}
${order.shipping_address.address_line2 ? order.shipping_address.address_line2 + '\n' : ''}${order.shipping_address.city}, ${order.shipping_address.state} ${order.shipping_address.postal_code}
${order.shipping_address.country}

Questions? Visit https://wagginmeals.com/contact

---
Waggin' Meals - Premium Dog Nutrition
https://wagginmeals.com
  `;

  return { subject, html, text };
}

export function generateOrderShippedEmail(order: OrderEmailData & { tracking_number?: string; carrier?: string }): { subject: string; html: string; text: string } {
  const subject = `Your Order #${order.order_number} Has Shipped! 🚚`;

  const trackingInfo = order.tracking_number ? `
    <div class="tracking-box">
      <div style="font-weight: bold; margin-bottom: 10px;">Tracking Information</div>
      <div>Carrier: ${order.carrier || 'USPS'}</div>
      <div>Tracking Number: <strong>${order.tracking_number}</strong></div>
    </div>
  ` : '';

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Shipped</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333333;
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background-color: #a5b5eb;
      padding: 30px 20px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 28px;
    }
    .content {
      padding: 40px 30px;
    }
    .tracking-box {
      background-color: #f0f4ff;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
      border-left: 4px solid #a5b5eb;
    }
    .footer {
      background-color: #333333;
      color: #ffffff;
      padding: 30px;
      text-align: center;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🐾 Order Shipped!</h1>
    </div>

    <div class="content">
      <h2>Great news, ${order.customer_first_name}!</h2>
      <p>
        Your order #${order.order_number} is on its way! Your pup's premium nutrition is headed to your door.
      </p>

      ${trackingInfo}

      <p>
        Your items should arrive within 3-5 business days. If you have any questions, please don't hesitate to contact us.
      </p>

      <div style="text-align: center; margin-top: 30px;">
        <a href="https://wagginmeals.com/contact" style="display: inline-block; padding: 15px 30px; background-color: #a5b5eb; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold;">
          Contact Support
        </a>
      </div>
    </div>

    <div class="footer">
      <p>
        <strong>Waggin' Meals</strong><br>
        Premium Dog Nutrition<br>
        <a href="https://wagginmeals.com" style="color: #a5b5eb; text-decoration: none;">wagginmeals.com</a>
      </p>
    </div>
  </div>
</body>
</html>
  `;

  const text = `
Your Order Has Shipped! 🚚

Great news, ${order.customer_first_name}!

Your order #${order.order_number} is on its way! Your pup's premium nutrition is headed to your door.

${order.tracking_number ? `
TRACKING INFORMATION
--------------------
Carrier: ${order.carrier || 'USPS'}
Tracking Number: ${order.tracking_number}
` : ''}

Your items should arrive within 3-5 business days. If you have any questions, please contact us at https://wagginmeals.com/contact

---
Waggin' Meals - Premium Dog Nutrition
https://wagginmeals.com
  `;

  return { subject, html, text };
}
